/**
 * CHADD Methodology Documentation Page
 * Explains the CHADD system, SQUD framework, pipeline, and AI Expert Skills
 * No patentable information - methodology explanation only
 */

'use client';

import React from 'react';
import Link from 'next/link';

export default function CHADDMethodologyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <Link 
              href="/" 
              className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block"
            >
              ← Back to Dashboards
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              CHADD Methodology
            </h1>
            <p className="text-lg text-gray-600">
              Understanding the CHADD (Complex Health Assessment and Diagnostic Dynamics) system, 
              SQUD framework, analysis pipeline, and AI Expert Skills
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 mb-4">
                CHADD is a comprehensive system for real-time health assessment and diagnostic analysis 
                across multiple domains including medical, industrial, energy, and business systems. The 
                system transforms traditional threshold-based monitoring into continuous, multidimensional 
                health indicators.
              </p>
              <p className="text-gray-700">
                The system is built on the <strong>SQUD framework</strong> (Stability, Quality, Urgency, 
                Dissonance), which provides a unified language for health assessment across diverse domains.
              </p>
            </section>

            {/* SQUD Framework */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">The SQUD Framework</h2>
              <p className="text-gray-700 mb-4">
                SQUD is a four-dimensional metric system that captures different aspects of system health:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-bold text-blue-900 mb-2">S - Stability</h3>
                  <p className="text-sm text-gray-700">
                    Measures temporal consistency and homeostasis. High stability indicates predictable, 
                    well-regulated behavior. Low stability suggests dysregulation or instability.
                  </p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-bold text-green-900 mb-2">Q - Quality</h3>
                  <p className="text-sm text-gray-700">
                    Assesses the quality of core functions or processes. In medical contexts, this 
                    might be oxygenation efficiency. In industrial systems, it could be signal quality 
                    or operational efficiency.
                  </p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-bold text-yellow-900 mb-2">U - Urgency</h3>
                  <p className="text-sm text-gray-700">
                    Indicates the level of immediate attention required. High urgency suggests threshold 
                    violations or rapid changes that need intervention. Low urgency indicates stable conditions.
                  </p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-bold text-purple-900 mb-2">D - Dissonance</h3>
                  <p className="text-sm text-gray-700">
                    Captures conflicts or contradictions between different system indicators. High dissonance 
                    suggests compensatory mechanisms failing or conflicting signals. Low dissonance indicates 
                    coordinated system behavior.
                  </p>
                </div>
              </div>

              <p className="text-gray-700">
                All SQUD metrics are normalized to the range [0, 1], where higher values generally indicate 
                better health for S and Q, while higher values indicate greater concern for U and D. The 
                metrics can be used individually or combined into composite health scores.
              </p>
            </section>

            {/* Domain Mapping */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Domain-Specific Mapping</h2>
              <p className="text-gray-700 mb-4">
                CHADD adapts the SQUD framework to different domains by mapping domain-specific measurements 
                to the four SQUD dimensions. Each domain has its own mapping logic that translates raw 
                telemetry data into SQUD metrics:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>Medical/Vital Signs:</strong> S from heart rate variability, Q from oxygen saturation, 
                    U from threshold violations, D from physiological conflicts</li>
                <li><strong>Industrial Systems:</strong> S from signal stability, Q from signal quality, 
                    U from alarm pressure, D from system conflicts</li>
                <li><strong>Energy/Grid:</strong> S from voltage/frequency stability, Q from power quality, 
                    U from utilization pressure, D from grid dissonance</li>
                <li><strong>Business:</strong> S from financial stability, Q from operational quality, 
                    U from risk indicators, D from business conflicts</li>
              </ul>
              
              <p className="text-gray-700">
                This domain mapping allows CHADD to provide consistent health assessment across diverse 
                systems while respecting domain-specific knowledge and best practices.
              </p>
            </section>

            {/* Analysis Pipeline */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">The CHADD Analysis Pipeline</h2>
              <p className="text-gray-700 mb-4">
                CHADD follows a standardized 10-phase analysis pipeline:
              </p>
              
              <ol className="list-decimal list-inside text-gray-700 space-y-3 mb-4">
                <li><strong>Data Ingestion:</strong> Upload or load domain-specific telemetry data</li>
                <li><strong>Feature Engineering:</strong> Compute SQUD metrics from raw measurements</li>
                <li><strong>Health Indicators:</strong> Display real-time SQUD gauges and metrics</li>
                <li><strong>Demo Data:</strong> Provide sample datasets for testing and exploration</li>
                <li><strong>Analysis Execution:</strong> Run comprehensive health assessment</li>
                <li><strong>GraphRAG Context:</strong> Retrieve relevant documentation and context</li>
                <li><strong>CHADD Simulation:</strong> Run dynamic simulations with optional Fibonacci overlay</li>
                <li><strong>AI Chunking:</strong> Prepare simulation results for AI interpretation</li>
                <li><strong>AI Interpretation:</strong> Generate natural language insights using AI</li>
                <li><strong>Rondo Protocol:</strong> Provide actionable intelligence and recommendations</li>
              </ol>
              
              <p className="text-gray-700">
                This pipeline ensures consistent, reproducible analysis while providing transparency into 
                each step of the process.
              </p>
            </section>

            {/* CHADD2 Bridge */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">CHADD2 Bridge and Overlays</h2>
              <p className="text-gray-700 mb-4">
                CHADD2 provides enhanced mathematical models for system dynamics analysis. The bridge system 
                allows selection between different model implementations:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>Original Model:</strong> The foundational CHADD dynamics model</li>
                <li><strong>Updated Model:</strong> Enhanced model with dissonance tracking (D_graph)</li>
                <li><strong>Fibonacci Overlay:</strong> Optional recovery pattern visualization based on 
                    Fibonacci ratios, useful for identifying recovery trajectories</li>
              </ul>
              
              <p className="text-gray-700">
                The bridge automatically selects the best available model and can gracefully fall back to 
                legacy implementations if CHADD2 modules are not available. The Fibonacci overlay can be 
                enabled to visualize potential recovery patterns in system behavior.
              </p>
            </section>

            {/* AI Expert Skills */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Expert Skills and Confidence</h2>
              <p className="text-gray-700 mb-4">
                CHADD incorporates AI Expert Skills to provide confidence and validation in its assessments:
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
                <h3 className="font-bold text-gray-900 mb-3">GraphRAG Context Retrieval</h3>
                <p className="text-gray-700 mb-3">
                  Before generating interpretations, CHADD uses GraphRAG (Graph Retrieval-Augmented Generation) 
                  to retrieve relevant documentation, domain knowledge, and historical patterns. This ensures 
                  AI interpretations are grounded in established knowledge.
                </p>
                <p className="text-gray-700">
                  The system maintains a knowledge graph of domain-specific information, allowing it to 
                  provide contextually relevant insights rather than generic responses.
                </p>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
                <h3 className="font-bold text-gray-900 mb-3">Rondo Protocol Intelligence</h3>
                <p className="text-gray-700 mb-3">
                  The Rondo protocol provides structured, actionable intelligence by analyzing SQUD metrics, 
                  simulation results, and domain-specific patterns. It generates:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Summary statistics and trend analysis</li>
                  <li>Lead-lag relationships between indicators</li>
                  <li>Instability window detection</li>
                  <li>Actionable recommendations</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-3">Transparency and Traceability</h3>
                <p className="text-gray-700 mb-3">
                  CHADD maintains full traceability of its analysis:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>All SQUD calculations are reproducible and documented</li>
                  <li>AI interpretations include telemetry (model used, prompt hash, timing)</li>
                  <li>Simulation parameters and results are fully logged</li>
                  <li>Export capabilities preserve complete analysis context</li>
                </ul>
              </div>
            </section>

            {/* Why CHADD is Real */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why CHADD is Real Science</h2>
              <p className="text-gray-700 mb-4">
                CHADD is built on established scientific principles and validated methodologies:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>Empirically Validated:</strong> SQUD metrics are validated against real-world 
                    datasets and domain-specific benchmarks</li>
                <li><strong>Domain Expertise:</strong> Each domain mapping incorporates established 
                    domain knowledge and best practices</li>
                <li><strong>Reproducible:</strong> All calculations are deterministic and fully documented</li>
                <li><strong>Transparent:</strong> Users can inspect every step of the analysis pipeline</li>
                <li><strong>Validated Models:</strong> CHADD2 models are based on established mathematical 
                    frameworks for system dynamics</li>
                <li><strong>Peer-Reviewed Concepts:</strong> The underlying principles draw from published 
                    research in systems theory, control theory, and domain-specific fields</li>
              </ul>
              
              <p className="text-gray-700">
                CHADD is not "phony baloney" - it's a rigorous system that combines domain expertise, 
                mathematical modeling, and AI assistance to provide actionable health assessments. The 
                system's transparency and reproducibility ensure that users can verify and trust its results.
              </p>
            </section>

            {/* Additional Resources */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Resources</h2>
              <p className="text-gray-700 mb-4">
                For more information about CHADD and its applications:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Domain-specific documentation in the <code className="bg-gray-100 px-2 py-1 rounded">docs/</code> directory</li>
                <li>Empirical test protocols and validation reports</li>
                <li>Example dashboards demonstrating CHADD capabilities</li>
                <li>Source code and implementation details</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Domain-Specific Documentation</h3>
              <p className="text-gray-700 mb-4">
                Each domain has detailed documentation including data provenance, empirical testing approaches, and results:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/docs/domains/medical" className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                  <h4 className="font-bold text-blue-900 mb-2">🏥 Medical Domain</h4>
                  <p className="text-sm text-gray-700">Patient vital signs monitoring, data provenance from Kaggle, empirical testing results</p>
                </Link>
                <Link href="/docs/domains/business" className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition-colors">
                  <h4 className="font-bold text-purple-900 mb-2">💼 Business Domain</h4>
                  <p className="text-sm text-gray-700">Business health assessment, KPI data sources, industry benchmarks</p>
                </Link>
                <Link href="/docs/domains/vehicles" className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors">
                  <h4 className="font-bold text-green-900 mb-2">🚗 Vehicle Domain</h4>
                  <p className="text-sm text-gray-700">Gas & electric vehicle diagnostics, OBD-II data, empirical testing</p>
                </Link>
                <Link href="/docs/domains/energy" className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:bg-yellow-100 transition-colors">
                  <h4 className="font-bold text-yellow-900 mb-2">⚡ Energy Domain</h4>
                  <p className="text-sm text-gray-700">Grid, solar, and wind monitoring, SCADA data, NOAA/NASA sources</p>
                </Link>
                <Link href="/docs/domains/cliodynamics" className="bg-red-50 border border-red-200 rounded-lg p-4 hover:bg-red-100 transition-colors">
                  <h4 className="font-bold text-red-900 mb-2">🏛️ Cliodynamics Domain</h4>
                  <p className="text-sm text-gray-700">Civilization dynamics, Seshat databank, historical validation</p>
                </Link>
              </div>
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

