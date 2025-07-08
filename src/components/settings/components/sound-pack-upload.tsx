import { useState } from 'react'
import { Keyboard } from 'lucide-react'

import { useAudioStore } from '../../../store/use-audio-store'
import { MechVibesConfig } from '../../../types/audio'
import { FileUpload } from './file-upload'

const SoundPackUpload = () => {
  const { soundPacks, loadSoundPack, removeSoundPack, audioSettings } = useAudioStore()
  const [configFile, setConfigFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleConfigUpload = async (file: File) => {
    setConfigFile(file)
  }

  const handleAudioUpload = async (file: File) => {
    setAudioFile(file)
  }

  const handleUploadComplete = async () => {
    if (!configFile || !audioFile) return

    setIsUploading(true)
    try {
      const configText = await configFile.text()
      const config: MechVibesConfig = JSON.parse(configText)
      await loadSoundPack(config, audioFile)
      
      // Reset files after successful upload
      setConfigFile(null)
      setAudioFile(null)
    } catch (error) {
      console.error('Error uploading sound pack:', error)
      alert('Erreur lors du chargement du pack de sons. Vérifiez que les fichiers sont valides.')
    } finally {
      setIsUploading(false)
    }
  }

  const currentSoundPack = audioSettings.currentSoundPack 
    ? soundPacks[audioSettings.currentSoundPack]?.config.name
    : undefined

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
                {currentSoundPack}
              </span>
            </div>
            <button
              onClick={() => removeSoundPack(audioSettings.currentSoundPack!)}
              className="text-xs text-green-600 hover:text-green-800"
            >
              Supprimer
            </button>
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
          disabled={isUploading}
          className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {isUploading ? 'Chargement...' : 'Charger le pack de sons'}
        </button>
      )}
    </div>
  )
}

export { SoundPackUpload }