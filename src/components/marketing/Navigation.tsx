/**
 * Navigation Component
 * Main navigation for marketing pages
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SearchBar } from './SearchBar';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboards', href: '/dashboards', highlight: true },
    { name: 'Products', href: '/products' },
    { name: 'Services', href: '/services' },
    { name: 'Philosophy', href: '/philosophy' },
    { name: 'About', href: '/about' },
    { name: 'Documentation', href: '/docs/chadd-methodology' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              aria-label="imediacorp Home"
            >
              <span
                className="text-xl font-serif font-semibold text-blue-900"
                style={{ fontFamily: 'serif' }}
              >
                imediacorp
              </span>
              <span className="text-sm text-gray-500">|</span>
              <span
                className="text-xl font-serif font-semibold text-blue-900"
                style={{ fontFamily: 'serif' }}
              >
                CHaDD<sup className="text-xs align-super">™</sup>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  item.highlight
                    ? 'text-blue-600 hover:text-blue-700 font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label={item.name}
              >
                {item.name}
              </Link>
            ))}
            <SearchBar />
            <Link
              href="/contact"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="Request Demo"
            >
              Request Demo
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="px-4">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    // Trigger search on mobile - could open search modal
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg border border-gray-300"
                  aria-label="Search"
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>Search...</span>
                </button>
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 text-base text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={item.name}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 pt-2 border-t border-gray-200">
                <Link
                  href="/contact"
                  className="block w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Request Demo"
                >
                  Request Demo
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}


