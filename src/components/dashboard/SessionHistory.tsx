/**
 * Session History Component
 * Store and retrieve previous sessions, compare with current session
 */

'use client';

import React, { useState, useEffect } from 'react';
import type { SQUDScore } from '@/types/api';

export interface SessionData {
  id: string;
  timestamp: string;
  squd_means: SQUDScore;
  health?: number;
  metrics?: Record<string, number>;
  vehicle_id?: string;
}

interface SessionHistoryProps {
  currentSession?: SessionData;
  vehicleType: 'gas' | 'electric';
  onSessionSelect?: (session: SessionData) => void;
}

const SESSION_STORAGE_KEY = 'hdpd_session_history';

export function SessionHistory({
  currentSession,
  vehicleType,
  onSessionSelect,
}: SessionHistoryProps) {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`${SESSION_STORAGE_KEY}_${vehicleType}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSessions(parsed);
      } catch (e) {
        console.error('Failed to load session history:', e);
      }
    }
  }, [vehicleType]);

  // Save current session when it changes
  useEffect(() => {
    if (currentSession) {
      const newSessions = [currentSession, ...sessions.filter((s) => s.id !== currentSession.id)].slice(0, 10); // Keep last 10
      setSessions(newSessions);
      localStorage.setItem(`${SESSION_STORAGE_KEY}_${vehicleType}`, JSON.stringify(newSessions));
    }
  }, [currentSession?.id]); // Only save when session ID changes

  const handleSessionSelect = (session: SessionData) => {
    setSelectedSession(session);
    if (onSessionSelect) {
      onSessionSelect(session);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear session history?')) {
      setSessions([]);
      localStorage.removeItem(`${SESSION_STORAGE_KEY}_${vehicleType}`);
      setSelectedSession(null);
    }
  };

  // Comparison data
  const comparisonData = selectedSession && currentSession
    ? {
        current: currentSession,
        previous: selectedSession,
        differences: {
          S: currentSession.squd_means.S - selectedSession.squd_means.S,
          Q: currentSession.squd_means.Q - selectedSession.squd_means.Q,
          U: currentSession.squd_means.U - selectedSession.squd_means.U,
          D: currentSession.squd_means.D - selectedSession.squd_means.D,
          health: (currentSession.health || (1.0 - currentSession.squd_means.D) * 100) -
            (selectedSession.health || (1.0 - selectedSession.squd_means.D) * 100),
        },
      }
    : null;

  return (
    <div className="space-y-6">
      {/* Session List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Session History</h3>
          {sessions.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Clear History
            </button>
          )}
        </div>

        {sessions.length === 0 ? (
          <p className="text-gray-500 text-sm">No previous sessions. Current session will be saved automatically.</p>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleSessionSelect(session)}
                className={`w-full text-left p-3 rounded-md border transition-colors ${
                  selectedSession?.id === session.id
                    ? 'bg-primary-50 border-primary-300'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(session.timestamp).toLocaleString()}
                    </div>
                    {session.vehicle_id && (
                      <div className="text-xs text-gray-500">Vehicle: {session.vehicle_id}</div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Health: {session.health ? session.health.toFixed(1) : ((1.0 - session.squd_means.D) * 100).toFixed(1)}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Session Comparison */}
      {comparisonData && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Comparison</h3>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Current Session */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Session</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">S:</span>
                  <span className="font-medium">{comparisonData.current.squd_means.S.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Q:</span>
                  <span className="font-medium">{comparisonData.current.squd_means.Q.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">U:</span>
                  <span className="font-medium">{comparisonData.current.squd_means.U.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">D:</span>
                  <span className="font-medium">{comparisonData.current.squd_means.D.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Health:</span>
                  <span className="font-medium">
                    {(comparisonData.current.health || (1.0 - comparisonData.current.squd_means.D) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Previous Session */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Previous Session ({new Date(comparisonData.previous.timestamp).toLocaleDateString()})
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">S:</span>
                  <span className="font-medium">{comparisonData.previous.squd_means.S.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Q:</span>
                  <span className="font-medium">{comparisonData.previous.squd_means.Q.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">U:</span>
                  <span className="font-medium">{comparisonData.previous.squd_means.U.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">D:</span>
                  <span className="font-medium">{comparisonData.previous.squd_means.D.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Health:</span>
                  <span className="font-medium">
                    {(comparisonData.previous.health || (1.0 - comparisonData.previous.squd_means.D) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Differences */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Differences</h4>
            <div className="grid grid-cols-5 gap-4 text-sm">
              {Object.entries(comparisonData.differences).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">{key}</div>
                  <div
                    className={`text-lg font-semibold ${
                      value > 0
                        ? key === 'D' || key === 'U' || key === 'Q'
                          ? 'text-red-600'
                          : 'text-green-600'
                        : value < 0
                        ? key === 'D' || key === 'U' || key === 'Q'
                          ? 'text-green-600'
                          : 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {value > 0 ? '+' : ''}
                    {typeof value === 'number' ? value.toFixed(3) : value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

