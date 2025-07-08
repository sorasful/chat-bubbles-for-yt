import { useState, useCallback, useRef, useEffect } from 'react'

import { MechVibesConfig } from '../types/audio'

interface SoundPack extends MechVibesConfig {
  audioBuffer?: AudioBuffer
}

interface KeyMapping {
  [key: string]: string
}

export const useSoundPack = () => {
  const [soundPacks, setSoundPacks] = useState<SoundPack[]>([])
  const [currentSoundPack, setCurrentSoundPack] = useState<SoundPack | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [messageSounds, setMessageSounds] = useState<Record<string, AudioBuffer>>({})
  const audioContextRef = useRef<AudioContext | null>(null)

  // 🎹 Mapping des codes de touches JavaScript vers les IDs MechVibes
  const keyMapping: KeyMapping = {
    // Chiffres
    'Digit1': '2', 'Digit2': '3', 'Digit3': '4', 'Digit4': '5', 'Digit5': '6',
    'Digit6': '7', 'Digit7': '8', 'Digit8': '9', 'Digit9': '10', 'Digit0': '11',
    'Minus': '12', 'Equal': '13', 'Backspace': '14',
    
    // Première ligne de lettres
    'Tab': '15',
    'KeyQ': '16', 'KeyW': '17', 'KeyE': '18', 'KeyR': '19', 'KeyT': '20',
    'KeyY': '21', 'KeyU': '22', 'KeyI': '23', 'KeyO': '24', 'KeyP': '25',
    'BracketLeft': '26', 'BracketRight': '27', 'Enter': '28',
    
    // Deuxième ligne de lettres
    'CapsLock': '58',
    'KeyA': '30', 'KeyS': '31', 'KeyD': '32', 'KeyF': '33', 'KeyG': '34',
    'KeyH': '35', 'KeyJ': '36', 'KeyK': '37', 'KeyL': '38',
    'Semicolon': '39', 'Quote': '40',
    
    // Troisième ligne de lettres
    'ShiftLeft': '42',
    'KeyZ': '44', 'KeyX': '45', 'KeyC': '46', 'KeyV': '47', 'KeyB': '48',
    'KeyN': '49', 'KeyM': '50', 'Comma': '51', 'Period': '52', 'Slash': '53',
    'ShiftRight': '54',
    
    // Barre d'espace et modificateurs
    'ControlLeft': '29', 'AltLeft': '56', 'Space': '57',
    'AltRight': '3640', 'ControlRight': '3613',
    
    // Touches de fonction
    'Escape': '1',
    'F1': '59', 'F2': '60', 'F3': '61', 'F4': '62', 'F5': '63', 'F6': '64',
    'F7': '65', 'F8': '66', 'F9': '67', 'F10': '68', 'F11': '87', 'F12': '88',
    
    // Flèches
    'ArrowUp': '3639', 'ArrowDown': '3665', 'ArrowLeft': '3663', 'ArrowRight': '3677',
    
    // Autres touches
    'Insert': '3666', 'Delete': '3675', 'Home': '3655', 'End': '3657',
    'PageUp': '3653', 'PageDown': '3667'
  }

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }

  // 📁 Charger le sound pack par défaut au démarrage
  useEffect(() => {
    loadDefaultSoundPack()
  }, [])

  const loadDefaultSoundPack = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Charger config.json et sound.ogg depuis /public/mechvibes
      const configResponse = await fetch('/mechvibes/config.json')
      const config: MechVibesConfig = await configResponse.json()
      
      const soundResponse = await fetch('/mechvibes/sound.ogg')
      const arrayBuffer = await soundResponse.arrayBuffer()
      
      const audioContext = getAudioContext()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      
      const defaultSoundPack: SoundPack = {
        ...config,
        audioBuffer
      }
      
      console.log('Default sound pack loaded:', defaultSoundPack.name)
      console.log('Available keys:', Object.keys(defaultSoundPack.defines).length)
      
      setSoundPacks([defaultSoundPack])
      setCurrentSoundPack(defaultSoundPack)
      
    } catch (error) {
      console.warn('Failed to load default sound pack:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 📂 Charger un nouveau sound pack depuis des fichiers
  const loadSoundPack = useCallback(async (configFile: File, soundFile: File) => {
    setIsLoading(true)
    
    try {
      // Parser le config
      const configText = await configFile.text()
      const config: MechVibesConfig = JSON.parse(configText)
      
      // Charger l'audio
      const audioContext = getAudioContext()
      const arrayBuffer = await soundFile.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      
      const soundPack: SoundPack = {
        ...config,
        audioBuffer
      }
      
      console.log('Sound pack loaded:', soundPack.name)
      console.log('Available keys:', Object.keys(soundPack.defines).length)
      
      setSoundPacks(prev => {
        const existing = prev.find(pack => pack.id === soundPack.id)
        if (existing) {
          return prev.map(pack => pack.id === soundPack.id ? soundPack : pack)
        }
        return [...prev, soundPack]
      })
      
      setCurrentSoundPack(soundPack)
      
    } catch (error) {
      console.error('Failed to load sound pack:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 🎵 Jouer le son d'une touche spécifique
  const playKeystrokeSound = useCallback((keyCode: string, volume: number = 0.7) => {
    if (!currentSoundPack?.audioBuffer) {
      console.log('No current sound pack or audio buffer')
      return
    }
    
    try {
      const audioContext = getAudioContext()
      
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          // Retry after resume
          setTimeout(() => playKeystrokeSound(keyCode, volume), 100)
        })
        return
      }
      
      // Obtenir l'ID de la touche pour le code
      const keyId = keyMapping[keyCode]
      
      if (!keyId || !currentSoundPack.defines[keyId]) {
        console.log(`No key mapping found for: ${keyCode} -> ${keyId}`)
        
        // Fallback vers une touche aléatoire si pas trouvée
        const availableKeys = Object.keys(currentSoundPack.defines).filter(key => !key.includes('-up'))
        if (availableKeys.length === 0) return
        
        const randomKey = availableKeys[Math.floor(Math.random() * availableKeys.length)]
        const [startTime, duration] = currentSoundPack.defines[randomKey]
        console.log(`Using fallback key: ${randomKey}`)
        playAudioSlice(audioContext, currentSoundPack.audioBuffer, startTime, duration, volume)
        return
      }
      
      const [startTime, duration] = currentSoundPack.defines[keyId]
      console.log(`Playing key ${keyCode} -> ${keyId}: start=${startTime}ms, duration=${duration}ms`)
      playAudioSlice(audioContext, currentSoundPack.audioBuffer, startTime, duration, volume)
      
    } catch (error) {
      console.warn('Failed to play keystroke sound:', error)
    }
  }, [currentSoundPack, keyMapping])

  // 🎶 Jouer une portion spécifique du fichier audio
  const playAudioSlice = (
    audioContext: AudioContext,
    audioBuffer: AudioBuffer,
    startTimeMs: number,
    durationMs: number,
    volume: number = 0.7
  ) => {
    const source = audioContext.createBufferSource()
    const gainNode = audioContext.createGain()
    
    source.buffer = audioBuffer
    source.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Convertir millisecondes en secondes
    const startTime = startTimeMs / 1000
    const duration = durationMs / 1000
    
    // Volume
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
    
    // Validation des valeurs
    if (startTime >= 0 && duration > 0 && startTime < audioBuffer.duration) {
      const actualDuration = Math.min(duration, audioBuffer.duration - startTime)
      source.start(0, startTime, actualDuration)
    } else {
      console.warn('Invalid audio timing, using fallback')
      source.start(0, 0, 0.1)
    }
  }

  // 🎵 Charger et jouer un son de message
  const loadMessageSound = useCallback(async (file: File) => {
    try {
      const audioContext = getAudioContext()
      const arrayBuffer = await file.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      
      setMessageSounds(prev => ({
        ...prev,
        [file.name]: audioBuffer
      }))
      
      return audioBuffer
    } catch (error) {
      console.error('Failed to load message sound:', error)
      throw error
    }
  }, [])

  const playMessageSound = useCallback((soundName?: string, volume: number = 0.7) => {
    try {
      const audioContext = getAudioContext()
      
      // Utiliser le premier son disponible si pas de nom spécifié
      const soundNames = Object.keys(messageSounds)
      const targetSound = soundName || soundNames[0]
      
      if (!targetSound || !messageSounds[targetSound]) {
        console.log('No message sound available')
        return
      }
      
      const source = audioContext.createBufferSource()
      const gainNode = audioContext.createGain()
      
      source.buffer = messageSounds[targetSound]
      gainNode.gain.value = volume
      
      source.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      source.start()
    } catch (error) {
      console.error('Error playing message sound:', error)
    }
  }, [messageSounds])

  return {
    soundPacks,
    currentSoundPack,
    isLoading,
    messageSounds,
    loadSoundPack,
    setCurrentSoundPack,
    playKeystrokeSound,
    loadMessageSound,
    playMessageSound
  }
}