import { create } from 'zustand'

interface AppState {
  count: number
  darkMode: boolean
  setCount: (value: number) => void
  toggleDarkMode: () => void
}

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  darkMode: false,
  setCount: (value) => set({ count: value }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}))
