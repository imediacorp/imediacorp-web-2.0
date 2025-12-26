/**
 * Hantek 1008B Oscilloscope Dashboard
 * Web dashboard for 8-channel USB oscilloscope data visualization and analysis
 * Uses Web 2.0 Dashboard Template
 */

'use client';

import React, { useState, useEffect } from 'react';
import { DashboardTemplate } from '@/components/dashboard/template/DashboardTemplate';
import { DashboardSection, DashboardGrid } from '@/components/dashboard/template/DashboardSection';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { TimeSeriesChart } from '@/components/dashboard/TimeSeriesChart';
import { getConfigForDomain } from '@/lib/dashboard/config';
import type { DashboardAction, MetricsSummary } from '@/types/dashboard';

interface ChannelData {
  timestamp: string;
  voltage: number;
}

interface HantekData {
  channels: Record<number, ChannelData[]>;
  squd: {
    S: number[];
    Q: number[];
    U: number[];
    D: number[];
  };
  timestamps: string[];
}

export default function HantekDashboard() {
  return <HantekDashboardContent />;
}

function HantekDashboardContent() {
  const domain = 'hantek';
  const config = getConfigForDomain(domain);
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<HantekData | null>(null);
  const [selectedChannels, setSelectedChannels] = useState<number[]>([1, 2, 3, 4]);
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount (placeholder - would connect to API)
  useEffect(() => {
    // In production, this would fetch from API endpoint
    // For now, generate sample data
    generateSampleData();
  }, []);

  const generateSampleData = () => {
    // Generate sample oscilloscope data
    const nSamples = 1000;
    const timestamps: string[] = [];
    const channels: Record<number, ChannelData[]> = {};
    const S: number[] = [];
    const Q: number[] = [];
    const U: number[] = [];
    const D: number[] = [];

    const startTime = new Date();
    
    for (let i = 0; i < nSamples; i++) {
      const timestamp = new Date(startTime.getTime() + i * 10); // 10ms intervals
      timestamps.push(timestamp.toISOString());
      
      // Generate sample waveforms for 8 channels
      for (let ch = 1; ch <= 8; ch++) {
        if (!channels[ch]) {
          channels[ch] = [];
        }
        
        // Different waveforms per channel
        let voltage = 0;
        const t = i / 100;
        switch (ch) {
          case 1: // Sine wave
            voltage = 2.5 + 2.0 * Math.sin(2 * Math.PI * 0.1 * t);
            break;
          case 2: // Square wave
            voltage = 2.5 + 2.0 * (Math.sin(2 * Math.PI * 0.1 * t) > 0 ? 1 : -1);
            break;
          case 3: // Triangle wave
            voltage = 2.5 + 2.0 * (2 * Math.abs((t * 0.1) % 1 - 0.5) - 0.5);
            break;
          case 4: // Sawtooth
            voltage = 2.5 + 2.0 * ((t * 0.1) % 1 - 0.5);
            break;
          case 5: // Noise + sine
            voltage = 2.5 + 1.5 * Math.sin(2 * Math.PI * 0.15 * t) + 0.3 * (Math.random() - 0.5);
            break;
          case 6: // Low frequency
            voltage = 2.5 + 1.0 * Math.sin(2 * Math.PI * 0.05 * t);
            break;
          case 7: // High frequency
            voltage = 2.5 + 1.5 * Math.sin(2 * Math.PI * 0.5 * t);
            break;
          case 8: // DC + ripple
            voltage = 12.0 + 0.5 * Math.sin(2 * Math.PI * 0.2 * t);
            break;
        }
        
        channels[ch].push({
          timestamp: timestamp.toISOString(),
          voltage,
        });
      }
      
      // Generate S/Q/U/D values
      const s = 0.7 + 0.2 * Math.sin(2 * Math.PI * 0.01 * i) + 0.1 * Math.random();
      const q = 0.6 + 0.3 * Math.cos(2 * Math.PI * 0.015 * i) + 0.1 * Math.random();
      const u = 0.4 + 0.3 * Math.sin(2 * Math.PI * 0.02 * i) + 0.2 * Math.random();
      const d = 1.0 - s * (1.0 - q);
      
      S.push(Math.max(0, Math.min(1, s)));
      Q.push(Math.max(0, Math.min(1, q)));
      U.push(Math.max(0, Math.min(1, u)));
      D.push(Math.max(0, Math.min(1, d)));
    }
    
    setData({
      channels,
      squd: { S, Q, U, D },
      timestamps,
    });
    
    // Calculate metrics
    const avgS = S.reduce((a, b) => a + b, 0) / S.length;
    const avgQ = Q.reduce((a, b) => a + b, 0) / Q.length;
    const avgU = U.reduce((a, b) => a + b, 0) / U.length;
    const avgD = D.reduce((a, b) => a + b, 0) / D.length;
    
    setMetrics({
      squd: {
        S: avgS,
        Q: avgQ,
        U: avgU,
        D: avgD,
      },
      health: (1.0 - avgD) * 100,
    });
  };

  const handleLoadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In production, this would call an API endpoint
      // const response = await fetch('/api/hantek/data');
      // const data = await response.json();
      // setData(data);
      
      // For now, regenerate sample data
      generateSampleData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const actions: DashboardAction[] = [
    {
      id: 'load',
      label: loading ? 'Loading...' : 'Load Data',
      icon: '📊',
      onClick: handleLoadData,
      variant: 'primary',
      disabled: loading,
    },
  ];

  const sections = {
    header: true,
    metrics: true,
    telemetry: false,
    charts: true,
    aiInterpretation: false,
    maintenance: false,
    export: false,
  };

  return (
    <DashboardTemplate
      config={config}
      sections={sections}
      actions={actions}
    >
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Metrics Summary */}
      {metrics && (
        <DashboardSection title="Health Metrics" icon="📊">
          <MetricsCard
            squd={metrics.squd}
            health={metrics.health}
            title="Signal Health Assessment"
            domain={domain}
          />
        </DashboardSection>
      )}

      {/* Channel Selection */}
      <DashboardSection title="Channel Configuration" icon="⚙️">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((ch) => (
            <button
              key={ch}
              onClick={() => {
                if (selectedChannels.includes(ch)) {
                  setSelectedChannels(selectedChannels.filter((c) => c !== ch));
                } else {
                  setSelectedChannels([...selectedChannels, ch]);
                }
              }}
              className={`px-4 py-2 rounded-md border transition-colors ${
                selectedChannels.includes(ch)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
              }`}
            >
              Channel {ch}
            </button>
          ))}
        </div>
      </DashboardSection>

      {/* Waveform Display */}
      {data && selectedChannels.length > 0 && (
        <DashboardSection title="Oscilloscope Waveforms" icon="📈">
          <TimeSeriesChart
            data={data.timestamps.map((ts, i) => {
              const point: Record<string, number | string> = { timestamp: ts };
              selectedChannels.forEach((ch) => {
                if (data.channels[ch] && data.channels[ch][i]) {
                  point[`ch${ch}`] = data.channels[ch][i].voltage;
                }
              });
              return point;
            })}
            lines={selectedChannels.map((ch) => ({
              key: `ch${ch}`,
              name: `Channel ${ch}`,
              color: `hsl(${(ch - 1) * 45}, 70%, 50%)`,
            }))}
            title="Channel Voltages"
            yAxisLabel="Voltage (V)"
          />
        </DashboardSection>
      )}

      {/* S/Q/U/D Analysis */}
      {data && (
        <DashboardSection title="S/Q/U/D Metrics" icon="📊">
          <TimeSeriesChart
            data={data.timestamps.map((ts, i) => ({
              timestamp: ts,
              S: data.squd.S[i],
              Q: data.squd.Q[i],
              U: data.squd.U[i],
              D: data.squd.D[i],
            }))}
            lines={[
              { key: 'S', name: 'Stability', color: '#3b82f6' },
              { key: 'Q', name: 'Coherence', color: '#10b981' },
              { key: 'U', name: 'Susceptibility', color: '#f59e0b' },
              { key: 'D', name: 'Diagnostic', color: '#ef4444' },
            ]}
            title="S/Q/U/D Over Time"
            yAxisLabel="Value"
          />
        </DashboardSection>
      )}

      {/* Channel Statistics */}
      {data && (
        <DashboardSection title="Channel Statistics" icon="📋">
          <DashboardGrid cols={4} gap="md">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((ch) => {
              if (!data.channels[ch] || data.channels[ch].length === 0) {
                return null;
              }
              
              const voltages = data.channels[ch].map((d) => d.voltage);
              const mean = voltages.reduce((a, b) => a + b, 0) / voltages.length;
              const min = Math.min(...voltages);
              const max = Math.max(...voltages);
              const std = Math.sqrt(
                voltages.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / voltages.length
              );
              
              return (
                <div key={ch} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Channel {ch}</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mean:</span>
                      <span className="font-medium">{mean.toFixed(2)} V</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Std:</span>
                      <span className="font-medium">{std.toFixed(2)} V</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Min:</span>
                      <span className="font-medium">{min.toFixed(2)} V</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max:</span>
                      <span className="font-medium">{max.toFixed(2)} V</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Pk-Pk:</span>
                      <span className="font-medium">{(max - min).toFixed(2)} V</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </DashboardGrid>
        </DashboardSection>
      )}

      {/* Empty State */}
      {!data && !loading && (
        <DashboardSection title="Get Started" icon="🚀">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              Click "Load Data" to begin analyzing oscilloscope signals
            </p>
            <p className="text-gray-400 text-sm">
              Connect to Hantek 1008B USB device or load CSV data
            </p>
          </div>
        </DashboardSection>
      )}
    </DashboardTemplate>
  );
}

