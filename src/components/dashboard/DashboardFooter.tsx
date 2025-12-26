/**
 * Dashboard Footer Component
 * Displays copyright and inventor information
 */

'use client';

import React from 'react';

export function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center text-sm text-gray-600">
          <p>
            Copyright © {currentYear} Edim Systems Group • Inventor: Bryan Persaud
          </p>
          <p className="mt-1 text-xs text-gray-500">
            CHADD Suite (Scientific + Business) • All rights reserved.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Unless a separate LICENSE file is provided, no license is granted to copy, modify, or distribute 
            this software without explicit written permission from the copyright holder.
          </p>
        </div>
      </div>
    </footer>
  );
}

