/**
 * Global Search Bar Component
 * Provides search functionality across dashboards, products, and documentation
 */

'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { domains } from '@/lib/content/domains';
import Link from 'next/link';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  href: string;
  type: 'dashboard' | 'product' | 'page';
  category?: string;
}

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Search results
  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search domains/dashboards
    domains.forEach((domain) => {
      const matchesName = domain.name.toLowerCase().includes(lowerQuery);
      const matchesDesc = domain.description.toLowerCase().includes(lowerQuery);
      const matchesCategory = domain.category?.toLowerCase().includes(lowerQuery);

      if (matchesName || matchesDesc || matchesCategory) {
        const dashboardPath =
          domain.category === 'Creative Technology'
            ? domain.href
            : `/dashboards/${domain.id === 'personnel-health' ? 'personnel-health' : domain.id}`;

        searchResults.push({
          id: domain.id,
          title: domain.name,
          description: domain.description,
          href: dashboardPath,
          type: domain.category === 'Creative Technology' ? 'product' : 'dashboard',
          category: domain.category,
        });
      }
    });

    // Search pages
    const pages: SearchResult[] = [
      {
        id: 'philosophy',
        title: 'Philosophy',
        description: 'Learn about our Ma\'at philosophy and governance model',
        href: '/philosophy',
        type: 'page',
      },
      {
        id: 'about',
        title: 'About Us',
        description: 'Learn about imediacorp and our mission',
        href: '/about',
        type: 'page',
      },
      {
        id: 'products',
        title: 'Products',
        description: 'View all CHADD Suite products',
        href: '/products',
        type: 'page',
      },
      {
        id: 'dashboards',
        title: 'Dashboards',
        description: 'Access all CHADD diagnostic dashboards',
        href: '/dashboards',
        type: 'page',
      },
    ];

    pages.forEach((page) => {
      if (
        page.title.toLowerCase().includes(lowerQuery) ||
        page.description.toLowerCase().includes(lowerQuery)
      ) {
        searchResults.push(page);
      }
    });

    return searchResults.slice(0, 8); // Limit to 8 results
  }, [query]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
        setSelectedIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Handle keyboard navigation in results
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        router.push(results[selectedIndex].href);
        setIsOpen(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, router]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleResultClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* Search Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
        aria-label="Search (Cmd+K)"
      >
        <svg
          className="w-4 h-4"
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
        <span className="hidden lg:inline">Search</span>
        <kbd className="hidden lg:inline-flex items-center px-2 py-1 text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
              setQuery('');
            }
          }}
        >
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl border border-gray-200">
            {/* Search Input */}
            <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
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
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dashboards, products, pages..."
                className="flex-1 outline-none text-gray-900 placeholder-gray-400"
                autoFocus
                aria-label="Search input"
              />
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {results.length > 0 ? (
                <ul role="listbox" aria-label="Search results">
                  {results.map((result, index) => (
                    <li
                      key={result.id}
                      role="option"
                      aria-selected={index === selectedIndex}
                    >
                      <button
                        type="button"
                        onClick={() => handleResultClick(result.href)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                          index === selectedIndex ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-semibold text-gray-900">
                                {result.title}
                              </span>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                {result.type}
                              </span>
                              {result.category && (
                                <span className="text-xs text-gray-400">{result.category}</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {result.description}
                            </p>
                          </div>
                          <svg
                            className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : query.trim() ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <p className="text-sm">No results found for &quot;{query}&quot;</p>
                  <p className="text-xs mt-2">Try a different search term</p>
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  <p className="text-sm">Start typing to search...</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-gray-100 rounded">Dashboards</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Products</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Documentation</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

