/**
 * Contact Page
 * Contact form and information
 */

import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import { Navigation } from '@/components/marketing/Navigation';
import { Footer } from '@/components/marketing/Footer';
import { ContactForm } from '@/components/marketing/ContactForm';
import Script from 'next/script';

export const metadata: Metadata = genMeta({
  title: 'Contact Us',
  description:
    'Contact Edim Systems Group for demo requests, pricing information, partnership opportunities, or technical support.',
  keywords: ['contact', 'demo request', 'CHADD support', 'partnership'],
});

export default function ContactPage() {
  // Generate structured data
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Edim Systems Group',
    description: 'Contact us for demo requests, pricing, partnerships, or support',
    mainEntity: {
      '@type': 'Organization',
      name: 'Edim Systems Group',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Sales',
        email: 'contact@imediacorp.com',
      },
    },
  };

  return (
    <>
      <Script
        id="contact-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <Navigation />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-blue-900 mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto">
              Get in touch to learn more about CHADD Suite
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Request a demo, ask about pricing, explore partnership opportunities, or get
              technical support.
            </p>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h2>
              <ContactForm />
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-blue-900 mb-4">
                Other Ways to Reach Us
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">📧</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">
                  <a
                    href="mailto:contact@imediacorp.com"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    contact@imediacorp.com
                  </a>
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Website</h3>
                <p className="text-gray-600">
                  <a
                    href="https://imediacorp.com"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    imediacorp.com
                  </a>
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💼</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Company</h3>
                <p className="text-gray-600">Edim Systems Group</p>
              </div>
            </div>
          </div>
        </section>

        {/* Response Time */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Response Time</h2>
            <p className="text-lg text-gray-600">
              We typically respond to all inquiries within 24 hours. For urgent matters, please
              indicate this in your message.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

