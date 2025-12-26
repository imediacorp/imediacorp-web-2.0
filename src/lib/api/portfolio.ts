/**
 * Portfolio Risk Management API Client
 */

import { apiClient } from './client';
import type {
  Holding,
  HoldingAnalysis,
  TopRecommendationsResponse,
  AnalyzeHoldingRequest,
  TopRecommendationsRequest,
  MarketScanRequest,
  MarketScanResponse,
  AskCHADDRequest,
  AskCHADDResponse,
  IndexInfo,
  AnalyzeIndexRequest,
  BenchmarkComparisonRequest,
  BenchmarkComparison,
} from '@/types/portfolio';

/**
 * Portfolio API methods
 */
export const portfolioApi = {
  /**
   * Get list of Berkshire Hathaway holdings
   */
  async getBerkshireHoldings(): Promise<Holding[]> {
    try {
      const response = await apiClient.get<Holding[]>('/api/v1/portfolio/berkshire-holdings');
      return response;
    } catch (error) {
      console.error('Error fetching Berkshire holdings:', error);
      // Return fallback data if API unavailable
      return [
        { ticker: 'AAPL', company_name: 'Apple Inc.', weight: 0.50 },
        { ticker: 'BAC', company_name: 'Bank of America Corp', weight: 0.10 },
        { ticker: 'KO', company_name: 'The Coca-Cola Company', weight: 0.08 },
        { ticker: 'AXP', company_name: 'American Express Co', weight: 0.07 },
        { ticker: 'CVX', company_name: 'Chevron Corporation', weight: 0.06 },
      ];
    }
  },

  /**
   * Analyze a single holding
   */
  async analyzeHolding(request: AnalyzeHoldingRequest): Promise<HoldingAnalysis> {
    try {
      console.log('[PortfolioAPI] Sending analyze holding request:', request);
      const response = await apiClient.post<HoldingAnalysis>(
        '/api/v1/portfolio/analyze-holding',
        request
      );
      console.log('[PortfolioAPI] Analyze holding response received:', response);
      return response;
    } catch (error: any) {
      console.error('[PortfolioAPI] Error analyzing holding:', error);
      console.error('[PortfolioAPI] Error details:', {
        message: error?.message,
        detail: error?.detail,
        status_code: error?.status_code,
        response: error?.response,
        fullError: error,
      });
      // Re-throw with better error message
      const errorMessage = error?.detail || error?.message || 'Failed to analyze holding';
      throw new Error(errorMessage);
    }
  },

  /**
   * Get top recommendations for long-term and/or short-term
   */
  async getTopRecommendations(
    request: TopRecommendationsRequest
  ): Promise<TopRecommendationsResponse> {
    try {
      const response = await apiClient.post<TopRecommendationsResponse>(
        '/api/v1/portfolio/top-recommendations',
        request
      );
      return response;
    } catch (error) {
      console.error('Error getting top recommendations:', error);
      throw error;
    }
  },

  /**
   * Scan the market for investment opportunities
   */
  async scanMarket(request: MarketScanRequest): Promise<MarketScanResponse> {
    try {
      const response = await apiClient.post<MarketScanResponse>(
        '/api/v1/portfolio/scan-market',
        request
      );
      return response;
    } catch (error) {
      console.error('Error scanning market:', error);
      throw error;
    }
  },

  /**
   * Ask CHADD for diagnostic insights and portfolio analysis
   */
  async askCHADD(request: AskCHADDRequest): Promise<AskCHADDResponse> {
    try {
      const response = await apiClient.post<AskCHADDResponse>(
        '/api/v1/portfolio/ask-chadd',
        request
      );
      return response;
    } catch (error) {
      console.error('Error asking CHADD:', error);
      throw error;
    }
  },

  /**
   * Get portfolio summary with sector allocation
   */
  async getPortfolioSummary(): Promise<any> {
    try {
      const response = await apiClient.get<any>('/api/v1/portfolio/portfolio-summary');
      return response;
    } catch (error) {
      console.error('Error getting portfolio summary:', error);
      throw error;
    }
  },

  /**
   * Generate forecast for a holding
   */
  async forecastHolding(request: {
    ticker: string;
    timeframe?: string;
    forecast_horizon?: number;
    model_type?: string;
    model_config?: Record<string, any>;
  }): Promise<any> {
    try {
      const response = await apiClient.post<any>(
        '/api/v1/portfolio/forecast',
        request
      );
      return response;
    } catch (error) {
      console.error('Error generating forecast:', error);
      throw error;
    }
  },

  /**
   * Perform enhanced correlation analysis
   */
  async analyzeCorrelation(request: {
    ticker1: string;
    ticker2?: string;
    timeframe?: string;
    metric?: string;
    alpha?: number;
    correction_method?: string;
  }): Promise<any> {
    try {
      const response = await apiClient.post<any>(
        '/api/v1/portfolio/correlation-analysis',
        request
      );
      return response;
    } catch (error) {
      console.error('Error performing correlation analysis:', error);
      throw error;
    }
  },

  /**
   * Create a new portfolio
   */
  async createPortfolio(request: {
    name: string;
    description?: string;
    base_type: 'berkshire' | 'empty' | 'import';
    holdings?: Holding[];
  }): Promise<any> {
    try {
      const response = await apiClient.post<any>(
        '/api/v1/portfolio/portfolios',
        request
      );
      return response;
    } catch (error) {
      console.error('Error creating portfolio:', error);
      throw error;
    }
  },

  /**
   * Import portfolio from CSV or JSON
   */
  async importPortfolio(format: 'csv' | 'json', data: string): Promise<Holding[]> {
    try {
      const response = await apiClient.post<Holding[]>(
        '/api/v1/portfolio/portfolios/import',
        { format, data }
      );
      return response;
    } catch (error) {
      console.error('Error importing portfolio:', error);
      throw error;
    }
  },

  /**
   * Add a holding to a portfolio
   */
  async addHolding(portfolioId: string, request: {
    ticker: string;
    company_name?: string;
    weight?: number;
    sector?: string;
  }): Promise<Holding> {
    try {
      const response = await apiClient.post<Holding>(
        `/api/v1/portfolio/portfolios/${portfolioId}/holdings`,
        request
      );
      return response;
    } catch (error) {
      console.error('Error adding holding:', error);
      throw error;
    }
  },

  /**
   * Remove a holding from a portfolio
   */
  async removeHolding(portfolioId: string, ticker: string): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/portfolio/portfolios/${portfolioId}/holdings/${ticker}`);
    } catch (error) {
      console.error('Error removing holding:', error);
      throw error;
    }
  },

  /**
   * Get a portfolio by ID
   */
  async getPortfolio(portfolioId: string): Promise<any> {
    try {
      const response = await apiClient.get<any>(`/api/v1/portfolio/portfolios/${portfolioId}`);
      return response;
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      throw error;
    }
  },

  /**
   * List all portfolios
   */
  async listPortfolios(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>('/api/v1/portfolio/portfolios');
      return response;
    } catch (error) {
      console.error('Error listing portfolios:', error);
      throw error;
    }
  },

  /**
   * Delete a portfolio
   */
  async deletePortfolio(portfolioId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/portfolio/portfolios/${portfolioId}`);
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      throw error;
    }
  },

  /**
   * List available indices for benchmark comparison
   */
  async listIndices(category?: string): Promise<IndexInfo[]> {
    try {
      const params = category ? { category } : undefined;
      const response = await apiClient.get<IndexInfo[]>('/api/v1/portfolio/indices', params);
      return response;
    } catch (error) {
      console.error('Error fetching indices:', error);
      throw error;
    }
  },

  /**
   * Analyze an index using CHADD framework
   */
  async analyzeIndex(request: AnalyzeIndexRequest): Promise<HoldingAnalysis> {
    try {
      const response = await apiClient.post<HoldingAnalysis>(
        '/api/v1/portfolio/analyze-index',
        request
      );
      return response;
    } catch (error) {
      console.error('Error analyzing index:', error);
      throw error;
    }
  },

  /**
   * Compare portfolio performance to benchmark index
   */
  async compareToBenchmark(request: BenchmarkComparisonRequest): Promise<BenchmarkComparison> {
    try {
      const response = await apiClient.post<BenchmarkComparison>(
        '/api/v1/portfolio/compare-to-benchmark',
        request
      );
      return response;
    } catch (error) {
      console.error('Error comparing to benchmark:', error);
      throw error;
    }
  },
};

