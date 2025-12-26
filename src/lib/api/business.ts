/**
 * Business Domain API Client
 */

import type { BusinessAssessmentRequest, BusinessAssessmentResponse } from '@/types/business';

/**
 * Business API methods
 */
export const businessApi = {
  /**
   * Assess business health
   */
  async assessCompany(request: BusinessAssessmentRequest): Promise<BusinessAssessmentResponse> {
    // For now, simulate the response until backend API is available
    // TODO: Replace with actual API call when endpoint is available
    const response = await fetch('/api/v1/business/companies/assess', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      // Fallback to demo data if API not available
      return generateDemoAssessment(request);
    }

    return response.json();
  },
};

/**
 * Generate demo assessment (fallback when API not available)
 */
function generateDemoAssessment(request: BusinessAssessmentRequest): BusinessAssessmentResponse {
  const { kpis } = request;
  
  // Calculate S/Q/U/D based on business health model
  // S: Stability - financial stability and consistency
  const revenueStability = kpis.revenue_growth > 0.05 && kpis.revenue_growth < 0.5 ? 0.9 :
                           kpis.revenue_growth > 0 && kpis.revenue_growth < 1.0 ? 0.7 : 0.5;
  const marginStability = kpis.gross_margin > 0.6 ? 0.9 : kpis.gross_margin > 0.4 ? 0.7 : 0.5;
  const cashStability = kpis.cash_runway_months > 12 ? 0.9 : kpis.cash_runway_months > 6 ? 0.7 : 0.5;
  const S = (revenueStability * 0.4 + marginStability * 0.3 + cashStability * 0.3);
  
  // Q: Quality - operational quality and efficiency
  const retentionQuality = kpis.net_revenue_retention > 1.0 ? 0.9 : kpis.net_revenue_retention > 0.9 ? 0.7 : 0.5;
  const efficiencyQuality = kpis.ltv_cac > 3 ? 0.9 : kpis.ltv_cac > 2 ? 0.7 : 0.5;
  const npsQuality = kpis.nps > 50 ? 0.9 : kpis.nps > 30 ? 0.7 : 0.5;
  const Q = (retentionQuality * 0.4 + efficiencyQuality * 0.3 + npsQuality * 0.3);
  
  // U: Urgency - risk factors and pressure indicators
  const churnPressure = Math.min(1.0, kpis.churn_rate / 0.1); // Normalize to 10% churn = max
  const burnPressure = Math.min(1.0, kpis.burn_multiple / 2.0); // Normalize to 2x = max
  const cashPressure = Math.min(1.0, 1 - (kpis.cash_runway_months / 24)); // 24 months = no pressure
  const cyclePressure = Math.min(1.0, kpis.sales_cycle_days / 120); // 120 days = max
  const U = (churnPressure * 0.3 + burnPressure * 0.3 + cashPressure * 0.2 + cyclePressure * 0.2);
  
  // D: Diagnostic (CHADD formula)
  const D = 1 / (1 + Math.exp(-(0.5 * S + 0.3 * Math.log(Q + 0.01) - 0.4 * U)));
  
  const health = Math.round((1 - D) * 100);
  
  // Determine risk tier
  const riskScore = U * 0.4 + (1 - S) * 0.3 + (1 - Q) * 0.2 + D * 0.1;
  const riskTier = riskScore > 0.7 ? 'critical' :
                   riskScore > 0.5 ? 'high' :
                   riskScore > 0.3 ? 'medium' : 'low';
  
  // Calculate component health
  const componentHealth = {
    revenue: Math.max(0, Math.min(100, revenueStability * 100)),
    profitability: Math.max(0, Math.min(100, marginStability * 100)),
    retention: Math.max(0, Math.min(100, retentionQuality * 100)),
    efficiency: Math.max(0, Math.min(100, efficiencyQuality * 100)),
    cash_management: Math.max(0, Math.min(100, cashStability * 100)),
  };
  
  // Calculate health scores
  const financialHealth = (componentHealth.revenue * 0.3 + 
                           componentHealth.profitability * 0.3 + 
                           componentHealth.cash_management * 0.4) / 100;
  const operationalHealth = (componentHealth.retention * 0.5 + 
                            componentHealth.efficiency * 0.5) / 100;
  const growthHealth = (kpis.revenue_growth > 0.1 ? 0.9 : kpis.revenue_growth > 0.05 ? 0.7 : 0.5);
  
  // Determine market position
  const marketPosition = kpis.ltv_cac > 3 && kpis.net_revenue_retention > 1.1 ? 'strong' :
                         kpis.ltv_cac > 2 && kpis.net_revenue_retention > 1.0 ? 'good' :
                         kpis.ltv_cac > 1.5 ? 'moderate' : 'weak';
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (kpis.churn_rate > 0.1) {
    recommendations.push(`High churn rate (${(kpis.churn_rate * 100).toFixed(1)}%) - focus on customer retention`);
  }
  if (kpis.cash_runway_months < 6) {
    recommendations.push(`Low cash runway (${kpis.cash_runway_months.toFixed(1)} months) - urgent fundraising needed`);
  }
  if (kpis.burn_multiple > 2.0) {
    recommendations.push(`High burn multiple (${kpis.burn_multiple.toFixed(1)}x) - optimize spending efficiency`);
  }
  if (kpis.ltv_cac < 2.0) {
    recommendations.push(`Low LTV:CAC ratio (${kpis.ltv_cac.toFixed(1)}) - improve unit economics`);
  }
  if (kpis.net_revenue_retention < 1.0) {
    recommendations.push(`Net revenue retention below 100% (${(kpis.net_revenue_retention * 100).toFixed(1)}%) - focus on expansion revenue`);
  }
  if (recommendations.length === 0) {
    recommendations.push('All business metrics within healthy ranges - continue current strategy');
  }
  
  return {
    squd_score: { S, Q, U, D },
    health,
    assessed_at: new Date().toISOString(),
    company_id: request.company_id,
    assessment_id: `biz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    financial_health: financialHealth,
    operational_health: operationalHealth,
    growth_health: growthHealth,
    risk_tier: riskTier,
    component_health: componentHealth,
    business_metrics: {
      growth_score: growthHealth,
      efficiency_score: operationalHealth,
      sustainability_score: financialHealth,
      market_position: marketPosition,
    },
    recommendations,
  };
}

