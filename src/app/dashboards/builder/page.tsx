/**
 * Dashboard Builder Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { DashboardTemplate } from '@/components/dashboard/template/DashboardTemplate';
import { DashboardSection } from '@/components/dashboard/template/DashboardSection';
import { getConfigForDomain } from '@/lib/dashboard/config';
import { dashboardBuilderApi } from '@/lib/api/dashboard-builder';
import { useSharedSession } from '@/hooks/useSharedSession';
import { PresenceIndicator } from '@/components/collaboration/PresenceIndicator';
import { CursorOverlay } from '@/components/collaboration/CursorOverlay';
import { AnnotationLayer } from '@/components/collaboration/AnnotationLayer';
import { Canvas } from '@/components/builder/Canvas';
import { ComponentPalette } from '@/components/builder/ComponentPalette';
import { ComponentConfigPanel } from '@/components/builder/ComponentConfig';
import type { CustomDashboard, DashboardComponent, ComponentConfig as ComponentConfigType } from '@/types/dashboard-builder';

export default function DashboardBuilder() {
  const config = getConfigForDomain('builder');
  const [dashboards, setDashboards] = useState<CustomDashboard[]>([]);
  const [components, setComponents] = useState<DashboardComponent[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDashboard, setCurrentDashboard] = useState<string | null>(null);
  const [dashboardComponents, setDashboardComponents] = useState<ComponentConfigType[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  // Collaboration session
  const { sessionId, isConnected, activeUsers } = useSharedSession({
    domain: 'builder',
    enabled: !!currentDashboard,
  });

  React.useEffect(() => {
    loadDashboards();
    loadComponents();
  }, []);

  const loadDashboards = async () => {
    setLoading(true);
    try {
      const data = await dashboardBuilderApi.listDashboards();
      setDashboards(data);
    } catch (error) {
      console.error('Failed to load dashboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComponents = async () => {
    try {
      const data = await dashboardBuilderApi.getComponents();
      setComponents(data);
    } catch (error) {
      console.error('Failed to load components:', error);
    }
  };

  return (
    <DashboardTemplate config={config}>
      <DashboardSection title="Custom Dashboard Builder" variant="card">
        <div className="space-y-6">
          <p className="text-gray-600">
            Create custom dashboards by dragging and dropping components onto a canvas.
          </p>

          {/* Collaboration Status */}
          {currentDashboard && (
            <div className="mb-4 flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <PresenceIndicator
                activeUsers={activeUsers}
                sessionId={sessionId || undefined}
              />
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Connected
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">Connecting...</span>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Component Palette */}
            <div className="lg:col-span-1">
              <ComponentPalette
                components={components.map((c) => ({
                  type: c.componentType,
                  name: c.name,
                  description: c.description || '',
                  category: c.category,
                  icon: '📦',
                  defaultSize: { w: 4, h: 3 },
                }))}
              />
            </div>

            {/* Canvas Area */}
            <div className="lg:col-span-2 relative">
              <h3 className="font-semibold mb-4">Dashboard Canvas</h3>
              <div className="relative">
                <Canvas
                  components={dashboardComponents}
                  onComponentAdd={(component) => {
                    setDashboardComponents([...dashboardComponents, component]);
                  }}
                  onComponentUpdate={(id, updates) => {
                    setDashboardComponents(
                      dashboardComponents.map((c) =>
                        c.id === id ? { ...c, ...updates } : c
                      )
                    );
                  }}
                  onComponentDelete={(id) => {
                    setDashboardComponents(
                      dashboardComponents.filter((c) => c.id !== id)
                    );
                    if (selectedComponent === id) {
                      setSelectedComponent(null);
                    }
                  }}
                />
                <CursorOverlay
                  sessionId={sessionId || undefined}
                  activeUsers={activeUsers}
                />
                <AnnotationLayer
                  sessionId={sessionId || undefined}
                  dashboardId={currentDashboard || undefined}
                />
              </div>
            </div>
          </div>

          {/* Component Configuration Panel */}
          {selectedComponent && (
            <div className="mt-6">
              <ComponentConfigPanel
                component={
                  dashboardComponents.find((c) => c.id === selectedComponent) || null
                }
                onUpdate={(updatedComponent) => {
                  if (selectedComponent) {
                    setDashboardComponents(
                      dashboardComponents.map((c) =>
                        c.id === selectedComponent ? updatedComponent : c
                      )
                    );

                    // Broadcast to other collaborators
                    if (isConnected && sessionId) {
                      // This would be handled by useWebSocket hook
                    }
                  }
                }}
              />
            </div>
          )}

          {/* Saved Dashboards */}
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Saved Dashboards</h3>
            {loading ? (
              <p>Loading...</p>
            ) : dashboards.length === 0 ? (
              <p className="text-gray-500">No saved dashboards yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboards.map((dashboard) => (
                  <div
                    key={dashboard.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold">{dashboard.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{dashboard.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardSection>
    </DashboardTemplate>
  );
}

