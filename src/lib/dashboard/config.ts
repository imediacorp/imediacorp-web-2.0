/**
 * Dashboard Configuration Presets
 * Pre-configured dashboard setups for common domains
 * 
 * Note: These configs are enhanced with domain-specific terminology
 * from AI Expert Skills at runtime via enhanceConfigWithSkill()
 */

import type { DashboardConfig, DashboardSections } from '@/types/dashboard';
import { getDomainTerminology } from './skills';

/**
 * Gas Vehicle Dashboard Configuration
 * Uses domain-specific terminology from gas_vehicle skill expert
 */
function getGasVehicleConfig(): DashboardConfig {
  const terminology = getDomainTerminology('gas-vehicle');
  
  return {
    domain: 'gas-vehicle',
    title: 'Gas Vehicle Engine Diagnostics',
    subtitle: 'Internal Combustion Engine Health Monitoring',
    description:
      `This dashboard provides comprehensive analysis of internal combustion engine performance using ${terminology.dataSourceLabel}. The ${terminology.frameworkName} framework translates sensor data into state variables (${terminology.stabilityLabel}, ${terminology.coherenceLabel}, ${terminology.susceptibilityLabel}, ${terminology.diagnosticLabel}) for system resilience, stability, and health assessment.`,
    dataSource: 'OBD-II/CAN Bus Data',
    dataSourceDescription:
      'Currently displaying synthetic OBD-II data. In production, this would connect to real-time OBD-II adapters (ELM327) or CAN bus interfaces to stream live vehicle telemetry.',
    icon: '🚗',
  };
}

export const gasVehicleConfig: DashboardConfig = getGasVehicleConfig();

/**
 * Electric Vehicle Dashboard Configuration
 * Uses domain-specific terminology from electric_vehicle skill expert
 */
function getElectricVehicleConfig(): DashboardConfig {
  const terminology = getDomainTerminology('electric-vehicle');
  
  return {
    domain: 'electric-vehicle',
    title: 'Electric Vehicle Powertrain Diagnostics',
    subtitle: 'EV Battery & Motor Health Monitoring',
    description:
      `This dashboard provides comprehensive analysis of electric vehicle powertrain performance using ${terminology.dataSourceLabel}. The ${terminology.frameworkName} framework translates sensor data into state variables (${terminology.stabilityLabel}, ${terminology.coherenceLabel}, ${terminology.susceptibilityLabel}, ${terminology.diagnosticLabel}) for system resilience, stability, and health assessment. Focus areas include battery state of charge (SOC), thermal management, motor efficiency, and overall powertrain health.`,
    dataSource: 'EV Telemetry',
    dataSourceDescription:
      'Currently displaying synthetic EV telemetry data. In production, this would connect to real-time vehicle data sources to stream live battery, motor, and powertrain telemetry.',
    icon: '⚡',
  };
}

export const electricVehicleConfig: DashboardConfig = getElectricVehicleConfig();

/**
 * Grid/Substation Dashboard Configuration
 * Uses domain-specific terminology from grid skill expert
 */
function getGridSubstationConfig(): DashboardConfig {
  const terminology = getDomainTerminology('grid');
  
  return {
    domain: 'grid',
    title: 'Grid Substation Dashboard',
    subtitle: 'Power Grid & Substation Health Monitoring',
    description:
      `Monitor ${terminology.stabilityLabel.toLowerCase()}, power quality, load stress, and substation health using ${terminology.frameworkName} framework.`,
    dataSource: terminology.dataSourceLabel,
    dataSourceDescription: 'Real-time SCADA data from power grid sensors and substation monitoring systems.',
    icon: '⚡',
  };
}

export const gridSubstationConfig: DashboardConfig = getGridSubstationConfig();

/**
 * Industrial Fault Detection Configuration
 * Uses domain-specific terminology from industrial skill expert
 */
