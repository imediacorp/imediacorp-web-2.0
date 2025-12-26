/**
 * Investment Philosophy Profile Selector Component
 * Dropdown/selector for choosing active investment philosophy profile
 */

'use client';

import React, { useState, useEffect } from 'react';
import { investmentPhilosophyApi } from '@/lib/api/investment-philosophy';
import type { InvestmentPhilosophy } from '@/types/investment-philosophy';

interface InvestmentPhilosophySelectorProps {
  /** Callback when profile is selected */
  onProfileChange?: (profile: InvestmentPhilosophy | null) => void;
  /** Whether to show create new profile button */
  showCreateButton?: boolean;
  /** Callback when create button is clicked */
  onCreateClick?: () => void;
  /** Compact mode for smaller display */
  compact?: boolean;
}

export function InvestmentPhilosophySelector({
  onProfileChange,
  showCreateButton = true,
  onCreateClick,
  compact = false,
}: InvestmentPhilosophySelectorProps) {
  const [profiles, setProfiles] = useState<InvestmentPhilosophy[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await investmentPhilosophyApi.getAllProfiles();
      setProfiles(result.profiles);
      setActiveProfileId(result.activeProfileId);
      
      // Notify parent of active profile
      if (result.activeProfileId && onProfileChange) {
        const active = result.profiles.find((p) => p.id === result.activeProfileId);
        onProfileChange(active || null);
      }
    } catch (err: any) {
      console.error('Error loading investment philosophy profiles:', err);
      setError(err.message || 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = async (profileId: string) => {
    try {
      await investmentPhilosophyApi.setActiveProfile(profileId);
      setActiveProfileId(profileId);
      
      const selectedProfile = profiles.find((p) => p.id === profileId);
      if (onProfileChange) {
        onProfileChange(selectedProfile || null);
      }
    } catch (err: any) {
      console.error('Error activating profile:', err);
      setError(err.message || 'Failed to activate profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
        <span>Loading profiles...</span>
      </div>
    );
  }

  if (error && profiles.length === 0) {
    return (
      <div className="text-sm text-red-600">
        {error}
        {showCreateButton && onCreateClick && (
          <button
            onClick={onCreateClick}
            className="ml-2 text-primary-600 hover:text-primary-700 underline"
          >
            Create Profile
          </button>
        )}
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-sm text-gray-600">
        <p>No investment philosophy profile set up.</p>
        {showCreateButton && onCreateClick && (
          <button
            onClick={onCreateClick}
            className="mt-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
          >
            Create Your First Profile
          </button>
        )}
      </div>
    );
  }

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <select
          value={activeProfileId || activeProfile?.id || ''}
          onChange={(e) => handleProfileChange(e.target.value)}
          className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.profileName || `${profile.investmentStyle} (${profile.riskCategory})`}
            </option>
          ))}
        </select>
        {showCreateButton && onCreateClick && (
          <button
            onClick={onCreateClick}
            className="text-xs px-2 py-1 text-primary-600 hover:text-primary-700 border border-primary-300 rounded"
            title="Create new profile"
          >
            + New
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Active Investment Philosophy Profile
      </label>
      <div className="flex items-center space-x-2">
        <select
          value={activeProfileId || activeProfile?.id || ''}
          onChange={(e) => handleProfileChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.profileName || `${profile.investmentStyle.charAt(0).toUpperCase() + profile.investmentStyle.slice(1)} (${profile.riskCategory})`}
            </option>
          ))}
        </select>
        {showCreateButton && onCreateClick && (
          <button
            onClick={onCreateClick}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
          >
            + New Profile
          </button>
        )}
      </div>
      
      {/* Profile Summary */}
      {activeProfile && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {activeProfile.profileName || 'Default Profile'}
                </span>
                {activeProfile.isDefault && (
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                    Default
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Style:</span>{' '}
                  {activeProfile.investmentStyle.charAt(0).toUpperCase() +
                    activeProfile.investmentStyle.slice(1)}
                </p>
                <p>
                  <span className="font-medium">Risk:</span> {activeProfile.riskCategory} (
                  {activeProfile.riskTolerance}/10)
                </p>
                <p>
                  <span className="font-medium">Horizon:</span>{' '}
                  {activeProfile.investmentHorizon.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="text-xs text-red-600 mt-1">{error}</div>
      )}
    </div>
  );
}

