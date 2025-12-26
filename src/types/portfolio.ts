/**
 * Portfolio Risk Management Types
 * Types for portfolio analysis and recommendations
 */

export interface Holding {
  ticker: string;
  company_name: string;
  weight?: number;
  sector?: string;
  current_price?: number;
}

export interface SQUDMetrics {
  S: number;
  Q: number;
  U: number;
  D: number;
}

export interface HoldingMetrics {
  avg_return: number;
  volatility: number;
  sharpe_ratio: number;
  max_drawdown: number;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  close: number;
  volume: number;
  returns: number;
  S: number;
  Q: number;
  U: number;
  D: number;
}

export interface RiskMetrics {
  VaR?: number;
  CVaR?: number;
  max_drawdown?: number;
  avg_volatility?: number;
  PD?: number;
  EL?: number;
  PD_VaR?: number;
}

export interface ProblemFlag {
  severity: 'critical' | 'warning' | 'info';
  category: 'stability' | 'coherence' | 'susceptibility' | 'diagnostic' | 'resilience';
  message: string;
  recommendation: string;
}

export interface OpportunityFlag {
  severity: 'high' | 'medium' | 'low';
  category: 'stability_momentum' | 'coherence_momentum' | 'risk_reduction' | 'health_improvement' | 'undervalued_quality' | 'recovery_play' | 'multi_metric_momentum';
  message: string;
  recommendation: string;
}

export interface InvestmentSignal {
  signal: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';
  strength: number;
  rationale: string;
  problems: ProblemFlag[];
  opportunities: OpportunityFlag[];
}

export interface HoldingAnalysis {
  ticker: string;
  company_name: string;
  squd: SQUDMetrics;
  squd_stressed?: SQUDMetrics;
  resilience_score: number;
  time_series_data: TimeSeriesDataPoint[];
  metrics: HoldingMetrics;
  risk_metrics?: RiskMetrics;
  investment_signal?: InvestmentSignal;
  problems?: ProblemFlag[];
  opportunities?: OpportunityFlag[];
  seasonal_decomposition?: any;
  anomalies?: any;
  analyzed_at: string;
}

export interface TopRecommendation {
  rank: number;
  ticker: string;
  company_name: string;
  squd: SQUDMetrics;
  resilience_score: number;
  metrics: HoldingMetrics;
  rationale?: string;
  aiAnalysis?: string;
}

export interface TopRecommendationsResponse {
  timeframe: string;
  analysis_type: string;
  total_holdings_analyzed: number;
  recommendations: {
    long_term?: TopRecommendation[];
    short_term?: TopRecommendation[];
  };
  portfolio_risk?: RiskMetrics;
  generated_at: string;
}

export interface AnalyzeHoldingRequest {
  ticker: string;
  timeframe: '1y' | '3y' | '5y' | '10y';
  chadd2_config?: {
    enabled?: boolean;
    model_type?: 'auto' | 'original' | 'updated';
    fibonacci_overlay?: boolean;
    lambda_fib?: number;
    w_phi?: number;
  };
}

export interface TopRecommendationsRequest {
  timeframe: '1y' | '3y' | '5y' | '10y';
  analysis_type: 'long-term' | 'short-term' | 'both';
  chadd2_config?: {
    enabled?: boolean;
    model_type?: 'auto' | 'original' | 'updated';
    fibonacci_overlay?: boolean;
    lambda_fib?: number;
    w_phi?: number;
  };
}

export interface MarketScanRequest {
  sectors?: string[];
  min_market_cap?: number;
  max_results?: number;
  timeframe?: '1y' | '3y' | '5y' | '10y';
  chadd2_config?: {
    enabled?: boolean;
    model_type?: 'auto' | 'original' | 'updated';
    fibonacci_overlay?: boolean;
    lambda_fib?: number;
    w_phi?: number;
  };
}

export interface BuyRecommendation {
  action: string;
  position_size: string;
  conviction: string;
  entry_strategy: string;
  target_price_range: string;
  rationale: string;
}

export interface MarketOpportunity {
  ticker: string;
  company_name: string;
  sector?: string;
  market_cap?: number;
  current_price?: number;
  intrinsic_value_estimate?: number;
  discount_to_value?: number;
  squd: SQUDMetrics;
  resilience_score: number;
  metrics: HoldingMetrics;
  opportunity_type: 'long-term' | 'medium-term' | 'short-term';
  rationale?: string;
  buy_recommendation?: BuyRecommendation;
}

export interface MarketScanResponse {
  opportunities: MarketOpportunity[];
  total_scanned: number;
  generated_at: string;
}

export interface AskCHADDRequest {
  question: string;
  context?: Record<string, unknown>;
  ticker?: string;
}

export interface AskCHADDResponse {
  answer: string;
  recommendations?: Array<Record<string, unknown>>;
  generated_at: string;
}

export interface IndexInfo {
  id: string;
  name: string;
  ticker: string;
  description: string;
  category: 'US_Broad_Market' | 'US_Small_Cap' | 'Sector' | 'Global' | 'Custom';
}

export interface BenchmarkComparisonRequest {
  index_id: string;
  timeframe: '1y' | '3y' | '5y' | '10y';
  holdings: Holding[];
  chadd2_config?: {
    enabled?: boolean;
    model_type?: 'auto' | 'original' | 'updated';
    fibonacci_overlay?: boolean;
    lambda_fib?: number;
    w_phi?: number;
  };
}

export interface PortfolioAnalysisSummary {
  total_return: number;
  volatility: number;
  sharpe_ratio: number;
  max_drawdown: number;
  squd: SQUDMetrics;
  resilience_score: number;
}

export interface ComparisonMetrics {
  excess_return: number;
  tracking_error: number;
  information_ratio: number;
  beta: number;
  alpha: number;
  correlation: number;
}

export interface BenchmarkComparison {
  index_info: IndexInfo;
  index_analysis: HoldingAnalysis;
  portfolio_analysis: PortfolioAnalysisSummary;
  comparison_metrics: ComparisonMetrics;
  generated_at: string;
}

export interface AnalyzeIndexRequest {
  index_id: string;
  timeframe: '1y' | '3y' | '5y' | '10y';
  chadd2_config?: {
    enabled?: boolean;
    model_type?: 'auto' | 'original' | 'updated';
    fibonacci_overlay?: boolean;
    lambda_fib?: number;
    w_phi?: number;
  };
}

