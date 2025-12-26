
export default function ScientificIntegrity() {
  const principles = [
    {
      title: 'Falsifiability',
      description: 'Every hypothesis and claim we make is designed to be testable and potentially disprovable, following Karl Popper\'s scientific method.',
      icon: 'ri-test-tube-line',
      color: 'bg-[#1e3a8a]',
      examples: [
        'Testable hypotheses',
        'Clear success/failure criteria',
        'Peer review processes',
        'Independent verification'
      ]
    },
    {
      title: 'Reproducibility',
      description: 'All our research and innovations include complete documentation, datasets, and methodologies for independent replication.',
      icon: 'ri-repeat-line',
      color: 'bg-[#10b981]',
      examples: [
        'Complete documentation',
        'Open-source algorithms',
        'Standardized protocols',
        'Version-controlled datasets'
      ]
    },
    {
      title: 'Transparency',
      description: 'We publish all results, positive and negative, with full disclosure of methodologies, limitations, and potential conflicts.',
      icon: 'ri-eye-line',
      color: 'bg-[#8b5cf6]',
      examples: [
        'Open publication policy',
        'Negative results included',
        'Methodology disclosure',
        'Conflict of interest statements'
      ]
    }
  ];

  return (
    <section id="scientific-integrity" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-[#1e3a8a] rounded-full flex items-center justify-center mr-4">
                <i className="ri-microscope-line text-3xl text-white"></i>
              </div>
              <h2 className="text-4xl font-bold text-[#1e3a8a]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Scientific Integrity
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our commitment to rigorous scientific methodology ensures that every innovation is built on solid, verifiable foundations.
            </p>
          </div>

          {/* No Hype Promise */}
          <div className="bg-gradient-to-r from-[#10b981] to-[#059669] rounded-3xl p-12 text-white mb-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-shield-check-line text-4xl"></i>
              </div>
              <h3 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                No Hype, No Cherry-Picked Data
              </h3>
              <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                We reject the culture of exaggerated claims and selective reporting. Every result we publish represents 
                the complete picture — successes, failures, and everything in between.
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <i className="ri-bar-chart-line text-3xl mb-4 block"></i>
                  <h4 className="font-semibold mb-2">Complete Data</h4>
                  <p className="text-green-100 text-sm">
                    All data points included, not just favorable results
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <i className="ri-error-warning-line text-3xl mb-4 block"></i>
                  <h4 className="font-semibold mb-2">Honest Limitations</h4>
                  <p className="text-green-100 text-sm">
                    Clear documentation of constraints and boundaries
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <i className="ri-medal-line text-3xl mb-4 block"></i>
                  <h4 className="font-semibold mb-2">Earned Claims</h4>
                  <p className="text-green-100 text-sm">
                    Every assertion backed by verifiable evidence
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scientific Principles */}
          <div className="space-y-12">
            {principles.map((principle, index) => (
              <div key={index} className={`relative overflow-hidden rounded-3xl ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex flex-col lg:flex`}>
                <div className="lg:w-2/3 bg-white p-12 flex flex-col justify-center shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 ${principle.color} rounded-full flex items-center justify-center mr-4`}>
                      <i className={`${principle.icon} text-2xl text-white`}></i>
                    </div>
                    <h3 className="text-3xl font-bold text-[#1e3a8a]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {principle.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                    {principle.description}
                  </p>

                  <div>
                    <h4 className="font-semibold text-[#1e3a8a] mb-4">Implementation:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {principle.examples.map((example, exampleIndex) => (
                        <div key={exampleIndex} className="flex items-center">
                          <i className="ri-checkbox-circle-line text-[#10b981] mr-3"></i>
                          <span className="text-gray-600">{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={`lg:w-1/3 ${principle.color} p-12 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
                  </div>
                  <div className="relative z-10 text-center text-white">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                      <i className={`${principle.icon} text-4xl`}></i>
                    </div>
                    <h4 className="text-2xl font-bold">{principle.title}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Open Science Repository */}
          <div className="mt-20 bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] rounded-3xl p-12 text-white">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Open Science Repository
              </h3>
              <p className="text-blue-100 max-w-3xl mx-auto">
                Access our complete research archive — datasets, algorithms, methodologies, and artifacts — 
                freely available to the global scientific community.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                <div className="w-12 h-12 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-database-2-line text-2xl text-white"></i>
                </div>
                <h4 className="font-semibold mb-2">Datasets</h4>
                <p className="text-blue-100 text-sm">
                  Complete research datasets with metadata
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                <div className="w-12 h-12 bg-[#10b981] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-code-s-slash-line text-2xl text-white"></i>
                </div>
                <h4 className="font-semibold mb-2">Algorithms</h4>
                <p className="text-blue-100 text-sm">
                  Open-source implementations and documentation
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                <div className="w-12 h-12 bg-[#8b5cf6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-file-text-line text-2xl text-white"></i>
                </div>
                <h4 className="font-semibold mb-2">Publications</h4>
                <p className="text-blue-100 text-sm">
                  Peer-reviewed papers and research findings
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                <div className="w-12 h-12 bg-[#f59e0b] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-tools-line text-2xl text-white"></i>
                </div>
                <h4 className="font-semibold mb-2">Artifacts</h4>
                <p className="text-blue-100 text-sm">
                  Research tools and experimental setups
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <button className="bg-[#d4af37] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#c19b2f] transition-colors cursor-pointer">
                Access Repository
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
