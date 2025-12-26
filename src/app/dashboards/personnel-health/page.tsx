/**
 * Personnel Health Dashboard Page
 * Comprehensive dashboard for personnel resilience and organizational health
 */

'use client';

import React, { useState, useMemo } from 'react';
import { DashboardTemplate } from '@/components/dashboard/template/DashboardTemplate';
import { DashboardSection } from '@/components/dashboard/template/DashboardSection';
import { DashboardGrid } from '@/components/dashboard/template/DashboardSection';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { TimeSeriesChart } from '@/components/dashboard/TimeSeriesChart';
import { AIInterpretationCard } from '@/components/dashboard/AIInterpretation';
import { MaintenanceRecommendations } from '@/components/dashboard/MaintenanceRecommendations';
import { getConfigForDomain } from '@/lib/dashboard/config';
import { useDomainLabels } from '@/hooks/useDomainTerminology';
import { personnelApi } from '@/lib/api/personnel';
import { aiApi } from '@/lib/api/ai';
import type {
  PersonnelProfile,
  PersonnelAssessmentResponse,
  CompanyAggregateResponse,
  PersonnelTimeSeriesData,
} from '@/types/personnel';
import type { CHADD2OverlayConfig } from '@/types/dashboard';

export default function PersonnelHealthDashboard() {
  return <PersonnelHealthDashboardContent />;
}

