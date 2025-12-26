/**
 * Dashboard Template Types
 * Type definitions for the dashboard template system
 */

import { ReactNode } from 'react';
import { SQUDScore } from './api';

/**
 * Dashboard configuration
 */
export interface DashboardConfig {
  domain: string;
  title: string;
  subtitle: string;
  description?: string;
  dataSource?: string;
  dataSourceDescription?: string;
  icon?: string;
  colorScheme?: 'default' | 'dark' | 'auto';
}

/**
 * Assessment state
 */
export interface AssessmentState<TAssessment = unknown> {
  loading: boolean;
  error: string | null;
  data: TAssessment | null;
  lastUpdated?: Date;
}

/**
 * Dashboard sections configuration
 */
export interface DashboardSections {
  header?: boolean;
  metrics?: boolean;
  telemetry?: boolean;
  charts?: boolean;
  aiInterpretation?: boolean;
  maintenance?: boolean;
  export?: boolean;
}

/**
 * CHADD2 bridge overlay configuration
 */
export interface CHADD2OverlayConfig {
  enabled?: boolean;
  modelType?: 'auto' | 'original' | 'updated';
  fibonacciOverlay?: boolean;
  lambdaFib?: number;
  wPhi?: number;
}

/**
 * Chart configuration
 */
export interface ChartConfig {
  title: string;
  type: 'line' | 'bar' | 'area' | 'scatter';
  dataKey: string;
  lines?: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  threshold?: number;
  thresholdLabel?: string;
  height?: number;
}

/**
 * Metrics summary
 */
export interface MetricsSummary {
  squd: SQUDScore;
  health?: number;
  componentHealth?: Record<string, number>;
  performanceMetrics?: Record<string, number | string>;
}

/**
 * Maintenance recommendation
 */
export interface MaintenanceRecommendation {
  component: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  action?: string;
}

/**
 * AI Interpretation data
 */
export interface AIInterpretationData {
  text: string;
  key_insights?: string[];
  recommendations?: string[];
  confidence?: number;
}

/**
 * Dashboard template props
 */
export interface DashboardTemplateProps {
  config: DashboardConfig;
  sections?: DashboardSections;
  children?: ReactNode;
  className?: string;
}

/**
 * Data source configuration
 */
export interface DataSourceConfig {
  type: 'demo' | 'upload' | 'realtime' | 'api';
  label: string;
  description?: string;
  supportedFormats?: string[];
}

/**
 * Dashboard action
 */
export interface DashboardAction {
  id: string;
  label: string;
  icon?: string;
  onClick: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

