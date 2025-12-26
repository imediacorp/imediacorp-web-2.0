/**
 * Investment Philosophy Profile API Client
 */

import { apiClient } from './client';
import type {
  InvestmentPhilosophy,
  InvestmentPhilosophyFormData,
} from '@/types/investment-philosophy';

/**
 * Investment Philosophy API methods
 */
export const investmentPhilosophyApi = {
  /**
   * Get the active investment philosophy profile
   */
  async getActiveProfile(): Promise<InvestmentPhilosophy | null> {
    try {
      const response = await apiClient.get<InvestmentPhilosophy>(
        '/api/v1/investment-philosophy/profile'
      );
      return response;
    } catch (error: any) {
      // If 404, user hasn't created a profile yet
      if (error?.status === 404) {
        return null;
      }
      console.error('Error fetching active investment philosophy profile:', error);
      throw error;
    }
  },

  /**
   * Get all investment philosophy profiles for the current user
   */
  async getAllProfiles(): Promise<{
    profiles: InvestmentPhilosophy[];
    activeProfileId: string | null;
  }> {
    try {
      const response = await apiClient.get<{
        profiles: InvestmentPhilosophy[];
        active_profile_id: string | null;
      }>('/api/v1/investment-philosophy/profiles');
      return {
        profiles: response.profiles,
        activeProfileId: response.active_profile_id,
      };
    } catch (error) {
      console.error('Error fetching investment philosophy profiles:', error);
      throw error;
    }
  },

  /**
   * Create a new investment philosophy profile
   */
  async createProfile(
    profileData: InvestmentPhilosophyFormData
  ): Promise<InvestmentPhilosophy> {
    try {
      const response = await apiClient.post<InvestmentPhilosophy>(
        '/api/v1/investment-philosophy/profile',
        {
          profile_name: profileData.profileName,
          investment_style: profileData.investmentStyle,
          risk_tolerance: profileData.riskTolerance,
          investment_horizon: profileData.investmentHorizon,
          preferences: {
            preferred_sectors: profileData.preferences.preferredSectors,
            avoided_sectors: profileData.preferences.avoidedSectors,
            market_cap_preference: profileData.preferences.marketCapPreference,
            geographic_preference: profileData.preferences.geographicPreference,
            esg_considerations: profileData.preferences.esgConsiderations,
            dividend_preference: profileData.preferences.dividendPreference,
            tax_sensitive: profileData.preferences.taxSensitive,
            leverage_tolerance: profileData.preferences.leverageTolerance,
          },
          chadd_preferences: {
            focus_metrics: profileData.chaddPreferences.focusMetrics,
            min_resilience_score: profileData.chaddPreferences.minResilienceScore,
            stress_test_preference: profileData.chaddPreferences.stressTestPreference,
          },
          is_default: false, // Will be set based on whether it's the first profile
        }
      );
      return response;
    } catch (error) {
      console.error('Error creating investment philosophy profile:', error);
      throw error;
    }
  },

  /**
   * Update an existing investment philosophy profile
   */
  async updateProfile(
    profileId: string,
    profileData: InvestmentPhilosophyFormData
  ): Promise<InvestmentPhilosophy> {
    try {
      const response = await apiClient.put<InvestmentPhilosophy>(
        `/api/v1/investment-philosophy/profile/${profileId}`,
        {
          profile_name: profileData.profileName,
          investment_style: profileData.investmentStyle,
          risk_tolerance: profileData.riskTolerance,
          investment_horizon: profileData.investmentHorizon,
          preferences: {
            preferred_sectors: profileData.preferences.preferredSectors,
            avoided_sectors: profileData.preferences.avoidedSectors,
            market_cap_preference: profileData.preferences.marketCapPreference,
            geographic_preference: profileData.preferences.geographicPreference,
            esg_considerations: profileData.preferences.esgConsiderations,
            dividend_preference: profileData.preferences.dividendPreference,
            tax_sensitive: profileData.preferences.taxSensitive,
            leverage_tolerance: profileData.preferences.leverageTolerance,
          },
          chadd_preferences: {
            focus_metrics: profileData.chaddPreferences.focusMetrics,
            min_resilience_score: profileData.chaddPreferences.minResilienceScore,
            stress_test_preference: profileData.chaddPreferences.stressTestPreference,
          },
          is_default: false, // Can be updated separately
        }
      );
      return response;
    } catch (error) {
      console.error('Error updating investment philosophy profile:', error);
      throw error;
    }
  },

  /**
   * Delete an investment philosophy profile
   */
  async deleteProfile(profileId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/investment-philosophy/profile/${profileId}`);
    } catch (error) {
      console.error('Error deleting investment philosophy profile:', error);
      throw error;
    }
  },

  /**
   * Set an investment philosophy profile as active
   */
  async setActiveProfile(profileId: string): Promise<void> {
    try {
      await apiClient.post(
        `/api/v1/investment-philosophy/profile/${profileId}/activate`
      );
    } catch (error) {
      console.error('Error activating investment philosophy profile:', error);
      throw error;
    }
  },
};

