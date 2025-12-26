/**
 * Homepage
 * Main marketing homepage for imediacorp.com
 */

import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import { Navigation } from '@/components/marketing/Navigation';
import { Footer } from '@/components/marketing/Footer';
import { Hero } from '@/components/marketing/Hero';
import { DomainGrid } from '@/components/marketing/DomainGrid';
import { CTASection } from '@/components/marketing/CTASection';
import { PhilosophySection } from '@/components/marketing/PhilosophySection';
import { domains } from '@/lib/content/domains';

export const metadata: Metadata = genMeta({
  title: 'CHaDD™: Universal Diagnostic Intelligence',
  description:
    'Autonomous, cross-domain diagnostics leveraging harmonic, musical, and mathematical logic. Production-ready dashboards across 16+ domains including medical, energy, finance, and industrial.',
  keywords: [
    'autonomous diagnostics',
    'universal diagnostic platform',
    'CHADD diagnostics',
    'predictive maintenance',
    'system health monitoring',
    'cross-domain diagnostics',
  ],
  ogType: 'website',
});

export default function HomePage() {
  const productionDomains = domains.filter((d) => d.status === 'production');

  return (
    <>
      <Navigation />
      <main>
        <Hero
          headline="CHaDD™: Universal Diagnostic Intelligence"
          subheadline="Autonomous, cross-domain diagnostics leveraging harmonic, musical, and mathematical logic"
          description="The only universal diagnostic platform that adapts entirely without human intervention, uncovering both subtle and catastrophic system weaknesses in real time across any environment."
          primaryCTA={{
            text: 'Launch Dashboards',
            href: '/dashboards',
          }}
          secondaryCTA={{
            text: 'View Products',
            href: '/products',
          }}
          visual={
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-blue-900 font-semibold">16+ Production-Ready Domains</p>
              <p className="text-blue-700 text-sm mt-2">Interactive dashboards ready to use</p>
            </div>
          }
        />

        {/* Quick Access to Dashboards */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Ready to Use CHADD Dashboards?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Access interactive diagnostic tools for portfolio risk, medical monitoring, energy systems, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/dashboards"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-lg text-white bg-transparent hover:bg-white hover:text-blue-600 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                aria-label="View all CHADD dashboards"
              >
                View All Dashboards
              </a>
              <a
                href="/dashboards/portfolio-risk"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-lg text-white bg-white text-blue-600 hover:bg-blue-50 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                aria-label="Try Portfolio Risk Dashboard"
              >
                Try Portfolio Risk Dashboard
              </a>
            </div>
            <p className="mt-6 text-sm opacity-75">
              No sign-up required • Sample data available • Works offline
            </p>
          </div>
        </section>

        {/* Our Philosophy */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-block text-5xl mb-4">⚖️</div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 mb-4">
                Guided by Ma'at
              </h2>
              <p className="text-xl text-gray-700 font-medium mb-4 max-w-3xl mx-auto">
                imediacorp balances science, creativity, and sustainability into one unified dance
              </p>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                Our philosophy shapes everything we build—from our products to our governance model.
                We believe in balance, unity, and harmony in all that we do.
              </p>
              <a
                href="/philosophy"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Learn more about our philosophy →
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                <div className="text-4xl mb-3">⚖️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Balance</h3>
                <p className="text-gray-600 text-sm">
                  Scientific rigor balanced with creative innovation, purpose with profit
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                <div className="text-4xl mb-3">🌐</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Unity</h3>
                <p className="text-gray-600 text-sm">
                  Universal framework unifies diagnostics across all domains
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                <div className="text-4xl mb-3">🎵</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Harmony</h3>
                <p className="text-gray-600 text-sm">
                  Tools serve people, creating harmony between technology and human judgment
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 mb-4">
                Why CHADD?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Autonomy</h3>
                <p className="text-gray-600">
                  Self-calibrating and learning. No manual tuning required. Adapts entirely without
                  human intervention. Tools serve people—AI amplifies judgment, doesn't replace
                  it.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🌐</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Universality</h3>
                <p className="text-gray-600">
                  Operates across any industry, system, or geographic market. 16+ domains with the
                  same universal framework—unity in diversity.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Market-Ready</h3>
                <p className="text-gray-600">
                  Production-ready dashboards across all domains. Fully modular, highly portable,
                  and robust. Sustainable profits from meaningful innovation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Overview */}
        <DomainGrid
          domains={productionDomains.slice(0, 6)}
          title="CHADD Suite Products"
          description="Production-ready diagnostic solutions across multiple domains"
          columns={3}
        />

        {/* Creative Technology Products */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 mb-4">
                Creative Technology Suite
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Tools that serve creators—Rhapsode, Harmonia, and Production Desk empower authors,
                composers, and production teams with AI-powered creative intelligence.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {productionDomains
                .filter((d) => d.category === 'Creative Technology')
                .map((domain) => (
                  <div
                    key={domain.id}
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border-2 border-gray-100"
                  >
                    <div className="text-4xl mb-4">{domain.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{domain.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{domain.description}</p>
                    <a
                      href={domain.href}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Learn more →
                    </a>
                  </div>
                ))}
            </div>
            <div className="mt-8 text-center">
              <a
                href="/products"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View all products →
              </a>
            </div>
          </div>
        </section>

        {/* Framework Overview */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 mb-4">
                Universal Diagnostic Framework
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                CHADD uses a universal S/Q/U/D framework that translates domain-specific metrics
                into universal state variables, enabling predictive and prescriptive diagnostics
                across all domains.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 shadow-sm border-2 border-blue-200">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">S - Stability</h3>
                <p className="text-gray-700 text-sm">
                  System's ability to maintain equilibrium under stress—reflecting Ma'at's
                  principle of balance
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 shadow-sm border-2 border-amber-200">
                <h3 className="text-xl font-semibold text-amber-900 mb-2">Q - Coherence</h3>
                <p className="text-gray-700 text-sm">
                  Internal consistency and alignment of system components—unity in diversity
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 shadow-sm border-2 border-green-200">
                <h3 className="text-xl font-semibold text-green-900 mb-2">U - Susceptibility</h3>
                <p className="text-gray-700 text-sm">
                  Vulnerability to external perturbations and control effort—understanding harmony
                  through stress
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 shadow-sm border-2 border-purple-200">
                <h3 className="text-xl font-semibold text-purple-900 mb-2">D - Diagnostic</h3>
                <p className="text-gray-700 text-sm">
                  Composite health score (0-1) summarizing system performance—the harmony of all
                  metrics
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <a
                href="/docs/chadd-methodology"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Learn more about the CHADD methodology →
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection
          headline="Ready to Get Started?"
          description="Request a demo or contact us to learn how CHADD can transform your system diagnostics."
          primaryCTA={{
            text: 'Request Demo',
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

