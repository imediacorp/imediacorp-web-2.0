/**
 * Business Domain Documentation Page
 * Includes data provenance, empirical testing, and methodology
 */

'use client';

import React from 'react';
import Link from 'next/link';

export default function BusinessDomainDocs() {
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
              Business Domain Documentation
            </h1>
            <p className="text-lg text-gray-600">
              Business Health & Financial Risk Assessment using CHADD/SQUD Framework
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* Data Provenance */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Provenance</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                <h3 className="font-bold text-blue-900 mb-3">Business KPI Data Sources</h3>
                <p className="text-gray-700 mb-3">
                  Business health assessments use KPI data from multiple sources:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                  <li><strong>Financial Systems:</strong> Revenue, margin, cash flow data from accounting systems</li>
                  <li><strong>CRM Platforms:</strong> Customer metrics, churn, retention, NPS data</li>
                  <li><strong>Operational Dashboards:</strong> Sales cycle, pipeline, efficiency metrics</li>
                  <li><strong>HR Systems:</strong> Employee satisfaction, retention, turnover data</li>
                </ul>
                <p className="text-gray-700 text-sm">
                  <strong>Note:</strong> Demo data in the dashboard is synthetic and representative. 
                  Real deployments integrate with company-specific data sources.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-bold text-purple-900 mb-3">Industry Benchmarks</h3>
                <p className="text-gray-700 mb-3">
                  Business health assessments reference industry-standard benchmarks and thresholds:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>SaaS industry benchmarks for LTV:CAC, churn rates, growth rates</li>
                  <li>Financial health indicators from business analytics platforms</li>
                  <li>Operational efficiency metrics from industry reports</li>
                </ul>
              </div>
            </section>

            {/* Empirical Testing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Empirical Testing Approach</h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
                <h3 className="font-bold text-gray-900 mb-3">Test Protocol</h3>
                <p className="text-gray-700 mb-3">
                  The business domain uses standardized empirical test protocols:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Business Health Monitoring Protocol:</strong> Detects outages/spikes in error rates, 
                      churn drift, and measures shock recovery latency in KPIs</li>
                  <li><strong>Stress Testing:</strong> Validates response to revenue shocks, churn increases, 
                      and margin compression scenarios</li>
                  <li><strong>Monte Carlo Simulation:</strong> Provides confidence intervals and failure probabilities</li>
                  <li><strong>Synthetic KPI Model:</strong> CI-friendly deterministic data generation for testing</li>
                </ul>
                <p className="text-gray-700">
                  Full protocol details: <code className="bg-gray-100 px-2 py-1 rounded">docs/Industry_Application_Empirical_Test_Protocols.md</code>
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-green-900 mb-3">Results to Date</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Outage Detection:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Precision ≥ 0.75</li>
                      <li>Recall ≥ 0.75</li>
                      <li>False Positive Rate ≤ 5%</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Churn Drift Detection:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Detects mean shifts in churn rates</li>
                      <li>Quantifies change magnitude</li>
                      <li>Provides early warning of customer retention issues</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Revenue Recovery Latency:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Median recovery latency ≤ window size of injected shock</li>
                      <li>Validates system response to transient business disruptions</li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-700 mt-4 text-sm">
                  <strong>Full Results:</strong> See <code className="bg-gray-100 px-2 py-1 rounded">docs/Industry_Application_Empirical_Test_Protocols.md</code>
                </p>
              </div>
            </section>

            {/* Methodology */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">SQUD Mapping for Business Domain</h2>
              <p className="text-gray-700 mb-4">
                The business domain maps KPIs to SQUD metrics as follows:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>S (Stability):</strong> Financial stability and consistency from revenue growth patterns, 
                    margin stability, and cash runway</li>
                <li><strong>Q (Quality):</strong> Operational quality and efficiency from net revenue retention, 
                    LTV:CAC ratio, and NPS scores</li>
                <li><strong>U (Urgency):</strong> Risk factors and pressure indicators from churn rates, burn multiples, 
                    cash pressure, and sales cycle length</li>
                <li><strong>D (Dissonance):</strong> Business conflicts and misalignments (e.g., high growth with 
                    negative cash flow, high NPS with increasing churn)</li>
              </ul>
            </section>

            {/* Additional Resources */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Resources</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Empirical Test Protocols: <code className="bg-gray-100 px-2 py-1 rounded">docs/Industry_Application_Empirical_Test_Protocols.md</code></li>
                <li>Business Health Documentation: <code className="bg-gray-100 px-2 py-1 rounded">docs/Business_Health_With_CHADD_HDPD.md</code></li>
                <li>Personnel Health Validation: <code className="bg-gray-100 px-2 py-1 rounded">docs/Personnel_Adapter_Validation.md</code></li>
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

