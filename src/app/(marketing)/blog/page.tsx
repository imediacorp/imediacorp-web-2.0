/**
 * Blog Page
 * Placeholder for blog structure (SEO content, case studies, thought leadership)
 */

import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import { Navigation } from '@/components/marketing/Navigation';
import { Footer } from '@/components/marketing/Footer';
import { CTASection } from '@/components/marketing/CTASection';

export const metadata: Metadata = genMeta({
  title: 'Blog - CHADD Suite',
  description:
    'Thought leadership, case studies, and technical deep-dives on CHADD diagnostic platform and universal diagnostics.',
  keywords: ['CHADD blog', 'diagnostic platform', 'case studies', 'thought leadership'],
});

export default function BlogPage() {
  // Placeholder - will be populated with actual blog posts
  const blogPosts: Array<{
    title: string;
    description: string;
    date: string;
    category: string;
    href: string;
  }> = [
    // Example structure - to be populated
    // {
    //   title: 'Understanding the CHADD S/Q/U/D Framework',
    //   description: 'Deep dive into how CHADD translates domain-specific metrics into universal state variables.',
    //   date: '2025-01-15',
    //   category: 'Technical',
    //   href: '/blog/chadd-squd-framework',
    // },
  ];

  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-blue-900 mb-6">
              CHADD Suite Blog
            </h1>
            <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto">
              Thought leadership, case studies, and technical insights
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Learn about universal diagnostics, CHADD methodology, and real-world applications
              across industries.
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {blogPosts.length > 0 ? (
              <div className="space-y-8">
                {blogPosts.map((post) => (
                  <article
                    key={post.href}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-blue-600 font-medium">{post.category}</span>
                      <time className="text-sm text-gray-500">{post.date}</time>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">{post.title}</h2>
                    <p className="text-gray-600 mb-4">{post.description}</p>
                    <a
                      href={post.href}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Read more →
                    </a>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Blog posts coming soon!</p>
                <p className="text-sm text-gray-500">
                  Check back for case studies, technical deep-dives, and industry insights.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <CTASection
          headline="Stay Updated"
          description="Subscribe to our newsletter or contact us for the latest updates on CHADD Suite."
          primaryCTA={{
            text: 'Contact Us',
            href: '/contact',
          }}
          secondaryCTA={{
            text: 'View Products',
            href: '/products',
          }}
        />
      </main>
      <Footer />
    </>
  );
}

