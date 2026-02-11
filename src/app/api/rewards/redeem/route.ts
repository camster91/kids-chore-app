import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSessionFamily, unauthorized } from '@/lib/api-auth'

export async function POST(request: Request) {
  const { familyId } = await getSessionFamily()
  if (!familyId) return unauthorized()

  const body = await request.json()
  const { rewardId, kidId } = body

  if (!rewardId || !kidId) {
    return NextResponse.json(
      { error: 'rewardId and kidId are required' },
      { status: 400 }
    )
  }

  const [reward, kid] = await Promise.all([
    prisma.reward.findFirst({ where: { id: rewardId, familyId } }),
    prisma.kid.findFirst({ where: { id: kidId, familyId } }),
  ])

  if (!reward) {
    return NextResponse.json({ error: 'Reward not found' }, { status: 404 })
  }
  if (!kid) {
    return NextResponse.json({ error: 'Kid not found' }, { status: 404 })
  }
  if (kid.points < reward.cost) {
    return NextResponse.json(
      { error: 'Not enough points' },
      { status: 400 }
    )
  }

  const [redemption] = await prisma.$transaction([
    prisma.redeemedReward.create({
      data: {
        pointsSpent: reward.cost,
        rewardId: reward.id,
        kidId: kid.id,
      },
    }),
    prisma.kid.update({
      where: { id: kid.id },
      data: { points: { decrement: reward.cost } },
    }),
  ])

  return NextResponse.json(redemption, { status: 201 })
}
