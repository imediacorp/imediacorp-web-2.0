/**
 * Tabbed Dashboard Component
 * Wrapper component providing tabbed interface matching Streamlit dashboard layout
 * Enhanced with mobile bottom navigation
 */

'use client';

import React, { useState, ReactNode, useEffect } from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  content: ReactNode;
}

interface TabbedDashboardProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function TabbedDashboard({ tabs, defaultTab }: TabbedDashboardProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  // Mobile: Bottom navigation
  if (isMobile) {
    return (
      <div className="w-full pb-20">
        {/* Tab Content */}
        <div className="w-full mb-4">{activeTabContent}</div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-inset-bottom">
          <nav className="flex justify-around items-center" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex flex-col items-center justify-center py-2 px-3 min-w-[60px] min-h-[60px]
                  transition-colors touch-manipulation
                  ${
                    activeTab === tab.id
                      ? 'text-primary-600'
                      : 'text-gray-500'
                  }
                `}
                aria-label={tab.label}
              >
                {tab.icon && <span className="text-2xl mb-1">{tab.icon}</span>}
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    );
  }

  // Desktop: Top tabs
  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="w-full">{activeTabContent}</div>
    </div>
  );
}

