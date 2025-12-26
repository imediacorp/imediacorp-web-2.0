/**
 * Cursor Overlay Component
 * Displays remote user cursors on the dashboard
 */

'use client';

import { useEffect, useRef } from 'react';
import { useCollaborationStore } from '@/store/collaboration';
import { useWebSocket, WebSocketMessage } from '@/hooks/useWebSocket';

export interface CursorOverlayProps {
  domain: string;
  containerRef?: React.RefObject<HTMLElement>;
}

export function CursorOverlay({ domain, containerRef }: CursorOverlayProps) {
  const { userCursors, updateUserCursor, removeUserCursor } = useCollaborationStore();
  const throttledSendRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCursorPositionRef = useRef<{ x: number; y: number } | null>(null);

  const { sendMessage, isConnected } = useWebSocket({
    domain,
    enabled: true,
    onMessage: (message: WebSocketMessage) => {
      if (message.type === 'cursor') {
        const userId = message.user_id as string;
        const payload = message.payload as { x?: number; y?: number } || {};
        const user = {
          id: userId,
          email: `user-${userId}@example.com`, // Placeholder - should come from message
        };

        if (payload.x !== undefined && payload.y !== undefined) {
          updateUserCursor(userId, {
            x: payload.x,
            y: payload.y,
            timestamp: (message.timestamp as number) || Date.now(),
          }, user);
        }
      }
    },
  });

  // Handle mouse movement and send cursor updates (throttled)
  useEffect(() => {
    if (!isConnected || !containerRef?.current) return;

    const container = containerRef.current;
    let lastSendTime = 0;
    const throttleMs = 50; // Send max 20 updates per second

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Throttle cursor updates
      const now = Date.now();
      if (now - lastSendTime < throttleMs) {
        return;
      }
      lastSendTime = now;

      // Only send if position changed significantly
      const lastPos = lastCursorPositionRef.current;
      if (
        lastPos &&
        Math.abs(lastPos.x - x) < 5 &&
        Math.abs(lastPos.y - y) < 5
      ) {
        return;
      }

      lastCursorPositionRef.current = { x, y };

      sendMessage({
        type: 'cursor',
        payload: { x, y },
      });
    };

    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isConnected, containerRef, sendMessage]);

  // Clean up cursors for disconnected users
  useEffect(() => {
    const timeout = 3000; // Remove cursor if not updated for 3 seconds

    const checkStaleCursors = () => {
      const now = Date.now();
      userCursors.forEach((cursor, userId) => {
        if (now - cursor.position.timestamp > timeout) {
          removeUserCursor(userId);
        }
      });
    };

    const interval = setInterval(checkStaleCursors, 1000);
    return () => clearInterval(interval);
  }, [userCursors, removeUserCursor]);

  const cursors = Array.from(userCursors.values());

  if (cursors.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {cursors.map((cursor) => (
        <div
          key={cursor.user.id}
          className="absolute transition-all duration-75 ease-linear"
          style={{
            left: `${cursor.position.x}px`,
            top: `${cursor.position.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Cursor SVG */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: cursor.color }}
          >
            <path
              d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
              fill={cursor.color}
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          {/* User label */}
          <div
            className="absolute top-6 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs text-white whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.user.email || cursor.user.name || cursor.user.id}
          </div>
        </div>
      ))}
    </div>
  );
}

