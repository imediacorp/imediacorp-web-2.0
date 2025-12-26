/**
 * Hantek 1008B Oscilloscope API Client
 * Methods for loading and processing Hantek oscilloscope data
 */

import { apiClient } from './client';
import type {
  HantekLoadRequest,
  HantekLoadResponse,
  HantekData,
  AutomotiveSignals,
  HantekDeviceInfo,
} from '@/types/hantek';

export const hantekApi = {
  /**
   * Load Hantek data from CSV file or USB device
   */
  async loadData(request: HantekLoadRequest): Promise<HantekLoadResponse> {
    if (request.data_source === 'csv' && request.csv_file) {
      const formData = new FormData();
      formData.append('file', request.csv_file);
      formData.append('data_source', 'csv');

      try {
        const response = await fetch('/api/v1/hantek/load', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          return {
            success: false,
            error: error.message || 'Failed to load Hantek data',
          };
        }

        const data = await response.json();
        return {
          success: true,
          data: data.data,
          automotive_signals: data.automotive_signals,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    } else if (request.data_source === 'demo') {
      // Generate demo data on frontend
      return hantekApi.generateDemoData();
    } else if (request.data_source === 'usb') {
      // USB device connection (requires backend support)
      return apiClient.post<HantekLoadResponse>('/api/v1/hantek/connect', {
        channels: request.channels || [1, 2],
        sample_count: request.sample_count || 1000,
      });
    }

    return {
      success: false,
      error: 'Invalid data source',
    };
  },

  /**
   * Generate demo Hantek data
   */
  generateDemoData(): HantekLoadResponse {
    const nSamples = 1000;
    const records = [];
    const startTime = new Date('2025-01-01T10:00:00Z');

    for (let i = 0; i < nSamples; i++) {
      const timestamp = new Date(startTime.getTime() + i * 10); // 10ms intervals
      const t = i / 100;

      records.push({
        timestamp: timestamp.toISOString(),
        ch1_voltage: 2.5 + 2.0 * Math.sin(2 * Math.PI * 0.1 * t), // Crankshaft (sine)
        ch2_voltage: 2.5 + 2.0 * (Math.sin(2 * Math.PI * 0.1 * t) > 0 ? 1 : -1), // Camshaft (square)
        ch3_voltage: 2.5 + 1.5 * Math.sin(2 * Math.PI * 0.15 * t), // MAF
        ch4_voltage: 2.5 + 1.0 * Math.sin(2 * Math.PI * 0.05 * t), // MAP
        ch5_voltage: 1.0 + 0.1 * Math.sin(2 * Math.PI * 0.2 * t), // Lambda
        ch6_voltage: 2.5 + 2.0 * ((t * 0.1) % 1 - 0.5), // Throttle
        ch7_voltage: 5.0 + 2.0 * Math.sin(2 * Math.PI * 0.5 * t), // Ignition
        ch8_voltage: 12.0 + 0.5 * Math.sin(2 * Math.PI * 0.2 * t), // Battery
      });
    }

    // Map to automotive signals
    const automotive_signals: AutomotiveSignals = {
      crankshaft: records.map((r) => r.ch1_voltage),
      camshaft: records.map((r) => r.ch2_voltage),
      maf: records.map((r) => r.ch3_voltage),
      map: records.map((r) => r.ch4_voltage),
      lambda: records.map((r) => r.ch5_voltage),
      throttle: records.map((r) => r.ch6_voltage),
      ignition: records.map((r) => r.ch7_voltage),
      battery: records.map((r) => r.ch8_voltage),
    };

    return {
      success: true,
      data: {
        records,
        sample_count: nSamples,
        sample_rate: 100, // 100 Hz
      },
      automotive_signals,
    };
  },

  /**
   * Map Hantek channels to automotive signals
   */
  mapToAutomotiveSignals(records: HantekData['records']): AutomotiveSignals {
    return {
      crankshaft: records.map((r) => r.ch1_voltage),
      camshaft: records.map((r) => r.ch2_voltage),
      maf: records.map((r) => r.ch3_voltage),
      map: records.map((r) => r.ch4_voltage),
      lambda: records.map((r) => r.ch5_voltage),
      throttle: records.map((r) => r.ch6_voltage),
      ignition: records.map((r) => r.ch7_voltage),
      battery: records.map((r) => r.ch8_voltage),
    };
  },

  /**
   * Convert automotive signals to vehicle telemetry
   */
  convertToGasVehicleTelemetry(signals: AutomotiveSignals): Array<{
    timestamp: string;
    engine_rpm: number;
    throttle_position: number;
    maf: number;
    o2_sensor_1: number;
    timing_advance: number;
    coolant_temp: number;
    vehicle_speed: number;
    battery_voltage: number;
  }> {
    const n = signals.crankshaft.length;
    const telemetry = [];

    for (let i = 0; i < n; i++) {
      // Convert oscilloscope voltages to OBD-II-like parameters
      const crankshaft = signals.crankshaft[i];
      const throttle = signals.throttle[i];
      const maf = signals.maf[i];
      const lambda = signals.lambda[i];
      const battery = signals.battery[i];

      telemetry.push({
        timestamp: new Date(Date.now() + i * 1000).toISOString(), // 1 second intervals
        engine_rpm: Math.max(500, Math.min(5000, (crankshaft - 2.5) * 1000 + 2000)), // Scale to RPM
        throttle_position: Math.max(0, Math.min(100, (throttle - 2.5) * 20)), // Scale to percentage
        maf: Math.max(0, maf * 10), // Scale to g/s
        o2_sensor_1: Math.max(0.5, Math.min(1.5, lambda)), // Lambda value
        timing_advance: Math.max(0, Math.min(30, (signals.ignition[i] - 5.0) * 6)), // Scale to degrees
        coolant_temp: Math.max(20, Math.min(120, 85 + (battery - 12.0) * 5)), // Proxy from battery
        vehicle_speed: Math.max(0, Math.min(200, ((crankshaft - 2.5) * 1000 + 2000) / 30.0 * 0.5)), // Proxy
        battery_voltage: battery,
      });
    }

    return telemetry;
  },

  /**
   * Check USB device connection status
   */
  async checkDevice(): Promise<HantekDeviceInfo> {
    try {
      return await apiClient.get<HantekDeviceInfo>('/api/v1/hantek/device');
    } catch (error) {
      return {
        connected: false,
      };
    }
  },

  /**
   * Connect to USB device
   */
  async connectDevice(channels: number[] = [1, 2], sampleCount: number = 1000): Promise<HantekLoadResponse> {
    try {
      return await apiClient.post<HantekLoadResponse>('/api/v1/hantek/connect', {
        channels,
        sample_count: sampleCount,
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to connect to device',
      };
    }
  },
};

