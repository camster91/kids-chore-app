import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean up existing data
  console.log('🧹 Cleaning up existing data...')
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

  console.log('👨‍👩‍👧‍👦 Creating parent and family...')
  // Create parent
  const hashedPassword = await bcrypt.hash('password123', 10)
  const parent = await prisma.parent.create({
    data: {
      email: 'parent@example.com',
      password: hashedPassword,
      name: 'John Doe',
      family: {
        create: {
          name: 'The Doe Family',
        },
      },
    },
    include: {
      family: true,
    },
  })

  const familyId = parent.family!.id

  console.log('👧👦 Creating kids...')
  // Create kids
  const emma = await prisma.kid.create({
    data: {
      name: 'Emma',
      age: 8,
      avatarId: 'girl-1',
      themeMode: 'GIRL',
      primaryColor: '#ec4899',
      secondaryColor: '#8b5cf6',
      points: 850,
      totalPoints: 1250,
      streakDays: 7,
      lastActiveAt: new Date(),
      level: 5,
      experience: 75,
      familyId,
    },
  })

  const noah = await prisma.kid.create({
    data: {
      name: 'Noah',
      age: 6,
      avatarId: 'boy-1',
      themeMode: 'BOY',
      primaryColor: '#3b82f6',
      secondaryColor: '#10b981',
      points: 420,
      totalPoints: 680,
      streakDays: 3,
      lastActiveAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      level: 3,
      experience: 40,
      familyId,
    },
  })

  console.log('🧹 Creating chores...')
  // Create chores
  const chores = await prisma.chore.createMany({
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

  console.log('📝 Creating chore assignments...')
  // Get created chores
  const allChores = await prisma.chore.findMany({ where: { familyId } })

  // Create assignments for Emma
  const today = new Date()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)

  await prisma.choreAssignment.createMany({
    data: [
      // Emma's completed chores
      {
        choreId: allChores[0].id,
        kidId: emma.id,
        dueDate: yesterday,
        status: 'COMPLETED',
        completedAt: yesterday,
        pointsEarned: 10,
        notes: 'Great job!',
      },
      {
        choreId: allChores[1].id,
        kidId: emma.id,
        dueDate: yesterday,
        status: 'COMPLETED',
        completedAt: yesterday,
        pointsEarned: 5,
        notes: 'Sparkling clean!',
      },
      {
        choreId: allChores[2].id,
        kidId: emma.id,
        dueDate: yesterday,
        status: 'COMPLETED',
        completedAt: yesterday,
        pointsEarned: 15,
        notes: 'Dog was very happy!',
      },
      // Emma's pending chores
      {
        choreId: allChores[3].id,
        kidId: emma.id,
        dueDate: today,
        status: 'PENDING',
        notes: 'Due by end of day',
      },
      {
        choreId: allChores[0].id,
        kidId: emma.id,
        dueDate: today,
        status: 'PENDING',
        notes: 'Morning routine',
      },
      // Noah's chores
      {
        choreId: allChores[0].id,
        kidId: noah.id,
        dueDate: yesterday,
        status: 'COMPLETED',
        completedAt: yesterday,
        pointsEarned: 10,
        notes: 'Nice and neat!',
      },
      {
        choreId: allChores[1].id,
        kidId: noah.id,
        dueDate: today,
        status: 'PENDING',
        notes: 'Remember to brush!',
      },
    ],
  })

  console.log('🎁 Creating rewards...')
  // Create rewards
  await prisma.reward.createMany({
    data: [
      {
        title: 'Extra Screen Time',
        description: '30 minutes of extra video games or TV',
        cost: 50,
        icon: 'tv',
        familyId,
      },
      {
        title: 'Ice Cream Treat',
        description: 'Trip to the ice cream shop',
        cost: 100,
        icon: 'ice-cream',
        familyId,
      },
      {
        title: 'New Toy',
        description: 'Choose a small toy from the store',
        cost: 200,
        icon: 'toy',
        familyId,
      },
      {
        title: 'Stay Up Late',
        description: 'Stay up 30 minutes past bedtime',
        cost: 75,
        icon: 'moon',
        familyId,
      },
    ],
  })

  console.log('🏆 Creating badge definitions...')
  // Create badge definitions
  await prisma.badgeDefinition.createMany({
    data: [
      {
        name: 'Chore Champion',
        description: 'Complete 10 chores in a week',
        icon: '🏆',
        requirement: '{"type": "chore_count", "threshold": 10, "period": "week"}',
        category: 'chores',
        familyId,
      },
      {
        name: 'Perfect Week',
        description: 'Complete all daily chores for 7 days straight',
        icon: '⭐',
        requirement: '{"type": "streak", "days": 7}',
        category: 'streak',
        familyId,
      },
      {
        name: 'Helper Hero',
        description: 'Earn 500 total points',
        icon: '🦸',
        requirement: '{"type": "total_points", "threshold": 500}',
        category: 'points',
        familyId,
      },
      {
        name: 'Morning Master',
        description: 'Complete 5 morning chores',
        icon: '🌅',
        requirement: '{"type": "morning_chores", "threshold": 5}',
        category: 'time',
        familyId,
      },
    ],
  })

  console.log('📊 Creating habits...')
  // Create habits
  const habits = await prisma.habit.createMany({
    data: [
      {
        title: 'Morning Reading',
        description: 'Read for 15 minutes after breakfast',
        icon: 'book',
        timeOfDay: 'MORNING',
      },
      {
        title: 'Afternoon Walk',
        description: 'Get some fresh air and exercise',
        icon: 'walking',
        timeOfDay: 'AFTERNOON',
      },
      {
        title: 'Evening Journal',
        description: 'Write about your day before bed',
        icon: 'notebook',
        timeOfDay: 'EVENING',
      },
    ],
  })

  console.log('📅 Creating planner items...')
  // Create planner items
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
  await prisma.plannerItem.createMany({
    data: [
      {
        title: 'Soccer Practice',
        description: 'Team practice at the park',
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 16, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 17, 30),
        date: tomorrow,
        kidId: emma.id,
        color: '#3b82f6',
      },
      {
        title: 'Playdate with Alex',
        description: 'Alex is coming over after school',
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0),
        date: today,
        kidId: noah.id,
        color: '#10b981',
      },
    ],
  })

  console.log('👕 Creating avatar items...')
  // Create avatar items
  await prisma.avatarItem.createMany({
    data: [
      {
        name: 'Girl Base 1',
        category: 'base',
        imageUrl: '/avatars/girl-1.png',
        themeMode: 'GIRL',
      },
      {
        name: 'Boy Base 1',
        category: 'base',
        imageUrl: '/avatars/boy-1.png',
        themeMode: 'BOY',
      },
      {
        name: 'Princess Crown',
        category: 'accessory',
        imageUrl: '/avatars/crown.png',
        unlockCost: 100,
        themeMode: 'GIRL',
      },
      {
        name: 'Superhero Cape',
        category: 'accessory',
        imageUrl: '/avatars/cape.png',
        unlockCost: 100,
        themeMode: 'BOY',
      },
      {
        name: 'Rainbow Background',
        category: 'background',
        imageUrl: '/avatars/rainbow-bg.png',
        unlockCost: 200,
      },
    ],
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n=== Test Credentials ===')
  console.log('Email: parent@example.com')
  console.log('Password: password123')
  console.log('\nApp URL: http://localhost:3000')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })