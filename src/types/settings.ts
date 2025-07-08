export interface SettingsType {
  bubbleColor: string
  backgroundColor: string
  textColor: string
  animationDuration: number
  bubbleRadius: number
  fontSize: number
  maxBubbleWidth: number
  chatGap: number
  timerShort: number
  timerLong: number
}

export const defaultSettings: SettingsType = {
  bubbleColor: '#ffffff',
  backgroundColor: '#00e600',
  textColor: '#000000',
  animationDuration: 0.3,
  bubbleRadius: 24,
  fontSize: 16,
  maxBubbleWidth: 384,
  chatGap: 8,
  timerShort: 300,
  timerLong: 1500
}