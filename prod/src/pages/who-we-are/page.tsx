
import Navigation from '../../components/feature/Navigation';
import Footer from '../../components/feature/Footer';

export default function WhoWeAre() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-[#1e3a5f] to-[#2a4a70]">
          <div className="container mx-auto px-6">
            <div className="text-center text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">Who We Are</h1>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Meet the visionary team behind the revolutionary CHADD technology and Rhapsode creative suite
              </p>
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold text-[#1e3a5f] mb-6">Our Story</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Founded in Toronto, Ontario in 1994, Intermedia Communications Corp has been a technology pioneer 
                from the very beginning. We didn't just adapt to the digital revolution - we helped create it.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-[#d4af37] rounded-full mx-auto mb-4">
                  <i className="ri-wifi-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">First Public ISPs</h3>
                <p className="text-gray-600">Launched one of Toronto's first public Internet Service Providers</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-[#d4af37] rounded-full mx-auto mb-4">
                  <i className="ri-computer-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">Internet Cafes</h3>
                <p className="text-gray-600">Established the first Internet Cafes in the city</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-[#d4af37] rounded-full mx-auto mb-4">
                  <i className="ri-shopping-cart-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">Early eCommerce</h3>
                <p className="text-gray-600">Created one of the first eCommerce sites in Canada</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-[#d4af37] rounded-full mx-auto mb-4">
                  <i className="ri-satellite-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">ExpressServe</h3>
                <p className="text-gray-600">Developed nationwide Bell Satellite installation service</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4 text-center">Three Decades of Innovation</h3>
              <p className="text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                From our early days as Internet pioneers to today's breakthrough CHADD technology, we've consistently 
                stayed ahead of the curve. Our journey from traditional IT services to fundamental scientific research 
                represents a unique evolution in the technology industry. We've built our reputation on delivering 
                cutting-edge solutions that don't just meet today's needs - they anticipate tomorrow's challenges.
              </p>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#1e3a5f] mb-6">Leadership Team</h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Meet the visionary leaders driving innovation at Intermedia Communications Corp
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {/* Bryan Persaud */}
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-32 h-32 flex items-center justify-center bg-[#1e3a5f] rounded-full mx-auto mb-6">
                  <i className="ri-user-star-line text-4xl text-[#d4af37]"></i>
                </div>
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-2">Bryan Persaud</h3>
                <p className="text-[#d4af37] font-semibold mb-4">Founder & CEO</p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Visionary inventor of the CHADD/HDPD breakthrough technology. Bryan's unique 40+ year journey 
                  across seven distinct domains enabled the revolutionary Universal Diagnostic Algorithm that 
                  powers all our products today.
                </p>
                <div className="bg-[#1e3a5f]/5 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Expertise:</strong> Music Theory, Dynamic Modeling, Financial Risk, Systems Theory, 
                    Real-Time Systems, Cross-Domain Translation
                  </p>
                </div>
              </div>

              {/* Leslie Smail-Persaud */}
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-32 h-32 flex items-center justify-center bg-[#d4af37] rounded-full mx-auto mb-6">
                  <i className="ri-scales-3-line text-4xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-2">Leslie Smail-Persaud</h3>
                <p className="text-[#d4af37] font-semibold mb-4">Co-Founder & CBO</p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Chief Balance Officer ensuring strategic alignment and operational excellence. Leslie brings 
                  essential balance to our innovative culture, maintaining focus on sustainable growth and 
                  ethical business practices.
                </p>
                <div className="bg-[#d4af37]/5 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Role:</strong> Strategic Planning, Operational Balance, Ethical Leadership, 
                    Sustainable Growth Management
                  </p>
                </div>
              </div>

              {/* Alex Caffary */}
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-32 h-32 flex items-center justify-center bg-[#1e3a5f] rounded-full mx-auto mb-6">
                  <i className="ri-code-box-line text-4xl text-[#d4af37]"></i>
                </div>
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-2">Alex Caffary</h3>
                <p className="text-[#d4af37] font-semibold mb-4">Chief Technology Officer</p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Technical architect responsible for translating breakthrough research into scalable SaaS 
                  platforms. Alex ensures our revolutionary algorithms become robust, enterprise-ready 
                  solutions that deliver real-world value.
                </p>
                <div className="bg-[#1e3a5f]/5 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Expertise:</strong> Software Architecture, SaaS Development, System Scalability, 
                    Enterprise Integration
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a70] p-8 rounded-2xl text-white max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">Our Collaborative Approach</h3>
                <p className="text-gray-200 leading-relaxed">
                  Our leadership team represents a unique blend of visionary research, strategic balance, and 
                  technical excellence. Together, we've created an environment where breakthrough scientific 
                  discoveries become practical solutions that transform industries and improve lives worldwide.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Research & Innovation */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#1e3a5f] mb-6">Research & Innovation</h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Our commitment to fundamental scientific research drives practical innovation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-[#f8f9fa] to-white p-8 rounded-2xl shadow-lg">
                <div className="w-16 h-16 flex items-center justify-center bg-[#1e3a5f] rounded-full mb-6">
                  <i className="ri-microscope-line text-2xl text-[#d4af37]"></i>
                </div>
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4">Scientific Publications</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We publish peer-reviewed research in cosmology, physics, and computational science. 
                  Our contributions to the global scientific community help advance understanding of 
                  complex systems from quantum mechanics to cosmic phenomena.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <i className="ri-check-line text-[#d4af37] mt-1 mr-2 flex-shrink-0"></i>
                    Peer-reviewed cosmology research
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-[#d4af37] mt-1 mr-2 flex-shrink-0"></i>
                    Complex systems analysis
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-[#d4af37] mt-1 mr-2 flex-shrink-0"></i>
                    Academic collaborations
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#f8f9fa] to-white p-8 rounded-2xl shadow-lg">
                <div className="w-16 h-16 flex items-center justify-center bg-[#d4af37] rounded-full mb-6">
                  <i className="ri-lightbulb-line text-2xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4">Practical Applications</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Our theoretical breakthroughs translate into real-world solutions. The CHADD Universal 
                  Diagnostic Algorithm emerged from fundamental research and now powers applications across 
                  medical diagnostics, industrial IoT, and renewable energy systems.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <i className="ri-check-line text-[#d4af37] mt-1 mr-2 flex-shrink-0"></i>
                    Universal diagnostic algorithms
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-[#d4af37] mt-1 mr-2 flex-shrink-0"></i>
                    Cross-domain applications
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-[#d4af37] mt-1 mr-2 flex-shrink-0"></i>
                    Industry transformation
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
