/**
 * Energy Domain Documentation Page (Grid, Solar, Wind)
 * Includes data provenance, empirical testing, and methodology
 */

'use client';

import React from 'react';
import Link from 'next/link';

export default function EnergyDomainDocs() {
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
              Energy Domain Documentation
            </h1>
            <p className="text-lg text-gray-600">
              Grid, Solar, and Wind Energy Monitoring using CHADD/SQUD Framework
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* Data Provenance */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Provenance</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                <h3 className="font-bold text-blue-900 mb-3">Grid/Substation Data Sources</h3>
                <p className="text-gray-700 mb-3">
                  Grid and substation monitoring uses SCADA data from:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                  <li><strong>Utility SCADA Systems:</strong> Real-time voltage, frequency, power, and current measurements</li>
                  <li><strong>Grid Monitoring Networks:</strong> Regional grid stability and reliability data</li>
                  <li><strong>Fault/Event Logs:</strong> Historical outage and transient event records</li>
                </ul>
                <p className="text-gray-700 text-sm">
                  <strong>Standards:</strong> IEC 60038 / EN 50160 (voltage characteristics), IEEE Std 1159-2019 (Power Quality), 
                  IEEE Std 1366-2012 (SAIDI/SAIFI reliability indices)
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                <h3 className="font-bold text-green-900 mb-3">Solar & Wind SCADA Data Sources</h3>
                <p className="text-gray-700 mb-3">
                  Renewable energy monitoring uses data from:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                  <li><strong>Solar Plant SCADA:</strong> Irradiance, module temperature, inverter performance, plant power output</li>
                  <li><strong>Wind Farm SCADA:</strong> Wind speed, nacelle temperature, gearbox temperature, generator power, vibration</li>
                  <li><strong>Weather Data:</strong> NOAA weather stations, NASA satellite data for irradiance and wind resource</li>
                </ul>
                <p className="text-gray-700 text-sm">
                  <strong>Note:</strong> Demo data is synthetic. Real deployments integrate with plant-specific SCADA systems.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-bold text-purple-900 mb-3">Public Data Sources</h3>
                <p className="text-gray-700 mb-3">
                  Additional data sources used for validation and benchmarking:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li><strong>NOAA:</strong> Weather and climate data for renewable resource assessment</li>
                  <li><strong>NASA:</strong> Satellite-derived solar irradiance and meteorological data</li>
                  <li><strong>Grid Operators:</strong> Public grid reliability and performance reports</li>
                </ul>
              </div>
            </section>

            {/* Empirical Testing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Empirical Testing Approach</h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
                <h3 className="font-bold text-gray-900 mb-3">Test Protocol</h3>
                <p className="text-gray-700 mb-3">
                  The energy domain uses standardized empirical test protocols:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Grid/Substation Stability Protocol:</strong> Detects voltage/frequency transients, outages, 
                      and compliance violations</li>
                  <li><strong>Solar Plant Performance Protocol:</strong> Validates performance ratio calculations, 
                      detects degradation, and monitors inverter health</li>
                  <li><strong>Wind Farm Health Protocol:</strong> Monitors turbine performance, detects mechanical faults, 
                      and validates power curve compliance</li>
                  <li><strong>Outage Detection:</strong> Measures precision, recall, FPR, and alarm latency for grid events</li>
                </ul>
                <p className="text-gray-700">
                  Full protocol details: <code className="bg-gray-100 px-2 py-1 rounded">docs/Aerospace_EV_Grid_Empirical_Test_Protocols.md</code>
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-green-900 mb-3">Results to Date</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Grid/Substation:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Voltage/frequency compliance monitoring validated</li>
                      <li>Outage detection with high accuracy</li>
                      <li>Transient event detection functional</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Solar & Wind:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Performance ratio calculations validated</li>
                      <li>Degradation detection accurate</li>
                      <li>Component health assessment functional</li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-700 mt-4 text-sm">
                  <strong>Full Results:</strong> See <code className="bg-gray-100 px-2 py-1 rounded">docs/Aerospace_EV_Grid_Empirical_Test_Protocols.md</code>, 
                  <code className="bg-gray-100 px-2 py-1 rounded">docs/wind/Data_Sources.md</code>, 
                  <code className="bg-gray-100 px-2 py-1 rounded">docs/grid_substation/Data_Sources.md</code>
                </p>
              </div>
            </section>

            {/* Methodology */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">SQUD Mapping for Energy Domain</h2>
              <p className="text-gray-700 mb-4">
                The energy domain maps telemetry to SQUD metrics as follows:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>S (Stability):</strong> Grid/plant stability from voltage/frequency compliance, power quality, 
                    and availability metrics</li>
                <li><strong>Q (Quality):</strong> Operational quality from performance ratios, efficiency metrics, and 
                    power output consistency</li>
                <li><strong>U (Urgency):</strong> Stress indicators from load variations, temperature excursions, and 
                    component degradation</li>
                <li><strong>D (Dissonance):</strong> System conflicts (e.g., high irradiance with low power output, 
                    high wind speed with low generation)</li>
              </ul>
            </section>

            {/* Additional Resources */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Resources</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Empirical Test Protocols: <code className="bg-gray-100 px-2 py-1 rounded">docs/Aerospace_EV_Grid_Empirical_Test_Protocols.md</code></li>
                <li>Grid Data Sources: <code className="bg-gray-100 px-2 py-1 rounded">docs/grid_substation/Data_Sources.md</code></li>
                <li>Wind Data Sources: <code className="bg-gray-100 px-2 py-1 rounded">docs/wind/Data_Sources.md</code></li>
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

