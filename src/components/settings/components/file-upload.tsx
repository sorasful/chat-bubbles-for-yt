import { Upload, X, Volume2 } from 'lucide-react'
import { useRef, useState } from 'react'

interface FileUploadProps {
  label: string
  accept: string
  onFileSelect: (file: File) => Promise<void>
  currentFile?: string
  onRemove?: () => void
  icon?: React.ReactNode
}

const FileUpload = ({ 
  label, 
  accept, 
  onFileSelect, 
  currentFile, 
  onRemove,
  icon = <Upload size={16} />
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      await onFileSelect(file)
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600">{label}</label>
      
      {currentFile ? (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-green-600" />
            <span className="text-sm text-gray-700 truncate max-w-[200px]">
              {currentFile}
            </span>
          </div>
          {onRemove && (
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Supprimer"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={handleClick}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-4 text-gray-500 transition-colors hover:border-green-400 hover:text-green-600 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
          ) : (
            icon
          )}
          <span className="text-sm">
            {isLoading ? 'Chargement...' : 'Cliquer pour sélectionner'}
          </span>
        </button>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

export { FileUpload }