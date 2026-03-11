export type TagType = 'concept' | 'practice' | 'advanced' | 'tips'

export interface Step {
  id: string
  title: string
  subtitle: string
  tag: TagType
  tagLabel: string
}

export type SimId = 'create' | 'message' | 'shutdown'

export interface QuizOption {
  value: string
  label: string
}

export interface FlowStepData {
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange'
  title: string
  description: string
  isLast?: boolean
}

export interface ShortcutItem {
  key: string
  desc: string
}

export interface InfoBoxVariant {
  type: 'tip' | 'warning' | 'note'
}
