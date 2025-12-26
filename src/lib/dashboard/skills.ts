/**
 * Dashboard Skills Integration
 * Integrates AI Expert Skills for domain-specific terminology and language
 */

import type { DashboardConfig } from '@/types/dashboard';

/**
 * Skill metadata from backend
 */
export interface SkillMetadata {
  name: string;
  domain: string;
  description: string;
  version?: string;
  tags?: string[];
  author?: string;
}

/**
 * Domain-specific terminology extracted from skills
 */
export interface DomainTerminology {
  // Framework terminology
  frameworkName: string; // e.g., "CHADD/HDPD"
  stabilityLabel: string; // e.g., "Stability" or "Battery Pack Stability"
  coherenceLabel: string; // e.g., "Coherence" or "Combustion Quality"
  susceptibilityLabel: string; // e.g., "Susceptibility" or "Thermal Stress"
  diagnosticLabel: string; // e.g., "Diagnostic" or "Engine Health"
  
  // Domain-specific labels
  dataSourceLabel: string; // e.g., "OBD-II/CAN Bus Data" or "EV Telemetry"
  telemetryLabel: string; // e.g., "Engine Telemetry" or "Powertrain Telemetry"
  healthLabel: string; // e.g., "Engine Health" or "Battery Health"
  
  // Key metrics labels
  keyMetrics: Record<string, string>; // Metric name -> display label
  normalRanges?: Record<string, { optimal?: string; acceptable?: string; critical?: string }>;
  
  // Common terms
  commonTerms: Record<string, string>; // Technical term -> user-friendly label
}

/**
 * Domain terminology mappings (extracted from skill experts)
 */
