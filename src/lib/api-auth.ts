import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth/auth'

export async function getSessionFamily() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.familyId) {
    return { session: null, familyId: null }
  }

  return { session, familyId: session.user.familyId }
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
