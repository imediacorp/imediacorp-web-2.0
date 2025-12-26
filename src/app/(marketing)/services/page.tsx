/**
 * Services Page
 * Overview of CHADD Suite services
 */

import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import { Navigation } from '@/components/marketing/Navigation';
import { Footer } from '@/components/marketing/Footer';
import { CTASection } from '@/components/marketing/CTASection';
import Script from 'next/script';

export const metadata: Metadata = genMeta({
  title: 'CHADD Suite Services',
  description:
    'SaaS platform access, enterprise licensing, OEM integration, custom dashboard development, and consulting services for CHADD Suite.',
  keywords: [
    'CHADD services',
    'SaaS platform',
    'enterprise licensing',
    'OEM integration',
    'diagnostic consulting',
    'custom dashboards',
  ],
});

const services = [
  {
    id: 'saas',
    name: 'SaaS Platform Access',
    description:
      'Cloud-based access to CHADD Suite dashboards with multi-tenant support, real-time monitoring, and AI-powered insights.',
    features: [
      'Multi-tenant SaaS architecture',
      'Real-time data processing',
      'AI advisor with GraphRAG',
      'Mobile-optimized interface',
      'API access for integrations',
      'Scalable cloud infrastructure',
    ],
    pricing: 'Starting at $600/year',
    icon: '☁️',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Licensing',
    description:
      'On-premise or private cloud deployment with custom configurations, dedicated support, and enterprise-grade security.',
    features: [
      'On-premise or private cloud',
      'Custom domain configurations',
      'Dedicated support team',
      'Enterprise-grade security',
      'SLA guarantees',
      'Custom integrations',
    ],
    pricing: 'Custom pricing',
    icon: '🏢',
  },
  {
    id: 'oem',
    name: 'OEM Integration',
    description:
      'Embed CHADD diagnostics into your products with OEM licensing, SDK access, and white-label options.',
    features: [
      'Embedded diagnostics SDK',
      'White-label options',
      'Custom branding',
      'Per-unit licensing',
      'Technical support',
      'Co-marketing opportunities',
    ],
    pricing: '$50-$500/unit',
    icon: '🔧',
  },
  {
    id: 'consulting',
    name: 'Consulting & Implementation',
    description:
      'Expert consulting for CHADD implementation, custom dashboard development, and domain-specific optimizations.',
    features: [
      'Implementation consulting',
      'Custom dashboard development',
      'Domain-specific tuning',
      'Training and onboarding',
      'Best practices guidance',
      'Ongoing support',
    ],
    pricing: 'Project-based',
    icon: '💡',
  },
];

export default function ServicesPage() {
  // Generate structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'CHADD Suite Services',
    description: 'Services for CHADD diagnostic platform',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        provider: {
          '@type': 'Organization',
          name: 'Edim Systems Group',
        },
        areaServed: 'Worldwide',
        serviceType: service.name,
      },
    })),
  };

  return (
    <>
      <Script
        id="services-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navigation />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-blue-900 mb-6">
              CHADD Suite Services
            </h1>
            <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto">
              Flexible deployment options to meet your needs
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From SaaS platform access to enterprise licensing and OEM integration, we offer
              solutions for every use case.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  id={service.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-5xl">{service.icon}</div>
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900">{service.name}</h2>
                        <p className="text-blue-600 font-medium mt-1">{service.pricing}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Features:</h3>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <span className="text-blue-600 mr-2">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 mb-4">
                Service Comparison
              </h2>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feature
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SaaS Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enterprise
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      OEM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Consulting
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Deployment
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Cloud</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      On-premise/Private Cloud
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Embedded</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Custom</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Customization
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Limited</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Full</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Full</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Full</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Support
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Standard</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Dedicated</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Technical</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Project</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Pricing Model
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      Subscription
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">License</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Per-unit</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Project</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <CTASection
          headline="Ready to Get Started?"
          description="Contact us to discuss which service option is right for your needs."
          primaryCTA={{
            text: 'Contact Us',
            href: '/contact',
          }}
          secondaryCTA={{
            text: 'View Products',
            href: '/products',
          }}
          variant="blue"
        />
      </main>
      <Footer />
    </>
  );
}

