/**
 * Dashboard Factory
 * Factory functions for creating dashboard components with consistent structure
 */

import React from 'react';
import { DashboardTemplate } from '@/components/dashboard/template/DashboardTemplate';
import { DashboardSection } from '@/components/dashboard/template/DashboardSection';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { AIInterpretationCard } from '@/components/dashboard/AIInterpretation';
import { MaintenanceRecommendations } from '@/components/dashboard/MaintenanceRecommendations';
import { TimeSeriesChart } from '@/components/dashboard/TimeSeriesChart';
import type {
  DashboardConfig,
  DashboardSections,
  DashboardAction,
  MetricsSummary,
  AIInterpretationData,
  MaintenanceRecommendation,
  ChartConfig,
} from '@/types/dashboard';

/**
 * Create a dashboard with standard structure
 */
export interface CreateDashboardOptions {
  config: DashboardConfig;
  sections?: DashboardSections;
  actions?: DashboardAction[];
  metrics?: MetricsSummary;
  aiInterpretation?: AIInterpretationData | string | null;
  maintenanceRecommendations?: MaintenanceRecommendation[];
  charts?: ChartConfig[];
  telemetryData?: Record<string, unknown>;
  customContent?: React.ReactNode;
}

export function createDashboard(options: CreateDashboardOptions) {
  const {
    config,
    sections = {
      header: true,
      metrics: true,
      telemetry: true,
      charts: true,
      aiInterpretation: true,
      maintenance: true,
    },
    actions = [],
    metrics,
    aiInterpretation,
    maintenanceRecommendations = [],
    charts = [],
    telemetryData,
    customContent,
  } = options;

  return function Dashboard() {
    return (
      <DashboardTemplate config={config} sections={sections} actions={actions}>
        {/* Metrics Section */}
        {sections.metrics && metrics && (
          <MetricsCard
            squd={metrics.squd}
            health={metrics.health}
            title="Health Assessment (CHADD/HDPD Framework)"
          />
        )}

        {/* Performance Metrics */}
        {sections.metrics && metrics?.performanceMetrics && (
          <DashboardSection title="Performance Metrics" variant="card">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(metrics.performanceMetrics).map(([key, value]) => (
                <div key={key}>
                  <div className="text-sm text-gray-500 capitalize">
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div className="text-2xl font-semibold">{value}</div>
                </div>
              ))}
            </div>
          </DashboardSection>
        )}

        {/* Telemetry Display */}
        {sections.telemetry && telemetryData && (
          <DashboardSection title="Current Telemetry" variant="card">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(telemetryData).map(([key, value]) => (
                <div key={key}>
                  <div className="text-sm text-gray-500 capitalize">
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div className="text-2xl font-semibold">
                    {typeof value === 'number' ? value.toFixed(1) : String(value)}
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>
        )}

        {/* Charts Section */}
        {sections.charts && charts.length > 0 && (
          <DashboardSection title="Analysis - Time Series" variant="card">
            <div className="space-y-6">
              {/* Charts would be rendered here with actual data */}
              <p className="text-gray-500 text-sm">
                Chart rendering requires time-series data. Implement chart rendering in your dashboard component.
              </p>
            </div>
          </DashboardSection>
        )}

        {/* AI Interpretation */}
        {sections.aiInterpretation && (
          <AIInterpretationCard
            interpretation={aiInterpretation}
            loading={false}
            error={null}
          />
        )}

        {/* Maintenance Recommendations */}
        {sections.maintenance && maintenanceRecommendations.length > 0 && (
          <MaintenanceRecommendations
            recommendations={maintenanceRecommendations}
            componentHealth={metrics?.componentHealth}
          />
        )}

        {/* Custom Content */}
        {customContent}
      </DashboardTemplate>
    );
  };
}

