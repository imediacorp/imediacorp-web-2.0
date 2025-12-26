/**
 * Hero Component
 * Main hero section for marketing pages
 */

import Link from 'next/link';

interface HeroProps {
  headline: string;
  subheadline: string;
  description?: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  visual?: React.ReactNode;
}

export function Hero({
  headline,
  subheadline,
  description,
  primaryCTA,
  secondaryCTA,
  visual,
}: HeroProps) {
  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-blue-900 mb-6">
              {headline}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-4 font-medium">
              {subheadline}
            </p>
            {description && (
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                {description}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {primaryCTA && (
                <Link
                  href={primaryCTA.href}
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={primaryCTA.text}
                >
                  {primaryCTA.text}
                </Link>
              )}
              {secondaryCTA && (
                <Link
                  href={secondaryCTA.href}
                  className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={secondaryCTA.text}
                >
                  {secondaryCTA.text}
                </Link>
              )}
            </div>
          </div>
          {/* Visual */}
          {visual && (
            <div className="flex items-center justify-center">
              <div className="w-full max-w-lg">{visual}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

