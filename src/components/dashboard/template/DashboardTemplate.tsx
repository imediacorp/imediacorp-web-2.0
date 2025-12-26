/**
 * Dashboard Template Component
 * Reusable template for creating new dashboards with consistent structure
 * Enhanced with mobile-responsive components
 */

'use client';

import React, { ReactNode } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CHADD2Overlay } from '@/components/dashboard/CHADD2Overlay';
import { OfflineIndicator } from '@/components/dashboard/OfflineIndicator';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import type { DashboardConfig, DashboardSections, DashboardAction, CHADD2OverlayConfig } from '@/types/dashboard';

export interface DashboardTemplateProps {
  config: DashboardConfig;
  sections?: DashboardSections;
  actions?: DashboardAction[];
  children?: ReactNode;
  chadd2Overlay?: CHADD2OverlayConfig;
  onCHADD2ConfigChange?: (config: CHADD2OverlayConfig) => void;
  requireAuth?: boolean;
}

export function DashboardTemplate({
  config,
  sections = {
    header: true,
    metrics: true,
    telemetry: true,
    charts: true,
    aiInterpretation: true,
    maintenance: true,
    export: false,
  },
  actions = [],
  children,
  chadd2Overlay,
  onCHADD2ConfigChange,
  requireAuth = true,
}: DashboardTemplateProps) {
  return (
    <AuthGuard requireAuth={requireAuth}>
      <DashboardTemplateContent
        config={config}
        sections={sections}
        actions={actions}
        chadd2Overlay={chadd2Overlay}
        onCHADD2ConfigChange={onCHADD2ConfigChange}
      >
        {children}
      </DashboardTemplateContent>
    </AuthGuard>
  );
}

function DashboardTemplateContent({
  config,
  sections,
  actions,
  children,
  chadd2Overlay,
  onCHADD2ConfigChange,
}: Omit<DashboardTemplateProps, 'config'> & { config: DashboardConfig }) {
  const { isMobile, isTablet } = useMobileDetection();
  const isMobileView = isMobile || isTablet;

  return (
    <DashboardLayout
      title={config.title}
      subtitle={config.subtitle}
      domain={config.domain}
    >
      {/* Offline Indicator Banner */}
      <OfflineIndicator variant="banner" className="-mx-4 sm:-mx-6 lg:-mx-8" />

      <div className="space-y-4 md:space-y-6">
        {/* Header Section - Responsive */}
        {sections?.header && (
          <div className={isMobileView ? 'mb-4' : ''}>
            <DashboardHeader
              title={config.title}
              subtitle={config.subtitle}
              description={isMobileView ? undefined : config.description}
              dataSource={config.dataSource}
              dataSourceDescription={isMobileView ? undefined : config.dataSourceDescription}
            />
          </div>
        )}

        {/* CHADD2 Bridge Overlay */}
        <CHADD2Overlay
          config={chadd2Overlay}
          onConfigChange={onCHADD2ConfigChange}
        />

        {/* Action Bar - Mobile Optimized */}
        {actions && actions.length > 0 && (
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${
            isMobileView ? 'p-3' : 'p-4'
          }`}>
            <div className={`flex items-center ${isMobileView ? 'flex-col' : 'justify-between'} gap-3`}>
              {!isMobileView && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Dashboard Actions</h2>
                </div>
              )}
              <div className={`flex items-center ${isMobileView ? 'w-full flex-col' : 'gap-2'}`}>
                {actions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className={`
                      ${isMobileView ? 'w-full' : ''}
                      px-4 py-2 rounded-lg font-medium transition-colors touch-manipulation
                      ${action.variant === 'primary' 
                        ? 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800' 
                        : action.variant === 'danger'
                        ? 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Custom Content */}
        <div className={isMobileView ? 'space-y-4' : 'space-y-6'}>
          {children}
        </div>
      </div>
    </DashboardLayout>
  );
}

