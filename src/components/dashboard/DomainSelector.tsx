/**
 * Domain Selector Component
 * Multi-select domain picker for cross-domain comparison
 */

'use client';

import React from 'react';
import type { DomainId } from '@/types/comparison';

interface DomainSelectorProps {
  selectedDomains: DomainId[];
  onSelectionChange: (domains: DomainId[]) => void;
  maxSelections?: number;
  disabled?: boolean;
}

const AVAILABLE_DOMAINS: Array<{ id: DomainId; name: string; icon: string }> = [
  { id: 'gas-vehicle', name: 'Gas Vehicle', icon: '🚗' },
  { id: 'electric-vehicle', name: 'Electric Vehicle', icon: '🔌' },
  { id: 'medical', name: 'Medical', icon: '🏥' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'grid', name: 'Grid', icon: '⚡' },
  { id: 'industrial-fault', name: 'Industrial Fault', icon: '🏭' },
  { id: 'wind', name: 'Wind', icon: '💨' },
  { id: 'solar', name: 'Solar', icon: '☀️' },
  { id: 'geophysical', name: 'Geophysical', icon: '🌍' },
  { id: 'cliodynamics', name: 'Cliodynamics', icon: '🏛️' },
  { id: 'aerospace', name: 'Aerospace', icon: '✈️' },
  { id: 'quantum', name: 'Quantum', icon: '⚛️' },
  { id: 'nuclear', name: 'Nuclear', icon: '☢️' },
  { id: 'software', name: 'Software', icon: '💻' },
  { id: 'network', name: 'Network', icon: '🌐' },
  { id: 'personnel-health', name: 'Personnel Health', icon: '👥' },
];

export function DomainSelector({
  selectedDomains,
  onSelectionChange,
  maxSelections = 5,
  disabled = false,
}: DomainSelectorProps) {
  const handleToggle = (domainId: DomainId) => {
    if (disabled) return;

    if (selectedDomains.includes(domainId)) {
      // Remove domain
      onSelectionChange(selectedDomains.filter((id) => id !== domainId));
    } else {
      // Add domain (if under max)
      if (selectedDomains.length < maxSelections) {
        onSelectionChange([...selectedDomains, domainId]);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Select Domains ({selectedDomains.length}/{maxSelections})
        </label>
        {selectedDomains.length > 0 && (
          <button
            type="button"
            onClick={() => onSelectionChange([])}
            className="text-sm text-red-600 hover:text-red-700"
            disabled={disabled}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {AVAILABLE_DOMAINS.map((domain) => {
          const isSelected = selectedDomains.includes(domain.id);
          const isDisabled = !isSelected && selectedDomains.length >= maxSelections;

          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => handleToggle(domain.id)}
              disabled={disabled || isDisabled}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="text-2xl mb-1">{domain.icon}</div>
              <div className="text-xs font-medium">{domain.name}</div>
            </button>
          );
        })}
      </div>

      {selectedDomains.length >= maxSelections && (
        <p className="text-sm text-amber-600">
          Maximum {maxSelections} domains selected. Deselect a domain to add another.
        </p>
      )}
    </div>
  );
}

