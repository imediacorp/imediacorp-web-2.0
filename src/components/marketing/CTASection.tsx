/**
 * CTA Section Component
 * Call-to-action section for marketing pages
 */

import Link from 'next/link';

interface CTASectionProps {
  headline: string;
  description: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  variant?: 'default' | 'blue' | 'gradient';
}

export function CTASection({
  headline,
  description,
  primaryCTA,
  secondaryCTA,
  variant = 'default',
}: CTASectionProps) {
  const variants = {
    default: 'bg-gray-50 border-gray-200',
    blue: 'bg-blue-600 text-white',
    gradient: 'bg-gradient-to-r from-blue-600 to-blue-800 text-white',
  };

  const textColor =
    variant === 'blue' || variant === 'gradient' ? 'text-white' : 'text-gray-900';
  const descColor =
    variant === 'blue' || variant === 'gradient'
      ? 'text-blue-100'
      : 'text-gray-600';

  return (
    <section className={`py-16 ${variants[variant]}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className={`text-3xl md:text-4xl font-serif font-bold mb-4 ${textColor}`}>
          {headline}
        </h2>
        <p className={`text-lg mb-8 ${descColor}`}>{description}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={primaryCTA.href}
            className={`inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl ${
              variant === 'blue' || variant === 'gradient'
                ? 'bg-white text-blue-600 hover:bg-blue-50'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {primaryCTA.text}
          </Link>
          {secondaryCTA && (
            <Link
              href={secondaryCTA.href}
              className={`inline-flex items-center justify-center px-8 py-3 border text-base font-medium rounded-lg transition-colors ${
                variant === 'blue' || variant === 'gradient'
                  ? 'border-white text-white hover:bg-white/10'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              {secondaryCTA.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

