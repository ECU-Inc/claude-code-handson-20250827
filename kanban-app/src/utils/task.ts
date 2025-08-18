import { Task, TaskStatus } from '@/types/task'

export function generateTaskId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

export function createNewTask(
  title: string,
  status: TaskStatus = 'todo'
): Task {
  const now = new Date()
  return {
    id: generateTaskId(),
    title,
    status,
    createdAt: now,
    updatedAt: now
  }
}

export function isOverdue(dueDate: Date | undefined): boolean {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

export function isDueSoon(dueDate: Date | undefined, daysThreshold = 3): boolean {
  if (!dueDate) return false
  const now = new Date()
  const due = new Date(dueDate)
  const diffTime = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= daysThreshold && diffDays >= 0
}