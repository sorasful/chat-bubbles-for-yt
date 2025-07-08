import { v4 as uuid } from 'uuid'
import { create } from 'zustand'

import { BubbleType } from '../types/bubble'
import { useSettingsStore } from './use-settings-store'
import { useAudioStore } from './use-audio-store'

interface ChatStore {
	chatHistory: BubbleType[]
	draftBubble: string
	showDraftBubble: boolean
	isBubbleVisible: boolean
	getTimerDuration: () => number
	onSendBubble: (event: KeyboardEvent) => void
	onDraftBubbleChange: (value: string) => void
	toggleBubbleVisibility: () => void
}

const useChatStore = create<ChatStore>((set, get) => ({
	chatHistory: [] as BubbleType[],
	draftBubble: '',
	showDraftBubble: false,
	isBubbleVisible: true,
	getTimerDuration: (): number => {
		const { chatHistory } = get()
		const { settings } = useSettingsStore.getState()
		const chatHistoryLength = chatHistory.length
		return chatHistoryLength >= 3 ? settings.timerShort : settings.timerLong
	},
	onSendBubble: (event: KeyboardEvent): void => {
		const { code } = event
		const isEnterCode = code === 'Enter'
		const isShiftKey = code === 'ShiftLeft' || code === 'ShiftRight'

		// Ignorer complètement les touches Shift
		if (isShiftKey) {
			return
		}

		if (isEnterCode) {
			event.preventDefault()
		}

		set((state) => {
			const { draftBubble } = state

			// Play message sound when sending
			if (isEnterCode && draftBubble.trim() !== '') {
				// Play message sound using audio store
				useAudioStore.getState().playMessageSound()
				
				// Envoyer le message et cacher immédiatement la bulle de draft
				return {
					...state,
					chatHistory: [
						...state.chatHistory,
						{ id: uuid(), content: draftBubble, isVisible: true }
					],
					draftBubble: '',
					showDraftBubble: false
				}
			}

			// Pour toutes les autres touches, juste montrer la bulle de draft
			return {
				...state,
				showDraftBubble: true
			}
		})
	},
	onDraftBubbleChange: (value: string): void => {
		set({ draftBubble: value })
	},
	toggleBubbleVisibility: (): void => {
		set((state) => {
			const { chatHistory, isBubbleVisible } = state

			return {
				...state,
				chatHistory: isBubbleVisible
					? chatHistory.slice(1)
					: [{ ...chatHistory[0], isVisible: false }, ...chatHistory.slice(1)],
				isBubbleVisible: !isBubbleVisible
			}
		})
	}
}))

export { useChatStore }
