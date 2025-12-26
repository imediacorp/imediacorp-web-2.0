
export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1e3a5f]">
              About Intermedia Communications Corp
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Since 1994, we've been at the forefront of technological innovation, evolving from IT solutions to groundbreaking integrative research that synthesizes insights across scientific silos and creative domains
            </p>
          </div>

          {/* Mission Statement - Prominently Featured */}
          <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] rounded-3xl p-12 text-white mb-20">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
              <div className="max-w-4xl mx-auto">
                <p className="text-xl leading-relaxed mb-8 text-gray-100">
                  <strong>Imediacorp exists to advance integrative thinking — synthesizing insights across scientific silos and creative domains to foster sustainable innovation.</strong>
                </p>
                <p className="text-lg leading-relaxed mb-8 text-gray-200">
                  We believe that breakthroughs happen at the intersections: where music meets mathematics, where diagnostics meet cosmology, where creativity meets systems engineering. By unifying disciplines traditionally kept apart, we create tools and frameworks that serve both humanity's immediate needs and its long‑term planetary stewardship.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="w-16 h-16 flex items-center justify-center bg-[#d4af37] rounded-full mx-auto mb-4">
                  <i className="ri-links-line text-white text-2xl"></i>
                </div>
                <h4 className="text-xl font-bold mb-3">Integrative Thinking</h4>
                <p className="text-gray-300">Synthesizing insights across scientific silos and creative domains</p>
              </div>
              
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="w-16 h-16 flex items-center justify-center bg-[#d4af37] rounded-full mx-auto mb-4">
                  <i className="ri-intersection text-white text-2xl"></i>
                </div>
                <h4 className="text-xl font-bold mb-3">Breakthrough Intersections</h4>
                <p className="text-gray-300">Where music meets mathematics, diagnostics meet cosmology</p>
              </div>
              
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="w-16 h-16 flex items-center justify-center bg-[#d4af37] rounded-full mx-auto mb-4">
                  <i className="ri-earth-line text-white text-2xl"></i>
                </div>
                <h4 className="text-xl font-bold mb-3">Planetary Stewardship</h4>
                <p className="text-gray-300">Serving humanity's immediate needs and long-term sustainability</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-[#1e3a5f]">Our Evolution</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#d4af37] rounded-full flex-shrink-0">
                    <i className="ri-computer-line text-white text-xl"></i>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2 text-[#1e3a5f]">1994-2010: IT Foundation</h4>
                    <p className="text-gray-600">Established as a trusted IT partner, building the technological foundation for future integrative research across disciplines.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#d4af37] rounded-full flex-shrink-0">
                    <i className="ri-brain-line text-white text-xl"></i>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h4 className="text-xl font-semibold mb-2 text-[#1e3a5f]">2010-2020: Integrative Research</h4>
                    <p className="text-gray-600">Transitioned into cross-disciplinary research, developing Revolutionary Universal Diagnostic Algorithm by synthesizing insights from medical science, mathematics, and systems engineering.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#d4af37] rounded-full flex-shrink-0">
                    <i className="ri-rocket-line text-white text-xl"></i>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2 text-[#1e3a5f]">2020-Present: Unified Innovation</h4>
                    <p className="text-gray-600">Pioneering breakthrough technologies where creativity meets systems engineering, unifying traditionally separate disciplines into comprehensive solutions.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://readdy.ai/api/search-image?query=Interdisciplinary%20research%20team%20collaborating%20across%20scientific%20domains%2C%20diverse%20scientists%20and%20creative%20professionals%20working%20together%20in%20modern%20innovation%20lab%2C%20mathematical%20equations%20and%20musical%20notes%20floating%20in%20background%2C%20integrative%20thinking%20visualization%2C%20clean%20white%20background%2C%20sustainable%20innovation%20workspace&width=600&height=400&seq=about-integrative-001&orientation=landscape"
                alt="Intermedia Communications Corp interdisciplinary team advancing integrative thinking across scientific silos and creative domains"
                className="rounded-2xl shadow-2xl w-full object-cover object-top"
              />
              <div className="absolute -bottom-6 -right-6 bg-[#d4af37] text-white p-6 rounded-2xl shadow-xl">
                <div className="text-3xl font-bold">30+</div>
                <div className="text-sm">Years of Integration</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-3xl p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-6 text-[#1e3a5f]">Core Values</h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our values guide every breakthrough, ensuring that innovation serves both immediate human needs and long-term planetary stewardship
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-[#1e3a5f] rounded-full mx-auto mb-4">
                  <i className="ri-microscope-line text-white text-2xl"></i>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-[#1e3a5f]">Scientific Integrity</h4>
                <p className="text-gray-600">Rigorous research across all disciplines</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-[#1e3a5f] rounded-full mx-auto mb-4">
                  <i className="ri-team-line text-white text-2xl"></i>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-[#1e3a5f]">Collaborative Innovation</h4>
                <p className="text-gray-600">Unifying traditionally separate domains</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-[#1e3a5f] rounded-full mx-auto mb-4">
                  <i className="ri-global-line text-white text-2xl"></i>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-[#1e3a5f]">Global Impact</h4>
                <p className="text-gray-600">Solutions for humanity's immediate needs</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-[#1e3a5f] rounded-full mx-auto mb-4">
                  <i className="ri-leaf-line text-white text-2xl"></i>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-[#1e3a5f]">Sustainability</h4>
                <p className="text-gray-600">Long-term planetary stewardship</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
