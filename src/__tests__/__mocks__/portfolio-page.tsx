/**
 * Mock Portfolio Dashboard Page Component
 * Simplified version for testing
 */

'use client';

import React, { useState } from 'react';
import { PortfolioTabs } from '@/components/portfolio/PortfolioTabs';

export default function PortfolioRiskDashboard() {
  const [activeTab, setActiveTab] = useState('sectors');

  const tabs = [
    {
      id: 'sectors',
      label: 'Sector Holdings',
      icon: '📈',
      content: <div data-testid="sectors-tab">Sector Holdings Content</div>,
    },
    {
      id: 'overview',
      label: 'Portfolio Overview',
      icon: '📊',
      content: (
        <div data-testid="overview-tab">
          <div>Portfolio Configuration</div>
          <button data-testid="analyze-button">Analyze Portfolio</button>
        </div>
      ),
    },
    {
      id: 'holdings',
      label: 'Holdings Analysis',
      icon: '🔍',
      content: <div data-testid="holdings-tab">Holdings Analysis Content</div>,
    },
    {
      id: 'risk',
      label: 'Risk Analysis',
      icon: '⚠️',
      content: <div data-testid="risk-tab">Risk Analysis Content</div>,
    },
    {
      id: 'market',
      label: 'Market Scanner',
      icon: '🔍',
      content: <div data-testid="market-tab">Market Scanner Content</div>,
    },
    {
      id: 'warren',
      label: 'Ask Warren',
      icon: '💬',
      content: (
        <div data-testid="warren-tab">
          <div>Ask Warren</div>
          <input
            data-testid="warren-input"
            placeholder="Ask Warren about value investing, stocks, or portfolio strategy..."
          />
          <button data-testid="warren-ask-button">Ask</button>
        </div>
      ),
    },
  ];

  return (
    <div data-testid="portfolio-dashboard">
      <PortfolioTabs tabs={tabs} defaultTab="sectors" />
    </div>
  );
}

