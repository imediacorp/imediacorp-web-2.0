/**
 * About Page
 * Company information and mission
 */

import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import { Navigation } from '@/components/marketing/Navigation';
import { Footer } from '@/components/marketing/Footer';
import { CTASection } from '@/components/marketing/CTASection';
import { PhilosophySection } from '@/components/marketing/PhilosophySection';
import { GovernanceCard } from '@/components/marketing/GovernanceCard';
import Script from 'next/script';

export const metadata: Metadata = genMeta({
  title: 'About imediacorp | Intermedia Communications Corp',
  description:
    'Intermedia Communications Corp (imediacorp) develops CHADD with Ma\'at philosophy—balance, unity, and harmony. Learn about our cooperative governance, employee ownership, and commitment to tools that serve people.',
  keywords: [
    'imediacorp',
    'Intermedia Communications Corp',
    'CHADD',
    'Ma\'at philosophy',
    'cooperative governance',
    'employee ownership',
    'about',
  ],
});

export default function AboutPage() {
  // Generate structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Intermedia Communications Corp',
    alternateName: 'imediacorp',
    url: 'https://imediacorp.com',
    description:
      'Intermedia Communications Corp (imediacorp) develops CHADD with Ma\'at philosophy—balance, unity, and harmony. Cooperative governance, employee ownership, and tools that serve people.',
    founder: {
      '@type': 'Person',
      name: 'Bryan Persaud',
    },
  };

  return (
    <>
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Navigation />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-blue-900 mb-6">
              About imediacorp
            </h1>
            <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto font-medium">
              Intermedia Communications Corp
            </p>
            <p className="text-lg text-gray-600 mb-4 max-w-3xl mx-auto">
              Guided by Ma'at—balancing science, creativity, and sustainability into one unified
              dance
            </p>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 mb-4">
                Our Philosophy
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Ma'at: Balance, Unity, Harmony—these principles guide everything we do.
              </p>
            </div>
            <PhilosophySection />
          </div>
        </section>

        {/* Governance */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 mb-4">
                Cooperative Governance
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our governance model reflects our philosophy—shared ownership, balanced
                decision-making, and sustainable growth.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <GovernanceCard
                title="Cooperative Structure"
                description="Employee co-ownership model ensures that those who build the company share in its success. Decisions are made collaboratively, balancing diverse perspectives."
                icon="🤝"
              />
              <GovernanceCard
                title="Chief Balance Officer"
                description="A unique governance role ensuring that all decisions maintain balance—between innovation and stability, growth and sustainability, profit and purpose."
                icon="⚖️"
              />
              <GovernanceCard
                title="Employee Ownership"
                description="Shared ownership means shared responsibility and shared rewards. Our team members are not just employees—they are co-owners and co-creators."
                icon="👥"
              />
            </div>
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-xl text-gray-700 font-medium mb-4">
                "Tools serve people, profits follow innovation"
              </p>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our commitment is to build tools that genuinely serve people. When we focus on
                purpose and meaningful innovation, sustainable profits follow naturally.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-blue-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-4">
              Intermedia Communications Corp (imediacorp) develops and licenses CHADD (Comprehensive
              Harmonic Dynamic Diagnostics), a game-changing autonomous diagnostic platform that
              leverages harmonic, musical, and mathematical logic for dynamic, multi-dimensional
              system health analysis.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Unlike legacy diagnostics, CHADD adapts entirely without human intervention,
              uncovering both subtle and catastrophic system weaknesses in real time across any
              environment. Guided by Ma'at—balance, unity, and harmony—we build tools that serve
              people.
            </p>
            <p className="text-lg text-gray-700">
              We are committed to scientific integrity, cooperative governance, and sustainable
              innovation. Profit is the outcome of purpose, and our purpose is to advance universal
              diagnostic intelligence that makes a meaningful difference.
            </p>
          </div>
        </section>

        {/* Vision */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-blue-900 mb-6">Our Vision</h2>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Universal Framework</h3>
                <p className="text-gray-700">
                  CHADD uses the same S/Q/U/D (Stability, Quality/Coherence, Utilization,
                  Dissonance) framework across all domains, enabling cross-domain insights and
                  unified diagnostics. This reflects Ma'at's principle of unity—one language for all
                  diagnostics.
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border-2 border-amber-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Platform Model</h3>
                <p className="text-gray-700">
                  We deploy CHADD as a core licensed technology, leveraging SaaS, OEM, and embedded
                  solutions. Sustainable profits follow meaningful innovation—balance between
                  business success and purpose.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-2 border-green-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Vertical Integration</h3>
                <p className="text-gray-700">
                  Clinical, industrial, and infrastructure sectors addressed in parallel, each with
                  tailored applications meeting regulatory and operational standards. Harmony across
                  diverse domains.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Innovation */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-blue-900 mb-6">Core Innovation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Musical-Dissonance Theory
                </h3>
                <p className="text-gray-600">
                  Plomp-Levelt psychoacoustic model applied to diagnostics, enabling real-time
                  dissonance calculations for anomaly detection.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Rondo Protocol</h3>
                <p className="text-gray-600">
                  Structured A-B-A-C-A testing pattern that tests system recovery and adaptation
                  under stress.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Lyapunov Stability</h3>
                <p className="text-gray-600">
                  Mathematical rigor with provable convergence, ensuring reliable and accurate
                  diagnostics.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Autonomy</h3>
                <p className="text-gray-600">
                  Self-calibrating and learning system that requires no manual tuning, adapting
                  entirely without human intervention.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scientific Integrity */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-blue-900 mb-6 text-center">
              Scientific Integrity
            </h2>
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <p className="text-xl text-gray-700 font-medium mb-6 text-center">
                "Innovation that matters must withstand science."
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sound Science</h3>
                  <p className="text-gray-600">
                    All procedures, methodologies, and practices are evidence-based and rigorously
                    tested.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Falsifiability</h3>
                  <p className="text-gray-600">
                    We design innovations to be tested, challenged, and proven—not just accepted.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Reproducibility</h3>
                  <p className="text-gray-600">
                    Results can be replicated across contexts and domains, ensuring reliability and
                    credibility.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Hype</h3>
                  <p className="text-gray-600">
                    No cherry-picked data, no inflated claims—only what stands up to scrutiny and
                    peer review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <CTASection
          headline="Join Us in Building the Future"
          description="Interested in partnering, licensing, or learning more? Get in touch."
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

