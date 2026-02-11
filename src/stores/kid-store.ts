import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Kid {
  id: string
  name: string
  age: number
  avatarId: string
  themeMode: 'GIRL' | 'BOY' | 'NEUTRAL'
  primaryColor: string
  secondaryColor: string
  points: number
  totalPoints: number
  streakDays: number
  level: number
  experience: number
}

interface KidState {
  currentKid: Kid | null
  kids: Kid[]
  loaded: boolean

  setCurrentKid: (kid: Kid | null) => void
  setKids: (kids: Kid[]) => void
  addKid: (kid: Kid) => void
  updateKid: (kidId: string, updates: Partial<Kid>) => void
  removeKid: (kidId: string) => void
  addPoints: (amount: number) => void
  fetchKids: () => Promise<void>
  createKid: (data: Omit<Kid, 'id' | 'points' | 'totalPoints' | 'streakDays' | 'level' | 'experience'>) => Promise<Kid | null>
  deleteKid: (kidId: string) => Promise<boolean>
  updateKidAPI: (kidId: string, updates: Partial<Kid>) => Promise<Kid | null>
}

export const useKidStore = create<KidState>()(
  persist(
    (set, get) => ({
      currentKid: null,
      kids: [],
      loaded: false,

      setCurrentKid: (kid) => set({ currentKid: kid }),

      setKids: (kids) => set({ kids }),

      addKid: (kid) =>
        set((state) => ({
          kids: [...state.kids, kid],
        })),

      updateKid: (kidId, updates) =>
        set((state) => ({
          kids: state.kids.map((k) =>
            k.id === kidId ? { ...k, ...updates } : k
          ),
          currentKid:
            state.currentKid?.id === kidId
              ? { ...state.currentKid, ...updates }
              : state.currentKid,
        })),

      removeKid: (kidId) =>
        set((state) => ({
          kids: state.kids.filter((k) => k.id !== kidId),
          currentKid:
            state.currentKid?.id === kidId ? null : state.currentKid,
        })),

      addPoints: (amount) => {
        const state = get()
        if (!state.currentKid) return

        const newPoints = state.currentKid.points + amount
        const newTotalPoints = state.currentKid.totalPoints + amount

        set({
          currentKid: {
            ...state.currentKid,
            points: newPoints,
            totalPoints: newTotalPoints,
          },
          kids: state.kids.map((k) =>
            k.id === state.currentKid!.id
              ? { ...k, points: newPoints, totalPoints: newTotalPoints }
              : k
          ),
        })
      },

      fetchKids: async () => {
        try {
          const res = await fetch('/api/kids')
          if (!res.ok) return
          const kids = await res.json()
          const state = get()
          set({ kids, loaded: true })
          if (state.currentKid) {
            const updated = kids.find((k: Kid) => k.id === state.currentKid?.id)
            if (updated) set({ currentKid: updated })
          }
        } catch {
          // Keep localStorage data as fallback
        }
      },

      createKid: async (data) => {
        try {
          const res = await fetch('/api/kids', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
          if (!res.ok) return null
          const kid = await res.json()
          get().addKid(kid)
          return kid
        } catch {
          return null
        }
      },

      deleteKid: async (kidId) => {
        try {
          const res = await fetch(`/api/kids/${kidId}`, { method: 'DELETE' })
          if (!res.ok) return false
          get().removeKid(kidId)
          return true
        } catch {
          return false
        }
      },

      updateKidAPI: async (kidId, updates) => {
        try {
          const res = await fetch(`/api/kids/${kidId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
          })
          if (!res.ok) return null
          const kid = await res.json()
          get().updateKid(kidId, kid)
          return kid
        } catch {
          return null
        }
      },
    }),
    {
      name: 'kids-chore-kid',
    }
  )
)
