/**
 * OAuth Authorization Endpoint
 * Proxies to backend OAuth server or provides helpful error message
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_OAUTH_AUTHORIZATION_ENDPOINT || 'http://localhost:8000/api/v1/auth/oauth/authorize';
  const clientId = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID;

  // Check if backend URL is configured
  if (!backendUrl.includes('localhost:8000') && !backendUrl.includes('http')) {
    // If using relative URL, proxy to backend
    const searchParams = request.nextUrl.searchParams;
    const backendEndpoint = `http://localhost:8000/api/v1/auth/oauth/authorize?${searchParams.toString()}`;
    
    try {
      const response = await fetch(backendEndpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        // If it's a redirect, follow it
        if (response.redirected) {
          return NextResponse.redirect(response.url);
        }
        return NextResponse.json(await response.json());
      }
    } catch (error) {
      // Backend not available - return helpful error
      return NextResponse.json(
        {
          error: 'oauth_server_unavailable',
          error_description: 'OAuth backend server is not running on port 8000. Please start the backend server or configure NEXT_PUBLIC_OAUTH_AUTHORIZATION_ENDPOINT to point to your OAuth provider.',
          hint: 'Set NEXT_PUBLIC_OAUTH_AUTHORIZATION_ENDPOINT in .env.local to your OAuth provider URL, or start the backend server on port 8000.',
        },
        { status: 503 }
      );
    }
  }

  // If client_id is missing, return helpful error
  if (!clientId || clientId === '') {
    return NextResponse.json(
      {
        error: 'invalid_client',
        error_description: 'OAuth client_id is not configured. Please set NEXT_PUBLIC_OAUTH_CLIENT_ID in .env.local',
        hint: 'See web/README_OAUTH_SETUP.md for configuration instructions.',
      },
      { status: 400 }
    );
  }

  // Redirect to actual OAuth provider
  const searchParams = request.nextUrl.searchParams;
  const authUrl = new URL(backendUrl);
  searchParams.forEach((value, key) => {
    authUrl.searchParams.set(key, value);
  });

  return NextResponse.redirect(authUrl.toString());
}

