/**
 * useDeviceSensors Hook
 * React hook for accessing device sensors
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  sensorManager,
  AccelerometerData,
  GyroscopeData,
  GeolocationData,
  SensorPermissions,
} from '@/lib/sensors/sensor-manager';

export interface UseDeviceSensorsReturn {
  permissions: SensorPermissions | null;
  accelerometer: AccelerometerData | null;
  gyroscope: GyroscopeData | null;
  geolocation: GeolocationData | null;
  isAccelerometerActive: boolean;
  isGyroscopeActive: boolean;
  isGeolocationActive: boolean;
  startAccelerometer: () => Promise<void>;
  stopAccelerometer: () => void;
  startGyroscope: () => Promise<void>;
  stopGyroscope: () => void;
  startGeolocation: () => Promise<void>;
  stopGeolocation: () => void;
  getCurrentLocation: () => Promise<GeolocationData>;
  checkPermissions: () => Promise<void>;
}

export function useDeviceSensors(): UseDeviceSensorsReturn {
  const [permissions, setPermissions] = useState<SensorPermissions | null>(null);
  const [accelerometer, setAccelerometer] = useState<AccelerometerData | null>(null);
  const [gyroscope, setGyroscope] = useState<GyroscopeData | null>(null);
  const [geolocation, setGeolocation] = useState<GeolocationData | null>(null);
  const [isAccelerometerActive, setIsAccelerometerActive] = useState(false);
  const [isGyroscopeActive, setIsGyroscopeActive] = useState(false);
  const [isGeolocationActive, setIsGeolocationActive] = useState(false);

  const checkPermissions = useCallback(async () => {
    const perms = await sensorManager.checkPermissions();
    setPermissions(perms);
  }, []);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  const startAccelerometer = useCallback(async () => {
    const success = await sensorManager.startAccelerometer((data) => {
      setAccelerometer(data);
    });
    setIsAccelerometerActive(success);
  }, []);

  const stopAccelerometer = useCallback(() => {
    sensorManager.stopAccelerometer();
    setIsAccelerometerActive(false);
    setAccelerometer(null);
  }, []);

  const startGyroscope = useCallback(async () => {
    const success = await sensorManager.startGyroscope((data) => {
      setGyroscope(data);
    });
    setIsGyroscopeActive(success);
  }, []);

  const stopGyroscope = useCallback(() => {
    sensorManager.stopGyroscope();
    setIsGyroscopeActive(false);
    setGyroscope(null);
  }, []);

  const startGeolocation = useCallback(async () => {
    const success = await sensorManager.startGeolocation((data) => {
      setGeolocation(data);
    });
    setIsGeolocationActive(success);
  }, []);

  const stopGeolocation = useCallback(() => {
    sensorManager.stopGeolocation();
    setIsGeolocationActive(false);
    setGeolocation(null);
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<GeolocationData> => {
    return sensorManager.getCurrentLocation();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAccelerometer();
      stopGyroscope();
      stopGeolocation();
    };
  }, [stopAccelerometer, stopGyroscope, stopGeolocation]);

  return {
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
  };
}

