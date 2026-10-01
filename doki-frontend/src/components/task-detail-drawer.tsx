'use client'

import { useState } from 'react'
import { X, MessageSquare, Clock, Users } from 'lucide-react'
import type { Task } from '@/types'

interface TaskDetailDrawerProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
}

export function TaskDetailDrawer({ task, isOpen, onClose }: TaskDetailDrawerProps) {
  const [comment, setComment] = useState('')

  if (!isOpen || !task) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-screen w-96 bg-background border-l border-border shadow-lg z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 p-4 border-b border-border flex-shrink-0">
          <h2 className="font-semibold text-sm">Task Details</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-muted transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 flex flex-col gap-4">
            {/* Title */}
            <div>
              <h3 className="font-bold text-base leading-snug">{task.title}</h3>
              {task.snippet && (
                <p className="text-xs text-muted-foreground mt-1">{task.snippet}</p>
              )}
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Status */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Status
                </label>
                <button className="text-left px-2 py-1.5 text-xs rounded border border-border hover:bg-muted transition-colors truncate">
                  {task.status === 'todo'
                    ? 'To Do'
                    : task.status === 'inprogress'
                      ? 'In Progress'
                      : task.status === 'inreview'
                        ? 'In Review'
                        : 'Done'}
                </button>
              </div>

              {/* Priority */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Priority
                </label>
                <button className="text-left px-2 py-1.5 text-xs rounded border border-border hover:bg-muted transition-colors truncate">
                  {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'None'}
                </button>
              </div>

              {/* Assignee */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Users className="size-3" />
                  Assigned
                </label>
                <button className="text-left px-2 py-1.5 text-xs rounded border border-border hover:bg-muted transition-colors truncate">
                  {task.assignee ? task.assignee.name : 'Unassigned'}
                </button>
              </div>

              {/* Due Date */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" />
                  Due
                </label>
                <button className="text-left px-2 py-1.5 text-xs rounded border border-border hover:bg-muted transition-colors truncate">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                Description
              </label>
              <textarea
                defaultValue={task.snippet || ''}
                className="w-full bg-muted border border-border rounded px-2 py-2 text-xs placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                rows={4}
                placeholder="Add description..."
              />
            </div>

            {/* Comments Section */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <div className="flex items-center gap-1 text-xs font-medium">
                <MessageSquare className="size-3.5" />
                <span>Comments ({task.comments})</span>
              </div>

              {/* Comment Thread (Mock) */}
              <div className="flex flex-col gap-2 bg-muted rounded p-2">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[0.6rem] font-bold flex-shrink-0">
                    AC
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-medium">Alex Chen</span>
                      <span className="text-[0.65rem] text-muted-foreground">
                        2h ago
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      This is looking great! Ready to merge.
                    </p>
                  </div>
                </div>
              </div>

              {/* Comment Input */}
              <div className="flex gap-2 mt-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[0.6rem] font-bold flex-shrink-0">
                  ME
                </div>
                <div className="flex-1 flex gap-1">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-muted border border-border rounded px-2 py-1.5 text-xs placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  {comment && (
                    <button className="px-2 py-1 text-xs font-medium rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                      Send
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
