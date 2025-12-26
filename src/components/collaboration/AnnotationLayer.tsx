/**
 * Annotation Layer Component
 * Displays and manages shared annotations on the dashboard
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useCollaborationStore } from '@/store/collaboration';
import { useWebSocket, WebSocketMessage } from '@/hooks/useWebSocket';
import { apiClient } from '@/lib/api/client';

export interface AnnotationLayerProps {
  domain: string;
  sessionId?: string;
  containerRef?: React.RefObject<HTMLElement>;
  readOnly?: boolean;
}

export function AnnotationLayer({
  domain,
  sessionId,
  containerRef,
  readOnly = false,
}: AnnotationLayerProps) {
  const { annotations, addAnnotation, updateAnnotation, removeAnnotation } = useCollaborationStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { sendMessage, isConnected } = useWebSocket({
    domain,
    enabled: true,
    onMessage: (message: WebSocketMessage) => {
      if (message.type === 'annotation_created') {
        const annotation = (message.payload as any)?.annotation || (message as any);
        addAnnotation({
          id: annotation.id,
          user: { id: annotation.user_id },
          content: annotation.content,
          position: annotation.position,
          createdAt: annotation.created_at * 1000,
          updatedAt: annotation.updated_at * 1000,
        });
      } else if (message.type === 'annotation_updated') {
        const annotation = (message.payload as any)?.annotation || (message as any);
        updateAnnotation(annotation.id, {
          content: annotation.content,
          position: annotation.position,
        });
      } else if (message.type === 'annotation_deleted') {
        const annotationId = (message.payload as any)?.annotation_id || (message as any).annotation_id;
        removeAnnotation(annotationId);
      }
    },
  });

  // Load existing annotations on mount
  useEffect(() => {
    const loadAnnotations = async () => {
      try {
        const response = await apiClient.get<Array<{
          id: string;
          content: string;
          position: { x: number; y: number };
          user_id: string;
          created_at: number;
          updated_at: number;
        }>>('/annotations', {
          domain,
          session_id: sessionId,
        });

        response.forEach((ann) => {
          addAnnotation({
            id: ann.id,
            user: { id: ann.user_id },
            content: ann.content,
            position: ann.position,
            createdAt: ann.created_at * 1000,
            updatedAt: ann.updated_at * 1000,
          });
        });
      } catch (e) {
        console.error('Failed to load annotations:', e);
      }
    };

    loadAnnotations();
  }, [domain, sessionId, addAnnotation]);

  const handleCreateAnnotation = useCallback(
    async (x: number, y: number, content: string) => {
      if (readOnly || !content.trim()) return;

      try {
        await apiClient.post('/annotations', {
          content,
          position: { x, y },
          session_id: sessionId,
          domain,
        });
      } catch (e) {
        console.error('Failed to create annotation:', e);
      }
    },
    [domain, sessionId, readOnly]
  );

  const handleUpdateAnnotation = useCallback(
    async (id: string, content: string) => {
      if (readOnly || !content.trim()) return;

      try {
        await apiClient.put(`/annotations/${id}`, {
          content,
        });
      } catch (e) {
        console.error('Failed to update annotation:', e);
      } finally {
        setEditingId(null);
      }
    },
    [readOnly]
  );

  const handleDeleteAnnotation = useCallback(
    async (id: string) => {
      if (readOnly) return;

      try {
        await apiClient.delete(`/annotations/${id}`);
      } catch (e) {
        console.error('Failed to delete annotation:', e);
      }
    },
    [readOnly]
  );

  const annotationList = Array.from(annotations.values()).filter(
    (ann) => ann.position && ann.position.x !== undefined && ann.position.y !== undefined
  );

  if (annotationList.length === 0 && !isCreating) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      {annotationList.map((annotation) => (
        <div
          key={annotation.id}
          className="absolute pointer-events-auto"
          style={{
            left: `${annotation.position.x}px`,
            top: `${annotation.position.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {editingId === annotation.id ? (
            <textarea
              className="min-w-[200px] max-w-[300px] p-2 border rounded shadow-lg bg-white"
              defaultValue={annotation.content}
              onBlur={(e) => handleUpdateAnnotation(annotation.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleUpdateAnnotation(annotation.id, e.currentTarget.value);
                } else if (e.key === 'Escape') {
                  setEditingId(null);
                }
              }}
              autoFocus
            />
          ) : (
            <div className="relative group">
              <div className="px-3 py-2 bg-white border rounded shadow-lg max-w-[300px]">
                <div className="text-sm">{annotation.content}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {annotation.user.email || annotation.user.name || annotation.user.id}
                </div>
              </div>
              {!readOnly && (
                <div className="absolute top-0 right-0 -mt-2 -mr-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingId(annotation.id)}
                    className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center hover:bg-blue-600"
                    title="Edit"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDeleteAnnotation(annotation.id)}
                    className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

