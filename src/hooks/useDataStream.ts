/**
 * Data Stream Hook
 * React hook for subscribing to domain-specific data streams via WebSocket
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useWebSocket, WebSocketMessage } from './useWebSocket';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface DataStreamOptions {
  domain: string;
  enabled?: boolean;
  sourceType?: string; // "obd2", "can", "csv", "api", "mock"
  sourcePath?: string; // Port, file path, or API URL
  interval?: number; // Update interval in seconds
  onData?: (data: unknown) => void;
  onError?: (error: Event) => void;
}

export interface DataStreamReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: Event | null;
  data: unknown | null;
  startStream: () => void;
  stopStream: () => void;
  lastUpdate: number | null;
}

export function useDataStream(options: DataStreamOptions): DataStreamReturn {
  const {
    domain,
    enabled = true,
    sourceType,
    sourcePath,
    interval = 1.0,
    onData,
    onError,
  } = options;

  const [data, setData] = useState<unknown | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const streamStartedRef = useRef(false);

  const handleMessage = useCallback(
    (message: WebSocketMessage) => {
      if (message.type === 'data' && message.domain === domain) {
        const payload = message.payload;
        setData(payload);
        setLastUpdate(message.timestamp || Date.now());
        onData?.(payload);
      } else if (message.type === 'stream_started') {
        // Stream started successfully
      } else if (message.type === 'error') {
        const error = new Event('error');
        onError?.(error);
      }
    },
    [domain, onData, onError]
  );

  const { isConnected, isConnecting, error, sendMessage } = useWebSocket({
    domain,
    enabled,
    onMessage: handleMessage,
    onError,
  });

  const startStream = useCallback(() => {
    if (!isConnected || streamStartedRef.current) {
      return;
    }

    sendMessage({
      type: 'start_stream',
      domain,
      payload: {
        source_type: sourceType || 'mock',
        source_path: sourcePath,
        interval,
      },
    });

    streamStartedRef.current = true;
  }, [isConnected, domain, sourceType, sourcePath, interval, sendMessage]);

  const stopStream = useCallback(() => {
    if (!streamStartedRef.current) {
      return;
    }

    sendMessage({
      type: 'stop_stream',
      domain,
    });

    streamStartedRef.current = false;
  }, [domain, sendMessage]);

  // Auto-start stream when connected
  useEffect(() => {
    if (enabled && isConnected && !streamStartedRef.current) {
      startStream();
    }

    return () => {
      if (streamStartedRef.current) {
        stopStream();
      }
    };
  }, [enabled, isConnected, startStream, stopStream]);

  return {
    isConnected,
    isConnecting,
    error,
    data,
    startStream,
    stopStream,
    lastUpdate,
  };
}

