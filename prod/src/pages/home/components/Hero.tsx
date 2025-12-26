import { useState, useEffect } from 'react';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const slides = [
    {
      title: "Integrative Thinking Across All Domains",
      subtitle: "Bold & Disruptive",
      description: "Join a global cooperative where research meets real-world impact. We're building the future of integrative science—from medical diagnostics to creative AI, from cosmology to patient data synthesis.",
      image: "https://readdy.ai/api/search-image?query=A%20vibrant%20and%20dynamic%20scene%20showcasing%20global%20collaboration%20and%20innovation%20in%20science%20and%20technology%20with%20diverse%20people%20working%20together%20on%20futuristic%20projects%20in%20a%20modern%20collaborative%20workspace%20with%20holographic%20displays%20and%20advanced%20equipment%20against%20a%20clean%20minimalist%20white%20background%20that%20blends%20seamlessly%20with%20the%20left%20side%20text%20area&width=1200&height=800&seq=hero1&orientation=landscape",
      primaryButton: { text: "Join the Global Village", action: () => scrollToSection('recruitment') },
      secondaryButton: { text: "Discover Our Innovations", action: () => scrollToSection('innovations') }
    },
    {
      title: "Open Science, Open Ownership",
      subtitle: "Scientific & Credible",
      description: "We publish everything. Our research is peer-reviewed, our methods are transparent, and our cooperative model ensures that contributors become co-owners. This is science without gatekeepers.",
      image: "https://readdy.ai/api/search-image?query=A%20professional%20scientific%20research%20environment%20with%20transparent%20glass%20walls%20showing%20collaborative%20open%20science%20work%20with%20researchers%20sharing%20data%20on%20digital%20screens%20and%20whiteboards%20in%20a%20bright%20modern%20laboratory%20setting%20with%20a%20clean%20white%20background%20that%20creates%20perfect%20contrast%20for%20text%20overlay&width=1200&height=800&seq=hero2&orientation=landscape",
      primaryButton: { text: "Explore Open Science", action: () => scrollToSection('scientific-integrity') },
      secondaryButton: { text: "Become a Co-Owner", action: () => scrollToSection('recruitment') }
    },
    {
      title: "From Canada to the World",
      subtitle: "Global & Inclusive",
      description: "Founded in 1994, we've grown from a Canadian IT consultancy to a global research cooperative. Our network spans continents, our thinking spans disciplines, and our impact spans generations.",
      image: "https://readdy.ai/api/search-image?query=A%20stunning%20global%20network%20visualization%20showing%20interconnected%20nodes%20and%20pathways%20across%20a%20world%20map%20with%20diverse%20international%20team%20members%20collaborating%20through%20digital%20interfaces%20in%20a%20modern%20high%20tech%20environment%20with%20a%20pristine%20white%20background%20that%20ensures%20excellent%20readability%20of%20overlaid%20text&width=1200&height=800&seq=hero3&orientation=landscape",
      primaryButton: { text: "Join the Cooperative", action: () => scrollToSection('recruitment') },
      secondaryButton: { text: "See Our Global Network", action: () => scrollToSection('global-presence') }
    },
    {
      title: "Ma'at Meets Modern Science",
      subtitle: "Philosophical & Visionary",
      description: "Ancient Egyptian wisdom of balance and truth guides our modern research. We're not just building tools—we're building a framework for integrative thinking that honors both tradition and innovation.",
      image: "https://readdy.ai/api/search-image?query=An%20elegant%20fusion%20of%20ancient%20Egyptian%20wisdom%20symbols%20and%20modern%20scientific%20technology%20with%20geometric%20patterns%20and%20holographic%20displays%20showing%20the%20balance%20between%20tradition%20and%20innovation%20in%20a%20sophisticated%20minimalist%20setting%20with%20a%20pure%20white%20background%20that%20provides%20optimal%20contrast%20for%20text%20elements&width=1200&height=800&seq=hero4&orientation=landscape",
      primaryButton: { text: "Learn About Ma'at", action: () => scrollToSection('about') },
      secondaryButton: { text: "Contact Us", action: () => scrollToSection('contact') }
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={`Hero background ${index + 1}`}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div className="max-w-5xl mx-auto">
          {/* Slide Content */}
          <div className="mb-12">
            <div className="text-lg md:text-xl font-semibold text-[#d4af37] mb-4">
              {slides[currentSlide].subtitle}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-4xl mx-auto">
              {slides[currentSlide].description}
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={slides[currentSlide].primaryButton.action}
                className="px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#f1c40f] text-black rounded-full font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap"
              >
                {slides[currentSlide].primaryButton.text}
              </button>
              <button 
                onClick={slides[currentSlide].secondaryButton.action}
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap"
              >
                {slides[currentSlide].secondaryButton.text}
              </button>
            </div>
          </div>

          {/* Key Stats */}
          {currentSlide === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-[#d4af37] mb-2">30+</div>
                <div className="text-gray-200">Years of Innovation</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-[#d4af37] mb-2">3</div>
                <div className="text-gray-200">Global Hubs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-[#d4af37] mb-2">100%</div>
                <div className="text-gray-200">Open Science</div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
          {/* Dots */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                  index === currentSlide ? 'bg-[#d4af37] w-8' : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Arrow Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all cursor-pointer"
        >
          <i className="ri-arrow-left-line text-xl"></i>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all cursor-pointer"
        >
          <i className="ri-arrow-right-line text-xl"></i>
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
