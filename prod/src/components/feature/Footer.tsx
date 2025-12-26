
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const elementTop = elementRect.top + window.pageYOffset;
      const elementHeight = elementRect.height;
      const targetPosition = elementTop + elementHeight - window.innerHeight + 100; // 100px padding from bottom
      
      window.scrollTo({ 
        top: Math.max(0, targetPosition), 
        behavior: 'smooth' 
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formElement = e.target as HTMLFormElement;
      const formDataToSend = new FormData(formElement);
      
      const response = await fetch('https://readdy.ai/api/form/d4aj5ek8ldqdu8nb435g', {
        method: 'POST',
        body: new URLSearchParams(formDataToSend as any),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.ok) {
        setSubmitStatus('success');
        setEmail('');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#1e3a5f] text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="https://static.readdy.ai/image/4867812d68f52f9487efa6b073c734c5/c7708e33a2909e4ab006824ee8ce083c.png"
                alt="iMediaCorp Logo"
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Trusted IT partner since 1994, providing tailored solutions for businesses and homes across Canada and internationally. Pioneering CHADD methodology for universal diagnostic intelligence.
            </p>
            <div className="flex space-x-4">
              <a href="https://linkedin.com/company/intermedia-communications" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-[#d4af37] transition-colors cursor-pointer">
                <i className="ri-linkedin-fill text-lg"></i>
              </a>
              <a href="https://github.com/imediacorp" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-[#d4af37] transition-colors cursor-pointer">
                <i className="ri-github-fill text-lg"></i>
              </a>
              <a href="mailto:info@imediacorp.com" className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-[#d4af37] transition-colors cursor-pointer">
                <i className="ri-mail-fill text-lg"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollToSection('about')} className="text-gray-300 hover:text-[#d4af37] transition-colors text-sm cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <a href="/who-we-are" className="text-gray-300 hover:text-[#d4af37] transition-colors text-sm cursor-pointer">
                  Leadership Team
                </a>
              </li>
              <li>
                <button onClick={() => scrollToSection('recruitment')} className="text-gray-300 hover:text-[#d4af37] transition-colors text-sm cursor-pointer">
                  Careers
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('global-presence')} className="text-gray-300 hover:text-[#d4af37] transition-colors text-sm cursor-pointer">
                  Global Network
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-[#d4af37] transition-colors text-sm cursor-pointer">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/chadd-diagnostic-suite" className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  CHADD Diagnostic Suite
                </a>
              </li>
              <li>
                <a href="/rhapsode-creative-suite" className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  Rhapsode Creative Suite
                </a>
              </li>
              <li>
                <a href="/composite-patient-generator" className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  Composite Patient Generator
                </a>
              </li>
              <li>Medical Diagnostics</li>
              <li>Industrial IoT Solutions</li>
              <li>Energy Grid Management</li>
              <li>Financial Risk Analysis</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-300 text-sm mb-4">Stay updated with our latest innovations and research</p>
            <form id="newsletter-form" data-readdy-form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-sm"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#d4af37] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#c19b2f] transition-colors cursor-pointer whitespace-nowrap text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
              {submitStatus === 'success' && (
                <p className="text-green-400 text-xs">Successfully subscribed!</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-400 text-xs">Error. Please try again.</p>
              )}
            </form>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-white/20 pt-8 mb-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
            <a href="#" className="hover:text-[#d4af37] transition-colors cursor-pointer">Privacy Policy</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors cursor-pointer">Terms of Service</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors cursor-pointer">Cookie Policy</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors cursor-pointer">Accessibility</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors cursor-pointer">Security</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors cursor-pointer">Sitemap</a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-gray-300 text-sm text-center lg:text-left">
              <p className="mb-2">© 2025 Intermedia Communications Corp. All rights reserved.</p>
              <p className="text-xs leading-relaxed">
                CHADD/HDPD™, Rhapsode™, and Composite Patient Generator™ are trademarks of Intermedia Communications Corp. 
                Patent applications pending. All technologies and methodologies are proprietary and protected by copyright.
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-xs text-gray-400">
                <p>Toronto, ON • Vancouver, BC • Montreal, QC</p>
                <p>Serving Canada & International Markets</p>
              </div>
              <a 
                href="https://readdy.ai/?origin=logo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#d4af37] text-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                Website Builder
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
