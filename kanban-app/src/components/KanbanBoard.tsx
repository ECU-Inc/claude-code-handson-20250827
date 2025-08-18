'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { DroppableColumn } from './DroppableColumn'
import { TaskModal } from './TaskModal'
import { TaskCard } from './TaskCard'
import { Task, TaskStatus } from '@/types/task'
import { useTasks } from '@/hooks/useTasks'

interface KanbanBoardProps {
  initialTasks?: Task[]
}

const columns = [
  { id: 'todo', title: 'TODO', status: 'todo' as TaskStatus },
  { id: 'in-progress', title: 'In Progress', status: 'in-progress' as TaskStatus },
  { id: 'review', title: 'Review', status: 'review' as TaskStatus },
  { id: 'done', title: 'Done', status: 'done' as TaskStatus },
]

export function KanbanBoard({ initialTasks = [] }: KanbanBoardProps) {
  const { tasks, addTask, updateTask, deleteTask, moveTask, getTasksByStatus } = useTasks(initialTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    
    if (!over) return
    
    const activeId = active.id as string
    const overId = over.id as string
    
    if (activeId === overId) return
    
    const activeTask = tasks.find(t => t.id === activeId)
    if (!activeTask) return
    
    // Check if over is a column
    const overColumn = columns.find(col => col.id === overId)
    if (overColumn && activeTask.status !== overColumn.status) {
      moveTask(activeId, overColumn.status)
      return
    }
    
    // Check if over is a task
    const overTask = tasks.find(t => t.id === overId)
    if (overTask && activeTask.status !== overTask.status) {
      moveTask(activeId, overTask.status)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    setActiveTask(null)
    
    if (!over) return
    
    const activeId = active.id as string
    const overId = over.id as string
    
    if (activeId === overId) return
    
    const activeTask = tasks.find(t => t.id === activeId)
    const overTask = tasks.find(t => t.id === overId)
    
    if (activeTask && overTask && activeTask.status === overTask.status) {
      // Reorder within the same column
      const columnTasks = tasks.filter(t => t.status === activeTask.status)
      const oldIndex = columnTasks.findIndex(t => t.id === activeId)
      const newIndex = columnTasks.findIndex(t => t.id === overId)
      
      if (oldIndex !== -1 && newIndex !== -1) {
        // This is a simplified reordering - in a real app, you'd want to maintain order
        const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex)
        // Update task order (you might want to add an 'order' field to tasks)
      }
    }
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleSubmitTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData)
    } else {
      addTask(taskData)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full">
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleAddTask}
            className="btn btn-primary btn-md shadow-md hover:shadow-lg flex items-center gap-2 group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">新規タスク</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => (
            <DroppableColumn
              key={column.id}
              id={column.id}
              title={column.title}
              status={column.status}
              tasks={getTasksByStatus(column.status)}
              onEditTask={handleEditTask}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>

        <DragOverlay
          dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: '0.5',
                },
              },
            }),
          }}
        >
          {activeTask ? (
            <div className="rotate-3 opacity-90">
              <TaskCard task={activeTask} isDragging />
            </div>
          ) : null}
        </DragOverlay>

        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitTask}
          initialValues={editingTask || undefined}
          mode={editingTask ? 'edit' : 'create'}
        />
      </div>
    </DndContext>
  )
}