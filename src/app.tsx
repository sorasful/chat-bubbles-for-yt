import { Chat } from './components/chat'
import { DraftBubble } from './components/chat/components/draft-bubble'
import { FactoryBubbles } from './components/chat/components/factory-bubbles'
import { Settings } from './components/settings'
import { SettingsButton } from './components/settings-button'
import { useChat } from './hooks/use-chat'
import { useKeyboardSound } from './hooks/use-keyboard-sound'
import { useSettingsStore } from './store/use-settings-store'

const App = () => {
	const { chatHistory, showDraftBubble, onDraftBubbleChange } = useChat()
	const { settings } = useSettingsStore()
	
	// Initialize keyboard sound system
	useKeyboardSound()

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
