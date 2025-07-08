interface ToggleSwitchProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
}

const ToggleSwitch = ({ label, checked, onChange, description }: ToggleSwitchProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label className="text-sm text-gray-600">{label}</label>
        {description && (
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-green-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

export { ToggleSwitch }