const domainTerminologyMap: Record<string, DomainTerminology> = {
  'gas-vehicle': {
    frameworkName: 'CHADD/HDPD',
    stabilityLabel: 'Engine Stability',
    coherenceLabel: 'Combustion Quality',
    susceptibilityLabel: 'Engine Stress',
    diagnosticLabel: 'Engine Health',
    dataSourceLabel: 'OBD-II/CAN Bus Data',
    telemetryLabel: 'Engine Telemetry',
    healthLabel: 'Engine Health',
    keyMetrics: {
      engine_rpm: 'Engine RPM',
      coolant_temp: 'Coolant Temperature',
      throttle_position: 'Throttle Position',
      maf: 'Mass Air Flow',
      o2_sensor_1: 'O2 Sensor (Lambda)',
      timing_advance: 'Ignition Timing',
      oil_pressure: 'Oil Pressure',
      vibration: 'Engine Vibration',
    },
    normalRanges: {
      coolant_temp: {
        optimal: '85-95°C',
        acceptable: '80-105°C',
        critical: '70-110°C',
      },
      engine_rpm: {
        optimal: 'Idle: 750-900 RPM',
        acceptable: 'Cruise: 1500-3000 RPM',
      },
      o2_sensor: {
        optimal: '1.0 (stoichiometric)',
        acceptable: '0.95-1.05',
      },
    },
    commonTerms: {
      'OBD-II': 'On-Board Diagnostics',
      'CAN': 'Controller Area Network',
      'ICE': 'Internal Combustion Engine',
      'MAF': 'Mass Air Flow',
      'DTC': 'Diagnostic Trouble Code',
      'BTDC': 'Before Top Dead Center',
    },
  },
  'electric-vehicle': {
    frameworkName: 'CHADD/HDPD',
    stabilityLabel: 'Battery Pack Stability',
    coherenceLabel: 'Energy Efficiency',
    susceptibilityLabel: 'Thermal Stress',
    diagnosticLabel: 'Powertrain Health',
    dataSourceLabel: 'EV Telemetry',
    telemetryLabel: 'Powertrain Telemetry',
    healthLabel: 'Battery & Motor Health',
    keyMetrics: {
      battery_soc: 'State of Charge (SOC)',
      battery_temp: 'Battery Temperature',
      battery_voltage: 'Battery Voltage',
      battery_current: 'Battery Current',
      motor_temp: 'Motor Temperature',
      motor_current: 'Motor Current',
      motor_speed: 'Motor Speed',
      efficiency: 'Motor Efficiency',
      power_kw: 'Power Output',
    },
    normalRanges: {
      battery_temp: {
        optimal: '20-40°C',
        acceptable: '0-50°C',
        critical: '-10-60°C',
      },
      battery_soc: {
        optimal: '20-80%',
        acceptable: '10-90%',
      },
      motor_temp: {
        optimal: '30-60°C',
        acceptable: '25-75°C',
        critical: '20-85°C',
      },
      efficiency: {
        optimal: '>90%',
        acceptable: '85-90%',
      },
    },
    commonTerms: {
      'SOC': 'State of Charge',
      'BMS': 'Battery Management System',
      'kW': 'Kilowatt',
      'kWh': 'Kilowatt-hour',
      'DC': 'Direct Current',
      'AC': 'Alternating Current',
      'Regen': 'Regenerative Braking',
    },
  },
  'grid': {
    frameworkName: 'CHADD/HDPD',
    stabilityLabel: 'Grid Stability',
    coherenceLabel: 'Power Quality',
    susceptibilityLabel: 'Load Stress',
    diagnosticLabel: 'Grid Health',
    dataSourceLabel: 'SCADA Data',
    telemetryLabel: 'Grid Telemetry',
    healthLabel: 'Grid & Substation Health',
    keyMetrics: {
      voltage: 'Voltage',
      frequency: 'Frequency',
      power_flow: 'Power Flow',
      transformer_temp: 'Transformer Temperature',
    },
    commonTerms: {
      'SCADA': 'Supervisory Control and Data Acquisition',
      'kV': 'Kilovolt',
      'MW': 'Megawatt',
      'Hz': 'Hertz',
    },
  },
  'industrial': {
    frameworkName: 'CHADD/HDPD',
    stabilityLabel: 'Equipment Stability',
    coherenceLabel: 'Process Quality',
    susceptibilityLabel: 'Operational Stress',
    diagnosticLabel: 'Equipment Health',
    dataSourceLabel: 'Industrial Sensors',
    telemetryLabel: 'Equipment Telemetry',
    healthLabel: 'Industrial Equipment Health',
    keyMetrics: {
      temperature: 'Temperature',
      pressure: 'Pressure',
      vibration: 'Vibration',
      flow_rate: 'Flow Rate',
    },
    commonTerms: {
      'IoT': 'Internet of Things',
      'SCADA': 'Supervisory Control and Data Acquisition',
    },
  },
  'solar': {
    frameworkName: 'CHADD/HDPD',
    stabilityLabel: 'Plant Stability',
    coherenceLabel: 'Performance Quality',
    susceptibilityLabel: 'Environmental Stress',
    diagnosticLabel: 'Plant Health',
    dataSourceLabel: 'Solar SCADA Data',
    telemetryLabel: 'Plant Telemetry',
    healthLabel: 'Solar Plant Health',
    keyMetrics: {
      inverter_power: 'Inverter Power',
      plant_power: 'Plant Power',
      irradiance: 'Irradiance',
      ambient_temp: 'Ambient Temperature',
      module_temp: 'Module Temperature',
      performance_ratio: 'Performance Ratio (PR)',
    },
    normalRanges: {
      performance_ratio: {
        optimal: '>0.85',
        acceptable: '0.75-0.85',
        critical: '<0.75',
      },
      module_temp: {
        optimal: '<65°C',
        acceptable: '65-75°C',
        critical: '>75°C',
      },
      irradiance: {
        optimal: '>700 W/m²',
        acceptable: '400-700 W/m²',
        critical: '<400 W/m²',
      },
    },
    commonTerms: {
      'PR': 'Performance Ratio',
      'kW': 'Kilowatt',
      'MW': 'Megawatt',
      'W/m²': 'Watts per square meter',
      'SCADA': 'Supervisory Control and Data Acquisition',
    },
  },
  'wind': {
    frameworkName: 'CHADD/HDPD',
    stabilityLabel: 'Plant Availability',
    coherenceLabel: 'Wind Resource Quality',
    susceptibilityLabel: 'Drivetrain Stress',
    diagnosticLabel: 'Turbine Health',
    dataSourceLabel: 'Wind SCADA Data',
    telemetryLabel: 'Turbine Telemetry',
    healthLabel: 'Wind Plant Health',
    keyMetrics: {
      wind_speed: 'Wind Speed (hub height)',
      turbine_power: 'Turbine Power',
      plant_power: 'Plant Power',
      nacelle_temp: 'Nacelle Temperature',
      gearbox_temp: 'Gearbox Temperature',
      vibration: 'Vibration',
      availability: 'Availability',
      capacity_factor: 'Capacity Factor',
    },
    normalRanges: {
      wind_speed: {
        optimal: '12-15 m/s (rated)',
        acceptable: '3-22 m/s (cut-in to cut-out)',
        critical: '<3 or >22 m/s',
      },
      gearbox_temp: {
        optimal: '<70°C',
        acceptable: '70-80°C',
        critical: '>80°C',
      },
      vibration: {
        optimal: '<5 mm/s',
        acceptable: '5-8 mm/s',
        critical: '>8 mm/s',
      },
      availability: {
        optimal: '>95%',
        acceptable: '90-95%',
        critical: '<90%',
      },
    },
    commonTerms: {
      'kW': 'Kilowatt',
      'MW': 'Megawatt',
      'm/s': 'Meters per second',
      'SCADA': 'Supervisory Control and Data Acquisition',
      'CF': 'Capacity Factor',
    },
  },
  'personnel': {
    frameworkName: 'CHADD/HDPD',
    stabilityLabel: 'Organizational Stability',
    coherenceLabel: 'Team Coherence',
    susceptibilityLabel: 'Personnel Stress',
    diagnosticLabel: 'Personnel Health',
    dataSourceLabel: 'Personnel Metrics',
    telemetryLabel: 'Personnel Metrics',
    healthLabel: 'Personnel Health',
    keyMetrics: {
      performance: 'Performance',
      reliability: 'Reliability',
      collaboration: 'Collaboration',
      learning: 'Learning & Development',
      well_being: 'Well-being',
      integrity: 'Integrity',
      balance_score: 'Ma\'at Balance Score',
    },
    normalRanges: {
      performance: {
        optimal: '>0.75',
        acceptable: '0.60-0.75',
        critical: '<0.60',
      },
      reliability: {
        optimal: '>0.75',
        acceptable: '0.60-0.75',
        critical: '<0.60',
      },
      well_being: {
        optimal: '>0.70',
        acceptable: '0.50-0.70',
        critical: '<0.50',
      },
      balance_score: {
        optimal: '>0.70',
        acceptable: '0.50-0.70',
        critical: '<0.50',
      },
    },
    commonTerms: {
      'Ma\'at': 'Balance and harmony principle',
      'FTE': 'Full-Time Equivalent',
      'S/Q/U': 'Stability, Coherence, Susceptibility',
      'CHADD': 'Complex Health Assessment and Diagnostic Dynamics',
      'KPI': 'Key Performance Indicator',
    },
  },
  'cliodynamics': {
    frameworkName: 'CHADD/SDT',
    stabilityLabel: 'Social Stability',
    coherenceLabel: 'Social Complexity',
    susceptibilityLabel: 'Elite Overproduction',
    diagnosticLabel: 'Civilization Health',
    dataSourceLabel: 'Seshat Global History Databank',
    telemetryLabel: 'Historical Data',
    healthLabel: 'Civilization Health',
    keyMetrics: {
      population: 'Population',
      hierarchy: 'Political Hierarchy',
      inequality: 'Inequality',
      warfare: 'Warfare Intensity',
      urbanization: 'Urbanization',
      social_complexity: 'Social Complexity',
      elite_overproduction: 'Elite Overproduction',
      population_pressure: 'Population Pressure',
    },
    normalRanges: {
      social_complexity: {
        optimal: 'High complexity',
        acceptable: 'Moderate complexity',
      },
      inequality: {
        optimal: 'Low inequality',
        acceptable: 'Moderate inequality',
        critical: 'High inequality',
      },
    },
    commonTerms: {
      'SDT': 'Structural-Demographic Theory',
      'PSI': 'Political Stress Index',
      'Seshat': 'Seshat Global History Databank',
      'Secular Cycles': 'Long-term historical cycles',
      'Polity': 'Political entity or civilization',
    },
  },
  'geophysical': {
    frameworkName: 'CHADD/HDPD',
    stabilityLabel: 'Planetary Stability',
    coherenceLabel: 'Circulation Coherence',
    susceptibilityLabel: 'Anthropogenic Forcing',
    diagnosticLabel: 'Planetary Health',
    dataSourceLabel: 'NOAA/NASA/UN Climate Data',
    telemetryLabel: 'Climate Telemetry',
    healthLabel: 'Planetary Health',
    keyMetrics: {
      temp_anomaly: 'Temperature Anomaly (°C)',
      co2_ppm: 'CO₂ Concentration (ppm)',
      sea_ice_extent: 'Sea Ice Extent (million km²)',
      amoc_strength: 'AMOC Strength (Sv)',
      enso_regularity: 'ENSO Regularity',
      methane_flux: 'Methane Flux (Tg CH₄/yr)',
    },
    normalRanges: {
      temp_anomaly: {
        optimal: '<1.0°C (pre-industrial baseline)',
        acceptable: '1.0-1.5°C',
        critical: '>1.5°C (Paris Agreement threshold)',
      },
      co2_ppm: {
        optimal: '<350 ppm',
        acceptable: '350-420 ppm',
        critical: '>420 ppm',
      },
      sea_ice_extent: {
        optimal: '>6.0 million km²',
        acceptable: '4.0-6.0 million km²',
        critical: '<4.0 million km²',
      },
      amoc_strength: {
        optimal: '17-20 Sv',
        acceptable: '15-17 Sv',
        critical: '<15 Sv (AMOC collapse risk)',
      },
      enso_regularity: {
        optimal: '>0.8',
        acceptable: '0.6-0.8',
        critical: '<0.6',
      },
    },
    commonTerms: {
      'AMOC': 'Atlantic Meridional Overturning Circulation',
      'ENSO': 'El Niño-Southern Oscillation',
      'NOAA': 'National Oceanic and Atmospheric Administration',
      'NASA': 'National Aeronautics and Space Administration',
      'UN': 'United Nations',
      'SDG': 'Sustainable Development Goals',
      'Tg': 'Teragram (1 million metric tons)',
      'Sv': 'Sverdrup (1 million cubic meters per second)',
      'Rondo': 'A-B-A-C-A perturbation protocol',
    },
  },
  'aerospace': {
    frameworkName: 'CHADD/HDPD',
    stabilityLabel: 'Signal Stability',
    coherenceLabel: 'Signal Coherence',
    susceptibilityLabel: 'Noise Pressure',
    diagnosticLabel: 'Radar/Avionics Health',
    dataSourceLabel: 'UAV Radar/Avionics Data',
    telemetryLabel: 'Aerospace Telemetry',
    healthLabel: 'Aerospace System Health',
    keyMetrics: {
      signal: 'Signal Amplitude',
      snr: 'Signal-to-Noise Ratio (SNR)',
      drift: 'Signal Drift',
      noise: 'Noise Level',
      signal_quality: 'Signal Quality',
      z_score: 'Z-Score',
      anomaly: 'Anomaly Detection',
    },
    normalRanges: {
      snr: {
        optimal: '>15 dB',
        acceptable: '10-15 dB',
        critical: '<10 dB',
      },
      signal_quality: {
        optimal: '>0.8',
        acceptable: '0.6-0.8',
        critical: '<0.6',
      },
      noise: {
        optimal: '<0.5',
        acceptable: '0.5-1.0',
        critical: '>1.0',
      },
      drift: {
        optimal: '<0.02',
        acceptable: '0.02-0.05',
        critical: '>0.05',
      },
    },
    commonTerms: {
      'SNR': 'Signal-to-Noise Ratio',
      'UAV': 'Unmanned Aerial Vehicle',
      'dB': 'Decibel',
      'Radar': 'Radio Detection and Ranging',
      'Avionics': 'Aviation Electronics',
      'IMU': 'Inertial Measurement Unit',
      'Doppler': 'Doppler Effect',
    },
  },
  'quantum': {
    frameworkName: 'CHADD/HDPD',
    stabilityLabel: 'Qubit Stability',
    coherenceLabel: 'Gate Fidelity Quality',
    susceptibilityLabel: 'Noise & Crosstalk',
    diagnosticLabel: 'Qubit Health',
    dataSourceLabel: 'Quantum Processor Telemetry',
    telemetryLabel: 'Qubit Telemetry',
    healthLabel: 'Qubit Health',
    keyMetrics: {
      fidelity: 'Gate Fidelity',
      t1: 'T1 Coherence Time',
      t2: 'T2 Coherence Time',
      noise: 'Noise Level',
      crosstalk: 'Crosstalk',
      qubit_id: 'Qubit Identifier',
      coherence_quality: 'Coherence Quality',
      gate_fidelity_avg: 'Average Gate Fidelity',
    },
    normalRanges: {
      fidelity: {
        optimal: '≥0.95 (95%)',
        acceptable: '0.90-0.95',
        critical: '<0.90',
      },
      t1: {
        optimal: '≥100 μs',
        acceptable: '50-100 μs',
        critical: '<50 μs',
      },
      t2: {
        optimal: '≥80 μs',
        acceptable: '40-80 μs',
        critical: '<40 μs',
      },
      noise: {
        optimal: '<0.02 (2%)',
        acceptable: '0.02-0.05',
        critical: '>0.05',
      },
      crosstalk: {
        optimal: '<0.03 (3%)',
        acceptable: '0.03-0.05',
        critical: '>0.05',
      },
    },
    commonTerms: {
      'T1': 'Longitudinal relaxation time (energy decay)',
      'T2': 'Transverse relaxation time (dephasing)',
      'Gate Fidelity': 'Probability of correct gate operation',
      'Randomized Benchmarking': 'RB - Protocol for measuring gate fidelity',
      'Crosstalk': 'Unwanted coupling between qubits',
      'Depolarizing Noise': 'Type of quantum noise model',
      'Coherence': 'Maintenance of quantum superposition',
      'Qubit': 'Quantum bit - basic unit of quantum information',
      'CHADD': 'Causal Health Assessment Diagnostic & Decision',
    },
  },
  'network': {
    frameworkName: 'CHADD/HDPD',
    stabilityLabel: 'Network Stability',
    coherenceLabel: 'Traffic Quality',
    susceptibilityLabel: 'Network Utilization',
    diagnosticLabel: 'Network Health',
    dataSourceLabel: 'Network Telemetry',
    telemetryLabel: 'Switch Telemetry',
    healthLabel: 'Network Device Health',
    keyMetrics: {
      cpu_1m: 'CPU Usage (1min)',
      cpu_5m: 'CPU Usage (5min)',
      mem_used_pct: 'Memory Used (%)',
      temp_c: 'Temperature (°C)',
      pkt_rate: 'Packet Rate (pps)',
      err_rate: 'Error Rate (errors/s)',
      bcast_ratio: 'Broadcast Ratio',
      mcast_ratio: 'Multicast Ratio',
      integrity_score: 'ARP Integrity',
      in_total_pkts: 'Inbound Packets',
      out_total_pkts: 'Outbound Packets',
      in_err_pkts: 'Inbound Errors',
      out_err_pkts: 'Outbound Errors',
    },
    normalRanges: {
      cpu_1m: {
        optimal: '<70%',
        acceptable: '70-80%',
        critical: '>80%',
      },
      mem_used_pct: {
        optimal: '<75%',
        acceptable: '75-85%',
        critical: '>85%',
      },
      temp_c: {
        optimal: '<60°C',
        acceptable: '60-75°C',
        critical: '>75°C',
      },
      err_rate: {
        optimal: '<10 errors/s',
        acceptable: '10-50 errors/s',
        critical: '>50 errors/s',
      },
      bcast_ratio: {
        optimal: '<15%',
        acceptable: '15-20%',
        critical: '>20%',
      },
      mcast_ratio: {
        optimal: '<10%',
        acceptable: '10-30%',
        critical: '>30%',
      },
    },
    commonTerms: {
      'ARP': 'Address Resolution Protocol',
      'STP': 'Spanning Tree Protocol',
      'IGMP': 'Internet Group Management Protocol',
      'VLAN': 'Virtual Local Area Network',
      'QoS': 'Quality of Service',
      'CRC': 'Cyclic Redundancy Check',
      'MAC': 'Media Access Control',
      'DHCP': 'Dynamic Host Configuration Protocol',
      'pps': 'Packets per second',
      'SCADA': 'Supervisory Control and Data Acquisition',
    },
  },
};

