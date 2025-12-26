/**
 * PWA Registration Component
 * Registers service worker and handles PWA lifecycle
 */

'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/sw/service-worker-registration';

export function PWARegistration() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}

