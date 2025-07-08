import { AnimationProps } from 'framer-motion'

import { useSettingsStore } from '../../store/use-settings-store'

const slideRightAnimation: AnimationProps = {
  initial: {
    opacity: 0,
    x: -20
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: { 
      duration: useSettingsStore.getState().settings.animationDuration 
    }
  }
}

const slideUpAnimation: AnimationProps = {
  initial: {
    opacity: 0,
    y: 10
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: useSettingsStore.getState().settings.animationDuration,
      ease: "easeOut"
    }
  },
  exit: { opacity: 0, transition: { duration: 0.5 } }
}

export { slideRightAnimation, slideUpAnimation }
