/**
 * SEO Utilities
 * Helper functions for generating SEO metadata, structured data, and Open Graph tags
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noindex?: boolean;
  structuredData?: Record<string, any>;
}

export interface Metadata {
  title: string;
  description: string;
  keywords?: string;
  openGraph?: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    images: Array<{ url: string; width?: number; height?: number }>;
    type: string;
  };
  twitter?: {
    card: string;
    title: string;
    description: string;
    images?: string[];
  };
  robots?: {
    index: boolean;
    follow: boolean;
  };
  alternates?: {
    canonical: string;
  };
}

/**
 * Generate SEO metadata for Next.js
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://imediacorp.com';
  const fullTitle = config.title.includes('CHADD') || config.title.includes('CHaDD')
    ? config.title
    : `${config.title} | CHaDD™ Suite`;

  const metadata: Metadata = {
    title: fullTitle,
    description: config.description,
    keywords: config.keywords?.join(', '),
    openGraph: {
      title: fullTitle,
      description: config.description,
      url: config.canonical || siteUrl,
      siteName: 'CHaDD™ Suite by Edim Systems Group',
      images: [
        {
          url: config.ogImage || `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
        },
      ],
      type: config.ogType || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: config.description,
      images: config.ogImage ? [config.ogImage] : undefined,
    },
    robots: {
      index: !config.noindex,
      follow: !config.noindex,
    },
  };

  if (config.canonical) {
    metadata.alternates = {
      canonical: config.canonical,
    };
  }

  return metadata;
}

/**
 * Generate JSON-LD structured data for Organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Edim Systems Group',
    url: 'https://imediacorp.com',
    logo: 'https://imediacorp.com/logo.png',
    description: 'Edim Systems Group develops and licenses CHADD (Comprehensive Harmonic Dynamic Diagnostics), a universal diagnostic platform for system health monitoring across 16+ domains.',
    sameAs: [
      // Add social media links when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Sales',
      email: 'contact@imediacorp.com',
    },
  };
}

/**
 * Generate JSON-LD structured data for Product
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  category: string;
  url: string;
  image?: string;
  brand?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    category: product.category,
    url: product.url,
    image: product.image || 'https://imediacorp.com/og-image.png',
    brand: {
      '@type': 'Brand',
      name: product.brand || 'CHaDD™',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Edim Systems Group',
    },
  };
}

/**
 * Generate JSON-LD structured data for SoftwareApplication
 */
export function generateSoftwareApplicationSchema(app: {
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    description: app.description,
    url: app.url,
    applicationCategory: app.applicationCategory,
    operatingSystem: app.operatingSystem,
    offers: app.offers
      ? {
          '@type': 'Offer',
          price: app.offers.price,
          priceCurrency: app.offers.priceCurrency,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Edim Systems Group',
    },
  };
}

/**
 * Generate JSON-LD structured data for Service
 */
export function generateServiceSchema(service: {
  name: string;
  description: string;
  provider: string;
  areaServed?: string;
  serviceType: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: service.provider,
    },
    areaServed: service.areaServed || 'Worldwide',
    serviceType: service.serviceType,
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

