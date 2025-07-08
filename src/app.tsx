import { Chat } from './components/chat'
import { DraftBubble } from './components/chat/components/draft-bubble'
import { FactoryBubbles } from './components/chat/components/factory-bubbles'
import { Settings } from './components/settings'
import { SettingsButton } from './components/settings-button'
import { useChat } from './hooks/use-chat'
import { useKeyboardSound } from './hooks/use-keyboard-sound'
import { useSettingsStore } from './store/use-settings-store'
import { useAudioStore } from './store/use-audio-store'
import { useEffect } from 'react'

const App = () => {
	const { chatHistory, showDraftBubble, onDraftBubbleChange } = useChat()
	const { settings } = useSettingsStore()
	const { reloadAudioBuffers } = useAudioStore()
	
	// Initialize keyboard sound system
	useKeyboardSound()
	
	// Reload audio buffers on app start
	useEffect(() => {
		reloadAudioBuffers()
	}, [reloadAudioBuffers])

	return (
		<main 
			className="flex h-screen w-screen items-end transition-colors duration-300"
			style={{ backgroundColor: settings.backgroundColor }}
		>
			<SettingsButton />
			<Settings />
			
			<Chat>
				<FactoryBubbles bubbles={chatHistory} />

				<DraftBubble
					isVisible={showDraftBubble}
					onValueChange={onDraftBubbleChange}
				/>
			</Chat>
		</main>
	)
}

export { App }
