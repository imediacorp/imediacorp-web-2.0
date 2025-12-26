/**
 * usePWAInstall Hook
 * Detects PWA installability and handles install prompt
 */

'use client';

import { useState, useEffect } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface UsePWAInstallReturn {
  isInstallable: boolean;
  isInstalled: boolean;
  install: () => Promise<boolean>;
  dismissed: boolean;
}

export function usePWAInstall(): UsePWAInstallReturn {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed before
    const dismissedBefore = localStorage.getItem('pwa-install-dismissed');
    if (dismissedBefore) {
      setDismissed(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent default browser install prompt
      e.preventDefault();
      // Store the event so we can show it later when user clicks install
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      console.log('PWA install prompt available - will show custom prompt on user interaction');
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa-install-dismissed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.warn('Install prompt not available - app may already be installed or prompt was dismissed');
      return false;
    }

    try {
      // Show the install prompt (must be called in response to user gesture)
      await deferredPrompt.prompt();
      
      // Wait for user's choice
      const { outcome } = await deferredPrompt.userChoice;

      // Clear the deferred prompt after use
      setDeferredPrompt(null);

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        localStorage.removeItem('pwa-install-dismissed');
        console.log('PWA installation accepted');
        return true;
      } else {
        // User dismissed, remember for 7 days
        setDismissed(true);
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
        console.log('PWA installation dismissed');
        return false;
      }
    } catch (error) {
      console.error('Failed to show install prompt:', error);
      setDeferredPrompt(null);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    install,
    dismissed,
  };
}

