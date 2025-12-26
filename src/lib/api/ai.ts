/**
 * AI Interpretation API Client
 * Methods for getting AI analysis and interpretation
 */

import { apiClient } from './client';

export interface AIInterpretationRequest {
  domain: string;
  metrics: Record<string, unknown>;
  squd_means?: Record<string, number>;
  chadd_results?: Record<string, unknown>;
  telemetry_summary?: Record<string, unknown>;
  use_graphrag?: boolean;
}

export interface AIInterpretationResponse {
  text: string;
  key_insights?: string[];
  recommendations?: string[];
  confidence?: number;
}

export interface PortfolioInterpretationRequest {
  ticker: string;
  company_name: string;
  squd: Record<string, number>;
  squd_stressed?: Record<string, number>;
  resilience_score: number;
  metrics: Record<string, number>;
  timeframe: string;
  analysis_type: 'long-term' | 'short-term';
}

export const aiApi = {
  /**
   * Get AI interpretation for vehicle assessment
   */
  async interpretVehicle(
    request: AIInterpretationRequest
  ): Promise<AIInterpretationResponse> {
    try {
      // Try the correct API endpoint format
      const domainMap: Record<string, string> = {
        'gas_vehicle': 'gas',
        'electric_vehicle': 'electric',
        'gas-vehicle': 'gas',
        'electric-vehicle': 'electric',
        'software': 'software',
        'medical': 'medical',
        'solar': 'solar',
        'wind': 'wind',
        'industrial': 'industrial',
      };
      
      // Software and other non-vehicle domains use different endpoint structure
      const isVehicleDomain = ['gas', 'electric', 'gas_vehicle', 'electric_vehicle', 'gas-vehicle', 'electric-vehicle'].includes(request.domain);
      
      let endpoint: string;
      if (isVehicleDomain) {
        const domainPath = domainMap[request.domain] || request.domain.replace('_', '-');
        endpoint = `/api/v1/vehicle/${domainPath}/interpret`;
      } else {
        // For non-vehicle domains, use domain-specific endpoint
        const domainPath = domainMap[request.domain] || request.domain.replace('_', '-');
        endpoint = `/api/v1/${domainPath}/interpret`;
      }
      
      const response = await apiClient.post<AIInterpretationResponse>(
        endpoint,
        request
      );
      return response;
    } catch (error: unknown) {
      // Fallback: generate interpretation from metrics
      // Check for ApiError format (from apiClient) or standard error
      const is404 = 
        (typeof error === 'object' && error !== null && 'status_code' in error && (error as { status_code: number }).status_code === 404) ||
        (error instanceof Error && (error.message.includes('404') || error.message.includes('Not Found')));
      
      const is500 = 
        (typeof error === 'object' && error !== null && 'status_code' in error && (error as { status_code: number }).status_code === 500) ||
        (error instanceof Error && error.message.includes('500'));
      
      // Always use fallback for 404/500 - this is expected when API endpoint doesn't exist yet
      if (is404 || is500) {
        return this._generateVehicleInterpretation(request);
      }
      
      // For other errors, still use fallback but log as warning
      console.warn('AI interpretation unexpected error:', error);
      return this._generateVehicleInterpretation(request);
    }
  },

  /**
   * Generate vehicle interpretation from metrics (fallback)
   */
  _generateVehicleInterpretation(
    request: AIInterpretationRequest
  ): AIInterpretationResponse {
    const { domain, metrics, squd_means, telemetry_summary } = request;
    
    const insights: string[] = [];
    const recommendations: string[] = [];
    
    if (squd_means) {
      // Analyze S/Q/U/D metrics
      if (squd_means.S > 0.7) {
        insights.push(`Strong stability (S=${squd_means.S.toFixed(2)}) indicates reliable engine performance`);
      } else if (squd_means.S < 0.4) {
        insights.push(`Low stability (S=${squd_means.S.toFixed(2)}) suggests engine instability - investigate vibration sources`);
        recommendations.push('Check engine mounts, verify oil quality, inspect for mechanical issues');
      }
      
      if (squd_means.Q > 0.7) {
        insights.push(`High coherence pressure (Q=${squd_means.Q.toFixed(2)}) indicates combustion system stress`);
        recommendations.push('Inspect air-fuel mixture, check O2 sensors, verify fuel quality');
      }
      
      if (squd_means.U < 0.3) {
        insights.push(`Low susceptibility (U=${squd_means.U.toFixed(2)}) suggests good resistance to thermal stress`);
      } else if (squd_means.U > 0.6) {
        insights.push(`High susceptibility (U=${squd_means.U.toFixed(2)}) indicates thermal management concerns`);
        recommendations.push('Check cooling system, inspect radiator, verify coolant levels');
      }
      
      if (squd_means.D > 0.7) {
        insights.push(`High diagnostic score (D=${squd_means.D.toFixed(2)}) indicates declining engine health`);
        recommendations.push('Schedule comprehensive diagnostic - immediate attention recommended');
      }
    }
    
    if (domain.includes('gas') && metrics) {
      if (metrics.combustion_quality && metrics.combustion_quality < 0.7) {
        insights.push('Combustion quality below optimal - air-fuel mixture may need adjustment');
      }
      if (metrics.thermal_stress && metrics.thermal_stress > 0.6) {
        insights.push('Elevated thermal stress detected - monitor cooling system closely');
      }
    }
    
    if (domain.includes('electric') && metrics) {
      if (metrics.battery_health && metrics.battery_health < 70) {
        insights.push('Battery health declining - consider battery pack inspection');
      }
      if (metrics.motor_health && metrics.motor_health < 70) {
        insights.push('Motor health below optimal - inspect motor bearings and cooling');
      }
    }
    
    // Generate summary text
    const summary = `${domain.replace('_', ' ').replace(/-/g, ' ')} health assessment: ` +
      (squd_means ? `Stability (S=${squd_means.S.toFixed(2)}), Coherence (Q=${squd_means.Q.toFixed(2)}), ` +
      `Susceptibility (U=${squd_means.U.toFixed(2)}), Diagnostic (D=${squd_means.D.toFixed(2)}). ` : '') +
      (insights.length > 0 ? insights.join(' ') : 'System operating within normal parameters.');
    
    return {
      text: summary,
      key_insights: insights,
      recommendations: recommendations.length > 0 ? recommendations : ['Continue regular maintenance schedule'],
      confidence: 0.8,
    };
  },

  /**
   * Get AI interpretation for portfolio holding
   */
  async interpretPortfolioHolding(
    request: PortfolioInterpretationRequest
  ): Promise<AIInterpretationResponse> {
    try {
      const response = await apiClient.post<AIInterpretationResponse>(
        '/api/v1/portfolio/interpret',
        request
      );
      return response;
    } catch (error) {
      // Fallback: generate interpretation based on metrics
      if (error instanceof Error && (error.message.includes('404') || error.message.includes('500'))) {
        return this._generatePortfolioInterpretation(request);
      }
      throw error;
    }
  },

  /**
   * Generate portfolio interpretation from metrics (fallback)
   */
  _generatePortfolioInterpretation(
    request: PortfolioInterpretationRequest
  ): AIInterpretationResponse {
    const { ticker, company_name, squd, resilience_score, metrics, analysis_type } = request;
    
    const insights: string[] = [];
    const recommendations: string[] = [];
    
    // Analyze S/Q/U/D metrics
    if (squd.S > 0.7) {
      insights.push(`${company_name} (${ticker}) demonstrates strong stability (S=${squd.S.toFixed(2)})`);
    } else if (squd.S < 0.4) {
      insights.push(`${company_name} (${ticker}) shows concerning stability issues (S=${squd.S.toFixed(2)})`);
    }
    
    if (squd.Q > 0.7) {
      insights.push(`High coherence (Q=${squd.Q.toFixed(2)}) indicates consistent operational performance`);
    }
    
    if (squd.U < 0.3) {
      insights.push(`Low susceptibility (U=${squd.U.toFixed(2)}) suggests resilience to market shocks`);
    } else if (squd.U > 0.6) {
      insights.push(`High susceptibility (U=${squd.U.toFixed(2)}) indicates sensitivity to market volatility`);
    }
    
    if (resilience_score > 0.7) {
      insights.push(`Strong resilience score (${resilience_score.toFixed(2)}) indicates ability to maintain stability under stress`);
    }
    
    // Analysis type specific insights
    if (analysis_type === 'long-term') {
      if (resilience_score > 0.7 && squd.S > 0.6) {
        recommendations.push('Strong candidate for long-term value investment based on stability and resilience');
      }
      if (metrics.sharpe_ratio > 1.0) {
        recommendations.push(`Favorable risk-adjusted returns (Sharpe: ${metrics.sharpe_ratio.toFixed(2)})`);
      }
    } else {
      if (metrics.avg_return > 0.05 && metrics.volatility < 0.3) {
        recommendations.push('Potential short-term opportunity with positive returns and manageable volatility');
      }
      if (metrics.max_drawdown < 0.2) {
        recommendations.push(`Limited downside risk (max drawdown: ${(metrics.max_drawdown * 100).toFixed(1)}%)`);
      }
    }
    
    // Generate summary text
    const summary = `${company_name} (${ticker}) analysis for ${analysis_type} investment: ` +
      `Stability (S=${squd.S.toFixed(2)}), Coherence (Q=${squd.Q.toFixed(2)}), ` +
      `Susceptibility (U=${squd.U.toFixed(2)}), Diagnostic (D=${squd.D.toFixed(2)}). ` +
      `Resilience score: ${resilience_score.toFixed(2)}. ` +
      `Average return: ${(metrics.avg_return * 100).toFixed(2)}%, ` +
      `Volatility: ${(metrics.volatility * 100).toFixed(2)}%, ` +
      `Sharpe ratio: ${metrics.sharpe_ratio.toFixed(2)}.`;
    
    return {
      text: summary,
      key_insights: insights,
      recommendations: recommendations.length > 0 ? recommendations : ['Continue monitoring for optimal entry/exit points'],
      confidence: 0.75,
    };
  },
};

