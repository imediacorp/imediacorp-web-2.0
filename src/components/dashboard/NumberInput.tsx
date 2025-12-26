/**
 * Standardized Number Input Component
 * Ensures proper value display and handling
 */

'use client';

import React, { useState, useEffect } from 'react';

export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  unit?: string;
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  placeholder,
  className = '',
  disabled = false,
  unit,
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState<string>(value.toString());

  // Update display value when prop value changes
  useEffect(() => {
    setDisplayValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    // Allow empty string during editing
    if (inputValue === '' || inputValue === '-') {
      return;
    }

    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      // Clamp to min/max if specified
      let clampedValue = numValue;
      if (min !== undefined && clampedValue < min) {
        clampedValue = min;
        setDisplayValue(min.toString());
      }
      if (max !== undefined && clampedValue > max) {
        clampedValue = max;
        setDisplayValue(max.toString());
      }
      onChange(clampedValue);
    }
  };

  const handleBlur = () => {
    // Ensure value is valid on blur
    const numValue = parseFloat(displayValue);
    if (isNaN(numValue) || displayValue === '') {
      // Reset to current value if invalid
      setDisplayValue(value.toString());
    } else {
      // Clamp and update
      let clampedValue = numValue;
      if (min !== undefined && clampedValue < min) {
        clampedValue = min;
      }
      if (max !== undefined && clampedValue > max) {
        clampedValue = max;
      }
      if (clampedValue !== numValue) {
        setDisplayValue(clampedValue.toString());
        onChange(clampedValue);
      }
    }
  };

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max ?? Infinity);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min ?? -Infinity);
    onChange(newValue);
  };

  const baseClassName = `w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs text-gray-600 mb-1">
          {label}
          {unit && <span className="text-gray-500 ml-1">({unit})</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="number"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          className={baseClassName}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
          <button
            type="button"
            onClick={handleIncrement}
            disabled={disabled || (max !== undefined && value >= max)}
            className="text-gray-400 hover:text-gray-600 text-xs leading-none pb-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            tabIndex={-1}
          >
            ▲
          </button>
          <button
            type="button"
            onClick={handleDecrement}
            disabled={disabled || (min !== undefined && value <= min)}
            className="text-gray-400 hover:text-gray-600 text-xs leading-none pt-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            tabIndex={-1}
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
}

