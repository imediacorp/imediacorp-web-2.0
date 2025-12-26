/**
 * Presence Indicator Component
 * Displays active users in the current dashboard/session
 */

'use client';

import { useEffect } from 'react';
import { useCollaborationStore, User } from '@/store/collaboration';
import { useWebSocket, WebSocketMessage } from '@/hooks/useWebSocket';

export interface PresenceIndicatorProps {
  domain: string;
  currentUser?: User;
  className?: string;
}

export function PresenceIndicator({ domain, currentUser, className = '' }: PresenceIndicatorProps) {
  const { activeUsers, addActiveUser, removeActiveUser } = useCollaborationStore();

  const { isConnected, sendMessage } = useWebSocket({
    domain,
    enabled: true,
    onMessage: (message: WebSocketMessage) => {
      if (message.type === 'presence') {
        const activeUserIds = message.payload as string[] || [];
        // Update presence from server
        activeUserIds.forEach((userId) => {
          // We need user info, but server only sends IDs
          // In a real implementation, you'd fetch user details or have them in the message
          if (!activeUsers.has(userId)) {
            addActiveUser({
              id: userId,
              email: `user-${userId}@example.com`, // Placeholder
            });
          }
        });
        
        // Remove users not in the list
        activeUsers.forEach((user) => {
          if (!activeUserIds.includes(user.id)) {
            removeActiveUser(user.id);
          }
        });
      }
    },
  });

  // Send heartbeat periodically
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      sendMessage({ type: 'heartbeat' });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [isConnected, sendMessage]);

  const users = Array.from(activeUsers.values());

  if (users.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600">Active:</span>
      <div className="flex -space-x-2">
        {users.slice(0, 5).map((user) => (
          <div
            key={user.id}
            className="relative w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-700"
            title={user.email || user.name || user.id}
          >
            {(user.name || user.email || user.id)?.charAt(0).toUpperCase()}
          </div>
        ))}
        {users.length > 5 && (
          <div className="relative w-8 h-8 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-xs font-medium text-white">
            +{users.length - 5}
          </div>
        )}
      </div>
    </div>
  );
}

