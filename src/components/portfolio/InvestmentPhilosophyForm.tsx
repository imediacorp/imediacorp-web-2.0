/**
 * Investment Philosophy Profile Form Component
 * Form for creating and editing investment philosophy profiles
 */

'use client';

import React, { useState, useEffect } from 'react';
import type {
  InvestmentPhilosophy,
  InvestmentPhilosophyFormData,
  InvestmentStyle,
  InvestmentHorizon,
  MarketCapPreference,
  GeographicPreference,
  ESGConsiderations,
  DividendPreference,
  LeverageTolerance,
  CHADDMetric,
  StressTestPreference,
} from '@/types/investment-philosophy';
import { getRiskCategory, getInvestmentStyleDescription, DEFAULT_INVESTMENT_PHILOSOPHY } from '@/types/investment-philosophy';

interface InvestmentPhilosophyFormProps {
  /** Existing profile to edit (if provided, form is in edit mode) */
  existingProfile?: InvestmentPhilosophy | null;
  /** Callback when form is submitted */
  onSubmit: (data: InvestmentPhilosophyFormData) => Promise<void>;
  /** Callback when form is cancelled */
  onCancel?: () => void;
  /** Whether form is in loading state */
  loading?: boolean;
}

export function InvestmentPhilosophyForm({
  existingProfile,
  onSubmit,
  onCancel,
  loading = false,
}: InvestmentPhilosophyFormProps) {
  const [formData, setFormData] = useState<InvestmentPhilosophyFormData>(() => {
    if (existingProfile) {
      return {
        investmentStyle: existingProfile.investmentStyle,
        riskTolerance: existingProfile.riskTolerance,
        investmentHorizon: existingProfile.investmentHorizon,
        preferences: {
          preferredSectors: existingProfile.preferences.preferredSectors || [],
          avoidedSectors: existingProfile.preferences.avoidedSectors || [],
          marketCapPreference: existingProfile.preferences.marketCapPreference,
          geographicPreference: existingProfile.preferences.geographicPreference,
          esgConsiderations: existingProfile.preferences.esgConsiderations,
          dividendPreference: existingProfile.preferences.dividendPreference,
          taxSensitive: existingProfile.preferences.taxSensitive || false,
          leverageTolerance: existingProfile.preferences.leverageTolerance,
        },
        chaddPreferences: {
          focusMetrics: existingProfile.chaddPreferences.focusMetrics || [],
          minResilienceScore: existingProfile.chaddPreferences.minResilienceScore,
          stressTestPreference: existingProfile.chaddPreferences.stressTestPreference,
        },
        profileName: existingProfile.profileName,
      };
    }
    return {
      investmentStyle: DEFAULT_INVESTMENT_PHILOSOPHY.investmentStyle || 'balanced',
      riskTolerance: DEFAULT_INVESTMENT_PHILOSOPHY.riskTolerance || 5,
      investmentHorizon: DEFAULT_INVESTMENT_PHILOSOPHY.investmentHorizon || 'long_term',
      preferences: {
        ...DEFAULT_INVESTMENT_PHILOSOPHY.preferences,
      },
      chaddPreferences: {
        ...DEFAULT_INVESTMENT_PHILOSOPHY.chaddPreferences,
      },
      profileName: '',
    };
  });

  const [riskCategory, setRiskCategory] = useState<string>(
    getRiskCategory(formData.riskTolerance)
  );

  // Update risk category when risk tolerance changes
  useEffect(() => {
    setRiskCategory(getRiskCategory(formData.riskTolerance));
  }, [formData.riskTolerance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const investmentStyles: InvestmentStyle[] = [
    'value',
    'growth',
    'speculative',
    'income',
    'balanced',
    'index',
    'momentum',
  ];

  const investmentHorizons: InvestmentHorizon[] = [
    'short_term',
    'medium_term',
    'long_term',
  ];

  const marketCapOptions: MarketCapPreference[] = ['large', 'mid', 'small', 'all'];
  const geographicOptions: GeographicPreference[] = ['domestic', 'international', 'global'];
  const esgOptions: ESGConsiderations[] = ['none', 'moderate', 'high'];
  const dividendOptions: DividendPreference[] = ['none', 'moderate', 'high'];
  const leverageOptions: LeverageTolerance[] = ['none', 'low', 'moderate', 'high'];
  const chaddMetrics: CHADDMetric[] = ['S', 'Q', 'U', 'D'];
  const stressTestOptions: StressTestPreference[] = ['conservative', 'moderate', 'aggressive'];

  const commonSectors = [
    'Technology',
    'Healthcare',
    'Financials',
    'Consumer Discretionary',
    'Consumer Staples',
    'Energy',
    'Industrials',
    'Materials',
    'Real Estate',
    'Utilities',
    'Communication Services',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Name */}
      <div>
        <label htmlFor="profileName" className="block text-sm font-medium text-gray-700 mb-1">
          Profile Name (Optional)
        </label>
        <input
          type="text"
          id="profileName"
          value={formData.profileName || ''}
          onChange={(e) => setFormData({ ...formData, profileName: e.target.value })}
          placeholder="e.g., Retirement Portfolio, Trading Account"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Investment Style */}
      <div>
        <label htmlFor="investmentStyle" className="block text-sm font-medium text-gray-700 mb-1">
          Investment Style *
        </label>
        <select
          id="investmentStyle"
          value={formData.investmentStyle}
          onChange={(e) =>
            setFormData({ ...formData, investmentStyle: e.target.value as InvestmentStyle })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        >
          {investmentStyles.map((style) => (
            <option key={style} value={style}>
              {style.charAt(0).toUpperCase() + style.slice(1).replace('_', ' ')}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {getInvestmentStyleDescription(formData.investmentStyle)}
        </p>
      </div>

      {/* Risk Tolerance */}
      <div>
        <label htmlFor="riskTolerance" className="block text-sm font-medium text-gray-700 mb-2">
          Risk Tolerance: {formData.riskTolerance} / 10 ({riskCategory})
        </label>
        <input
          type="range"
          id="riskTolerance"
          min="1"
          max="10"
          value={formData.riskTolerance}
          onChange={(e) =>
            setFormData({ ...formData, riskTolerance: parseInt(e.target.value, 10) })
          }
          className="w-full"
          required
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Very Conservative</span>
          <span>Moderate</span>
          <span>Very Aggressive</span>
        </div>
      </div>

      {/* Investment Horizon */}
      <div>
        <label htmlFor="investmentHorizon" className="block text-sm font-medium text-gray-700 mb-1">
          Investment Horizon *
        </label>
        <select
          id="investmentHorizon"
          value={formData.investmentHorizon}
          onChange={(e) =>
            setFormData({ ...formData, investmentHorizon: e.target.value as InvestmentHorizon })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        >
          {investmentHorizons.map((horizon) => (
            <option key={horizon} value={horizon}>
              {horizon.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {/* Preferences Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Preferences</h3>

        {/* Preferred Sectors */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Sectors
          </label>
          <div className="flex flex-wrap gap-2">
            {commonSectors.map((sector) => (
              <label key={sector} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferences.preferredSectors?.includes(sector) || false}
                  onChange={(e) => {
                    const current = formData.preferences.preferredSectors || [];
                    const updated = e.target.checked
                      ? [...current, sector]
                      : current.filter((s) => s !== sector);
                    setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, preferredSectors: updated },
                    });
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{sector}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Avoided Sectors */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sectors to Avoid
          </label>
          <div className="flex flex-wrap gap-2">
            {commonSectors.map((sector) => (
              <label key={sector} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferences.avoidedSectors?.includes(sector) || false}
                  onChange={(e) => {
                    const current = formData.preferences.avoidedSectors || [];
                    const updated = e.target.checked
                      ? [...current, sector]
                      : current.filter((s) => s !== sector);
                    setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, avoidedSectors: updated },
                    });
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{sector}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Market Cap Preference */}
        <div className="mb-4">
          <label htmlFor="marketCap" className="block text-sm font-medium text-gray-700 mb-1">
            Market Cap Preference
          </label>
          <select
            id="marketCap"
            value={formData.preferences.marketCapPreference || 'all'}
            onChange={(e) =>
              setFormData({
                ...formData,
                preferences: {
                  ...formData.preferences,
                  marketCapPreference: e.target.value as MarketCapPreference,
                },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {marketCapOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Geographic Preference */}
        <div className="mb-4">
          <label htmlFor="geographic" className="block text-sm font-medium text-gray-700 mb-1">
            Geographic Preference
          </label>
          <select
            id="geographic"
            value={formData.preferences.geographicPreference || 'domestic'}
            onChange={(e) =>
              setFormData({
                ...formData,
                preferences: {
                  ...formData.preferences,
                  geographicPreference: e.target.value as GeographicPreference,
                },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {geographicOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* ESG Considerations */}
        <div className="mb-4">
          <label htmlFor="esg" className="block text-sm font-medium text-gray-700 mb-1">
            ESG Considerations
          </label>
          <select
            id="esg"
            value={formData.preferences.esgConsiderations || 'moderate'}
            onChange={(e) =>
              setFormData({
                ...formData,
                preferences: {
                  ...formData.preferences,
                  esgConsiderations: e.target.value as ESGConsiderations,
                },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {esgOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Dividend Preference */}
        <div className="mb-4">
          <label htmlFor="dividend" className="block text-sm font-medium text-gray-700 mb-1">
            Dividend Preference
          </label>
          <select
            id="dividend"
            value={formData.preferences.dividendPreference || 'moderate'}
            onChange={(e) =>
              setFormData({
                ...formData,
                preferences: {
                  ...formData.preferences,
                  dividendPreference: e.target.value as DividendPreference,
                },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {dividendOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Tax Sensitive */}
        <div className="mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.preferences.taxSensitive || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preferences: {
                    ...formData.preferences,
                    taxSensitive: e.target.checked,
                  },
                })
              }
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Tax-Sensitive Investing</span>
          </label>
        </div>

        {/* Leverage Tolerance */}
        <div className="mb-4">
          <label htmlFor="leverage" className="block text-sm font-medium text-gray-700 mb-1">
            Leverage Tolerance
          </label>
          <select
            id="leverage"
            value={formData.preferences.leverageTolerance || 'none'}
            onChange={(e) =>
              setFormData({
                ...formData,
                preferences: {
                  ...formData.preferences,
                  leverageTolerance: e.target.value as LeverageTolerance,
                },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {leverageOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CHADD Preferences Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">CHADD Diagnostic Preferences</h3>

        {/* Focus Metrics */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Focus Metrics (Select metrics to emphasize in analysis)
          </label>
          <div className="flex flex-wrap gap-3">
            {chaddMetrics.map((metric) => (
              <label key={metric} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.chaddPreferences.focusMetrics?.includes(metric) || false}
                  onChange={(e) => {
                    const current = formData.chaddPreferences.focusMetrics || [];
                    const updated = e.target.checked
                      ? [...current, metric]
                      : current.filter((m) => m !== metric);
                    setFormData({
                      ...formData,
                      chaddPreferences: {
                        ...formData.chaddPreferences,
                        focusMetrics: updated,
                      },
                    });
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">
                  {metric} ({metric === 'S' ? 'Stability' : metric === 'Q' ? 'Coherence' : metric === 'U' ? 'Susceptibility' : 'Diagnostic'})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Minimum Resilience Score */}
        <div className="mb-4">
          <label htmlFor="minResilience" className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Resilience Score: {((formData.chaddPreferences.minResilienceScore || 0.6) * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            id="minResilience"
            min="0"
            max="1"
            step="0.05"
            value={formData.chaddPreferences.minResilienceScore || 0.6}
            onChange={(e) =>
              setFormData({
                ...formData,
                chaddPreferences: {
                  ...formData.chaddPreferences,
                  minResilienceScore: parseFloat(e.target.value),
                },
              })
            }
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Stress Test Preference */}
        <div className="mb-4">
          <label htmlFor="stressTest" className="block text-sm font-medium text-gray-700 mb-1">
            Stress Test Preference
          </label>
          <select
            id="stressTest"
            value={formData.chaddPreferences.stressTestPreference || 'moderate'}
            onChange={(e) =>
              setFormData({
                ...formData,
                chaddPreferences: {
                  ...formData.chaddPreferences,
                  stressTestPreference: e.target.value as StressTestPreference,
                },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {stressTestOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : existingProfile ? 'Update Profile' : 'Create Profile'}
        </button>
      </div>
    </form>
  );
}

