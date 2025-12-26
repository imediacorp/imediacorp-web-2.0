/**
 * Domain/Product Data
 * Centralized data for all CHADD Suite products
 */

import { Domain } from '@/components/marketing/DomainGrid';

export const domains: Domain[] = [
  {
    id: 'medical',
    name: 'Medical Monitoring',
    description:
      'Real-time patient vital signs monitoring with early warning detection. Maps heart rate, blood pressure, oxygen saturation, and temperature to S/Q/U/D metrics.',
    icon: '🏥',
    href: '/products/medical',
    category: 'Healthcare',
    status: 'production',
    marketSize: '$8.5B (2024) → $12.2B (2029)',
    features: [
      'Real-time vital sign monitoring',
      'SQUD framework for patient health',
      'CHADD Rondo protocol stress testing',
      'Dissonance-based anomaly detection',
      'Clinical validation completed',
    ],
  },
  {
    id: 'portfolio-risk',
    name: 'CHADD Portfolio',
    description:
      'Institutional-grade portfolio risk management at 5% of Bloomberg cost. Universal CHADD framework with AI-native architecture and complete workflow.',
    icon: '📊',
    href: '/products/portfolio-risk',
    category: 'Finance',
    status: 'production',
    marketSize: '$10B+ portfolio analytics market',
    features: [
      'Universal S/Q/U/D framework',
      'Rondo protocol stress testing',
      'AI advisor with GraphRAG',
      '8+ broker integrations',
      'Investment signals (BUY/SELL/HOLD)',
    ],
  },
  {
    id: 'grid',
    name: 'Grid/Substation Monitoring',
    description:
      'Power grid stability and power quality monitoring. Prevents blackouts, reduces downtime, and protects critical infrastructure.',
    icon: '⚡',
    href: '/products/grid',
    category: 'Energy',
    status: 'production',
    marketSize: '$15.2B (2024) → $22.8B (2029)',
    features: [
      'SCADA data ingestion',
      'Voltage/frequency compliance',
      'Outage detection and analysis',
      'Health proxy calculation',
      'Fault correlation',
    ],
  },
  {
    id: 'wind',
    name: 'Wind Energy Monitoring',
    description:
      'Wind farm health and turbine performance monitoring. Optimizes performance, reduces downtime, and enables predictive maintenance.',
    icon: '💨',
    href: '/products/wind',
    category: 'Energy',
    status: 'production',
    marketSize: 'Part of $450B renewable energy market',
    features: [
      'Wind SCADA dashboard',
      'Turbine-level analysis',
      'Performance ratio calculation',
      'CHADD Rondo protocol',
      'Backtesting with fault labels',
    ],
  },
  {
    id: 'solar',
    name: 'Solar Energy Monitoring',
    description:
      'Solar plant performance and efficiency monitoring. Optimizes yield, reduces inverter downtime, and enables predictive maintenance.',
    icon: '☀️',
    href: '/products/solar',
    category: 'Energy',
    status: 'production',
    marketSize: 'Part of $450B renewable energy market',
    features: [
      'Inverter-level monitoring',
      'Weather-normalized analysis',
      'Performance ratio calculation',
      'Ramp detection',
      'CHADD integration',
    ],
  },
  {
    id: 'software',
    name: 'Software/Cloud Monitoring',
    description:
      'Application performance monitoring with multi-cloud support. Proactive issue detection, structured load testing, and cost optimization.',
    icon: '💻',
    href: '/products/software',
    category: 'Technology',
    status: 'production',
    marketSize: '$28.8B (2024) → $55.0B (2029)',
    features: [
      'AWS, GCP, Azure connectors',
      'Platform-specific configurations',
      'Hardware-specific tuning',
      'CHADD Rondo protocol',
      'Multi-cloud unified monitoring',
    ],
  },
  {
    id: 'network',
    name: 'Network Diagnostics',
    description:
      'IT network health monitoring with proactive issue detection. Optimizes performance, reduces downtime, and enables capacity planning.',
    icon: '🌐',
    href: '/products/network',
    category: 'Technology',
    status: 'production',
    marketSize: '$25.3B (2024) → $45.8B (2029)',
    features: [
      'Network CSV connector',
      'Packet-rate-weighted aggregation',
      'Network-specific presets',
      'CHADD integration',
      'AI interpretation',
    ],
  },
  {
    id: 'industrial',
    name: 'Industrial IoT / Fault Detection',
    description:
      'Single-asset fault detection and predictive maintenance. Prevents catastrophic failures and optimizes maintenance schedules.',
    icon: '🏭',
    href: '/products/industrial',
    category: 'Industrial',
    status: 'production',
    marketSize: '$7.8B (2024) → $13.8B (2029)',
    features: [
      'Single-asset monitoring',
      'Rule-based alarms',
      'Statistical anomaly overlay',
      'CHADD simulation',
      'Backtesting with fault labels',
    ],
  },
  {
    id: 'business',
    name: 'Business Health Monitoring',
    description:
      'Business performance and financial health assessment. Predictive health assessment, stress testing, and capacity planning.',
    icon: '💼',
    href: '/products/business',
    category: 'Business',
    status: 'production',
    marketSize: '$18.7B (2024) → $26.5B (2029)',
    features: [
      'KPI-to-S/Q/U mapping',
      'Stress testing (A-B-A-C-A)',
      'Human capital metrics',
      'Monte Carlo simulation',
      'AI interpretation',
    ],
  },
  {
    id: 'personnel',
    name: 'Personnel Health / Workforce Resilience',
    description:
      'Workforce health assessment with Ma\'at balance principles. Optimizes retention, improves productivity, and measures well-being ROI.',
    icon: '👥',
    href: '/products/personnel',
    category: 'Business',
    status: 'production',
    marketSize: '$4.2B (2024) → $5.8B (2029)',
    features: [
      'Personal and company views',
      'Ma\'at balance assessment',
      'Stress testing for personnel',
      'AI-gated stress tests',
      'GraphRAG integration',
    ],
  },
  {
    id: 'cliodynamics',
    name: 'Cliodynamics (Historical Analysis)',
    description:
      'Historical civilization analysis using Turchin\'s SDT model. Pattern recognition, stability analysis, and predictive historical modeling.',
    icon: '🏛️',
    href: '/products/cliodynamics',
    category: 'Research',
    status: 'production',
    marketSize: '$2.1B (2024) → $3.1B (2029)',
    features: [
      'Seshat dataset integration',
      'SDT model mapping',
      'Historical civilization analysis',
      'Cycle detection',
      'AI interpretation',
    ],
  },
  {
    id: 'geophysical',
    name: 'Climate / Geophysical Monitoring',
    description:
      'Planetary health and climate monitoring with UN SDG alignment. Climate risk assessment, environmental monitoring, and sustainability reporting.',
    icon: '🌍',
    href: '/products/geophysical',
    category: 'Environmental',
    status: 'production',
    marketSize: '$6.5B (2024) → $13.2B (2029)',
    features: [
      'Climate dataset aggregation',
      'Rondo protocol stress testing',
      'UN SDG alignment',
      'Scope selection (1-5)',
      'AI interpretation',
    ],
  },
  {
    id: 'ripples',
    name: 'Ripples: Cascading Effects Modeling',
    description:
      'Multi-domain cascading effects simulation for government, defense, and emergency response. Models trigger events and propagation through interconnected domains.',
    icon: '🌊',
    href: '/products/ripples',
    category: 'Government/Defense',
    status: 'production',
    marketSize: '$8-15B (government, defense, emergency response)',
    features: [
      'Multi-domain dependency graphs',
      'Trigger event simulation',
      'Cascading effects propagation',
      'Classification-based security',
      'Neo4j knowledge graph',
    ],
  },
  {
    id: 'aerospace',
    name: 'Aerospace Monitoring',
    description:
      'Aerospace system health monitoring for flight safety and predictive maintenance. UAV radar, IMU stack, and flight system analysis.',
    icon: '✈️',
    href: '/products/aerospace',
    category: 'Aerospace',
    status: 'prototype',
    marketSize: '$850B (2024)',
    features: [
      'UAV radar monitoring',
      'IMU stack analysis',
      'Flight system health',
      'CHADD Rondo protocol',
      'Test protocols defined',
    ],
  },
  {
    id: 'quantum',
    name: 'Quantum Computing Monitoring',
    description:
      'Real-time qubit health monitoring and quantum error correction optimization. First-mover in quantum diagnostics.',
    icon: '⚛️',
    href: '/products/quantum',
    category: 'Technology',
    status: 'prototype',
    marketSize: '$65B (2030)',
    features: [
      'Qubit coherence monitoring',
      'Gate fidelity assessment',
      'Quantum error detection',
      'Test protocols defined',
      'CHADD integration planned',
    ],
  },
  {
    id: 'electric-vehicle',
    name: 'Electric Vehicle (EV) Monitoring',
    description:
      'EV powertrain health monitoring with battery health, motor performance, and charging efficiency optimization.',
    icon: '🔌',
    href: '/products/electric-vehicle',
    category: 'Automotive',
    status: 'prototype',
    marketSize: '$800B (2027)',
    features: [
      'Battery health monitoring',
      'Motor performance analysis',
      'Charging efficiency',
      'Test protocols defined',
      'CHADD integration planned',
    ],
  },
  {
    id: 'gas-vehicle',
    name: 'Gas Vehicle Monitoring',
    description:
      'Internal combustion engine health monitoring with performance, fuel efficiency, and emissions tracking.',
    icon: '🚗',
    href: '/products/gas-vehicle',
    category: 'Automotive',
    status: 'production',
    marketSize: 'Part of $800B vehicle market',
    features: [
      'Engine performance monitoring',
      'Fuel efficiency analysis',
      'Emissions tracking',
      'CHADD integration',
      'Dashboard available',
    ],
  },
  {
    id: 'rhapsode',
    name: 'Rhapsode - Narrative INDE',
    description:
      'AI-powered Integrated Narrative Development Environment for authors and creatives. Extracts, visualizes, and analyzes narrative structures from text using advanced AI.',
    icon: '📖',
    href: '/products/rhapsode',
    category: 'Creative Technology',
    status: 'production',
    marketSize: '$2.1B (2024) → $4.8B (2029) - Creative writing tools market',
    features: [
      'AI narrative pattern analysis',
      'Genre detection and validation',
      'Unified narrative models (UKM)',
      'CHADD monitoring integration',
      'Production-validated (99.2% uptime)',
    ],
  },
  {
    id: 'harmonia',
    name: 'Harmonia - Music Analysis & Composition',
    description:
      'Music analysis API and film scoring companion. Analyzes musical structures, generates compositions, and provides harmonic analysis for creative professionals.',
    icon: '🎵',
    href: '/products/harmonia',
    category: 'Creative Technology',
    status: 'production',
    marketSize: '$1.8B (2024) → $3.2B (2029) - Music production software market',
    features: [
      'Music analysis API',
      'Film scoring assistance',
      'Leitmotif tracking',
      'MIDI export and audio import',
      'Production-validated (99.5% uptime)',
    ],
  },
  {
    id: 'production-desk',
    name: 'Production Desk',
    description:
      'Integrated production workflow management for creative projects. Streamlines production processes, coordinates workflows, and manages creative assets.',
    icon: '🎬',
    href: '/products/production-desk',
    category: 'Creative Technology',
    status: 'production',
    marketSize: '$3.5B (2024) → $6.1B (2029) - Production management software market',
    features: [
      'Workflow coordination',
      'Asset management',
      'Project tracking',
      'Team collaboration',
      'Integration with Rhapsode & Harmonia',
    ],
  },
];

export const domainCategories = [
  'Healthcare',
  'Finance',
  'Energy',
  'Technology',
  'Industrial',
  'Business',
  'Research',
  'Environmental',
  'Government/Defense',
  'Aerospace',
  'Automotive',
  'Creative Technology',
] as const;

export function getDomainsByCategory(category: string): Domain[] {
  return domains.filter((d) => d.category === category);
}

export function getDomainById(id: string): Domain | undefined {
  return domains.find((d) => d.id === id);
}

