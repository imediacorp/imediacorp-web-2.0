/**
 * Offline Request Queue
 * Queues API requests when offline and syncs when online
 */

import { apiClient } from '../api/client';

export interface QueuedRequest {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
  timestamp: string;
  retries: number;
}

const QUEUE_KEY = 'hdpd-offline-queue';
const MAX_RETRIES = 3;

export class OfflineQueue {
  private queue: QueuedRequest[] = [];
  private isOnline: boolean = true;
  private syncInProgress: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      this.loadQueue();
      this.setupListeners();
      this.setupBackgroundSync();
    }
  }

  private setupBackgroundSync(): void {
    // Register background sync when service worker is ready
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if ('sync' in registration) {
          // Background sync will be handled by service worker
          // This queue will be processed when sync event fires
        }
      });
    }
  }

  private setupListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
      this.queue = [];
    }
  }

  private saveQueue(): void {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  async addRequest(request: Omit<QueuedRequest, 'id' | 'timestamp' | 'retries'>): Promise<string> {
    const id = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const queuedRequest: QueuedRequest = {
      ...request,
      id,
      timestamp: new Date().toISOString(),
      retries: 0,
    };

    this.queue.push(queuedRequest);
    this.saveQueue();

    // Try to process immediately if online
    if (this.isOnline) {
      this.syncQueue();
    }

    return id;
  }

  async syncQueue(): Promise<void> {
    if (this.syncInProgress || !this.isOnline || this.queue.length === 0) {
      return;
    }

    this.syncInProgress = true;

    const requestsToProcess = [...this.queue];
    const successful: string[] = [];
    const failed: QueuedRequest[] = [];

    for (const request of requestsToProcess) {
      try {
        await this.processRequest(request);
        successful.push(request.id);
      } catch (error) {
        console.error(`Failed to process queued request ${request.id}:`, error);
        
        if (request.retries < MAX_RETRIES) {
          request.retries++;
          failed.push(request);
        } else {
          console.warn(`Request ${request.id} exceeded max retries, removing from queue`);
        }
      }
    }

    // Remove successful requests
    this.queue = this.queue.filter((req) => !successful.includes(req.id));
    
    // Update failed requests with new retry count
    for (const failedReq of failed) {
      const index = this.queue.findIndex((req) => req.id === failedReq.id);
      if (index !== -1) {
        this.queue[index] = failedReq;
      }
    }

    this.saveQueue();
    this.syncInProgress = false;

    // Notify about sync completion
    if (successful.length > 0) {
      window.dispatchEvent(
        new CustomEvent('offline-queue-synced', {
          detail: { successful: successful.length, failed: failed.length },
        })
      );
    }
  }

  private async processRequest(request: QueuedRequest): Promise<void> {
    switch (request.method) {
      case 'GET':
        await apiClient.get(request.url, request.params);
        break;
      case 'POST':
        await apiClient.post(request.url, request.data);
        break;
      case 'PUT':
        await apiClient.put(request.url, request.data);
        break;
      case 'DELETE':
        await apiClient.delete(request.url);
        break;
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  clearQueue(): void {
    this.queue = [];
    this.saveQueue();
  }

  getQueue(): QueuedRequest[] {
    return [...this.queue];
  }
}

export const offlineQueue = new OfflineQueue();

