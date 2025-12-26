/**
 * Accessibility Badge Component
 * Displays accessibility monitoring information and SiteLint link
 */

'use client';

import Link from 'next/link';

export function AccessibilityBadge() {
  return (
    <div className="fixed bottom-4 right-4 z-40 hidden md:block">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-w-xs">
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 mb-1">Accessibility Monitored</p>
            <p className="text-xs text-gray-600 mb-2">
              This site is continuously monitored for accessibility compliance.
            </p>
            <a
              href="https://sitelint.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              aria-label="Learn more about SiteLint accessibility monitoring (opens in new tab)"
            >
              Powered by SiteLint →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

