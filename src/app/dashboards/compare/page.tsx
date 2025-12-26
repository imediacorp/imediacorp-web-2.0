/**
 * Cross-Domain Comparison Dashboard Page
 */

'use client';

import React from 'react';
import { CrossDomainComparison } from '@/components/dashboard/CrossDomainComparison';
import { DashboardTemplate } from '@/components/dashboard/template/DashboardTemplate';
import { getConfigForDomain } from '@/lib/dashboard/config';

export default function CompareDashboard() {
  const config = getConfigForDomain('compare');

  return (
    <DashboardTemplate config={config}>
      <CrossDomainComparison />
    </DashboardTemplate>
  );
}

