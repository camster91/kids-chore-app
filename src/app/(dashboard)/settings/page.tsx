'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import {
  Settings,
  User,
  Bell,
  Trash2,
  LogOut,
  Shield,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { Card, CardContent, Button } from '@/components/ui'
import { useKidStore } from '@/stores/kid-store'
import { useThemeStore } from '@/stores/theme-store'
import { cn } from '@/lib/utils'

interface NotificationSettings {
  choreReminders: boolean
  streakAlerts: boolean
  rewardUnlocks: boolean
  soundEffects: boolean
}

const defaultNotificationSettings: NotificationSettings = {
  choreReminders: true,
  streakAlerts: true,
  rewardUnlocks: true,
  soundEffects: true,
}

function getNotificationSettings(): NotificationSettings {
  if (typeof window === 'undefined') return defaultNotificationSettings
  try {
    const stored = localStorage.getItem('kids-chore-notifications')
    return stored ? JSON.parse(stored) : defaultNotificationSettings
  } catch {
    return defaultNotificationSettings
  }
}

function saveNotificationSettings(settings: NotificationSettings) {
  localStorage.setItem('kids-chore-notifications', JSON.stringify(settings))
}

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        enabled ? 'bg-[var(--color-primary)]' : 'bg-gray-300'
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
          enabled ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  )
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const { kids, setCurrentKid, removeKid } = useKidStore()
  const themeStore = useThemeStore()
  const [notifications, setNotifications] = useState<NotificationSettings>(
    getNotificationSettings
  )
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const updateNotification = (key: keyof NotificationSettings) => {
    const updated = { ...notifications, [key]: !notifications[key] }
    setNotifications(updated)
    saveNotificationSettings(updated)
  }

  const handleClearAllData = () => {
    kids.forEach((kid) => removeKid(kid.id))
    setCurrentKid(null)
    themeStore.reset()
    localStorage.removeItem('kids-chore-notifications')
    setNotifications(defaultNotificationSettings)
    setShowClearConfirm(false)
  }

  const notificationItems = [
    {
      key: 'choreReminders' as const,
      label: 'Chore Reminders',
      description: 'Get reminded about pending chores',
      icon: Bell,
    },
    {
      key: 'streakAlerts' as const,
      label: 'Streak Alerts',
      description: 'Notifications when streaks are at risk',
      icon: Shield,
    },
    {
      key: 'rewardUnlocks' as const,
      label: 'Reward Unlocks',
      description: 'Alerts when new rewards are available',
      icon: Bell,
    },
    {
      key: 'soundEffects' as const,
      label: 'Sound Effects',
      description: 'Play sounds for achievements and completions',
      icon: notifications.soundEffects ? Volume2 : VolumeX,
    },
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your ChoreChamps preferences</p>
      </motion.div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">Account</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-gray-800">Name</p>
                  <p className="text-sm text-gray-500">{session?.user?.name || 'Parent'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-gray-800">Email</p>
                  <p className="text-sm text-gray-500">{session?.user?.email || '—'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">Kid Profiles</p>
                  <p className="text-sm text-gray-500">
                    {kids.length} {kids.length === 1 ? 'profile' : 'profiles'} created
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">Notifications</h2>
            </div>
            <div className="space-y-1">
              {notificationItems.map((item, index) => (
                <div
                  key={item.key}
                  className={cn(
                    'flex items-center justify-between py-4',
                    index < notificationItems.length - 1 && 'border-b'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <Toggle
                    enabled={notifications[item.key]}
                    onToggle={() => updateNotification(item.key)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">Data Management</h2>
            </div>

            {showClearConfirm ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="font-medium text-red-800 mb-2">
                  Are you sure you want to clear all data?
                </p>
                <p className="text-sm text-red-600 mb-4">
                  This will remove all kid profiles, points, streaks, and preferences.
                  This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowClearConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={handleClearAllData}
                  >
                    Yes, Clear Everything
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Clear All Data</p>
                    <p className="text-sm text-gray-500">
                      Remove all kid profiles and reset preferences
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => setShowClearConfirm(true)}
                  >
                    Clear Data
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Sign Out */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          variant="outline"
          className="w-full text-red-500 border-red-200 hover:bg-red-50"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>
      </motion.div>
    </div>
  )
}
