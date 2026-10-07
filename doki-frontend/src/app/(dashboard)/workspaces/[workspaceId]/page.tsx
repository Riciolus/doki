"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Bell,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  LayoutGrid,
  Loader2,
  Plus,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useBoardStore } from "@/stores/use-board-store";

const members = [
  { initials: "MA", color: "bg-[#d8c5ff]" },
  { initials: "JK", color: "bg-[#bde7d3]" },
  { initials: "SL", color: "bg-[#ffd4b8]" },
  { initials: "AR", color: "bg-[#c9e1ff]" },
];

function Avatar({
  initials,
  color,
  small = false,
}: {
  initials: string;
  color: string;
  small?: boolean;
}) {
  return (
    <span
      className={`${
        small ? "size-6 text-[9px]" : "size-8 text-[11px]"
      } inline-flex shrink-0 items-center justify-center rounded-full border-2 border-white font-semibold text-[#37352f] ${color}`}
    >
      {initials}
    </span>
  );
}

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;

  // Zustand Store Integration
  const { boards, fetchBoards, createBoard, isLoading, error } =
    useBoardStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [boardDesc, setBoardDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (workspaceId) {
      fetchBoards(workspaceId);
    }
  }, [workspaceId, fetchBoards]);

  async function handleCreateBoard(e: React.FormEvent) {
    e.preventDefault();
    if (!boardName.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await createBoard(workspaceId, {
        title: boardName.trim(),
      });
      setBoardName("");
      setBoardDesc("");
      setModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex min-w-0 flex-1 flex-col">
      {/* HEADER */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e9e9e7] bg-white px-6 dark:border-[#2f2f2f] dark:bg-[#191919]">
        <div className="flex items-center gap-2 text-sm text-[#9b9a97]">
          <span>Workspaces</span>
          <ChevronRight className="size-4" />
          <span className="font-semibold text-[#37352f] dark:text-[#e9e9e7]">
            Workspace Details
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {members.slice(0, 3).map((member) => (
              <Avatar key={member.initials} {...member} small />
            ))}
          </div>
          <span className="text-xs text-[#9b9a97]">4 members</span>
          <button
            className="rounded p-2 text-[#9b9a97] hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Settings"
          >
            <Settings className="size-5" />
          </button>
          <button
            className="rounded p-2 text-[#9b9a97] hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Help"
          >
            <CircleHelp className="size-5" />
          </button>
        </div>
      </header>

      {/* SUB-HEADER / BANNER INFORMASI */}
      <div className="flex h-24 shrink-0 items-center justify-between border-b border-[#e9e9e7] px-7 dark:border-[#2f2f2f]">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs text-[#9b9a97]">
            <span className="rounded bg-[#f1f1ef] px-2 py-0.5 font-medium dark:bg-[#292929]">
              WORKSPACE
            </span>
            <span>4 members · {boards.length} boards</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#37352f] dark:text-[#e9e9e7]">
            Workspace Overview
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-[#37352f] px-3.5 text-xs font-medium text-white transition hover:opacity-90 dark:bg-[#e9e9e7] dark:text-[#37352f]"
          >
            <Plus className="size-4" />
            New Board
          </button>
        </div>
      </div>

      {/* CONTENT: BOARD GRID LIST */}
      <div className="flex-1 overflow-y-auto px-7 py-6">
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-xs font-medium text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9b9a97]">
            All Boards ({boards.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="flex h-48 items-center justify-center text-xs text-[#9b9a97]">
            <Loader2 className="mr-2 size-5 animate-spin" />
            Loading boards...
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {boards.map((board) => (
              <article
                key={board.id}
                onClick={() =>
                  router.push(`/workspaces/${workspaceId}/boards/${board.id}`)
                }
                className="group flex cursor-pointer flex-col justify-between rounded-xl border border-[#e9e9e7] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,.03)] transition hover:border-[#c7c6c2] dark:border-[#2f2f2f] dark:bg-[#202020] dark:hover:border-[#4a4a4a]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-[#f7f7f5] text-[#37352f] dark:bg-[#292929] dark:text-[#e9e9e7]">
                      <LayoutGrid className="size-5" />
                    </span>
                    <span className="text-[11px] font-mono text-[#9b9a97]">
                      {board.createdAt
                        ? new Date(board.createdAt).toLocaleDateString()
                        : "Recent"}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-[#37352f] dark:text-[#e9e9e7]">
                    {board.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-[#9b9a97]">
                    Plan, prioritize, and move work forward.
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#e9e9e7] pt-3 dark:border-[#2f2f2f]">
                  <div className="flex items-center gap-1.5 text-xs text-[#9b9a97]">
                    <Users className="size-3.5" />
                    <span>4 members</span>
                  </div>
                  <span className="text-xs font-medium text-[#6b6a67] opacity-0 transition group-hover:opacity-100 dark:text-[#aaa]">
                    Open Board →
                  </span>
                </div>
              </article>
            ))}

            {/* CREATE BOARD BUTTON CARD */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-[#c7c6c2] text-[#9b9a97] transition hover:border-[#9b9a97] hover:bg-[#f7f7f5] dark:border-[#4a4a4a] dark:hover:bg-[#202020]"
            >
              <Plus className="size-5" />
              <span className="mt-2 text-xs font-medium text-[#37352f] dark:text-[#e9e9e7]">
                Create Board
              </span>
            </button>
          </div>
        )}
      </div>

      {/* CREATE BOARD MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/25 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-[420px] rounded-xl border border-[#e9e9e7] bg-white p-5 shadow-xl dark:border-[#2f2f2f] dark:bg-[#202020]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#37352f] dark:text-[#e9e9e7]">
                  Create New Board
                </h2>
                <p className="mt-1 text-xs text-[#9b9a97]">
                  Add a board to organize tasks in this workspace.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#9b9a97]"
              >
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleCreateBoard}>
              <label className="mt-5 block text-xs font-medium text-[#6b6a67] dark:text-[#aaa]">
                Board Title
                <input
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  autoFocus
                  className="mt-1.5 block h-10 w-full rounded-lg border border-[#e9e9e7] bg-transparent px-3 text-sm text-[#37352f] outline-none focus:border-[#9b9a97] dark:border-[#3a3a3a] dark:text-[#e9e9e7]"
                  placeholder="e.g. Q4 Marketing Campaign"
                />
              </label>
              <label className="mt-4 block text-xs font-medium text-[#6b6a67] dark:text-[#aaa]">
                Description (Optional)
                <textarea
                  value={boardDesc}
                  onChange={(e) => setBoardDesc(e.target.value)}
                  className="mt-1.5 block min-h-[70px] w-full resize-none rounded-lg border border-[#e9e9e7] bg-transparent px-3 py-2 text-sm text-[#37352f] outline-none focus:border-[#9b9a97] dark:border-[#3a3a3a] dark:text-[#e9e9e7]"
                  placeholder="Briefly describe the board goal..."
                />
              </label>
              <button
                type="submit"
                disabled={!boardName.trim() || isSubmitting}
                className="mt-5 flex w-full items-center justify-center rounded-lg bg-[#37352f] py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#e9e9e7] dark:text-[#37352f]"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Create Board"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
