import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSessionFamily, unauthorized } from '@/lib/api-auth'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { familyId } = await getSessionFamily()
  if (!familyId) return unauthorized()

  const { id } = await params

  const kid = await prisma.kid.findFirst({
    where: { id, familyId },
  })

  if (!kid) {
    return NextResponse.json({ error: 'Kid not found' }, { status: 404 })
  }

  return NextResponse.json(kid)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { familyId } = await getSessionFamily()
  if (!familyId) return unauthorized()

  const { id } = await params

  const existing = await prisma.kid.findFirst({
    where: { id, familyId },
  })
  if (!existing) {
    return NextResponse.json({ error: 'Kid not found' }, { status: 404 })
  }

  const body = await request.json()
  const { name, age, avatarId, themeMode, primaryColor, secondaryColor } = body

  const kid = await prisma.kid.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(age !== undefined && { age: parseInt(age) }),
      ...(avatarId !== undefined && { avatarId }),
      ...(themeMode !== undefined && { themeMode }),
      ...(primaryColor !== undefined && { primaryColor }),
      ...(secondaryColor !== undefined && { secondaryColor }),
    },
  })

  return NextResponse.json(kid)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { familyId } = await getSessionFamily()
  if (!familyId) return unauthorized()

  const { id } = await params

  const existing = await prisma.kid.findFirst({
    where: { id, familyId },
  })
  if (!existing) {
    return NextResponse.json({ error: 'Kid not found' }, { status: 404 })
  }

  await prisma.kid.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