function PersonnelHealthDashboardContent() {
  const domain = 'personnel';
  const config = getConfigForDomain(domain);
  const domainLabels = useDomainLabels(domain);

  const [viewMode, setViewMode] = useState<'personal' | 'company'>('personal');
  const [profiles, setProfiles] = useState<PersonnelProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<PersonnelProfile | null>(null);
  const [assessment, setAssessment] = useState<PersonnelAssessmentResponse | null>(null);
  const [companyAssessment, setCompanyAssessment] = useState<CompanyAggregateResponse | null>(null);
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

  // Example profiles
  const exampleProfiles: PersonnelProfile[] = [
    {
      name: 'Low Performance',
      employee_id: 'EMP-001',
      role: 'Engineer',
      metrics: {
        performance: 0.35,
        reliability: 0.4,
        collaboration: 0.45,
        learning: 0.3,
        well_being: 0.4,
        integrity: 0.6,
      },
      weight: 1.0,
    },
    {
      name: 'Expected Performance',
      employee_id: 'EMP-002',
      role: 'Manager',
      metrics: {
        performance: 0.6,
        reliability: 0.65,
        collaboration: 0.6,
        learning: 0.55,
        well_being: 0.6,
        integrity: 0.7,
      },
      weight: 1.0,
    },
    {
      name: 'High Performance',
      employee_id: 'EMP-003',
      role: 'Senior Engineer',
      metrics: {
        performance: 0.85,
        reliability: 0.9,
        collaboration: 0.8,
        learning: 0.85,
        well_being: 0.75,
        integrity: 0.9,
      },
      weight: 1.0,
    },
  ];

  // Generate demo time-series data
  const generateTimeSeriesData = (): PersonnelTimeSeriesData[] => {
    const data: PersonnelTimeSeriesData[] = [];
    const baseTime = new Date('2025-01-01T00:00:00Z');

    for (let i = 0; i < 100; i++) {
      const time = new Date(baseTime.getTime() + i * 86400000); // Daily intervals

      // Simulate realistic personnel metric variations
      const performance = 0.6 + Math.sin(i / 20) * 0.1 + Math.random() * 0.05;
      const reliability = 0.65 + Math.sin(i / 25) * 0.08 + Math.random() * 0.04;
      const collaboration = 0.6 + Math.sin(i / 18) * 0.12 + Math.random() * 0.06;
      const learning = 0.55 + Math.sin(i / 22) * 0.1 + Math.random() * 0.05;
      const well_being = 0.6 + Math.sin(i / 30) * 0.15 + Math.random() * 0.08;
      const integrity = 0.7 + Math.random() * 0.1;

      // Calculate S/Q/U/D (personnel SQUD)
      const metrics = { performance, reliability, collaboration, learning, well_being, integrity };
      const mean = Object.values(metrics).reduce((a, b) => a + b, 0) / Object.values(metrics).length;
      const variance =
        Object.values(metrics).reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        Object.values(metrics).length;
      const balance = 1.0 - Math.tanh(variance * 3.0);
      const S = 0.5 * reliability + 0.5 * integrity;
      const Q = 0.5 * collaboration + 0.5 * learning;
      const U = Math.max(0, Math.min(1, 1.0 - (0.5 * well_being + 0.5 * performance)));
      const D = 1 / (1 + Math.exp(-(0.5 * S + 0.3 * Math.log(Q + 0.01) - 0.4 * U)));

      data.push({
        timestamp: time.toISOString(),
        performance,
        reliability,
        collaboration,
        learning,
        well_being,
        integrity,
        S,
        Q,
        U,
        D,
        balance,
      });
    }

    return data;
  };

  const [timeSeriesData] = useState<PersonnelTimeSeriesData[]>(generateTimeSeriesData());

  const handleLoadExample = (profile: PersonnelProfile) => {
    setSelectedProfile(profile);
    setProfiles([profile]);
    setAssessment(null);
    setError(null);
  };

  const handleGenerateCompany = () => {
    const companyProfiles: PersonnelProfile[] = [];
    const roles = ['Engineering', 'Sales', 'Operations', 'HR', 'Finance', 'Support'];

    for (let i = 0; i < 25; i++) {
      const role = roles[i % roles.length];
      const basePerformance = 0.5 + Math.random() * 0.3;
      companyProfiles.push({
        name: `Employee ${i + 1}`,
        employee_id: `EMP-${String(i + 1).padStart(3, '0')}`,
        role,
        metrics: {
          performance: Math.max(0, Math.min(1, basePerformance + (role === 'Engineering' ? 0.05 : 0))),
          reliability: Math.max(0, Math.min(1, 0.5 + Math.random() * 0.3)),
          collaboration: Math.max(0, Math.min(1, 0.5 + Math.random() * 0.3)),
          learning: Math.max(0, Math.min(1, 0.5 + Math.random() * 0.3)),
          well_being: Math.max(0, Math.min(1, 0.5 + Math.random() * 0.3)),
          integrity: Math.max(0, Math.min(1, 0.6 + Math.random() * 0.2)),
        },
        weight: 0.8 + Math.random() * 0.4, // FTE weight between 0.8 and 1.2
      });
    }

    setProfiles(companyProfiles);
    setViewMode('company');
  };

  const handleAssess = async () => {
    if (viewMode === 'personal') {
      if (!selectedProfile) {
        setError('Please select a profile first');
        return;
      }

      setLoading(true);
      setError(null);
      setAIInterpretation(null);

      try {
        const result = await personnelApi.assessProfile({
          profile: selectedProfile,
          config: {
            business_name: 'demo-business',
          },
        });

        setAssessment(result);

        // Get AI interpretation if enabled
        if (enableAI && result) {
          setAILoading(true);
          try {
            const aiResult = await aiApi.interpretVehicle({
              domain: 'personnel',
              metrics: {
                balance_score: result.balance_score,
                performance: result.component_health?.performance,
                well_being: result.component_health?.well_being,
                risk_tier: result.risk_tier,
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
    } else {
      // Company aggregate assessment
      if (profiles.length === 0) {
        setError('Please generate or load company profiles first');
        return;
      }

      setLoading(true);
      setError(null);
      setAIInterpretation(null);

      try {
        const result = await personnelApi.assessCompany({
          profiles,
          config: {
            business_name: 'demo-business',
          },
        });

        setCompanyAssessment(result);

        // Get AI interpretation if enabled
        if (enableAI && result) {
          setAILoading(true);
          try {
            const aiResult = await aiApi.interpretVehicle({
              domain: 'personnel',
              metrics: {
                balance_score: result.balance_score,
                headcount: result.headcount,
                risk_tier: result.risk_tier,
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
    }
  };

  // Generate maintenance recommendations
  const getMaintenanceRecommendations = () => {
    if (viewMode === 'personal' && assessment) {
      const recommendations = [];
      if (assessment.recommendations && assessment.recommendations.length > 0) {
        assessment.recommendations.forEach((rec) => {
          const severity =
            rec.includes('critical') || rec.includes('urgent')
              ? ('critical' as const)
              : rec.includes('low') || rec.includes('concern')
                ? ('high' as const)
                : rec.includes('improvement') || rec.includes('needed')
                  ? ('medium' as const)
                  : ('low' as const);

          recommendations.push({
            component: 'Personnel Health',
            severity,
            message: rec,
            action: rec.includes('training')
              ? 'Implement training and development programs'
              : rec.includes('well-being')
                ? 'Review work-life balance and support programs'
                : rec.includes('collaboration')
                  ? 'Team building and communication improvements'
                  : 'Monitor and review metrics regularly',
          });
        });
      }

      if (assessment.risk_tier && (assessment.risk_tier === 'critical' || assessment.risk_tier === 'high')) {
        recommendations.push({
          component: 'Overall Risk',
          severity: assessment.risk_tier === 'critical' ? ('critical' as const) : ('high' as const),
          message: `Personnel at ${assessment.risk_tier} risk - immediate HR intervention needed`,
          action: 'Conduct comprehensive review and develop targeted action plan',
        });
      }

      if (recommendations.length === 0) {
        recommendations.push({
          component: 'Overall Health',
          severity: 'low' as const,
          message: 'All personnel metrics within healthy ranges',
          action: 'Continue current programs with regular monitoring',
        });
      }

      return recommendations;
    } else if (viewMode === 'company' && companyAssessment) {
      const recommendations = [];
      if (companyAssessment.recommendations && companyAssessment.recommendations.length > 0) {
        companyAssessment.recommendations.forEach((rec) => {
          const severity =
            rec.includes('critical') || rec.includes('urgent')
              ? ('critical' as const)
              : rec.includes('needed') || rec.includes('required')
                ? ('high' as const)
                : rec.includes('recommended') || rec.includes('suggested')
                  ? ('medium' as const)
                  : ('low' as const);

          recommendations.push({
            component: 'Organizational Health',
            severity,
            message: rec,
            action: rec.includes('programs')
              ? 'Implement company-wide programs'
              : rec.includes('interventions')
                ? 'Strategic HR interventions'
                : rec.includes('initiatives')
                  ? 'Organizational initiatives'
                  : 'Review and monitor',
          });
        });
      }

      if (
        companyAssessment.risk_tier &&
        (companyAssessment.risk_tier === 'critical' || companyAssessment.risk_tier === 'high')
      ) {
        recommendations.push({
          component: 'Overall Risk',
          severity: companyAssessment.risk_tier === 'critical' ? ('critical' as const) : ('high' as const),
          message: `Company at ${companyAssessment.risk_tier} risk - organizational intervention required`,
          action: 'Conduct comprehensive business review and develop strategic action plan',
        });
      }

      if (recommendations.length === 0) {
        recommendations.push({
          component: 'Overall Health',
          severity: 'low' as const,
          message: 'Company metrics within healthy ranges',
          action: 'Maintain current programs with regular monitoring',
        });
      }

      return recommendations;
    }

    return [];
  };

  const actions = [
    {
      id: 'assess',
      label: 'Run Assessment',
      icon: '▶️',
      onClick: handleAssess,
      variant: 'primary' as const,
      disabled: loading || (viewMode === 'personal' && !selectedProfile) || (viewMode === 'company' && profiles.length === 0),
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

  const currentAssessment = viewMode === 'personal' ? assessment : companyAssessment;

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

      {/* View Mode Toggle */}
      <DashboardSection title="View Mode" icon="👥">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => {
              setViewMode('personal');
              setAssessment(null);
              setCompanyAssessment(null);
              setSelectedProfile(null);
              setProfiles([]);
            }}
            className={`px-4 py-2 rounded-lg font-medium ${
              viewMode === 'personal'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Personal Profile
          </button>
          <button
            onClick={() => {
              setViewMode('company');
              setAssessment(null);
              setCompanyAssessment(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium ${
              viewMode === 'company'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Company Aggregate
          </button>
        </div>
      </DashboardSection>

      {/* Profile Selection / Company Generation */}
      {viewMode === 'personal' ? (
        <DashboardSection title="Select Profile" icon="👤">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Choose an example profile or load your own personnel data
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exampleProfiles.map((profile) => (
                <button
                  key={profile.employee_id}
                  onClick={() => handleLoadExample(profile)}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    selectedProfile?.employee_id === profile.employee_id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{profile.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{profile.role}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    Performance: {(profile.metrics.performance * 100).toFixed(0)}%
                  </div>
                </button>
              ))}
            </div>
          </div>
        </DashboardSection>
      ) : (
        <DashboardSection title="Company Profiles" icon="🏢">
          <div className="space-y-4">
            <button
              onClick={handleGenerateCompany}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Generate Demo Company (25 employees)
            </button>
            {profiles.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Loaded {profiles.length} employee profiles
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Total FTE Weight: {profiles.reduce((sum, p) => sum + (p.weight || 1.0), 0).toFixed(1)}
                </p>
              </div>
            )}
          </div>
        </DashboardSection>
      )}

      {/* Assessment Results */}
      {currentAssessment && (
        <>
          <MetricsCard
            squd={currentAssessment.squd_score}
            health={currentAssessment.health}
            title={
              viewMode === 'personal'
                ? `${selectedProfile?.name} Health Assessment`
                : `Company Health Assessment (${companyAssessment?.headcount} employees)`
            }
          />

          {/* Balance Score */}
          {currentAssessment.balance_score !== undefined && (
            <DashboardSection title="Ma'at Balance Score" icon="⚖️">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Balance Score</div>
                    <div className={`text-3xl font-bold ${
                      currentAssessment.balance_score > 0.7
                        ? 'text-green-600'
                        : currentAssessment.balance_score > 0.5
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }`}>
                      {currentAssessment.balance_score.toFixed(3)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {currentAssessment.balance_score > 0.7
                      ? 'Well Balanced'
                      : currentAssessment.balance_score > 0.5
                        ? 'Moderately Balanced'
                        : 'Imbalanced'}
                  </div>
                </div>
              </div>
            </DashboardSection>
          )}

          {/* Risk Tier */}
          {currentAssessment.risk_tier && (
            <DashboardSection title="Risk Assessment" icon="⚠️">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Risk Tier</div>
                    <div
                      className={`text-2xl font-bold capitalize ${
                        currentAssessment.risk_tier === 'critical'
                          ? 'text-red-600'
                          : currentAssessment.risk_tier === 'high'
                            ? 'text-orange-600'
                            : currentAssessment.risk_tier === 'medium'
                              ? 'text-yellow-600'
                              : 'text-green-600'
                      }`}
                    >
                      {currentAssessment.risk_tier}
                    </div>
                  </div>
                  {viewMode === 'company' && companyAssessment && (
                    <div>
                      <div className="text-sm text-gray-500">Headcount</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {companyAssessment.headcount}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DashboardSection>
          )}

          {/* Component Health */}
          {currentAssessment.component_health && (
            <DashboardSection
              title={viewMode === 'personal' ? 'Personnel Metrics' : 'Aggregate Metrics'}
              icon="📊"
            >
              <DashboardGrid cols={3} gap="md">
                {Object.entries(currentAssessment.component_health).map(([component, health]) => (
                  <DashboardSection key={component} variant="card" title={component.replace(/_/g, ' ').toUpperCase()}>
                    <div className="text-3xl font-bold text-primary-600">{health?.toFixed(0)}%</div>
                    <div className="text-sm text-gray-500 mt-1">Health Score</div>
                  </DashboardSection>
                ))}
              </DashboardGrid>
            </DashboardSection>
          )}

          {/* S/Q/U Mapping */}
          {currentAssessment.squ_mapping && (
            <DashboardSection title="S/Q/U Mapping" icon="🔍">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">{domainLabels.getSQUDLabel('S')}</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {currentAssessment.squ_mapping.S.toFixed(3)}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">{domainLabels.getSQUDLabel('Q')}</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {currentAssessment.squ_mapping.Q.toFixed(3)}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">{domainLabels.getSQUDLabel('U')}</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {currentAssessment.squ_mapping.U.toFixed(3)}
                  </div>
                </div>
              </div>
            </DashboardSection>
          )}
        </>
      )}

      {/* Metrics Display */}
      {selectedProfile && viewMode === 'personal' && (
        <DashboardSection title="Current Metrics" icon="📊">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(selectedProfile.metrics).map(([key, value]) => (
              <div key={key} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500">{key.replace(/_/g, ' ').toUpperCase()}</div>
                <div className="text-2xl font-bold text-gray-900">{(value * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </DashboardSection>
      )}

      {/* Time Series Charts */}
      {timeSeriesData.length > 0 && (
        <DashboardSection title="Personnel Trends" icon="📈">
          <div className="space-y-6">
            <TimeSeriesChart
              title="Performance & Reliability"
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'performance', name: 'Performance', color: '#3b82f6' },
                { key: 'reliability', name: 'Reliability', color: '#10b981' },
              ]}
              height={300}
            />
            <TimeSeriesChart
              title="Collaboration & Learning"
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'collaboration', name: 'Collaboration', color: '#8b5cf6' },
                { key: 'learning', name: 'Learning', color: '#ec4899' },
              ]}
              height={300}
            />
            <TimeSeriesChart
              title="Well-being & Integrity"
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'well_being', name: 'Well-being', color: '#06b6d4' },
                { key: 'integrity', name: 'Integrity', color: '#f59e0b' },
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
            {timeSeriesData[0]?.balance !== undefined && (
              <TimeSeriesChart
                title="Ma'at Balance Score"
                data={timeSeriesData as unknown as Array<Record<string, unknown>>}
                lines={[{ key: 'balance', name: 'Balance Score', color: '#7c3aed' }]}
                height={300}
              />
            )}
          </div>
        </DashboardSection>
      )}

      {/* AI Interpretation */}
      {enableAI && (
        <AIInterpretationCard interpretation={aiInterpretation} loading={aiLoading} />
      )}

      {/* Maintenance Recommendations */}
      {currentAssessment && (
        <MaintenanceRecommendations recommendations={getMaintenanceRecommendations()} />
      )}
    </DashboardTemplate>
  );
}


