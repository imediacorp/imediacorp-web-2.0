import Navigation from '../../components/feature/Navigation';
import Footer from '../../components/feature/Footer';

export default function RhapsodeCreativeSuite() {
  const domains = [
    {
      title: 'Literary & Narrative Development',
      description: 'Dynamic Entity Relationship Diagrams for Stories & Manuscripts',
      icon: 'ri-book-open-line',
      image: 'https://readdy.ai/api/search-image?query=Modern%20creative%20writing%20studio%20with%20multiple%20screens%20showing%20narrative%20development%20tools%2C%20story%20structure%20diagrams%2C%20character%20development%20interfaces%2C%20clean%20minimalist%20workspace%20with%20advanced%20writing%20software%20and%20systems%20engineering%20visualization%20for%20storytelling&width=800&height=500&seq=rhapsode-literary&orientation=landscape',
      features: ['Advanced manuscript parsing with object recognition', 'Interactive Entity Relationship Diagrams', 'GraphRAG story analysis', 'Character development tools', 'Plot optimization', 'Style consistency checking', 'Systems engineering approach to narrative']
    },
    {
      title: 'Musical Composition & Production',
      description: 'Systems Engineering Framework for Musical Creation',
      icon: 'ri-music-line',
      image: 'https://readdy.ai/api/search-image?query=Professional%20music%20production%20studio%20with%20digital%20audio%20workstation%2C%20MIDI%20controllers%2C%20advanced%20composition%20software%2C%20clean%20modern%20recording%20environment%20with%20systems%20engineering%20visualization%20for%20music%20creation%20and%20harmonic%20analysis%20displays&width=800&height=500&seq=rhapsode-music&orientation=landscape',
      features: ['Harmonic analysis engine', 'Composition assistance', 'Audio production tools', 'Performance optimization', 'Cross-genre collaboration', 'Musical structure as engineering artifacts']
    },
    {
      title: 'Architectural Design & Planning',
      description: 'Unified Art-Science Approach to Spatial Design',
      icon: 'ri-building-line',
      image: 'https://readdy.ai/api/search-image?query=Modern%20architectural%20design%20studio%20with%203D%20modeling%20displays%2C%20building%20information%20modeling%20software%2C%20clean%20professional%20workspace%20with%20advanced%20CAD%20tools%20and%20systems%20engineering%20visualization%20for%20architectural%20planning%20and%20design&width=800&height=500&seq=rhapsode-architecture&orientation=landscape',
      features: ['3D spatial modeling', 'Environmental simulation', 'Material optimization', 'Structural analysis', 'Sustainability planning', 'Architecture as dynamic systems']
    },
    {
      title: 'Dance & Choreography',
      description: 'Movement as Dynamic Entity Relationships',
      icon: 'ri-user-star-line',
      image: 'https://readdy.ai/api/search-image?query=Modern%20dance%20choreography%20studio%20with%20motion%20capture%20technology%2C%20movement%20analysis%20displays%2C%20clean%20professional%20dance%20space%20with%20advanced%20choreography%20software%20and%20systems%20engineering%20visualization%20for%20dance%20creation&width=800&height=500&seq=rhapsode-dance&orientation=landscape',
      features: ['Movement pattern analysis', 'Choreographic structure mapping', 'Spatial relationship tracking', 'Performance optimization', 'Cross-disciplinary collaboration', 'Dance as engineering artifacts']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-[#d4af37] to-[#c19b2f] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{
              backgroundImage: `url('https://readdy.ai/api/search-image?query=Abstract%20creative%20background%20with%20artistic%20elements%2C%20musical%20notes%2C%20architectural%20blueprints%2C%20literary%20symbols%2C%20interconnected%20creative%20domains%2C%20elegant%20design%20with%20gold%20and%20navy%20accents%20representing%20integrated%20creative%20development%20environment&width=1920&height=1080&seq=rhapsode-hero-bg&orientation=landscape')`
            }}
          ></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center text-white">
              <div className="w-20 h-20 flex items-center justify-center bg-white rounded-full mx-auto mb-8">
                <i className="ri-quill-pen-line text-3xl text-[#1e3a5f]"></i>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">Rhapsode Creative Suite</h1>
              <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8">
                The world's first Integrated Narrative Development Environment (INDE) - 
                A revolutionary creative paradigm that unifies art with science
              </p>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl max-w-3xl mx-auto">
                <p className="text-lg text-white/90">
                  <strong>Treating stories, music, architecture, and dance as Dynamic Entity Relationship Diagrams and systems engineering artifacts</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Manuscript Analysis Technology */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-[#1e3a5f] mb-6">Revolutionary Manuscript Analysis</h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Rhapsode ingests your manuscript and parses it using advanced object recognition technologies, 
                  GraphRAG and AI interpretation to turn your story into an interactive, dynamic Entity Relationship Diagram - 
                  treating narrative as a systems engineering artifact.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#d4af37] rounded-full mr-4 mt-1">
                      <i className="ri-scan-line text-white text-sm"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1e3a5f] mb-1">Advanced Object Recognition</h3>
                      <p className="text-gray-600 text-sm">Automatically identifies characters, locations, events, and narrative elements as system components</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#d4af37] rounded-full mr-4 mt-1">
                      <i className="ri-node-tree text-white text-sm"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1e3a5f] mb-1">GraphRAG Analysis</h3>
                      <p className="text-gray-600 text-sm">Creates knowledge graphs showing relationships and narrative connections as engineering diagrams</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#d4af37] rounded-full mr-4 mt-1">
                      <i className="ri-share-box-line text-white text-sm"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1e3a5f] mb-1">Dynamic ERD Visualization</h3>
                      <p className="text-gray-600 text-sm">Interactive diagrams revealing story structure as dynamic systems engineering artifacts</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#1e3a5f]/5 to-[#d4af37]/5 p-6 rounded-xl">
                  <h4 className="font-semibold text-[#1e3a5f] mb-2">Unifying Art with Science:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Visual story maps with character relationships as system components</li>
                    <li>• Plot progression analysis using engineering methodologies</li>
                    <li>• Narrative consistency validation through systems thinking</li>
                    <li>• Cross-reference tracking for complex storylines as interconnected systems</li>
                  </ul>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2a4a70] p-8 rounded-2xl">
                  <img
                    src="https://static.readdy.ai/image/4867812d68f52f9487efa6b073c734c5/def1ea6777639e6d39f2bc2540ac5f56.png"
                    alt="Rhapsode Entity Relationship Diagram showing interactive story analysis as systems engineering artifact"
                    title="Interactive Entity Relationship Diagram - Art meets Science"
                    className="w-full rounded-lg shadow-lg"
                  />
                  <div className="mt-4 text-center">
                    <p className="text-white/90 text-sm">
                      Dynamic Entity Relationship Diagram - Stories as Systems Engineering Artifacts
                    </p>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 w-20 h-20 flex items-center justify-center bg-[#d4af37] rounded-full shadow-lg">
                  <i className="ri-magic-line text-2xl text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Concept */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#1e3a5f] mb-6">INDE: IDE for Creators</h2>
              <p className="text-gray-600 max-w-4xl mx-auto text-lg leading-relaxed">
                Just as software developers use Integrated Development Environments (IDEs) to build applications, 
                Rhapsode provides an Integrated Narrative Development Environment (INDE) for creators - 
                treating artistic works as systems engineering artifacts and unifying art with science.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2a4a70] p-8 rounded-2xl text-white">
                  <h3 className="text-2xl font-bold mb-4">Traditional IDE</h3>
                  <ul className="space-y-3 text-gray-200">
                    <li className="flex items-start">
                      <i className="ri-code-line text-[#d4af37] mt-1 mr-3 flex-shrink-0"></i>
                      Code editor with syntax highlighting
                    </li>
                    <li className="flex items-start">
                      <i className="ri-bug-line text-[#d4af37] mt-1 mr-3 flex-shrink-0"></i>
                      Debugging and testing tools
                    </li>
                    <li className="flex items-start">
                      <i className="ri-git-branch-line text-[#d4af37] mt-1 mr-3 flex-shrink-0"></i>
                      Version control integration
                    </li>
                    <li className="flex items-start">
                      <i className="ri-puzzle-line text-[#d4af37] mt-1 mr-3 flex-shrink-0"></i>
                      Plugin ecosystem
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <div className="bg-gradient-to-br from-[#d4af37] to-[#c19b2f] p-8 rounded-2xl text-white">
                  <h3 className="text-2xl font-bold mb-4">Rhapsode INDE</h3>
                  <ul className="space-y-3 text-white/90">
                    <li className="flex items-start">
                      <i className="ri-quill-pen-line text-white mt-1 mr-3 flex-shrink-0"></i>
                      Creative editor treating works as engineering artifacts
                    </li>
                    <li className="flex items-start">
                      <i className="ri-search-eye-line text-white mt-1 mr-3 flex-shrink-0"></i>
                      Systems analysis and optimization
                    </li>
                    <li className="flex items-start">
                      <i className="ri-git-merge-line text-white mt-1 mr-3 flex-shrink-0"></i>
                      Dynamic Entity Relationship tracking
                    </li>
                    <li className="flex items-start">
                      <i className="ri-links-line text-white mt-1 mr-3 flex-shrink-0"></i>
                      Art-science unification framework
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-2xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4">Unifying Art with Science</h3>
                <p className="text-gray-700 max-w-3xl mx-auto">
                  Rhapsode revolutionizes creative development by treating artistic works as Dynamic Entity Relationship Diagrams 
                  and systems engineering artifacts - bridging the gap between artistic expression and scientific methodology.
                </p>
              </div>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#1e3a5f] rounded-full mx-auto mb-3">
                    <i className="ri-book-line text-xl text-[#d4af37]"></i>
                  </div>
                  <h4 className="font-semibold text-[#1e3a5f] mb-2">Literature</h4>
                  <p className="text-sm text-gray-600">Narrative as dynamic systems with entity relationships</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#d4af37] rounded-full mx-auto mb-3">
                    <i className="ri-music-2-line text-xl text-white"></i>
                  </div>
                  <h4 className="font-semibold text-[#1e3a5f] mb-2">Music</h4>
                  <p className="text-sm text-gray-600">Compositions as engineering artifacts with harmonic systems</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#1e3a5f] rounded-full mx-auto mb-3">
                    <i className="ri-building-2-line text-xl text-[#d4af37]"></i>
                  </div>
                  <h4 className="font-semibold text-[#1e3a5f] mb-2">Architecture</h4>
                  <p className="text-sm text-gray-600">Spatial design as dynamic entity relationships</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#d4af37] rounded-full mx-auto mb-3">
                    <i className="ri-user-star-line text-xl text-white"></i>
                  </div>
                  <h4 className="font-semibold text-[#1e3a5f] mb-2">Dance</h4>
                  <p className="text-sm text-gray-600">Choreography as systems engineering with movement patterns</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Creative Domains */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#1e3a5f] mb-6">Creative Domains as Systems</h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Explore how Rhapsode transforms creative workflows by treating artistic works as 
                Dynamic Entity Relationship Diagrams and systems engineering artifacts across all domains.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {domains.map((domain, index) => (
                <article key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={domain.image}
                      alt={domain.title}
                      title={domain.title}
                      className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-[#d4af37] rounded-full">
                        <i className={`${domain.icon} text-xl text-white`}></i>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-[#1e3a5f] mb-2">{domain.title}</h3>
                    <p className="text-[#d4af37] font-medium mb-4">{domain.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-[#1e3a5f] mb-3">Key Features:</h4>
                      <ul className="space-y-2">
                        {domain.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600">
                            <i className="ri-check-line text-[#d4af37] mt-1 mr-2 flex-shrink-0"></i>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-[#d4af37]/5 to-[#1e3a5f]/5 p-4 rounded-lg">
                      <div className="flex items-center">
                        <i className="ri-links-line text-[#d4af37] mr-2"></i>
                        <span className="text-sm font-semibold text-[#1e3a5f]">Art-Science Unification Framework</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Innovation Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a70] p-12 rounded-2xl text-white">
              <div className="text-center mb-12">
                <div className="w-20 h-20 flex items-center justify-center bg-[#d4af37] rounded-full mx-auto mb-6">
                  <i className="ri-lightbulb-line text-3xl text-white"></i>
                </div>
                <h2 className="text-3xl font-bold mb-4">Revolutionary Creative Paradigm</h2>
                <p className="text-gray-200 max-w-3xl mx-auto text-lg">
                  Rhapsode fundamentally transforms how we approach creative work by treating artistic expression 
                  as systems engineering - unifying art with science in unprecedented ways.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/10 p-6 rounded-xl">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#d4af37] rounded-full mb-4">
                    <i className="ri-exchange-line text-xl text-white"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Systems Engineering for Art</h3>
                  <p className="text-gray-200 text-sm">
                    Apply rigorous engineering methodologies to creative works - treating stories, music, and choreography 
                    as dynamic systems with measurable relationships and optimizable structures.
                  </p>
                </div>
                <div className="bg-white/10 p-6 rounded-xl">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#d4af37] rounded-full mb-4">
                    <i className="ri-node-tree text-xl text-white"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Dynamic Entity Relationships</h3>
                  <p className="text-gray-200 text-sm">
                    Visualize and manipulate creative works as interactive Entity Relationship Diagrams - 
                    revealing hidden patterns, connections, and optimization opportunities.
                  </p>
                </div>
                <div className="bg-white/10 p-6 rounded-xl">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#d4af37] rounded-full mb-4">
                    <i className="ri-links-line text-xl text-white"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Art-Science Unification</h3>
                  <p className="text-gray-200 text-sm">
                    Bridge the gap between artistic intuition and scientific rigor - 
                    enabling creators to leverage both creative inspiration and analytical precision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[#d4af37]">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Creative Process?</h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Experience the world's first Integrated Narrative Development Environment. 
                Discover how treating creative works as systems engineering artifacts can revolutionize your artistic practice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/#contact" 
                  className="bg-[#1e3a5f] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#2a4a70] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Schedule Demo
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
