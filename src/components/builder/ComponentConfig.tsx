/**
 * Component Configuration Panel
 * Panel for configuring selected component properties
 */

'use client';

import React from 'react';
import type { ComponentConfig } from '@/types/dashboard-builder';

interface ComponentConfigProps {
  component: ComponentConfig | null;
  onUpdate: (config: ComponentConfig) => void;
  onClose?: () => void;
}

export function ComponentConfigPanel({ component, onUpdate, onClose }: ComponentConfigProps) {
  if (!component) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Select a component to configure</p>
      </div>
    );
  }

  const updatePosition = (field: 'x' | 'y' | 'w' | 'h', value: number) => {
    onUpdate({
      ...component,
      position: {
        ...component.position,
        [field]: value,
      },
    });
  };

  const updateConfig = (updates: Record<string, unknown>) => {
    onUpdate({
      ...component,
      config: {
        ...component.config,
        ...updates,
      },
    });
  };

  return (
    <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Component Configuration</h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Component Type</label>
        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">{component.type}</div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Position & Size</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">X</label>
            <input
              type="number"
              min="0"
              value={component.position.x}
              onChange={(e) => updatePosition('x', parseInt(e.target.value, 10))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Y</label>
            <input
              type="number"
              min="0"
              value={component.position.y}
              onChange={(e) => updatePosition('y', parseInt(e.target.value, 10))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Width</label>
            <input
              type="number"
              min="1"
              value={component.position.w}
              onChange={(e) => updatePosition('w', parseInt(e.target.value, 10))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Height</label>
            <input
              type="number"
              min="1"
              value={component.position.h}
              onChange={(e) => updatePosition('h', parseInt(e.target.value, 10))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={(component.config.title as string) || ''}
          onChange={(e) => updateConfig({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Component title"
        />
      </div>

      {component.type === 'TimeSeriesChart' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Source</label>
          <select
            value={(component.dataSource?.source as string) || ''}
            onChange={(e) =>
              updateConfig({
                dataSource: {
                  ...component.dataSource,
                  type: 'domain',
                  source: e.target.value,
                },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select data source</option>
            <option value="gas-vehicle">Gas Vehicle</option>
            <option value="electric-vehicle">Electric Vehicle</option>
            <option value="medical">Medical</option>
            <option value="business">Business</option>
            <option value="grid">Grid</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Config (JSON)
        </label>
        <textarea
          value={JSON.stringify(component.config, null, 2)}
          onChange={(e) => {
            try {
              const config = JSON.parse(e.target.value);
              onUpdate({ ...component, config });
            } catch {
              // Invalid JSON, ignore
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
          rows={6}
        />
      </div>
    </div>
  );
}

