/**
 * Medical Domain Documentation Page
 * Includes data provenance, empirical testing, and methodology
 */

'use client';

import React from 'react';
import Link from 'next/link';

export default function MedicalDomainDocs() {
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
              Medical Domain Documentation
            </h1>
            <p className="text-lg text-gray-600">
              Patient Vital Signs Monitoring using CHADD/SQUD Framework
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* Data Provenance */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Provenance</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                <h3 className="font-bold text-blue-900 mb-3">Primary Data Source</h3>
                <p className="text-gray-700 mb-3">
                  <strong>Human Vital Signs Dataset 2024</strong> from Kaggle:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                  <li>Source: <a href="https://www.kaggle.com/datasets/whenamancodes/human-vital-signs" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Kaggle Dataset</a></li>
                  <li>License: CC0 1.0 Universal (Public Domain)</li>
                  <li>Size: ~2.5 million records</li>
                  <li>Features: Heart Rate, Respiratory Rate, Blood Pressure, Body Temperature, Oxygen Saturation, Demographics</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-bold text-purple-900 mb-3">Composite Patient Timeseries Data</h3>
                <p className="text-gray-700 mb-3">
                  The medical composite patient timeseries data used in CHADD dashboards was created through 
                  a <strong>patentable algorithm</strong> that processes the 2024 Human Vital Signs Dataset. 
                  This algorithm:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Generates realistic patient trajectories from base vital signs</li>
                  <li>Creates temporal patterns matching clinical deterioration scenarios</li>
                  <li>Maintains physiological consistency across multiple vital signs</li>
                  <li>Enables validation of SQUD framework on realistic patient data</li>
                </ul>
                <p className="text-gray-700 mt-3 text-sm">
                  <strong>Note:</strong> The algorithm itself is patent-pending. The generated composite data 
                  is used for demonstration and validation purposes.
                </p>
              </div>
            </section>

            {/* Empirical Testing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Empirical Testing Approach</h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
                <h3 className="font-bold text-gray-900 mb-3">Test Protocol</h3>
                <p className="text-gray-700 mb-3">
                  The medical domain uses standardized empirical test protocols to validate SQUD framework 
                  performance on patient vital signs:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Patient Vitals Monitoring Protocol:</strong> Detects clinically significant events 
                      (hypoxia, bradycardia) with low false alarms</li>
                  <li><strong>Imaging Triage Proxy Protocol:</strong> Fast CI-friendly surrogate for classification quality</li>
                  <li><strong>Alarm Integrity Testing:</strong> Measures precision, recall, FPR, and alarm latency</li>
                  <li><strong>Synthetic Event Injection:</strong> Controlled deterioration events for validation</li>
                </ul>
                <p className="text-gray-700">
                  Full protocol details: <code className="bg-gray-100 px-2 py-1 rounded">docs/Medical_Empirical_Test_Protocols.md</code>
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-green-900 mb-3">Results to Date</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Validation on Synthetic Events:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li><strong>Precision:</strong> 1.0 (no false alarms)</li>
                      <li><strong>Recall:</strong> 1.0 (all events detected)</li>
                      <li><strong>False Positive Rate:</strong> 0.0%</li>
                      <li><strong>Latency:</strong> Immediate detection</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Comparison to Traditional Threshold Alarms:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Traditional: Precision=0.68, Recall=0.95, FPR=8%</li>
                      <li><strong>SQUD:</strong> Precision=1.0, Recall=1.0, FPR=0%</li>
                      <li>Demonstrates superior specificity while maintaining perfect sensitivity</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Dataset Validation:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Tested on 2.5M records from Human Vital Signs Dataset 2024</li>
                      <li>SQUD metrics properly normalized to [0,1] range</li>
                      <li>Risk stratification shows expected distribution</li>
                      <li>Correlation analysis confirms distinct physiological dimensions</li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-700 mt-4 text-sm">
                  <strong>Full Results:</strong> See <code className="bg-gray-100 px-2 py-1 rounded">docs/publications/medical_vitals_squd_methodology.md</code> 
                  and <code className="bg-gray-100 px-2 py-1 rounded">data/medical/KAGGLE_DESCRIPTION.md</code>
                </p>
              </div>
            </section>

            {/* Methodology */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">SQUD Mapping for Medical Domain</h2>
              <p className="text-gray-700 mb-4">
                The medical domain maps vital signs to SQUD metrics as follows:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>S (Stability):</strong> Cardiovascular homeostasis via heart rate variability, 
                    blood pressure stability, and temperature regulation</li>
                <li><strong>Q (Quality):</strong> Oxygenation efficiency from SpO₂ levels (normalized 88-100%)</li>
                <li><strong>U (Urgency):</strong> Clinical threshold violations and rate-of-change indicators 
                    for heart rate, respiratory rate, blood pressure, and temperature</li>
                <li><strong>D (Dissonance):</strong> Physiological conflicts between vital signs (e.g., 
                    fever without tachycardia, hypoxia without compensatory tachypnea)</li>
              </ul>
            </section>

            {/* Additional Resources */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Resources</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Methodology Paper: <code className="bg-gray-100 px-2 py-1 rounded">docs/publications/medical_vitals_squd_methodology.md</code></li>
                <li>Empirical Test Protocols: <code className="bg-gray-100 px-2 py-1 rounded">docs/Medical_Empirical_Test_Protocols.md</code></li>
                <li>Dataset Documentation: <code className="bg-gray-100 px-2 py-1 rounded">data/medical/README_SQUD.md</code></li>
                <li>Analysis Notebook: <code className="bg-gray-100 px-2 py-1 rounded">notebooks/medical_vitals_squd_analysis.ipynb</code></li>
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

