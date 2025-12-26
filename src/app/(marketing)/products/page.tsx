/**
 * Products Page
 * Overview of all CHADD Suite products
 */

import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import { Navigation } from '@/components/marketing/Navigation';
import { Footer } from '@/components/marketing/Footer';
import { DomainGrid } from '@/components/marketing/DomainGrid';
import { CTASection } from '@/components/marketing/CTASection';
import { domains, domainCategories } from '@/lib/content/domains';
import Script from 'next/script';

export const metadata: Metadata = genMeta({
  title: 'CHADD Suite Products',
  description:
    'Explore production-ready CHADD diagnostic solutions across 16+ domains: medical monitoring, portfolio risk management, energy monitoring, industrial IoT, and more.',
  keywords: [
    'CHADD products',
    'diagnostic software',
    'medical monitoring',
    'portfolio risk management',
    'energy monitoring',
    'industrial IoT',
    'predictive maintenance',
  ],
});

export default function ProductsPage() {
  const productionDomains = domains.filter((d) => d.status === 'production');
  const prototypeDomains = domains.filter((d) => d.status === 'prototype');

  // Generate structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'CHADD Suite Products',
    description: 'Universal diagnostic platform products across 16+ domains',
    itemListElement: domains.map((domain, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: domain.name,
        description: domain.description,
        category: domain.category,
        url: `https://imediacorp.com${domain.href}`,
      },
    })),
  };

  return (
    <>
      <Script
        id="products-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navigation />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-blue-900 mb-6">
              CHADD Suite Products
            </h1>
            <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto">
              Universal diagnostic intelligence across 16+ domains, plus creative technology tools
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              CHADD products use the same S/Q/U/D framework, enabling cross-domain insights and
              unified diagnostics. Our Creative Technology Suite (Rhapsode, Harmonia, Production
              Desk) extends this philosophy to creative workflows.
            </p>
          </div>
        </section>

        {/* Production-Ready Products */}
        <DomainGrid
          domains={productionDomains}
          title="Production-Ready Products"
          description="Fully validated and market-ready diagnostic solutions"
          columns={3}
        />

        {/* Prototype Products */}
        {prototypeDomains.length > 0 && (
          <section className="py-16 bg-gray-50">
            <DomainGrid
              domains={prototypeDomains}
              title="Prototype Products"
              description="Products in development with test protocols defined"
              columns={3}
            />
          </section>
        )}

        {/* Categories */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 mb-4">
                Products by Category
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {domainCategories.map((category) => {
                const categoryDomains = domains.filter((d) => d.category === category);
                if (categoryDomains.length === 0) return null;
                return (
                  <div key={category} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{category}</h3>
                    <ul className="space-y-2">
                      {categoryDomains.map((domain) => (
                        <li key={domain.id}>
                          <a
                            href={domain.href}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            {domain.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <CTASection
          headline="Interested in a Specific Product?"
          description="Contact us to learn more about implementation, licensing, or custom solutions."
          primaryCTA={{
            text: 'Contact Us',
            href: '/contact',
          }}
          secondaryCTA={{
            text: 'View Services',
            href: '/services',
          }}
        />
      </main>
      <Footer />
    </>
  );
}

