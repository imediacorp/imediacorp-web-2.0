/**
 * Hook for accessing domain-specific terminology
 */

import { useMemo } from 'react';
import { getDomainTerminology, getSQUDLabel, getFrameworkName, getMetricLabel } from '@/lib/dashboard/skills';
import type { DomainTerminology } from '@/lib/dashboard/skills';

/**
 * Hook to get domain-specific terminology
 */
export function useDomainTerminology(domain: string): DomainTerminology {
  return useMemo(() => getDomainTerminology(domain), [domain]);
}

/**
 * Hook to get domain-specific labels
 */
export function useDomainLabels(domain: string) {
  return useMemo(() => ({
    getSQUDLabel: (squd: 'S' | 'Q' | 'U' | 'D') => getSQUDLabel(domain, squd),
    getMetricLabel: (metricKey: string) => getMetricLabel(domain, metricKey),
    getFrameworkName: () => getFrameworkName(domain),
    terminology: getDomainTerminology(domain),
  }), [domain]);
}

