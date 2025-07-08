import { useEffect } from 'react'

import { useAudioStore } from '../store/use-audio-store'
import { getMechVibesKeyCode } from '../utils/keyboard-mapping'

const useKeyboardSound = () => {
  const { playKeySound, initAudioContext, audioSettings } = useAudioStore()

  useEffect(() => {
    // Initialize audio context on first user interaction
    const initAudio = () => {
      initAudioContext()
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
      
      const mechVibesCode = getMechVibesKeyCode(event.code)
      if (mechVibesCode) {
        console.log(`Key pressed: ${event.code} -> MechVibes: ${mechVibesCode}`)
        playKeySound(mechVibesCode)
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      // Ne pas jouer de son si les sons de clavier sont désactivés
      if (!audioSettings.keyboardSoundEnabled) {
        return
      }
      
      const mechVibesCode = getMechVibesKeyCode(event.code)
      if (mechVibesCode) {
        // Play key up sound if available
        console.log(`Key released: ${event.code} -> MechVibes: ${mechVibesCode}-up`)
        playKeySound(`${mechVibesCode}-up`)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('click', initAudio)
      document.removeEventListener('keydown', initAudio)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [playKeySound, initAudioContext, audioSettings.keyboardSoundEnabled])
}

export { useKeyboardSound }