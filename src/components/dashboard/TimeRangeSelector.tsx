/**
 * Time Range Selector Component
 * Allows filtering data by time range
 */

'use client';

import React, { useState, useMemo } from 'react';

export interface TimeRange {
  start: Date | null;
  end: Date | null;
}

interface TimeRangeSelectorProps {
  data: Array<{ timestamp: string | Date }>;
  onRangeChange: (filteredData: Array<{ timestamp: string | Date }>) => void;
  defaultRange?: TimeRange;
}

export function TimeRangeSelector({
  data,
  onRangeChange,
  defaultRange,
}: TimeRangeSelectorProps) {
  const [startDate, setStartDate] = useState<string>(
    defaultRange?.start ? defaultRange.start.toISOString().slice(0, 16) : ''
  );
  const [endDate, setEndDate] = useState<string>(
    defaultRange?.end ? defaultRange.end.toISOString().slice(0, 16) : ''
  );
  const [preset, setPreset] = useState<string>('all');
  const [filteredCount, setFilteredCount] = useState<number>(data.length);

  // Get min/max timestamps from data
  const { minTime, maxTime } = useMemo(() => {
    if (data.length === 0) {
      return { minTime: new Date(), maxTime: new Date() };
    }

    const timestamps = data.map((d) => new Date(d.timestamp).getTime());
    return {
      minTime: new Date(Math.min(...timestamps)),
      maxTime: new Date(Math.max(...timestamps)),
    };
  }, [data]);

  const handlePresetChange = (presetValue: string) => {
    setPreset(presetValue);
    
    // Calculate presets relative to the data's max time, not current time
    const dataEndTime = maxTime;

    switch (presetValue) {
      case 'last-hour':
        setStartDate(new Date(dataEndTime.getTime() - 60 * 60 * 1000).toISOString().slice(0, 16));
        setEndDate(dataEndTime.toISOString().slice(0, 16));
        break;
      case 'last-day':
        setStartDate(new Date(dataEndTime.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
        setEndDate(dataEndTime.toISOString().slice(0, 16));
        break;
      case 'last-week':
        setStartDate(new Date(dataEndTime.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
        setEndDate(dataEndTime.toISOString().slice(0, 16));
        break;
      case 'last-month':
        setStartDate(new Date(dataEndTime.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
        setEndDate(dataEndTime.toISOString().slice(0, 16));
        break;
      case 'all':
      default:
        setStartDate('');
        setEndDate('');
        break;
    }
  };

  // Filter data when dates change
  React.useEffect(() => {
    let filtered = data;

    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter((d) => new Date(d.timestamp) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      // Include the full end date (end of day)
      const endOfDay = new Date(end);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter((d) => new Date(d.timestamp) <= endOfDay);
    }

    setFilteredCount(filtered.length);
    onRangeChange(filtered);
  }, [startDate, endDate, data, onRangeChange]);

  // Update preset when dates are manually changed
  React.useEffect(() => {
    if (preset !== 'custom' && (!startDate || !endDate)) {
      // If dates are cleared, switch to 'all'
      if (!startDate && !endDate) {
        setPreset('all');
      }
    }
  }, [startDate, endDate, preset]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Range Preset
          </label>
          <select
            value={preset}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Data</option>
            <option value="last-hour">Last Hour</option>
            <option value="last-day">Last Day</option>
            <option value="last-week">Last Week</option>
            <option value="last-month">Last Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {preset === 'custom' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (preset !== 'custom') {
                    setPreset('custom');
                  }
                }}
                min={minTime.toISOString().slice(0, 16)}
                max={maxTime.toISOString().slice(0, 16)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (preset !== 'custom') {
                    setPreset('custom');
                  }
                }}
                min={minTime.toISOString().slice(0, 16)}
                max={maxTime.toISOString().slice(0, 16)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </>
        )}

        <div className="ml-auto text-sm text-gray-500">
          Showing {filteredCount} of {data.length} records
        </div>
      </div>
    </div>
  );
}

