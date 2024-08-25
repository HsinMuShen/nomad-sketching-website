import type { StateCreator } from 'zustand'

export type User = {
  id: string
  name: string
}

export type UserState = {
  user: User | null
  isLogin: () => boolean
  setUser: (user: User) => void
  logout: () => void
}

export const createUserSlice: StateCreator<UserState> = (set, get) => ({
  user: null,
  isLogin: () => !!get().user,
  setUser: (user: User) => set({ user }),
  logout: () => set({ user: null }),
})
