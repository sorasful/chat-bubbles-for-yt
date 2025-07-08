import { ReactNode } from 'react'

interface SettingGroupProps {
  title: string
  children: ReactNode
}

const SettingGroup = ({ title, children }: SettingGroupProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}

export { SettingGroup }