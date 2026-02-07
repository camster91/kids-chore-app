import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSessionFamily, unauthorized } from '@/lib/api-auth'

export async function GET(request: Request) {
  const { familyId } = await getSessionFamily()
  if (!familyId) return unauthorized()

  const { searchParams } = new URL(request.url)
  const kidId = searchParams.get('kidId')
  const date = searchParams.get('date')

  // If kidId + date, return assignments for that kid on that date
  if (kidId && date) {
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

    const assignments = await prisma.choreAssignment.findMany({
      where: {
        kidId,
        dueDate: { gte: dayStart, lte: dayEnd },
        chore: { familyId },
      },
      include: { chore: true },
      orderBy: { dueDate: 'asc' },
    })

    return NextResponse.json(assignments)
  }

  // Otherwise return all family chores
  const chores = await prisma.chore.findMany({
    where: { familyId },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(chores)
}

export async function POST(request: Request) {
  const { familyId } = await getSessionFamily()
  if (!familyId) return unauthorized()

  const body = await request.json()
  const { title, description, icon, difficulty, basePoints, recurring } = body

  if (!title) {
    return NextResponse.json(
      { error: 'Title is required' },
      { status: 400 }
    )
  }

  const chore = await prisma.chore.create({
    data: {
      title,
      description: description || null,
      icon: icon || 'star',
      difficulty: difficulty || 'EASY',
      basePoints: basePoints || 10,
      recurring: recurring || null,
      familyId,
    },
  })

  return NextResponse.json(chore, { status: 201 })
}
