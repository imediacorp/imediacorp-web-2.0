/**
 * Auth Callback Page
 * Redirects to home after successful authentication
 * (Not needed for email/password auth, but kept for compatibility)
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // For email/password auth, just redirect to home
    // Return URL from query params if provided
    const returnUrl = new URLSearchParams(window.location.search).get('return_url') || '/';
    router.push(returnUrl);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}

