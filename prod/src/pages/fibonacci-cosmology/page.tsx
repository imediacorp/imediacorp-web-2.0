
import { useEffect } from 'react';

export default function FibonacciCosmologyPage() {
  useEffect(() => {
    document.title = 'Fibonacci Cosmology Research | iMediaCorp Scientific Cooperative';
  }, []);

  const researchHighlights = [
    {
      title: 'Paper 1: Falsified Background Model',
      description: 'Tests φ-recursion in the scale factor',
      results: [
        'Result: RULED OUT (Δχ² = 1364)',
        'H₀ = 12.37 km/s/Mpc (should be ~68)',
        'Λ is 15 orders of magnitude too large'
      ],
      icon: 'ri-close-circle-line',
      color: 'text-red-600'
    },
    {
      title: 'Paper 2: Testable Perturbation Model',
      description: 'Proposes log-periodic oscillations in structure formation',
      results: [
        'Predictions: Sub-BAO wiggles in P(k)',
        'CMB acoustic peaks detectable',
        'Observable by DESI Y6 (2026), Euclid (2027), CMB-S4 (2030)'
      ],
      icon: 'ri-checkbox-circle-line',
      color: 'text-green-600'
    }
  ];

  const datasets = [
    { name: 'Planck CMB Data', description: 'Cosmic Microwave Background observations', icon: 'ri-global-line' },
    { name: 'Cosmic Chronometers', description: 'Age measurements of cosmic objects', icon: 'ri-time-line' },
    { name: 'SDSS P(k)', description: 'Power spectrum from Sloan Digital Sky Survey', icon: 'ri-bar-chart-line' },
    { name: 'Python Analysis Scripts', description: 'Complete computational methodology', icon: 'ri-code-line' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://readdy.ai/api/search-image?query=Abstract%20cosmic%20background%20with%20golden%20ratio%20spiral%20patterns%2C%20fibonacci%20sequences%20overlaid%20on%20deep%20space%20imagery%20with%20galaxies%20and%20cosmic%20microwave%20background%20radiation%2C%20mathematical%20formulas%20floating%20in%20space%2C%20purple%20and%20gold%20color%20scheme%20representing%20the%20intersection%20of%20mathematics%20and%20cosmology&width=1920&height=1080&seq=fibonacci-cosmos-hero&orientation=landscape')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-8">
              <i className="ri-planet-line text-4xl text-white"></i>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Fibonacci Cosmology Research
            </h1>
            <p className="text-2xl text-purple-100 mb-8">
              Testing φ-recursion in Cosmic Expansion and Structure Formation
            </p>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
              Groundbreaking research investigating whether the Golden Ratio (φ = 1.618…) appears in cosmological models, 
              with rigorous testing of both background and perturbation theories using real observational data.
            </p>
          </div>
        </div>
      </section>

      {/* Research Overview */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#1e3a8a] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Research Overview
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Two comprehensive papers testing whether the Golden Ratio appears in cosmology through 
                falsified background models and testable perturbation theories.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {researchHighlights.map((paper, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                      <i className={`${paper.icon} text-2xl ${paper.color}`}></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#1e3a8a]">{paper.title}</h3>
                      <p className="text-gray-600">{paper.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {paper.results.map((result, resultIndex) => (
                      <div key={resultIndex} className="flex items-start">
                        <i className="ri-arrow-right-s-line text-[#d4af37] mt-1 mr-2"></i>
                        <span className="text-gray-700">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Key Findings */}
            <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] rounded-3xl p-12 text-white mb-16">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Key Scientific Findings
                </h3>
                <p className="text-blue-100 max-w-3xl mx-auto">
                  Our research provides definitive results on the role of the Golden Ratio in cosmological models
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-close-line text-3xl text-white"></i>
                  </div>
                  <h4 className="text-xl font-bold mb-3">Background Model Falsified</h4>
                  <p className="text-blue-100">
                    φ-recursion in scale factor ruled out with Δχ² = 1364, demonstrating the model's incompatibility with observations
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-telescope-line text-3xl text-white"></i>
                  </div>
                  <h4 className="text-xl font-bold mb-3">Testable Predictions</h4>
                  <p className="text-blue-100">
                    Perturbation model generates specific predictions observable by upcoming surveys like DESI Y6 and Euclid
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-database-line text-3xl text-white"></i>
                  </div>
                  <h4 className="text-xl font-bold mb-3">Open Science</h4>
                  <p className="text-blue-100">
                    All data, code, and methodologies published openly for peer review and independent verification
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Datasets & Methodology */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#1e3a8a] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Datasets & Methodology
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Our research utilizes real observational data from leading astronomical surveys and 
                provides complete computational methodology for reproducibility.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {datasets.map((dataset, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="w-12 h-12 bg-[#7c3aed] rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`${dataset.icon} text-xl text-white`}></i>
                  </div>
                  <h4 className="text-lg font-bold text-[#1e3a8a] mb-2">{dataset.name}</h4>
                  <p className="text-gray-600 text-sm">{dataset.description}</p>
                </div>
              ))}
            </div>

            {/* Research Access */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-[#7c3aed] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-external-link-line text-2xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#1e3a8a] mb-4">
                Access Complete Research
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                View the complete research papers, datasets, Python analysis scripts, and detailed methodology 
                on Kaggle. All materials are available under Creative Commons licensing for open science collaboration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://www.kaggle.com/datasets/bryanpersaud/fibonacci-as-cosmic-constant-falsified" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-[#7c3aed] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#6d28d9] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-external-link-line mr-2"></i>
                  View on Kaggle
                </a>
                <a 
                  href="https://github.com/imediacorp/fibonacci-cosmology" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-[#1e3a8a] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#1e40af] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-github-line mr-2"></i>
                  GitHub Repository
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Research */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#1e3a8a] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Future Observations
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Our testable perturbation model will be validated or falsified by upcoming astronomical surveys
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-[#7c3aed] to-[#8b5cf6] rounded-xl p-6 text-white">
                <h4 className="text-xl font-bold mb-2">DESI Y6 (2026)</h4>
                <p className="text-purple-100">Dark Energy Spectroscopic Instrument will test our P(k) predictions</p>
              </div>
              <div className="bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-xl p-6 text-white">
                <h4 className="text-xl font-bold mb-2">Euclid (2027)</h4>
                <p className="text-blue-100">European space telescope will provide high-precision structure formation data</p>
              </div>
              <div className="bg-gradient-to-br from-[#d4af37] to-[#f59e0b] rounded-xl p-6 text-white">
                <h4 className="text-xl font-bold mb-2">CMB-S4 (2030)</h4>
                <p className="text-yellow-100">Next-generation CMB observations will test acoustic peak predictions</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
