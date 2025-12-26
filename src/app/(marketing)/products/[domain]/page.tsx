/**
 * Product Detail Page
 * Individual product/domain detail page
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateMetadata as genMeta } from '@/lib/seo';
import { Navigation } from '@/components/marketing/Navigation';
import { Footer } from '@/components/marketing/Footer';
import { CTASection } from '@/components/marketing/CTASection';
import { getDomainById, domains } from '@/lib/content/domains';
import Script from 'next/script';

interface ProductPageProps {
  params: {
    domain: string;
  };
}

export async function generateStaticParams() {
  return domains.map((domain) => ({
    domain: domain.id,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const domain = getDomainById(params.domain);
  if (!domain) {
    return genMeta({
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    });
  }

  return genMeta({
    title: `${domain.name} - CHADD Suite`,
    description: domain.description,
    keywords: [domain.name, domain.category, 'CHADD', 'diagnostic'],
  });
}

export default function ProductPage({ params }: ProductPageProps) {
  const domain = getDomainById(params.domain);

  if (!domain) {
    notFound();
  }

  // Generate structured data
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: domain.name,
    description: domain.description,
    category: domain.category,
    url: `https://imediacorp.com${domain.href}`,
    brand: {
      '@type': 'Brand',
      name: 'CHaDD™',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Edim Systems Group',
    },
  };

  return (
    <>
      <Script
        id="product-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Navigation />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-6xl">{domain.icon}</div>
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-2">
                  {domain.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-blue-900">
                  {domain.name}
                </h1>
              </div>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl">{domain.description}</p>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Status</h2>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    domain.status === 'production'
                      ? 'bg-green-100 text-green-800'
                      : domain.status === 'prototype'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {domain.status === 'production'
                    ? 'Production Ready'
                    : domain.status === 'prototype'
                    ? 'Prototype'
                    : 'Coming Soon'}
                </span>
              </div>
              {domain.marketSize && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Market Size</h2>
                  <p className="text-gray-600">{domain.marketSize}</p>
                </div>
              )}
            </div>

            {domain.features && domain.features.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Key Features</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {domain.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">CHADD Framework</h2>
              <p className="text-gray-600 mb-4">
                This product uses the universal CHADD S/Q/U/D framework, enabling cross-domain
                insights and unified diagnostics.
              </p>
              <a
                href="/docs/chadd-methodology"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Learn more about CHADD methodology →
              </a>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-blue-900 mb-8 text-center">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {domains
                .filter((d) => d.category === domain.category && d.id !== domain.id)
                .slice(0, 3)
                .map((related) => (
                  <a
                    key={related.id}
                    href={related.href}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="text-4xl mb-4">{related.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{related.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{related.description}</p>
                  </a>
                ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <CTASection
          headline="Interested in This Product?"
          description="Contact us to learn more about implementation, licensing, or custom solutions."
          primaryCTA={{
            text: 'Contact Us',
            href: '/contact',
          }}
          secondaryCTA={{
            text: 'View All Products',
            href: '/products',
          }}
          variant="blue"
        />
      </main>
      <Footer />
    </>
  );
}

