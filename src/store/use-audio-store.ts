import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { AudioSettings, defaultAudioSettings, MechVibesConfig } from '../types/audio'

interface AudioStore {
  audioSettings: AudioSettings
  soundPacks: Record<string, { config: MechVibesConfig; audioBuffer: AudioBuffer }>
  messageSoundBuffer?: AudioBuffer
  audioContext?: AudioContext
  updateAudioSetting: <K extends keyof AudioSettings>(key: K, value: AudioSettings[K]) => void
  initAudioContext: () => void
  loadSoundPack: (config: MechVibesConfig, audioFile: File) => Promise<void>
  loadMessageSound: (audioFile: File) => Promise<void>
  playKeySound: (keyCode: string) => void
  playMessageSound: () => void
  removeSoundPack: (packId: string) => void
}

const useAudioStore = create<AudioStore>()(
  persist(
    (set, get) => ({
      audioSettings: defaultAudioSettings,
      soundPacks: {},
      messageSoundBuffer: undefined,
      audioContext: undefined,

      updateAudioSetting: (key, value) =>
        set((state) => ({
          audioSettings: {
            ...state.audioSettings,
            [key]: value
          }
        })),

      initAudioContext: () => {
        const { audioContext } = get()
        if (!audioContext) {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
          set({ audioContext: ctx })
        }
      },

      loadSoundPack: async (config: MechVibesConfig, audioFile: File) => {
        const { audioContext, initAudioContext } = get()
        
        if (!audioContext) {
          initAudioContext()
        }

        const ctx = get().audioContext!
        const arrayBuffer = await audioFile.arrayBuffer()
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer)

        set((state) => ({
          soundPacks: {
            ...state.soundPacks,
            [config.id]: { config, audioBuffer }
          },
          audioSettings: {
            ...state.audioSettings,
            currentSoundPack: config.id
          }
        }))
      },

      loadMessageSound: async (audioFile: File) => {
        const { audioContext, initAudioContext } = get()
        
        if (!audioContext) {
          initAudioContext()
        }

        const ctx = get().audioContext!
        const arrayBuffer = await audioFile.arrayBuffer()
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer)

        set({ messageSoundBuffer: audioBuffer })
      },

      playKeySound: (keyCode: string) => {
        const { audioSettings, soundPacks, audioContext } = get()
        
        if (!audioSettings.keyboardSoundEnabled || !audioSettings.currentSoundPack || !audioContext) {
          return
        }

        const soundPack = soundPacks[audioSettings.currentSoundPack]
        if (!soundPack) return

        const { config, audioBuffer } = soundPack
        const keyDefine = config.defines[keyCode]
        
        if (!keyDefine) return

        const [startTime, duration] = keyDefine
        const startTimeSeconds = startTime / 1000
        const durationSeconds = duration / 1000

        try {
          const source = audioContext.createBufferSource()
          const gainNode = audioContext.createGain()
          
          source.buffer = audioBuffer
          gainNode.gain.value = audioSettings.keyboardVolume
          
          source.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          source.start(0, startTimeSeconds, durationSeconds)
        } catch (error) {
          console.error('Error playing key sound:', error)
        }
      },

      playMessageSound: () => {
        const { audioSettings, messageSoundBuffer, audioContext } = get()
        
        if (!audioSettings.messageSoundEnabled || !messageSoundBuffer || !audioContext) {
          return
        }

        try {
          const source = audioContext.createBufferSource()
          const gainNode = audioContext.createGain()
          
          source.buffer = messageSoundBuffer
          gainNode.gain.value = audioSettings.messageVolume
          
          source.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          source.start()
        } catch (error) {
          console.error('Error playing message sound:', error)
        }
      },

      removeSoundPack: (packId: string) => {
        set((state) => {
          const newSoundPacks = { ...state.soundPacks }
          delete newSoundPacks[packId]
          
          const newAudioSettings = { ...state.audioSettings }
          if (newAudioSettings.currentSoundPack === packId) {
            newAudioSettings.currentSoundPack = undefined
          }
          
          return {
            soundPacks: newSoundPacks,
            audioSettings: newAudioSettings
          }
        })
      }
    }),
    {
      name: 'chat-bubbles-audio',
      partialize: (state) => ({
        audioSettings: state.audioSettings
      })
    }
  )
)

export { useAudioStore }