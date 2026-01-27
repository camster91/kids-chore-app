'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/components/themes/ThemeProvider'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  )
}
