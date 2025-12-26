/**
 * SiteLint Integration Component
 * Adds SiteLint accessibility monitoring to the site
 * 
 * To use:
 * 1. Get your API token from sitelint.com
 * 2. Add NEXT_PUBLIC_SITELINT_TOKEN to your .env.local file
 * 3. SiteLint will automatically start monitoring your site
 */

'use client';

import Script from 'next/script';

export function SiteLintIntegration() {
  const token = process.env.NEXT_PUBLIC_SITELINT_TOKEN;

  // Only load when token is provided (can be enabled in development for testing)
  if (!token) {
    return null;
  }

  return (
    <Script
      id="sitelint-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,o,f,js,fjs){
            w['SiteLintObject']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
            js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
            js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
          }(window,document,'script','sl','https://cdn.sitelint.com/js/sitelint.js'));
          sl('init', '${token}');
        `,
      }}
    />
  );
}

