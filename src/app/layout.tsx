/**
 * Root Layout
 * Next.js App Router root layout
 * Enhanced with PWA support
 */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { PWARegistration } from '@/components/pwa/PWARegistration';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { ScrollRestoration } from '@/components/ScrollRestoration';
import { SiteLintIntegration } from '@/components/accessibility/SiteLintIntegration';
import { AccessibilityBadge } from '@/components/accessibility/AccessibilityBadge';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'CHaDD™ Suite | Universal Diagnostic Intelligence',
    template: '%s | CHaDD™ Suite',
  },
  description:
    'CHADD (Comprehensive Harmonic Dynamic Diagnostics) - Autonomous, cross-domain diagnostics leveraging harmonic, musical, and mathematical logic. Production-ready dashboards across 16+ domains.',
  keywords: [
    'CHADD',
    'CHaDD',
    'autonomous diagnostics',
    'universal diagnostic platform',
    'predictive maintenance',
    'system health monitoring',
    'cross-domain diagnostics',
    'Edim Systems Group',
  ],
  authors: [{ name: 'Edim Systems Group' }],
  creator: 'Bryan Persaud',
  publisher: 'Edim Systems Group',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CHADD',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://imediacorp.com',
    siteName: 'CHaDD™ Suite by Edim Systems Group',
    title: 'CHaDD™ Suite | Universal Diagnostic Intelligence',
    description:
      'Autonomous, cross-domain diagnostics leveraging harmonic, musical, and mathematical logic.',
    images: [
      {
        url: 'https://imediacorp.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CHaDD™ Suite',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CHaDD™ Suite | Universal Diagnostic Intelligence',
    description:
      'Autonomous, cross-domain diagnostics leveraging harmonic, musical, and mathematical logic.',
    images: ['https://imediacorp.com/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://imediacorp.com'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="CHADD" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CHADD" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
        >
          Skip to main content
        </a>
        <PWARegistration />
        <ScrollRestoration />
        <SiteLintIntegration />
        <AccessibilityBadge />
        <div id="main-content" className="min-h-screen">
          {children}
        </div>
        <InstallPrompt />
      </body>
    </html>
  );
}

