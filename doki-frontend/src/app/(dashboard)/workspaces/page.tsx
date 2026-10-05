"use client";

import { useState } from "react";
import { CircleHelp, Plus, X } from "lucide-react";
import WorkspaceCard, {
  Workspace,
} from "@/components/workspaces/workspace-card";
import Avatar from "@/components/workspaces/avatar";

const initialWorkspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "Acme Corp",
    icon: "A",
    iconTone: "bg-[#d8c5ff] text-[#60408c]",
    boards: 3,
    memberCount: 4,
    recent: ["Sprint Board Q3", "Product Roadmap", "Bug Triage"],
  },
  {
    id: "ws-2",
    name: "Personal Projects",
    icon: "P",
    iconTone: "bg-[#bde7d3] text-[#397359]",
    boards: 2,
    memberCount: 1,
    recent: ["Side Project Ideas", "Reading List"],
  },
];

const members = [
  { initials: "MA", color: "bg-[#d8c5ff]" },
  { initials: "JK", color: "bg-[#bde7d3]" },
  { initials: "SL", color: "bg-[#ffd4b8]" },
  { initials: "AR", color: "bg-[#c9e1ff]" },
];

export default function WorkspacesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function createWorkspace() {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setWorkspaces([
      ...workspaces,
      {
        id: `ws-${Date.now()}`,
        name: trimmedName,
        icon: trimmedName[0].toUpperCase(),
        iconTone: "bg-[#ffd4b8] text-[#a54f42]",
        boards: 0,
        memberCount: 1,
        recent: [],
      },
    ]);
    setName("");
    setDescription("");
    setModalOpen(false);
  }

  return (
    <section className="flex min-w-0 flex-1 flex-col">
      {/* HEADER: Disesuaikan dengan h-16 dan padding SSOT */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e9e9e7] bg-white px-6 dark:border-[#2f2f2f] dark:bg-[#191919]">
        <div className="text-sm font-semibold text-[#37352f] dark:text-[#e9e9e7]">
          Workspaces
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
            aria-label="Help"
          >
            <CircleHelp className="size-5" />
          </button>
        </div>
      </header>

      {/* CONTENT BODY */}
      <div className="flex flex-1 justify-center overflow-y-auto">
        <div className="w-full max-w-[1040px] px-8 py-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#9b9a97]">
                Workspace directory
              </p>
              <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#37352f] dark:text-[#e9e9e7]">
                Workspaces
              </h1>
              <p className="mt-1 text-sm text-[#9b9a97]">
                Select or manage your workspaces
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-[#37352f] px-3.5 text-xs font-medium text-white transition hover:opacity-90 dark:bg-[#e9e9e7] dark:text-[#37352f]"
            >
              <Plus className="size-4" />
              Create Workspace
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {workspaces.map((workspace) => (
              <WorkspaceCard key={workspace.id} workspace={workspace} />
            ))}
            <button
              onClick={() => setModalOpen(true)}
              className="flex min-h-[268px] flex-col items-center justify-center rounded-xl border border-dashed border-[#c7c6c2] text-[#9b9a97] transition hover:border-[#9b9a97] hover:bg-[#f7f7f5] dark:border-[#4a4a4a] dark:hover:bg-[#202020]"
            >
              <span className="flex size-10 items-center justify-center rounded-full border border-dashed border-current">
                <Plus className="size-5" />
              </span>
              <span className="mt-3 text-sm font-medium text-[#37352f] dark:text-[#e9e9e7]">
                Create New Workspace
              </span>
              <span className="mt-1 text-xs text-[#9b9a97]">
                Start a new shared space
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* CREATE WORKSPACE MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/25 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-[420px] rounded-xl border border-[#e9e9e7] bg-white p-5 shadow-xl dark:border-[#2f2f2f] dark:bg-[#202020]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#37352f] dark:text-[#e9e9e7]">
                  Create Workspace
                </h2>
                <p className="mt-1 text-xs text-[#9b9a97]">
                  Set up a new space for your team.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#9b9a97] hover:text-[#37352f] dark:hover:text-[#e9e9e7]"
                aria-label="Close dialog"
              >
                <X className="size-5" />
              </button>
            </div>
            <label className="mt-5 block text-xs font-medium text-[#6b6a67] dark:text-[#aaa]">
              Workspace Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoFocus
                className="mt-1.5 block h-10 w-full rounded-lg border border-[#e9e9e7] bg-transparent px-3 text-sm outline-none focus:border-[#9b9a97] dark:border-[#3a3a3a]"
                placeholder="e.g. Acme Corp"
              />
            </label>
            <label className="mt-4 block text-xs font-medium text-[#6b6a67] dark:text-[#aaa]">
              Description
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-1.5 block min-h-[80px] w-full resize-none rounded-lg border border-[#e9e9e7] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#9b9a97] dark:border-[#3a3a3a]"
                placeholder="What is this workspace for?"
              />
            </label>
            <button
              onClick={createWorkspace}
              disabled={!name.trim()}
              className="mt-5 w-full rounded-lg bg-[#37352f] py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#e9e9e7] dark:text-[#37352f]"
            >
              Create Workspace
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
