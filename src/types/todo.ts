export interface Task {
  id: string
  title: string
  description: string
  estimatedTime: number // in minutes
  createdAt: string
  color?: string
  scheduledFor: string | null // ISO date string for when the task is scheduled
  estimatedCompletionTime: number | null // in minutes
  priority: string // "low", "medium", "high"
  tags: string[] // array of tag strings
}

export interface Column {
  id: string
  title: string
  tasks: Task[]
}

