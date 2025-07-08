export interface MechVibesConfig {
  id: string
  name: string
  key_define_type: string
  includes_numpad: boolean
  sound: string
  defines: Record<string, [number, number]>
}

export interface AudioSettings {
  keyboardSoundEnabled: boolean
  messageSoundEnabled: boolean
  keyboardVolume: number
  messageVolume: number
  currentSoundPack?: string
}

export const defaultAudioSettings: AudioSettings = {
  keyboardSoundEnabled: true,
  messageSoundEnabled: true,
  keyboardVolume: 0.5,
  messageVolume: 0.7,
  currentSoundPack: undefined
}