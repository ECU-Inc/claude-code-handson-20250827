export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done'

export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: Date
  assignee?: string
  status: TaskStatus
  createdAt: Date
  updatedAt: Date
}

export const TaskStatusLabels: Record<TaskStatus, string> = {
  'todo': 'TODO',
  'in-progress': 'In Progress',
  'review': 'Review',
  'done': 'Done'
}