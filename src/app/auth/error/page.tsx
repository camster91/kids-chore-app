'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const errorMessages: Record<string, { title: string; description: string; action: string }> = {
  Configuration: {
    title: 'Server Configuration Error',
    description: 'The authentication system is not properly configured. This usually means the NEXTAUTH_SECRET environment variable is missing or invalid.',
    action: 'Please contact the administrator to check the server configuration.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to access this resource.',
    action: 'Please sign in with an account that has the required permissions.',
  },
  Verification: {
    title: 'Verification Error',
    description: 'The verification link may have expired or already been used.',
    action: 'Please request a new verification link.',
  },
  OAuthSignin: {
    title: 'OAuth Sign In Error',
    description: 'There was an error starting the OAuth sign-in process.',
    action: 'Please try again or use a different sign-in method.',
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'There was an error during the OAuth callback.',
    action: 'Please try signing in again.',
  },
  OAuthCreateAccount: {
    title: 'Account Creation Error',
    description: 'There was an error creating your account with the OAuth provider.',
    action: 'Please try again or use a different sign-in method.',
  },
  EmailCreateAccount: {
    title: 'Account Creation Error',
    description: 'There was an error creating your account.',
    action: 'Please try again.',
  },
  Callback: {
    title: 'Callback Error',
    description: 'There was an error during the authentication callback.',
    action: 'Please try signing in again.',
  },
  OAuthAccountNotLinked: {
    title: 'Account Not Linked',
    description: 'This email is already associated with a different sign-in method.',
    action: 'Please sign in using the original method you used to create your account.',
  },
  EmailSignin: {
    title: 'Email Sign In Error',
    description: 'There was an error sending the email sign-in link.',
    action: 'Please check your email address and try again.',
  },
  CredentialsSignin: {
    title: 'Sign In Failed',
    description: 'The email or password you entered is incorrect.',
    action: 'Please check your credentials and try again.',
  },
  SessionRequired: {
    title: 'Session Required',
    description: 'You must be signed in to access this page.',
    action: 'Please sign in to continue.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred during authentication.',
    action: 'Please try again.',
  },
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'Default'

  const errorInfo = errorMessages[error] || errorMessages.Default
  const isConfigError = error === 'Configuration'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-purple-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {errorInfo.title}
          </h1>

          <p className="text-gray-600 mb-4">
            {errorInfo.description}
          </p>

          <p className="text-sm text-gray-500 mb-6">
            {errorInfo.action}
          </p>

          {isConfigError && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-amber-800 mb-2">For Administrators:</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>1. Check that NEXTAUTH_SECRET is set in Vercel environment variables</li>
                <li>2. Ensure DATABASE_URL is configured correctly</li>
                <li>3. Visit /api/health to diagnose configuration issues</li>
                <li>4. Redeploy after updating environment variables</li>
              </ul>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Go to Sign In
            </Link>

            <Link
              href="/"
              className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Go to Home
            </Link>
          </div>

          <p className="mt-6 text-xs text-gray-400">
            Error code: {error}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-purple-100">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
