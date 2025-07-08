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
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    transition: { 
      duration: 0.2 
    } 
  }
}

export { slideRightAnimation, slideUpAnimation }