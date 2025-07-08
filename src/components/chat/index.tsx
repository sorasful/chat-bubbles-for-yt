import { ReactNode } from 'react'

import { useSettingsStore } from '../../store/use-settings-store'

type ChatProps = {
	children: ReactNode
}

const Chat = ({ children }: ChatProps) => {
	const { settings } = useSettingsStore()

	return (
		<div 
			className="flex flex-col pb-16 pl-4"
			style={{ gap: `${settings.chatGap}px` }}
		>
			{children}
		</div>
	)
}

export { Chat }
