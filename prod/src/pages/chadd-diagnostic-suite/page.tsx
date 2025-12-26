
import Navigation from '../../components/feature/Navigation';
import Footer from '../../components/feature/Footer';

export default function CHADDDiagnosticSuite() {
  const applications = [
    {
      title: 'Medical Diagnostics',
      description: 'Revolutionary Universal Diagnostic Algorithm for Healthcare',
      icon: 'ri-health-book-line',
      image: 'https://readdy.ai/api/search-image?query=Modern%20medical%20diagnostic%20center%20with%20advanced%20monitoring%20equipment%2C%20AI-powered%20diagnostic%20displays%20showing%20patient%20data%20analysis%2C%20clean%20white%20medical%20environment%20with%20sophisticated%20diagnostic%20tools%2C%20healthcare%20professionals%20using%20tablet%20interfaces%20with%20predictive%20health%20analytics%20and%20comprehensive%20patient%20monitoring%20systems&width=800&height=500&seq=chadd-medical&orientation=landscape',
      features: ['Comprehensive patient analysis', 'Predictive health insights', 'Multi-system diagnostics', 'Treatment recommendation engine', 'Clinical decision support']
    },
    {
      title: 'IT Network Monitoring',
      description: 'Predictive Fault Analysis & AI-Assisted Intelligence',
      icon: 'ri-radar-line',
      image: 'https://readdy.ai/api/search-image?query=Advanced%20network%20operations%20center%20with%20multiple%20monitors%20displaying%20real-time%20network%20topology%20diagrams%2C%20predictive%20analytics%20dashboards%2C%20and%20AI-powered%20fault%20detection%20systems.%20Clean%2C%20high-tech%20environment%20with%20blue%20and%20gold%20accent%20lighting%2C%20professional%20monitoring%20setup%20with%20advanced%20visualization%20tools%20showing%20network%20health%20metrics%20and%20predictive%20alerts&width=800&height=500&seq=chadd-network&orientation=landscape',
      features: ['Real-time network topology mapping', 'Predictive fault analysis', 'DoS attack scenario modeling', 'Infrastructure failure prediction', 'AI-assisted remediation recommendations']
    },
    {
      title: 'Energy Systems',
      description: 'Grid/Solar/Wind/Nuclear Optimization',
      icon: 'ri-flashlight-line',
      image: 'https://readdy.ai/api/search-image?query=Modern%20renewable%20energy%20control%20center%20with%20solar%20and%20wind%20farm%20monitoring%20displays%2C%20smart%20grid%20management%20systems%2C%20nuclear%20facility%20monitoring%2C%20clean%20energy%20facility%20with%20advanced%20control%20panels%20showing%20real-time%20energy%20production%20analytics%2C%20predictive%20weather%20integration%20and%20grid%20optimization%20dashboards&width=800&height=500&seq=chadd-energy&orientation=landscape',
      features: ['Grid stability monitoring', 'Renewable energy forecasting', 'Nuclear facility diagnostics', 'Load balancing optimization', 'Weather impact analysis', 'Energy storage management']
    },
    {
      title: 'Industrial IoT',
      description: 'Smart Manufacturing & Predictive Maintenance',
      icon: 'ri-settings-4-line',
      image: 'https://readdy.ai/api/search-image?query=Smart%20manufacturing%20facility%20with%20IoT%20sensors%2C%20predictive%20maintenance%20dashboards%2C%20industrial%20equipment%20monitoring%20systems%2C%20clean%20modern%20factory%20floor%20with%20advanced%20automation%2C%20real-time%20data%20visualization%20screens%20showing%20equipment%20health%20and%20predictive%20analytics%20for%20manufacturing%20optimization&width=800&height=500&seq=chadd-industrial&orientation=landscape',
      features: ['Equipment performance monitoring', 'Predictive maintenance scheduling', 'Production optimization', 'Quality control analytics', 'Supply chain intelligence']
    },
    {
      title: 'Financial Risk Management',
      description: 'Market & Credit Risk Analysis',
      icon: 'ri-shield-check-line',
      image: 'https://readdy.ai/api/search-image?query=Professional%20financial%20risk%20management%20center%20with%20multiple%20screens%20displaying%20risk%20analytics%20dashboards%2C%20VaR%20calculations%2C%20stress%20testing%20results%2C%20clean%20modern%20office%20environment%20with%20advanced%20financial%20modeling%20tools%20and%20real-time%20market%20data%20visualization%20systems&width=800&height=500&seq=chadd-risk&orientation=landscape',
      features: ['Value-at-Risk calculations', 'Credit risk assessment', 'Market volatility analysis', 'Portfolio optimization', 'Regulatory compliance monitoring', 'Real-time risk alerts']
    },
    {
      title: 'Geophysical Systems',
      description: 'Environmental & Earth Sciences Monitoring',
      icon: 'ri-earth-line',
      image: 'https://readdy.ai/api/search-image?query=Advanced%20geophysical%20monitoring%20center%20with%20seismic%20activity%20displays%2C%20environmental%20monitoring%20systems%2C%20earth%20sciences%20research%20facility%20with%20sophisticated%20geological%20analysis%20tools%2C%20clean%20scientific%20environment%20with%20real-time%20environmental%20data%20visualization%20and%20predictive%20earth%20systems%20modeling&width=800&height=500&seq=chadd-geophysical&orientation=landscape',
      features: ['Seismic activity monitoring', 'Climate pattern analysis', 'Environmental impact assessment', 'Natural disaster prediction', 'Geological stability analysis']
    }
  ];

  const emergingApplications = [
    {
      title: 'Quantum Computing Diagnostics',
      description: 'Quantum system stability and error prediction',
      icon: 'ri-cpu-line'
    },
    {
      title: 'Fusion Reactor Monitoring',
      description: 'Plasma stability and containment analysis',
      icon: 'ri-fire-line'
    },
    {
      title: 'Cliodynamics Research',
      description: 'Historical pattern analysis and societal trends',
      icon: 'ri-time-line'
    },
    {
      title: 'Business Health Analytics',
      description: 'Organizational performance and market intelligence',
      icon: 'ri-building-line'
    }
  ];

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
              backgroundImage: `url('https://readdy.ai/api/search-image?query=Abstract%20technological%20background%20with%20interconnected%20diagnostic%20systems%2C%20neural%20network%20patterns%2C%20data%20flow%20visualization%2C%20clean%20modern%20design%20with%20blue%20and%20gold%20accents%20representing%20universal%20diagnostic%20algorithms%20and%20AI-powered%20analysis&width=1920&height=1080&seq=chadd-hero-bg&orientation=landscape')`
            }}
          ></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center text-white">
              <div className="w-20 h-20 flex items-center justify-center bg-[#d4af37] rounded-full mx-auto mb-8">
                <i className="ri-cpu-line text-3xl text-white"></i>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">CHADD Diagnostic Suite</h1>
              <p className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed mb-8">
                Comprehensive Harmonic Autonomous Dual Probe Diagnostic - The Revolutionary Universal Algorithm 
                that provides AI-assisted actionable intelligence across infinite domains
              </p>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl max-w-3xl mx-auto">
                <p className="text-lg text-white/90">
                  <strong>"What happens if there's a DoS attack? A transformer drops? A market crash? CHADD will tell you."</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Technology */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#1e3a5f] mb-6">Revolutionary Universal Diagnostic Algorithm</h2>
              <p className="text-gray-600 max-w-4xl mx-auto text-lg leading-relaxed">
                CHADD represents a breakthrough in diagnostic technology - one algorithm that works across 
                every domain, providing consistent, reliable insights whether you're monitoring network 
                infrastructure, medical patients, financial markets, or industrial equipment.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-gradient-to-br from-[#f8f9fa] to-white p-8 rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-[#1e3a5f] rounded-full mx-auto mb-6">
                  <i className="ri-eye-line text-2xl text-[#d4af37]"></i>
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">Real-Time Monitoring</h3>
                <p className="text-gray-600">Continuous system observation with advanced data collection and analysis across any domain</p>
              </div>
              <div className="bg-gradient-to-br from-[#f8f9fa] to-white p-8 rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-[#d4af37] rounded-full mx-auto mb-6">
                  <i className="ri-brain-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">Predictive Analysis</h3>
                <p className="text-gray-600">AI-powered forecasting and scenario modeling for proactive decision making</p>
              </div>
              <div className="bg-gradient-to-br from-[#f8f9fa] to-white p-8 rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-[#1e3a5f] rounded-full mx-auto mb-6">
                  <i className="ri-lightbulb-line text-2xl text-[#d4af37]"></i>
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">Actionable Intelligence</h3>
                <p className="text-gray-600">Clear recommendations and next-step guidance at the touch of a button</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a70] p-8 rounded-2xl text-white">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">The Science Behind CHADD</h3>
                  <p className="text-gray-200 leading-relaxed mb-6">
                    Built on breakthrough research combining music theory (Rondo form A-B-A-C-A), 
                    dynamic modeling, financial risk analysis (VaR), and systems theory. This unique 
                    synthesis enables universal application across any domain.
                  </p>
                  <ul className="space-y-2 text-gray-200">
                    <li className="flex items-start">
                      <i className="ri-check-line text-[#d4af37] mt-1 mr-2 flex-shrink-0"></i>
                      Harmonic resonance pattern analysis
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-[#d4af37] mt-1 mr-2 flex-shrink-0"></i>
                      Lyapunov stability analysis
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-[#d4af37] mt-1 mr-2 flex-shrink-0"></i>
                      Cross-domain state mapping
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 flex items-center justify-center bg-[#d4af37] rounded-full mx-auto mb-4">
                    <i className="ri-scales-3-line text-4xl text-white"></i>
                  </div>
                  <p className="text-sm text-gray-300">
                    Universal Algorithm<br/>
                    Infinite Applications
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Applications */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#1e3a5f] mb-6">CHADD Applications</h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                One algorithm, infinite possibilities. Explore how CHADD transforms industries 
                through predictive intelligence and actionable insights.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-20">
              {applications.map((app, index) => (
                <article key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={app.image}
                      alt={app.title}
                      title={app.title}
                      className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-[#d4af37] rounded-full">
                        <i className={`${app.icon} text-xl text-white`}></i>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-[#1e3a5f] mb-2">{app.title}</h3>
                    <p className="text-[#d4af37] font-medium mb-4">{app.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-[#1e3a5f] mb-3">Key Features:</h4>
                      <ul className="space-y-2">
                        {app.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600">
                            <i className="ri-check-line text-[#d4af37] mt-1 mr-2 flex-shrink-0"></i>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-[#1e3a5f]/5 to-[#d4af37]/5 p-4 rounded-lg">
                      <div className="flex items-center">
                        <i className="ri-lightbulb-line text-[#d4af37] mr-2"></i>
                        <span className="text-sm font-semibold text-[#1e3a5f]">AI-Assisted Intelligence Available</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Emerging Applications */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#1e3a5f] mb-4">Emerging Applications</h3>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Pioneering applications in cutting-edge technologies and interdisciplinary research
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {emergingApplications.map((app, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-lg text-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-[#d4af37] to-[#f4d03f] rounded-full mx-auto mb-4">
                      <i className={`${app.icon} text-2xl text-white`}></i>
                    </div>
                    <h4 className="text-lg font-bold text-[#1e3a5f] mb-3">{app.title}</h4>
                    <p className="text-gray-600 text-sm">{app.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Composite Patient Generator */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#d4af37] rounded-full mx-auto mb-8">
                <i className="ri-user-heart-line text-3xl text-white"></i>
              </div>
              <h2 className="text-4xl font-bold text-[#1e3a5f] mb-6">Composite Patient Generator</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Revolutionary breakthrough in medical research: Transform abundant single-timeslice patient data 
                into longitudinal patient timeseries for advanced algorithm development and validation.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
              <div>
                <h3 className="text-3xl font-bold text-[#1e3a5f] mb-6">The Medical Research Problem We Solved</h3>
                <div className="space-y-6">
                  <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                    <h4 className="font-bold text-red-800 mb-2">Current Medical ML Research Challenges:</h4>
                    <ul className="space-y-2 text-red-700">
                      <li className="flex items-start">
                        <i className="ri-close-circle-line text-red-500 mt-1 mr-2 flex-shrink-0"></i>
                        Needs longitudinal data, only cross-sectional available
                      </li>
                      <li className="flex items-start">
                        <i className="ri-close-circle-line text-red-500 mt-1 mr-2 flex-shrink-0"></i>
                        Real longitudinal studies cost millions + take years
                      </li>
                      <li className="flex items-start">
                        <i className="ri-close-circle-line text-red-500 mt-1 mr-2 flex-shrink-0"></i>
                        Privacy restrictions prevent data sharing
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                    <h4 className="font-bold text-green-800 mb-2">Our Composite Patient Solution:</h4>
                    <ul className="space-y-2 text-green-700">
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mt-1 mr-2 flex-shrink-0"></i>
                        Transform cross-sectional data into realistic timeseries
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mt-1 mr-2 flex-shrink-0"></i>
                        Generate results in minutes, not years
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mt-1 mr-2 flex-shrink-0"></i>
                        Privacy-preserved, fully shareable datasets
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <img
                  src="https://readdy.ai/api/search-image?query=Advanced%20medical%20research%20laboratory%20with%20scientists%20analyzing%20patient%20data%20on%20multiple%20screens%2C%20showing%20transformation%20of%20cross-sectional%20medical%20data%20into%20longitudinal%20timeseries%2C%20clean%20modern%20medical%20research%20environment%20with%20data%20visualization%20displays%20and%20composite%20patient%20generation%20algorithms&width=800&height=600&seq=composite-patient-lab&orientation=landscape"
                  alt="Composite Patient Generator Technology"
                  title="Composite Patient Generator Technology"
                  className="w-full rounded-2xl shadow-2xl object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/20 to-transparent rounded-2xl"></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a70] p-8 rounded-2xl text-white">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">The Hidden Gift: Methodology Value</h3>
                  <p className="text-gray-200 leading-relaxed mb-6">
                    Our Composite Patient Generator is independently valuable to medical research, 
                    regardless of CHADD validation. This breakthrough methodology solves a fundamental 
                    problem in medical machine learning research.
                  </p>
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg mb-6">
                    <h4 className="font-semibold text-[#d4af37] mb-2">Research Applications:</h4>
                    <ul className="space-y-1 text-sm text-gray-200">
                      <li>• Early warning systems for sepsis</li>
                      <li>• ICU deterioration prediction</li>
                      <li>• Treatment response tracking</li>
                      <li>• Clinical trial enrollment prediction</li>
                    </ul>
                  </div>
                  <a 
                    href="https://www.kaggle.com/datasets/bryanpersaud/fibonacci-as-cosmic-constant-falsified" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-[#d4af37] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#c19b2f] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-external-link-line mr-2"></i>
                    View Research Papers
                  </a>
                </div>
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
                    <div className="text-4xl font-bold text-[#d4af37] mb-2">200K+</div>
                    <p className="text-gray-200 text-sm mb-4">Individual measurements transformed</p>
                    <div className="text-4xl font-bold text-[#d4af37] mb-2">20K+</div>
                    <p className="text-gray-200 text-sm mb-4">Composite patients generated</p>
                    <div className="text-4xl font-bold text-[#d4af37] mb-2">3-7</div>
                    <p className="text-gray-200 text-sm">Measurements per patient</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[#1e3a5f]">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Operations?</h2>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Discover how CHADD can provide AI-assisted actionable intelligence for your specific domain. 
                Get predictive insights and know what happens before it happens.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/#contact" 
                  className="bg-[#d4af37] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#c19b2f] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Schedule Consultation
                </a>
                <a 
                  href="/#services" 
                  className="bg-white text-[#1e3a5f] px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  View All Services
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
