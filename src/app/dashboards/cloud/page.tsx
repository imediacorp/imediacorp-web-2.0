/**
 * Cloud Platform Dashboard Page
 * Comprehensive dashboard using template system with domain-specific terminology
 */

'use client';

import React, { useState } from 'react';
import { DashboardTemplate } from '@/components/dashboard/template/DashboardTemplate';
import { DashboardSection } from '@/components/dashboard/template/DashboardSection';
import { DashboardGrid } from '@/components/dashboard/template/DashboardSection';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { TimeSeriesChart } from '@/components/dashboard/TimeSeriesChart';
import { AIInterpretationCard } from '@/components/dashboard/AIInterpretation';
import { MaintenanceRecommendations } from '@/components/dashboard/MaintenanceRecommendations';
import { getConfigForDomain } from '@/lib/dashboard/config';
import { useDomainLabels } from '@/hooks/useDomainTerminology';
import { cloudApi } from '@/lib/api/cloud';
import { aiApi } from '@/lib/api/ai';
import type {
  CloudTelemetry,
  CloudAssessmentResponse,
  CloudTimeSeriesData,
} from '@/types/cloud';
import type { CHADD2OverlayConfig } from '@/types/dashboard';

export default function CloudDashboard() {
  return <CloudDashboardContent />;
}

