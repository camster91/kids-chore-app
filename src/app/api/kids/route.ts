import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSessionFamily, unauthorized } from '@/lib/api-auth'

export async function GET() {
  const { familyId } = await getSessionFamily()
  if (!familyId) return unauthorized()

  const kids = await prisma.kid.findMany({
    where: { familyId },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(kids)
}

export async function POST(request: Request) {
  const { familyId } = await getSessionFamily()
  if (!familyId) return unauthorized()

  const body = await request.json()
  const { name, age, avatarId, themeMode, primaryColor, secondaryColor } = body

  if (!name || !age) {
    return NextResponse.json(
      { error: 'Name and age are required' },
      { status: 400 }
    )
  }

  const kid = await prisma.kid.create({
    data: {
      name,
      age: parseInt(age),
      avatarId: avatarId || 'default',
      themeMode: themeMode || 'NEUTRAL',
      primaryColor: primaryColor || '#6366f1',
      secondaryColor: secondaryColor || '#8b5cf6',
      familyId,
    },
  })

  return NextResponse.json(kid, { status: 201 })
}
