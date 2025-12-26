/**
 * AI Interpretation Component
 * Displays AI-generated analysis and recommendations
 */

'use client';

import React from 'react';

export interface AIInterpretation {
  text: string;
  key_insights?: string[];
  recommendations?: string[];
  confidence?: number;
}

interface AIInterpretationProps {
  interpretation: AIInterpretation | string | null;
  loading?: boolean;
  error?: string | null;
}

export function AIInterpretationCard({ interpretation, loading, error }: AIInterpretationProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Interpretation</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Interpretation</h3>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!interpretation) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Interpretation</h3>
        <p className="text-gray-500 text-sm">Enable AI interpretation to see intelligent analysis of your vehicle data.</p>
      </div>
    );
  }

  const interpretationData: AIInterpretation = typeof interpretation === 'string' 
    ? { text: interpretation }
    : interpretation;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">🤖 AI Interpretation</h3>
        {interpretationData.confidence !== undefined && (
          <span className="text-xs text-gray-500">
            Confidence: {Math.round(interpretationData.confidence * 100)}%
          </span>
        )}
      </div>
      
      <div className="prose prose-sm max-w-none">
        <div className="text-gray-700 whitespace-pre-wrap mb-4">
          {interpretationData.text}
        </div>

        {interpretationData.key_insights && interpretationData.key_insights.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Insights</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {interpretationData.key_insights.map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
            </ul>
          </div>
        )}

        {interpretationData.recommendations && interpretationData.recommendations.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Recommendations</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {interpretationData.recommendations.map((rec, idx) => (
                <li key={idx} className="text-blue-700">{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

