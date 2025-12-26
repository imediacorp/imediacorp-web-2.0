import Navigation from '../../components/feature/Navigation';
import Footer from '../../components/feature/Footer';

export default function ServicesPage() {
  const consultingServices = [
    {
      title: 'CHADD Methodology Integration',
      icon: 'ri-scales-3-line',
      description: 'Comprehensive integration of CHADD mathematics, protocols, and philosophy into your business environment. We work with you to map your domain-specific needs to SQUD (System Quality Under Diagnosis) frameworks.',
      deliverables: [
        'Domain-specific mapping to SQUD',
        'Custom CHADD protocol implementation',
        'Staff training and knowledge transfer',
        'Ongoing methodology support'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Enterprise Tool Suite Deployment',
      icon: 'ri-tools-line',
      description: 'End-to-end deployment of CHADD tool suites tailored to your industry. From initial assessment to full production deployment, we ensure seamless integration with your existing systems.',
      deliverables: [
        'Infrastructure assessment and planning',
        'Custom tool configuration',
        'System integration and testing',
        'Production deployment and monitoring'
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Domain-Specific Customization',
      icon: 'ri-settings-4-line',
      description: 'Adapt CHADD tools and methodology to your specific industry requirements. Whether medical, industrial, energy, or financial, we customize solutions that fit your unique operational context.',
      deliverables: [
        'Industry-specific protocol development',
        'Custom algorithm tuning',
        'Domain expertise integration',
        'Regulatory compliance support'
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Training &amp; Knowledge Transfer',
      icon: 'ri-graduation-cap-line',
      description: 'Comprehensive training programs to ensure your team fully understands and can effectively utilize CHADD methodology and tools. From basic concepts to advanced implementation.',
      deliverables: [
        'Executive overview sessions',
        'Technical deep-dive workshops',
        'Hands-on implementation training',
        'Certification programs'
      ],
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Ongoing Support &amp; Optimization',
      icon: 'ri-customer-service-2-line',
      description: 'Continuous support and optimization services to ensure your CHADD implementation evolves with your business needs and delivers maximum value over time.',
      deliverables: [
        '24/7 technical support',
        'Performance monitoring and optimization',
        'Regular methodology updates',
        'Strategic consulting and roadmap planning'
      ],
      color: 'from-red-500 to-pink-600'
    },
    {
      title: 'Research Collaboration',
      icon: 'ri-microscope-line',
      description: 'Partner with our research team to develop novel applications of CHADD methodology for your specific challenges. Co-create solutions that advance both your business and the field.',
      deliverables: [
        'Joint research initiatives',
        'Custom algorithm development',
        'Publication and IP collaboration',
        'Academic partnership opportunities'
      ],
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  const businessScales = [
    {
      title: 'Small &amp; Medium Enterprises',
      description: 'Tailored CHADD integration for growing businesses',
      features: [
        'Scalable implementation roadmap',
        'Cost-effective deployment options',
        'Rapid time-to-value focus',
        'Essential tool suite access',
        'Flexible support packages'
      ],
      icon: 'ri-building-2-line',
      pricing: 'Custom pricing based on scope'
    },
    {
      title: 'Large Enterprises',
      description: 'Comprehensive CHADD methodology integration for complex organizations',
      features: [
        'Full-scale enterprise deployment',
        'Custom integration architecture',
        'Advanced analytics and reporting',
        'Dedicated support team',
        'Strategic partnership model'
      ],
      icon: 'ri-building-4-line',
      pricing: 'Enterprise agreements available'
    }
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Discovery &amp; Assessment',
      description: 'We analyze your current environment, challenges, and objectives to design the optimal CHADD integration strategy.',
      icon: 'ri-search-line'
    },
    {
      number: '02',
      title: 'Domain Mapping',
      description: 'Map your specific domain requirements to SQUD frameworks and identify customization needs.',
      icon: 'ri-map-pin-line'
    },
    {
      number: '03',
      title: 'Implementation',
      description: 'Deploy CHADD tools and methodology with comprehensive training and knowledge transfer.',
      icon: 'ri-rocket-line'
    },
    {
      number: '04',
      title: 'Optimization &amp; Support',
      description: 'Continuous monitoring, optimization, and support to ensure long-term success.',
      icon: 'ri-line-chart-line'
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#1e3a5f] to-[#2c5282]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Consulting Services
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-8">
              Integrate CHADD tools, methodology, and philosophy into your business environment. 
              We provide comprehensive consulting services to help you leverage the power of CHADD across your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => scrollToSection('contact-section')}
                className="px-8 py-4 bg-[#d4af37] text-black rounded-full font-semibold hover:bg-[#c19b2f] transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap"
              >
                Schedule Consultation
              </button>
              <button 
                onClick={() => scrollToSection('services-overview')}
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-[#1e3a5f] transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap"
              >
                Explore Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section id="services-overview" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1e3a5f]">
              Our Consulting Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From initial assessment to full deployment and ongoing support, we guide you through every step of CHADD integration
            </p>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {consultingServices.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
                <div className="p-8">
                  <div className={`w-16 h-16 flex items-center justify-center bg-gradient-to-r ${service.color} rounded-full mb-6`}>
                    <i className={`${service.icon} text-2xl text-white`}></i>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-[#1e3a5f]">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#1e3a5f] mb-3">Key Deliverables:</h4>
                    {service.deliverables.map((deliverable, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1e3a5f]">
              Our Consulting Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A proven methodology for successful CHADD integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-6xl font-bold text-[#d4af37] opacity-20 mb-4">{step.number}</div>
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] rounded-full mb-6">
                  <i className={`${step.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="text-xl font-bold mb-4 text-[#1e3a5f]">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Scale Options */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1e3a5f]">
              Scalable Solutions for Every Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Whether you're a growing SME or a large enterprise, we have the right consulting package for you
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {businessScales.map((scale, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-r from-[#d4af37] to-[#f4d03f] rounded-full mb-6">
                  <i className={`${scale.icon} text-3xl text-white`}></i>
                </div>
                <h3 className="text-3xl font-bold text-[#1e3a5f] mb-4">{scale.title}</h3>
                <p className="text-gray-600 text-lg mb-6">{scale.description}</p>
                
                <div className="space-y-3 mb-8">
                  {scale.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <i className="ri-check-line text-green-500 text-xl mr-3 flex-shrink-0"></i>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <p className="text-[#d4af37] font-semibold text-lg">{scale.pricing}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact-section" className="py-24 bg-gradient-to-r from-[#1e3a5f] to-[#2c5282]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Schedule a consultation with our team to discuss how CHADD methodology can be integrated into your organization
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/#contact"
                className="px-8 py-4 bg-[#d4af37] text-black rounded-full font-semibold hover:bg-[#c19b2f] transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap"
              >
                Contact Us Today
              </a>
              <a 
                href="/"
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-[#1e3a5f] transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
