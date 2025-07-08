import { AnimationProps } from 'framer-motion'

import { useSettingsStore } from '../../store/use-settings-store'

const slideRightAnimation: AnimationProps = {
  initial: {
    opacity: 0,
    x: -20,
    borderRadius: `${useSettingsStore.getState().settings.bubbleRadius}px`
  },
  animate: {
    opacity: 1,
    x: 0,
    borderRadius: `${useSettingsStore.getState().settings.bubbleRadius}px`,
    transition: { 
      duration: useSettingsStore.getState().settings.animationDuration 
    }
  }
}

const slideUpAnimation: AnimationProps = {
  initial: {
    opacity: 0,
    borderRadius: `${useSettingsStore.getState().settings.bubbleRadius}px`
  },
  animate: {
    opacity: 1,
    borderRadius: `${useSettingsStore.getState().settings.bubbleRadius}px`,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    borderRadius: `${useSettingsStore.getState().settings.bubbleRadius}px`,
    transition: { 
      duration: 0.2 
    } 
  }
}

export { slideRightAnimation, slideUpAnimation }