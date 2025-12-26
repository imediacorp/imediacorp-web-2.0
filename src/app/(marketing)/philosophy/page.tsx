/**
 * Philosophy Page
 * Dedicated page explaining Ma'at and imediacorp values
 */

import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import { Navigation } from '@/components/marketing/Navigation';
import { Footer } from '@/components/marketing/Footer';
import { CTASection } from '@/components/marketing/CTASection';
import { PhilosophySection } from '@/components/marketing/PhilosophySection';
import { GovernanceCard } from '@/components/marketing/GovernanceCard';
import { ValuesGrid } from '@/components/marketing/ValuesGrid';

export const metadata: Metadata = genMeta({
  title: 'Our Philosophy - Ma\'at: Balance, Unity, Harmony | imediacorp',
  description:
    'Guided by Ma\'at—imediacorp balances science, creativity, and sustainability into one unified dance. Learn about our cooperative governance, core values, and commitment to tools that serve people.',
  keywords: [
    'Ma\'at philosophy',
    'balance unity harmony',
    'cooperative governance',
    'tools serve people',
    'sustainable innovation',
    'scientific integrity',
    'imediacorp values',
  ],
});

export default function PhilosophyPage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <div className="inline-block text-6xl mb-4">⚖️</div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-blue-900 mb-6">
              Guided by Ma'at
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 mb-4 max-w-4xl mx-auto font-medium">
              imediacorp balances science, creativity, and sustainability into one unified dance
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our philosophy shapes everything we build—from our products to our governance model.
              We believe in balance, unity, and harmony in all that we do.
            </p>
          </div>
        </section>

        {/* Ma'at Philosophy */}
        <PhilosophySection />

        {/* Governance Model */}
        <section className="py-16 bg-white">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 mb-4">
                Our Core Values
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                These principles guide every decision, every product, and every interaction.
              </p>
            </div>
            <ValuesGrid />
          </div>
        </section>

        {/* Scientific Integrity */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-block text-5xl mb-4">🔬</div>
                <h2 className="text-3xl font-serif font-bold text-blue-900 mb-4">
                  Scientific Integrity
                </h2>
                <p className="text-xl text-gray-700 font-medium mb-6">
                  Innovation that matters must withstand science.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sound Science</h3>
                  <p className="text-gray-600">
                    All procedures, methodologies, and practices are evidence-based and rigorously
                    tested.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Falsifiability</h3>
                  <p className="text-gray-600">
                    We design innovations to be tested, challenged, and proven—not just accepted.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Reproducibility</h3>
                  <p className="text-gray-600">
                    Results can be replicated across contexts and domains, ensuring reliability and
                    credibility.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6">
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

        {/* Sustainable Profits */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-serif font-bold text-blue-900 mb-6">
              Sustainable Profits
            </h2>
            <div className="bg-white rounded-lg p-8 md:p-12 shadow-sm">
              <p className="text-2xl text-gray-700 font-medium mb-4">
                "Profit is the outcome of purpose"
              </p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We believe that sustainable, meaningful profits come from creating genuine value.
                When we focus on purpose—building tools that serve people, solving real problems,
                advancing science—profits follow naturally. This is the balance of Ma'at: purpose and
                profit in harmony.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <CTASection
          headline="Join Us in Building with Balance"
          description="Interested in learning more about our philosophy or how we apply it? Get in touch."
          primaryCTA={{
            text: 'Contact Us',
            href: '/contact',
          }}
          secondaryCTA={{
            text: 'View Our Products',
            href: '/products',
          }}
          variant="blue"
        />
      </main>
      <Footer />
    </>
  );
}