function getIndustrialConfig(): DashboardConfig {
  const terminology = getDomainTerminology('industrial');
  
  return {
    domain: 'industrial',
    title: 'Industrial Fault Detection Dashboard',
    subtitle: 'Industrial Equipment Health & Fault Detection',
    description:
      `Monitor industrial equipment ${terminology.healthLabel.toLowerCase()}, detect faults, and predict maintenance needs using ${terminology.dataSourceLabel.toLowerCase()} and ${terminology.frameworkName} analysis.`,
    dataSource: terminology.dataSourceLabel,
    dataSourceDescription: 'Data from industrial IoT sensors, SCADA systems, and equipment monitoring.',
    icon: '🏭',
  };
}

export const industrialConfig: DashboardConfig = getIndustrialConfig();

/**
 * Solar SCADA Dashboard Configuration
 * Uses domain-specific terminology from solar domain
 */
function getSolarConfig(): DashboardConfig {
  const terminology = getDomainTerminology('solar');
  
  return {
    domain: 'solar',
    title: 'Solar SCADA Dashboard',
    subtitle: 'Solar Plant Performance & Health Monitoring',
    description:
      `Monitor solar plant performance, inverter health, and efficiency using ${terminology.dataSourceLabel.toLowerCase()}. The ${terminology.frameworkName} framework translates sensor data into state variables (${terminology.stabilityLabel}, ${terminology.coherenceLabel}, ${terminology.susceptibilityLabel}, ${terminology.diagnosticLabel}) for system resilience, stability, and health assessment.`,
    dataSource: terminology.dataSourceLabel,
    dataSourceDescription: 'Real-time SCADA data from solar inverters, weather stations, and plant monitoring systems.',
    icon: '☀️',
  };
}

export const solarConfig: DashboardConfig = getSolarConfig();

/**
 * Wind SCADA Dashboard Configuration
 * Uses domain-specific terminology from wind domain
 */
function getWindConfig(): DashboardConfig {
  const terminology = getDomainTerminology('wind');
  
  return {
    domain: 'wind',
    title: 'Wind SCADA Dashboard',
    subtitle: 'Wind Plant Performance & Turbine Health Monitoring',
    description:
      `Monitor wind plant performance, turbine health, and drivetrain condition using ${terminology.dataSourceLabel.toLowerCase()}. The ${terminology.frameworkName} framework translates sensor data into state variables (${terminology.stabilityLabel}, ${terminology.coherenceLabel}, ${terminology.susceptibilityLabel}, ${terminology.diagnosticLabel}) for system resilience, stability, and health assessment.`,
    dataSource: terminology.dataSourceLabel,
    dataSourceDescription: 'Real-time SCADA data from wind turbines, nacelle sensors, and plant monitoring systems.',
    icon: '🌬️',
  };
}

export const windConfig: DashboardConfig = getWindConfig();

/**
 * Software Performance Dashboard Configuration
 * Uses domain-specific terminology from software skill expert
 */
function getSoftwareConfig(): DashboardConfig {
  const terminology = getDomainTerminology('software');
  
  return {
    domain: 'software',
    title: 'Software Performance Dashboard',
    subtitle: 'Application Performance & Health Monitoring',
    description:
      `Monitor software application performance, resource utilization, and reliability using ${terminology.dataSourceLabel.toLowerCase()}. The ${terminology.frameworkName} framework translates performance metrics into state variables (${terminology.stabilityLabel}, ${terminology.coherenceLabel}, ${terminology.susceptibilityLabel}, ${terminology.diagnosticLabel}) for system resilience, stability, and health assessment.`,
    dataSource: terminology.dataSourceLabel,
    dataSourceDescription: 'Real-time application performance metrics from APM tools, monitoring agents, and system telemetry.',
    icon: '💻',
  };
}

export const softwareConfig: DashboardConfig = getSoftwareConfig();

/**
 * Cloud Platform Dashboard Configuration
 * Uses domain-specific terminology from cloud skill expert
 */
function getCloudConfig(): DashboardConfig {
  const terminology = getDomainTerminology('cloud');
  
  return {
    domain: 'cloud',
    title: 'Cloud Platform Dashboard',
    subtitle: 'Cloud Infrastructure & Resource Health Monitoring',
    description:
      `Monitor cloud platform resource utilization, cost efficiency, and scalability using ${terminology.dataSourceLabel.toLowerCase()}. The ${terminology.frameworkName} framework translates cloud metrics into state variables (${terminology.stabilityLabel}, ${terminology.coherenceLabel}, ${terminology.susceptibilityLabel}, ${terminology.diagnosticLabel}) for system resilience, stability, and health assessment.`,
    dataSource: terminology.dataSourceLabel,
    dataSourceDescription: 'Real-time cloud platform metrics from cloud provider APIs, monitoring services, and infrastructure telemetry.',
    icon: '☁️',
  };
}

