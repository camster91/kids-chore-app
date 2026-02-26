import { NextResponse } from 'next/server'
import { testDatabaseConnection } from '@/lib/db'

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'ok' as 'ok' | 'error',
    environment: {
      nodeEnv: process.env.NODE_ENV || 'not set',
      hasDatabase: !!process.env.DATABASE_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    },
    database: {
      connected: false,
      error: null as string | null,
    },
  }

  // Test database connection
  try {
    checks.database.connected = await testDatabaseConnection()
  } catch (error) {
    checks.database.error = error instanceof Error ? error.message : 'Unknown error'
  }

  // Determine overall status
  if (!checks.environment.hasDatabase || !checks.environment.hasNextAuthSecret) {
    checks.status = 'error'
  }

  if (!checks.database.connected) {
    checks.status = 'error'
  }

  const statusCode = checks.status === 'ok' ? 200 : 503

  return NextResponse.json(checks, { status: statusCode })
}
