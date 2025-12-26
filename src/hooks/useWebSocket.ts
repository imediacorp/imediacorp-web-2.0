/**
 * WebSocket Hook
 * React hook for WebSocket connections with automatic reconnection and message queuing
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createSupabaseAuthClient } from '@/lib/auth/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface WebSocketMessage {
  type: string;
  domain?: string;
  timestamp?: number;
  payload?: unknown;
  connection_id?: string;
  user_id?: string;
  [key: string]: unknown;
}

export interface UseWebSocketOptions {
  domain: string;
  enabled?: boolean;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export interface UseWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: Event | null;
  sendMessage: (message: WebSocketMessage) => void;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
  disconnect: () => void;
  reconnect: () => void;
}

const QUEUE_KEY_PREFIX = 'ws_message_queue_';

export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const {
    domain,
    enabled = true,
    onMessage,
    onError,
    onOpen,
    onClose,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Event | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueueRef = useRef<WebSocketMessage[]>([]);
  const isManualDisconnectRef = useRef(false);

  const wsUrl = useMemo(() => {
    const url = new URL(`${API_URL.replace(/^http/, 'ws')}/ws/${domain}`);
    // Add auth token if available
    if (typeof window !== 'undefined') {
      try {
        const authClient = createSupabaseAuthClient();
        const token = authClient.getAccessToken();
        if (token) {
          url.searchParams.set('token', token);
        }
      } catch (e) {
        // Ignore auth errors
      }
    }
    return url.toString();
  }, [domain]);

  const sendQueuedMessages = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    while (messageQueueRef.current.length > 0) {
      const message = messageQueueRef.current.shift();
      if (message) {
        try {
          wsRef.current.send(JSON.stringify(message));
        } catch (e) {
          console.error('Failed to send queued message:', e);
          messageQueueRef.current.unshift(message); // Put it back
          break;
        }
      }
    }

    // Clear persisted queue on successful send
    if (typeof window !== 'undefined' && messageQueueRef.current.length === 0) {
      localStorage.removeItem(`${QUEUE_KEY_PREFIX}${domain}`);
    }
  }, [domain]);

  const loadPersistedQueue = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(`${QUEUE_KEY_PREFIX}${domain}`);
      if (stored) {
        const queue = JSON.parse(stored) as WebSocketMessage[];
        messageQueueRef.current = queue;
      }
    } catch (e) {
      console.warn('Failed to load persisted message queue:', e);
    }
  }, [domain]);

  const persistQueue = useCallback(() => {
    if (typeof window === 'undefined' || messageQueueRef.current.length === 0) return;

    try {
      localStorage.setItem(
        `${QUEUE_KEY_PREFIX}${domain}`,
        JSON.stringify(messageQueueRef.current)
      );
    } catch (e) {
      console.warn('Failed to persist message queue:', e);
    }
  }, [domain]);

  const connect = useCallback(() => {
    if (!enabled || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    if (isManualDisconnectRef.current) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttemptsRef.current = 0;
        onOpen?.();
        loadPersistedQueue();
        sendQueuedMessages();
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          
          // Handle pong responses
          if (message.type === 'pong') {
            return;
          }

          onMessage?.(message);
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      ws.onerror = (event) => {
        setError(event);
        setIsConnecting(false);
        onError?.(event);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        onClose?.();

        // Attempt reconnection if not manual disconnect
        if (!isManualDisconnectRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          const delay = reconnectInterval * Math.pow(2, reconnectAttemptsRef.current - 1); // Exponential backoff
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };
    } catch (e) {
      setError(e as Event);
      setIsConnecting(false);
      onError?.(e as Event);
    }
  }, [enabled, wsUrl, onMessage, onError, onOpen, onClose, reconnectInterval, maxReconnectAttempts, loadPersistedQueue, sendQueuedMessages]);

  const disconnect = useCallback(() => {
    isManualDisconnectRef.current = true;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    isManualDisconnectRef.current = false;
    reconnectAttemptsRef.current = 0;
    connect();
  }, [disconnect, connect]);

  const sendMessage = useCallback(
    (message: WebSocketMessage) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(JSON.stringify(message));
        } catch (e) {
          console.error('Failed to send message:', e);
          // Queue message if send fails
          messageQueueRef.current.push(message);
          persistQueue();
        }
      } else {
        // Queue message if not connected
        messageQueueRef.current.push(message);
        persistQueue();
      }
    },
    [persistQueue]
  );

  const subscribe = useCallback(
    (channel: string) => {
      sendMessage({
        type: 'subscribe',
        channel,
        domain,
      });
    },
    [sendMessage, domain]
  );

  const unsubscribe = useCallback(
    (channel: string) => {
      sendMessage({
        type: 'unsubscribe',
        channel,
        domain,
      });
    },
    [sendMessage, domain]
  );

  useEffect(() => {
    if (enabled) {
      loadPersistedQueue();
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect, loadPersistedQueue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    error,
    sendMessage,
    subscribe,
    unsubscribe,
    disconnect,
    reconnect,
  };
}