export const cloudConfig: DashboardConfig = getCloudConfig();

/**
 * Medical Vital Signs Dashboard Configuration
 * Uses domain-specific terminology from medical skill expert
 */
function getMedicalConfig(): DashboardConfig {
  const terminology = getDomainTerminology('medical');
  
  return {
    domain: 'medical',
    title: 'Medical Vital Signs Dashboard',
    subtitle: 'Patient Health & Vital Signs Monitoring',
    description:
      `Monitor patient vital signs and detect early warning signals of deterioration using ${terminology.dataSourceLabel.toLowerCase()}. The ${terminology.frameworkName} framework translates vital signs into state variables (${terminology.stabilityLabel}, ${terminology.coherenceLabel}, ${terminology.susceptibilityLabel}, ${terminology.diagnosticLabel}) for clinical decision support and health resilience assessment.`,
    dataSource: terminology.dataSourceLabel,
    dataSourceDescription: 'Real-time vital signs data from patient monitoring systems, EMR integration, and clinical devices.',
    icon: '🏥',
  };
}

export const medicalConfig: DashboardConfig = getMedicalConfig();

/**
 * Business Health Dashboard Configuration
 * Uses domain-specific terminology from business skill expert
 */
function getBusinessConfig(): DashboardConfig {
  const terminology = getDomainTerminology('business');
  
  return {
    domain: 'business',
    title: 'Business Health Dashboard',
    subtitle: 'Business Performance & Financial Health Monitoring',
    description:
      `Monitor business performance, financial health, and operational efficiency using ${terminology.dataSourceLabel.toLowerCase()}. The ${terminology.frameworkName} framework translates business KPIs into state variables (${terminology.stabilityLabel}, ${terminology.coherenceLabel}, ${terminology.susceptibilityLabel}, ${terminology.diagnosticLabel}) for strategic decision support and risk assessment.`,
    dataSource: terminology.dataSourceLabel,
    dataSourceDescription: 'Business KPIs from financial systems, CRM platforms, and operational dashboards.',
    icon: '💼',
  };
}

export const businessConfig: DashboardConfig = getBusinessConfig();

/**
 * Portfolio Risk Dashboard Configuration
 * Uses domain-specific terminology from business/financial skill expert
 */
function getPortfolioConfig(): DashboardConfig {
  // Use business terminology or fallback to defaults
  let terminology;
  try {
    terminology = getDomainTerminology('business');
  } catch (error) {
    // Fallback if skills module not available
    terminology = {
      frameworkName: 'CHADD',
      stabilityLabel: 'Stability (S)',
      coherenceLabel: 'Coherence (Q)',
      susceptibilityLabel: 'Susceptibility (U)',
      diagnosticLabel: 'Diagnostic (D)',
      dataSourceLabel: 'Financial Data',
    };
  }
  
  return {
    domain: 'portfolio-risk',
    title: 'Portfolio Risk Analysis',
    subtitle: 'CHADD Resilience & Investment Value Assessment',
    description:
      `Analyze portfolio holdings using ${terminology.frameworkName} framework for resilience and investment value assessment. The framework translates financial metrics into state variables (${terminology.stabilityLabel}, ${terminology.coherenceLabel}, ${terminology.susceptibilityLabel}, ${terminology.diagnosticLabel}) to identify long-term value and short-term opportunities.`,
    dataSource: 'Polygon API - Market Data',
    dataSourceDescription: 'Historical market data from Polygon API. The dashboard includes a demonstration portfolio (Berkshire Hathaway) for testing and evaluation purposes.',
    icon: '📊',
  };
}

export const portfolioConfig: DashboardConfig = getPortfolioConfig();

