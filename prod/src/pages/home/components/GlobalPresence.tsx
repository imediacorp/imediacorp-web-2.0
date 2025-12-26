
import { useState } from 'react';

export default function GlobalPresence() {
  const [activeHub, setActiveHub] = useState(0);

  const hubs = [
    {
      name: 'Belleville, Canada',
      role: 'North American Headquarters',
      description: 'Our founding location where innovation began. Home to our core research and development teams.',
      coordinates: { x: 25, y: 45 },
      features: [
        'R&D Center',
        'CHADD Development',
        'Strategic Planning',
        'North American Operations'
      ],
      image: 'https://readdy.ai/api/search-image?query=Modern%20technology%20office%20building%20in%20Belleville%20Canada%2C%20glass%20facade%2C%20professional%20corporate%20headquarters%2C%20blue%20sky%2C%20contemporary%20architecture%2C%20clean%20design&width=400&height=300&seq=belleville-hq&orientation=landscape'
    },
    {
      name: 'Malta, Europe',
      role: 'European Operations Hub',
      description: 'Strategic European base facilitating partnerships across the continent and Mediterranean region.',
      coordinates: { x: 52, y: 35 },
      features: [
        'European Partnerships',
        'Regulatory Compliance',
        'Market Expansion',
        'Cultural Integration'
      ],
      image: 'https://readdy.ai/api/search-image?query=Modern%20business%20center%20in%20Malta%20Mediterranean%2C%20contemporary%20office%20building%2C%20European%20architecture%2C%20blue%20Mediterranean%20sea%20view%2C%20professional%20setting&width=400&height=300&seq=malta-hub&orientation=landscape'
    },
    {
      name: 'Antalya, Türkiye',
      role: 'Mediterranean Innovation Center',
      description: 'Bridge between Europe and Asia, fostering cross-cultural innovation and global collaboration.',
      coordinates: { x: 58, y: 38 },
      features: [
        'Cross-Cultural Innovation',
        'Global Talent Hub',
        'Strategic Location',
        'Innovation Incubator'
      ],
      image: 'https://readdy.ai/api/search-image?query=Modern%20technology%20center%20in%20Antalya%20Turkey%2C%20contemporary%20office%20building%2C%20Mediterranean%20coast%2C%20mountains%20background%2C%20innovative%20architecture%2C%20professional%20setting&width=400&height=300&seq=antalya-center&orientation=landscape'
    }
  ];

  return (
    <section id="global-presence" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-[#10b981] rounded-full flex items-center justify-center mr-4">
                <i className="ri-global-line text-3xl text-white"></i>
              </div>
              <h2 className="text-4xl font-bold text-[#1e3a8a]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Global Presence
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Three strategic hubs across continents, united by our Global Village principle: "Where you are is where you work."
            </p>
          </div>

          {/* Global Village Network - Clean Design */}
          <div className="bg-gradient-to-br from-[#0A2342] to-[#1e40af] rounded-3xl p-12 mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Our Global Village
              </h3>
              <p className="text-blue-100 text-lg">
                Where you are is where you work
              </p>
            </div>

            {/* Clean Hub Network */}
            <div className="relative">
              {/* Background Globe Image */}
              <div className="relative mx-auto w-96 h-96 mb-8">
                <img 
                  src="https://readdy.ai/api/search-image?query=Clean%20minimalist%20Earth%20globe%20from%20space%20showing%20North%20America%20Europe%20and%20Asia%20continents%2C%20dark%20blue%20oceans%2C%20simple%20clean%20design%2C%20professional%20satellite%20view%2C%20no%20text%20overlays%2C%20clear%20continental%20outlines&width=400&height=400&seq=clean-globe&orientation=squarish"
                  alt="Global Network"
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2342]/30 to-transparent rounded-full"></div>
                
                {/* Hub Markers */}
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-[#FFD700] rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-[#FFD700] rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute top-2/5 right-1/4 w-4 h-4 bg-[#FFD700] rounded-full animate-pulse shadow-lg"></div>
                
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full">
                  <defs>
                    <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.8"/>
                    </linearGradient>
                  </defs>
                  <path 
                    d="M 96 96 Q 200 150 288 128" 
                    stroke="url(#connectionGradient)" 
                    strokeWidth="2" 
                    fill="none"
                    className="animate-pulse"
                  />
                  <path 
                    d="M 288 128 Q 350 180 304 160" 
                    stroke="url(#connectionGradient)" 
                    strokeWidth="2" 
                    fill="none"
                    className="animate-pulse"
                  />
                  <path 
                    d="M 96 96 Q 180 80 304 160" 
                    stroke="url(#connectionGradient)" 
                    strokeWidth="2" 
                    fill="none"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              {/* Hub Selection */}
              <div className="flex justify-center space-x-6">
                {hubs.map((hub, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveHub(index)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all cursor-pointer ${
                      activeHub === index 
                        ? 'bg-[#FFD700] text-[#0A2342] shadow-lg' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {hub.name.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Hub Details */}
          <div className="bg-gray-50 rounded-3xl p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#10b981] rounded-full flex items-center justify-center mr-4">
                    <i className="ri-map-pin-line text-2xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#1e3a8a]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {hubs[activeHub].name}
                    </h3>
                    <p className="text-[#FFD700] font-medium">{hubs[activeHub].role}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed">
                  {hubs[activeHub].description}
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-[#1e3a8a] mb-4">Key Functions:</h4>
                  {hubs[activeHub].features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <i className="ri-checkbox-circle-line text-[#10b981] mr-3"></i>
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <img 
                  src={hubs[activeHub].image}
                  alt={hubs[activeHub].name}
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h4 className="text-xl font-bold mb-2">{hubs[activeHub].name}</h4>
                  <p className="text-white/80">{hubs[activeHub].role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Global Village Principle */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-[#6C5CE7] to-[#a855f7] rounded-3xl p-12 text-white">
              <div className="max-w-4xl mx-auto">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-earth-line text-4xl"></i>
                </div>
                <h3 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Global Village Principle
                </h3>
                <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                  "Where you are is where you work" — Our distributed model empowers talent regardless of location, 
                  creating a truly global cooperative that transcends geographical boundaries.
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <i className="ri-time-zone-line text-3xl text-white mb-4 block"></i>
                    <h4 className="font-semibold mb-2">24/7 Operations</h4>
                    <p className="text-purple-100 text-sm">
                      Continuous innovation across time zones
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <i className="ri-team-line text-3xl text-white mb-4 block"></i>
                    <h4 className="font-semibold mb-2">Cultural Diversity</h4>
                    <p className="text-purple-100 text-sm">
                      Rich perspectives from global talent
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <i className="ri-rocket-line text-3xl text-white mb-4 block"></i>
                    <h4 className="font-semibold mb-2">Accelerated Innovation</h4>
                    <p className="text-purple-100 text-sm">
                      Faster development through global collaboration
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
