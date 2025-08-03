import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// List of paths that don't require payment verification
const publicPaths = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/book-club',
  '/api/auth',
  '/api/book-club',
  '/_next',
  '/favicon.ico',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  try {
    // Get the session token
    const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    // If no session, redirect to signin
    if (!session) {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    // Get user data (in a real app, you'd fetch this from your database)
    const userResponse = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }

    const user = await userResponse.json();

    // Allow access to book club and its API routes for all authenticated users
    if (pathname.startsWith('/book-club') || pathname.startsWith('/api/book-club')) {
      return NextResponse.next();
    }

    // Check if user has completed payment
    if (user.status === 'pending_payment') {
      // If user is trying to access payment page, allow it
      if (pathname.startsWith('/payment') || pathname.startsWith('/api/payment')) {
        return NextResponse.next();
      }
      // Redirect to payment page for all other pages
      const url = new URL('/payment', request.url);
      url.searchParams.set('redirect', encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // In case of error, allow the request to proceed
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
