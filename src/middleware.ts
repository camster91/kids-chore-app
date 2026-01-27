import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware() {
    // Allow the request to proceed
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth-related routes without a token
        const pathname = req.nextUrl.pathname

        // Public routes that don't need authentication
        const publicRoutes = ['/', '/login', '/signup']
        if (publicRoutes.includes(pathname)) {
          return true
        }

        // API routes that should be publicly accessible
        if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/register')) {
          return true
        }

        // Health check endpoint
        if (pathname === '/api/health') {
          return true
        }

        // All other routes require authentication
        return !!token
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
