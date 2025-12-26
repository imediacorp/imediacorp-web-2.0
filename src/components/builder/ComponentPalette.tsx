/**
 * Component Palette Component
 * List of available components for dashboard builder
 */

'use client';

import React from 'react';
import type { ComponentPaletteItem } from '@/types/dashboard-builder';

interface ComponentPaletteProps {
  components: ComponentPaletteItem[];
  onComponentDrag?: (component: ComponentPaletteItem) => void;
}

const DEFAULT_COMPONENTS: ComponentPaletteItem[] = [
  {
    type: 'MetricsCard',
    name: 'Metrics Card',
    description: 'Display S/Q/U/D metrics',
    category: 'metrics',
    icon: '📊',
    defaultSize: { w: 4, h: 3 },
  },
  {
    type: 'TimeSeriesChart',
    name: 'Time Series Chart',
    description: 'Time series visualization',
    category: 'charts',
    icon: '📈',
    defaultSize: { w: 8, h: 4 },
  },
  {
    type: 'TrendAnalysis',
    name: 'Trend Analysis',
    description: 'Trend analysis component',
    category: 'analysis',
    icon: '📉',
    defaultSize: { w: 6, h: 4 },
  },
  {
    type: 'AIInterpretation',
    name: 'AI Interpretation',
    description: 'AI-generated insights',
    category: 'analysis',
    icon: '🤖',
    defaultSize: { w: 6, h: 3 },
  },
  {
    type: 'MaintenanceRecommendations',
    name: 'Maintenance Recommendations',
    description: 'Actionable maintenance suggestions',
    category: 'recommendations',
    icon: '🔧',
    defaultSize: { w: 6, h: 3 },
  },
  {
    type: 'SummaryCards',
    name: 'Summary Cards',
    description: 'Key performance indicators',
    category: 'metrics',
    icon: '📋',
    defaultSize: { w: 4, h: 2 },
  },
  {
    type: 'FleetManagement',
    name: 'Fleet Management',
    description: 'Multi-asset management view',
    category: 'custom',
    icon: '🚗',
    defaultSize: { w: 8, h: 5 },
  },
];

export function ComponentPalette({
  components = DEFAULT_COMPONENTS,
  onComponentDrag,
}: ComponentPaletteProps) {
  const groupedComponents = React.useMemo(() => {
    const groups: Record<string, ComponentPaletteItem[]> = {};
    components.forEach((component) => {
      if (!groups[component.category]) {
        groups[component.category] = [];
      }
      groups[component.category].push(component);
    });
    return groups;
  }, [components]);

  const handleDragStart = (e: React.DragEvent, component: ComponentPaletteItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
    if (onComponentDrag) {
      onComponentDrag(component);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Components</h3>
      {Object.entries(groupedComponents).map(([category, items]) => (
        <div key={category} className="space-y-2">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {category}
          </h4>
          <div className="space-y-2">
            {items.map((component) => (
              <div
                key={component.type}
                draggable
                onDragStart={(e) => handleDragStart(e, component)}
                className="p-3 border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{component.icon || '📦'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900">
                      {component.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {component.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