/**
 * Get skill metadata from backend
 */
export async function getSkillMetadata(domain: string): Promise<SkillMetadata | null> {
  try {
    const response = await fetch(`/api/v1/ai/skills/${domain}/metadata`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn(`Failed to fetch skill metadata for ${domain}:`, error);
    return null;
  }
}

/**
 * Get domain terminology for a domain
 */
export function getDomainTerminology(domain: string): DomainTerminology {
  // Normalize domain name (e.g., "gas_vehicle" -> "gas-vehicle")
  const normalizedDomain = domain.toLowerCase().replace(/_/g, '-');
  
  // Return terminology if available, otherwise default
  return domainTerminologyMap[normalizedDomain] || {
    frameworkName: 'CHADD/HDPD',
    stabilityLabel: 'Stability',
    coherenceLabel: 'Coherence',
    susceptibilityLabel: 'Susceptibility',
    diagnosticLabel: 'Diagnostic',
    dataSourceLabel: 'Telemetry Data',
    telemetryLabel: 'Telemetry',
    healthLabel: 'System Health',
    keyMetrics: {},
    commonTerms: {},
  };
}

/**
 * Enhance dashboard config with skill metadata
 */
export async function enhanceConfigWithSkill(
  config: DashboardConfig
): Promise<DashboardConfig> {
  const terminology = getDomainTerminology(config.domain);
  
  // Try to get skill metadata from backend
  const skillMetadata = await getSkillMetadata(config.domain);
  
  // Enhance config with skill information
  const enhanced: DashboardConfig = {
    ...config,
    // Use skill name if available, otherwise use title
    title: skillMetadata?.name || config.title,
    // Use skill description if available, otherwise use description
    description: skillMetadata?.description || config.description || 
      `Comprehensive analysis using the ${terminology.frameworkName} framework.`,
    // Use terminology-aware data source label
    dataSource: config.dataSource || terminology.dataSourceLabel,
  };
  
  return enhanced;
}

/**
 * Get domain-specific label for a metric
 */
export function getMetricLabel(domain: string, metricKey: string): string {
  const terminology = getDomainTerminology(domain);
  return terminology.keyMetrics[metricKey] || metricKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get domain-specific label for S/Q/U/D
 */
export function getSQUDLabel(domain: string, squd: 'S' | 'Q' | 'U' | 'D'): string {
  const terminology = getDomainTerminology(domain);
  switch (squd) {
    case 'S':
      return terminology.stabilityLabel;
    case 'Q':
      return terminology.coherenceLabel;
    case 'U':
      return terminology.susceptibilityLabel;
    case 'D':
      return terminology.diagnosticLabel;
  }
}

/**
 * Get framework name for domain
 */
export function getFrameworkName(domain: string): string {
  const terminology = getDomainTerminology(domain);
  return terminology.frameworkName;
}

/**
 * Get common term explanation
 */
export function getTermExplanation(domain: string, term: string): string | null {
  const terminology = getDomainTerminology(domain);
  return terminology.commonTerms[term] || null;
}