/**
 * Geophysical (Climate) Dashboard Configuration
 * Uses domain-specific terminology from geophysical/climate domain
 */
function getGeophysicalConfig(): DashboardConfig {
  const terminology = getDomainTerminology('geophysical');
  
  return {
    domain: 'geophysical',
    title: 'Geophysical Dashboard',
    subtitle: 'Planetary Health & Climate Monitoring',
    description:
      `Monitor planetary health using the ${terminology.frameworkName} framework with authoritative climate data from NOAA, NASA, and UN agencies. The framework translates climate indicators into state variables (${terminology.stabilityLabel}, ${terminology.coherenceLabel}, ${terminology.susceptibilityLabel}, ${terminology.diagnosticLabel}) for early warning diagnostics and actionable insights aligned with UN SDGs.`,
    dataSource: terminology.dataSourceLabel,
    dataSourceDescription: 'Climate data from NOAA, NASA GISTEMP, NSIDC, RAPID array, and other peer-reviewed sources. Supports global, hemispheric, regional, and local scope analysis with Rondo A-B-A-C-A perturbation protocol.',
    icon: '🌍',
  };
}

export const geophysicalConfig: DashboardConfig = getGeophysicalConfig();

/**
 * Hantek 1008B Oscilloscope Dashboard Configuration
 * Uses domain-specific terminology for oscilloscope/signal analysis
 */
function getHantekConfig(): DashboardConfig {
  const terminology = getDomainTerminology('industrial'); // Use industrial as closest match
  
  return {
    domain: 'hantek',
    title: 'Hantek 1008B Oscilloscope Dashboard',
    subtitle: '8-Channel USB Oscilloscope Signal Analysis',
    description:
      `Analyze 8-channel oscilloscope signals from Hantek 1008B USB oscilloscope. The ${terminology.frameworkName} framework translates signal characteristics into state variables (${terminology.stabilityLabel}, ${terminology.coherenceLabel}, ${terminology.susceptibilityLabel}, ${terminology.diagnosticLabel}) for signal health assessment and automotive diagnostic analysis.`,
    dataSource: 'Hantek 1008B USB Oscilloscope',
    dataSourceDescription: 'Real-time or recorded data from Hantek 1008B 8-channel USB oscilloscope. Supports automotive diagnostic signals including crankshaft, camshaft, MAF, MAP, lambda sensors, and more.',
    icon: '📡',
  };
}

export const hantekConfig: DashboardConfig = getHantekConfig();

/**
 * Cliodynamics Dashboard Configuration
 * Uses domain-specific terminology from cliodynamics skill expert
 */
function getCliodynamicsConfig(): DashboardConfig {
  const terminology = getDomainTerminology('cliodynamics');
  
  return {
    domain: 'cliodynamics',
    title: 'Cliodynamics Dashboard',
    subtitle: 'Civilization Dynamics & Historical Analysis',
    description:
      `Analyze historical civilizations and detect patterns using ${terminology.dataSourceLabel.toLowerCase()}. The ${terminology.frameworkName} framework translates historical data into state variables (${terminology.stabilityLabel}, ${terminology.coherenceLabel}, ${terminology.susceptibilityLabel}, ${terminology.diagnosticLabel}) for civilization health assessment and secular cycle analysis.`,
    dataSource: terminology.dataSourceLabel,
    dataSourceDescription: 'Historical data from Seshat Global History Databank covering 500 societies over 10,000 years (4000 BCE–600 CE).',
    icon: '🏛️',
  };
}

export const cliodynamicsConfig: DashboardConfig = getCliodynamicsConfig();

/**
 * Aerospace Dashboard Configuration
 * Uses domain-specific terminology from aerospace domain
 */
