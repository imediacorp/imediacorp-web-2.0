/**
 * Shared Session Hook
 * Manages shared dashboard sessions for collaboration
 */

import { useState, useEffect, useCallback } from 'react';
import { useWebSocket, WebSocketMessage } from './useWebSocket';
import { useCollaborationStore, Session } from '@/store/collaboration';
import { apiClient } from '@/lib/api/client';

export interface UseSharedSessionOptions {
  domain: string;
  sessionId?: string;
  autoJoin?: boolean;
}

export interface UseSharedSessionReturn {
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
  createSession: (name: string, description?: string) => Promise<Session>;
  joinSession: (sessionId: string) => Promise<Session>;
  leaveSession: () => Promise<void>;
  updateSessionState: (state: Record<string, unknown>) => void;
}

export function useSharedSession({
  domain,
  sessionId,
  autoJoin = false,
}: UseSharedSessionOptions): UseSharedSessionReturn {
  const { currentSession, setCurrentSession, updateSessionParticipants } = useCollaborationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { sendMessage, isConnected } = useWebSocket({
    domain,
    enabled: !!sessionId,
    onMessage: (message: WebSocketMessage) => {
      if (message.type === 'session_updated' && message.session_id === sessionId) {
        const participants = (message.payload as { participants?: string[] })?.participants || [];
        // Update participants in store
        if (currentSession) {
          updateSessionParticipants(currentSession.id, participants.map((id) => ({ id })));
        }
      } else if (message.type === 'session_created' && autoJoin) {
        const session = (message.payload as Session) || (message as unknown as Session);
        setCurrentSession(session);
      }
    },
  });

  const createSession = useCallback(
    async (name: string, description?: string): Promise<Session> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.post<Session>('/collaboration/sessions', {
          name,
          domain,
          description,
        });

        const session: Session = {
          id: response.id,
          name: response.name,
          domain: response.domain,
          createdBy: { id: response.created_by },
          createdAt: response.created_at * 1000, // Convert to milliseconds
          participants: response.participants.map((id) => ({ id })),
        };

        setCurrentSession(session);
        return session;
      } catch (e) {
        const err = e instanceof Error ? e : new Error('Failed to create session');
        setError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [domain, setCurrentSession]
  );

  const joinSession = useCallback(
    async (sessionIdToJoin: string): Promise<Session> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.post<Session>(
          `/collaboration/sessions/${sessionIdToJoin}/join`,
          {}
        );

        const session: Session = {
          id: response.id,
          name: response.name,
          domain: response.domain,
          createdBy: { id: response.created_by },
          createdAt: response.created_at * 1000,
          participants: response.participants.map((id) => ({ id })),
        };

        setCurrentSession(session);
        return session;
      } catch (e) {
        const err = e instanceof Error ? e : new Error('Failed to join session');
        setError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setCurrentSession]
  );

  const leaveSession = useCallback(async (): Promise<void> => {
    if (!currentSession) return;

    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post(`/collaboration/sessions/${currentSession.id}/leave`, {});
      setCurrentSession(null);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to leave session');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentSession, setCurrentSession]);

  const updateSessionState = useCallback(
    (state: Record<string, unknown>) => {
      if (!sessionId || !isConnected) return;

      // Broadcast state update via WebSocket
      sendMessage({
        type: 'session_state',
        payload: {
          session_id: sessionId,
          state,
        },
      });
    },
    [sessionId, isConnected, sendMessage]
  );

  // Auto-join session if provided
  useEffect(() => {
    if (autoJoin && sessionId && !currentSession) {
      joinSession(sessionId).catch((e) => {
        console.error('Failed to auto-join session:', e);
      });
    }
  }, [autoJoin, sessionId, currentSession, joinSession]);

  return {
    session: currentSession,
    isLoading,
    error,
    createSession,
    joinSession,
    leaveSession,
    updateSessionState,
  };
}

