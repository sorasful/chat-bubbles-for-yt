import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCcw } from 'lucide-react'

import { useSettingsStore } from '../../store/use-settings-store'
import { ColorPicker } from './components/color-picker'
import { NumberInput } from './components/number-input'
import { SettingGroup } from './components/setting-group'

const Settings = () => {
  const { settings, isSettingsOpen, updateSetting, resetSettings, toggleSettings } = useSettingsStore()

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSettings}
          />
          
          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 z-50 h-full w-80 bg-white shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-semibold text-gray-800">Paramètres</h2>
                <div className="flex gap-2">
                  <button
                    onClick={resetSettings}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    title="Réinitialiser"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <button
                    onClick={toggleSettings}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-6">
                  {/* Couleurs */}
                  <SettingGroup title="Couleurs">
                    <ColorPicker
                      label="Couleur des bulles"
                      value={settings.bubbleColor}
                      onChange={(value) => updateSetting('bubbleColor', value)}
                    />
                    <ColorPicker
                      label="Couleur de fond"
                      value={settings.backgroundColor}
                      onChange={(value) => updateSetting('backgroundColor', value)}
                    />
                    <ColorPicker
                      label="Couleur du texte"
                      value={settings.textColor}
                      onChange={(value) => updateSetting('textColor', value)}
                    />
                  </SettingGroup>

                  {/* Apparence */}
                  <SettingGroup title="Apparence">
                    <NumberInput
                      label="Rayon des bulles"
                      value={settings.bubbleRadius}
                      onChange={(value) => updateSetting('bubbleRadius', value)}
                      min={8}
                      max={50}
                      unit="px"
                    />
                    <NumberInput
                      label="Taille du texte"
                      value={settings.fontSize}
                      onChange={(value) => updateSetting('fontSize', value)}
                      min={12}
                      max={24}
                      unit="px"
                    />
                    <NumberInput
                      label="Largeur max des bulles"
                      value={settings.maxBubbleWidth}
                      onChange={(value) => updateSetting('maxBubbleWidth', value)}
                      min={200}
                      max={600}
                      unit="px"
                    />
                    <NumberInput
                      label="Espacement entre bulles"
                      value={settings.chatGap}
                      onChange={(value) => updateSetting('chatGap', value)}
                      min={4}
                      max={20}
                      unit="px"
                    />
                  </SettingGroup>

                  {/* Animations */}
                  <SettingGroup title="Animations">
                    <NumberInput
                      label="Durée d'animation"
                      value={settings.animationDuration}
                      onChange={(value) => updateSetting('animationDuration', value)}
                      min={0.1}
                      max={2}
                      step={0.1}
                      unit="s"
                    />
                  </SettingGroup>

                  {/* Timing */}
                  <SettingGroup title="Timing">
                    <NumberInput
                      label="Timer court"
                      value={settings.timerShort}
                      onChange={(value) => updateSetting('timerShort', value)}
                      min={100}
                      max={2000}
                      step={100}
                      unit="ms"
                    />
                    <NumberInput
                      label="Timer long"
                      value={settings.timerLong}
                      onChange={(value) => updateSetting('timerLong', value)}
                      min={1000}
                      max={10000}
                      step={500}
                      unit="ms"
                    />
                  </SettingGroup>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export { Settings }