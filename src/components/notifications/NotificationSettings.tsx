/**
 * Notification Settings Component
 * User interface for managing push notification preferences
 */

'use client';

import React, { useState } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export function NotificationSettings() {
  const { permission, isSubscribed, isLoading, subscribe, unsubscribe } = usePushNotifications();
  const [localLoading, setLocalLoading] = useState(false);

  const handleToggle = async () => {
    setLocalLoading(true);
    try {
      if (isSubscribed) {
        await unsubscribe();
      } else {
        await subscribe();
      }
    } finally {
      setLocalLoading(false);
    }
  };

  if (permission === 'denied') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          Notifications are blocked. Please enable them in your browser settings.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Push Notifications</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Enable Notifications</p>
            <p className="text-xs text-gray-500 mt-1">
              Receive alerts for critical health scores and maintenance recommendations
            </p>
          </div>
          <button
            onClick={handleToggle}
            disabled={isLoading || localLoading || permission !== 'granted'}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
              transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              ${isSubscribed ? 'bg-primary-600' : 'bg-gray-200'}
              ${isLoading || localLoading || permission !== 'granted' ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            role="switch"
            aria-checked={isSubscribed}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
                transition duration-200 ease-in-out
                ${isSubscribed ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>

        {permission === 'default' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              Click the toggle above to enable push notifications. You'll be asked to grant permission.
            </p>
          </div>
        )}

        {isSubscribed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              ✓ Notifications enabled. You'll receive alerts for critical events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

