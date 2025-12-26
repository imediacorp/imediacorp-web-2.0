/**
 * Software Performance Dashboard Page
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
import { softwareApi } from '@/lib/api/software';
import { aiApi } from '@/lib/api/ai';
import type {
  SoftwareTelemetry,
  SoftwareAssessmentResponse,
  SoftwareTimeSeriesData,
} from '@/types/software';
import type { CHADD2OverlayConfig } from '@/types/dashboard';

export default function SoftwareDashboard() {
  return <SoftwareDashboardContent />;
}

function SoftwareDashboardContent() {
  const domain = 'software';
  const config = getConfigForDomain(domain);
  const domainLabels = useDomainLabels(domain);
  
  const [serviceId] = useState('demo-service-1');
  const [assessment, setAssessment] = useState<SoftwareAssessmentResponse | null>(null);
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
  const [demoTelemetry] = useState<SoftwareTelemetry>({
    cpu_usage: 65.5, // %
    memory_usage: 72.3, // %
    response_time: 145, // ms
    error_rate: 0.002, // 0.2%
    throughput: 850, // req/s
    active_connections: 1250,
    disk_io: 45.2, // MB/s
    network_io: 120.5, // MB/s
    cache_hit_rate: 0.85,
    database_query_time: 25, // ms
  });

  // Generate demo time-series data
  const generateTimeSeriesData = (): SoftwareTimeSeriesData[] => {
    const data: SoftwareTimeSeriesData[] = [];
    const baseTime = new Date('2025-01-01T10:00:00Z');
    
    for (let i = 0; i < 100; i++) {
      const time = new Date(baseTime.getTime() + i * 60000); // 1 minute intervals
      
      // Simulate realistic software performance variations
      const cpuUsage = 50 + Math.sin(i / 15) * 20 + Math.random() * 10;
      const memoryUsage = 60 + Math.sin(i / 20) * 15 + Math.random() * 8;
      const responseTime = 100 + Math.sin(i / 12) * 50 + Math.random() * 20;
      const errorRate = 0.001 + Math.random() * 0.005;
      const throughput = 700 + Math.sin(i / 10) * 200 + Math.random() * 50;
      
      // Calculate S/Q/U/D (simplified)
      const cpuStability = cpuUsage < 70 ? 0.9 : cpuUsage < 85 ? 0.7 : 0.5;
      const memoryStability = memoryUsage < 75 ? 0.9 : memoryUsage < 90 ? 0.7 : 0.5;
      const S = (cpuStability * 0.5 + memoryStability * 0.5);
      
      const responseTimeQuality = responseTime < 200 ? 0.9 : responseTime < 500 ? 0.7 : 0.5;
      const errorRateQuality = errorRate < 0.005 ? 0.9 : errorRate < 0.01 ? 0.7 : 0.5;
      const Q = (responseTimeQuality * 0.5 + errorRateQuality * 0.5);
      
      const cpuPressure = Math.min(1.0, cpuUsage / 80);
      const memoryPressure = Math.min(1.0, memoryUsage / 85);
      const errorPressure = Math.min(1.0, errorRate / 0.01);
      const U = (cpuPressure * 0.3 + memoryPressure * 0.3 + errorPressure * 0.4);
      
      const D = 1 / (1 + Math.exp(-(0.5 * S + 0.3 * Math.log(Q + 0.01) - 0.4 * U)));
      
      data.push({
        timestamp: time.toISOString(),
        cpu_usage: cpuUsage,
        memory_usage: memoryUsage,
        response_time: responseTime,
        error_rate: errorRate,
        throughput: throughput,
        S,
        Q,
        U,
        D,
      });
    }
    
    return data;
  };

  const [timeSeriesData] = useState<SoftwareTimeSeriesData[]>(generateTimeSeriesData());

  const handleAssess = async () => {
    setLoading(true);
    setError(null);
    setAIInterpretation(null);

    try {
      const result = await softwareApi.assessService({
        service_id: serviceId,
        telemetry: demoTelemetry,
        config: {
          cpu_threshold: 80,
          memory_threshold: 85,
          response_time_threshold: 500,
          error_rate_threshold: 0.01,
        },
      });
      
      setAssessment(result);

      // Get AI interpretation if enabled
      if (enableAI && result) {
        setAILoading(true);
        try {
          const aiResult = await aiApi.interpretVehicle({
            domain: 'software',
            metrics: {
              performance_score: result.performance_score,
              reliability_score: result.reliability_score,
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
      if (assessment.component_health.cpu && assessment.component_health.cpu < 70) {
        recommendations.push({
          component: 'CPU',
          severity: 'high' as const,
          message: `CPU utilization high (${demoTelemetry.cpu_usage.toFixed(1)}%) - consider scaling or optimization`,
          action: 'Review CPU-intensive operations and consider horizontal scaling',
        });
      }
      
      if (assessment.component_health.memory && assessment.component_health.memory < 70) {
        recommendations.push({
          component: 'Memory',
          severity: 'high' as const,
          message: `Memory utilization high (${demoTelemetry.memory_usage.toFixed(1)}%) - potential memory leak`,
          action: 'Review memory usage patterns and check for memory leaks',
        });
      }
      
      if (assessment.component_health.response_time && assessment.component_health.response_time < 70) {
        recommendations.push({
          component: 'Response Time',
          severity: 'medium' as const,
          message: `Response time elevated (${demoTelemetry.response_time.toFixed(0)}ms) - performance degradation`,
          action: 'Optimize slow queries and review database performance',
        });
      }
      
      if (assessment.component_health.error_rate && assessment.component_health.error_rate < 80) {
        recommendations.push({
          component: 'Error Rate',
          severity: 'critical' as const,
          message: `Error rate elevated (${(demoTelemetry.error_rate * 100).toFixed(2)}%) - investigate failures`,
          action: 'Review error logs and investigate root cause of failures',
        });
      }
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        component: 'Overall Health',
        severity: 'low' as const,
        message: 'All performance metrics within acceptable ranges',
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
            title="Service Health Assessment"
          />

          {/* Component Health Grid */}
          {assessment.component_health && (
            <DashboardSection title="Component Health" icon="📊">
              <DashboardGrid cols={3} gap="md">
                {Object.entries(assessment.component_health).map(([component, health]) => (
                  <DashboardSection key={component} variant="card" title={component.replace(/_/g, ' ').toUpperCase()}>
                    <div className="text-3xl font-bold text-primary-600">{health.toFixed(0)}%</div>
                    <div className="text-sm text-gray-500 mt-1">Health Score</div>
                  </DashboardSection>
                ))}
              </DashboardGrid>
            </DashboardSection>
          )}

          {/* Performance Metrics */}
          {assessment.software_metrics && (
            <DashboardSection title="Performance Metrics" icon="⚡">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Availability</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(assessment.software_metrics.availability! * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">P50 Latency</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {assessment.software_metrics.latency_p50?.toFixed(0)}ms
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">P95 Latency</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {assessment.software_metrics.latency_p95?.toFixed(0)}ms
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Throughput</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {assessment.software_metrics.requests_per_second?.toFixed(0)} req/s
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
            <div className="text-sm text-gray-500">CPU Usage</div>
            <div className="text-2xl font-bold text-gray-900">{demoTelemetry.cpu_usage.toFixed(1)}%</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Memory Usage</div>
            <div className="text-2xl font-bold text-gray-900">{demoTelemetry.memory_usage.toFixed(1)}%</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Response Time</div>
            <div className="text-2xl font-bold text-gray-900">{demoTelemetry.response_time.toFixed(0)}ms</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Error Rate</div>
            <div className="text-2xl font-bold text-gray-900">{(demoTelemetry.error_rate * 100).toFixed(2)}%</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Throughput</div>
            <div className="text-2xl font-bold text-gray-900">{demoTelemetry.throughput.toFixed(0)} req/s</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Active Connections</div>
            <div className="text-2xl font-bold text-gray-900">{demoTelemetry.active_connections}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Cache Hit Rate</div>
            <div className="text-2xl font-bold text-gray-900">{(demoTelemetry.cache_hit_rate! * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">DB Query Time</div>
            <div className="text-2xl font-bold text-gray-900">{demoTelemetry.database_query_time?.toFixed(0)}ms</div>
          </div>
        </div>
      </DashboardSection>

      {/* Time Series Charts */}
      {timeSeriesData.length > 0 && (
        <DashboardSection title="Performance Trends" icon="📈">
          <div className="space-y-6">
            <TimeSeriesChart
              title="Resource Utilization"
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'cpu_usage', name: 'CPU Usage (%)', color: '#3b82f6' },
                { key: 'memory_usage', name: 'Memory Usage (%)', color: '#10b981' },
              ]}
              height={300}
            />
            <TimeSeriesChart
              title="Performance Metrics"
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'response_time', name: 'Response Time (ms)', color: '#f59e0b' },
                { key: 'throughput', name: 'Throughput (req/s)', color: '#8b5cf6' },
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

