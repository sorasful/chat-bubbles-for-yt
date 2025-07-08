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
          console.log('Audio context initialized:', ctx.state)
          set({ audioContext: ctx })
          return ctx
        }
        return audioContext
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
        
        if (!audioSettings.keyboardSoundEnabled || !audioSettings.currentSoundPack || !audioContext || audioContext.state === 'suspended') {
          return
        }

        const soundPack = soundPacks[audioSettings.currentSoundPack]
        if (!soundPack) {
          console.log('No sound pack found for:', audioSettings.currentSoundPack)
          return
        }

        const { config, audioBuffer } = soundPack
        const keyDefine = config.defines[keyCode]
        
        if (!keyDefine) {
          console.log('No key define found for:', keyCode, 'Available keys:', Object.keys(config.defines).slice(0, 10))
          return
        }

        const [startTime, duration] = keyDefine
        // Les valeurs dans MechVibes sont en millisecondes, on les convertit en secondes
        const startTimeSeconds = startTime / 1000
        const durationSeconds = duration / 1000
        
        console.log(`Playing key ${keyCode}: start=${startTimeSeconds}s, duration=${durationSeconds}s`)

        try {
          // Resume audio context if suspended
          if (audioContext.state === 'suspended') {
            audioContext.resume()
          }
          
          const source = audioContext.createBufferSource()
          const gainNode = audioContext.createGain()
          
          source.buffer = audioBuffer
          gainNode.gain.value = audioSettings.keyboardVolume
          
          source.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          // Vérifier que les valeurs sont valides
          if (startTimeSeconds >= 0 && durationSeconds > 0 && startTimeSeconds < audioBuffer.duration) {
            source.start(0, startTimeSeconds, Math.min(durationSeconds, audioBuffer.duration - startTimeSeconds))
          } else {
            console.warn('Invalid audio timing:', { startTimeSeconds, durationSeconds, bufferDuration: audioBuffer.duration })
            // Fallback: jouer un petit segment au début
            source.start(0, 0, 0.1)
          }
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