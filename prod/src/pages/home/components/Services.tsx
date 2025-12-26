
export default function Services() {
  const commercialSuites = [
    {
      title: 'Medical Science Suite',
      icon: 'ri-heart-pulse-line',
      description: 'CHADD-powered diagnostic and analytical tools for medical research and clinical applications',
      applications: [
        'Advanced diagnostic protocols',
        'Clinical decision support systems',
        'Medical research analytics',
        'Patient outcome prediction'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Industrial IoT Suite',
      icon: 'ri-settings-4-line',
      description: 'Comprehensive IoT monitoring and predictive maintenance using CHADD methodology',
      applications: [
        'Sensor network optimization',
        'Predictive maintenance protocols',
        'Manufacturing intelligence',
        'Supply chain analytics'
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Energy Grid Suite',
      icon: 'ri-flashlight-line',
      description: 'Smart grid management and optimization powered by CHADD algorithms',
      applications: [
        'Grid stability monitoring',
        'Load balancing optimization',
        'Fault prediction systems',
        'Energy distribution analytics'
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Solar Energy Suite',
      icon: 'ri-sun-line',
      description: 'Solar energy forecasting and optimization using CHADD protocols',
      applications: [
        'Solar irradiance prediction',
        'Panel performance optimization',
        'Energy yield forecasting',
        'Maintenance scheduling'
      ],
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Wind Energy Suite',
      icon: 'ri-windy-line',
      description: 'Wind energy prediction and turbine optimization with CHADD methodology',
      applications: [
        'Wind pattern analysis',
        'Turbine performance optimization',
        'Energy output forecasting',
        'Predictive maintenance'
      ],
      color: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Nuclear Energy Suite',
      icon: 'ri-radioactive-line',
      description: 'Nuclear facility monitoring and safety protocols using CHADD algorithms',
      applications: [
        'Reactor monitoring systems',
        'Safety protocol optimization',
        'Predictive maintenance',
        'Risk assessment analytics'
      ],
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Aerospace Suite',
      icon: 'ri-rocket-line',
      description: 'Aerospace systems monitoring and optimization with CHADD protocols',
      applications: [
        'Flight system diagnostics',
        'Performance optimization',
        'Predictive maintenance',
        'Mission planning analytics'
      ],
      color: 'from-indigo-500 to-purple-600'
    },
    {
      title: 'Business KPI Suite',
      icon: 'ri-line-chart-line',
      description: 'Comprehensive business intelligence and KPI optimization using CHADD methodology',
      applications: [
        'Performance metrics analysis',
        'Strategic planning support',
        'Operational optimization',
        'Competitive intelligence'
      ],
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Financial Risk Management',
      icon: 'ri-funds-line',
      description: 'Advanced financial risk assessment and management with CHADD algorithms',
      applications: [
        'Market risk analysis',
        'Portfolio optimization',
        'Regulatory compliance',
        'Investment strategy support'
      ],
      color: 'from-amber-500 to-orange-600'
    },
    {
      title: 'Credit Risk Management',
      icon: 'ri-bank-line',
      description: 'Credit risk assessment and management using CHADD protocols',
      applications: [
        'Credit scoring models',
        'Default prediction',
        'Portfolio risk assessment',
        'Regulatory reporting'
      ],
      color: 'from-slate-500 to-gray-600'
    },
    {
      title: 'Personnel Health & Resilience',
      icon: 'ri-team-line',
      description: 'Employee wellness and organizational resilience with CHADD methodology',
      applications: [
        'Wellness monitoring',
        'Performance optimization',
        'Stress prediction',
        'Team dynamics analysis'
      ],
      color: 'from-rose-500 to-pink-600'
    }
  ];

  const academicModules = [
    {
      title: 'Geophysical Module',
      description: 'Advanced geophysical analysis and environmental monitoring',
      icon: 'ri-earth-line',
      applications: [
        'Seismic activity analysis',
        'Environmental impact assessment',
        'Climate pattern recognition',
        'Natural disaster prediction'
      ]
    },
    {
      title: 'Cliodynamics Module',
      description: 'Historical pattern analysis and societal trend prediction',
      icon: 'ri-time-line',
      applications: [
        'Historical data analysis',
        'Societal trend prediction',
        'Cultural pattern recognition',
        'Policy impact assessment'
      ]
    }
  ];

  const businessScales = [
    {
      title: 'Small & Medium Enterprises',
      description: 'Tailored CHADD integration for growing businesses',
      features: ['Scalable implementation', 'Cost-effective solutions', 'Rapid deployment', 'Essential analytics'],
      icon: 'ri-building-2-line'
    },
    {
      title: 'Large Enterprises',
      description: 'Comprehensive CHADD methodology integration for complex organizations',
      features: ['Full-scale deployment', 'Custom integration', 'Advanced analytics', 'Enterprise support'],
      icon: 'ri-building-4-line'
    }
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1e3a5f]">
            CHADD Methodology & Tool Suites
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Integrating CHADD tools, methodology, and philosophy into your business. 
            Our domain-specific tool suites provide comprehensive solutions from SMEs to large enterprises.
          </p>
        </div>

        {/* CHADD Methodology Overview */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a70] rounded-3xl p-12 mb-20 text-white">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">CHADD: The Foundation</h3>
              <p className="text-gray-200 text-lg leading-relaxed mb-8">
                Our CHADD mathematics, protocols, and methodology drive domain-specific products and services. 
                We integrate these tools, methodology, and philosophy into businesses of all sizes, 
                providing scalable solutions that adapt to your specific needs and industry requirements.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[#d4af37] mb-1">11</div>
                  <p className="text-gray-200 text-sm">Commercial Suites</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[#d4af37] mb-1">2</div>
                  <p className="text-gray-200 text-sm">Academic Modules</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[#d4af37] mb-1">∞</div>
                  <p className="text-gray-200 text-sm">Business Scales</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 flex items-center justify-center bg-[#d4af37] rounded-full mx-auto mb-6">
                <i className="ri-scales-3-line text-4xl text-white"></i>
              </div>
              <p className="text-gray-300 text-lg">
                CHADD methodology transcends traditional boundaries
              </p>
            </div>
          </div>
        </div>

        {/* Commercial Product Suites */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-[#1e3a5f]">Commercial Tool Suites</h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Domain-specific tool suites powered by CHADD methodology for comprehensive business integration
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {commercialSuites.map((suite, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${suite.color}`}></div>
                <div className="p-8">
                  <div className={`w-16 h-16 flex items-center justify-center bg-gradient-to-r ${suite.color} rounded-full mb-6`}>
                    <i className={`${suite.icon} text-2xl text-white`}></i>
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-[#1e3a5f]">{suite.title}</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm">{suite.description}</p>
                  
                  <div className="space-y-2">
                    {suite.applications.map((app, appIndex) => (
                      <div key={appIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{app}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Applications */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-[#1e3a5f]">Academic Applications</h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Specialized modules for academic research and advanced scientific applications
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {academicModules.map((module, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg">
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-[#1e3a5f] to-[#2a4a70] rounded-full mb-6">
                  <i className={`${module.icon} text-2xl text-white`}></i>
                </div>
                <h4 className="text-2xl font-bold text-[#1e3a5f] mb-4">{module.title}</h4>
                <p className="text-gray-600 mb-6">{module.description}</p>
                
                <div className="space-y-3">
                  {module.applications.map((app, appIndex) => (
                    <div key={appIndex} className="flex items-start">
                      <i className="ri-check-line text-green-500 mt-1 mr-2 flex-shrink-0"></i>
                      <span className="text-gray-700 text-sm">{app}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Scale Integration */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-[#1e3a5f]">Scalable Business Integration</h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              CHADD methodology integration tailored to your business size and complexity
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {businessScales.map((scale, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-[#d4af37] to-[#f4d03f] rounded-full mb-6">
                  <i className={`${scale.icon} text-2xl text-white`}></i>
                </div>
                <h4 className="text-2xl font-bold text-[#1e3a5f] mb-4">{scale.title}</h4>
                <p className="text-gray-600 mb-6">{scale.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  {scale.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <i className="ri-check-line text-green-500 mr-2 flex-shrink-0"></i>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
