"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Eye, Plus, SlidersHorizontal, Users } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { KanbanColumn } from "@/components/kanban-column";
import { TaskDetailDrawer } from "@/components/task-detail-drawer";
import { InviteModal } from "@/components/invite-modal";
import { PresenceBar } from "@/components/presence-bar";
import {
  mockActiveUsers,
  mockTasks,
  mockUsers,
  mockWorkspaces,
} from "@/data/mock";
import type { Task } from "@/types";
import Image from "next/image";

const columns = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "inreview", title: "In Review" },
  { id: "done", title: "Done" },
] as const;

export default function Page() {
  const [tasks, setTasks] = useState(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"owner" | "editor" | "viewer">(
    "owner",
  );
  const [showViewMenu, setShowViewMenu] = useState(false);

  const groupedTasks = useMemo(
    () =>
      columns.reduce(
        (acc, column) => {
          acc[column.id] = tasks.filter((task) => task.status === column.id);
          return acc;
        },
        {} as Record<(typeof columns)[number]["id"], Task[]>,
      ),
    [tasks],
  );

  const addCard = (status: Task["status"]) => {
    if (viewMode === "viewer") return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: "Untitled task",
      status,
      priority: "medium",
      comments: 0,
    };
    setTasks((current) => [...current, newTask]);
    setSelectedTask(newTask);
  };

  const isViewer = viewMode === "viewer";

  return (
    <main className="flex h-screen overflow-hidden  text-foreground">
      <Sidebar
        workspace={mockWorkspaces[0]}
        currentUser={mockUsers[0]}
        viewMode={viewMode}
      />

      <section className=" flex min-w-0 flex-1 flex-col ">
        {/* Top Header */}
        <header className="flex min-h-14 items-center justify-between gap-4 border-b border-border bg-background px-4 py-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
              <span>Acme Corp</span>
              <span>/</span>
              <span className="truncate text-foreground">Sprint Board Q3</span>
            </div>
            <div className="hidden h-4 w-px bg-border sm:block" />
            <button className="hidden items-center gap-1 rounded px-1.5 py-1 text-sm font-semibold hover:bg-muted sm:flex">
              Sprint Board Q3
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>
          </div>

          <PresenceBar activeUsers={mockActiveUsers} totalUsers={8} />

          <div className="flex items-center gap-2">
            <span className="hidden rounded bg-accent px-2 py-1 font-mono text-[0.65rem] font-bold text-accent-foreground sm:inline-flex">
              {viewMode.toUpperCase()}
            </span>
            {!isViewer && (
              <button
                onClick={() => setIsInviteOpen(true)}
                className="inline-flex items-center gap-1 rounded border border-border px-2 py-1.5 text-xs font-medium hover:bg-muted"
              >
                <Users className="size-3.5" />
                <span className="hidden sm:inline">Invite</span>
              </button>
            )}
            <button
              onClick={() => setShowViewMenu((value) => !value)}
              className="inline-flex items-center gap-1 rounded border border-border px-2 py-1.5 text-xs hover:bg-muted"
            >
              <Eye className="size-3.5" />
              <span className="hidden sm:inline">Preview</span>
              <ChevronDown className="size-3" />
            </button>
          </div>
        </header>

        {/* Role Preview Menu */}
        {showViewMenu && (
          <div className="absolute right-4 top-14 z-20 w-48 rounded border border-border bg-popover p-1.5 shadow-md">
            <div className="px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
              Preview as
            </div>
            {(["owner", "editor", "viewer"] as const).map((role) => (
              <button
                key={role}
                onClick={() => {
                  setViewMode(role);
                  setShowViewMenu(false);
                }}
                className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs capitalize hover:bg-muted"
              >
                {role}
                {viewMode === role && <span className="text-[#a14e3d]">●</span>}
              </button>
            ))}
          </div>
        )}

        {isViewer && (
          <div className="flex items-center gap-2 border-b border-border bg-accent px-4 py-2 text-xs text-accent-foreground">
            <Eye className="size-3.5" />
            Viewing in read-only mode. Editing controls are hidden.
          </div>
        )}

        {/* Board Toolbar */}
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs hover:bg-muted">
              <SlidersHorizontal className="size-3.5" />
              Filter
            </button>
            <span className="text-[0.7rem] text-muted-foreground">
              {tasks.length} tasks
            </span>
          </div>
          {!isViewer && (
            <button
              onClick={() => addCard("todo")}
              className="inline-flex items-center gap-1 rounded bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
            >
              <Plus className="size-3.5" />
              Add card
            </button>
          )}
        </div>

        {/* Kanban Board */}
        <div className="flex min-h-0 flex-1 flex-row gap-3 overflow-x-auto p-3">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              title={column.title}
              taskCount={groupedTasks[column.id].length}
              tasks={groupedTasks[column.id]}
              viewMode={viewMode}
              onAddCard={() => addCard(column.id)}
              onCardClick={setSelectedTask}
            />
          ))}
          {!isViewer && (
            <button className="flex h-fit min-w-48 flex-shrink-0 items-center justify-center gap-1 rounded border border-dashed border-border p-3 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
              <Plus className="size-3.5" />
              Add list
            </button>
          )}
        </div>
      </section>

      <TaskDetailDrawer
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
      />
      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </main>
  );
}
