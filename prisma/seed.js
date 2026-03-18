const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean up existing data
  console.log('Cleaning up existing data...')
  await prisma.avatarItem.deleteMany()
  await prisma.plannerItem.deleteMany()
  await prisma.earnedBadge.deleteMany()
  await prisma.badgeDefinition.deleteMany()
  await prisma.redeemedReward.deleteMany()
  await prisma.reward.deleteMany()
  await prisma.habitLog.deleteMany()
  await prisma.habit.deleteMany()
  await prisma.choreAssignment.deleteMany()
  await prisma.chore.deleteMany()
  await prisma.kid.deleteMany()
  await prisma.family.deleteMany()
  await prisma.parent.deleteMany()

  // Create parent user
  console.log('Creating parent and family...')
  const hashedPassword = await bcrypt.hash('Ashbi2026!', 10)
  const parent = await prisma.parent.create({
    data: {
      email: 'cameron@ashbi.ca',
      password: hashedPassword,
      name: 'Cameron',
      family: {
        create: {
          name: 'The Ashbi Family',
        },
      },
    },
    include: {
      family: true,
    },
  })

  const familyId = parent.family.id

  // Create 2 child accounts
  console.log('Creating kids...')
  const kid1 = await prisma.kid.create({
    data: {
      name: 'Emma',
      age: 8,
      avatarId: 'girl-1',
      themeMode: 'GIRL',
      primaryColor: '#ec4899',
      secondaryColor: '#8b5cf6',
      points: 0,
      totalPoints: 0,
      streakDays: 0,
      level: 1,
      experience: 0,
      familyId,
    },
  })

  const kid2 = await prisma.kid.create({
    data: {
      name: 'Noah',
      age: 6,
      avatarId: 'boy-1',
      themeMode: 'BOY',
      primaryColor: '#3b82f6',
      secondaryColor: '#10b981',
      points: 0,
      totalPoints: 0,
      streakDays: 0,
      level: 1,
      experience: 0,
      familyId,
    },
  })

  // Create 5 chores
  console.log('Creating chores...')
  await prisma.chore.createMany({
    data: [
      {
        title: 'Make my bed',
        description: 'Tidy up your bed every morning',
        icon: 'bed',
        difficulty: 'EASY',
        basePoints: 10,
        recurring: 'DAILY',
        familyId,
      },
      {
        title: 'Brush teeth',
        description: 'Brush morning and night',
        icon: 'toothbrush',
        difficulty: 'EASY',
        basePoints: 5,
        recurring: 'DAILY',
        familyId,
      },
      {
        title: 'Feed the dog',
        description: 'Give food and fresh water to our pet',
        icon: 'dog',
        difficulty: 'MEDIUM',
        basePoints: 15,
        recurring: 'DAILY',
        familyId,
      },
      {
        title: 'Clean my room',
        description: 'Pick up toys and organize your space',
        icon: 'sparkles',
        difficulty: 'HARD',
        basePoints: 30,
        recurring: 'WEEKLY',
        familyId,
      },
      {
        title: 'Set the table',
        description: 'Help prepare for dinner time',
        icon: 'utensils',
        difficulty: 'MEDIUM',
        basePoints: 20,
        recurring: 'WEEKDAYS',
        familyId,
      },
    ],
  })

  // Assign chores to both kids
  console.log('Assigning chores...')
  const allChores = await prisma.chore.findMany({ where: { familyId } })
  const today = new Date()

  await prisma.choreAssignment.createMany({
    data: allChores.flatMap((chore) => [
      {
        choreId: chore.id,
        kidId: kid1.id,
        dueDate: today,
        status: 'PENDING',
      },
      {
        choreId: chore.id,
        kidId: kid2.id,
        dueDate: today,
        status: 'PENDING',
      },
    ]),
  })

  console.log('Database seeded successfully!')
  console.log('\n=== Login Credentials ===')
  console.log('Email: cameron@ashbi.ca')
  console.log('Password: Ashbi2026!')
  console.log('Kids: Emma (8), Noah (6)')
  console.log('Chores: 5 assigned to both kids')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
