import { Settings as SettingsIcon } from 'lucide-react'

import { useSettingsStore } from '../../store/use-settings-store'

const SettingsButton = () => {
  const { toggleSettings } = useSettingsStore()

  return (
    <button
      onClick={toggleSettings}
      className="fixed right-4 top-4 z-30 rounded-full bg-white p-3 shadow-lg hover:shadow-xl transition-shadow"
      title="Paramètres"
    >
      <SettingsIcon size={20} className="text-gray-700" />
    </button>
  )
}

export { SettingsButton }