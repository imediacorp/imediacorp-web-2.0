/**
 * Canvas Component
 * Drag-and-drop canvas for dashboard builder
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import type { ComponentConfig, GridPosition } from '@/types/dashboard-builder';

interface CanvasProps {
  components: ComponentConfig[];
  onComponentAdd: (component: ComponentConfig) => void;
  onComponentUpdate: (id: string, updates: Partial<ComponentConfig>) => void;
  onComponentDelete: (id: string) => void;
  gridColumns?: number;
  gridRows?: number;
  sessionId?: string;
}

export function Canvas({
  components,
  onComponentAdd,
  onComponentUpdate,
  onComponentDelete,
  gridColumns = 12,
  gridRows = 20,
  sessionId,
}: CanvasProps) {
  const [draggedOver, setDraggedOver] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [draggingComponent, setDraggingComponent] = useState<string | null>(null);
  const [resizingComponent, setResizingComponent] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);

  // WebSocket for collaboration
  const { isConnected, sendMessage } = useWebSocket({
    domain: 'builder',
    enabled: !!sessionId,
    onMessage: (message) => {
      if (message.type === 'component_add' && message.session_id === sessionId) {
        const component = message.payload as ComponentConfig;
        onComponentAdd(component);
      } else if (message.type === 'component_update' && message.session_id === sessionId) {
        const { id, updates } = message.payload as { id: string; updates: Partial<ComponentConfig> };
        onComponentUpdate(id, updates);
      } else if (message.type === 'component_delete' && message.session_id === sessionId) {
        const { id } = message.payload as { id: string };
        onComponentDelete(id);
      }
    },
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(false);

    try {
      const componentData = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.floor(((e.clientX - rect.left) / rect.width) * gridColumns);
      const y = Math.floor(((e.clientY - rect.top) / rect.height) * gridRows);

      const newComponent: ComponentConfig = {
        id: `component-${Date.now()}`,
        type: componentData.type,
        position: {
          x: Math.max(0, Math.min(x, gridColumns - componentData.defaultSize.w)),
          y: Math.max(0, Math.min(y, gridRows - componentData.defaultSize.h)),
          w: componentData.defaultSize.w,
          h: componentData.defaultSize.h,
        },
        config: {},
      };

      onComponentAdd(newComponent);

      // Broadcast to other collaborators
      if (isConnected && sessionId) {
        sendMessage({
          type: 'component_add',
          domain: 'builder',
          session_id: sessionId,
          payload: newComponent,
        });
      }
    } catch (error) {
      console.error('Failed to parse dropped component:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(true);
  };

  const handleDragLeave = () => {
    setDraggedOver(false);
  };

  const handleComponentDragStart = (e: React.DragEvent, componentId: string) => {
    setDraggingComponent(componentId);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleComponentDragEnd = () => {
    setDraggingComponent(null);
    setDragStart(null);
  };

  const handleComponentDragOver = (e: React.DragEvent, componentId: string) => {
    if (!draggingComponent || draggingComponent !== componentId) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const canvasRect = e.currentTarget.closest('[data-canvas]')?.getBoundingClientRect();
    if (!canvasRect) return;
    
    const x = Math.floor(((e.clientX - canvasRect.left) / canvasRect.width) * gridColumns);
    const y = Math.floor(((e.clientY - canvasRect.top) / canvasRect.height) * gridRows);
    
    const component = components.find((c) => c.id === componentId);
    if (component) {
      const newX = Math.max(0, Math.min(x, gridColumns - component.position.w));
      const newY = Math.max(0, Math.min(y, gridRows - component.position.h));
      
      if (newX !== component.position.x || newY !== component.position.y) {
        onComponentUpdate(componentId, {
          position: {
            ...component.position,
            x: newX,
            y: newY,
          },
        });
      }
    }
  };

  const handleResizeStart = (e: React.MouseEvent, componentId: string, handle: string) => {
    e.stopPropagation();
    setResizingComponent(componentId);
    setResizeHandle(handle);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingComponent || !resizeHandle || !dragStart) return;
      
      const component = components.find((c) => c.id === resizingComponent);
      if (!component) return;
      
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      // Calculate grid units (approximate based on canvas size)
      const gridUnitWidth = window.innerWidth / gridColumns;
      const gridUnitHeight = window.innerHeight / gridRows;
      const deltaGridX = Math.round(deltaX / gridUnitWidth);
      const deltaGridY = Math.round(deltaY / gridUnitHeight);
      
      let newW = component.position.w;
      let newH = component.position.h;
      let newX = component.position.x;
      let newY = component.position.y;
      
      if (resizeHandle.includes('e')) {
        // East (right)
        newW = Math.max(1, Math.min(component.position.w + deltaGridX, gridColumns - component.position.x));
      }
      if (resizeHandle.includes('w')) {
        // West (left)
        const widthChange = Math.max(-component.position.w + 1, Math.min(deltaGridX, component.position.x));
        newW = component.position.w - widthChange;
        newX = component.position.x + widthChange;
      }
      if (resizeHandle.includes('s')) {
        // South (bottom)
        newH = Math.max(1, Math.min(component.position.h + deltaGridY, gridRows - component.position.y));
      }
      if (resizeHandle.includes('n')) {
        // North (top)
        const heightChange = Math.max(-component.position.h + 1, Math.min(deltaGridY, component.position.y));
        newH = component.position.h - heightChange;
        newY = component.position.y + heightChange;
      }
      
      // Constrain to grid bounds
      newX = Math.max(0, Math.min(newX, gridColumns - newW));
      newY = Math.max(0, Math.min(newY, gridRows - newH));
      
      if (newW !== component.position.w || newH !== component.position.h || 
          newX !== component.position.x || newY !== component.position.y) {
        onComponentUpdate(resizingComponent, {
          position: {
            x: newX,
            y: newY,
            w: newW,
            h: newH,
          },
        });
      }
      
      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setResizingComponent(null);
      setResizeHandle(null);
      setDragStart(null);
    };

    if (resizingComponent) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [resizingComponent, resizeHandle, dragStart, components, onComponentUpdate, gridColumns, gridRows]);

  return (
    <div
      data-canvas
      className={`
        relative border-2 rounded-lg min-h-[600px] bg-gray-50
        ${draggedOver ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'}
        transition-colors
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
        gridTemplateRows: `repeat(${gridRows}, minmax(20px, 1fr))`,
        gap: '8px',
        padding: '16px',
      }}
    >
      {components.map((component) => {
        const isSelected = selectedComponent === component.id;
        const isDragging = draggingComponent === component.id;
        
        return (
          <div
            key={component.id}
            draggable
            onDragStart={(e) => handleComponentDragStart(e, component.id)}
            onDragEnd={handleComponentDragEnd}
            onDragOver={(e) => handleComponentDragOver(e, component.id)}
            className={`
              bg-white border-2 rounded-lg p-2 cursor-move relative
              ${isSelected
                ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
              }
              ${isDragging ? 'opacity-50' : ''}
              transition-all
            `}
            style={{
              gridColumn: `${component.position.x + 1} / span ${component.position.w}`,
              gridRow: `${component.position.y + 1} / span ${component.position.h}`,
            }}
            onClick={() => {
              setSelectedComponent(component.id);
              // Broadcast cursor position for collaboration
              if (isConnected && sessionId) {
                sendMessage({
                  type: 'cursor',
                  domain: 'builder',
                  session_id: sessionId,
                  payload: {
                    component_id: component.id,
                    position: { x: component.position.x, y: component.position.y },
                  },
                });
              }
            }}
          >
            {/* Resize handles - only show when selected */}
            {isSelected && (
              <>
                {/* Corner handles */}
                <div
                  className="absolute top-0 left-0 w-3 h-3 bg-blue-500 border border-blue-700 cursor-nwse-resize z-10"
                  onMouseDown={(e) => handleResizeStart(e, component.id, 'nw')}
                />
                <div
                  className="absolute top-0 right-0 w-3 h-3 bg-blue-500 border border-blue-700 cursor-nesw-resize z-10"
                  onMouseDown={(e) => handleResizeStart(e, component.id, 'ne')}
                />
                <div
                  className="absolute bottom-0 left-0 w-3 h-3 bg-blue-500 border border-blue-700 cursor-nesw-resize z-10"
                  onMouseDown={(e) => handleResizeStart(e, component.id, 'sw')}
                />
                <div
                  className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 border border-blue-700 cursor-nwse-resize z-10"
                  onMouseDown={(e) => handleResizeStart(e, component.id, 'se')}
                />
                {/* Edge handles */}
                <div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-blue-500 border border-blue-700 cursor-ns-resize z-10"
                  onMouseDown={(e) => handleResizeStart(e, component.id, 'n')}
                />
                <div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-blue-500 border border-blue-700 cursor-ns-resize z-10"
                  onMouseDown={(e) => handleResizeStart(e, component.id, 's')}
                />
                <div
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-8 bg-blue-500 border border-blue-700 cursor-ew-resize z-10"
                  onMouseDown={(e) => handleResizeStart(e, component.id, 'w')}
                />
                <div
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-8 bg-blue-500 border border-blue-700 cursor-ew-resize z-10"
                  onMouseDown={(e) => handleResizeStart(e, component.id, 'e')}
                />
              </>
            )}
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">{component.type}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onComponentDelete(component.id);

                  // Broadcast to other collaborators
                  if (isConnected && sessionId) {
                    sendMessage({
                      type: 'component_delete',
                      domain: 'builder',
                      session_id: sessionId,
                      payload: { id: component.id },
                    });
                  }
                }}
                className="text-red-500 hover:text-red-700 text-xs z-10"
              >
                ×
              </button>
            </div>
            <div className="text-xs text-gray-400 text-center">
              {component.type} Component
            </div>
          </div>
        );
      })}

      {components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-lg mb-2">Drop components here</p>
            <p className="text-sm">Drag components from the palette to build your dashboard</p>
          </div>
        </div>
      )}
    </div>
  );
}

