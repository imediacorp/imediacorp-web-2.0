/**
 * Sensor Data Display Component
 * Visualizes device sensor data
 */

'use client';

import React from 'react';
import { useDeviceSensors } from '@/hooks/useDeviceSensors';

export function SensorDataDisplay() {
  const {
    permissions,
    accelerometer,
    gyroscope,
    geolocation,
    isAccelerometerActive,
    isGyroscopeActive,
    isGeolocationActive,
    startAccelerometer,
    stopAccelerometer,
    startGyroscope,
    stopGyroscope,
    startGeolocation,
    stopGeolocation,
    getCurrentLocation,
    checkPermissions,
  } = useDeviceSensors();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Device Sensors</h3>
        <button
          onClick={checkPermissions}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Refresh Permissions
        </button>
      </div>

      {/* Accelerometer */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700">Accelerometer</h4>
          <div className="flex items-center space-x-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isAccelerometerActive ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
            {isAccelerometerActive ? (
              <button
                onClick={stopAccelerometer}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                Stop
              </button>
            ) : (
              <button
                onClick={startAccelerometer}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                disabled={permissions?.accelerometer === 'denied'}
              >
                Start
              </button>
            )}
          </div>
        </div>
        {accelerometer ? (
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <span className="text-gray-500">X:</span>
              <span className="ml-2 font-mono">{accelerometer.x.toFixed(3)}</span>
            </div>
            <div>
              <span className="text-gray-500">Y:</span>
              <span className="ml-2 font-mono">{accelerometer.y.toFixed(3)}</span>
            </div>
            <div>
              <span className="text-gray-500">Z:</span>
              <span className="ml-2 font-mono">{accelerometer.z.toFixed(3)}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Not active</p>
        )}
        {permissions?.accelerometer === 'denied' && (
          <p className="text-xs text-red-600 mt-2">Permission denied</p>
        )}
      </div>

      {/* Gyroscope */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700">Gyroscope</h4>
          <div className="flex items-center space-x-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isGyroscopeActive ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
            {isGyroscopeActive ? (
              <button
                onClick={stopGyroscope}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                Stop
              </button>
            ) : (
              <button
                onClick={startGyroscope}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                disabled={permissions?.gyroscope === 'denied'}
              >
                Start
              </button>
            )}
          </div>
        </div>
        {gyroscope ? (
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <span className="text-gray-500">α:</span>
              <span className="ml-2 font-mono">{gyroscope.alpha.toFixed(2)}°</span>
            </div>
            <div>
              <span className="text-gray-500">β:</span>
              <span className="ml-2 font-mono">{gyroscope.beta.toFixed(2)}°</span>
            </div>
            <div>
              <span className="text-gray-500">γ:</span>
              <span className="ml-2 font-mono">{gyroscope.gamma.toFixed(2)}°</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Not active</p>
        )}
        {permissions?.gyroscope === 'denied' && (
          <p className="text-xs text-red-600 mt-2">Permission denied</p>
        )}
      </div>

      {/* Geolocation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700">Geolocation</h4>
          <div className="flex items-center space-x-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isGeolocationActive ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
            {isGeolocationActive ? (
              <button
                onClick={stopGeolocation}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                Stop
              </button>
            ) : (
              <>
                <button
                  onClick={startGeolocation}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                  disabled={permissions?.geolocation === 'denied'}
                >
                  Track
                </button>
                <button
                  onClick={getCurrentLocation}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  disabled={permissions?.geolocation === 'denied'}
                >
                  Get
                </button>
              </>
            )}
          </div>
        </div>
        {geolocation ? (
          <div className="space-y-1 text-sm">
            <div>
              <span className="text-gray-500">Lat:</span>
              <span className="ml-2 font-mono">{geolocation.latitude.toFixed(6)}</span>
            </div>
            <div>
              <span className="text-gray-500">Lon:</span>
              <span className="ml-2 font-mono">{geolocation.longitude.toFixed(6)}</span>
            </div>
            {geolocation.altitude && (
              <div>
                <span className="text-gray-500">Alt:</span>
                <span className="ml-2 font-mono">{geolocation.altitude.toFixed(2)}m</span>
              </div>
            )}
            {geolocation.accuracy && (
              <div>
                <span className="text-gray-500">Accuracy:</span>
                <span className="ml-2 font-mono">±{geolocation.accuracy.toFixed(2)}m</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Not active</p>
        )}
        {permissions?.geolocation === 'denied' && (
          <p className="text-xs text-red-600 mt-2">Permission denied</p>
        )}
      </div>
    </div>
  );
}

