/**
 * CHADD2 Bridge Overlay Component
 * Provides controls for CHADD2 model selection and Fibonacci overlay
 */

'use client';

import React, { useState, useEffect } from 'react';
import { NumberInput } from './NumberInput';
import type { CHADD2OverlayConfig } from '@/types/dashboard';

export interface CHADD2OverlayProps {
  config?: CHADD2OverlayConfig;
  onConfigChange?: (config: CHADD2OverlayConfig) => void;
  className?: string;
}

export function CHADD2Overlay({
  config = {},
  onConfigChange,
  className = '',
}: CHADD2OverlayProps) {
  // Initialize with proper defaults
  const getInitialConfig = (): CHADD2OverlayConfig => ({
    enabled: config?.enabled ?? false,
    modelType: config?.modelType ?? 'auto',
    fibonacciOverlay: config?.fibonacciOverlay ?? false,
    lambdaFib: config?.lambdaFib ?? 0.0,
    wPhi: config?.wPhi ?? 0.0,
  });

  const [localConfig, setLocalConfig] = useState<CHADD2OverlayConfig>(getInitialConfig);


  // Sync local state with prop changes
  useEffect(() => {
    const newConfig = getInitialConfig();
    // Always update to ensure we're in sync with parent
    setLocalConfig((prevConfig) => {
      // Check if anything actually changed
      const hasChanged = 
        newConfig.enabled !== prevConfig.enabled ||
        newConfig.modelType !== prevConfig.modelType ||
        newConfig.fibonacciOverlay !== prevConfig.fibonacciOverlay ||
        Math.abs((newConfig.lambdaFib ?? 0) - (prevConfig.lambdaFib ?? 0)) > 0.001 ||
        Math.abs((newConfig.wPhi ?? 0) - (prevConfig.wPhi ?? 0)) > 0.001;
      
      if (hasChanged) {
        return newConfig;
      }
      return prevConfig;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.enabled, config?.modelType, config?.fibonacciOverlay, config?.lambdaFib, config?.wPhi]);

  const handleChange = (updates: Partial<CHADD2OverlayConfig>) => {
    const newConfig = { ...localConfig, ...updates };
    setLocalConfig(newConfig);
    if (onConfigChange) {
      onConfigChange(newConfig);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">CHADD2 Bridge Overlay</h3>
          <p className="text-sm text-gray-600 mt-1">
            Configure CHADD2 model selection and Fibonacci recovery overlay
          </p>
        </div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={localConfig.enabled ?? false}
            onChange={(e) => handleChange({ enabled: e.target.checked })}
            className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500 cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          />
          <span className="ml-2 text-sm text-gray-700">Enable CHADD2</span>
        </label>
      </div>

      {localConfig.enabled && (
        <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
          {/* Model Type Selection */}
          <div>
            <label htmlFor="chadd2-model-type" className="block text-sm font-medium text-gray-700 mb-2">
              Model Type
            </label>
            <select
              id="chadd2-model-type"
              value={localConfig.modelType ?? 'auto'}
              onChange={(e) => {
                const newValue = e.target.value as 'auto' | 'original' | 'updated';
                handleChange({ modelType: newValue });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 cursor-pointer"
              style={{ pointerEvents: 'auto', zIndex: 10 }}
            >
              <option value="auto">Auto (prefer Updated, fallback to Original)</option>
              <option value="updated">Updated (with Dissonance tracking)</option>
              <option value="original">Original Model</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              The Updated model includes D_graph (dissonance tracking) capabilities
            </p>
          </div>

          {/* Fibonacci Overlay */}
          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localConfig.fibonacciOverlay ?? false}
                onChange={(e) => handleChange({ fibonacciOverlay: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500 cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Enable Fibonacci Recovery Overlay
              </span>
            </label>
            <p className="mt-1 text-xs text-gray-500 ml-6">
              Visualize potential recovery patterns using Fibonacci ratios
            </p>
          </div>

          {localConfig.fibonacciOverlay && (
            <div className="ml-6 space-y-3 p-3 bg-gray-50 rounded border border-gray-200">
              <div>
                <NumberInput
                  value={localConfig.lambdaFib ?? 0.0}
                  onChange={(value) => handleChange({ lambdaFib: value })}
                  min={0}
                  max={1}
                  step={0.01}
                  label="Lambda Fibonacci (λ_fib)"
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Controls the strength of Fibonacci recovery influence (0.0 = off, 1.0 = maximum)
                </p>
              </div>

              <div>
                <NumberInput
                  value={localConfig.wPhi ?? 0.0}
                  onChange={(value) => handleChange({ wPhi: value })}
                  min={0}
                  max={1}
                  step={0.01}
                  label="W Phi (φ weight)"
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Additional weight for golden ratio (φ) augmentation
                </p>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <strong>Note:</strong> CHADD2 bridge automatically falls back to legacy models if 
              CHADD2 modules are unavailable. The system remains fully functional.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

