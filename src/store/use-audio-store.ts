import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { AudioSettings, defaultAudioSettings, MechVibesConfig } from '../types/audio'

interface SoundPack {
  config: MechVibesConfig
  audioBuffer?: AudioBuffer
  audioUrl?: string
}

interface AudioStore {
  audioSettings: AudioSettings
  soundPacks: Record<string, SoundPack>
  messageSoundBuffer?: AudioBuffer
  messageSoundUrl?: string
  audioContext?: AudioContext
  updateAudioSetting: <K extends keyof AudioSettings>(key: K, value: AudioSettings[K]) => void
  initAudioContext: () => AudioContext
  loadSoundPack: (config: MechVibesConfig, audioFile: File) => Promise<void>
  loadMessageSound: (audioFile: File) => Promise<void>
  playKeySound: (keyCode: string) => void
  playMessageSound: () => void
  removeSoundPack: (packId: string) => void
  reloadAudioBuffers: () => Promise<void>
}

const useAudioStore = create<AudioStore>()(
  persist(
    (set, get) => ({
      audioSettings: defaultAudioSettings,
      soundPacks: {},
      messageSoundBuffer: undefined,
      messageSoundUrl: undefined,
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
        if (!audioContext || audioContext.state === 'closed') {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
          console.log('Audio context initialized:', ctx.state)
          set({ audioContext: ctx })
          return ctx
        }
        return audioContext
      },

      loadSoundPack: async (config: MechVibesConfig, audioFile: File) => {
        try {
          const { initAudioContext } = get()
          const ctx = initAudioContext()
          
          // Create URL for the audio file to persist it
          const audioUrl = URL.createObjectURL(audioFile)
          
          // Decode audio data
          const arrayBuffer = await audioFile.arrayBuffer()
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer)

          console.log('Sound pack loaded:', config.name)
          console.log('Audio buffer duration:', audioBuffer.duration, 'seconds')
          console.log('Available keys:', Object.keys(config.defines).length)

          set((state) => ({
            soundPacks: {
              ...state.soundPacks,
              [config.id]: { 
                config, 
                audioBuffer,
                audioUrl 
              }
            },
            audioSettings: {
              ...state.audioSettings,
              currentSoundPack: config.id
            }
          }))
        } catch (error) {
          console.error('Error loading sound pack:', error)
          throw error
        }
      },

      loadMessageSound: async (audioFile: File) => {
        try {
          const { initAudioContext } = get()
          const ctx = initAudioContext()
          
          const audioUrl = URL.createObjectURL(audioFile)
          const arrayBuffer = await audioFile.arrayBuffer()
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer)

          set({ 
            messageSoundBuffer: audioBuffer,
            messageSoundUrl: audioUrl 
          })
        } catch (error) {
          console.error('Error loading message sound:', error)
          throw error
        }
      },

      reloadAudioBuffers: async () => {
        const { soundPacks, messageSoundUrl, initAudioContext } = get()
        const ctx = initAudioContext()
        
        // Reload sound packs
        for (const [packId, pack] of Object.entries(soundPacks)) {
          if (pack.audioUrl && !pack.audioBuffer) {
            try {
              const response = await fetch(pack.audioUrl)
              const arrayBuffer = await response.arrayBuffer()
              const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
              
              set((state) => ({
                soundPacks: {
                  ...state.soundPacks,
                  [packId]: {
                    ...state.soundPacks[packId],
                    audioBuffer
                  }
                }
              }))
            } catch (error) {
              console.error('Error reloading sound pack:', packId, error)
            }
          }
        }
        
        // Reload message sound
        if (messageSoundUrl && !get().messageSoundBuffer) {
          try {
            const response = await fetch(messageSoundUrl)
            const arrayBuffer = await response.arrayBuffer()
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
            
            set({ messageSoundBuffer: audioBuffer })
          } catch (error) {
            console.error('Error reloading message sound:', error)
          }
        }
      },

      playKeySound: (keyCode: string) => {
        const { audioSettings, soundPacks, audioContext, initAudioContext } = get()
        
        if (!audioSettings.keyboardSoundEnabled || !audioSettings.currentSoundPack) {
          return
        }

        const ctx = audioContext || initAudioContext()
        
        // Resume audio context if suspended
        if (ctx.state === 'suspended') {
          ctx.resume().then(() => {
            // Retry playing after resume
            setTimeout(() => get().playKeySound(keyCode), 100)
          })
          return
        }

        const soundPack = soundPacks[audioSettings.currentSoundPack]
        if (!soundPack || !soundPack.audioBuffer) {
          console.log('No sound pack or audio buffer found for:', audioSettings.currentSoundPack)
          return
        }

        const { config, audioBuffer } = soundPack
        const keyDefine = config.defines[keyCode]
        
        if (!keyDefine) {
          console.log('No key define found for:', keyCode)
          return
        }

        const [startTimeMs, durationMs] = keyDefine
        const startTimeSeconds = startTimeMs / 1000
        const durationSeconds = durationMs / 1000
        
        console.log(`Playing key ${keyCode}: start=${startTimeSeconds}s, duration=${durationSeconds}s`)

        try {
          const source = ctx.createBufferSource()
          const gainNode = ctx.createGain()
          
          source.buffer = audioBuffer
          gainNode.gain.value = audioSettings.keyboardVolume
          
          source.connect(gainNode)
          gainNode.connect(ctx.destination)
          
          // Validate timing values
          if (startTimeSeconds >= 0 && 
              durationSeconds > 0 && 
              startTimeSeconds < audioBuffer.duration) {
            const actualDuration = Math.min(durationSeconds, audioBuffer.duration - startTimeSeconds)
            source.start(0, startTimeSeconds, actualDuration)
          } else {
            console.warn('Invalid audio timing, using fallback')
            source.start(0, 0, 0.1)
          }
        } catch (error) {
          console.error('Error playing key sound:', error)
        }
      },

      playMessageSound: () => {
        const { audioSettings, messageSoundBuffer, audioContext, initAudioContext } = get()
        
        if (!audioSettings.messageSoundEnabled || !messageSoundBuffer) {
          return
        }

        const ctx = audioContext || initAudioContext()

        try {
          const source = ctx.createBufferSource()
          const gainNode = ctx.createGain()
          
          source.buffer = messageSoundBuffer
          gainNode.gain.value = audioSettings.messageVolume
          
          source.connect(gainNode)
          gainNode.connect(ctx.destination)
          
          source.start()
        } catch (error) {
          console.error('Error playing message sound:', error)
        }
      },

      removeSoundPack: (packId: string) => {
        set((state) => {
          const pack = state.soundPacks[packId]
          if (pack?.audioUrl) {
            URL.revokeObjectURL(pack.audioUrl)
          }
          
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
        audioSettings: state.audioSettings,
        soundPacks: Object.fromEntries(
          Object.entries(state.soundPacks).map(([id, pack]) => [
            id, 
            { 
              config: pack.config, 
              audioUrl: pack.audioUrl 
            }
          ])
        ),
        messageSoundUrl: state.messageSoundUrl
      })
    }
  )
)

export { useAudioStore }