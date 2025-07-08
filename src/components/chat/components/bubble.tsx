import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion'
import { FC } from 'react'

import { useSettingsStore } from '../../../store/use-settings-store'
import { BubbleType } from '../../../types/bubble'

type BubbleProps = HTMLMotionProps<'div'> & {
	data: Omit<BubbleType, 'id'>
}

const Bubble: FC<BubbleProps> = ({
	data: { content = '', isVisible = true },
	...props
}: BubbleProps) => {
	const { settings } = useSettingsStore()

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					className="relative w-fit py-2 pl-3 pr-4"
					style={{
						backgroundColor: settings.bubbleColor,
						borderRadius: `${settings.bubbleRadius}px`,
						maxWidth: `${settings.maxBubbleWidth}px`
					}}
					{...props}
				>
					<div 
						className="absolute bottom-0 left-0 -z-10 h-6 w-6 rounded-sm" 
						style={{ backgroundColor: settings.bubbleColor }}
					/>
					<span 
						className="break-all" 
						style={{ 
							fontSize: `${settings.fontSize}px`,
							color: settings.textColor
						}}
					>
						{content}
					</span>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export { Bubble }
