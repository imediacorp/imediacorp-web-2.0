/**
 * Hantek 1008B Integration Component
 * UI for loading Hantek oscilloscope data from CSV or USB device
 */

'use client';

import React, { useState, useEffect } from 'react';
import { hantekApi } from '@/lib/api/hantek';
import type { HantekLoadRequest, HantekData, HantekDeviceInfo } from '@/types/hantek';
import type { GasVehicleDataSource } from '@/types/vehicles';

type VehicleType = 'gas' | 'electric';

interface HantekIntegrationProps {
  vehicleType: VehicleType;
  onDataChange: (data: GasVehicleDataSource['hantek_data'] | null) => void;
  disabled?: boolean;
}

export function HantekIntegration({
  vehicleType,
  onDataChange,
  disabled = false,
}: HantekIntegrationProps) {
  const [dataSource, setDataSource] = useState<'csv' | 'usb' | 'demo'>('csv');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hantekData, setHantekData] = useState<HantekData | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<HantekDeviceInfo | null>(null);
  const [selectedChannels, setSelectedChannels] = useState<number[]>([1, 2, 3, 4]);
  const [sampleCount, setSampleCount] = useState(1000);

  // Check device connection on mount
  useEffect(() => {
    if (dataSource === 'usb') {
      checkDevice();
    }
  }, [dataSource]);

  const checkDevice = async () => {
    const info = await hantekApi.checkDevice();
    setDeviceInfo(info);
  };

  const handleLoadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const request: HantekLoadRequest = {
        data_source: dataSource,
        csv_file: csvFile || undefined,
        channels: selectedChannels,
        sample_count: sampleCount,
      };

      const response = await hantekApi.loadData(request);

      if (response.success && response.data) {
        setHantekData(response.data);
        // Convert to format expected by parent
        const records = response.data.records.map((r) => ({
          timestamp: r.timestamp,
          ch1_voltage: r.ch1_voltage,
          ch2_voltage: r.ch2_voltage,
          ch3_voltage: r.ch3_voltage,
          ch4_voltage: r.ch4_voltage,
          ch5_voltage: r.ch5_voltage,
          ch6_voltage: r.ch6_voltage,
          ch7_voltage: r.ch7_voltage,
          ch8_voltage: r.ch8_voltage,
        }));
        onDataChange({ records });
      } else {
        setError(response.error || 'Failed to load Hantek data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectDevice = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await hantekApi.connectDevice(selectedChannels, sampleCount);
      if (response.success && response.data) {
        setHantekData(response.data);
        const records = response.data.records.map((r) => ({
          timestamp: r.timestamp,
          ch1_voltage: r.ch1_voltage,
          ch2_voltage: r.ch2_voltage,
          ch3_voltage: r.ch3_voltage,
          ch4_voltage: r.ch4_voltage,
          ch5_voltage: r.ch5_voltage,
          ch6_voltage: r.ch6_voltage,
          ch7_voltage: r.ch7_voltage,
          ch8_voltage: r.ch8_voltage,
        }));
        onDataChange({ records });
        await checkDevice();
      } else {
        setError(response.error || 'Failed to connect to device');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Data Source Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hantek Data Source
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="hantekSource"
              value="csv"
              checked={dataSource === 'csv'}
              onChange={() => setDataSource('csv')}
              disabled={disabled}
              className="w-4 h-4 text-primary-600"
            />
            <span className="text-sm text-gray-700">CSV File</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="hantekSource"
              value="usb"
              checked={dataSource === 'usb'}
              onChange={() => setDataSource('usb')}
              disabled={disabled}
              className="w-4 h-4 text-primary-600"
            />
            <span className="text-sm text-gray-700">USB Device</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="hantekSource"
              value="demo"
              checked={dataSource === 'demo'}
              onChange={() => setDataSource('demo')}
              disabled={disabled}
              className="w-4 h-4 text-primary-600"
            />
            <span className="text-sm text-gray-700">Demo Data</span>
          </label>
        </div>
      </div>

      {/* CSV File Upload */}
      {dataSource === 'csv' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Hantek CSV
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
            disabled={disabled}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
          {csvFile && (
            <p className="mt-2 text-sm text-gray-600">Selected: {csvFile.name}</p>
          )}
        </div>
      )}

      {/* USB Device Connection */}
      {dataSource === 'usb' && (
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              USB device connection requires pyusb library and Hantek 1008B device.
            </p>
          </div>

          {deviceInfo && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-sm text-gray-700">
                Device Status: {deviceInfo.connected ? 'Connected' : 'Not Connected'}
              </p>
              {deviceInfo.device_id && (
                <p className="text-xs text-gray-500 mt-1">Device ID: {deviceInfo.device_id}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Channels
            </label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => {
                    if (selectedChannels.includes(ch)) {
                      setSelectedChannels(selectedChannels.filter((c) => c !== ch));
                    } else {
                      setSelectedChannels([...selectedChannels, ch]);
                    }
                  }}
                  disabled={disabled}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    selectedChannels.includes(ch)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  Ch{ch}
                </button>
              ))}
            </div>
          </div>

          <NumberInput
            value={sampleCount}
            onChange={(value) => setSampleCount(Math.round(value))}
            min={100}
            max={4096}
            step={100}
            label="Samples per Channel"
            disabled={disabled}
          />

          <button
            type="button"
            onClick={handleConnectDevice}
            disabled={disabled || loading || selectedChannels.length === 0}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connecting...' : 'Connect to Hantek 1008B'}
          </button>
        </div>
      )}

      {/* Load Button for CSV/Demo */}
      {(dataSource === 'csv' || dataSource === 'demo') && (
        <button
          type="button"
          onClick={handleLoadData}
          disabled={disabled || loading || (dataSource === 'csv' && !csvFile)}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : dataSource === 'demo' ? 'Load Demo Data' : 'Load CSV Data'}
        </button>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success Display */}
      {hantekData && !error && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            Loaded {hantekData.sample_count} samples from Hantek 1008B
          </p>
          <p className="text-xs text-green-700 mt-1">
            Channels mapped to automotive signals: Ch1→Crankshaft, Ch2→Camshaft, Ch3→MAF,
            Ch4→MAP, Ch5→Lambda, Ch6→Throttle, Ch7→Ignition, Ch8→Battery
          </p>
        </div>
      )}
    </div>
  );
}

