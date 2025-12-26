/**
 * Dashboard Header Component
 * Provides context about dashboard purpose and data sources
 * Responsive design for mobile and desktop
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  description?: string;
  dataSource?: string;
  dataSourceDescription?: string;
}

export function DashboardHeader({
  title,
  subtitle,
  description,
  dataSource,
  dataSourceDescription,
}: DashboardHeaderProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const { isMobile, isTablet } = useMobileDetection();
  const isMobileView = isMobile || isTablet;

  // Auto-expand on desktop
  useEffect(() => {
    if (!isMobileView) {
      setIsDescriptionExpanded(true);
    }
  }, [isMobileView]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
      <div className="mb-3 md:mb-4">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm md:text-lg text-gray-600 mt-1 md:mt-2">{subtitle}</p>
      </div>
      
      {description && (
        <div className="mt-3 md:mt-4">
          {isDescriptionExpanded ? (
            <div className="p-3 md:p-4 bg-gray-50 rounded-md">
              <p className="text-xs md:text-sm text-gray-700">{description}</p>
            </div>
          ) : (
            <button
              onClick={() => setIsDescriptionExpanded(true)}
              className="text-xs text-primary-600 hover:text-primary-700 underline touch-manipulation"
            >
              Show description
            </button>
          )}
        </div>
      )}

      {(dataSource || dataSourceDescription) && (
        <div className="mt-3 md:mt-4 p-3 md:p-4 bg-blue-50 rounded-md border border-blue-200">
          <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-2">📊 Data Source</h3>
          {dataSource && (
            <p className="text-xs md:text-sm text-gray-700 mb-1">
              <span className="font-medium">Source:</span> {dataSource}
            </p>
          )}
          {dataSourceDescription && (
            <p className="text-xs md:text-sm text-gray-600">{dataSourceDescription}</p>
          )}
        </div>
      )}
    </div>
  );
}

