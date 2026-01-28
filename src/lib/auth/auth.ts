import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'

// Validate required environment variables at startup
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET

if (!NEXTAUTH_SECRET) {
  console.error(
    '[NextAuth] CRITICAL: NEXTAUTH_SECRET is not set.\n' +
    'Authentication will fail with a "Configuration" error.\n' +
    'Set NEXTAUTH_SECRET in your environment variables.\n' +
    'Generate one with: openssl rand -base64 32'
  )
}

export const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error('Auth error: Missing email or password')
            return null
          }

          const parent = await prisma.parent.findUnique({
            where: { email: credentials.email },
            include: { family: true },
          })

          if (!parent) {
            console.log('Auth: No user found with email:', credentials.email)
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            parent.password
          )

          if (!isPasswordValid) {
            console.log('Auth: Invalid password for user:', credentials.email)
            return null
          }

          return {
            id: parent.id,
            email: parent.email,
            name: parent.name,
            familyId: parent.family?.id,
          }
        } catch (error) {
          console.error('Auth error in authorize:', error)
          // Return null instead of throwing to prevent 500 errors
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.familyId = user.familyId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.familyId = token.familyId
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    newUser: '/signup',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
}
