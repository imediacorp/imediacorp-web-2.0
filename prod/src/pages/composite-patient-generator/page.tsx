import Navigation from '../../components/feature/Navigation';
import Footer from '../../components/feature/Footer';

export default function CompositePatientGenerator() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-[#1e3a5f] to-[#2a4a70] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{
              backgroundImage: `url('https://readdy.ai/api/search-image?query=Advanced%20medical%20research%20laboratory%20with%20scientists%20analyzing%20patient%20data%20transformation%2C%20showing%20cross-sectional%20data%20being%20converted%20into%20longitudinal%20timeseries%2C%20clean%20modern%20medical%20research%20environment%20with%20data%20visualization%20displays%20and%20composite%20patient%20generation%20algorithms%2C%20blue%20and%20gold%20accent%20lighting&width=1920&height=1080&seq=composite-hero-bg&orientation=landscape')`
            }}
          ></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center text-white">
              <div className="w-20 h-20 flex items-center justify-center bg-[#d4af37] rounded-full mx-auto mb-8">
                <i className="ri-user-heart-line text-3xl text-white"></i>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">Composite Patient Generator</h1>
              <p className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed mb-8">
                Revolutionary breakthrough in medical research: Transform abundant single-timeslice patient data 
                into longitudinal patient timeseries for advanced algorithm development and validation.
              </p>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl max-w-3xl mx-auto">
                <p className="text-lg text-white/90">
                  <strong>"The Hidden Gift: Methodology independently valuable to medical research, regardless of CHADD validation"</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem We Solved */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#1e3a5f] mb-6">The Medical Research Problem We Solved</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Medical machine learning research faces a fundamental challenge: algorithms need longitudinal data, 
                but only cross-sectional datasets are readily available.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
              <div>
                <h3 className="text-3xl font-bold text-[#1e3a5f] mb-8">Current Medical ML Research Challenges</h3>
                <div className="space-y-6">
                  <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                    <h4 className="font-bold text-red-800 mb-4 flex items-center">
                      <i className="ri-close-circle-line text-red-500 mr-2"></i>
                      What Researchers Need vs. Reality
                    </h4>
                    <ul className="space-y-3 text-red-700">
                      <li className="flex items-start">
                        <i className="ri-arrow-right-line text-red-500 mt-1 mr-2 flex-shrink-0"></i>
                        <strong>Need:</strong> Longitudinal patient data (repeated measurements over time)
                      </li>
                      <li className="flex items-start">
                        <i className="ri-arrow-right-line text-red-500 mt-1 mr-2 flex-shrink-0"></i>
                        <strong>Reality:</strong> Cross-sectional datasets (one snapshot per patient)
                      </li>
                      <li className="flex items-start">
                        <i className="ri-arrow-right-line text-red-500 mt-1 mr-2 flex-shrink-0"></i>
                        <strong>Cost:</strong> Real longitudinal studies take years + millions of dollars
                      </li>
                      <li className="flex items-start">
                        <i className="ri-arrow-right-line text-red-500 mt-1 mr-2 flex-shrink-0"></i>
                        <strong>Privacy:</strong> Can't share real patient timeseries (HIPAA/GDPR)
                      </li>
                      <li className="flex items-start">
                        <i className="ri-arrow-right-line text-red-500 mt-1 mr-2 flex-shrink-0"></i>
                        <strong>Result:</strong> Researchers stuck with inadequate data
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <img
                  src="https://readdy.ai/api/search-image?query=Medical%20researchers%20frustrated%20looking%20at%20computer%20screens%20showing%20limited%20cross-sectional%20patient%20data%2C%20hospital%20research%20environment%20with%20charts%20and%20graphs%20displaying%20single-point%20measurements%2C%20clean%20modern%20medical%20research%20facility%20with%20data%20visualization%20challenges&width=800&height=600&seq=medical-problem&orientation=landscape"
                  alt="Medical Research Data Challenges"
                  title="Medical Research Data Challenges"
                  className="w-full rounded-2xl shadow-2xl object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/20 to-transparent rounded-2xl"></div>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-8 rounded-r-lg">
              <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <i className="ri-check-line text-green-500 mr-3"></i>
                Our Composite Patient Solution
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-green-800 mb-4">Input & Method:</h4>
                  <ul className="space-y-2 text-green-700">
                    <li className="flex items-start">
                      <i className="ri-database-line text-green-500 mt-1 mr-2 flex-shrink-0"></i>
                      Large cross-sectional dataset (cheap, available)
                    </li>
                    <li className="flex items-start">
                      <i className="ri-group-line text-green-500 mt-1 mr-2 flex-shrink-0"></i>
                      Cohort-based matching + temporal assembly
                    </li>
                    <li className="flex items-start">
                      <i className="ri-time-line text-green-500 mt-1 mr-2 flex-shrink-0"></i>
                      Computational processing (minutes, not years)
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-green-800 mb-4">Output & Results:</h4>
                  <ul className="space-y-2 text-green-700">
                    <li className="flex items-start">
                      <i className="ri-line-chart-line text-green-500 mt-1 mr-2 flex-shrink-0"></i>
                      Realistic longitudinal timeseries (privacy-preserved)
                    </li>
                    <li className="flex items-start">
                      <i className="ri-test-tube-line text-green-500 mt-1 mr-2 flex-shrink-0"></i>
                      Testing infrastructure for ANY longitudinal algorithm
                    </li>
                    <li className="flex items-start">
                      <i className="ri-share-line text-green-500 mt-1 mr-2 flex-shrink-0"></i>
                      Fully shareable, HIPAA/GDPR compliant datasets
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Propositions */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#1e3a5f] mb-6">What Makes This Valuable to Medical Science</h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Our Composite Patient Generator solves fundamental problems in medical research infrastructure, 
                enabling breakthrough advances across multiple domains.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="w-16 h-16 flex items-center justify-center bg-blue-600 rounded-full mx-auto mb-6">
                  <i className="ri-flask-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-4 text-center">Algorithm Development Testbed</h3>
                <p className="text-gray-600 text-center mb-6">
                  Researchers building ANY patient monitoring system can use our methodology to test algorithms on realistic data.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Research Teams Developing:</h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Early warning systems for sepsis</li>
                    <li>• ICU deterioration prediction</li>
                    <li>• Chronic disease progression models</li>
                    <li>• Treatment response tracking</li>
                    <li>• Clinical trial enrollment prediction</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Can Use Our Methodology To:</h4>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Test algorithms on realistic data</li>
                    <li>• Iterate rapidly (hours, not years)</li>
                    <li>• Validate before expensive clinical studies</li>
                    <li>• Compare performance across cohorts</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="w-16 h-16 flex items-center justify-center bg-purple-600 rounded-full mx-auto mb-6">
                  <i className="ri-shield-check-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-4 text-center">Privacy-Preserving Synthesis</h3>
                <p className="text-gray-600 text-center mb-6">
                  We've created a legitimate anonymization method that preserves statistical properties while ensuring privacy.
                </p>
                
                <div className="bg-purple-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Original Data Example:</h4>
                  <ul className="space-y-1 text-sm text-purple-700">
                    <li>• Patient #47291 (Female, 27) measured 2024-03-15</li>
                    <li>• Patient #89234 (Female, 28) measured 2024-06-22</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Composite Patient P000123:</h4>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Not traceable to either source patient</li>
                    <li>• Preserves population statistics</li>
                    <li>• Realistic vital correlations</li>
                    <li>• Publishable without IRB restrictions</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="w-16 h-16 flex items-center justify-center bg-green-600 rounded-full mx-auto mb-6">
                  <i className="ri-refresh-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-4 text-center">Reproducible Research Infrastructure</h3>
                <p className="text-gray-600 text-center mb-6">
                  Enable standardized benchmarks and fair algorithm comparisons across the research community.
                </p>
                
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-green-800 text-sm mb-1">Standardized Benchmarks</h5>
                    <p className="text-xs text-green-700">All teams test on same composite dataset</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-blue-800 text-sm mb-1">Fair Comparisons</h5>
                    <p className="text-xs text-blue-700">"Our algorithm beats baseline on 20K composite patients"</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-purple-800 text-sm mb-1">Educational Use</h5>
                    <p className="text-xs text-purple-700">Medical students practice with realistic data</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a70] p-8 rounded-2xl text-white">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Research Impact & Statistics</h3>
                  <p className="text-gray-200 leading-relaxed mb-6">
                    Our Composite Patient Generator has already processed massive datasets, demonstrating 
                    the scalability and effectiveness of our methodology for real-world medical research applications.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-[#d4af37] mb-1">200K+</div>
                      <p className="text-gray-200 text-sm">Individual measurements transformed</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-[#d4af37] mb-1">20K+</div>
                      <p className="text-gray-200 text-sm">Composite patients generated</p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <img
                    src="https://readdy.ai/api/search-image?query=Medical%20research%20data%20visualization%20showing%20transformation%20of%20cross-sectional%20patient%20data%20into%20longitudinal%20timeseries%2C%20advanced%20analytics%20dashboard%20with%20patient%20cohort%20analysis%2C%20clean%20modern%20medical%20informatics%20interface%20with%20statistical%20charts%20and%20graphs&width=600&height=400&seq=research-stats&orientation=landscape"
                    alt="Research Statistics Visualization"
                    title="Research Statistics Visualization"
                    className="w-full rounded-xl shadow-lg object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Publication Opportunity */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#1e3a5f] mb-6">Standalone Publication Opportunity</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                This methodology represents a significant contribution to medical informatics, 
                worthy of publication in top-tier journals regardless of CHADD validation.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6">Proposed Publication</h3>
                <div className="bg-white p-6 rounded-lg border border-blue-200 mb-6">
                  <h4 className="font-bold text-[#1e3a5f] mb-3">Title:</h4>
                  <p className="text-gray-700 italic">
                    "Generating Physiologically Coherent Longitudinal Patient Timeseries from Cross-Sectional 
                    Vital Sign Data: A Cohort-Based Composite Method"
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[#1e3a5f] mb-2">Key Contributions:</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mt-1 mr-2 flex-shrink-0"></i>
                        Cohort-based composite patient generation method
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mt-1 mr-2 flex-shrink-0"></i>
                        Privacy-preserving longitudinal dataset creation
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mt-1 mr-2 flex-shrink-0"></i>
                        Standardized benchmarking infrastructure
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mt-1 mr-2 flex-shrink-0"></i>
                        Reproducible research methodology
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6">Target Journals</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2">Primary Targets:</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <i className="ri-article-line text-[#d4af37] mr-2"></i>
                        JAMIA (Journal of the American Medical Informatics Association)
                      </li>
                      <li className="flex items-center">
                        <i className="ri-article-line text-[#d4af37] mr-2"></i>
                        JMIR Medical Informatics
                      </li>
                      <li className="flex items-center">
                        <i className="ri-article-line text-[#d4af37] mr-2"></i>
                        BMC Medical Research Methodology
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2">Secondary Targets:</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <i className="ri-article-line text-[#d4af37] mr-2"></i>
                        Scientific Data (Nature)
                      </li>
                      <li className="flex items-center">
                        <i className="ri-article-line text-[#d4af37] mr-2"></i>
                        PLOS ONE (methods papers welcome)
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-[#1e3a5f] mb-2">Publication Impact:</h4>
                  <p className="text-gray-700 text-sm">
                    This methodology paper could become a foundational reference for medical ML researchers, 
                    potentially generating significant citations and establishing your team as leaders in 
                    privacy-preserving medical data synthesis.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6 text-center">Paper Structure Overview</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="font-bold text-[#1e3a5f] mb-3">1. Introduction</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Problem: ML needs longitudinal data</li>
                    <li>• Reality: Only cross-sectional available</li>
                    <li>• Your contribution: Hybrid approach</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="font-bold text-[#1e3a5f] mb-3">2. Methods</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Cohort definition criteria</li>
                    <li>• Similarity scoring and clustering</li>
                    <li>• Temporal sequence assembly</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="font-bold text-[#1e3a5f] mb-3">3. Validation</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Statistical tests: Vital distributions</li>
                    <li>• Clinical realism: Variance norms</li>
                    <li>• Privacy analysis: Non-traceability</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="font-bold text-[#1e3a5f] mb-3">4. Use Cases</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Algorithm benchmarking example</li>
                    <li>• Comparative testing demonstration</li>
                    <li>• Educational application</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="font-bold text-[#1e3a5f] mb-3">5. Limitations</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Not true longitudinal</li>
                    <li>• No causal relationships</li>
                    <li>• Appropriate vs inappropriate uses</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="font-bold text-[#1e3a5f] mb-3">6. Code & Data</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• GitHub: methodology tools</li>
                    <li>• Sample dataset: 1000 patients</li>
                    <li>• Reproducible examples</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Research Links */}
        <section className="py-24 bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6]">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-6">Open Science & Research Access</h2>
              <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                All our research, datasets, and methodologies are published openly for peer review, 
                validation, and global collaboration in advancing medical science.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-[#d4af37] rounded-full flex items-center justify-center mb-4 mx-auto">
                    <i className="ri-database-line text-2xl text-white"></i>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-white">Complete Datasets</h3>
                  <p className="text-purple-100 text-sm">
                    200K+ individual measurements, 20K+ composite patients with full documentation
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-[#10b981] rounded-full flex items-center justify-center mb-4 mx-auto">
                    <i className="ri-code-line text-2xl text-white"></i>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-white">Open Algorithms</h3>
                  <p className="text-purple-100 text-sm">
                    Full methodology implementation available for peer review and validation
                  </p>
                </div>
              </div>

              <a 
                href="https://www.kaggle.com/datasets/bryanpersaud/fibonacci-as-cosmic-constant-falsified" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white text-[#7c3aed] px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap text-lg"
              >
                <i className="ri-external-link-line mr-2"></i>
                View Research Papers & Datasets
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[#1e3a5f]">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Medical Research?</h2>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Join the revolution in medical machine learning research. Access our Composite Patient Generator 
                methodology and transform your research capabilities today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/#contact" 
                  className="bg-[#d4af37] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#c19b2f] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Collaborate With Us
                </a>
                <a 
                  href="/chadd-diagnostic-suite" 
                  className="bg-white text-[#1e3a5f] px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Explore CHADD Suite
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}