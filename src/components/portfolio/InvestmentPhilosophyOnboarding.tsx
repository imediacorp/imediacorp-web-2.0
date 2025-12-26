/**
 * Investment Philosophy Onboarding Component
 * Guided questionnaire for first-time users to set up their investment profile
 */

'use client';

import React, { useState } from 'react';
import { InvestmentPhilosophyForm } from './InvestmentPhilosophyForm';
import { investmentPhilosophyApi } from '@/lib/api/investment-philosophy';
import type { InvestmentPhilosophyFormData } from '@/types/investment-philosophy';
import { getInvestmentStyleDescription } from '@/types/investment-philosophy';

interface InvestmentPhilosophyOnboardingProps {
  /** Callback when onboarding is complete */
  onComplete: (profileId: string) => void;
  /** Callback to skip onboarding */
  onSkip?: () => void;
}

export function InvestmentPhilosophyOnboarding({
  onComplete,
  onSkip,
}: InvestmentPhilosophyOnboardingProps) {
  const [step, setStep] = useState<'questionnaire' | 'details'>('questionnaire');
  const [loading, setLoading] = useState(false);
  const [quickAnswers, setQuickAnswers] = useState({
    investmentStyle: '',
    riskTolerance: 5,
    investmentHorizon: '',
  });

  const handleQuickSubmit = () => {
    if (quickAnswers.investmentStyle && quickAnswers.investmentHorizon) {
      setStep('details');
    }
  };

  const handleFormSubmit = async (formData: InvestmentPhilosophyFormData) => {
    try {
      setLoading(true);
      const profile = await investmentPhilosophyApi.createProfile({
        ...formData,
        profileName: formData.profileName || 'My Investment Profile',
      });
      onComplete(profile.id || '');
    } catch (error) {
      console.error('Error creating investment philosophy profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (step === 'questionnaire') {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Let's Set Up Your Investment Profile
          </h2>
          <p className="text-gray-600">
            Help CHADD personalize diagnostic insights based on your investment philosophy
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Investment Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What's your primary investment style?
            </label>
            <div className="space-y-2">
              {[
                { value: 'value', label: 'Value Investing', desc: 'Focus on undervalued companies' },
                { value: 'growth', label: 'Growth Investing', desc: 'Prioritize high-growth companies' },
                { value: 'balanced', label: 'Balanced', desc: 'Mix of growth and value' },
                { value: 'income', label: 'Income Focus', desc: 'Emphasize dividend-paying stocks' },
                { value: 'index', label: 'Index/Passive', desc: 'Passive investing through ETFs' },
                { value: 'momentum', label: 'Momentum Trading', desc: 'Follow market trends' },
                { value: 'speculative', label: 'Speculative', desc: 'High-risk, high-reward' },
              ].map((style) => (
                <label
                  key={style.value}
                  className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    quickAnswers.investmentStyle === style.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="investmentStyle"
                    value={style.value}
                    checked={quickAnswers.investmentStyle === style.value}
                    onChange={(e) =>
                      setQuickAnswers({ ...quickAnswers, investmentStyle: e.target.value })
                    }
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{style.label}</div>
                    <div className="text-sm text-gray-600">{style.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Risk Tolerance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What's your risk tolerance? ({quickAnswers.riskTolerance}/10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={quickAnswers.riskTolerance}
              onChange={(e) =>
                setQuickAnswers({ ...quickAnswers, riskTolerance: parseInt(e.target.value, 10) })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Very Conservative</span>
              <span>Moderate</span>
              <span>Very Aggressive</span>
            </div>
          </div>

          {/* Investment Horizon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What's your investment time horizon?
            </label>
            <div className="space-y-2">
              {[
                { value: 'short_term', label: 'Short-term (0-2 years)', desc: 'Quick gains, active trading' },
                { value: 'medium_term', label: 'Medium-term (2-5 years)', desc: 'Balanced approach' },
                { value: 'long_term', label: 'Long-term (5+ years)', desc: 'Wealth building, retirement' },
              ].map((horizon) => (
                <label
                  key={horizon.value}
                  className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    quickAnswers.investmentHorizon === horizon.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="investmentHorizon"
                    value={horizon.value}
                    checked={quickAnswers.investmentHorizon === horizon.value}
                    onChange={(e) =>
                      setQuickAnswers({ ...quickAnswers, investmentHorizon: e.target.value })
                    }
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{horizon.label}</div>
                    <div className="text-sm text-gray-600">{horizon.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            {onSkip && (
              <button
                onClick={onSkip}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Skip for now
              </button>
            )}
            <button
              onClick={handleQuickSubmit}
              disabled={!quickAnswers.investmentStyle || !quickAnswers.investmentHorizon}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Details →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Details step with full form
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => setStep('questionnaire')}
          className="text-sm text-primary-600 hover:text-primary-700 mb-4"
        >
          ← Back to quick setup
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
        <p className="text-gray-600">
          Add more details to personalize CHADD's diagnostic insights
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <InvestmentPhilosophyForm
          existingProfile={null}
          onSubmit={handleFormSubmit}
          onCancel={onSkip}
          loading={loading}
        />
      </div>
    </div>
  );
}

