'use client'

import { useCallback, useEffect } from 'react'
import { Task, TaskStatus } from '@/types/task'
import { generateTaskId } from '@/utils/task'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS, serializeTasks, deserializeTasks } from '@/utils/storage'

export function useTasks(initialTasks: Task[] = []) {
  // Remove duplicates from initial tasks
  const uniqueInitialTasks = initialTasks.filter((task, index, self) =>
    index === self.findIndex(t => t.id === task.id)
  )
  
  const [tasks, setTasks] = useLocalStorage<Task[]>(
    STORAGE_KEYS.TASKS,
    uniqueInitialTasks,
    {
      serialize: serializeTasks,
      deserialize: deserializeTasks,
    }
  )

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date()
    const newTask: Task = {
      ...taskData,
      id: generateTaskId(),
      createdAt: now,
      updatedAt: now
    }
    setTasks(prev => {
      // Check for duplicate IDs to prevent issues
      const exists = prev.some(t => t.id === newTask.id)
      if (exists) {
        console.warn('Duplicate task ID detected, regenerating...')
        newTask.id = generateTaskId()
      }
      return [...prev, newTask]
    })
    return newTask
  }, [])

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }, [])

  const moveTask = useCallback((id: string, newStatus: TaskStatus) => {
    updateTask(id, { status: newStatus })
  }, [updateTask])

  const getTasksByStatus = useCallback((status: TaskStatus) => {
    return tasks.filter(task => task.status === status)
  }, [tasks])

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByStatus
  }
}