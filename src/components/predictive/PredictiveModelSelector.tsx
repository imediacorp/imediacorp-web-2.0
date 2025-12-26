/**
 * Predictive Model Selector Component
 * Component for selecting and configuring predictive model types
 */

'use client';

import React from 'react';
import type { ModelType } from '@/types/predictive';

interface PredictiveModelSelectorProps {
  selectedType: ModelType | null;
  onTypeSelect: (type: ModelType) => void;
  disabled?: boolean;
}

const MODEL_TYPES: Array<{
  type: ModelType;
  name: string;
  description: string;
  icon: string;
}> = [
  {
    type: 'forecast',
    name: 'Time-Series Forecasting',
    description: 'Predict future values based on historical trends',
    icon: '📈',
  },
  {
    type: 'anomaly',
    name: 'Anomaly Detection',
    description: 'Identify unusual patterns and outliers',
    icon: '⚠️',
  },
  {
    type: 'failure',
    name: 'Failure Prediction',
    description: 'Predict equipment failures and maintenance needs',
    icon: '🔧',
  },
  {
    type: 'health_score',
    name: 'Health Score Prediction',
    description: 'Predict system health scores over time',
    icon: '💚',
  },
];

export function PredictiveModelSelector({
  selectedType,
  onTypeSelect,
  disabled = false,
}: PredictiveModelSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-gray-700">Model Type</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MODEL_TYPES.map((model) => {
          const isSelected = selectedType === model.type;
          return (
            <button
              key={model.type}
              type="button"
              onClick={() => !disabled && onTypeSelect(model.type)}
              disabled={disabled}
              className={`
                p-4 rounded-lg border-2 transition-all text-left
                ${isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{model.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{model.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{model.description}</div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

