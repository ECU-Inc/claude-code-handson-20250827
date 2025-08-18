'use client'

import { Task } from '@/types/task'
import { TaskCard } from './TaskCard'

interface TaskColumnProps {
  title: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  tasks?: Task[]
  onEditTask?: (task: Task) => void
  onDeleteTask?: (taskId: string) => void
}

export function TaskColumn({ 
  title, 
  status, 
  tasks = [],
  onEditTask,
  onDeleteTask
}: TaskColumnProps) {
  const getColumnStyles = () => {
    switch (status) {
      case 'todo':
        return 'border-blue-200 bg-blue-50'
      case 'in-progress':
        return 'border-yellow-200 bg-yellow-50'
      case 'review':
        return 'border-purple-200 bg-purple-50'
      case 'done':
        return 'border-green-200 bg-green-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div
      className={`flex flex-col rounded-lg border-2 ${getColumnStyles()} p-4`}
      data-status={status}
      role="region"
      aria-label={`${title} column`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          {title}
        </h2>
        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 space-y-3 min-h-[400px]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  )
}