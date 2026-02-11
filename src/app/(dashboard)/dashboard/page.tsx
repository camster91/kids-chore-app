'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { useKidStore } from '@/stores/kid-store'
import { Card, CardContent, Button, Badge, Progress } from '@/components/ui'
import { PointsDisplay, StreakCounter, LevelBadge } from '@/components/gamification'

interface ChoreItem {
  id: string
  title: string
  points: number
  completed: boolean
}

export default function DashboardPage() {
  const { currentKid, fetchKids } = useKidStore()
  const [todaysChores, setTodaysChores] = useState<ChoreItem[]>([])
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    fetchKids()
  }, [fetchKids])

  useEffect(() => {
    if (!currentKid) return
    let cancelled = false
    async function loadDashboard() {
      try {
        const [assignmentsRes, choresRes] = await Promise.all([
          fetch(`/api/chores?kidId=${currentKid!.id}&date=${today}`),
          fetch('/api/chores'),
        ])
        if (cancelled) return

        const items: ChoreItem[] = []

        if (assignmentsRes.ok) {
          const assignments = await assignmentsRes.json()
          for (const a of assignments) {
            items.push({
              id: a.id,
              title: a.chore.title,
              points: a.chore.basePoints,
              completed: a.status === 'COMPLETED',
            })
          }
        }

        if (items.length === 0 && choresRes.ok) {
          const chores = await choresRes.json()
          for (const c of chores) {
            items.push({
              id: c.id,
              title: c.title,
              points: c.basePoints,
              completed: false,
            })
          }
        }

        setTodaysChores(items)
      } catch {
        // keep empty state
      }
      setLoading(false)
    }
    loadDashboard()
    return () => { cancelled = true }
  }, [currentKid, today])

  const completedCount = todaysChores.filter((c) => c.completed).length
  const totalPoints = todaysChores.reduce((sum, c) => (c.completed ? sum + c.points : sum), 0)
  const possiblePoints = todaysChores.reduce((sum, c) => sum + c.points, 0)

  if (!currentKid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-6"
        >
          <Sparkles className="w-12 h-12 text-[var(--color-primary)]" />
        </motion.div>
        <h1 className="text-2xl font-bold mb-2">Welcome to ChoreChamps!</h1>
        <p className="text-gray-500 mb-6 max-w-md">
          Select or create a kid profile to start tracking chores and earning rewards!
        </p>
        <Link href="/profile">
          <Button size="lg">Go to Profiles</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">
            Hey, {currentKid.name}! <span className="animate-wiggle inline-block">👋</span>
          </h1>
          <p className="text-gray-500 mt-1">Ready to conquer some chores today?</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow">
            <StreakCounter days={currentKid.streakDays} size="md" />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow">
            <PointsDisplay points={currentKid.points} size="md" />
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today&apos;s Progress</p>
                <p className="text-3xl font-bold mt-1">
                  {completedCount}/{todaysChores.length}
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-500" />
              </div>
            </div>
            <Progress
              value={completedCount}
              max={todaysChores.length || 1}
              className="mt-4"
            />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Points Today</p>
                <p className="text-3xl font-bold mt-1">
                  {totalPoints}/{possiblePoints}
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
                <Star className="w-7 h-7 text-amber-500" />
              </div>
            </div>
            <Progress value={totalPoints} max={possiblePoints || 1} className="mt-4" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current Level</p>
                <p className="text-3xl font-bold mt-1">Level {currentKid.level}</p>
              </div>
              <LevelBadge
                level={currentKid.level}
                experience={currentKid.experience}
                experienceToNext={100}
                size="md"
                showProgress={false}
              />
            </div>
            <Progress
              value={currentKid.experience}
              max={100}
              label="XP to next level"
              className="mt-4"
            />
          </Card>
        </motion.div>
      </div>

      {/* Today's Chores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                <h2 className="text-xl font-bold">Today&apos;s Chores</h2>
              </div>
              <Link href="/chores">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View All
                </Button>
              </Link>
            </div>

            {todaysChores.length === 0 && !loading ? (
              <div className="text-center py-8 text-gray-500">
                <p>No chores for today. Add some from the Chores page!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaysChores.slice(0, 5).map((chore, index) => (
                  <motion.div
                    key={chore.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer
                      ${
                        chore.completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200 hover:border-[var(--color-primary)]'
                      }`}
                  >
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center
                        ${chore.completed ? 'bg-green-500' : 'border-2 border-gray-300'}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {chore.completed && <CheckCircle className="w-5 h-5 text-white" />}
                    </motion.div>
                    <span
                      className={`flex-1 font-medium ${
                        chore.completed ? 'line-through text-gray-400' : 'text-gray-700'
                      }`}
                    >
                      {chore.title}
                    </span>
                    <Badge variant={chore.completed ? 'success' : 'primary'}>
                      +{chore.points}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
