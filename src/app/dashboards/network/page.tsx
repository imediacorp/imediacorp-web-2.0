/**
 * Network Dashboard Page
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
import { networkApi } from '@/lib/api/network';
import { aiApi } from '@/lib/api/ai';
import type {
  NetworkTelemetry,
  NetworkAssessmentResponse,
  NetworkTimeSeriesData,
} from '@/types/network';
import type { CHADD2OverlayConfig } from '@/types/dashboard';

export default function NetworkDashboard() {
  return <NetworkDashboardContent />;
}

function NetworkDashboardContent() {
  const domain = 'network';
  const config = getConfigForDomain(domain);
  const domainLabels = useDomainLabels(domain);
  
  const [deviceId] = useState('demo-switch-1');
  const [assessment, setAssessment] = useState<NetworkAssessmentResponse | null>(null);
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
  const [demoTelemetry] = useState<NetworkTelemetry>({
    cpu_1m: 45.2, // %
    cpu_5m: 42.8, // %
    mem_used_pct: 58.3, // %
    mem_total_kb: 8388608, // 8 GB
    mem_used_kb: 4891852, // ~4.7 GB
    temp_c: 52.5, // °C
    pkt_rate: 12500, // packets/sec
    err_rate: 2.5, // errors/sec
    bcast_ratio: 0.15, // 15%
    mcast_ratio: 0.08, // 8%
    integrity_score: 0.92, // ARP integrity
  });

  // Generate demo time-series data
  const generateTimeSeriesData = (): NetworkTimeSeriesData[] => {
    const data: NetworkTimeSeriesData[] = [];
    const baseTime = new Date('2025-01-01T10:00:00Z');
    
    for (let i = 0; i < 100; i++) {
      const time = new Date(baseTime.getTime() + i * 60000); // 1 minute intervals
      
      // Simulate realistic network performance variations
      const cpu = 40 + Math.sin(i / 20) * 15 + Math.random() * 8;
      const memory = 55 + Math.sin(i / 25) * 10 + Math.random() * 5;
      const temp = 48 + Math.sin(i / 30) * 8 + Math.random() * 4;
      const pktRate = 10000 + Math.sin(i / 15) * 5000 + Math.random() * 2000;
      const errRate = 1 + Math.sin(i / 40) * 3 + Math.random() * 2;
      const bcastRatio = 0.12 + Math.sin(i / 35) * 0.08 + Math.random() * 0.04;
      const mcastRatio = 0.06 + Math.sin(i / 40) * 0.05 + Math.random() * 0.03;
      const integrity = 0.90 + Math.sin(i / 50) * 0.08 + Math.random() * 0.04;
      
      // Calculate S/Q/U/D (network domain logic)
      const cpuLoad = Math.min(1.0, cpu / 80);
      const memLoad = Math.min(1.0, memory / 85);
      const pktLoad = Math.min(1.0, pktRate / 100000);
      
      const errorNoise = Math.min(1.0, errRate / 100);
      const bcastNoise = Math.min(1.0, bcastRatio / 0.2);
      const mcastNoise = Math.min(1.0, mcastRatio / 0.3);
      const noiseFactor = (errorNoise * 0.5 + bcastNoise * 0.25 + mcastNoise * 0.25);
      
      const loadFactor = (cpuLoad * 0.4 + memLoad * 0.3 + pktLoad * 0.3);
      const S = Math.max(0, 1.0 - (loadFactor * 0.6 + noiseFactor * 0.4));
      
      const integrityFactor = 1.0 - integrity;
      const Q = Math.min(1.0, (errorNoise * 0.5 + bcastNoise * 0.25 + mcastNoise * 0.15 + integrityFactor * 0.1));
      
      const tempPressure = Math.min(1.0, temp / 75);
      const U = Math.min(1.0, (loadFactor * 0.7 + tempPressure * 0.3));
      
      const D = 1 / (1 + Math.exp(-(0.5 * S + 0.3 * Math.log(Q + 0.01) - 0.4 * U)));
      
      data.push({
        timestamp: time.toISOString(),
        cpu_1m: cpu,
        mem_used_pct: memory,
        temp_c: temp,
        pkt_rate: pktRate,
        err_rate: errRate,
        bcast_ratio: bcastRatio,
        mcast_ratio: mcastRatio,
        integrity_score: integrity,
        S,
        Q,
        U,
        D,
      });
    }
    
    return data;
  };

  const [timeSeriesData] = useState<NetworkTimeSeriesData[]>(generateTimeSeriesData());

  const handleAssess = async () => {
    setLoading(true);
    setError(null);
    setAIInterpretation(null);

    try {
      const result = await networkApi.assessDevice({
        device_id: deviceId,
        telemetry: demoTelemetry,
        config: {
          cpu_threshold: 80,
          memory_threshold: 85,
          temperature_threshold: 75,
          error_rate_threshold: 100,
          bcast_ratio_threshold: 0.2,
          mcast_ratio_threshold: 0.3,
        },
      });
      
      setAssessment(result);

      // Get AI interpretation if enabled
      if (enableAI && result) {
        setAILoading(true);
        try {
          const aiResult = await aiApi.interpretVehicle({
            domain: 'network',
            metrics: {
              cpu_1m: demoTelemetry.cpu_1m,
              mem_used_pct: demoTelemetry.mem_used_pct,
              temp_c: demoTelemetry.temp_c,
              pkt_rate: demoTelemetry.pkt_rate,
              err_rate: demoTelemetry.err_rate,
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
          message: `CPU utilization high (${demoTelemetry.cpu_1m.toFixed(1)}%) - review control plane processes`,
          action: 'Review switch configuration and reduce control plane load',
        });
      }
      
      if (assessment.component_health.memory && assessment.component_health.memory < 70) {
        recommendations.push({
          component: 'Memory',
          severity: 'high' as const,
          message: `Memory utilization high (${demoTelemetry.mem_used_pct.toFixed(1)}%) - potential memory pressure`,
          action: 'Review MAC address table size and routing table usage',
        });
      }
      
      if (assessment.component_health.temperature && assessment.component_health.temperature < 70) {
        recommendations.push({
          component: 'Temperature',
          severity: 'medium' as const,
          message: `Temperature elevated (${demoTelemetry.temp_c.toFixed(1)}°C) - check cooling and airflow`,
          action: 'Verify rack cooling, fan health, and ambient temperature',
        });
      }
      
      if (assessment.component_health.error_rate && assessment.component_health.error_rate < 80) {
        recommendations.push({
          component: 'Error Rate',
          severity: 'critical' as const,
          message: `Error rate elevated (${demoTelemetry.err_rate.toFixed(1)} errors/sec) - investigate interface issues`,
          action: 'Check interface CRCs/align errors, verify cabling and transceivers',
        });
      }
      
      if (assessment.component_health.bcast_ratio && assessment.component_health.bcast_ratio < 70) {
        recommendations.push({
          component: 'Broadcast Traffic',
          severity: 'medium' as const,
          message: `Broadcast ratio high (${(demoTelemetry.bcast_ratio * 100).toFixed(1)}%) - investigate broadcast storms`,
          action: 'Review spanning tree, loop protection, and storm-control settings',
        });
      }
      
      if (assessment.component_health.integrity && assessment.component_health.integrity < 80) {
        recommendations.push({
          component: 'ARP Integrity',
          severity: 'medium' as const,
          message: `ARP integrity issues detected - check for rogue hosts`,
          action: 'Audit DHCP reservations and validate switch ARP caches',
        });
      }
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        component: 'Overall Health',
        severity: 'low' as const,
        message: 'All network metrics within acceptable ranges',
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
            domain={domain}
            title={`${domainLabels.terminology.healthLabel} Assessment (${domainLabels.getFrameworkName()} Framework)`}
          />

          {/* Component Health Grid */}
          {assessment.component_health && (
            <DashboardSection title="Component Health" variant="card">
              <DashboardGrid cols={4} gap="md">
                {Object.entries(assessment.component_health).map(([component, health]) => (
                  <div key={component} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 capitalize mb-1">
                      {component.replace(/_/g, ' ')}
                    </div>
                    <div className={`text-2xl font-bold ${
                      health >= 80 ? 'text-success-600' : health >= 60 ? 'text-warning-600' : 'text-danger-600'
                    }`}>
                      {health.toFixed(0)}%
                    </div>
                  </div>
                ))}
              </DashboardGrid>
            </DashboardSection>
          )}

          {/* Network Metrics */}
          {assessment.network_metrics && (
            <DashboardSection title="Network Metrics" variant="card">
              <DashboardGrid cols={5} gap="md">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Availability</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(assessment.network_metrics.availability! * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Latency</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {assessment.network_metrics.latency?.toFixed(1)}ms
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Throughput</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {assessment.network_metrics.throughput?.toFixed(1)} Mbps
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Packet Loss</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(assessment.network_metrics.packet_loss! * 100).toFixed(3)}%
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Utilization</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(assessment.network_metrics.utilization! * 100).toFixed(1)}%
                  </div>
                </div>
              </DashboardGrid>
            </DashboardSection>
          )}

          {/* Status Indicators */}
          {assessment.status && (
            <DashboardSection title="Device Status" variant="card">
              <DashboardGrid cols={5} gap="md">
                <div className={`p-4 rounded-lg border-2 ${
                  assessment.status.cpu_status === 'normal' ? 'border-success-300 bg-success-50' :
                  assessment.status.cpu_status === 'warn' ? 'border-warning-300 bg-warning-50' :
                  'border-danger-300 bg-danger-50'
                }`}>
                  <div className="text-sm font-medium text-gray-700 mb-1">CPU</div>
                  <div className="text-lg font-semibold">{demoTelemetry.cpu_1m.toFixed(1)}%</div>
                  <div className={`text-xs mt-1 ${
                    assessment.status.cpu_status === 'normal' ? 'text-success-700' :
                    assessment.status.cpu_status === 'warn' ? 'text-warning-700' :
                    'text-danger-700'
                  }`}>
                    {assessment.status.cpu_status?.toUpperCase()}
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${
                  assessment.status.memory_status === 'normal' ? 'border-success-300 bg-success-50' :
                  assessment.status.memory_status === 'warn' ? 'border-warning-300 bg-warning-50' :
                  'border-danger-300 bg-danger-50'
                }`}>
                  <div className="text-sm font-medium text-gray-700 mb-1">Memory</div>
                  <div className="text-lg font-semibold">{demoTelemetry.mem_used_pct.toFixed(1)}%</div>
                  <div className={`text-xs mt-1 ${
                    assessment.status.memory_status === 'normal' ? 'text-success-700' :
                    assessment.status.memory_status === 'warn' ? 'text-warning-700' :
                    'text-danger-700'
                  }`}>
                    {assessment.status.memory_status?.toUpperCase()}
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${
                  assessment.status.temperature_status === 'normal' ? 'border-success-300 bg-success-50' :
                  assessment.status.temperature_status === 'warn' ? 'border-warning-300 bg-warning-50' :
                  'border-danger-300 bg-danger-50'
                }`}>
                  <div className="text-sm font-medium text-gray-700 mb-1">Temperature</div>
                  <div className="text-lg font-semibold">{demoTelemetry.temp_c.toFixed(1)}°C</div>
                  <div className={`text-xs mt-1 ${
                    assessment.status.temperature_status === 'normal' ? 'text-success-700' :
                    assessment.status.temperature_status === 'warn' ? 'text-warning-700' :
                    'text-danger-700'
                  }`}>
                    {assessment.status.temperature_status?.toUpperCase()}
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${
                  assessment.status.error_status === 'normal' ? 'border-success-300 bg-success-50' :
                  assessment.status.error_status === 'warn' ? 'border-warning-300 bg-warning-50' :
                  'border-danger-300 bg-danger-50'
                }`}>
                  <div className="text-sm font-medium text-gray-700 mb-1">Error Rate</div>
                  <div className="text-lg font-semibold">{demoTelemetry.err_rate.toFixed(1)}/s</div>
                  <div className={`text-xs mt-1 ${
                    assessment.status.error_status === 'normal' ? 'text-success-700' :
                    assessment.status.error_status === 'warn' ? 'text-warning-700' :
                    'text-danger-700'
                  }`}>
                    {assessment.status.error_status?.toUpperCase()}
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${
                  assessment.status.traffic_status === 'normal' ? 'border-success-300 bg-success-50' :
                  assessment.status.traffic_status === 'warn' ? 'border-warning-300 bg-warning-50' :
                  'border-danger-300 bg-danger-50'
                }`}>
                  <div className="text-sm font-medium text-gray-700 mb-1">Traffic</div>
                  <div className="text-lg font-semibold">{(demoTelemetry.bcast_ratio + demoTelemetry.mcast_ratio) * 100}%</div>
                  <div className={`text-xs mt-1 ${
                    assessment.status.traffic_status === 'normal' ? 'text-success-700' :
                    assessment.status.traffic_status === 'warn' ? 'text-warning-700' :
                    'text-danger-700'
                  }`}>
                    {assessment.status.traffic_status?.toUpperCase()}
                  </div>
                </div>
              </DashboardGrid>
            </DashboardSection>
          )}
        </>
      )}

      {/* Current Telemetry Display */}
      <DashboardSection title="Current Telemetry" variant="card">
        <DashboardGrid cols={4} gap="md">
          <div>
            <div className="text-sm text-gray-500 mb-1">CPU Usage (1min)</div>
            <div className="text-2xl font-semibold">{demoTelemetry.cpu_1m.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Memory Used</div>
            <div className="text-2xl font-semibold">{demoTelemetry.mem_used_pct.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Temperature</div>
            <div className="text-2xl font-semibold">{demoTelemetry.temp_c.toFixed(1)}°C</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Packet Rate</div>
            <div className="text-2xl font-semibold">{(demoTelemetry.pkt_rate / 1000).toFixed(1)}K pps</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Error Rate</div>
            <div className="text-2xl font-semibold">{demoTelemetry.err_rate.toFixed(2)} errors/s</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Broadcast Ratio</div>
            <div className="text-2xl font-semibold">{(demoTelemetry.bcast_ratio * 100).toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Multicast Ratio</div>
            <div className="text-2xl font-semibold">{(demoTelemetry.mcast_ratio * 100).toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">ARP Integrity</div>
            <div className="text-2xl font-semibold">{((demoTelemetry.integrity_score || 0.9) * 100).toFixed(1)}%</div>
          </div>
        </DashboardGrid>
      </DashboardSection>

      {/* Time Series Charts */}
      {timeSeriesData.length > 0 && (
        <DashboardSection title="Analysis - Time Series" variant="card">
          <div className="space-y-6">
            {/* S/Q/U/D Time Series */}
            <TimeSeriesChart
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'S', name: domainLabels.getSQUDLabel('S'), color: '#10b981' },
                { key: 'Q', name: domainLabels.getSQUDLabel('Q'), color: '#f59e0b' },
                { key: 'U', name: domainLabels.getSQUDLabel('U'), color: '#ef4444' },
                { key: 'D', name: domainLabels.getSQUDLabel('D'), color: '#3b82f6' },
              ]}
              title={`${domainLabels.getFrameworkName()} Metrics Over Time`}
              height={400}
            />

            {/* Resource Utilization Time Series */}
            <TimeSeriesChart
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'cpu_1m', name: 'CPU Usage (%)', color: '#3b82f6' },
                { key: 'mem_used_pct', name: 'Memory Usage (%)', color: '#10b981' },
                { key: 'temp_c', name: 'Temperature (°C)', color: '#ef4444' },
              ]}
              title="Resource Utilization Over Time"
              height={400}
            />

            {/* Network Traffic Time Series */}
            <TimeSeriesChart
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'pkt_rate', name: 'Packet Rate (pps)', color: '#8b5cf6' },
                { key: 'err_rate', name: 'Error Rate (errors/s)', color: '#f59e0b' },
              ]}
              title="Network Traffic & Errors Over Time"
              height={400}
            />

            {/* Traffic Ratios Time Series */}
            <TimeSeriesChart
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'bcast_ratio', name: 'Broadcast Ratio', color: '#ec4899' },
                { key: 'mcast_ratio', name: 'Multicast Ratio', color: '#06b6d4' },
                { key: 'integrity_score', name: 'ARP Integrity', color: '#84cc16' },
              ]}
              title="Traffic Quality Metrics Over Time"
              height={400}
            />
          </div>
        </DashboardSection>
      )}

      {/* AI Interpretation */}
      <AIInterpretationCard
        interpretation={aiInterpretation}
        loading={aiLoading}
        error={null}
      />

      {/* Maintenance Recommendations */}
      {assessment && (
        <MaintenanceRecommendations
          recommendations={getMaintenanceRecommendations()}
          componentHealth={assessment.component_health}
        />
      )}
    </DashboardTemplate>
  );
}

