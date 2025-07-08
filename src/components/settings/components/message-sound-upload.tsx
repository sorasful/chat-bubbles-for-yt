import { useState } from 'react'
import { Volume2, X } from 'lucide-react'

import { useSoundPack } from '../../../hooks/use-sound-pack'
import { FileUpload } from './file-upload'

const MessageSoundUpload = () => {
  const { messageSounds, loadMessageSound, playMessageSound } = useSoundPack()
  const [isLoading, setIsLoading] = useState(false)

  const handleMessageSoundUpload = async (file: File) => {
    setIsLoading(true)
    try {
      await loadMessageSound(file)
      alert(`Son "${file.name}" chargé avec succès !`)
    } catch (error) {
      console.error('Error uploading message sound:', error)
      alert('Erreur lors du chargement du son.')
    } finally {
      setIsLoading(false)
    }
  }

  const testSound = (soundName: string) => {
    playMessageSound(soundName, 0.7)
  }

  const soundNames = Object.keys(messageSounds)

  return (
    <div className="space-y-4">
      {/* Current sounds */}
      {soundNames.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">Sons chargés :</div>
          {soundNames.map((soundName) => (
            <div key={soundName} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="flex items-center gap-2">
                <Volume2 size={16} className="text-green-600" />
                <span className="text-sm text-gray-700 truncate max-w-[150px]">
                  {soundName}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => testSound(soundName)}
                  className="text-xs text-green-600 hover:text-green-800 px-2 py-1 rounded"
                >
                  Tester
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File upload */}
      <FileUpload
        label="Ajouter un son d'envoi"
        accept=".mp3,.wav,.ogg"
        onFileSelect={handleMessageSoundUpload}
        icon={<Volume2 size={16} />}
      />

      {isLoading && (
        <div className="text-sm text-gray-500 text-center">
          Chargement du son...
        </div>
      )}
    </div>
  )
}

export { MessageSoundUpload }