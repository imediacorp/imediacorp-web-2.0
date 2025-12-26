/**
 * Sensor Manager
 * Provides abstraction for accessing device sensors (accelerometer, gyroscope, GPS, etc.)
 */

export interface AccelerometerData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export interface GyroscopeData {
  alpha: number; // Z-axis rotation
  beta: number;  // X-axis rotation
  gamma: number; // Y-axis rotation
  timestamp: number;
}

export interface GeolocationData {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  timestamp: number;
}

export interface SensorPermissions {
  accelerometer: PermissionState | 'not-supported';
  gyroscope: PermissionState | 'not-supported';
  geolocation: PermissionState | 'not-supported';
}

class SensorManager {
  private accelerometerListener: ((data: AccelerometerData) => void) | null = null;
  private gyroscopeListener: ((data: GyroscopeData) => void) | null = null;
  private geolocationWatchId: number | null = null;
  private geolocationListener: ((data: GeolocationData) => void) | null = null;

  async checkPermissions(): Promise<SensorPermissions> {
    const permissions: SensorPermissions = {
      accelerometer: 'not-supported',
      gyroscope: 'not-supported',
      geolocation: 'not-supported',
    };

    // Check accelerometer permission
    if ('Accelerometer' in window) {
      try {
        const status = await navigator.permissions.query({ name: 'accelerometer' as PermissionName });
        permissions.accelerometer = status.state;
      } catch {
        permissions.accelerometer = 'prompt';
      }
    }

    // Check gyroscope permission
    if ('Gyroscope' in window) {
      try {
        const status = await navigator.permissions.query({ name: 'gyroscope' as PermissionName });
        permissions.gyroscope = status.state;
      } catch {
        permissions.gyroscope = 'prompt';
      }
    }

    // Check geolocation permission
    if ('geolocation' in navigator) {
      try {
        const status = await navigator.permissions.query({ name: 'geolocation' });
        permissions.geolocation = status.state;
      } catch {
        permissions.geolocation = 'prompt';
      }
    }

    return permissions;
  }

  async startAccelerometer(
    callback: (data: AccelerometerData) => void
  ): Promise<boolean> {
    if (!('Accelerometer' in window)) {
      console.warn('Accelerometer not supported');
      return false;
    }

    try {
      // @ts-ignore - Accelerometer API is experimental
      const sensor = new Accelerometer({ frequency: 60 });
      
      sensor.addEventListener('reading', () => {
        callback({
          x: sensor.x || 0,
          y: sensor.y || 0,
          z: sensor.z || 0,
          timestamp: Date.now(),
        });
      });

      sensor.start();
      this.accelerometerListener = callback;
      return true;
    } catch (error) {
      console.error('Failed to start accelerometer:', error);
      return false;
    }
  }

  stopAccelerometer(): void {
    this.accelerometerListener = null;
    // Note: In a real implementation, you'd need to store the sensor instance
    // and call sensor.stop() here
  }

  async startGyroscope(
    callback: (data: GyroscopeData) => void
  ): Promise<boolean> {
    if (!('Gyroscope' in window)) {
      console.warn('Gyroscope not supported');
      return false;
    }

    try {
      // @ts-ignore - Gyroscope API is experimental
      const sensor = new Gyroscope({ frequency: 60 });
      
      sensor.addEventListener('reading', () => {
        callback({
          alpha: sensor.alpha || 0,
          beta: sensor.beta || 0,
          gamma: sensor.gamma || 0,
          timestamp: Date.now(),
        });
      });

      sensor.start();
      this.gyroscopeListener = callback;
      return true;
    } catch (error) {
      console.error('Failed to start gyroscope:', error);
      return false;
    }
  }

  stopGyroscope(): void {
    this.gyroscopeListener = null;
  }

  async startGeolocation(
    callback: (data: GeolocationData) => void,
    options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  ): Promise<boolean> {
    if (!('geolocation' in navigator)) {
      console.warn('Geolocation not supported');
      return false;
    }

    try {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          callback({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude ?? undefined,
            accuracy: position.coords.accuracy ?? undefined,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        options
      );

      this.geolocationWatchId = watchId;
      this.geolocationListener = callback;
      return true;
    } catch (error) {
      console.error('Failed to start geolocation:', error);
      return false;
    }
  }

  stopGeolocation(): void {
    if (this.geolocationWatchId !== null) {
      navigator.geolocation.clearWatch(this.geolocationWatchId);
      this.geolocationWatchId = null;
    }
    this.geolocationListener = null;
  }

  getCurrentLocation(): Promise<GeolocationData> {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude ?? undefined,
            accuracy: position.coords.accuracy ?? undefined,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }
}

export const sensorManager = new SensorManager();