function getAerospaceConfig(): DashboardConfig {
  const terminology = getDomainTerminology('aerospace');
  
  return {
    domain: 'aerospace',
    title: 'Aerospace Dashboard',
    subtitle: 'UAV Radar/Avionics Health Monitoring',
    description:
      `Monitor UAV radar/avionics signals, detect anomalies, and analyze system health using ${terminology.dataSourceLabel.toLowerCase()}. The ${terminology.frameworkName} framework translates sensor data into state variables (${terminology.stabilityLabel}, ${terminology.coherenceLabel}, ${terminology.susceptibilityLabel}, ${terminology.diagnosticLabel}) for system resilience, stability, and health assessment.`,
    dataSource: terminology.dataSourceLabel,
    dataSourceDescription: 'Real-time or recorded data from UAV radar systems, avionics sensors, and aerospace monitoring systems. Supports radar range calibration, Doppler tracking, IMU stability, and signal analysis.',
    icon: '✈️',
  };
}

export const aerospaceConfig: DashboardConfig = getAerospaceConfig();

/**
 * Personnel Health Dashboard Configuration
 * Uses domain-specific terminology from personnel skill expert
 */
function getPersonnelConfig(): DashboardConfig {
  const terminology = getDomainTerminology('personnel');
  
  return {
    domain: 'personnel',
    title: 'Personnel Health Dashboard',
    subtitle: 'Personnel Resilience & Organizational Health Monitoring',
    description:
      `Monitor personnel health, organizational stability, and team performance using ${terminology.dataSourceLabel.toLowerCase()}. The ${terminology.frameworkName} framework translates personnel metrics into state variables (${terminology.stabilityLabel}, ${terminology.coherenceLabel}, ${terminology.susceptibilityLabel}, ${terminology.diagnosticLabel}) for organizational resilience and health assessment. Includes Ma'at balance scoring and stress scenario analysis.`,
    dataSource: terminology.dataSourceLabel,
    dataSourceDescription: 'Personnel metrics from HR systems, performance reviews, and organizational assessments. Includes individual and aggregate company-level analysis.',
    icon: '👥',
  };
}

export const personnelConfig: DashboardConfig = getPersonnelConfig();

/**
 * Network Dashboard Configuration
 * Uses domain-specific terminology from network skill expert
 */
function getNetworkConfig(): DashboardConfig {
  const terminology = getDomainTerminology('network');
  
  return {
    domain: 'network',
    title: 'IT Network Maintenance & Diagnostics',
    subtitle: 'Switch Health, Traffic Quality & Network Monitoring',
    description:
      `Monitor network device health, traffic quality, and switch performance using ${terminology.dataSourceLabel.toLowerCase()}. The ${terminology.frameworkName} framework translates network telemetry into state variables (${terminology.stabilityLabel}, ${terminology.coherenceLabel}, ${terminology.susceptibilityLabel}, ${terminology.diagnosticLabel}) for network resilience, stability, and health assessment. Focus areas include switch CPU/memory utilization, packet errors, broadcast/multicast ratios, and ARP integrity.`,
    dataSource: terminology.dataSourceLabel,
    dataSourceDescription: 'Network telemetry from switches, routers, and network monitoring systems. Includes CPU, memory, temperature, packet counters, error rates, and ARP integrity metrics.',
    icon: '🌐',
  };
}

export const networkConfig: DashboardConfig = getNetworkConfig();

/**
 * Quantum Computing Dashboard Configuration
 * Uses domain-specific terminology for quantum computing/qubit monitoring
 */
function getQuantumConfig(): DashboardConfig {
  const terminology = getDomainTerminology('quantum');
  
  return {
    domain: 'quantum',
    title: 'Quantum Computing Dashboard',
    subtitle: 'Qubit Monitoring & Gate Fidelity Analysis',
    description:
      `Monitor quantum qubit health, gate fidelity, and coherence times using ${terminology.dataSourceLabel.toLowerCase()}. The ${terminology.frameworkName} framework translates quantum metrics into state variables (${terminology.stabilityLabel}, ${terminology.coherenceLabel}, ${terminology.susceptibilityLabel}, ${terminology.diagnosticLabel}) for qubit health assessment and quantum system resilience.`,
    dataSource: terminology.dataSourceLabel,
    dataSourceDescription: 'Real-time quantum qubit telemetry from quantum processors, including gate fidelity, T1/T2 coherence times, noise levels, and crosstalk measurements.',
    icon: '⚛️',
  };
}

export const quantumConfig: DashboardConfig = getQuantumConfig();

/**
 * Default dashboard sections
 */
