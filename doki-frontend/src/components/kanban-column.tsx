"use client";

import { Plus, MoreVertical } from "lucide-react";
import { TaskCard } from "./task-card";
import type { Task } from "@/types";
import Image from "next/image";

interface KanbanColumnProps {
  title: string;
  taskCount: number;
  tasks: Task[];
  onAddCard?: () => void;
  onCardClick?: (task: Task) => void;
  viewMode: "owner" | "editor" | "viewer";
}

export function KanbanColumn({
  title,
  taskCount,
  tasks,
  onAddCard,
  onCardClick,
  viewMode,
}: KanbanColumnProps) {
  return (
    <div className="relative flex flex-col gap-3 flex-shrink-0 w-80 bg-background rounded border border-border p-3 max-h-[calc(100vh-9rem)] overflow-y-auto">
      <Image
        src={"/bg-board-dark.jpg"}
        alt=""
        fill
        className="object-cover opacity-5 z-0"
      />

      {/* Column Header */}
      <div className="flex items-center z-10 justify-between gap-2 mb-1 sticky top-0 bg-background pb-1 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="font-semibold text-sm leading-tight">{title}</h2>
          <span className="text-[0.65rem] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            {String(taskCount).padStart(2, "0")}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {viewMode !== "viewer" && (
            <button
              onClick={onAddCard}
              className="p-1 rounded hover:bg-muted transition-colors"
              title="Add card"
            >
              <Plus className="size-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          )}
          <button
            className="p-1 rounded hover:bg-muted transition-colors"
            title="Column options"
          >
            <MoreVertical className="size-3.5 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-2 z-10">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <span className="text-xs">No tasks</span>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onCardClick={onCardClick} />
          ))
        )}
      </div>
    </div>
  );
}
