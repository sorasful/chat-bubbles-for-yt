import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion'
import { FormEvent, useCallback, useEffect, useRef } from 'react'

import { slideRightAnimation } from '../../../animations/bubble'
import { useSettingsStore } from '../../../store/use-settings-store'

type DraftBubbleProps = HTMLMotionProps<'div'> & {
	isVisible?: boolean
	onValueChange: (value: string) => void
}

const DraftBubble = ({
	isVisible = false,
	onValueChange,
	...props
}: DraftBubbleProps) => {
	const { settings } = useSettingsStore()

	const refEditable = useRef<HTMLDivElement>(null)

	const handleDraftBubbleChange = (event: FormEvent<HTMLDivElement>) => {
		onValueChange(event.currentTarget.innerText)
	}

	const handleFocus = useCallback(() => {
		const { current: currentRefEditable } = refEditable

		if (currentRefEditable && isVisible) {
			currentRefEditable.focus()
		}
	}, [refEditable, isVisible])

	useEffect(handleFocus, [handleFocus])

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					className="w-fit py-2 pl-3 pr-4"
					style={{
						backgroundColor: settings.bubbleColor,
						borderRadius: `${settings.bubbleRadius}px`,
						maxWidth: `${settings.maxBubbleWidth}px`
					}}
					{...slideRightAnimation}
					{...props}
				>
					<div
						contentEditable
						className="overflow-y-hidden break-words outline-none"
						style={{ 
							fontSize: `${settings.fontSize}px`,
							color: settings.textColor
						}}
						ref={refEditable}
						onInput={handleDraftBubbleChange}
						onBlur={handleFocus}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export { DraftBubble }
