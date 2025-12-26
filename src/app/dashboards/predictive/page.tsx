/**
 * Predictive Modeling Dashboard Page
 */

'use client';

import React, { useState } from 'react';
import { DashboardTemplate } from '@/components/dashboard/template/DashboardTemplate';
import { DashboardSection } from '@/components/dashboard/template/DashboardSection';
import { getConfigForDomain } from '@/lib/dashboard/config';
import { predictiveApi } from '@/lib/api/predictive';
import type { PredictiveModel, ModelType } from '@/types/predictive';

export default function PredictiveDashboard() {
  const config = getConfigForDomain('predictive');
  const [models, setModels] = useState<PredictiveModel[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    setLoading(true);
    try {
      const data = await predictiveApi.listModels();
      setModels(data);
    } catch (error) {
      console.error('Failed to load models:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardTemplate config={config}>
      <DashboardSection title="Predictive Modeling" variant="card">
        <div className="space-y-6">
          <p className="text-gray-600">
            Create and manage predictive models for forecasting, anomaly detection, and failure prediction.
          </p>

          {loading ? (
            <p>Loading models...</p>
          ) : (
            <div className="space-y-4">
              {models.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No models yet. Create your first predictive model.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {models.map((model) => (
                    <div
                      key={model.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-lg">{model.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{model.description}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {model.modelType}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                          {model.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DashboardSection>
    </DashboardTemplate>
  );
}

