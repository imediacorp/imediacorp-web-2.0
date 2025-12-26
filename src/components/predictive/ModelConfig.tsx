/**
 * Model Configuration Component
 * Component for configuring predictive model parameters
 */

'use client';

import React from 'react';
import type { ModelConfiguration, ModelType } from '@/types/predictive';

interface ModelConfigProps {
  modelType: ModelType;
  config: ModelConfiguration;
  onConfigChange: (config: ModelConfiguration) => void;
}

export function ModelConfig({ modelType, config, onConfigChange }: ModelConfigProps) {
  const updateConfig = (updates: Partial<ModelConfiguration>) => {
    onConfigChange({ ...config, ...updates });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Model Configuration</h3>

      {modelType === 'forecast' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Forecast Horizon (periods)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={config.horizon || 7}
              onChange={(e) => updateConfig({ horizon: parseInt(e.target.value, 10) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.seasonality ?? false}
                onChange={(e) => updateConfig({ seasonality: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Include Seasonality</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.trend ?? true}
                onChange={(e) => updateConfig({ trend: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Include Trend</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Algorithm
            </label>
            <select
              value={config.algorithm || 'ARIMA'}
              onChange={(e) => updateConfig({ algorithm: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="ARIMA">ARIMA</option>
              <option value="Prophet">Prophet</option>
              <option value="LSTM">LSTM</option>
              <option value="ExponentialSmoothing">Exponential Smoothing</option>
            </select>
          </div>
        </div>
      )}

      {modelType === 'anomaly' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Anomaly Threshold
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={config.threshold || 0.5}
              onChange={(e) => updateConfig({ threshold: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              Values above this threshold will be flagged as anomalies
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Contamination (0-1)
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={config.contamination || 0.1}
              onChange={(e) => updateConfig({ contamination: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              Expected proportion of anomalies in the data
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Algorithm
            </label>
            <select
              value={config.algorithm || 'IsolationForest'}
              onChange={(e) => updateConfig({ algorithm: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="IsolationForest">Isolation Forest</option>
              <option value="LSTMAutoencoder">LSTM Autoencoder</option>
              <option value="OneClassSVM">One-Class SVM</option>
            </select>
          </div>
        </div>
      )}

      {modelType === 'failure' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Classification Threshold
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={config.classificationThreshold || 0.5}
              onChange={(e) =>
                updateConfig({ classificationThreshold: parseFloat(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.timeToFailure ?? false}
              onChange={(e) => updateConfig({ timeToFailure: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Predict Time to Failure</span>
          </label>
        </div>
      )}

      {modelType === 'health_score' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Algorithm
            </label>
            <select
              value={config.algorithm || 'LinearRegression'}
              onChange={(e) => updateConfig({ algorithm: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="LinearRegression">Linear Regression</option>
              <option value="RandomForest">Random Forest</option>
              <option value="XGBoost">XGBoost</option>
              <option value="NeuralNetwork">Neural Network</option>
            </select>
          </div>
        </div>
      )}

      {/* Additional parameters */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Parameters (JSON)
        </label>
        <textarea
          value={JSON.stringify(config.parameters || {}, null, 2)}
          onChange={(e) => {
            try {
              const params = JSON.parse(e.target.value);
              updateConfig({ parameters: params });
            } catch {
              // Invalid JSON, ignore
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
          rows={4}
        />
      </div>
    </div>
  );
}

