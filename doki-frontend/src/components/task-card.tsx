"use client";

import { MessageSquare, GripVertical } from "lucide-react";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onCardClick?: (task: Task) => void;
}

const priorityColors = {
  urgent: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
  medium:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
  low: "bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-200",
};

const statusLabels = {
  todo: "To Do",
  inprogress: "In Progress",
  inreview: "In Review",
  done: "Done",
};

export function TaskCard({ task, onCardClick }: TaskCardProps) {
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div
      onClick={() => onCardClick?.(task)}
      className="group bg-card border border-border rounded-md p-3.5 hover:bg-muted cursor-pointer transition-colors text-sm leading-relaxed"
    >
      {/* Drag Handle & Title */}
      <div className="flex items-start gap-1.5 mb-2 group-hover:gap-2 transition-all">
        <GripVertical className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 flex-shrink-0 mt-0.5 transition-opacity" />
        <h3 className="font-medium text-foreground line-clamp-2 flex-1 leading-snug">
          {task.title}
        </h3>
      </div>

      {/* Snippet */}
      {task.snippet && (
        <p className="text-muted-foreground mb-2 line-clamp-1 text-[0.7rem]">
          {task.snippet}
        </p>
      )}

      {/* Footer: Metadata */}
      <div className="flex items-center justify-between gap-1.5 flex-wrap">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {/* Priority Tag */}
          {task.priority && (
            <span
              className={`px-1.5 py-0.5 rounded text-[0.65rem] font-medium whitespace-nowrap ${
                priorityColors[task.priority]
              }`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          )}

          {/* Assignee Avatar */}
          {task.assignee && (
            <div
              className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[0.6rem] font-bold flex-shrink-0"
              title={task.assignee.name}
            >
              {task.assignee.avatar}
            </div>
          )}
        </div>

        {/* Comments & Date */}
        <div className="flex items-center gap-1.5">
          {task.comments > 0 && (
            <div className="flex items-center gap-0.5 text-muted-foreground">
              <MessageSquare className="size-3" />
              <span className="text-[0.65rem]">{task.comments}</span>
            </div>
          )}
          {formattedDate && (
            <span className="text-[0.65rem] font-mono text-muted-foreground px-1 py-0.5 bg-muted rounded">
              {formattedDate.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
