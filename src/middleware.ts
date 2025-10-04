
// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return new NextResponse(
      JSON.stringify({ message: 'Authentication token not provided.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Attach user ID to the request headers so API routes can access it
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ message: 'Invalid or expired token.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// This configures the middleware to only run on API routes under /api/vault
export const config = {
  matcher: '/api/vault/:path*',
};
