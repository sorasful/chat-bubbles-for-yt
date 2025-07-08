import { useEffect } from 'react'

import { useAudioStore } from '../store/use-audio-store'
import { getMechVibesKeyCode } from '../utils/keyboard-mapping'

const useKeyboardSound = () => {
  const { playKeySound, initAudioContext } = useAudioStore()

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
      const mechVibesCode = getMechVibesKeyCode(event.code)
      if (mechVibesCode) {
        playKeySound(mechVibesCode)
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const mechVibesCode = getMechVibesKeyCode(event.code)
      if (mechVibesCode) {
        // Play key up sound if available
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
  }, [playKeySound, initAudioContext])
}

export { useKeyboardSound }