export default function Innovations() {
  const mainInnovations = [
    {
      title: 'CHADD™ Diagnostic Suite',
      subtitle: 'Revolutionary Universal Diagnostic Algorithm Technology',
      description: 'Advanced diagnostic platform combining behavioral analysis, cognitive assessment, and neurological indicators for comprehensive universal diagnostic evaluation with unprecedented accuracy across multiple domains.',
      features: [
        'Multi-modal assessment integration',
        'Real-time behavioral analysis',
        'Predictive diagnostic algorithms',
        'Clinical decision support'
      ],
      image: 'https://readdy.ai/api/search-image?query=Advanced%20medical%20diagnostic%20interface%20showing%20universal%20diagnostic%20assessment%20data%2C%20modern%20healthcare%20technology%20dashboard%20with%20brain%20activity%20charts%2C%20clean%20blue%20and%20white%20medical%20interface%2C%20professional%20diagnostic%20equipment%2C%20cognitive%20testing%20visualization&width=600&height=400&seq=chadd-diagnostic-001&orientation=landscape',
      link: '/chadd-diagnostic-suite',
      subTools: [
        'Medical Science Suite',
        'Industrial IoT Suite',
        'Energy Grid Suite',
        'Solar Energy Suite',
        'Wind Energy Suite',
        'Nuclear Energy Suite',
        'Aerospace Suite',
        'Business KPI Suite',
        'Financial Risk Management',
        'Credit Risk Management',
        'Personnel Health & Resilience'
      ]
    },
    {
      title: 'Composite Patient Generator™',
      subtitle: 'Advanced Medical Modeling System',
      description: 'Sophisticated patient simulation platform that creates comprehensive virtual patient profiles for research, training, and treatment protocol development.',
      features: [
        'Realistic patient modeling',
        'Scenario-based simulations',
        'Research data integration',
        'Training protocol development'
      ],
      image: 'https://readdy.ai/api/search-image?query=Medical%20simulation%20software%20showing%20virtual%20patient%20data%2C%20advanced%20healthcare%20modeling%20interface%2C%20clinical%20research%20visualization%20with%20patient%20profiles%2C%20modern%20medical%20technology%20dashboard%2C%20clean%20blue%20and%20white%20interface%20design&width=600&height=400&seq=composite-patient-001&orientation=landscape',
      link: '/composite-patient-generator'
    },
    {
      title: 'Rhapsode™ Creative Suite',
      subtitle: 'Revolutionary Creative Paradigm Unifying Art with Science',
      description: 'Groundbreaking creative development environment that treats stories, music, architecture, and dance choreography as Dynamic Entity Relationship Diagrams and systems engineering artifacts, bridging artistic expression with scientific methodology.',
      features: [
        'Dynamic Entity Relationship Diagrams for creative works',
        'Systems engineering approach to artistic creation',
        'Cross-domain creative collaboration tools',
        'Unified art-science development framework'
      ],
      image: 'https://readdy.ai/api/search-image?query=Revolutionary%20creative%20development%20interface%20showing%20entity%20relationship%20diagrams%20for%20artistic%20works%2C%20systems%20engineering%20visualization%20for%20music%20and%20storytelling%2C%20modern%20creative%20workspace%20unifying%20art%20with%20science%2C%20clean%20interface%20with%20artistic%20and%20technical%20elements&width=600&height=400&seq=rhapsode-creative-001&orientation=landscape',
      link: '/rhapsode-creative-suite',
      subTools: [
        'INDE (Integrated Narrative Development Environment)',
        'IMDE (Integrated Music Development Environment)'
      ]
    }
  ];

  const handleLearnMore = (link: string) => {
    window.REACT_APP_NAVIGATE(link);
  };

  return (
    <section id="innovations" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1e3a5f]">
            Our Patent-Pending Innovations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our revolutionary technologies that are transforming medical diagnostics, creative development, and research methodologies
          </p>
        </div>

        <div className="space-y-20">
          {mainInnovations.map((innovation, index) => (
            <div key={index}>
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <h3 className="text-3xl font-bold mb-3 text-[#1e3a5f]">{innovation.title}</h3>
                    <h4 className="text-xl font-semibold mb-6 text-[#d4af37]">{innovation.subtitle}</h4>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                      {innovation.description}
                    </p>
                    
                    <div className="mb-8">
                      <h5 className="text-lg font-semibold mb-4 text-[#1e3a5f]">Key Features:</h5>
                      <ul className="space-y-3">
                        {innovation.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-3">
                            <div className="w-6 h-6 flex items-center justify-center bg-[#d4af37] rounded-full">
                              <i className="ri-check-line text-white text-sm"></i>
                            </div>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {innovation.subTools && (
                      <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                        <h5 className="text-lg font-semibold mb-4 text-[#1e3a5f]">
                          {innovation.title.includes('CHADD') ? 'Domain-Specific Tool Suites:' : 'Components:'}
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {innovation.subTools.map((tool, toolIndex) => (
                            <div key={toolIndex} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-[#d4af37] rounded-full flex-shrink-0"></div>
                              <span className="text-gray-700 text-sm">{tool}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleLearnMore(innovation.link)}
                      className="px-8 py-4 bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="relative">
                    <img 
                      src={innovation.image}
                      alt={`${innovation.title} - ${innovation.subtitle} interface showing advanced technology`}
                      className="rounded-2xl shadow-2xl w-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/20 to-transparent rounded-2xl"></div>
                    <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-[#1e3a5f] font-semibold text-sm">Patent Pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-xl">
            <h3 className="text-3xl font-bold mb-6 text-[#1e3a5f]">
              Transforming Industries Through Innovation
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Our technologies represent years of dedicated research and development, combining cutting-edge science 
              with practical applications to improve outcomes across multiple domains.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-[#d4af37] rounded-full mx-auto mb-4">
                  <i className="ri-microscope-line text-white text-2xl"></i>
                </div>
                <h4 className="text-xl font-semibold mb-2 text-[#1e3a5f]">Research Excellence</h4>
                <p className="text-gray-600">Rigorous scientific methodology drives every innovation</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-[#d4af37] rounded-full mx-auto mb-4">
                  <i className="ri-user-heart-line text-white text-2xl"></i>
                </div>
                <h4 className="text-xl font-semibold mb-2 text-[#1e3a5f]">Real-World Impact</h4>
                <p className="text-gray-600">Practical applications that improve lives and businesses</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-[#d4af37] rounded-full mx-auto mb-4">
                  <i className="ri-global-line text-white text-2xl"></i>
                </div>
                <h4 className="text-xl font-semibold mb-2 text-[#1e3a5f]">Global Reach</h4>
                <p className="text-gray-600">Accessible solutions for worldwide implementation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
