import type { StateCreator } from 'zustand'

export type User = {
  uid: string
  email: string
}

export type UserState = {
  user: User | null
  getIsLogin: () => boolean
  setUser: (user: User) => void
  logout: () => void
}

export const createUserSlice: StateCreator<UserState> = (set, get) => ({
  user: null,
  getIsLogin: () => !!get().user,
  setUser: (user: User) => set({ user }),
  logout: () => set({ user: null }),
})
