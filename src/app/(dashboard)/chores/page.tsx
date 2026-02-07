'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  CheckCircle,
  Star,
  Sparkles,
} from 'lucide-react'
import { useKidStore } from '@/stores/kid-store'
import { Card, CardContent, Button, Badge, Modal, Input } from '@/components/ui'
import { PointsEarned } from '@/components/gamification'
import { cn } from '@/lib/utils'

interface Chore {
  id: string
  title: string
  description?: string
  basePoints: number
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  icon: string
}

interface ChoreAssignment {
  id: string
  choreId: string
  kidId: string
  dueDate: string
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED'
  pointsEarned?: number
  chore: Chore
}

const difficultyColors = {
  EASY: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
  MEDIUM: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
  HARD: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
}

const choreIcons = ['🧹', '🛏️', '🍽️', '🐕', '📚', '🧺', '🗑️', '🌱', '🧼', '🎒']

export default function ChoresPage() {
  const { currentKid, fetchKids } = useKidStore()
  const [chores, setChores] = useState<Chore[]>([])
  const [assignments, setAssignments] = useState<ChoreAssignment[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [showPointsEarned, setShowPointsEarned] = useState<number | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newChore, setNewChore] = useState({
    title: '',
    points: 10,
    difficulty: 'EASY' as 'EASY' | 'MEDIUM' | 'HARD',
    icon: '⭐',
  })

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!currentKid) return
    let cancelled = false
    async function loadData() {
      try {
        const [choresRes, assignmentsRes] = await Promise.all([
          fetch('/api/chores'),
          fetch(`/api/chores?kidId=${currentKid!.id}&date=${today}`),
        ])
        if (cancelled) return
        if (choresRes.ok) setChores(await choresRes.json())
        if (assignmentsRes.ok) setAssignments(await assignmentsRes.json())
      } catch {
        // keep existing state
      }
    }
    loadData()
    return () => { cancelled = true }
  }, [currentKid, today])

  // Build display list: assignments for today, plus unassigned chores
  const assignedChoreIds = new Set(assignments.map((a) => a.choreId))
  const displayItems = [
    ...assignments.map((a) => ({
      id: a.id,
      assignmentId: a.id,
      title: a.chore.title,
      points: a.chore.basePoints,
      difficulty: a.chore.difficulty,
      completed: a.status === 'COMPLETED',
      icon: a.chore.icon,
    })),
    ...chores
      .filter((c) => !assignedChoreIds.has(c.id))
      .map((c) => ({
        id: c.id,
        assignmentId: null as string | null,
        title: c.title,
        points: c.basePoints,
        difficulty: c.difficulty,
        completed: false,
        icon: c.icon,
      })),
  ]

  const filteredChores = displayItems.filter((chore) => {
    if (filter === 'pending') return !chore.completed
    if (filter === 'completed') return chore.completed
    return true
  })

  const handleCompleteChore = async (item: typeof displayItems[0]) => {
    if (item.completed || !currentKid) return

    if (item.assignmentId) {
      // Complete existing assignment
      const res = await fetch(`/api/chores/assignments/${item.assignmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      })
      if (res.ok) {
        setAssignments((prev) =>
          prev.map((a) => a.id === item.assignmentId ? { ...a, status: 'COMPLETED' as const, pointsEarned: item.points } : a)
        )
        setShowPointsEarned(item.points)
        fetchKids()
      }
    }
  }

  const handleAddChore = async () => {
    if (!newChore.title) return
    setSaving(true)

    const res = await fetch('/api/chores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newChore.title,
        basePoints: newChore.points,
        difficulty: newChore.difficulty,
        icon: newChore.icon,
      }),
    })

    if (res.ok) {
      const chore = await res.json()
      setChores((prev) => [...prev, chore])
    }

    setSaving(false)
    setIsAddModalOpen(false)
    setNewChore({ title: '', points: 10, difficulty: 'EASY', icon: '⭐' })
  }

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
        <h1 className="text-2xl font-bold mb-2">No Profile Selected</h1>
        <p className="text-gray-500 mb-6">Select a kid profile to view chores</p>
      </div>
    )
  }

  const pendingCount = displayItems.filter((c) => !c.completed).length
  const completedCount = displayItems.filter((c) => c.completed).length

  return (
    <div className="space-y-8">
      {/* Points earned animation */}
      <AnimatePresence>
        {showPointsEarned && (
          <PointsEarned
            amount={showPointsEarned}
            onComplete={() => setShowPointsEarned(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">{currentKid.name}&apos;s Chores</h1>
          <p className="text-gray-500 mt-1">
            {pendingCount} chores left today
          </p>
        </div>
        <Button
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Chore
        </Button>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All', count: displayItems.length },
          { key: 'pending', label: 'To Do', count: pendingCount },
          { key: 'completed', label: 'Done', count: completedCount },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as typeof filter)}
            className={cn(
              'px-4 py-2 rounded-xl font-medium transition-colors',
              filter === tab.key
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-white hover:bg-gray-100 text-gray-600'
            )}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Chores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChores.map((chore, index) => (
          <motion.div
            key={chore.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={cn(
                'transition-all',
                chore.completed && 'opacity-60'
              )}
              hoverable={!chore.completed}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <motion.button
                    onClick={() => handleCompleteChore(chore)}
                    disabled={chore.completed}
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                      chore.completed
                        ? 'bg-green-500'
                        : 'border-2 border-gray-300 hover:border-[var(--color-primary)]'
                    )}
                    whileHover={!chore.completed ? { scale: 1.1 } : {}}
                    whileTap={!chore.completed ? { scale: 0.9 } : {}}
                  >
                    {chore.completed ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <span className="text-xl">{chore.icon}</span>
                    )}
                  </motion.button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={cn(
                          'font-semibold',
                          chore.completed && 'line-through text-gray-400'
                        )}
                      >
                        {chore.title}
                      </h3>
                      <Badge
                        className={cn(
                          difficultyColors[chore.difficulty].bg,
                          difficultyColors[chore.difficulty].text
                        )}
                        size="sm"
                      >
                        {chore.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm font-semibold text-amber-600">
                        <Star className="w-4 h-4" />
                        +{chore.points}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredChores.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">
            {filter === 'completed' ? '🎯' : '🎉'}
          </div>
          <h3 className="text-xl font-semibold">
            {filter === 'completed'
              ? 'No completed chores yet'
              : 'All done for today!'}
          </h3>
          <p className="text-gray-500 mt-1">
            {filter === 'completed'
              ? 'Complete some chores to see them here'
              : 'Great job, ChoreChamp!'}
          </p>
        </motion.div>
      )}

      {/* Add Chore Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Chore"
        size="md"
      >
        <div className="space-y-6">
          <Input
            label="Chore Name"
            placeholder="What needs to be done?"
            value={newChore.title}
            onChange={(e) => setNewChore({ ...newChore, title: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {choreIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setNewChore({ ...newChore, icon })}
                  className={cn(
                    'w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all',
                    newChore.icon === icon
                      ? 'bg-[var(--color-primary)] scale-110'
                      : 'bg-gray-100 hover:bg-gray-200'
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <div className="flex gap-2">
              {(['EASY', 'MEDIUM', 'HARD'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setNewChore({ ...newChore, difficulty: diff })}
                  className={cn(
                    'flex-1 py-2 px-4 rounded-xl font-medium transition-all',
                    newChore.difficulty === diff
                      ? cn(difficultyColors[diff].bg, difficultyColors[diff].text, 'ring-2 ring-offset-2')
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points: {newChore.points}
            </label>
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={newChore.points}
              onChange={(e) => setNewChore({ ...newChore, points: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>5</span>
              <span>50</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleAddChore}
              disabled={!newChore.title || saving}
            >
              {saving ? 'Adding...' : 'Add Chore'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
