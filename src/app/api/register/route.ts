import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email, password, name, familyName } = await request.json()

    // Validate input
    if (!email || !password || !name || !familyName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
