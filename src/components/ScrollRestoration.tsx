/**
 * Scroll Restoration Component
 * Handles scroll restoration for Next.js App Router with sticky headers
 */

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    // Handle scroll restoration for pages with sticky headers
    // Next.js will skip auto-scroll when it detects sticky/fixed elements,
    // which is actually the correct behavior. We just need to scroll to top
    // manually when navigating to a new page.
    const handleRouteChange = () => {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          // Scroll to top of main content (accounting for sticky header)
          const headerHeight = 64; // h-16 = 64px
          window.scrollTo({
            top: 0,
            behavior: 'instant', // Use instant to avoid animation conflicts
          });
        }
      }, 0);
    };

    handleRouteChange();
  }, [pathname]);

  return null;
}

