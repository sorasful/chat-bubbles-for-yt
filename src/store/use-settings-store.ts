import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { SettingsType, defaultSettings } from '../types/settings'

interface SettingsStore {
  settings: SettingsType
  isSettingsOpen: boolean
  updateSetting: <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => void
  resetSettings: () => void
  toggleSettings: () => void
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      isSettingsOpen: false,
      updateSetting: (key, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            [key]: value
          }
        })),
      resetSettings: () =>
        set({
          settings: defaultSettings
        }),
      toggleSettings: () =>
        set((state) => ({
          isSettingsOpen: !state.isSettingsOpen
        }))
    }),
    {
      name: 'chat-bubbles-settings'
    }
  )
)

export { useSettingsStore }