/**
 * Patient/Cohort Selector Component
 * Allows filtering and selecting patients based on demographics and risk factors
 */

'use client';

import React, { useState, useEffect } from 'react';
import { NumberInput } from '@/components/dashboard/NumberInput';

export interface PatientFilter {
  ageMin?: number;
  ageMax?: number;
  bmiMin?: number;
  bmiMax?: number;
  sex?: string[]; // M, F, U
  riskTiers?: string[]; // low, medium, high, critical
  riskFactors?: string[]; // diabetes, hypertension, cardiovascular, respiratory, etc.
  combiner?: 'AND' | 'OR';
}

export interface Patient {
  patient_id: string;
  age?: number;
  bmi?: number;
  sex?: string;
  risk_tier?: string;
  risk_factors?: string[];
  [key: string]: unknown;
}

export interface PatientCohortSelectorProps {
  onSelectionChange: (selectedPatients: Patient[], isCohort: boolean) => void;
  initialFilter?: PatientFilter;
  className?: string;
}

export function PatientCohortSelector({
  onSelectionChange,
  initialFilter,
  className = '',
}: PatientCohortSelectorProps) {
  const [filter, setFilter] = useState<PatientFilter>({
    combiner: 'AND',
    ...initialFilter,
  });
  const [availableOptions, setAvailableOptions] = useState<{
    sex: string[];
    riskTiers: string[];
    riskFactors: string[];
  }>({
    sex: ['M', 'F'],
    riskTiers: ['low', 'medium', 'high', 'critical'],
    riskFactors: [
      'diabetes',
      'hypertension',
      'cardiovascular',
      'respiratory',
      'obesity',
      'smoking',
      'chronic_kidney_disease',
      'immunocompromised',
    ],
  });
  const [matchedPatients, setMatchedPatients] = useState<Patient[]>([]);
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState<'individual' | 'cohort'>('individual');
  const [cohortSize, setCohortSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [matchCount, setMatchCount] = useState(0);

  // Load available options and apply filter on mount/change
  useEffect(() => {
    loadFilterOptions();
    applyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filter when it changes
  useEffect(() => {
    applyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const loadFilterOptions = async () => {
    try {
      // In a real implementation, this would fetch from API
      // For now, use defaults
      setAvailableOptions({
        sex: ['M', 'F'],
        riskTiers: ['low', 'medium', 'high', 'critical'],
        riskFactors: [
          'diabetes',
          'hypertension',
          'cardiovascular',
          'respiratory',
          'obesity',
          'smoking',
          'chronic_kidney_disease',
          'immunocompromised',
        ],
      });
    } catch (err) {
      console.error('Failed to load filter options:', err);
    }
  };

  const applyFilter = async () => {
    setLoading(true);
    try {
      // Generate demo patients based on filter
      const patients = generateDemoPatients(filter);
      setMatchedPatients(patients);
      setMatchCount(patients.length);
      
      // Auto-select based on mode
      if (selectionMode === 'cohort' && patients.length > 0) {
        const cohort = patients.slice(0, Math.min(cohortSize, patients.length));
        setSelectedPatientIds(cohort.map((p) => p.patient_id));
        onSelectionChange(cohort, true);
      } else if (selectionMode === 'individual' && patients.length > 0 && selectedPatientIds.length === 0) {
        // Select first patient by default
        setSelectedPatientIds([patients[0].patient_id]);
        onSelectionChange([patients[0]], false);
      }
    } catch (err) {
      console.error('Failed to apply filter:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (updates: Partial<PatientFilter>) => {
    setFilter((prev) => ({ ...prev, ...updates }));
  };

  const handlePatientSelect = (patientId: string, isSelected: boolean) => {
    if (selectionMode === 'individual') {
      // Single selection mode
      setSelectedPatientIds(isSelected ? [patientId] : []);
      const patient = matchedPatients.find((p) => p.patient_id === patientId);
      onSelectionChange(patient ? [patient] : [], false);
    } else {
      // Multi-selection mode for cohort
      setSelectedPatientIds((prev) => {
        const updated = isSelected
          ? [...prev, patientId]
          : prev.filter((id) => id !== patientId);
        const selected = matchedPatients.filter((p) => updated.includes(p.patient_id));
        onSelectionChange(selected, true);
        return updated;
      });
    }
  };

  const handleSelectCohort = () => {
    const cohort = matchedPatients.slice(0, Math.min(cohortSize, matchedPatients.length));
    setSelectedPatientIds(cohort.map((p) => p.patient_id));
    onSelectionChange(cohort, true);
  };

  const handleSelectAll = () => {
    setSelectedPatientIds(matchedPatients.map((p) => p.patient_id));
    onSelectionChange(matchedPatients, true);
  };

  const handleClearSelection = () => {
    setSelectedPatientIds([]);
    onSelectionChange([], false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Filter</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Age Range */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Age Range</label>
            <div className="flex items-center gap-2">
              <NumberInput
                value={filter.ageMin ?? 18}
                onChange={(value) => handleFilterChange({ ageMin: value })}
                min={0}
                max={120}
                step={1}
                label="Min Age"
                labelClassName="text-xs text-gray-600 mb-1"
                inputClassName="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              />
              <span className="text-gray-500">to</span>
              <NumberInput
                value={filter.ageMax ?? 100}
                onChange={(value) => handleFilterChange({ ageMax: value })}
                min={0}
                max={120}
                step={1}
                label="Max Age"
                labelClassName="text-xs text-gray-600 mb-1"
                inputClassName="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* BMI Range */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">BMI Range</label>
            <div className="flex items-center gap-2">
              <NumberInput
                value={filter.bmiMin ?? 15}
                onChange={(value) => handleFilterChange({ bmiMin: value })}
                min={10}
                max={50}
                step={0.1}
                label="Min BMI"
                labelClassName="text-xs text-gray-600 mb-1"
                inputClassName="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              />
              <span className="text-gray-500">to</span>
              <NumberInput
                value={filter.bmiMax ?? 40}
                onChange={(value) => handleFilterChange({ bmiMax: value })}
                min={10}
                max={50}
                step={0.1}
                label="Max BMI"
                labelClassName="text-xs text-gray-600 mb-1"
                inputClassName="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Sex/Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sex/Gender</label>
            <div className="flex flex-wrap gap-2">
              {availableOptions.sex.map((sex) => (
                <label key={sex} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filter.sex?.includes(sex) ?? true}
                    onChange={(e) => {
                      const current = filter.sex ?? availableOptions.sex;
                      const updated = e.target.checked
                        ? [...current, sex]
                        : current.filter((s) => s !== sex);
                      handleFilterChange({ sex: updated.length === availableOptions.sex.length ? undefined : updated });
                    }}
                    className="mr-1"
                  />
                  <span className="text-sm text-gray-700">{sex}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Risk Tier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tier</label>
            <div className="flex flex-wrap gap-2">
              {availableOptions.riskTiers.map((tier) => (
                <label key={tier} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filter.riskTiers?.includes(tier) ?? true}
                    onChange={(e) => {
                      const current = filter.riskTiers ?? availableOptions.riskTiers;
                      const updated = e.target.checked
                        ? [...current, tier]
                        : current.filter((t) => t !== tier);
                      handleFilterChange({
                        riskTiers: updated.length === availableOptions.riskTiers.length ? undefined : updated,
                      });
                    }}
                    className="mr-1"
                  />
                  <span className="text-sm text-gray-700 capitalize">{tier}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Risk Factors */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Risk Factors</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableOptions.riskFactors.map((factor) => (
                <label key={factor} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filter.riskFactors?.includes(factor) ?? false}
                    onChange={(e) => {
                      const current = filter.riskFactors ?? [];
                      const updated = e.target.checked
                        ? [...current, factor]
                        : current.filter((f) => f !== factor);
                      handleFilterChange({ riskFactors: updated.length > 0 ? updated : undefined });
                    }}
                    className="mr-1"
                  />
                  <span className="text-sm text-gray-700 capitalize">{factor.replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Combiner */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter Logic</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="combiner"
                  value="AND"
                  checked={filter.combiner === 'AND'}
                  onChange={() => handleFilterChange({ combiner: 'AND' })}
                  className="mr-1"
                />
                <span className="text-sm text-gray-700">AND (all conditions must match)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="combiner"
                  value="OR"
                  checked={filter.combiner === 'OR'}
                  onChange={() => handleFilterChange({ combiner: 'OR' })}
                  className="mr-1"
                />
                <span className="text-sm text-gray-700">OR (any condition can match)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={applyFilter}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Apply Filter'}
          </button>
          <div className="text-sm text-gray-600">
            {loading ? 'Searching...' : `${matchCount} patient${matchCount !== 1 ? 's' : ''} matched`}
          </div>
        </div>
      </div>

      {/* Selection Mode */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Selection Mode</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectionMode('individual');
                setSelectedPatientIds([]);
                onSelectionChange([], false);
              }}
              className={`px-3 py-1 rounded-md text-sm ${
                selectionMode === 'individual'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Individual
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectionMode('cohort');
                setSelectedPatientIds([]);
                onSelectionChange([], true);
              }}
              className={`px-3 py-1 rounded-md text-sm ${
                selectionMode === 'cohort'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cohort
            </button>
          </div>
        </div>

        {selectionMode === 'cohort' && (
          <div className="mb-4">
            <NumberInput
              value={cohortSize}
              onChange={(value) => {
                setCohortSize(value);
                if (matchedPatients.length > 0) {
                  const cohort = matchedPatients.slice(0, Math.min(value, matchedPatients.length));
                  setSelectedPatientIds(cohort.map((p) => p.patient_id));
                  onSelectionChange(cohort, true);
                }
              }}
              min={1}
              max={100}
              step={1}
              label="Cohort Size"
              className="mb-2"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSelectCohort}
                className="px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm"
              >
                Select Random {cohortSize}
              </button>
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                Select All ({matchCount})
              </button>
              <button
                type="button"
                onClick={handleClearSelection}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Patient List */}
        {matchedPatients.length > 0 ? (
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    {selectionMode === 'cohort' && <input type="checkbox" disabled className="mr-2" />}
                    Select
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">BMI</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sex</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Risk Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {matchedPatients.map((patient) => {
                  const isSelected = selectedPatientIds.includes(patient.patient_id);
                  return (
                    <tr
                      key={patient.patient_id}
                      className={`hover:bg-gray-50 ${isSelected ? 'bg-primary-50' : ''}`}
                    >
                      <td className="px-3 py-2">
                        <input
                          type={selectionMode === 'individual' ? 'radio' : 'checkbox'}
                          name={selectionMode === 'individual' ? 'patient-select' : undefined}
                          checked={isSelected}
                          onChange={(e) => handlePatientSelect(patient.patient_id, e.target.checked)}
                          className="cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-900">{patient.patient_id}</td>
                      <td className="px-3 py-2 text-gray-600">{patient.age ?? 'N/A'}</td>
                      <td className="px-3 py-2 text-gray-600">{patient.bmi ? patient.bmi.toFixed(1) : 'N/A'}</td>
                      <td className="px-3 py-2 text-gray-600">{patient.sex ?? 'N/A'}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                            patient.risk_tier === 'critical'
                              ? 'bg-red-100 text-red-800'
                              : patient.risk_tier === 'high'
                              ? 'bg-orange-100 text-orange-800'
                              : patient.risk_tier === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {patient.risk_tier ?? 'N/A'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {loading ? 'Searching for patients...' : 'No patients match the selected criteria'}
          </div>
        )}
      </div>

      {/* Selected Summary */}
      {selectedPatientIds.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-primary-900">
                {selectionMode === 'cohort' ? 'Cohort Selected' : 'Patient Selected'}
              </div>
              <div className="text-xs text-primary-700 mt-1">
                {selectedPatientIds.length} patient{selectedPatientIds.length !== 1 ? 's' : ''} selected
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearSelection}
              className="text-sm text-primary-700 hover:text-primary-900 underline"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Generate demo patients based on filter criteria
 * In production, this would call the API
 */
function generateDemoPatients(filter: PatientFilter): Patient[] {
  const patients: Patient[] = [];
  const ageMin = filter.ageMin ?? 18;
  const ageMax = filter.ageMax ?? 100;
  const bmiMin = filter.bmiMin ?? 15;
  const bmiMax = filter.bmiMax ?? 40;
  const sexOptions = filter.sex && filter.sex.length > 0 ? filter.sex : ['M', 'F'];
  const riskTierOptions =
    filter.riskTiers && filter.riskTiers.length > 0 ? filter.riskTiers : ['low', 'medium', 'high', 'critical'];

  // Generate 20-50 demo patients
  const count = 20 + Math.floor(Math.random() * 30);
  
  for (let i = 0; i < count; i++) {
    const age = ageMin + Math.floor(Math.random() * (ageMax - ageMin + 1));
    const bmi = bmiMin + Math.random() * (bmiMax - bmiMin);
    const sex = sexOptions[Math.floor(Math.random() * sexOptions.length)];
    const riskTier = riskTierOptions[Math.floor(Math.random() * riskTierOptions.length)];
    
    // Apply risk factors based on risk tier
    const riskFactors: string[] = [];
    if (riskTier === 'critical' || riskTier === 'high') {
      const factorCount = 1 + Math.floor(Math.random() * 3);
      const allFactors = [
        'diabetes',
        'hypertension',
        'cardiovascular',
        'respiratory',
        'obesity',
        'smoking',
        'chronic_kidney_disease',
        'immunocompromised',
      ];
      for (let j = 0; j < factorCount; j++) {
        const factor = allFactors[Math.floor(Math.random() * allFactors.length)];
        if (!riskFactors.includes(factor)) {
          riskFactors.push(factor);
        }
      }
    }

    // Apply filter logic
    let matches = true;
    if (filter.combiner === 'OR') {
      matches = false;
      if (filter.riskFactors && filter.riskFactors.length > 0) {
        matches = filter.riskFactors.some((f) => riskFactors.includes(f));
      }
    } else {
      // AND logic
      if (filter.riskFactors && filter.riskFactors.length > 0) {
        matches = filter.riskFactors.every((f) => riskFactors.includes(f));
      }
    }

    if (matches) {
      patients.push({
        patient_id: `PAT-${String(i + 1).padStart(4, '0')}`,
        age,
        bmi,
        sex,
        risk_tier: riskTier,
        risk_factors: riskFactors,
      });
    }
  }

  return patients;
}

