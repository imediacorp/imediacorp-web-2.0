/**
 * Fleet Management Component
 * Compare multiple vehicles side-by-side with charts and export
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { AIInterpretationCard } from './AIInterpretation';
import { aiApi } from '@/lib/api/ai';
import type { SQUDScore } from '@/types/api';

export interface FleetVehicle {
  name: string;
  timestamp: string;
  squd_means: SQUDScore;
  health?: number;
  metrics?: Record<string, number>;
  n_records?: number;
}

interface FleetManagementProps {
  currentVehicle?: FleetVehicle;
  onAddToFleet?: (vehicle: FleetVehicle) => void;
  vehicleType: 'gas' | 'electric';
  enableFleet?: boolean;
  onToggleFleet?: (enabled: boolean) => void;
}

const FLEET_STORAGE_KEY = 'hdpd_fleet_data';

export function FleetManagement({
  currentVehicle,
  onAddToFleet,
  vehicleType,
  enableFleet = false,
  onToggleFleet,
}: FleetManagementProps) {
  const [fleet, setFleet] = useState<FleetVehicle[]>([]);
  const [vehicleName, setVehicleName] = useState('');
  const [selectedDemoVehicle, setSelectedDemoVehicle] = useState<string>('');
  const [fleetAIInterpretation, setFleetAIInterpretation] = useState<string | null>(null);
  const [fleetAILoading, setFleetAILoading] = useState(false);
  
  // Generate demo vehicle options
  const demoVehicles = [
    { id: 'demo-vehicle-1', name: 'Demo Vehicle 1 (Normal)', description: 'Normal operating conditions' },
    { id: 'demo-vehicle-2', name: 'Demo Vehicle 2 (High Load)', description: 'High engine load, elevated temps' },
    { id: 'demo-vehicle-3', name: 'Demo Vehicle 3 (Faulty)', description: 'Overheating condition detected' },
    { id: 'demo-vehicle-4', name: 'Demo Vehicle 4 (Efficient)', description: 'Optimal efficiency, low stress' },
    { id: 'demo-vehicle-5', name: 'Demo Vehicle 5 (Aging)', description: 'Aging engine, declining health' },
  ];

  // Load fleet from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`${FLEET_STORAGE_KEY}_${vehicleType}`);
    if (stored) {
      try {
        setFleet(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load fleet data:', e);
      }
    }
  }, [vehicleType]);

  // Save fleet to localStorage whenever it changes
  useEffect(() => {
    if (fleet.length > 0) {
      localStorage.setItem(`${FLEET_STORAGE_KEY}_${vehicleType}`, JSON.stringify(fleet));
    }
  }, [fleet, vehicleType]);

  const handleAddToFleet = () => {
    if (!currentVehicle) {
      // If no current vehicle but demo vehicle selected, create a demo vehicle
      if (selectedDemoVehicle && vehicleName.trim()) {
        const demoVehicle = demoVehicles.find(v => v.id === selectedDemoVehicle);
        if (demoVehicle) {
          // Generate demo SQUD based on vehicle type
          const demoSQUD = generateDemoSQUD(selectedDemoVehicle, vehicleType);
          const vehicle: FleetVehicle = {
            name: vehicleName.trim(),
            timestamp: new Date().toISOString(),
            squd_means: demoSQUD,
            health: (1.0 - demoSQUD.D) * 100,
            n_records: 1000,
          };
          const newFleet = [...fleet, vehicle];
          setFleet(newFleet);
          setVehicleName('');
          setSelectedDemoVehicle('');
          // Trigger fleet AI analysis
          analyzeFleet(newFleet);
          return;
        }
      }
      return;
    }

    const vehicle: FleetVehicle = {
      ...currentVehicle,
      name: vehicleName.trim() || currentVehicle.name || `Vehicle ${fleet.length + 1}`,
    };

    const newFleet = [...fleet, vehicle];
    setFleet(newFleet);
    setVehicleName('');

    if (onAddToFleet) {
      onAddToFleet(vehicle);
    }
    
    // Trigger fleet AI analysis
    analyzeFleet(newFleet);
  };

  const handleRemoveVehicle = (index: number) => {
    const newFleet = fleet.filter((_, i) => i !== index);
    setFleet(newFleet);
    if (newFleet.length > 0) {
      analyzeFleet(newFleet);
    } else {
      setFleetAIInterpretation(null);
    }
  };

  // Analyze fleet with AI
  const analyzeFleet = async (fleetData: FleetVehicle[]) => {
    if (fleetData.length < 2) {
      setFleetAIInterpretation(null);
      return;
    }

    setFleetAILoading(true);
    try {
      // Calculate fleet statistics
      const avgS = fleetData.reduce((sum, v) => sum + v.squd_means.S, 0) / fleetData.length;
      const avgQ = fleetData.reduce((sum, v) => sum + v.squd_means.Q, 0) / fleetData.length;
      const avgU = fleetData.reduce((sum, v) => sum + v.squd_means.U, 0) / fleetData.length;
      const avgD = fleetData.reduce((sum, v) => sum + v.squd_means.D, 0) / fleetData.length;
      const avgHealth = fleetData.reduce((sum, v) => sum + (v.health || (1.0 - v.squd_means.D) * 100), 0) / fleetData.length;

      // Find best and worst vehicles
      const bestVehicle = fleetData.reduce((best, v) => {
        const health = v.health || (1.0 - v.squd_means.D) * 100;
        const bestHealth = best.health || (1.0 - best.squd_means.D) * 100;
        return health > bestHealth ? v : best;
      });
      const worstVehicle = fleetData.reduce((worst, v) => {
        const health = v.health || (1.0 - v.squd_means.D) * 100;
        const worstHealth = worst.health || (1.0 - worst.squd_means.D) * 100;
        return health < worstHealth ? v : worst;
      });

      // Calculate variance
      const healthVariance = fleetData.reduce((sum, v) => {
        const health = v.health || (1.0 - v.squd_means.D) * 100;
        return sum + Math.pow(health - avgHealth, 2);
      }, 0) / fleetData.length;

      const aiResult = await aiApi.interpretVehicle({
        domain: vehicleType === 'gas' ? 'gas_vehicle' : 'electric_vehicle',
        metrics: {
          fleet_size: fleetData.length,
          avg_health: avgHealth,
          health_variance: healthVariance,
          best_vehicle_health: bestVehicle.health || (1.0 - bestVehicle.squd_means.D) * 100,
          worst_vehicle_health: worstVehicle.health || (1.0 - worstVehicle.squd_means.D) * 100,
        },
        squd_means: {
          S: avgS,
          Q: avgQ,
          U: avgU,
          D: avgD,
        },
        chadd_results: {
          fleet_comparison: {
            best_vehicle: bestVehicle.name,
            worst_vehicle: worstVehicle.name,
            health_range: (bestVehicle.health || (1.0 - bestVehicle.squd_means.D) * 100) - (worstVehicle.health || (1.0 - worstVehicle.squd_means.D) * 100),
            vehicles_requiring_attention: fleetData.filter(v => (v.health || (1.0 - v.squd_means.D) * 100) < 70).length,
          },
        },
        telemetry_summary: {
          fleet_avg_s: avgS,
          fleet_avg_q: avgQ,
          fleet_avg_u: avgU,
          fleet_avg_d: avgD,
        },
        use_graphrag: false,
      });

      // Enhance with fleet-specific insights
      const fleetInsights = generateFleetInsights(fleetData, bestVehicle, worstVehicle, avgHealth, healthVariance);
      setFleetAIInterpretation(`${aiResult.text}\n\n${fleetInsights}`);
    } catch (err) {
      // Error already handled by aiApi with fallback
      // Only log if it's an unexpected error
      if (!(err instanceof Error && (err.message.includes('404') || err.message.includes('Not Found')))) {
        console.warn('Fleet AI analysis unexpected error:', err);
      }
      // Fallback interpretation
      const fallback = generateFleetInsights(fleetData, 
        fleetData.reduce((best, v) => {
          const health = v.health || (1.0 - v.squd_means.D) * 100;
          const bestHealth = best.health || (1.0 - best.squd_means.D) * 100;
          return health > bestHealth ? v : best;
        }),
        fleetData.reduce((worst, v) => {
          const health = v.health || (1.0 - v.squd_means.D) * 100;
          const worstHealth = worst.health || (1.0 - worst.squd_means.D) * 100;
          return health < worstHealth ? v : worst;
        }),
        fleetData.reduce((sum, v) => sum + (v.health || (1.0 - v.squd_means.D) * 100), 0) / fleetData.length,
        fleetData.reduce((sum, v) => {
          const health = v.health || (1.0 - v.squd_means.D) * 100;
          const avg = fleetData.reduce((s, v2) => s + (v2.health || (1.0 - v2.squd_means.D) * 100), 0) / fleetData.length;
          return sum + Math.pow(health - avg, 2);
        }, 0) / fleetData.length
      );
      setFleetAIInterpretation(fallback);
    } finally {
      setFleetAILoading(false);
    }
  };

  const generateFleetInsights = (
    fleet: FleetVehicle[],
    best: FleetVehicle,
    worst: FleetVehicle,
    avgHealth: number,
    variance: number
  ): string => {
    const insights: string[] = [];
    const recommendations: string[] = [];

    // Fleet health analysis
    if (avgHealth > 80) {
      insights.push(`Fleet average health is excellent (${avgHealth.toFixed(1)}%)`);
    } else if (avgHealth > 60) {
      insights.push(`Fleet average health is good (${avgHealth.toFixed(1)}%)`);
      recommendations.push('Continue regular maintenance schedule across fleet');
    } else {
      insights.push(`Fleet average health requires attention (${avgHealth.toFixed(1)}%)`);
      recommendations.push('Schedule comprehensive fleet-wide maintenance review');
    }

    // Variance analysis
    if (variance > 400) {
      insights.push(`High variance in fleet health (${variance.toFixed(0)}) indicates inconsistent maintenance`);
      recommendations.push('Standardize maintenance protocols across all vehicles');
      recommendations.push(`Prioritize attention to ${worst.name} (health: ${(worst.health || (1.0 - worst.squd_means.D) * 100).toFixed(1)}%)`);
    } else if (variance > 100) {
      insights.push(`Moderate variance suggests some vehicles need targeted attention`);
      recommendations.push(`Review maintenance history for ${worst.name}`);
    }

    // Best practices
    const bestHealth = best.health || (1.0 - best.squd_means.D) * 100;
    if (bestHealth > 85) {
      insights.push(`${best.name} demonstrates optimal performance - use as maintenance benchmark`);
      recommendations.push(`Apply maintenance practices from ${best.name} to other fleet vehicles`);
    }

    // Vehicles needing attention
    const vehiclesNeedingAttention = fleet.filter(v => (v.health || (1.0 - v.squd_means.D) * 100) < 70);
    if (vehiclesNeedingAttention.length > 0) {
      insights.push(`${vehiclesNeedingAttention.length} vehicle(s) require immediate attention`);
      recommendations.push(`Schedule diagnostic for: ${vehiclesNeedingAttention.map(v => v.name).join(', ')}`);
    }

    return `**Fleet Insights:**\n${insights.map(i => `• ${i}`).join('\n')}\n\n**Recommendations:**\n${recommendations.map(r => `• ${r}`).join('\n')}`;
  };

  // Analyze fleet when it changes (but avoid infinite loops)
  const fleetString = JSON.stringify(fleet.map(v => ({ name: v.name, health: v.health, squd: v.squd_means })));
  useEffect(() => {
    if (fleet.length >= 2) {
      analyzeFleet(fleet);
    } else {
      setFleetAIInterpretation(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fleetString]); // Trigger when fleet composition changes

  // Generate demo SQUD values based on vehicle ID and type
  const generateDemoSQUD = (vehicleId: string, type: 'gas' | 'electric'): SQUDScore => {
    // Different characteristics for different demo vehicles
    // Profiles are similar for both gas and electric, but can be customized
    const profiles: Record<string, SQUDScore> = {
      'demo-vehicle-1': { S: 0.75, Q: 0.45, U: 0.35, D: 0.30 }, // Normal
      'demo-vehicle-2': { S: 0.65, Q: 0.60, U: 0.55, D: 0.50 }, // High load/stress
      'demo-vehicle-3': { S: 0.50, Q: 0.75, U: 0.70, D: 0.80 }, // Faulty/degraded
      'demo-vehicle-4': { S: 0.85, Q: 0.35, U: 0.25, D: 0.20 }, // Efficient/optimal
      'demo-vehicle-5': { S: 0.60, Q: 0.55, U: 0.50, D: 0.65 }, // Aging/wear
    };
    
    // For electric vehicles, slightly adjust Q (coherence) as it relates to battery/motor coordination
    const baseProfile = profiles[vehicleId] || profiles['demo-vehicle-1'];
    if (type === 'electric') {
      // Electric vehicles might have slightly different Q characteristics
      return {
        ...baseProfile,
        Q: baseProfile.Q * 0.9, // Slightly lower Q for electric (different stress patterns)
      };
    }
    
    return baseProfile;
  };

  const handleClearFleet = () => {
    if (confirm('Are you sure you want to clear all fleet data?')) {
      setFleet([]);
      localStorage.removeItem(`${FLEET_STORAGE_KEY}_${vehicleType}`);
    }
  };

  const handleExportFleet = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      fleet_size: fleet.length,
      vehicle_type: vehicleType,
      vehicles: fleet,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fleet_data_${vehicleType}_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Prepare data for chart
  const chartData = fleet.map((v) => ({
    Vehicle: v.name,
    S: v.squd_means.S,
    Q: v.squd_means.Q,
    U: v.squd_means.U,
    D: v.squd_means.D,
    Health: v.health || (1.0 - v.squd_means.D) * 100,
  }));

  if (!enableFleet) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500">
          Enable fleet mode in sidebar to use fleet management features.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add to Fleet */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add to Fleet</h3>
        
        {/* Current Vehicle Option */}
        {currentVehicle && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Current Vehicle:</strong> {currentVehicle.name || 'Current Analysis'}
            </p>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
                placeholder={currentVehicle.name || "Vehicle Name"}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                onClick={handleAddToFleet}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Add Current Vehicle
              </button>
            </div>
          </div>
        )}

        {/* Demo Vehicle Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or select a demo vehicle:
          </label>
          <select
            value={selectedDemoVehicle}
            onChange={(e) => {
              const newValue = e.target.value;
              setSelectedDemoVehicle(newValue);
              if (newValue) {
                const demo = demoVehicles.find(v => v.id === newValue);
                // Populate the name field with the demo vehicle name
                setVehicleName(demo?.name || '');
              } else {
                // Clear name when no vehicle selected
                setVehicleName('');
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">-- Select Demo Vehicle --</option>
            {demoVehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name} - {vehicle.description}
              </option>
            ))}
          </select>
          {selectedDemoVehicle && (
            <div className="mt-2 flex items-center gap-4">
              <input
                type="text"
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
                placeholder="Vehicle Name (editable)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                onClick={handleAddToFleet}
                disabled={!vehicleName.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add Demo Vehicle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fleet Comparison */}
      {fleet.length > 0 && (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Fleet Comparison</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleExportFleet}
                  className="px-3 py-1 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Export Fleet Data
                </button>
                <button
                  onClick={handleClearFleet}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Clear Fleet
                </button>
              </div>
            </div>

            {/* Fleet Comparison Chart */}
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Vehicle" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="S" fill="#3b82f6" name="Stability (S)" />
                  <Bar dataKey="Q" fill="#10b981" name="Coherence (Q)" />
                  <Bar dataKey="U" fill="#f59e0b" name="Susceptibility (U)" />
                  <Bar dataKey="D" fill="#ef4444" name="Diagnostic (D)" />
                  <Bar dataKey="Health" fill="#8b5cf6" name="Health (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Fleet Summary Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Q
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      U
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      D
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Health
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Records
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fleet.map((vehicle, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {vehicle.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {vehicle.squd_means.S.toFixed(3)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {vehicle.squd_means.Q.toFixed(3)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {vehicle.squd_means.U.toFixed(3)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {vehicle.squd_means.D.toFixed(3)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {vehicle.health ? vehicle.health.toFixed(1) : ((1.0 - vehicle.squd_means.D) * 100).toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {vehicle.n_records || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleRemoveVehicle(idx)}
                          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          title="Remove vehicle from fleet"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fleet AI Interpretation */}
          {fleet.length >= 2 && (
            <div className="mt-6">
              <AIInterpretationCard
                interpretation={fleetAIInterpretation}
                loading={fleetAILoading}
                error={null}
              />
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {fleet.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-gray-500">
            No vehicles in fleet. Add current vehicle assessment to begin fleet comparison.
          </p>
        </div>
      )}
    </div>
  );
}

