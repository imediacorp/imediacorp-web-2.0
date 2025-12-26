/**
 * 404 Not Found Page
 * Helpful 404 page with search and navigation
 */

import Link from 'next/link';
import { Navigation } from '@/components/marketing/Navigation';
import { Footer } from '@/components/marketing/Footer';

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center">
            <div className="mb-8">
              <h1 className="text-9xl font-serif font-bold text-blue-600 mb-4">404</h1>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                Page not found
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Link
                href="/dashboards"
                className="p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all text-left"
                aria-label="View all dashboards"
              >
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold text-gray-900 mb-1">View Dashboards</h3>
                <p className="text-sm text-gray-600">Access all CHADD diagnostic dashboards</p>
              </Link>
              <Link
                href="/products"
                className="p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all text-left"
                aria-label="View all products"
              >
                <div className="text-3xl mb-2">🚀</div>
                <h3 className="font-semibold text-gray-900 mb-1">View Products</h3>
                <p className="text-sm text-gray-600">Explore all CHADD Suite products</p>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Go to homepage"
              >
                Go to homepage
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                aria-label="Contact support"
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
