/**
 * Dashboard Layout Component
 * Main wrapper for domain dashboards
 * Enhanced with authentication support
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import Link from 'next/link';
import { DashboardFooter } from './DashboardFooter';

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  domain: string;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function DashboardLayout({
  title,
  subtitle,
  domain,
  children,
  sidebar,
}: DashboardLayoutProps) {
  const { user, signOut } = useSupabaseAuth();
  const { isOnline, queueSize } = useOfflineStatus();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 md:space-x-8 flex-1 min-w-0">
              {/* Mobile Menu Button */}
              {isMobile && sidebar && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 touch-manipulation"
                  aria-label="Toggle menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              
              <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
                <Link 
                  href="#" 
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                  aria-label="CHaDD"
                >
                  <span className="text-xl md:text-2xl font-serif font-semibold text-blue-900" style={{ fontFamily: 'serif' }}>
                    CHaDD<sup className="text-xs align-super">™</sup>
                  </span>
                </Link>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">{title}</h1>
                {subtitle && !isMobile && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Offline Status Indicator */}
              {!isOnline && (
                <div className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
                  {!isMobile && <span>Offline</span>}
                  {queueSize > 0 && (
                    <span className="ml-1">({queueSize})</span>
                  )}
                </div>
              )}
              {isOnline && queueSize > 0 && (
                <div className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                  {!isMobile && <span>Syncing</span>}
                  <span>({queueSize})</span>
                </div>
              )}
              {!isMobile && (
                <>
                  <Link
                    href="/docs/chadd-methodology"
                    className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Documentation
                  </Link>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {domain}
                  </span>
                </>
              )}
              {user && (
                <div className="flex items-center space-x-2 md:space-x-4">
                  {!isMobile && <span className="text-sm text-gray-600">{user.email}</span>}
                  <button
                    onClick={signOut}
                    className="text-sm text-gray-600 hover:text-gray-900 p-2 md:p-0 touch-manipulation"
                    aria-label="Logout"
                  >
                    {isMobile ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    ) : (
                      'Logout'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebar && sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-50 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {sidebar}
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          <div className="flex gap-4 md:gap-8">
            {/* Desktop Sidebar */}
            {sidebar && !isMobile && (
              <aside className="w-64 flex-shrink-0">
                <div className="sticky top-8">{sidebar}</div>
              </aside>
            )}

            {/* Main Content Area */}
            <main className={`flex-1 ${sidebar && !isMobile ? '' : 'w-full'}`}>{children}</main>
          </div>
        </div>
      </div>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
