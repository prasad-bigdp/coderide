import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Redirect unauthenticated users to login
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Handle dashboard root redirects
    if (path === '/dashboard') {
      switch (token.role) {
        case 'admin':
          return NextResponse.redirect(new URL('/dashboard/admin', req.url));
        case 'faculty':
          return NextResponse.redirect(new URL('/dashboard/faculty', req.url));
        case 'student':
          return NextResponse.redirect(new URL('/dashboard/student', req.url));
        default:
          return NextResponse.redirect(new URL('/auth/login', req.url));
      }
    }

    // Role-based access control
    if (path.startsWith('/dashboard/admin') && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (path.startsWith('/dashboard/faculty') && 
        !['admin', 'faculty'].includes(token.role as string)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (path.startsWith('/dashboard/student') && token.role !== 'student') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/admin/:path*',
    '/api/faculty/:path*',
    '/api/student/:path*'
  ],
};