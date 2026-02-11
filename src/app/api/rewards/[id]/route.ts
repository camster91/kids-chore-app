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

  const existing = await prisma.reward.findFirst({
    where: { id, familyId },
  })
  if (!existing) {
    return NextResponse.json({ error: 'Reward not found' }, { status: 404 })
  }

  const body = await request.json()
  const { title, description, cost, icon, isActive } = body

  const reward = await prisma.reward.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(cost !== undefined && { cost: parseInt(cost) }),
      ...(icon !== undefined && { icon }),
      ...(isActive !== undefined && { isActive }),
    },
  })

  return NextResponse.json(reward)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { familyId } = await getSessionFamily()
  if (!familyId) return unauthorized()

  const { id } = await params

  const existing = await prisma.reward.findFirst({
    where: { id, familyId },
  })
  if (!existing) {
    return NextResponse.json({ error: 'Reward not found' }, { status: 404 })
  }

  await prisma.reward.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
