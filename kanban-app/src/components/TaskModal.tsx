'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Task, TaskStatus } from '@/types/task'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  initialValues?: Partial<Task>
  mode: 'create' | 'edit'
}

interface TaskFormData {
  title: string
  description: string
  dueDate: string
  assignee: string
  status: TaskStatus
}

const initialFormData: TaskFormData = {
  title: '',
  description: '',
  dueDate: '',
  assignee: '',
  status: 'todo'
}

export function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  mode
}: TaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<TaskFormData>>({})
  const modalRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      if (initialValues) {
        setFormData({
          title: initialValues.title || '',
          description: initialValues.description || '',
          dueDate: initialValues.dueDate 
            ? new Date(initialValues.dueDate).toISOString().split('T')[0] 
            : '',
          assignee: initialValues.assignee || '',
          status: initialValues.status || 'todo'
        })
      } else {
        setFormData(initialFormData)
      }
      setErrors({})
      
      setTimeout(() => {
        firstInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, initialValues])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const validate = (): boolean => {
    const newErrors: Partial<TaskFormData> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です'
    } else if (formData.title.length > 100) {
      newErrors.title = 'タイトルは100文字以内で入力してください'
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = '説明は500文字以内で入力してください'
    }
    
    if (formData.assignee && formData.assignee.length > 50) {
      newErrors.assignee = '担当者名は50文字以内で入力してください'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      assignee: formData.assignee.trim() || undefined,
      status: formData.status
    }
    
    onSubmit(taskData)
    setFormData(initialFormData)
    onClose()
  }

  const handleCancel = () => {
    setFormData(initialFormData)
    setErrors({})
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <h2 id="modal-title" className="text-xl font-bold mb-4">
            {mode === 'create' ? '新規タスク作成' : 'タスク編集'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                タイトル *
              </label>
              <input
                ref={firstInputRef}
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              {errors.title && (
                <p id="title-error" className="mt-1 text-sm text-red-600">
                  {errors.title}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                説明
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? 'description-error' : undefined}
              />
              {errors.description && (
                <p id="description-error" className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                期限
              </label>
              <input
                type="date"
                id="dueDate"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
                担当者
              </label>
              <input
                type="text"
                id="assignee"
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.assignee ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors.assignee}
                aria-describedby={errors.assignee ? 'assignee-error' : undefined}
              />
              {errors.assignee && (
                <p id="assignee-error" className="mt-1 text-sm text-red-600">
                  {errors.assignee}
                </p>
              )}
            </div>
            
            {mode === 'edit' && (
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  ステータス
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todo">TODO</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
            )}
            
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                {mode === 'create' ? '作成' : '更新'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}