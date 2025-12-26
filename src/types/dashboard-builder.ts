/**
 * Dashboard Builder Types
 * Type definitions for custom dashboard builder functionality
 */

/**
 * Component type identifier
 */
export type ComponentType =
  | 'MetricsCard'
  | 'TimeSeriesChart'
  | 'TrendAnalysis'
  | 'AIInterpretation'
  | 'MaintenanceRecommendations'
  | 'SummaryCards'
  | 'FleetManagement'
  | 'CrossDomainComparison'
  | 'ForecastChart'
  | 'AnomalyPrediction'
  | 'CustomChart';

/**
 * Component category
 */
export type ComponentCategory = 'metrics' | 'charts' | 'analysis' | 'recommendations' | 'custom';

/**
 * Grid position
 */
export interface GridPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Component configuration
 */
export interface ComponentConfig {
  id: string;
  type: ComponentType;
  position: GridPosition;
  config: Record<string, unknown>;
  dataSource?: {
    type: 'domain' | 'api' | 'static';
    source: string;
    config?: Record<string, unknown>;
  };
}

/**
 * Dashboard layout configuration
 */
export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  components: ComponentConfig[];
  gridColumns?: number;
  gridRows?: number;
  theme?: {
    colorScheme?: 'default' | 'dark' | 'auto';
    primaryColor?: string;
  };
}

/**
 * Custom dashboard
 */
export interface CustomDashboard {
  id: string;
  userId: string;
  name: string;
  description?: string;
  layout: DashboardLayout;
  isPublic: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Dashboard component definition
 */
export interface DashboardComponent {
  id: string;
  componentType: ComponentType;
  name: string;
  description?: string;
  category: ComponentCategory;
  defaultConfig: Record<string, unknown>;
  schema?: Record<string, unknown>; // JSON schema
  isBuiltin: boolean;
}

/**
 * Component palette item
 */
export interface ComponentPaletteItem {
  type: ComponentType;
  name: string;
  description?: string;
  category: ComponentCategory;
  icon?: string;
  defaultSize: {
    w: number;
    h: number;
  };
}

/**
 * Dashboard share
 */
export interface DashboardShare {
  id: string;
  dashboardId: string;
  sharedWithUserId?: string;
  sharedWithEmail?: string;
  permission: 'view' | 'edit';
  sharedByUserId: string;
  created_at: string;
}

/**
 * Dashboard builder state
 */
export interface DashboardBuilderState {
  layout: DashboardLayout;
  selectedComponent?: string;
  isPreviewMode: boolean;
  isDirty: boolean;
}

/**
 * Component configuration panel props
 */
export interface ComponentConfigPanelProps {
  component: ComponentConfig;
  onUpdate: (config: ComponentConfig) => void;
  onDelete: () => void;
}

/**
 * Canvas drop event
 */
export interface CanvasDropEvent {
  componentType: ComponentType;
  position: { x: number; y: number };
}