export const defaultSections: DashboardSections = {
  header: true,
  metrics: true,
  telemetry: true,
  charts: true,
  aiInterpretation: true,
  maintenance: true,
  export: false,
};

/**
 * Minimal dashboard sections (for simple dashboards)
 */
export const minimalSections: DashboardSections = {
  header: true,
  metrics: true,
  charts: true,
  aiInterpretation: false,
  maintenance: false,
  telemetry: false,
  export: false,
};

/**
 * Full dashboard sections (all features enabled)
 */
export const fullSections: DashboardSections = {
  header: true,
  metrics: true,
  telemetry: true,
  charts: true,
  aiInterpretation: true,
  maintenance: true,
  export: true,
};

/**
 * Get configuration for a domain
 * Automatically uses domain-specific terminology from skill experts
 */
/**
 * Cross-Domain Comparison Dashboard Configuration
 */
function getCompareConfig(): DashboardConfig {
  return {
    domain: 'compare',
    title: 'Cross-Domain Comparison',
    subtitle: 'Compare S/Q/U/D Metrics Across Multiple Domains',
    description: 'Compare system health metrics across different domains to identify patterns, correlations, and insights.',
    dataSource: 'Multi-Domain Data',
    icon: '🔀',
  };
}

export const compareConfig: DashboardConfig = getCompareConfig();

/**
 * Predictive Modeling Dashboard Configuration
 */
function getPredictiveConfig(): DashboardConfig {
  return {
    domain: 'predictive',
    title: 'Predictive Modeling',
    subtitle: 'Forecasting, Anomaly Detection & Failure Prediction',
    description: 'Create and manage predictive models for forecasting, anomaly detection, failure prediction, and health score prediction.',
    dataSource: 'Historical Data',
    icon: '🔮',
  };
}

export const predictiveConfig: DashboardConfig = getPredictiveConfig();

/**
 * Dashboard Builder Configuration
 */
function getBuilderConfig(): DashboardConfig {
  return {
    domain: 'builder',
    title: 'Custom Dashboard Builder',
    subtitle: 'Create Custom Dashboards with Drag-and-Drop',
    description: 'Build custom dashboards by selecting and arranging components to create personalized views of your data.',
    dataSource: 'Custom Configuration',
    icon: '🛠️',
  };
}

export const builderConfig: DashboardConfig = getBuilderConfig();

export function getConfigForDomain(domain: string): DashboardConfig {
  const configs: Record<string, DashboardConfig> = {
    'gas-vehicle': gasVehicleConfig,
    'gas_vehicle': gasVehicleConfig,
    'electric-vehicle': electricVehicleConfig,
    'electric_vehicle': electricVehicleConfig,
    'grid': gridSubstationConfig,
    'industrial': industrialConfig,
    'solar': solarConfig,
    'wind': windConfig,
    'software': softwareConfig,
    'cloud': cloudConfig,
    'medical': medicalConfig,
    'business': businessConfig,
    'portfolio-risk': portfolioConfig,
    'portfolio': portfolioConfig,
    'geophysical': geophysicalConfig,
    'climate': geophysicalConfig,
    'hantek': hantekConfig,
    'cliodynamics': cliodynamicsConfig,
    'personnel': personnelConfig,
    'personnel-health': personnelConfig,
    'network': networkConfig,
    'quantum': quantumConfig,
    'aerospace': aerospaceConfig,
    'compare': compareConfig,
    'predictive': predictiveConfig,
    'builder': builderConfig,
  };

  const normalizedDomain = domain.toLowerCase().replace(/_/g, '-');
  
  if (configs[normalizedDomain] || configs[domain]) {
    return configs[normalizedDomain] || configs[domain]!;
  }

  // Default config with domain terminology
  const terminology = getDomainTerminology(normalizedDomain);
  return {
    domain: normalizedDomain,
    title: `${domain.charAt(0).toUpperCase() + domain.slice(1)} Dashboard`,
    subtitle: `${terminology.healthLabel} Monitoring`,
    description: `Dashboard for ${domain} domain monitoring and diagnostics using ${terminology.frameworkName} framework.`,
    dataSource: terminology.dataSourceLabel,
  };
}

