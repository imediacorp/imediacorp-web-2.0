import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false);
      return true;
    }
    return false;
  };

  const handleNavigationClick = (id: string) => {
    // If we're already on the home page, just scroll
    if (location.pathname === '/') {
      scrollToSection(id);
    } else {
      // Navigate to home page first
      setIsNavigating(true);
      navigate('/', { state: { scrollTo: id } });
      setIsMenuOpen(false);
    }
  };

  // Handle scroll after navigation completes
  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo && !isNavigating) {
      const timer = setTimeout(() => {
        scrollToSection(location.state.scrollTo);
        // Clear the state to prevent scrolling on subsequent renders
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 100);
      return () => clearTimeout(timer);
    }
    setIsNavigating(false);
  }, [location, isNavigating]);

  const handleRecruitmentClick = () => {
    handleNavigationClick('recruitment');
  };

  const handleInnovationsClick = () => {
    handleNavigationClick('innovations');
  };

  const handleServicesClick = () => {
    navigate('/services');
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d4af37] rounded"
            aria-label="Home"
          >
            <img 
              src="https://static.readdy.ai/image/4867812d68f52f9487efa6b073c734c5/c7708e33a2909e4ab006824ee8ce083c.png"
              alt="iMediaCorp Logo"
              className="h-10 w-auto"
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate('/who-we-are')}
              className="text-[#1e3a8a] hover:text-[#d4af37] transition-colors cursor-pointer whitespace-nowrap font-medium focus:outline-none focus:ring-2 focus:ring-[#d4af37] rounded px-2 py-1"
            >
              Who We Are
            </button>
            <button 
              onClick={handleInnovationsClick}
              className="text-[#1e3a8a] hover:text-[#d4af37] transition-colors cursor-pointer whitespace-nowrap font-medium focus:outline-none focus:ring-2 focus:ring-[#d4af37] rounded px-2 py-1"
            >
              Innovations
            </button>
            <button 
              onClick={handleServicesClick}
              className="text-[#1e3a8a] hover:text-[#d4af37] transition-colors cursor-pointer whitespace-nowrap font-medium focus:outline-none focus:ring-2 focus:ring-[#d4af37] rounded px-2 py-1"
            >
              Services
            </button>
            <button 
              onClick={() => navigate('/fibonacci-cosmology')}
              className="text-[#1e3a8a] hover:text-[#d4af37] transition-colors cursor-pointer whitespace-nowrap font-medium focus:outline-none focus:ring-2 focus:ring-[#d4af37] rounded px-2 py-1"
            >
              Research
            </button>
            <button 
              onClick={handleRecruitmentClick}
              className="text-[#1e3a8a] hover:text-[#d4af37] transition-colors cursor-pointer whitespace-nowrap font-medium focus:outline-none focus:ring-2 focus:ring-[#d4af37] rounded px-2 py-1"
            >
              Join Us
            </button>
            <button 
              onClick={() => handleNavigationClick('contact')}
              className="bg-[#d4af37] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#c19b2f] transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#c19b2f] focus:ring-offset-2"
            >
              Contact Us
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-[#1e3a8a] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d4af37] rounded"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            <span className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl`}></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3" role="menu">
            <button 
              onClick={() => navigate('/who-we-are')}
              className="block w-full text-left text-[#1e3a8a] hover:text-[#d4af37] transition-colors cursor-pointer py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#d4af37] rounded px-2"
              role="menuitem"
            >
              Who We Are
            </button>
            <button 
              onClick={handleInnovationsClick}
              className="block w-full text-left text-[#1e3a8a] hover:text-[#d4af37] transition-colors cursor-pointer py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#d4af37] rounded px-2"
              role="menuitem"
            >
              Innovations
            </button>
            <button 
              onClick={handleServicesClick}
              className="block w-full text-left text-[#1e3a8a] hover:text-[#d4af37] transition-colors cursor-pointer py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#d4af37] rounded px-2"
              role="menuitem"
            >
              Services
            </button>
            <button 
              onClick={() => navigate('/fibonacci-cosmology')}
              className="block w-full text-left text-[#1e3a8a] hover:text-[#d4af37] transition-colors cursor-pointer py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#d4af37] rounded px-2"
              role="menuitem"
            >
              Research
            </button>
            <button 
              onClick={handleRecruitmentClick}
              className="block w-full text-left text-[#1e3a8a] hover:text-[#d4af37] transition-colors cursor-pointer py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#d4af37] rounded px-2"
              role="menuitem"
            >
              Join Us
            </button>
            <button 
              onClick={() => handleNavigationClick('contact')}
              className="block w-full text-left bg-[#d4af37] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#c19b2f] transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#c19b2f] focus:ring-offset-2"
              role="menuitem"
            >
              Contact Us
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
