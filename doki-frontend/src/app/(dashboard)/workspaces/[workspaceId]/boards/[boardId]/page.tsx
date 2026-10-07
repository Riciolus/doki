"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Archive,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Copy,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Send,
  Sparkles,
  Users,
  X,
  Check,
} from "lucide-react";

import Avatar from "@/components/workspaces/avatar";
import type { Task } from "@/types";
import { useBoardStore } from "@/stores/use-board-store";
import TaskCard from "@/components/workspaces/task-card";

type Role = "OWNER" | "EDITOR" | "VIEWER";

const avatars = [
  { initials: "MA", color: "bg-[#d8c5ff]" },
  { initials: "JK", color: "bg-[#bde7d3]" },
  { initials: "SL", color: "bg-[#ffd4b8]" },
];

export default function BoardPage() {
  const params = useParams();
  const boardId = params.boardId as string;

  // Zustand Store
  const { currentBoard, fetchBoardById, createList, createTask, isLoading } =
    useBoardStore();

  // Local State UI
  const [role, setRole] = useState<Role>("OWNER");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);

  const canEdit = role !== "VIEWER";

  // Fetch Data Board saat pertama kali load
  useEffect(() => {
    if (boardId) {
      fetchBoardById(boardId);
    }
  }, [boardId, fetchBoardById]);

  // Handler Tambah List
  const handleCreateList = async () => {
    if (!newListName.trim() || !boardId) return;
    await createList(boardId, { title: newListName.trim() });
    setNewListName("");
    setIsAddingList(false);
  };

  // Handler Tambah Task Cepat
  const handleCreateTask = async (listId: string) => {
    if (!canEdit) return;
    await createTask(listId, {
      id: crypto.randomUUID(), // Or v4() from the 'uuid' package
      title: "Untitled task",
    });
  };

  if (isLoading && !currentBoard) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-[#9b9a97]">
        Loading Board...
      </div>
    );
  }

  // Hitung total task di seluruh list
  const totalTasks =
    currentBoard?.lists?.reduce(
      (sum, list) => sum + (list.tasks?.length || 0),
      0,
    ) || 0;

  return (
    <>
      <main className="doki-shell flex h-screen min-w-[1100px] overflow-hidden bg-[#fbfbfb] font-sans text-[#37352f] dark:bg-[#191919] dark:text-[#e9e9e7]">
        <section className="flex min-w-0 flex-1 flex-col">
          {/* Top Bar Header */}
          <header className="flex h-16 shrink-0 items-center gap-5 border-b border-[#e9e9e7] bg-white px-6 dark:border-[#2f2f2f] dark:bg-[#191919]">
            <div className="flex min-w-[300px] items-center gap-2 text-sm text-[#9b9a97]">
              <span>Workspace</span>
              <ChevronRight className="size-4" />
              <span className="font-medium text-[#37352f] dark:text-[#e9e9e7]">
                {currentBoard?.title || "Board"}
              </span>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {avatars.map((avatar) => (
                    <Avatar key={avatar.initials} {...avatar} small />
                  ))}
                </div>
                <span className="text-xs text-[#9b9a97]">
                  <i className="mr-1.5 inline-block size-2 rounded-full bg-[#50a878]" />
                  3 active now
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="h-8 rounded border border-[#e9e9e7] bg-transparent px-2 text-xs font-semibold tracking-wide outline-none dark:border-[#3a3a3a]"
              >
                <option value="OWNER">OWNER</option>
                <option value="EDITOR">EDITOR</option>
                <option value="VIEWER">VIEWER</option>
              </select>

              {canEdit && (
                <button
                  onClick={() => setInviteOpen(true)}
                  className="flex h-9 items-center gap-1.5 rounded-lg bg-[#37352f] px-3.5 text-xs font-medium text-white hover:opacity-90 dark:bg-[#e9e9e7] dark:text-[#37352f]"
                >
                  <Users className="size-4" />
                  Invite
                </button>
              )}

              <button
                className="rounded p-2 text-[#9b9a97] hover:bg-black/5"
                aria-label="Help"
              >
                <CircleHelp className="size-5" />
              </button>
            </div>
          </header>

          {/* Banner Read-Only */}
          {role === "VIEWER" && (
            <div className="flex h-9 shrink-0 items-center justify-center gap-2 border-b border-[#e4d6b5] bg-[#fff7e5] text-xs text-[#8a641e] dark:border-[#594d35] dark:bg-[#302a1d] dark:text-[#e7c87c]">
              <Archive className="size-4" />
              Viewing in Read-Only mode · Editing is disabled
            </div>
          )}

          {/* Board Title Header */}
          <div className="flex h-24 shrink-0 items-center justify-between border-b border-[#e9e9e7] px-7 dark:border-[#2f2f2f]">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs text-[#9b9a97]">
                <span className="rounded bg-[#f1f1ef] px-2 py-1 dark:bg-[#292929]">
                  Active Board
                </span>
                <span>Updated live</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-[-0.02em]">
                {currentBoard?.title || "Board Overview"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 rounded-lg border border-[#e9e9e7] px-3 py-2 text-xs text-[#6b6a67] hover:bg-[#f1f1ef] dark:border-[#3a3a3a] dark:text-[#aaa] dark:hover:bg-[#292929]">
                <Sparkles className="size-4" />
                Automations
              </button>
              <button
                className="rounded p-2 text-[#9b9a97] hover:bg-black/5"
                aria-label="Board menu"
              >
                <MoreHorizontal className="size-5" />
              </button>
            </div>
          </div>

          {/* Main Board View */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between px-7 py-3">
              <div className="flex items-center gap-2 text-xs text-[#9b9a97]">
                <span className="font-medium text-[#6b6a67] dark:text-[#aaa]">
                  {totalTasks} tasks
                </span>
                <span>·</span>
                <span>Updated live</span>
                <span className="inline-flex size-2 rounded-full bg-[#50a878]" />
              </div>

              <button className="flex items-center gap-1.5 text-xs text-[#9b9a97] hover:text-[#37352f] dark:hover:text-[#e9e9e7]">
                <Menu className="size-4" />
                Filter & sort <ChevronDown className="size-4" />
              </button>
            </div>

            {/* Column / List Container */}
            <div className="flex min-h-0 flex-1 gap-4 overflow-x-auto px-7 pb-7">
              {currentBoard?.lists?.map((list) => (
                <section
                  key={list.id}
                  className="flex min-w-[300px] max-w-[350px] flex-1 flex-col rounded-xl bg-[#f7f7f5] p-3 dark:bg-[#202020]"
                >
                  <div className="flex items-center gap-2 px-1 pb-3">
                    <span className="size-2.5 rounded-full bg-[#c7c7c2]" />
                    <h2 className="text-sm font-semibold">{list.title}</h2>
                    <span className="rounded bg-[#e9e9e7] px-2 py-0.5 text-xs text-[#6b6a67] dark:bg-[#2f2f2f] dark:text-[#aaa]">
                      {list.tasks?.length || 0}
                    </span>
                    <div className="ml-auto flex items-center gap-1 text-[#9b9a97]">
                      <button
                        className="rounded p-1 hover:bg-black/5"
                        aria-label={`Add card to ${list.title}`}
                        onClick={() => handleCreateTask(list.id)}
                      >
                        <Plus className="size-4" />
                      </button>
                      <MoreHorizontal className="size-4" />
                    </div>
                  </div>

                  {/* List Item Cards */}
                  <div className="flex flex-col gap-3 overflow-y-auto">
                    {list.tasks?.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        canEdit={canEdit}
                        onClick={() => setSelectedTask(task)}
                      />
                    ))}
                  </div>

                  {canEdit && (
                    <button
                      onClick={() => handleCreateTask(list.id)}
                      className="mt-3 flex items-center gap-1.5 rounded px-1.5 py-1.5 text-xs text-[#9b9a97] hover:bg-black/5"
                    >
                      <Plus className="size-4" />
                      Add card
                    </button>
                  )}
                </section>
              ))}

              {/* Action untuk Tambah List/Kolom Baru */}
              {canEdit && (
                <div className="min-w-[280px]">
                  {isAddingList ? (
                    <div className="flex flex-col gap-2 rounded-xl bg-[#f7f7f5] p-3 dark:bg-[#202020]">
                      <input
                        type="text"
                        placeholder="Enter list title..."
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className="rounded border border-[#e9e9e7] bg-white p-2 text-sm outline-none dark:border-[#3a3a3a] dark:bg-[#191919]"
                        autoFocus
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleCreateList()
                        }
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCreateList}
                          className="rounded bg-[#37352f] px-3 py-1.5 text-xs text-white dark:bg-[#e9e9e7] dark:text-[#37352f]"
                        >
                          Add List
                        </button>
                        <button
                          onClick={() => setIsAddingList(false)}
                          className="rounded p-1.5 text-xs text-[#9b9a97]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingList(true)}
                      className="flex w-full items-center gap-2 rounded-xl border border-dashed border-[#e9e9e7] p-3 text-xs font-medium text-[#9b9a97] hover:bg-[#f7f7f5] dark:border-[#2f2f2f] dark:hover:bg-[#202020]"
                    >
                      <Plus className="size-4" />
                      Add Column
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Task Detail Drawer */}
      {selectedTask && (
        <div
          className="fixed inset-0 z-20 bg-black/15"
          onClick={() => setSelectedTask(null)}
        >
          <aside
            className="absolute right-0 top-0 flex h-full w-[440px] flex-col border-l border-[#e9e9e7] bg-white shadow-xl dark:border-[#2f2f2f] dark:bg-[#202020]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e9e9e7] px-5 py-4 dark:border-[#2f2f2f]">
              <span className="text-xs text-[#9b9a97]">
                TASK-{selectedTask.id.slice(0, 6).toUpperCase()}
              </span>
              <button
                onClick={() => setSelectedTask(null)}
                className="rounded p-1 text-[#9b9a97] hover:bg-black/5"
                aria-label="Close task details"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="text-2xl font-semibold leading-7">
                {selectedTask.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#6b6a67] dark:text-[#aaa]">
                {selectedTask.description || "No description provided."}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 border-y border-[#e9e9e7] py-4 text-sm dark:border-[#2f2f2f]">
                <div>
                  <p className="text-xs text-[#9b9a97]">Priority</p>
                  <p className="mt-1.5 font-medium uppercase">
                    {selectedTask.priority || "MEDIUM"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9b9a97]">Assignee</p>
                  <p className="mt-1.5 flex items-center gap-1.5 font-medium">
                    {selectedTask.assignee ? (
                      <>
                        <Avatar
                          initials={selectedTask.assignee.name.slice(0, 2)}
                          small
                        />
                        {selectedTask.assignee.name}
                      </>
                    ) : (
                      "Unassigned"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9b9a97]">Due date</p>
                  <p className="mt-1.5 flex items-center gap-1.5 font-medium">
                    <CalendarDays className="size-4" />
                    {selectedTask.dueDate
                      ? new Date(selectedTask.dueDate).toLocaleDateString()
                      : "No due date"}
                  </p>
                </div>
              </div>

              <h3 className="mt-7 flex items-center gap-2 text-sm font-semibold">
                <MessageSquare className="size-4" />
                Comments
              </h3>
            </div>

            <div className="border-t border-[#e9e9e7] p-4 dark:border-[#2f2f2f]">
              <div className="flex items-center gap-2 rounded-lg border border-[#e9e9e7] px-3 py-2 dark:border-[#3a3a3a]">
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  placeholder="Write a comment..."
                />
                <button
                  className="text-[#9b9a97] hover:text-[#37352f]"
                  aria-label="Send comment"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Invite Modal */}
      {inviteOpen && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/25 p-4"
          onClick={() => setInviteOpen(false)}
        >
          <div
            className="w-full max-w-[420px] rounded-xl border border-[#e9e9e7] bg-white p-5 shadow-xl dark:border-[#2f2f2f] dark:bg-[#202020]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">Invite to Workspace</h2>
                <p className="mt-1.5 text-sm text-[#9b9a97]">
                  Share a magic link with someone on your team.
                </p>
              </div>
              <button
                onClick={() => setInviteOpen(false)}
                className="text-[#9b9a97]"
                aria-label="Close invite dialog"
              >
                <X className="size-5" />
              </button>
            </div>

            <label className="mt-5 block text-xs font-medium text-[#6b6a67] dark:text-[#aaa]">
              Role
              <select className="mt-1.5 block h-10 w-full rounded-lg border border-[#e9e9e7] bg-transparent px-3 text-sm dark:border-[#3a3a3a]">
                <option value="EDITOR">EDITOR</option>
                <option value="VIEWER">VIEWER</option>
              </select>
            </label>

            <div className="mt-5">
              <p className="text-xs font-medium text-[#6b6a67] dark:text-[#aaa]">
                Magic link
              </p>
              <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-[#e9e9e7] p-2 dark:border-[#3a3a3a]">
                <span className="min-w-0 flex-1 truncate font-mono text-xs text-[#9b9a97]">
                  doki.app/invite/7f2a9c
                </span>
                <button
                  onClick={() => {
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1800);
                  }}
                  className="flex items-center gap-1.5 rounded bg-[#f1f1ef] px-3 py-1.5 text-xs dark:bg-[#292929]"
                >
                  {copied ? (
                    <Check className="size-3.5" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <button
              onClick={() => setInviteOpen(false)}
              className="mt-5 w-full rounded-lg bg-[#37352f] py-2.5 text-sm font-medium text-white dark:bg-[#e9e9e7] dark:text-[#37352f]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