function CloudDashboardContent() {
  const domain = 'cloud';
  const config = getConfigForDomain(domain);
  const domainLabels = useDomainLabels(domain);
  
  const [platformId] = useState('demo-platform-1');
  const [assessment, setAssessment] = useState<CloudAssessmentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiInterpretation, setAIInterpretation] = useState<string | null>(null);
  const [aiLoading, setAILoading] = useState(false);
  const [enableAI, setEnableAI] = useState(true);
  const [chadd2Config, setChadd2Config] = useState<CHADD2OverlayConfig>({
    enabled: false,
    modelType: 'auto',
    fibonacciOverlay: false,
    lambdaFib: 0.0,
    wPhi: 0.0,
  });

  // Demo telemetry data
  const [demoTelemetry] = useState<CloudTelemetry>({
    cpu_utilization: 68.5, // %
    memory_utilization: 75.2, // %
    disk_utilization: 62.3, // %
    network_in: 45.8, // MB/s
    network_out: 38.2, // MB/s
    request_count: 12500, // requests per minute
    error_count: 25, // errors per minute
    latency_p50: 120, // ms
    latency_p95: 350, // ms
    latency_p99: 580, // ms
    availability: 0.998,
    cost_per_hour: 2.45, // USD
  });

  // Generate demo time-series data
  const generateTimeSeriesData = (): CloudTimeSeriesData[] => {
    const data: CloudTimeSeriesData[] = [];
    const baseTime = new Date('2025-01-01T10:00:00Z');
    
    for (let i = 0; i < 100; i++) {
      const time = new Date(baseTime.getTime() + i * 60000); // 1 minute intervals
      
      // Simulate realistic cloud resource variations
      const cpuUtilization = 55 + Math.sin(i / 18) * 25 + Math.random() * 10;
      const memoryUtilization = 60 + Math.sin(i / 22) * 20 + Math.random() * 8;
      const diskUtilization = 50 + Math.sin(i / 25) * 15 + Math.random() * 5;
      const networkIn = 30 + Math.sin(i / 15) * 20 + Math.random() * 5;
      const networkOut = 25 + Math.sin(i / 15) * 15 + Math.random() * 5;
      const requestCount = 10000 + Math.sin(i / 12) * 3000 + Math.random() * 500;
      const errorCount = 10 + Math.random() * 30;
      
      // Calculate S/Q/U/D (simplified)
      const cpuStability = cpuUtilization < 70 ? 0.9 : cpuUtilization < 85 ? 0.7 : 0.5;
      const memoryStability = memoryUtilization < 75 ? 0.9 : memoryUtilization < 90 ? 0.7 : 0.5;
      const diskStability = diskUtilization < 70 ? 0.9 : diskUtilization < 85 ? 0.7 : 0.5;
      const S = (cpuStability * 0.4 + memoryStability * 0.4 + diskStability * 0.2);
      
      const errorRate = errorCount / Math.max(1, requestCount);
      const errorQuality = errorRate < 0.002 ? 0.9 : errorRate < 0.005 ? 0.7 : 0.5;
      const latencyQuality = 350 < 200 ? 0.9 : 350 < 500 ? 0.7 : 0.5;
      const Q = (errorQuality * 0.4 + latencyQuality * 0.3 + 0.95 * 0.3); // availability
      
      const cpuPressure = Math.min(1.0, cpuUtilization / 80);
      const memoryPressure = Math.min(1.0, memoryUtilization / 85);
      const diskPressure = Math.min(1.0, diskUtilization / 90);
      const errorPressure = Math.min(1.0, errorRate / 0.01);
      const U = (cpuPressure * 0.25 + memoryPressure * 0.25 + diskPressure * 0.2 + errorPressure * 0.3);
      
      const D = 1 / (1 + Math.exp(-(0.5 * S + 0.3 * Math.log(Q + 0.01) - 0.4 * U)));
      
      data.push({
        timestamp: time.toISOString(),
        cpu_utilization: cpuUtilization,
        memory_utilization: memoryUtilization,
        disk_utilization: diskUtilization,
        network_in: networkIn,
        network_out: networkOut,
        request_count: requestCount,
        error_count: errorCount,
        S,
        Q,
        U,
        D,
      });
    }
    
    return data;
  };

  const [timeSeriesData] = useState<CloudTimeSeriesData[]>(generateTimeSeriesData());

  const handleAssess = async () => {
    setLoading(true);
    setError(null);
    setAIInterpretation(null);

    try {
      const result = await cloudApi.assessPlatform({
        platform_id: platformId,
        telemetry: demoTelemetry,
        config: {
          cpu_threshold: 80,
          memory_threshold: 85,
          disk_threshold: 90,
          error_rate_threshold: 0.01,
          cost_threshold: 5.0,
        },
      });
      
      setAssessment(result);

      // Get AI interpretation if enabled
      if (enableAI && result) {
        setAILoading(true);
        try {
          const aiResult = await aiApi.interpretVehicle({
            domain: 'cloud',
            metrics: {
              efficiency_score: result.efficiency_score,
              cost_efficiency: result.cost_efficiency,
              scalability_score: result.scalability_score,
            },
            squd_means: {
              S: result.squd_score.S,
              Q: result.squd_score.Q,
              U: result.squd_score.U,
              D: result.squd_score.D,
            },
          });
          
          if (aiResult.text) {
            setAIInterpretation(aiResult.text);
          }
        } catch (aiError) {
          console.error('AI interpretation failed:', aiError);
        } finally {
          setAILoading(false);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Assessment failed');
    } finally {
      setLoading(false);
    }
  };

  // Generate maintenance recommendations
  const getMaintenanceRecommendations = () => {
    if (!assessment) return [];
    
    const recommendations = [];
    
    if (assessment.component_health) {
      if (assessment.component_health.compute && assessment.component_health.compute < 70) {
        recommendations.push({
          component: 'Compute Resources',
          severity: 'high' as const,
          message: `CPU utilization high (${demoTelemetry.cpu_utilization.toFixed(1)}%) - consider scaling`,
          action: 'Review auto-scaling configuration and consider horizontal scaling',
        });
      }
      
      if (assessment.component_health.storage && assessment.component_health.storage < 70) {
        recommendations.push({
          component: 'Storage',
          severity: 'medium' as const,
          message: `Disk utilization high (${demoTelemetry.disk_utilization.toFixed(1)}%) - storage pressure`,
          action: 'Review storage usage and consider cleanup or expansion',
        });
      }
      
      if (assessment.component_health.availability && assessment.component_health.availability < 95) {
        recommendations.push({
          component: 'Availability',
          severity: 'critical' as const,
          message: `Availability below target (${(demoTelemetry.availability! * 100).toFixed(2)}%)`,
          action: 'Investigate service outages and improve redundancy',
        });
      }
    }
    
    if (assessment.cloud_metrics) {
      if (assessment.cloud_metrics.cost_performance_ratio && assessment.cloud_metrics.cost_performance_ratio < 0.5) {
        recommendations.push({
          component: 'Cost Efficiency',
          severity: 'medium' as const,
          message: `Cost efficiency low ($${demoTelemetry.cost_per_hour?.toFixed(2)}/hr) - optimize resource usage`,
          action: 'Review resource allocation and consider reserved instances',
        });
      }
      
      if (assessment.cloud_metrics.auto_scaling_status === 'scaling_up') {
        recommendations.push({
          component: 'Auto Scaling',
          severity: 'low' as const,
          message: 'Auto-scaling triggered - system responding to load',
          action: 'Monitor scaling events and review scaling policies',
        });
      }
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        component: 'Overall Health',
        severity: 'low' as const,
        message: 'All cloud resources within acceptable ranges',
        action: 'Continue monitoring',
      });
    }
    
    return recommendations;
  };

  const actions = [
    {
      id: 'assess',
      label: 'Run Assessment',
      icon: '▶️',
      onClick: handleAssess,
      variant: 'primary' as const,
      disabled: loading,
    },
  ];

  const sections = {
    header: true,
    metrics: true,
    telemetry: true,
    charts: true,
    aiInterpretation: true,
    maintenance: true,
  };

  return (
    <DashboardTemplate 
      config={config} 
      sections={sections} 
      actions={actions}
      chadd2Overlay={chadd2Config}
      onCHADD2ConfigChange={setChadd2Config}
    >
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Assessment Results - S/Q/U/D Metrics */}
      {assessment && (
        <>
          <MetricsCard
            squd={assessment.squd_score}
            health={assessment.health}
            title="Platform Health Assessment"
          />

          {/* Component Health Grid */}
          {assessment.component_health && (
            <DashboardSection title="Component Health" icon="📊">
              <DashboardGrid cols={2} gap="md">
                {Object.entries(assessment.component_health).map(([component, health]) => (
                  <DashboardSection key={component} variant="card" title={component.replace(/_/g, ' ').toUpperCase()}>
                    <div className="text-3xl font-bold text-primary-600">{health.toFixed(0)}%</div>
                    <div className="text-sm text-gray-500 mt-1">Health Score</div>
                  </DashboardSection>
                ))}
              </DashboardGrid>
            </DashboardSection>
          )}

          {/* Cloud Metrics */}
          {assessment.cloud_metrics && (
            <DashboardSection title="Cloud Metrics" icon="☁️">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Resource Utilization</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {assessment.cloud_metrics.resource_utilization?.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Cost Efficiency</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(assessment.cloud_metrics.cost_performance_ratio! * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Auto Scaling</div>
                  <div className="text-2xl font-bold text-gray-900 capitalize">
                    {assessment.cloud_metrics.auto_scaling_status?.replace('_', ' ')}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Region Health</div>
                  <div className="text-2xl font-bold text-gray-900 capitalize">
                    {assessment.cloud_metrics.region_health}
                  </div>
                </div>
              </div>
            </DashboardSection>
          )}
        </>
      )}

      {/* Telemetry Display */}
      <DashboardSection title="Current Telemetry" icon="📡">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">CPU Utilization</div>
            <div className="text-2xl font-bold text-gray-900">{demoTelemetry.cpu_utilization.toFixed(1)}%</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Memory Utilization</div>
            <div className="text-2xl font-bold text-gray-900">{demoTelemetry.memory_utilization.toFixed(1)}%</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Disk Utilization</div>
            <div className="text-2xl font-bold text-gray-900">{demoTelemetry.disk_utilization.toFixed(1)}%</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Network In</div>
            <div className="text-2xl font-bold text-gray-900">{demoTelemetry.network_in.toFixed(1)} MB/s</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Network Out</div>
            <div className="text-2xl font-bold text-gray-900">{demoTelemetry.network_out.toFixed(1)} MB/s</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Requests/min</div>
            <div className="text-2xl font-bold text-gray-900">{demoTelemetry.request_count.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Errors/min</div>
            <div className="text-2xl font-bold text-gray-900">{demoTelemetry.error_count}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Cost/Hour</div>
            <div className="text-2xl font-bold text-gray-900">${demoTelemetry.cost_per_hour?.toFixed(2)}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">P95 Latency</div>
            <div className="text-2xl font-bold text-gray-900">{demoTelemetry.latency_p95?.toFixed(0)}ms</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Availability</div>
            <div className="text-2xl font-bold text-gray-900">{(demoTelemetry.availability! * 100).toFixed(3)}%</div>
          </div>
        </div>
      </DashboardSection>

      {/* Time Series Charts */}
      {timeSeriesData.length > 0 && (
        <DashboardSection title="Resource Trends" icon="📈">
          <div className="space-y-6">
            <TimeSeriesChart
              title="Resource Utilization"
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'cpu_utilization', name: 'CPU (%)', color: '#3b82f6' },
                { key: 'memory_utilization', name: 'Memory (%)', color: '#10b981' },
                { key: 'disk_utilization', name: 'Disk (%)', color: '#f59e0b' },
              ]}
              height={300}
            />
            <TimeSeriesChart
              title="Network & Traffic"
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'network_in', name: 'Network In (MB/s)', color: '#8b5cf6' },
                { key: 'network_out', name: 'Network Out (MB/s)', color: '#ec4899' },
                { key: 'request_count', name: 'Requests/min (÷100)', color: '#06b6d4' },
              ]}
              height={300}
            />
            <TimeSeriesChart
              title={`${domainLabels.getFrameworkName()} Metrics`}
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'S', name: domainLabels.getSQUDLabel('S'), color: '#2ca02c' },
                { key: 'Q', name: domainLabels.getSQUDLabel('Q'), color: '#1f77b4' },
                { key: 'U', name: domainLabels.getSQUDLabel('U'), color: '#d62728' },
                { key: 'D', name: domainLabels.getSQUDLabel('D'), color: '#9467bd' },
              ]}
              height={300}
            />
          </div>
        </DashboardSection>
      )}

      {/* AI Interpretation */}
      {enableAI && (
        <AIInterpretationCard
          interpretation={aiInterpretation}
          loading={aiLoading}
        />
      )}

      {/* Maintenance Recommendations */}
      {assessment && (
        <MaintenanceRecommendations recommendations={getMaintenanceRecommendations()} />
      )}
    </DashboardTemplate>
  );
}

