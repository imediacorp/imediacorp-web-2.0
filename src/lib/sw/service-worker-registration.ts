/**
 * Service Worker Registration
 * Handles service worker registration and updates
 */

import { Workbox } from 'workbox-window';

let wb: Workbox | null = null;
let updatePrompt: ((skipWaiting: () => void) => void) | null = null;

export interface ServiceWorkerUpdatePrompt {
  onUpdateAvailable: (skipWaiting: () => void) => void;
}

/**
 * Register a callback for handling service worker updates
 * This allows UI components to show custom update prompts
 */
export function setUpdatePrompt(callback: (skipWaiting: () => void) => void): void {
  updatePrompt = callback;
}

export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || 'serviceWorker' in navigator === false) {
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    wb = new Workbox('/sw.js', { type: 'classic' });

    wb.addEventListener('controlling', () => {
      window.location.reload();
    });

    wb.addEventListener('waiting', () => {
      // Show update notification to user
      if (updatePrompt) {
        // Use custom update prompt if available
        updatePrompt(() => {
          wb?.messageSkipWaiting();
        });
      } else {
        // Fallback to default confirm dialog
        if (confirm('A new version of the app is available. Reload to update?')) {
          wb?.messageSkipWaiting();
        }
      }
    });

    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        // Service worker was updated, but not yet controlling the page
        console.log('Service worker updated, reload to activate');
      } else {
        // First time installation
        console.log('Service worker installed');
      }
    });

    wb.addEventListener('externalwaiting', () => {
      // Another tab updated the service worker
      console.log('Service worker updated in another tab');
    });

    wb.register().catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  }
}

export function unregisterServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
    });
  }
}

export function getServiceWorker(): Workbox | null {
  return wb;
}

/**
 * Check if service worker update is available
 */
export async function checkForUpdates(): Promise<boolean> {
  if (!wb) {
    return false;
  }

  try {
    await wb.update();
    return true;
  } catch (error) {
    console.error('Failed to check for updates:', error);
    return false;
  }
}

