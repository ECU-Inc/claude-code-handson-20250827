'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Task, TaskStatus } from '@/types/task'
import { DraggableTaskCard } from './DraggableTaskCard'
import { cn } from '@/utils/cn'

interface DroppableColumnProps {
  id: string
  title: string
  status: TaskStatus
  tasks: Task[]
  onEditTask?: (task: Task) => void
  onDeleteTask?: (taskId: string) => void
}

export function DroppableColumn({
  id,
  title,
  status,
  tasks,
  onEditTask,
  onDeleteTask
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: { status }
  })

  const getColumnStyles = () => {
    const baseStyles = {
      'todo': 'bg-gradient-to-b from-blue-50 to-white border-blue-200',
      'in-progress': 'bg-gradient-to-b from-yellow-50 to-white border-yellow-200',
      'review': 'bg-gradient-to-b from-purple-50 to-white border-purple-200',
      'done': 'bg-gradient-to-b from-green-50 to-white border-green-200',
    }
    return baseStyles[status] || 'bg-gradient-to-b from-gray-50 to-white border-gray-200'
  }

  const getHeaderIcon = () => {
    const icons = {
      'todo': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      'in-progress': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      'review': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      'done': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    }
    return icons[status] || null
  }

  const taskIds = tasks.map(task => task.id)

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col rounded-xl border-2 transition-all duration-200',
        getColumnStyles(),
        isOver && 'ring-2 ring-blue-400 ring-opacity-50 border-blue-300 scale-[1.02]'
      )}
      data-status={status}
      role="region"
      aria-label={`${title} column`}
    >
      <div className="px-4 py-3 border-b border-gray-200/50 bg-white/50 backdrop-blur-sm rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              'text-gray-600',
              status === 'todo' && 'text-blue-600',
              status === 'in-progress' && 'text-yellow-600',
              status === 'review' && 'text-purple-600',
              status === 'done' && 'text-green-600'
            )}>
              {getHeaderIcon()}
            </div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              {title}
            </h2>
          </div>
          <span className={cn(
            'text-xs font-medium px-2 py-1 rounded-full',
            'bg-white/80 text-gray-600 border border-gray-200'
          )}>
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div className="flex-1 p-3 space-y-3 min-h-[400px] overflow-y-auto">
        <SortableContext 
          items={taskIds}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className={cn(
            'flex flex-col items-center justify-center h-32 rounded-lg border-2 border-dashed',
            'transition-all duration-200',
            isOver ? 'border-blue-400 bg-blue-50/50' : 'border-gray-300',
          )}>
            {isOver ? (
              <div className="text-center animate-pulse">
                <svg className="w-8 h-8 mx-auto text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm font-medium text-blue-600">ここにドロップ</span>
              </div>
            ) : (
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <span className="text-xs text-gray-500">タスクがありません</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}