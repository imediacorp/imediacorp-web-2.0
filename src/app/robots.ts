/**
 * Robots.txt Generation
 * SEO robots configuration
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://imediacorp.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/internal/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

