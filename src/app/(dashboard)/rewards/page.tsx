'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gift,
  Plus,
  Star,
  ShoppingCart,
  Check,
  Sparkles,
} from 'lucide-react'
import { useKidStore } from '@/stores/kid-store'
import { Card, CardContent, Button, Badge, Modal, Input } from '@/components/ui'
import { PointsDisplay } from '@/components/gamification'
import { cn } from '@/lib/utils'

interface Reward {
  id: string
  title: string
  description?: string
  cost: number
  icon: string
  category: string
}

const rewardIcons = ['🎮', '📱', '🍦', '🎬', '🛍️', '🎨', '📚', '🎵', '⚽', '🎁']

// Mock data
const initialRewards: Reward[] = [
  { id: '1', title: '30 min Screen Time', description: 'Extra screen time for games or videos', cost: 50, icon: '🎮', category: 'Screen Time' },
  { id: '2', title: 'Ice Cream Trip', description: 'Visit to the ice cream shop', cost: 100, icon: '🍦', category: 'Treats' },
  { id: '3', title: 'Movie Night Pick', description: 'Choose the family movie', cost: 75, icon: '🎬', category: 'Activities' },
  { id: '4', title: 'Stay Up Late (30 min)', description: 'Extra 30 minutes before bedtime', cost: 60, icon: '🌙', category: 'Privileges' },
  { id: '5', title: 'Skip One Chore', description: 'Get a free pass on one chore', cost: 80, icon: '🎫', category: 'Privileges' },
  { id: '6', title: 'Small Toy/Book', description: 'Pick a small toy or book (up to $10)', cost: 200, icon: '🎁', category: 'Prizes' },
]

export default function RewardsPage() {
  const { currentKid, updateKid } = useKidStore()
  const [rewards, setRewards] = useState<Reward[]>(initialRewards)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [newReward, setNewReward] = useState({
    title: '',
    description: '',
    cost: 50,
    icon: '🎁',
  })

  const handleRedeemReward = (reward: Reward) => {
    if (!currentKid || currentKid.points < reward.cost) return

    // Deduct points
    updateKid(currentKid.id, { points: currentKid.points - reward.cost })

    // Show success
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setSelectedReward(null)
    }, 2000)
  }

  const handleAddReward = () => {
    if (!newReward.title) return

    const reward: Reward = {
      id: Date.now().toString(),
      title: newReward.title,
      description: newReward.description,
      cost: newReward.cost,
      icon: newReward.icon,
      category: 'Custom',
    }

    setRewards((prev) => [...prev, reward])
    setIsAddModalOpen(false)
    setNewReward({ title: '', description: '', cost: 50, icon: '🎁' })
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
        <p className="text-gray-500 mb-6">Select a kid profile to view rewards</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">Reward Shop</h1>
          <p className="text-gray-500 mt-1">
            Redeem your hard-earned points for awesome rewards!
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow">
            <span className="text-gray-500">Your Points:</span>
            <PointsDisplay points={currentKid.points} size="md" />
          </div>
          <Button
            leftIcon={<Plus className="w-5 h-5" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Reward
          </Button>
        </div>
      </motion.div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward, index) => {
          const canAfford = currentKid.points >= reward.cost

          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={cn(
                  'h-full transition-all',
                  !canAfford && 'opacity-60'
                )}
                hoverable={canAfford}
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                      style={{
                        background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`,
                      }}
                    >
                      {reward.icon}
                    </div>
                    <Badge variant={canAfford ? 'primary' : 'info'}>
                      {reward.category}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold">{reward.title}</h3>
                  {reward.description && (
                    <p className="text-gray-500 text-sm mt-1">{reward.description}</p>
                  )}

                  <div className="flex-1" />

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-5 h-5 fill-amber-500" />
                      {reward.cost}
                    </div>
                    <Button
                      size="sm"
                      variant={canAfford ? 'primary' : 'outline'}
                      disabled={!canAfford}
                      onClick={() => setSelectedReward(reward)}
                    >
                      {canAfford ? 'Redeem' : `Need ${reward.cost - currentKid.points} more`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Redeem Confirmation Modal */}
      <Modal
        isOpen={!!selectedReward}
        onClose={() => setSelectedReward(null)}
        title={showSuccess ? '' : 'Redeem Reward?'}
        size="sm"
        showCloseButton={!showSuccess}
      >
        {showSuccess ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-green-600">Reward Redeemed!</h3>
            <p className="text-gray-500 mt-2">
              Ask your parent to fulfill your reward
            </p>
          </motion.div>
        ) : selectedReward ? (
          <div className="text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4"
              style={{
                background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`,
              }}
            >
              {selectedReward.icon}
            </div>
            <h3 className="text-xl font-bold">{selectedReward.title}</h3>
            <div className="flex items-center justify-center gap-1 text-amber-600 font-bold mt-2">
              <Star className="w-5 h-5 fill-amber-500" />
              {selectedReward.cost} points
            </div>
            <p className="text-gray-500 mt-4">
              After redeeming, you&apos;ll have{' '}
              <span className="font-bold text-[var(--color-primary)]">
                {currentKid.points - selectedReward.cost}
              </span>{' '}
              points left.
            </p>
            <div className="flex gap-4 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedReward(null)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => handleRedeemReward(selectedReward)}
              >
                Confirm
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Add Reward Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Reward"
        size="md"
      >
        <div className="space-y-6">
          <Input
            label="Reward Name"
            placeholder="What's the reward?"
            value={newReward.title}
            onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
          />

          <Input
            label="Description (optional)"
            placeholder="Describe the reward"
            value={newReward.description}
            onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {rewardIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setNewReward({ ...newReward, icon })}
                  className={cn(
                    'w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all',
                    newReward.icon === icon
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
              Point Cost: {newReward.cost}
            </label>
            <input
              type="range"
              min={10}
              max={500}
              step={10}
              value={newReward.cost}
              onChange={(e) => setNewReward({ ...newReward, cost: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>10</span>
              <span>500</span>
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
              onClick={handleAddReward}
              disabled={!newReward.title}
            >
              Add Reward
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
