/**
 * Server-Sent Events Hook
 * React hook for SSE connections with automatic reconnection
 */

import { useState, useEffect, useRef, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface SSEEvent {
  type: string;
  session_id?: string;
  timestamp?: number;
  [key: string]: unknown;
}

export interface UseServerSentEventsOptions {
  sessionId: string;
  enabled?: boolean;
  onEvent?: (event: SSEEvent) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export interface UseServerSentEventsReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: Event | null;
  disconnect: () => void;
  reconnect: () => void;
}

export function useServerSentEvents(
  options: UseServerSentEventsOptions
): UseServerSentEventsReturn {
  const {
    sessionId,
    enabled = true,
    onEvent,
    onError,
    onOpen,
    onClose,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Event | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isManualDisconnectRef = useRef(false);

  const streamUrl = `${API_URL}/sse/progress/${sessionId}`;

  const connect = useCallback(() => {
    if (!enabled || eventSourceRef.current?.readyState === EventSource.OPEN) {
      return;
    }

    if (isManualDisconnectRef.current) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const eventSource = new EventSource(streamUrl);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttemptsRef.current = 0;
        onOpen?.();
      };

      // Generic event handler
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as SSEEvent;
          onEvent?.(data);
        } catch (e) {
          console.error('Failed to parse SSE event:', e);
        }
      };

      // Named event handlers
      eventSource.addEventListener('connected', (event) => {
        try {
          const data = JSON.parse(event.data) as SSEEvent;
          onEvent?.({ ...data, type: 'connected' });
        } catch (e) {
          console.error('Failed to parse connected event:', e);
        }
      });

      eventSource.addEventListener('progress', (event) => {
        try {
          const data = JSON.parse(event.data) as SSEEvent;
          onEvent?.({ ...data, type: 'progress' });
        } catch (e) {
          console.error('Failed to parse progress event:', e);
        }
      });

      eventSource.addEventListener('phase', (event) => {
        try {
          const data = JSON.parse(event.data) as SSEEvent;
          onEvent?.({ ...data, type: 'phase' });
        } catch (e) {
          console.error('Failed to parse phase event:', e);
        }
      });

      eventSource.addEventListener('complete', (event) => {
        try {
          const data = JSON.parse(event.data) as SSEEvent;
          onEvent?.({ ...data, type: 'complete' });
        } catch (e) {
          console.error('Failed to parse complete event:', e);
        }
        // Close connection on complete
        disconnect();
      });

      eventSource.onerror = (event) => {
        setError(event);
        setIsConnecting(false);
        setIsConnected(false);

        // EventSource will auto-close on error, attempt reconnection
        if (!isManualDisconnectRef.current) {
          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectAttemptsRef.current += 1;
            const delay = reconnectInterval * Math.pow(2, reconnectAttemptsRef.current - 1); // Exponential backoff

            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, delay);
          } else {
            onError?.(event);
          }
        }
      };
    } catch (e) {
      setError(e as Event);
      setIsConnecting(false);
      onError?.(e as Event);
    }
  }, [enabled, streamUrl, onEvent, onError, onOpen, onClose, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    isManualDisconnectRef.current = true;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    onClose?.();
  }, [onClose]);

  const reconnect = useCallback(() => {
    disconnect();
    isManualDisconnectRef.current = false;
    reconnectAttemptsRef.current = 0;
    connect();
  }, [disconnect, connect]);

  useEffect(() => {
    if (enabled && sessionId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, sessionId, connect, disconnect]);

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
    disconnect,
    reconnect,
  };
}

