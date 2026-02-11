import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSessionFamily, unauthorized } from '@/lib/api-auth'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { familyId } = await getSessionFamily()
  if (!familyId) return unauthorized()

  const { id } = await params
  const body = await request.json()
  const { status } = body

  if (!status || !['COMPLETED', 'SKIPPED'].includes(status)) {
    return NextResponse.json(
      { error: 'Status must be COMPLETED or SKIPPED' },
      { status: 400 }
    )
  }

  const assignment = await prisma.choreAssignment.findFirst({
    where: { id, chore: { familyId } },
    include: { chore: true },
  })

  if (!assignment) {
    return NextResponse.json(
      { error: 'Assignment not found' },
      { status: 404 }
    )
  }

  const pointsEarned = status === 'COMPLETED' ? assignment.chore.basePoints : 0

  const [updated] = await prisma.$transaction([
    prisma.choreAssignment.update({
      where: { id },
      data: {
        status,
        completedAt: status === 'COMPLETED' ? new Date() : null,
        pointsEarned,
      },
      include: { chore: true },
    }),
    // Award points to the kid
    ...(status === 'COMPLETED'
      ? [
          prisma.kid.update({
            where: { id: assignment.kidId },
            data: {
              points: { increment: pointsEarned },
              totalPoints: { increment: pointsEarned },
              experience: { increment: pointsEarned },
              lastActiveAt: new Date(),
            },
          }),
        ]
      : []),
  ])

  return NextResponse.json(updated)
}
