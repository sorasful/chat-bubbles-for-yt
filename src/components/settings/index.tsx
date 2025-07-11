import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCcw, Volume2 } from 'lucide-react'

import { useAudioStore } from '../../store/use-audio-store'
import { useSettingsStore } from '../../store/use-settings-store'
import { ColorPicker } from './components/color-picker'
import { MessageSoundUpload } from './components/message-sound-upload'
import { NumberInput } from './components/number-input'
import { SelectInput } from './components/select-input'
import { SettingGroup } from './components/setting-group'
import { SoundPackUpload } from './components/sound-pack-upload'
import { ToggleSwitch } from './components/toggle-switch'

const Settings = () => {
  const { settings, isSettingsOpen, updateSetting, resetSettings, toggleSettings } = useSettingsStore()
  const { audioSettings, updateAudioSetting } = useAudioStore()

  const fontFamilyOptions = [
    { value: 'system-ui', label: 'Système' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Monaco', label: 'Monaco' },
    { value: 'Comic Sans MS', label: 'Comic Sans MS' },
    { value: 'Impact', label: 'Impact' },
    { value: 'Trebuchet MS', label: 'Trebuchet MS' },
    { value: 'Tahoma', label: 'Tahoma' }
  ]

  const fontWeightOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'bold', label: 'Gras' }
  ]

  const fontStyleOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'italic', label: 'Italique' }
  ]
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
                    <SelectInput
                      label="Police"
                      value={settings.fontFamily}
                      onChange={(value) => updateSetting('fontFamily', value)}
                      options={fontFamilyOptions}
                    />
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
                    <SelectInput
                      label="Épaisseur"
                      value={settings.fontWeight}
                      onChange={(value) => updateSetting('fontWeight', value as 'normal' | 'bold')}
                      options={fontWeightOptions}
                    />
                    <SelectInput
                      label="Style"
                      value={settings.fontStyle}
                      onChange={(value) => updateSetting('fontStyle', value as 'normal' | 'italic')}
                      options={fontStyleOptions}
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

                  {/* Audio */}
                  <SettingGroup title="Audio">
                    <ToggleSwitch
                      label="Sons de clavier"
                      checked={audioSettings.keyboardSoundEnabled}
                      onChange={(checked) => updateAudioSetting('keyboardSoundEnabled', checked)}
                      description="Jouer un son à chaque frappe"
                    />
                    
                    {audioSettings.keyboardSoundEnabled && (
                      <>
                        {audioSettings.currentSoundPack && (
                          <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                            Pack actuel: {soundPacks[audioSettings.currentSoundPack]?.config.name || 'Inconnu'}
                          </div>
                        )}
                        <NumberInput
                          label="Volume clavier"
                          value={audioSettings.keyboardVolume}
                          onChange={(value) => updateAudioSetting('keyboardVolume', value)}
                          min={0}
                          max={1}
                          step={0.1}
                        />
                      </>
                    )}

                  </SettingGroup>

                  {/* Sons de message */}
                  <SettingGroup title="Sons de message">
                    <ToggleSwitch
                      label="Son d'envoi de message"
                      checked={audioSettings.messageSoundEnabled}
                      onChange={(checked) => updateAudioSetting('messageSoundEnabled', checked)}
                      description="Jouer un son lors de l'envoi d'un message"
                    />
                    
                    {audioSettings.messageSoundEnabled && (
                      <>
                        <NumberInput
                          label="Volume message"
                          value={audioSettings.messageVolume}
                          onChange={(value) => updateAudioSetting('messageVolume', value)}
                          min={0}
                          max={1}
                          step={0.1}
                        />
                        
                        <MessageSoundUpload />
                      </>
                    )}
                  </SettingGroup>

                  {/* Pack de sons MechVibes */}
                  <SettingGroup title="Pack de sons clavier">
                    <SoundPackUpload />
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