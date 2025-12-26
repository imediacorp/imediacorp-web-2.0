/**
 * Footer Component
 * Footer for marketing pages
 */

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Products: [
      { name: 'CHADD Suite', href: '/products' },
      { name: 'Portfolio Risk', href: '/products/portfolio-risk' },
      { name: 'Medical Monitoring', href: '/products/medical' },
      { name: 'Rhapsode', href: '/products/rhapsode' },
      { name: 'Harmonia', href: '/products/harmonia' },
      { name: 'Production Desk', href: '/products/production-desk' },
    ],
    Services: [
      { name: 'SaaS Platform', href: '/services#saas' },
      { name: 'Enterprise Licensing', href: '/services#enterprise' },
      { name: 'OEM Integration', href: '/services#oem' },
      { name: 'Consulting', href: '/services#consulting' },
    ],
    Resources: [
      { name: 'Documentation', href: '/docs/chadd-methodology' },
      { name: 'API Reference', href: '/docs/api' },
      { name: 'Case Studies', href: '/blog' },
      { name: 'Support', href: '/contact' },
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Philosophy', href: '/philosophy' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex flex-col space-y-1 mb-4"
              aria-label="imediacorp Home"
            >
              <span
                className="text-xl font-serif font-semibold text-white"
                style={{ fontFamily: 'serif' }}
              >
                imediacorp
              </span>
              <span
                className="text-lg font-serif font-semibold text-gray-300"
                style={{ fontFamily: 'serif' }}
              >
                CHaDD<sup className="text-xs align-super">™</sup>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-2">
              Intermedia Communications Corp
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Guided by Ma'at—Balance, Unity, Harmony
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <nav key={category} aria-labelledby={`footer-${category.toLowerCase()}`}>
              <h3 id={`footer-${category.toLowerCase()}`} className="text-white font-semibold mb-4">
                {category}
              </h3>
              <ul className="space-y-2" role="list">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 text-center md:text-left">
              Copyright © {currentYear} Intermedia Communications Corp • Inventor: Bryan Persaud
            </p>
            <p className="text-xs text-gray-500 mt-2 md:mt-0 text-center md:text-right">
              CHADD Suite (Scientific + Business) • Creative Technology Suite (Rhapsode, Harmonia, Production Desk) • All rights reserved.
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Tools serve people, profits follow innovation • Scientific integrity: Innovation that
            matters must withstand science
          </p>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 mb-2">
              Accessibility monitoring powered by{' '}
              <a
                href="https://sitelint.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                aria-label="SiteLint - Accessibility monitoring (opens in new tab)"
              >
                SiteLint
              </a>
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Unless a separate LICENSE file is provided, no license is granted to copy, modify, or
            distribute this software without explicit written permission from the copyright holder.
          </p>
        </div>
      </div>
    </footer>
  );
}


