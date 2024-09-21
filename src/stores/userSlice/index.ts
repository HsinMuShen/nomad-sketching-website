import type { StateCreator } from 'zustand'
import type { User } from 'types/user'

export type UserState = {
  user: User | null
  hasInitialized: boolean
  getIsLogin: () => boolean
  setUser: (user: User) => void
  setHasInitialized: (hasInitialized: boolean) => void
  logout: () => void
}

export const createUserSlice: StateCreator<UserState> = (set, get) => ({
  user: null,
  hasInitialized: false,
  getIsLogin: () => !!get().user,
  setUser: (user: User) => set({ user }),
  setHasInitialized: (hasInitialized: boolean) => set({ hasInitialized }),
  logout: () => set({ user: null }),
})
