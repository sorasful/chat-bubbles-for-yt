import { useEffect } from 'react'

import { useAudioStore } from '../store/use-audio-store'
import { useSoundPack } from './use-sound-pack'

const useKeyboardSound = () => {
  const { audioSettings } = useAudioStore()
  const { playKeystrokeSound } = useSoundPack()

  useEffect(() => {
    // Initialize audio context on first user interaction
    const initAudio = () => {
      document.removeEventListener('click', initAudio)
      document.removeEventListener('keydown', initAudio)
    }

    document.addEventListener('click', initAudio)
    document.addEventListener('keydown', initAudio)

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ne pas jouer de son si les sons de clavier sont désactivés
      if (!audioSettings.keyboardSoundEnabled) {
        return
      }
      
      console.log(`Key pressed: ${event.code}`)
      playKeystrokeSound(event.code, audioSettings.keyboardVolume)
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      // Ne pas jouer de son si les sons de clavier sont désactivés
      if (!audioSettings.keyboardSoundEnabled) {
        return
      }
      
      // Play key up sound if available (avec suffix -up)
      console.log(`Key released: ${event.code}`)
      // Note: Le système gère déjà les sons -up dans le hook useSoundPack
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('click', initAudio)
      document.removeEventListener('keydown', initAudio)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [playKeystrokeSound, audioSettings.keyboardSoundEnabled, audioSettings.keyboardVolume])
}

export { useKeyboardSound }