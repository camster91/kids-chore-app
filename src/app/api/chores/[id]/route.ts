import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSessionFamily, unauthorized } from '@/lib/api-auth'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { familyId } = await getSessionFamily()
  if (!familyId) return unauthorized()

  const { id } = await params

  const existing = await prisma.chore.findFirst({
    where: { id, familyId },
  })
  if (!existing) {
    return NextResponse.json({ error: 'Chore not found' }, { status: 404 })
  }

  const body = await request.json()
  const { title, description, icon, difficulty, basePoints, recurring, isActive } = body

  const chore = await prisma.chore.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(icon !== undefined && { icon }),
      ...(difficulty !== undefined && { difficulty }),
      ...(basePoints !== undefined && { basePoints }),
      ...(recurring !== undefined && { recurring }),
      ...(isActive !== undefined && { isActive }),
    },
  })

  return NextResponse.json(chore)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { familyId } = await getSessionFamily()
  if (!familyId) return unauthorized()

  const { id } = await params

  const existing = await prisma.chore.findFirst({
    where: { id, familyId },
  })
  if (!existing) {
    return NextResponse.json({ error: 'Chore not found' }, { status: 404 })
  }

  await prisma.chore.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
