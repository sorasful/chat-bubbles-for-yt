interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
}

const ColorPicker = ({ label, value, onChange }: ColorPickerProps) => {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-gray-600">{label}</label>
      <div className="flex items-center gap-2">
        <div
          className="h-6 w-6 rounded border border-gray-300"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-12 cursor-pointer rounded border border-gray-300"
        />
      </div>
    </div>
  )
}

export { ColorPicker }