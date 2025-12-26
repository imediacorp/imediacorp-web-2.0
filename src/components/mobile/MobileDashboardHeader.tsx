/**
 * Mobile Dashboard Header Component
 * Compact header optimized for mobile screens
 */

'use client';

import React from 'react';
import Link from 'next/link';

interface MobileDashboardHeaderProps {
  title: string;
  subtitle?: string;
  domain?: string;
  onMenuClick?: () => void;
}

export function MobileDashboardHeader({
  title,
  subtitle,
  domain,
  onMenuClick,
}: MobileDashboardHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 touch-manipulation"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs text-gray-500 truncate mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {domain && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 ml-2">
            {domain}
          </span>
        )}
      </div>
    </div>
  );
}

