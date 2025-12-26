/**
 * Dashboards Index Page
 * Main entry point for all CHADD dashboards
 */

'use client';

import { Navigation } from '@/components/marketing/Navigation';
import { Footer } from '@/components/marketing/Footer';
import { domains } from '@/lib/content/domains';
import Link from 'next/link';
import { useState, useMemo } from 'react';

export default function DashboardsPage() {
  // Keep original order from domains array
  // Exclude Ripples from public dashboards listing - it requires authentication
  // and is for sensitive use cases (government, UN, defense, emergency response)
  const productionDomains = domains.filter((d) => d.status === 'production' && d.id !== 'ripples');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter domains based on search and category
  const filteredDomains = useMemo(() => {
    let filtered = productionDomains;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((d) => d.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          d.category?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [productionDomains, searchQuery, selectedCategory]);

  const categories = Array.from(new Set(productionDomains.map((d) => d.category)));
  
  // Map domain IDs to dashboard routes
  // This ensures each domain ID maps to the correct dashboard path
  const getDashboardPath = (domainId: string): string => {
    // Explicit mapping to prevent any routing errors
    const routeMap: Record<string, string> = {
      'medical': '/dashboards/medical',
      'portfolio-risk': '/dashboards/portfolio-risk',
      'grid': '/dashboards/grid',
      'wind': '/dashboards/wind',
      'solar': '/dashboards/solar',
      'software': '/dashboards/software',
      'network': '/dashboards/network',
      'industrial': '/dashboards/industrial-fault',
      'business': '/dashboards/business',
      'personnel': '/dashboards/personnel-health',
      'personnel-health': '/dashboards/personnel-health',
      'cliodynamics': '/dashboards/cliodynamics',
      'geophysical': '/dashboards/geophysical',
      'gas-vehicle': '/dashboards/gas-vehicle',
      'electric-vehicle': '/dashboards/electric-vehicle',
      'aerospace': '/dashboards/aerospace',
      'quantum': '/dashboards/quantum',
      'rhapsode': '/products/rhapsode', // Creative tech - different path
      'harmonia': '/products/harmonia',
      'production-desk': '/products/production-desk',
      'ripples': '/products/ripples', // Cascading effects modeling
    };
    const path = routeMap[domainId];
    if (!path) {
      console.warn(`No dashboard path mapped for domain ID: ${domainId}, using fallback`);
      return `/dashboards/${domainId}`;
    }
    return path;
  };

  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-blue-900 mb-6">
              CHADD Dashboards
            </h1>
            <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto">
              Interactive diagnostic tools for real-time system health analysis
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Access production-ready dashboards across all domains. Each dashboard uses the universal
              S/Q/U/D framework for consistent, cross-domain insights.
            </p>
          </div>
        </section>

        {/* Quick Access Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 mb-4">
                Available Dashboards
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Click any dashboard to launch the interactive diagnostic tool
              </p>
            </div>
            {/* Search and Filter Bar */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full sm:max-w-md">
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                    <input
                      type="text"
                      placeholder="Search dashboards..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      id="dashboard-search"
                      aria-label="Search dashboards"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      selectedCategory === null
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    aria-label="Show all categories"
                    aria-pressed={selectedCategory === null}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        setSelectedCategory(selectedCategory === category ? null : category)
                      }
                      className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      aria-label={`Filter by ${category}`}
                      aria-pressed={selectedCategory === category}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              {(searchQuery || selectedCategory) && (
                <div className="mt-4 text-sm text-gray-600">
                  Showing {filteredDomains.length} of {productionDomains.length} dashboards
                  {(searchQuery || selectedCategory) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory(null);
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-700 underline"
                      aria-label="Clear filters"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {filteredDomains.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDomains.map((domain) => {
                // Compute path once per domain to ensure consistency
                const dashboardPath = getDashboardPath(domain.id);
                
                // Verify the mapping is correct (development only)
                if (process.env.NODE_ENV === 'development') {
                  if (domain.id === 'medical' && dashboardPath !== '/dashboards/medical') {
                    console.error(`Medical domain mapping error: expected /dashboards/medical, got ${dashboardPath}`);
                  }
                  if (domain.id === 'wind' && dashboardPath !== '/dashboards/wind') {
                    console.error(`Wind domain mapping error: expected /dashboards/wind, got ${dashboardPath}`);
                  }
                }
                
                // Ensure each link has a unique, stable key and explicit data attributes
                return (
                  <Link
                    key={domain.id}
                    href={dashboardPath}
                    prefetch={true}
                    data-domain-id={domain.id}
                    data-dashboard-path={dashboardPath}
                    className="group bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all"
                    onClick={(e) => {
                      // Verify the link is correct before navigation
                      const targetPath = e.currentTarget.getAttribute('href');
                      if (process.env.NODE_ENV === 'development' && targetPath !== dashboardPath) {
                        console.error(`Link mismatch for ${domain.id}: expected ${dashboardPath}, got ${targetPath}`);
                      }
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl flex-shrink-0" aria-label={domain.name}>
                        {domain.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {domain.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {domain.description}
                        </p>
                        <div className="flex items-center text-blue-600 text-sm font-medium">
                          <span>Launch Dashboard</span>
                          <svg
                            className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No dashboards found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  aria-label="Clear filters"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 mb-4">
                Browse by Category
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const categoryDashboards = productionDomains.filter((d) => d.category === category);
                return (
                  <div key={category} className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{category}</h3>
                    <ul className="space-y-2">
                      {categoryDashboards.map((domain, idx) => {
                        const dashboardPath = getDashboardPath(domain.id);
                        return (
                          <li key={`${category}-${domain.id}-${idx}`}>
                            <Link
                              href={dashboardPath}
                              data-domain-id={domain.id}
                              data-dashboard-path={dashboardPath}
                              className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                            >
                              <span className="mr-2">{domain.icon}</span>
                              {domain.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-serif font-bold text-blue-900 mb-4">
              Getting Started
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-3xl mb-3">1️⃣</div>
                <h3 className="font-semibold text-gray-900 mb-2">Choose a Dashboard</h3>
                <p className="text-sm text-gray-600">
                  Select the domain you want to analyze (portfolio, medical, energy, etc.)
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-3xl mb-3">2️⃣</div>
                <h3 className="font-semibold text-gray-900 mb-2">Load Your Data</h3>
                <p className="text-sm text-gray-600">
                  Upload CSV files, connect to data sources, or use sample data to get started
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-3xl mb-3">3️⃣</div>
                <h3 className="font-semibold text-gray-900 mb-2">Analyze & Act</h3>
                <p className="text-sm text-gray-600">
                  View S/Q/U/D metrics, run stress tests, and get AI-powered insights
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

