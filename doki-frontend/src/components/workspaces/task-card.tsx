"use client";

import { GripVertical, MessageSquare } from "lucide-react";
import Avatar from "./avatar";
import type { Task } from "@/types";

// Mapping warna tag berdasarkan priority DOKI
const priorityTones: Record<string, string> = {
  URGENT: "bg-[#ffdcd5] text-[#a54f42]",
  HIGH: "bg-[#ffe4ad] text-[#8a641e]",
  MEDIUM: "bg-[#d9e8ff] text-[#4a6594]",
  LOW: "bg-[#e9ddff] text-[#6d4aa2]",
};

export default function TaskCard({
  task,
  canEdit,
  onClick,
}: {
  task: Task;
  canEdit: boolean;
  onClick: () => void;
}) {
  // Format tanggal untuk tampilan UI
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Today";

  // Ambil inisial assignee
  const assigneeInitials = task.assignee?.name
    ? task.assignee.name.slice(0, 2).toUpperCase()
    : "AR";

  const tagTone =
    (task.priority && priorityTones[task.priority]) ||
    "bg-[#e9e9e7] text-[#6b6a67]";

  return (
    <button
      onClick={onClick}
      className="group w-full rounded-lg border border-[#e9e9e7] bg-white p-3.5 text-left shadow-[0_1px_2px_rgba(0,0,0,.03)] transition hover:bg-[#f1f1ef] dark:border-[#2f2f2f] dark:bg-[#202020] dark:hover:bg-[#292929]"
    >
      <div className="flex gap-2">
        <GripVertical
          className={`mt-0.5 size-4 shrink-0 text-[#c7c6c2] ${
            canEdit ? "opacity-0 group-hover:opacity-100" : "invisible"
          }`}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-medium leading-5 text-[#37352f] dark:text-[#e9e9e7]">
            {task.title}
          </p>

          {task.description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-4 text-[#9b9a97]">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <span
              className={`rounded px-2 py-1 text-[11px] font-medium ${tagTone}`}
            >
              {task.priority || "Task"}
            </span>

            <Avatar initials={assigneeInitials} small />

            <span className="ml-auto flex items-center gap-1 text-xs text-[#9b9a97]">
              <MessageSquare className="size-3.5" />0
            </span>

            <span className="font-mono text-[11px] text-[#9b9a97]">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
