"use client";

import { useState } from "react";
import {
  Bell,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  LayoutGrid,
  Plus,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";

const members = [
  { initials: "MA", color: "bg-[#d8c5ff]" },
  { initials: "JK", color: "bg-[#bde7d3]" },
  { initials: "SL", color: "bg-[#ffd4b8]" },
  { initials: "AR", color: "bg-[#c9e1ff]" },
];

const initialBoards = [
  {
    id: "b-1",
    name: "Sprint Board Q3",
    description: "Plan, prioritize, and move work forward.",
    updated: "Updated 2m ago",
    members: 4,
    icon: LayoutGrid,
  },
  {
    id: "b-2",
    name: "Product Roadmap",
    description: "A shared view of what is coming next.",
    updated: "Updated yesterday",
    members: 3,
    icon: ClipboardList,
  },
  {
    id: "b-3",
    name: "Bug Triage",
    description: "Keep incoming issues clear and assigned.",
    updated: "Updated 3d ago",
    members: 2,
    icon: ClipboardList,
  },
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
  const [boards, setBoards] = useState(initialBoards);
  const [modalOpen, setModalOpen] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [boardDesc, setBoardDesc] = useState("");

  function createBoard() {
    if (!boardName.trim()) return;
    setBoards([
      ...boards,
      {
        id: `b-${Date.now()}`,
        name: boardName.trim(),
        description: boardDesc.trim() || "No description provided.",
        updated: "Created just now",
        members: 1,
        icon: LayoutGrid,
      },
    ]);
    setBoardName("");
    setBoardDesc("");
    setModalOpen(false);
  }

  return (
    <section className="flex min-w-0 flex-1 flex-col">
      {/* HEADER: Disamakan persis dengan Halaman Board */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e9e9e7] bg-white px-6 dark:border-[#2f2f2f] dark:bg-[#191919]">
        <div className="flex items-center gap-2 text-sm text-[#9b9a97]">
          <span>Workspaces</span>
          <ChevronRight className="size-4" />
          <span className="font-semibold text-[#37352f] dark:text-[#e9e9e7]">
            Acme Corp
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
            className="rounded p-2 text-[#9b9a97] hover:bg-black/5"
            aria-label="Settings"
          >
            <Settings className="size-5" />
          </button>
          <button
            className="rounded p-2 text-[#9b9a97] hover:bg-black/5"
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
            <span>4 members · 3 boards</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#37352f] dark:text-[#e9e9e7]">
            Acme Corp
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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9b9a97]">
            All Boards ({boards.length})
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {boards.map((board) => {
            const Icon = board.icon;
            return (
              <article
                key={board.id}
                className="group flex flex-col justify-between rounded-xl border border-[#e9e9e7] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,.03)] transition hover:border-[#c7c6c2] dark:border-[#2f2f2f] dark:bg-[#202020] dark:hover:border-[#4a4a4a]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-[#f7f7f5] text-[#37352f] dark:bg-[#292929] dark:text-[#e9e9e7]">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-[11px] font-mono text-[#9b9a97]">
                      {board.updated}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-[#37352f] dark:text-[#e9e9e7]">
                    {board.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-[#9b9a97]">
                    {board.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#e9e9e7] pt-3 dark:border-[#2f2f2f]">
                  <div className="flex items-center gap-1.5 text-xs text-[#9b9a97]">
                    <Users className="size-3.5" />
                    <span>{board.members} members</span>
                  </div>
                  <button className="text-xs font-medium text-[#6b6a67] opacity-0 transition group-hover:opacity-100 dark:text-[#aaa]">
                    Open Board →
                  </button>
                </div>
              </article>
            );
          })}

          {/* DUMMY NEW BOARD BUTTON CARD */}
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
            <label className="mt-5 block text-xs font-medium text-[#6b6a67] dark:text-[#aaa]">
              Board Title
              <input
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                autoFocus
                className="mt-1.5 block h-10 w-full rounded-lg border border-[#e9e9e7] bg-transparent px-3 text-sm outline-none focus:border-[#9b9a97] dark:border-[#3a3a3a]"
                placeholder="e.g. Q4 Marketing Campaign"
              />
            </label>
            <label className="mt-4 block text-xs font-medium text-[#6b6a67] dark:text-[#aaa]">
              Description (Optional)
              <textarea
                value={boardDesc}
                onChange={(e) => setBoardDesc(e.target.value)}
                className="mt-1.5 block min-h-[70px] w-full resize-none rounded-lg border border-[#e9e9e7] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#9b9a97] dark:border-[#3a3a3a]"
                placeholder="Briefly describe the board goal..."
              />
            </label>
            <button
              onClick={createBoard}
              disabled={!boardName.trim()}
              className="mt-5 w-full rounded-lg bg-[#37352f] py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#e9e9e7] dark:text-[#37352f]"
            >
              Create Board
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
