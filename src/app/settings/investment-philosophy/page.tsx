/**
 * Investment Philosophy Settings Page
 * Full settings page for managing investment philosophy profiles
 */

'use client';

import React, { useState, useEffect } from 'react';
import { InvestmentPhilosophyForm } from '@/components/portfolio/InvestmentPhilosophyForm';
import { InvestmentPhilosophySelector } from '@/components/portfolio/InvestmentPhilosophySelector';
import { investmentPhilosophyApi } from '@/lib/api/investment-philosophy';
import type {
  InvestmentPhilosophy,
  InvestmentPhilosophyFormData,
} from '@/types/investment-philosophy';

export default function InvestmentPhilosophySettingsPage() {
  const [profiles, setProfiles] = useState<InvestmentPhilosophy[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState<InvestmentPhilosophy | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
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
    } catch (err: any) {
      console.error('Error loading profiles:', err);
      setError(err.message || 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (formData: InvestmentPhilosophyFormData) => {
    try {
      await investmentPhilosophyApi.createProfile(formData);
      await loadProfiles();
      setShowCreateForm(false);
    } catch (err: any) {
      console.error('Error creating profile:', err);
      throw err;
    }
  };

  const handleUpdateProfile = async (formData: InvestmentPhilosophyFormData) => {
    if (!editingProfile?.id) return;
    
    try {
      await investmentPhilosophyApi.updateProfile(editingProfile.id, formData);
      await loadProfiles();
      setEditingProfile(null);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      return;
    }

    try {
      await investmentPhilosophyApi.deleteProfile(profileId);
      await loadProfiles();
      if (editingProfile?.id === profileId) {
        setEditingProfile(null);
      }
    } catch (err: any) {
      console.error('Error deleting profile:', err);
      alert(`Failed to delete profile: ${err.message || 'Unknown error'}`);
    }
  };

  const handleSetDefault = async (profileId: string) => {
    try {
      await investmentPhilosophyApi.setActiveProfile(profileId);
      await loadProfiles();
    } catch (err: any) {
      console.error('Error setting default profile:', err);
      alert(`Failed to set default profile: ${err.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading investment philosophy profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Investment Philosophy Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your investment philosophy profiles to personalize CHADD's diagnostic insights
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Active Profile Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <InvestmentPhilosophySelector
          onProfileChange={(profile) => {
            if (profile) {
              setActiveProfileId(profile.id || null);
            }
          }}
          showCreateButton={true}
          onCreateClick={() => {
            setEditingProfile(null);
            setShowCreateForm(true);
          }}
        />
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingProfile) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingProfile ? 'Edit Profile' : 'Create New Profile'}
            </h2>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setEditingProfile(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <InvestmentPhilosophyForm
            existingProfile={editingProfile}
            onSubmit={editingProfile ? handleUpdateProfile : handleCreateProfile}
            onCancel={() => {
              setShowCreateForm(false);
              setEditingProfile(null);
            }}
          />
        </div>
      )}

      {/* Profiles List */}
      {profiles.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Profiles</h2>
          <div className="space-y-3">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className={`p-4 border rounded-lg ${
                  profile.id === activeProfileId
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {profile.profileName || 'Unnamed Profile'}
                      </h3>
                      {profile.id === activeProfileId && (
                        <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded">
                          Active
                        </span>
                      )}
                      {profile.isDefault && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Style:</span>{' '}
                        {profile.investmentStyle.charAt(0).toUpperCase() +
                          profile.investmentStyle.slice(1)}
                      </div>
                      <div>
                        <span className="font-medium">Risk:</span> {profile.riskCategory} (
                        {profile.riskTolerance}/10)
                      </div>
                      <div>
                        <span className="font-medium">Horizon:</span>{' '}
                        {profile.investmentHorizon.replace('_', ' ')}
                      </div>
                      <div>
                        <span className="font-medium">Created:</span>{' '}
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {profile.id !== activeProfileId && (
                      <button
                        onClick={() => handleSetDefault(profile.id!)}
                        className="text-xs px-3 py-1.5 text-primary-600 hover:text-primary-700 border border-primary-300 rounded hover:bg-primary-50"
                      >
                        Set Active
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingProfile(profile);
                        setShowCreateForm(false);
                      }}
                      className="text-xs px-3 py-1.5 text-gray-600 hover:text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProfile(profile.id!)}
                      className="text-xs px-3 py-1.5 text-red-600 hover:text-red-700 border border-red-300 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {profiles.length === 0 && !showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No profiles yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Create your first investment philosophy profile to get started
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Create Your First Profile
          </button>
        </div>
      )}
    </div>
  );
}

