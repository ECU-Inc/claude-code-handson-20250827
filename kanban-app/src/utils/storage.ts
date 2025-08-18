import { Task } from '@/types/task'

export const STORAGE_KEYS = {
  TASKS: 'kanban-tasks',
  PREFERENCES: 'kanban-preferences',
} as const

export function serializeTasks(tasks: Task[]): string {
  return JSON.stringify(tasks)
}

export function deserializeTasks(data: string): Task[] {
  try {
    const parsed = JSON.parse(data)
    if (!Array.isArray(parsed)) {
      console.warn('Invalid tasks data format')
      return []
    }
    
    // Convert date strings back to Date objects
    return parsed.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    }))
  } catch (error) {
    console.error('Error deserializing tasks:', error)
    return []
  }
}

export function getStorageSize(): number {
  if (typeof window === 'undefined') return 0
  
  let totalSize = 0
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const value = localStorage.getItem(key)
      if (value) {
        totalSize += key.length + value.length
      }
    }
  }
  return totalSize
}

export function getStorageSizeInMB(): string {
  const bytes = getStorageSize()
  const mb = bytes / (1024 * 1024)
  return mb.toFixed(2)
}

export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const testKey = '__localStorage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

export function clearTaskData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.TASKS)
  }
}

export function exportTaskData(): string {
  if (typeof window === 'undefined') return ''
  
  const tasksData = localStorage.getItem(STORAGE_KEYS.TASKS)
  if (!tasksData) return ''
  
  const tasks = deserializeTasks(tasksData)
  return JSON.stringify(tasks, null, 2)
}

export function importTaskData(jsonData: string): Task[] | null {
  try {
    const parsed = JSON.parse(jsonData)
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid data format')
    }
    
    // Validate and convert to Task objects
    const tasks: Task[] = parsed.map(item => ({
      id: item.id || generateId(),
      title: item.title || 'Untitled',
      description: item.description,
      status: item.status || 'todo',
      assignee: item.assignee,
      dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    }))
    
    return tasks
  } catch (error) {
    console.error('Error importing tasks:', error)
    return null
  }
}

function generateId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}