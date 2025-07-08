import { AnimationProps } from 'framer-motion'

import { useSettingsStore } from '../../store/use-settings-store'

const slideRightAnimation: AnimationProps = {
  animate: {
    opacity: [0, 1],
    x: [-20, 0],
    transition: { 
      duration: useSettingsStore.getState().settings.animationDuration 
    }
  }
}

const slideUpAnimation: AnimationProps = {
  animate: {
    y: [0, -10],
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 50,
      default: {
        duration: useSettingsStore.getState().settings.animationDuration + 0.1
      }
    }
  },
  exit: { opacity: 0, transition: { duration: 0.5 } }
}

export { slideRightAnimation, slideUpAnimation }
