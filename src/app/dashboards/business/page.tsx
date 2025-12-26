/**
 * Business Health Dashboard Page
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
import { businessApi } from '@/lib/api/business';
import { aiApi } from '@/lib/api/ai';
import type {
  BusinessKPIs,
  BusinessAssessmentResponse,
  BusinessTimeSeriesData,
} from '@/types/business';
import type { CHADD2OverlayConfig } from '@/types/dashboard';

export default function BusinessDashboard() {
  return <BusinessDashboardContent />;
}

function BusinessDashboardContent() {
  const domain = 'business';
  const config = getConfigForDomain(domain);
  const domainLabels = useDomainLabels(domain);
  
  const [companyId] = useState('demo-company-1');
  const [assessment, setAssessment] = useState<BusinessAssessmentResponse | null>(null);
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

  // Demo KPI data
  const [demoKPIs] = useState<BusinessKPIs>({
    revenue_growth: 0.18, // 18%
    gross_margin: 0.72, // 72%
    net_revenue_retention: 1.12, // 112%
    churn_rate: 0.08, // 8%
    cac_payback_months: 14,
    ltv_cac: 3.5,
    nps: 45,
    burn_multiple: 1.2,
    cash_runway_months: 18,
    arpu: 120.50,
    sales_cycle_days: 62,
    pipeline_coverage: 1.4,
    employee_satisfaction: 0.76,
    employee_retention: 0.90,
    leadership_retention: 0.88,
    rotation_rate: 0.12,
  });

  // Generate demo time-series data
  const generateTimeSeriesData = (): BusinessTimeSeriesData[] => {
    const data: BusinessTimeSeriesData[] = [];
    const baseTime = new Date('2025-01-01T00:00:00Z');
    
    for (let i = 0; i < 100; i++) {
      const time = new Date(baseTime.getTime() + i * 86400000); // Daily intervals
      
      // Simulate realistic business metric variations
      const revenueGrowth = 0.15 + Math.sin(i / 20) * 0.05 + Math.random() * 0.02;
      const grossMargin = 0.70 + Math.sin(i / 25) * 0.03 + Math.random() * 0.01;
      const churnRate = 0.08 + Math.sin(i / 30) * 0.02 + Math.random() * 0.01;
      const ltvCac = 3.2 + Math.sin(i / 18) * 0.5 + Math.random() * 0.2;
      const cashRunway = 18 + Math.sin(i / 15) * 3 + Math.random() * 1;
      
      // Calculate S/Q/U/D (simplified business SQUD)
      const revenueStability = revenueGrowth > 0.05 && revenueGrowth < 0.5 ? 0.9 :
                               revenueGrowth > 0 && revenueGrowth < 1.0 ? 0.7 : 0.5;
      const marginStability = grossMargin > 0.6 ? 0.9 : grossMargin > 0.4 ? 0.7 : 0.5;
      const cashStability = cashRunway > 12 ? 0.9 : cashRunway > 6 ? 0.7 : 0.5;
      const S = (revenueStability * 0.4 + marginStability * 0.3 + cashStability * 0.3);
      
      const retentionQuality = 1.12 > 1.0 ? 0.9 : 1.12 > 0.9 ? 0.7 : 0.5;
      const efficiencyQuality = ltvCac > 3 ? 0.9 : ltvCac > 2 ? 0.7 : 0.5;
      const Q = (retentionQuality * 0.5 + efficiencyQuality * 0.5);
      
      const churnPressure = Math.min(1.0, churnRate / 0.1);
      const cashPressure = Math.min(1.0, 1 - (cashRunway / 24));
      const U = (churnPressure * 0.5 + cashPressure * 0.5);
      
      const D = 1 / (1 + Math.exp(-(0.5 * S + 0.3 * Math.log(Q + 0.01) - 0.4 * U)));
      
      data.push({
        timestamp: time.toISOString(),
        revenue_growth: revenueGrowth,
        gross_margin: grossMargin,
        churn_rate: churnRate,
        ltv_cac: ltvCac,
        cash_runway_months: cashRunway,
        S,
        Q,
        U,
        D,
      });
    }
    
    return data;
  };

  const [timeSeriesData] = useState<BusinessTimeSeriesData[]>(generateTimeSeriesData());

  const handleAssess = async () => {
    setLoading(true);
    setError(null);
    setAIInterpretation(null);

    try {
      const result = await businessApi.assessCompany({
        company_id: companyId,
        kpis: demoKPIs,
        config: {
          industry: 'SaaS',
          stage: 'growth',
          target_ltv_cac: 3.0,
          target_churn: 0.05,
        },
      });
      
      setAssessment(result);

      // Get AI interpretation if enabled
      if (enableAI && result) {
        setAILoading(true);
        try {
          const aiResult = await aiApi.interpretVehicle({
            domain: 'business',
            metrics: {
              financial_health: result.financial_health,
              operational_health: result.operational_health,
              growth_health: result.growth_health,
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
    
    if (assessment.recommendations && assessment.recommendations.length > 0) {
      assessment.recommendations.forEach(rec => {
        const severity = rec.includes('urgent') || rec.includes('critical') ? 'critical' as const :
                         rec.includes('high') || rec.includes('low cash') ? 'high' as const :
                         rec.includes('focus') || rec.includes('improve') ? 'medium' as const :
                         'low' as const;
        
        recommendations.push({
          component: 'Business Operations',
          severity,
          message: rec,
          action: rec.includes('fundraising') ? 'Initiate fundraising process' :
                 rec.includes('retention') ? 'Develop customer retention strategy' :
                 rec.includes('spending') ? 'Review and optimize spending' :
                 rec.includes('economics') ? 'Improve unit economics' :
                 'Review and monitor',
        });
      });
    }
    
    if (assessment.risk_tier && (assessment.risk_tier === 'critical' || assessment.risk_tier === 'high')) {
      recommendations.push({
        component: 'Overall Risk',
        severity: assessment.risk_tier === 'critical' ? 'critical' as const : 'high' as const,
        message: `Company at ${assessment.risk_tier} risk - immediate strategic review recommended`,
        action: 'Conduct comprehensive business review and develop action plan',
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        component: 'Overall Health',
        severity: 'low' as const,
        message: 'All business metrics within healthy ranges',
        action: 'Continue current strategy with regular monitoring',
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
            title="Business Health Assessment"
          />

          {/* Health Scores */}
          <DashboardSection title="Health Scores" icon="📊">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500">Financial Health</div>
                <div className="text-2xl font-bold text-gray-900">
                  {assessment.financial_health ? (assessment.financial_health * 100).toFixed(1) : 'N/A'}%
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500">Operational Health</div>
                <div className="text-2xl font-bold text-gray-900">
                  {assessment.operational_health ? (assessment.operational_health * 100).toFixed(1) : 'N/A'}%
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500">Growth Health</div>
                <div className="text-2xl font-bold text-gray-900">
                  {assessment.growth_health ? (assessment.growth_health * 100).toFixed(1) : 'N/A'}%
                </div>
              </div>
            </div>
          </DashboardSection>

          {/* Risk Tier Display */}
          {assessment.risk_tier && (
            <DashboardSection title="Risk Assessment" icon="⚠️">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Risk Tier</div>
                    <div className={`text-2xl font-bold capitalize ${
                      assessment.risk_tier === 'critical' ? 'text-red-600' :
                      assessment.risk_tier === 'high' ? 'text-orange-600' :
                      assessment.risk_tier === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {assessment.risk_tier}
                    </div>
                  </div>
                  {assessment.business_metrics?.market_position && (
                    <div>
                      <div className="text-sm text-gray-500">Market Position</div>
                      <div className="text-2xl font-bold text-gray-900 capitalize">
                        {assessment.business_metrics.market_position}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DashboardSection>
          )}

          {/* Component Health Grid */}
          {assessment.component_health && (
            <DashboardSection title="Component Health" icon="📈">
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

          {/* Business Metrics */}
          {assessment.business_metrics && (
            <DashboardSection title="Business Metrics" icon="💼">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Growth Score</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(assessment.business_metrics.growth_score! * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Efficiency Score</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(assessment.business_metrics.efficiency_score! * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Sustainability Score</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(assessment.business_metrics.sustainability_score! * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Market Position</div>
                  <div className="text-2xl font-bold text-gray-900 capitalize">
                    {assessment.business_metrics.market_position}
                  </div>
                </div>
              </div>
            </DashboardSection>
          )}
        </>
      )}

      {/* KPI Display */}
      <DashboardSection title="Current KPIs" icon="📊">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Revenue Growth</div>
            <div className="text-2xl font-bold text-gray-900">{(demoKPIs.revenue_growth * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Gross Margin</div>
            <div className="text-2xl font-bold text-gray-900">{(demoKPIs.gross_margin * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Net Revenue Retention</div>
            <div className="text-2xl font-bold text-gray-900">{(demoKPIs.net_revenue_retention * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Churn Rate</div>
            <div className="text-2xl font-bold text-gray-900">{(demoKPIs.churn_rate * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">LTV:CAC Ratio</div>
            <div className="text-2xl font-bold text-gray-900">{demoKPIs.ltv_cac.toFixed(1)}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">CAC Payback</div>
            <div className="text-2xl font-bold text-gray-900">{demoKPIs.cac_payback_months.toFixed(0)} months</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Cash Runway</div>
            <div className="text-2xl font-bold text-gray-900">{demoKPIs.cash_runway_months.toFixed(0)} months</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Burn Multiple</div>
            <div className="text-2xl font-bold text-gray-900">{demoKPIs.burn_multiple.toFixed(1)}x</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">NPS</div>
            <div className="text-2xl font-bold text-gray-900">{demoKPIs.nps}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">ARPU</div>
            <div className="text-2xl font-bold text-gray-900">${demoKPIs.arpu.toFixed(2)}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Sales Cycle</div>
            <div className="text-2xl font-bold text-gray-900">{demoKPIs.sales_cycle_days.toFixed(0)} days</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Pipeline Coverage</div>
            <div className="text-2xl font-bold text-gray-900">{demoKPIs.pipeline_coverage.toFixed(1)}x</div>
          </div>
        </div>
      </DashboardSection>

      {/* Time Series Charts */}
      {timeSeriesData.length > 0 && (
        <DashboardSection title="Business Trends" icon="📈">
          <div className="space-y-6">
            <TimeSeriesChart
              title="Financial Metrics"
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'revenue_growth', name: 'Revenue Growth', color: '#3b82f6' },
                { key: 'gross_margin', name: 'Gross Margin', color: '#10b981' },
              ]}
              height={300}
            />
            <TimeSeriesChart
              title="Risk Indicators"
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'churn_rate', name: 'Churn Rate', color: '#d62728' },
                { key: 'cash_runway_months', name: 'Cash Runway (months)', color: '#f59e0b' },
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

