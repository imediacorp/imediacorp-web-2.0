/**
 * Hantek 1008B Oscilloscope Type Definitions
 */

export interface HantekRecord {
  timestamp: string;
  ch1_voltage: number;
  ch2_voltage: number;
  ch3_voltage: number;
  ch4_voltage: number;
  ch5_voltage: number;
  ch6_voltage: number;
  ch7_voltage: number;
  ch8_voltage: number;
}

export interface HantekData {
  records: HantekRecord[];
  sample_count: number;
  sample_rate?: number;
}

export interface HantekChannelMapping {
  ch1: 'crankshaft' | 'camshaft' | 'maf' | 'map' | 'lambda' | 'throttle' | 'ignition' | 'battery' | 'custom';
  ch2: 'crankshaft' | 'camshaft' | 'maf' | 'map' | 'lambda' | 'throttle' | 'ignition' | 'battery' | 'custom';
  ch3: 'crankshaft' | 'camshaft' | 'maf' | 'map' | 'lambda' | 'throttle' | 'ignition' | 'battery' | 'custom';
  ch4: 'crankshaft' | 'camshaft' | 'maf' | 'map' | 'lambda' | 'throttle' | 'ignition' | 'battery' | 'custom';
  ch5: 'crankshaft' | 'camshaft' | 'maf' | 'map' | 'lambda' | 'throttle' | 'ignition' | 'battery' | 'custom';
  ch6: 'crankshaft' | 'camshaft' | 'maf' | 'map' | 'lambda' | 'throttle' | 'ignition' | 'battery' | 'custom';
  ch7: 'crankshaft' | 'camshaft' | 'maf' | 'map' | 'lambda' | 'throttle' | 'ignition' | 'battery' | 'custom';
  ch8: 'crankshaft' | 'camshaft' | 'maf' | 'map' | 'lambda' | 'throttle' | 'ignition' | 'battery' | 'custom';
}

export interface AutomotiveSignals {
  crankshaft: number[];
  camshaft: number[];
  maf: number[];
  map: number[];
  lambda: number[];
  throttle: number[];
  ignition: number[];
  battery: number[];
}

export interface HantekLoadRequest {
  data_source: 'csv' | 'usb' | 'demo';
  csv_file?: File;
  channels?: number[];
  sample_count?: number;
}

export interface HantekLoadResponse {
  success: boolean;
  data?: HantekData;
  automotive_signals?: AutomotiveSignals;
  error?: string;
}

export interface HantekDeviceInfo {
  connected: boolean;
  device_id?: string;
  channels_available?: number[];
  sample_rate?: number;
}

