/**
 * Vehicle Domain Documentation Page
 * Includes data provenance, empirical testing, and methodology
 */

'use client';

import React from 'react';
import Link from 'next/link';

export default function VehicleDomainDocs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <Link 
              href="/docs/chadd-methodology" 
              className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block"
            >
              ← Back to CHADD Methodology
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Vehicle Domain Documentation
            </h1>
            <p className="text-lg text-gray-600">
              Gas & Electric Vehicle Diagnostics using CHADD/SQUD Framework
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* Data Provenance */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Provenance</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                <h3 className="font-bold text-blue-900 mb-3">Vehicle Telemetry Data Sources</h3>
                <p className="text-gray-700 mb-3">
                  Vehicle diagnostics use telemetry data from multiple sources:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                  <li><strong>OBD-II Systems:</strong> Real-time engine diagnostics, emissions, and performance data</li>
                  <li><strong>Vehicle CAN Bus:</strong> Sensor data from engine control units, transmission, and powertrain</li>
                  <li><strong>Electric Vehicle Systems:</strong> Battery management systems, motor controllers, charging data</li>
                  <li><strong>Fleet Management Platforms:</strong> Aggregated telemetry from commercial vehicle fleets</li>
                </ul>
                <p className="text-gray-700 text-sm">
                  <strong>Note:</strong> Demo data in the dashboard is synthetic and representative. 
                  Real deployments integrate with vehicle-specific telemetry systems.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-bold text-purple-900 mb-3">Industry Standards</h3>
                <p className="text-gray-700 mb-3">
                  Vehicle health assessments reference industry-standard thresholds and benchmarks:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>SAE J1979 (OBD-II diagnostic standards)</li>
                  <li>ISO 14229 (Unified Diagnostic Services)</li>
                  <li>Automotive industry failure mode databases</li>
                  <li>Manufacturer-specific diagnostic codes and thresholds</li>
                </ul>
              </div>
            </section>

            {/* Empirical Testing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Empirical Testing Approach</h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
                <h3 className="font-bold text-gray-900 mb-3">Test Protocol</h3>
                <p className="text-gray-700 mb-3">
                  The vehicle domain uses standardized empirical test protocols:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>EV Motor/Powertrain Health Protocol:</strong> Validates efficiency and thermal behaviors 
                      under changing load; detects over-temperature/fault windows</li>
                  <li><strong>Gas Vehicle Engine Diagnostics:</strong> Monitors engine performance, emissions, and 
                      component health under various operating conditions</li>
                  <li><strong>Fault Detection:</strong> Validates detection of common failure modes (bearing faults, 
                      overheating, sensor degradation)</li>
                  <li><strong>Monotonic Relationship Validation:</strong> Checks that higher load → higher current/temperature 
                      within safe bounds</li>
                </ul>
                <p className="text-gray-700">
                  Full protocol details: <code className="bg-gray-100 px-2 py-1 rounded">docs/Aerospace_EV_Grid_Empirical_Test_Protocols.md</code>
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-green-900 mb-3">Results to Date</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">EV Motor Health:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Validates efficiency and thermal behaviors under changing load</li>
                      <li>Detects over-temperature/fault windows with high accuracy</li>
                      <li>Monotonic relationships confirmed (higher load → higher current/temperature)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Gas Vehicle Diagnostics:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Engine performance monitoring validated</li>
                      <li>Emissions compliance tracking functional</li>
                      <li>Component health assessment accurate</li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-700 mt-4 text-sm">
                  <strong>Full Results:</strong> See <code className="bg-gray-100 px-2 py-1 rounded">docs/Aerospace_EV_Grid_Empirical_Test_Protocols.md</code>
                </p>
              </div>
            </section>

            {/* Methodology */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">SQUD Mapping for Vehicle Domain</h2>
              <p className="text-gray-700 mb-4">
                The vehicle domain maps telemetry to SQUD metrics as follows:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>S (Stability):</strong> Engine/powertrain stability from RPM consistency, temperature stability, 
                    and vibration patterns</li>
                <li><strong>Q (Quality):</strong> Operational quality from efficiency metrics, fuel economy, and power output</li>
                <li><strong>U (Urgency):</strong> Stress indicators from load variations, temperature excursions, and 
                    performance degradation</li>
                <li><strong>D (Dissonance):</strong> System conflicts (e.g., high load with low efficiency, temperature 
                    rise without load increase)</li>
              </ul>
            </section>

            {/* Additional Resources */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Resources</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Empirical Test Protocols: <code className="bg-gray-100 px-2 py-1 rounded">docs/Aerospace_EV_Grid_Empirical_Test_Protocols.md</code></li>
                <li>Vehicle AI Skill Experts: <code className="bg-gray-100 px-2 py-1 rounded">docs/Vehicle_AI_Skill_Experts.md</code></li>
              </ul>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              CHADD Suite (Scientific + Business) • Copyright © {new Date().getFullYear()} Intermedia Communications Corp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

