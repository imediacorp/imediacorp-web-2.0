/**
 * Data Source Selector Component
 * Allows users to select data source: CSV, Demo, Hantek, OBD-II, CAN Bus
 */

'use client';

import React, { useState } from 'react';
import { HantekIntegration } from './HantekIntegration';
import type { GasVehicleDataSource, ElectricVehicleDataSource } from '@/types/vehicles';

type VehicleType = 'gas' | 'electric';

interface DataSourceSelectorProps {
  vehicleType: VehicleType;
  onDataSourceChange: (dataSource: GasVehicleDataSource | ElectricVehicleDataSource) => void;
  disabled?: boolean;
}

export function DataSourceSelector({
  vehicleType,
  onDataSourceChange,
  disabled = false,
}: DataSourceSelectorProps) {
  const [selectedSource, setSelectedSource] = useState<'csv' | 'demo' | 'hantek' | 'obd2' | 'can'>('demo');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [hantekData, setHantekData] = useState<GasVehicleDataSource['hantek_data'] | null>(null);

  const handleSourceChange = (source: typeof selectedSource) => {
    setSelectedSource(source);
    
    if (source === 'demo') {
      onDataSourceChange({ type: 'demo' });
    } else if (source === 'csv' && csvFile) {
      onDataSourceChange({ type: 'csv', file: csvFile });
    } else if (source === 'hantek' && hantekData) {
      onDataSourceChange({ type: 'hantek', hantek_data: hantekData });
    } else if (source === 'obd2' || source === 'can') {
      // Placeholder for future real-time data sources
      onDataSourceChange({ type: source as 'csv' | 'demo' | 'hantek' });
    }
  };

  const handleFileChange = (file: File | null) => {
    setCsvFile(file);
    if (file && selectedSource === 'csv') {
      onDataSourceChange({ type: 'csv', file });
    }
  };

  const handleHantekDataChange = (data: GasVehicleDataSource['hantek_data'] | null) => {
    setHantekData(data);
    if (data && selectedSource === 'hantek') {
      onDataSourceChange({ type: 'hantek', hantek_data: data });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Source</h3>
      
      {/* Data Source Radio Buttons */}
      <div className="space-y-3 mb-6">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="dataSource"
            value="demo"
            checked={selectedSource === 'demo'}
            onChange={() => {
              setSelectedSource('demo');
              handleSourceChange('demo');
            }}
            disabled={disabled}
            className="w-4 h-4 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-700">Demo Data</span>
          <span className="text-xs text-gray-500">(Synthetic data for testing)</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="dataSource"
            value="csv"
            checked={selectedSource === 'csv'}
            onChange={() => {
              setSelectedSource('csv');
              handleSourceChange('csv');
            }}
            disabled={disabled}
            className="w-4 h-4 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-700">
            {vehicleType === 'gas' ? 'Upload CSV (OBD-II/CAN bus)' : 'Upload CSV (EV Telemetry)'}
          </span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="dataSource"
            value="hantek"
            checked={selectedSource === 'hantek'}
            onChange={() => {
              setSelectedSource('hantek');
              handleSourceChange('hantek');
            }}
            disabled={disabled}
            className="w-4 h-4 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-700">Hantek 1008B Oscilloscope</span>
          <span className="text-xs text-gray-500">(8-channel USB oscilloscope)</span>
        </label>

        {vehicleType === 'gas' && (
          <>
            <label className="flex items-center space-x-3 cursor-pointer opacity-50">
              <input
                type="radio"
                name="dataSource"
                value="obd2"
                checked={selectedSource === 'obd2'}
                onChange={() => setSelectedSource('obd2')}
                disabled={true}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Real-Time OBD-II</span>
              <span className="text-xs text-gray-500">(Coming soon)</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer opacity-50">
              <input
                type="radio"
                name="dataSource"
                value="can"
                checked={selectedSource === 'can'}
                onChange={() => setSelectedSource('can')}
                disabled={true}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Real-Time CAN Bus</span>
              <span className="text-xs text-gray-500">(Coming soon)</span>
            </label>
          </>
        )}
      </div>

      {/* CSV File Upload */}
      {selectedSource === 'csv' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            disabled={disabled}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
          {csvFile && (
            <p className="mt-2 text-sm text-gray-600">Selected: {csvFile.name}</p>
          )}
        </div>
      )}

      {/* Hantek Integration */}
      {selectedSource === 'hantek' && (
        <HantekIntegration
          vehicleType={vehicleType}
          onDataChange={handleHantekDataChange}
          disabled={disabled}
        />
      )}

      {/* Info Messages */}
      {selectedSource === 'demo' && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            Using synthetic demo data. Upload a CSV file or connect Hantek device to use real data.
          </p>
        </div>
      )}

      {selectedSource === 'obd2' || selectedSource === 'can' ? (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Real-time data sources require hardware connection. This feature is coming soon.
          </p>
        </div>
      ) : null}
    </div>
  );
}

