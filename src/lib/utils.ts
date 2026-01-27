import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPointsMultiplier(difficulty: 'EASY' | 'MEDIUM' | 'HARD'): number {
  const multipliers = {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
  }
  return multipliers[difficulty]
}

export function calculateLevel(totalPoints: number): number {
  // Each level requires 100 more points than the previous
  // Level 1: 0, Level 2: 100, Level 3: 300, Level 4: 600...
  let level = 1
  let pointsRequired = 0
  while (totalPoints >= pointsRequired) {
    level++
    pointsRequired += level * 100
  }
  return level - 1
}

export function getExperienceForNextLevel(level: number): number {
  return (level + 1) * 100
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export function startOfDay(date: Date): Date {
  const newDate = new Date(date)
  newDate.setHours(0, 0, 0, 0)
  return newDate
}

export function endOfDay(date: Date): Date {
  const newDate = new Date(date)
  newDate.setHours(23, 59, 59, 999)
  return newDate
}
