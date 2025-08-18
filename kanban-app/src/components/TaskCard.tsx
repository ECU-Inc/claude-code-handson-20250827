'use client'

import React from 'react'
import { Task } from '@/types/task'
import { formatDate, isOverdue, isDueSoon } from '@/utils/task'
import { cn } from '@/utils/cn'

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  isDragging?: boolean
}

export const TaskCard = React.memo(function TaskCard({
  task,
  onEdit,
  onDelete,
  isDragging = false
}: TaskCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(task)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(task.id)
  }

  const getDueDateStyle = () => {
    if (!task.dueDate) return ''
    if (isOverdue(task.dueDate)) return 'text-red-600 bg-red-50'
    if (isDueSoon(task.dueDate)) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  const getPriorityIndicator = () => {
    if (isOverdue(task.dueDate)) return 'bg-red-500'
    if (isDueSoon(task.dueDate)) return 'bg-yellow-500'
    return 'bg-transparent'
  }

  return (
    <article
      className={cn(
        'group relative bg-white rounded-lg border border-gray-200 p-4',
        'shadow-sm hover:shadow-md transition-all duration-200',
        'cursor-pointer hover:border-gray-300',
        isDragging && 'opacity-50 rotate-2 scale-105 shadow-card-drag'
      )}
      role="article"
      aria-label={`Task: ${task.title}`}
      onClick={handleEdit}
    >
      {/* Priority indicator */}
      <div className={cn(
        'absolute left-0 top-0 bottom-0 w-1 rounded-l-lg transition-colors',
        getPriorityIndicator()
      )} />
      
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-gray-900 line-clamp-2 pr-2">
            {task.title}
          </h3>
          
          {onDelete && (
            <button
              onClick={handleDelete}
              className={cn(
                'opacity-0 group-hover:opacity-100 transition-opacity',
                'p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600'
              )}
              aria-label="Delete task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {task.dueDate && (
            <div className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full',
              getDueDateStyle()
            )}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{formatDate(new Date(task.dueDate))}</span>
            </div>
          )}
          
          {task.assignee && (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-600 rounded-full">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {task.assignee.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-medium">{task.assignee}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
})