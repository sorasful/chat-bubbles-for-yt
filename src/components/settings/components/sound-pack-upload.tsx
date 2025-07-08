import { useState } from 'react'
import { Keyboard } from 'lucide-react'

import { useSoundPack } from '../../../hooks/use-sound-pack'
import { FileUpload } from './file-upload'

const SoundPackUpload = () => {
  const { currentSoundPack, loadSoundPack, isLoading } = useSoundPack()
  const [configFile, setConfigFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)

  const handleConfigUpload = async (file: File) => {
    setConfigFile(file)
  }

  const handleAudioUpload = async (file: File) => {
    setAudioFile(file)
  }

  const handleUploadComplete = async () => {
    if (!configFile || !audioFile) return

    try {
      await loadSoundPack(configFile, audioFile)
      
      // Reset files after successful upload
      setConfigFile(null)
      setAudioFile(null)
      
      alert(`Pack de sons chargé avec succès !`)
    } catch (error) {
      console.error('Error uploading sound pack:', error)
      alert('Erreur lors du chargement du pack de sons. Vérifiez que les fichiers sont valides.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Uploadez un pack de sons MechVibes (.json + .ogg)
      </div>

      {/* Current sound pack */}
      {currentSoundPack && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Keyboard size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">
                {currentSoundPack.name}
              </span>
            </div>
            <div className="text-xs text-green-600">
              {Object.keys(currentSoundPack.defines).length} touches
            </div>
          </div>
        </div>
      )}

      {/* File uploads */}
      <div className="space-y-3">
        <FileUpload
          label="Fichier config.json"
          accept=".json"
          onFileSelect={handleConfigUpload}
          currentFile={configFile?.name}
          onRemove={() => setConfigFile(null)}
        />

        <FileUpload
          label="Fichier audio .ogg"
          accept=".ogg,.wav,.mp3"
          onFileSelect={handleAudioUpload}
          currentFile={audioFile?.name}
          onRemove={() => setAudioFile(null)}
        />
      </div>

      {/* Upload button */}
      {configFile && audioFile && (
        <button
          onClick={handleUploadComplete}
          disabled={isLoading}
          className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Chargement...' : 'Charger le pack de sons'}
        </button>
      )}
    </div>
  )
}

export { SoundPackUpload }