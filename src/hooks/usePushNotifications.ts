/**
 * usePushNotifications Hook
 * React hook for managing push notifications
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { pushManager, PushSubscriptionData } from '@/lib/notifications/push-manager';

export interface UsePushNotificationsReturn {
  permission: NotificationPermission;
  isSubscribed: boolean;
  isLoading: boolean;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  showNotification: (title: string, body: string, options?: { data?: unknown }) => Promise<void>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Check subscription status
    const checkSubscription = async () => {
      try {
        await pushManager.initialize();
        const subscription = await pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (error) {
        console.error('Failed to check push subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, []);

  const subscribe = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Request permission first
      const newPermission = await pushManager.requestPermission();
      setPermission(newPermission);

      if (newPermission !== 'granted') {
        return false;
      }

      // Subscribe to push
      const subscription = await pushManager.subscribe();
      if (!subscription) {
        return false;
      }

      // Send subscription to server
      const subscriptionData = pushManager.getSubscriptionData();
      if (subscriptionData) {
        const success = await pushManager.sendSubscriptionToServer(subscriptionData);
        if (success) {
          setIsSubscribed(true);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await pushManager.unsubscribe();
      if (success) {
        setIsSubscribed(false);
        // TODO: Notify server to remove subscription
      }
      return success;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const showNotification = useCallback(
    async (title: string, body: string, options?: { data?: unknown }): Promise<void> => {
      await pushManager.showNotification({
        title,
        body,
        data: options?.data,
      });
    },
    []
  );

  return {
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
    showNotification,
  };
}

