/**
 * Dashboard Template Example
 * Example of how to create a new dashboard using the template system
 */

'use client';

import React, { useState } from 'react';
import { DashboardTemplate } from '@/components/dashboard/template/DashboardTemplate';
import { DashboardSection } from '@/components/dashboard/template/DashboardSection';
import { DashboardGrid } from '@/components/dashboard/template/DashboardSection';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { getConfigForDomain } from '@/lib/dashboard/config';
import type { DashboardAction, MetricsSummary } from '@/types/dashboard';

/**
 * Example: Creating a new dashboard for "my-domain"
 * 
 * Steps:
 * 1. Copy this file to app/dashboards/my-domain/page.tsx
 * 2. Update the config domain
 * 3. Implement your domain-specific logic
 * 4. Customize sections and content
 */
export default function TemplateExampleDashboard() {
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<MetricsSummary | null>(null);

  // Get configuration for your domain
  const config = getConfigForDomain('template-example');
  
  // Or create custom config:
  // const config = {
  //   domain: 'my-domain',
  //   title: 'My Domain Dashboard',
  //   subtitle: 'Custom Health Monitoring',
  //   description: 'Description of what this dashboard does...',
  //   dataSource: 'Data Source Name',
  //   dataSourceDescription: 'Where the data comes from...',
  // };

  // Define dashboard actions
  const actions: DashboardAction[] = [
    {
      id: 'assess',
      label: 'Run Assessment',
      icon: '▶️',
      onClick: async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAssessment({
          squd: { S: 0.8, Q: 0.3, U: 0.5, D: 0.2 },
          health: 80,
        });
        setLoading(false);
      },
      variant: 'primary',
      disabled: loading,
    },
  ];

  // Configure which sections to show
  const sections = {
    header: true,        // Show header with purpose
    metrics: true,       // Show S/Q/U/D metrics
    telemetry: false,    // Hide telemetry (customize as needed)
    charts: false,       // Hide charts (customize as needed)
    aiInterpretation: false, // Hide AI (customize as needed)
    maintenance: false,  // Hide maintenance (customize as needed)
  };

  return (
    <DashboardTemplate
      config={config}
      sections={sections}
      actions={actions}
    >
      {/* Metrics Section */}
      {assessment && (
        <MetricsCard
          squd={assessment.squd}
          health={assessment.health}
          title="Health Assessment"
        />
      )}

      {/* Custom Sections */}
      <DashboardSection title="Overview" icon="📊">
        <p className="text-gray-600">
          This is an example dashboard created using the template system.
          Customize this section with your domain-specific content.
        </p>
      </DashboardSection>

      <DashboardGrid cols={3} gap="md">
        <DashboardSection variant="card" title="Metric 1">
          <div className="text-3xl font-bold text-primary-600">42</div>
          <div className="text-sm text-gray-500 mt-1">Value 1</div>
        </DashboardSection>
        <DashboardSection variant="card" title="Metric 2">
          <div className="text-3xl font-bold text-success-600">85%</div>
          <div className="text-sm text-gray-500 mt-1">Value 2</div>
        </DashboardSection>
        <DashboardSection variant="card" title="Metric 3">
          <div className="text-3xl font-bold text-warning-600">12</div>
          <div className="text-sm text-gray-500 mt-1">Value 3</div>
        </DashboardSection>
      </DashboardGrid>

      {/* Add more custom sections as needed */}
      <DashboardSection title="Custom Analysis" icon="🔍">
        <div className="space-y-4">
          <p className="text-gray-700">
            Add your custom analysis components here.
          </p>
          {/* Add charts, tables, or other components */}
        </div>
      </DashboardSection>
    </DashboardTemplate>
  );
}

