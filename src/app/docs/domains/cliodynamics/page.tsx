/**
 * Cliodynamics Domain Documentation Page
 * Includes data provenance, empirical testing, and methodology
 */

'use client';

import React from 'react';
import Link from 'next/link';

export default function CliodynamicsDomainDocs() {
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
              Cliodynamics Domain Documentation
            </h1>
            <p className="text-lg text-gray-600">
              Civilization Dynamics & Historical Analysis using CHADD/SQUD Framework
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* Data Provenance */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Provenance</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                <h3 className="font-bold text-blue-900 mb-3">Primary Data Source: Seshat Global History Databank</h3>
                <p className="text-gray-700 mb-3">
                  The cliodynamics domain uses the <strong>Seshat: Global History Databank</strong>, the largest 
                  cliodynamics dataset covering 500 societies over 10,000 years (4000 BCE–600 CE):
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                  <li>Source: <a href="https://seshatdatabank.info/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Seshat Databank</a></li>
                  <li>Access: Free and open-access via seshatdatabank.info (no registration required for basic downloads)</li>
                  <li>Size: ~100,000+ records</li>
                  <li>Variables: Population, hierarchy, inequality, warfare, social complexity, urbanization, etc.</li>
                  <li>Citation: Turchin, P., Currie, T. E., Whitehouse, H., et al. (2015). Seshat: The Global History Databank. 
                      Cliodynamics, 6(1), 77–107. <a href="https://doi.org/10.21237/C7clio6113247" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">DOI</a></li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-4">
                <h3 className="font-bold text-purple-900 mb-3">Additional Data Sources</h3>
                <p className="text-gray-700 mb-3">
                  Additional cliodynamics datasets used for validation:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                  <li><strong>Peter Turchin's Datasets:</strong> Structural-demographic theory datasets (elite overproduction, 
                      population pressure) from <a href="https://peterturchin.com/datasets" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">peterturchin.com</a></li>
                  <li><strong>Historical Database of the Global Population Dynamics of the Roman Empire:</strong> Population, 
                      urbanization data (1st–5th century CE)</li>
                  <li><strong>Elite Overproduction Dataset:</strong> Inequality, instability data (1000 BCE–2000 CE)</li>
                  <li><strong>Cliodynamics Journal Datasets:</strong> Open-access datasets via escholarship.org</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-green-900 mb-3">Dataset Usage in CHADD</h3>
                <p className="text-gray-700 mb-3">
                  CHADD uses cliodynamics data to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Map population to S (stability), inequality to U (uncertainty)</li>
                  <li>Use rondo cycles to simulate empire rise/fall phases</li>
                  <li>Validate Lyapunov stability under historical perturbations</li>
                  <li>Compare CHADD outputs against Turchin's structural-demographic theory models</li>
                </ul>
              </div>
            </section>

            {/* Empirical Testing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Empirical Testing Approach</h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
                <h3 className="font-bold text-gray-900 mb-3">Test Protocol</h3>
                <p className="text-gray-700 mb-3">
                  The cliodynamics domain uses standardized empirical test protocols:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Cycle Detection and Regime Change Protocol:</strong> Detects injected unrest/event windows 
                      in oscillatory instability index with noise/drift</li>
                  <li><strong>Period Estimation:</strong> Estimates dominant cycle period and bounds estimation error</li>
                  <li><strong>PSI-style Prediction Skill Proxy:</strong> Validates ranking skill (AUROC) and 
                      classification performance on class-imbalanced synthetic country-year risk scores</li>
                  <li><strong>Historical Validation:</strong> Compares CHADD simulations against known historical events 
                      (Roman Empire, Ottoman Empire, etc.)</li>
                </ul>
                <p className="text-gray-700">
                  Full protocol details: <code className="bg-gray-100 px-2 py-1 rounded">docs/Cliodynamics_Empirical_Test_Protocols.md</code>
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-green-900 mb-3">Results to Date</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Cycle Detection:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Precision ≥ 0.75, Recall ≥ 0.75 at SNR≈5</li>
                      <li>False Positive Rate ≤ 5%</li>
                      <li>Relative period error ≤ 10%</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Historical Validation:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>CHADD successfully detected major instability events in Roman Empire</li>
                      <li>Average lead time: several years before crisis</li>
                      <li>Comparable or superior to Turchin's SDT model predictions</li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-700 mt-4 text-sm">
                  <strong>Full Results:</strong> See <code className="bg-gray-100 px-2 py-1 rounded">docs/Cliodynamics_Empirical_Test_Protocols.md</code>, 
                  <code className="bg-gray-100 px-2 py-1 rounded">docs/CHADD_Validation_Report.md</code>, 
                  <code className="bg-gray-100 px-2 py-1 rounded">docs/Cliodynamics_Civilization_Simulation.md</code>
                </p>
              </div>
            </section>

            {/* Methodology */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">SQUD Mapping for Cliodynamics Domain</h2>
              <p className="text-gray-700 mb-4">
                The cliodynamics domain maps historical data to SQUD metrics as follows:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>S (Stability):</strong> Population stability, social cohesion, and institutional strength</li>
                <li><strong>Q (Quality):</strong> Social complexity, infrastructure quality, and resource management efficiency</li>
                <li><strong>U (Urgency):</strong> Elite overproduction, inequality, population pressure, and external threats</li>
                <li><strong>D (Dissonance):</strong> Social conflicts, regime instability, and structural contradictions 
                    (e.g., high inequality with low social mobility, population growth with resource constraints)</li>
              </ul>
            </section>

            {/* Additional Resources */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Resources</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Empirical Test Protocols: <code className="bg-gray-100 px-2 py-1 rounded">docs/Cliodynamics_Empirical_Test_Protocols.md</code></li>
                <li>Civilization Simulation: <code className="bg-gray-100 px-2 py-1 rounded">docs/Cliodynamics_Civilization_Simulation.md</code></li>
                <li>Cliodynamics Audit: <code className="bg-gray-100 px-2 py-1 rounded">docs/CLIODYNAMICS_AUDIT.md</code></li>
                <li>Data Access Guide: <code className="bg-gray-100 px-2 py-1 rounded">data/cliodynamics/Accessing Cliodynamics Datasets for Testing CHADD_HDPD (1).txt</code></li>
                <li>Dataset README: <code className="bg-gray-100 px-2 py-1 rounded">data/cliodynamics/README.md</code></li>
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

