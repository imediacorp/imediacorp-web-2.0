/**
 * Mobile Chart View Component
 * Touch-optimized chart wrapper for mobile devices
 */

'use client';

import React, { ReactNode } from 'react';

interface MobileChartViewProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function MobileChartView({
  children,
  title,
  className = '',
}: MobileChartViewProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 ${className}`}>
      {title && (
        <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      )}
      <div className="touch-pan-x touch-pan-y">
        {children}
      </div>
    </div>
  );
}

