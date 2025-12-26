/**
 * Investment Philosophy Profile Types
 * KYC-style profile for personalizing CHADD diagnostic insights
 */

export type InvestmentStyle = 
  | 'value' 
  | 'growth' 
  | 'speculative' 
  | 'income' 
  | 'balanced' 
  | 'index' 
  | 'momentum';

export type RiskCategory = 'conservative' | 'moderate' | 'aggressive';

export type InvestmentHorizon = 'short_term' | 'medium_term' | 'long_term';

export type MarketCapPreference = 'large' | 'mid' | 'small' | 'all';

export type GeographicPreference = 'domestic' | 'international' | 'global';

export type ESGConsiderations = 'none' | 'moderate' | 'high';

export type DividendPreference = 'none' | 'moderate' | 'high';

export type LeverageTolerance = 'none' | 'low' | 'moderate' | 'high';

export type CHADDMetric = 'S' | 'Q' | 'U' | 'D';

export type StressTestPreference = 'conservative' | 'moderate' | 'aggressive';

export interface InvestmentPhilosophyPreferences {
  /** Preferred sectors (array of sector names) */
  preferredSectors?: string[];
  
  /** Sectors to avoid */
  avoidedSectors?: string[];
  
  /** Market cap preference */
  marketCapPreference?: MarketCapPreference;
  
  /** Geographic preference */
  geographicPreference?: GeographicPreference;
  
  /** ESG considerations level */
  esgConsiderations?: ESGConsiderations;
  
  /** Dividend preference */
  dividendPreference?: DividendPreference;
  
  /** Whether user is tax-sensitive */
  taxSensitive?: boolean;
  
  /** Leverage tolerance */
  leverageTolerance?: LeverageTolerance;
}

export interface CHADDPreferences {
  /** Preferred metrics to focus on */
  focusMetrics?: CHADDMetric[];
  
  /** Minimum resilience score threshold (0-1) */
  minResilienceScore?: number;
  
  /** Stress test preference */
  stressTestPreference?: StressTestPreference;
}

export interface InvestmentPhilosophy {
  /** Unique identifier for the profile */
  id?: string;
  
  /** User ID (UUID) */
  userId?: string;
  
  /** Primary investment style */
  investmentStyle: InvestmentStyle;
  
  /** Risk tolerance (1-10 scale, 1 = very conservative, 10 = very aggressive) */
  riskTolerance: number;
  
  /** Risk category (derived from riskTolerance) */
  riskCategory: RiskCategory;
  
  /** Investment horizon */
  investmentHorizon: InvestmentHorizon;
  
  /** Specific preferences */
  preferences: InvestmentPhilosophyPreferences;
  
  /** CHADD-specific preferences */
  chaddPreferences: CHADDPreferences;
  
  /** Profile metadata */
  profileName?: string;
  
  /** Timestamps */
  createdAt: string;
  updatedAt: string;
  
  /** Whether this is the default/active profile */
  isDefault?: boolean;
}

export interface InvestmentPhilosophyFormData {
  investmentStyle: InvestmentStyle;
  riskTolerance: number;
  investmentHorizon: InvestmentHorizon;
  preferences: InvestmentPhilosophyPreferences;
  chaddPreferences: CHADDPreferences;
  profileName?: string;
}

/**
 * Helper function to derive risk category from risk tolerance
 */
export function getRiskCategory(riskTolerance: number): RiskCategory {
  if (riskTolerance <= 3) {
    return 'conservative';
  } else if (riskTolerance <= 7) {
    return 'moderate';
  } else {
    return 'aggressive';
  }
}

/**
 * Helper function to get investment style description
 */
export function getInvestmentStyleDescription(style: InvestmentStyle): string {
  const descriptions: Record<InvestmentStyle, string> = {
    value: 'Focus on undervalued companies with strong fundamentals and long-term potential',
    growth: 'Prioritize companies with high growth potential and expanding market share',
    speculative: 'High-risk, high-reward investments in emerging or volatile markets',
    income: 'Emphasize dividend-paying stocks and income-generating assets',
    balanced: 'Diversified approach mixing growth and value with moderate risk',
    index: 'Passive investing through index funds and ETFs',
    momentum: 'Follow market trends and momentum indicators for trading opportunities',
  };
  return descriptions[style];
}

/**
 * Default investment philosophy profile
 */
export const DEFAULT_INVESTMENT_PHILOSOPHY: Partial<InvestmentPhilosophy> = {
  investmentStyle: 'balanced',
  riskTolerance: 5,
  riskCategory: 'moderate',
  investmentHorizon: 'long_term',
  preferences: {
    marketCapPreference: 'all',
    geographicPreference: 'domestic',
    esgConsiderations: 'moderate',
    dividendPreference: 'moderate',
    taxSensitive: false,
    leverageTolerance: 'none',
  },
  chaddPreferences: {
    focusMetrics: ['S', 'Q', 'U', 'D'],
    minResilienceScore: 0.6,
    stressTestPreference: 'moderate',
  },
};

