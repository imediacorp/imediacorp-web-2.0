/**
 * Ask CHADD Floating Widget
 * Quick access chat widget that floats on the page for instant access
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AskCHADD } from './AskCHADD';
import type { HoldingAnalysis, TopRecommendationsResponse, Holding } from '@/types/portfolio';

interface AskCHADDFloatingProps {
  selectedHolding?: HoldingAnalysis | null;
  recommendations?: TopRecommendationsResponse | null;
  holdings?: Holding[];
  timeframe?: string;
}

export function AskCHADDFloating({
  selectedHolding,
  recommendations,
  holdings,
  timeframe,
}: AskCHADDFloatingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Close on outside click when minimized
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        widgetRef.current &&
        !widgetRef.current.contains(event.target as Node) &&
        isMinimized &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, isMinimized]);

  return (
    <>
      {/* Floating Button - Mobile responsive */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center text-white text-xl sm:text-2xl font-bold group touch-manipulation"
          aria-label="Ask CHADD"
        >
          <span className="group-hover:scale-110 transition-transform">CH</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Floating Widget - Mobile responsive */}
      {isOpen && (
        <div
          ref={widgetRef}
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 transition-all duration-300 ${
            isMinimized 
              ? 'w-[calc(100vw-2rem)] sm:w-80 h-16' 
              : 'w-[calc(100vw-2rem)] sm:w-96 h-[calc(100vh-8rem)] sm:h-[600px] max-h-[600px]'
          }`}
        >
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-sm font-bold">
                  CH
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Ask CHADD</h3>
                  <p className="text-xs text-gray-600">Diagnostic Insights</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  aria-label={isMinimized ? 'Expand' : 'Minimize'}
                >
                  {isMinimized ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            {!isMinimized && (
              <div className="flex-1 overflow-hidden">
                <AskCHADD
                  selectedHolding={selectedHolding}
                  recommendations={recommendations}
                  holdings={holdings}
                  timeframe={timeframe}
                  compact={true}
                  showSuggestions={true}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

