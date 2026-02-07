import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSessionFamily, unauthorized } from '@/lib/api-auth'

export async function GET() {
  const { familyId } = await getSessionFamily()
  if (!familyId) return unauthorized()

  const rewards = await prisma.reward.findMany({
    where: { familyId, isActive: true },
    orderBy: { cost: 'asc' },
  })

  return NextResponse.json(rewards)
}

export async function POST(request: Request) {
  const { familyId } = await getSessionFamily()
  if (!familyId) return unauthorized()

  const body = await request.json()
  const { title, description, cost, icon } = body

  if (!title || !cost) {
    return NextResponse.json(
      { error: 'Title and cost are required' },
      { status: 400 }
    )
  }

  const reward = await prisma.reward.create({
    data: {
      title,
      description: description || null,
      cost: parseInt(cost),
      icon: icon || 'gift',
      familyId,
    },
  })

  return NextResponse.json(reward, { status: 201 })
}
