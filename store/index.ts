import type { UserState } from './userSlice'
import { create } from 'zustand'
import { createUserSlice } from './userSlice'

export const useBoundStore = create<UserState>((...a) => ({
  ...createUserSlice(...a),
}))
