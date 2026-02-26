import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function POST(request: Request) {
  // Check for required environment variables
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not configured')
    return NextResponse.json(
      { error: 'Server configuration error. Please contact support.' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { email, password, name, familyName } = body

    // Validate input
    if (!email || !password || !name || !familyName) {
      return NextResponse.json(
        { error: 'Missing required fields', fields: { email: !email, password: !password, name: !name, familyName: !familyName } },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.parent.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create parent and family in a transaction
    const parent = await prisma.parent.create({
      data: {
        email,
        password: hashedPassword,
        name,
        family: {
          create: {
            name: familyName,
          },
        },
      },
      include: {
        family: true,
      },
    })

    return NextResponse.json({
      id: parent.id,
      email: parent.email,
      name: parent.name,
      familyId: parent.family?.id,
    })
  } catch (error) {
    console.error('Registration error:', error)

    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error('Database connection failed. Check DATABASE_URL.')
      return NextResponse.json(
        { error: 'Database connection error. Please try again later.' },
        { status: 503 }
      )
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Unique constraint violation
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
