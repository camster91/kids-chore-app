'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Pencil,
  Trash2,
  Check,
} from 'lucide-react'
import { useKidStore, Kid } from '@/stores/kid-store'
import { useThemeStore, ThemeMode } from '@/stores/theme-store'
import { Card, CardContent, Button, Input, Modal } from '@/components/ui'
import { ThemeSwitcher } from '@/components/themes/ThemeSwitcher'
import { PointsDisplay, StreakCounter, LevelBadge, AchievementBadge } from '@/components/gamification'
import { cn } from '@/lib/utils'

const avatarOptions = [
  { id: 'unicorn', emoji: '🦄' },
  { id: 'dragon', emoji: '🐉' },
  { id: 'robot', emoji: '🤖' },
  { id: 'astronaut', emoji: '👨‍🚀' },
  { id: 'fairy', emoji: '🧚' },
  { id: 'superhero', emoji: '🦸' },
  { id: 'cat', emoji: '🐱' },
  { id: 'dog', emoji: '🐶' },
  { id: 'panda', emoji: '🐼' },
  { id: 'lion', emoji: '🦁' },
  { id: 'owl', emoji: '🦉' },
  { id: 'star', emoji: '⭐' },
]

const sampleBadges = [
  { id: '1', name: 'First Chore', description: 'Complete your first chore', icon: 'star', earned: true, earnedAt: new Date() },
  { id: '2', name: '7-Day Streak', description: 'Complete chores 7 days in a row', icon: 'flame', earned: true, earnedAt: new Date() },
  { id: '3', name: 'Super Helper', description: 'Complete 50 chores', icon: 'trophy', earned: false },
  { id: '4', name: 'Early Bird', description: 'Complete morning routine 5 times', icon: 'zap', earned: false },
]

export default function ProfilePage() {
  const { currentKid, kids, setCurrentKid, fetchKids, createKid, deleteKid, updateKidAPI } = useKidStore()
  const { setMode, setCustomColors } = useThemeStore()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingKid, setEditingKid] = useState<Kid | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchKids()
  }, [fetchKids])

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    avatarId: 'unicorn',
    themeMode: 'NEUTRAL' as ThemeMode,
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
  })

  const handleCreateKid = async () => {
    if (!formData.name || !formData.age) return
    setSaving(true)

    const kid = await createKid({
      name: formData.name,
      age: parseInt(formData.age),
      avatarId: formData.avatarId,
      themeMode: formData.themeMode,
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
    })

    setSaving(false)
    if (kid) {
      setCurrentKid(kid)
      setMode(kid.themeMode)
      setCustomColors(kid.primaryColor, kid.secondaryColor)
      setIsCreateModalOpen(false)
      resetForm()
    }
  }

  const handleEditKid = async () => {
    if (!editingKid || !formData.name || !formData.age) return
    setSaving(true)

    const updates = {
      name: formData.name,
      age: parseInt(formData.age),
      avatarId: formData.avatarId,
      themeMode: formData.themeMode,
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
    }

    await updateKidAPI(editingKid.id, updates)
    setSaving(false)

    if (currentKid?.id === editingKid.id) {
      setMode(formData.themeMode)
      setCustomColors(formData.primaryColor, formData.secondaryColor)
    }

    setIsEditModalOpen(false)
    setEditingKid(null)
    resetForm()
  }

  const handleDeleteKid = async (kid: Kid) => {
    if (confirm(`Are you sure you want to remove ${kid.name}?`)) {
      await deleteKid(kid.id)
    }
  }

  const handleSelectKid = (kid: Kid) => {
    setCurrentKid(kid)
    setMode(kid.themeMode)
    setCustomColors(kid.primaryColor, kid.secondaryColor)
  }

  const openEditModal = (kid: Kid) => {
    setEditingKid(kid)
    setFormData({
      name: kid.name,
      age: kid.age.toString(),
      avatarId: kid.avatarId,
      themeMode: kid.themeMode,
      primaryColor: kid.primaryColor,
      secondaryColor: kid.secondaryColor,
    })
    setIsEditModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      avatarId: 'unicorn',
      themeMode: 'NEUTRAL',
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
    })
  }

  const getAvatarEmoji = (avatarId: string) => {
    return avatarOptions.find((a) => a.id === avatarId)?.emoji || '⭐'
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Kid Profiles</h1>
        <p className="text-gray-500 mt-1">Manage your family&apos;s ChoreChamps</p>
      </motion.div>

      {/* Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kids.map((kid, index) => (
          <motion.div
            key={kid.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={cn(
                'cursor-pointer transition-all',
                currentKid?.id === kid.id && 'ring-4 ring-[var(--color-primary)]'
              )}
              hoverable
              onClick={() => handleSelectKid(kid)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                    style={{
                      background: `linear-gradient(135deg, ${kid.primaryColor}, ${kid.secondaryColor})`,
                    }}
                  >
                    {getAvatarEmoji(kid.avatarId)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditModal(kid)
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteKid(kid)
                      }}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold">{kid.name}</h3>
                <p className="text-gray-500 text-sm">Age {kid.age}</p>

                <div className="flex items-center gap-4 mt-4">
                  <PointsDisplay points={kid.points} size="sm" />
                  <StreakCounter days={kid.streakDays} size="sm" showLabel={false} />
                  <LevelBadge
                    level={kid.level}
                    experience={kid.experience}
                    experienceToNext={100}
                    size="sm"
                    showProgress={false}
                  />
                </div>

                {currentKid?.id === kid.id && (
                  <div className="flex items-center gap-2 mt-4 text-[var(--color-primary)]">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Active Profile</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Add New Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: kids.length * 0.1 }}
        >
          <Card
            className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-[var(--color-primary)] transition-colors"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <p className="font-medium text-gray-600">Add New Kid</p>
              <p className="text-sm text-gray-400 mt-1">Create a new profile</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Current Kid's Badges */}
      {currentKid && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">{currentKid.name}&apos;s Badges</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sampleBadges.map((badge) => (
                  <AchievementBadge
                    key={badge.id}
                    name={badge.name}
                    description={badge.description}
                    icon={badge.icon}
                    earned={badge.earned}
                    earnedAt={badge.earnedAt}
                    size="md"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Create Kid Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          resetForm()
        }}
        title="Create New Profile"
        description="Set up a new ChoreChamp!"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Name"
              placeholder="Kid's name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Age"
              type="number"
              placeholder="Age"
              min={1}
              max={18}
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatarId: avatar.id })}
                  className={cn(
                    'w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all',
                    formData.avatarId === avatar.id
                      ? 'bg-[var(--color-primary)] scale-110 shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200'
                  )}
                >
                  {avatar.emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Theme
            </label>
            <ThemeSwitcher showColorPicker />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsCreateModalOpen(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleCreateKid}
              disabled={!formData.name || !formData.age || saving}
            >
              {saving ? 'Creating...' : 'Create Profile'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Kid Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingKid(null)
          resetForm()
        }}
        title="Edit Profile"
        description="Update ChoreChamp settings"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Name"
              placeholder="Kid's name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Age"
              type="number"
              placeholder="Age"
              min={1}
              max={18}
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatarId: avatar.id })}
                  className={cn(
                    'w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all',
                    formData.avatarId === avatar.id
                      ? 'bg-[var(--color-primary)] scale-110 shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200'
                  )}
                >
                  {avatar.emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Theme
            </label>
            <ThemeSwitcher showColorPicker />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsEditModalOpen(false)
                setEditingKid(null)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleEditKid}
              disabled={!formData.name || !formData.age || saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
