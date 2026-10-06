"use client";

import { useState } from "react";
import {
  Search,
  Inbox,
  Settings,
  Plus,
  LayoutGrid,
  ClipboardList,
  Sun,
  Moon,
  ChevronsUpDown,
  Building2,
} from "lucide-react";

interface Workspace {
  id: string;
  name: string;
}

interface Board {
  id: string;
  title: string;
}

interface SidebarProps {
  dark: boolean;
  setDark: (value: boolean) => void;
  workspaces?: Workspace[];
  activeWorkspace?: Workspace;
  boards?: Board[];
  onSelectWorkspace?: (workspaceId: string) => void;
  onSelectBoard?: (boardId: string) => void;
}

export function Sidebar({
  dark,
  setDark,
  workspaces = [{ id: "ws-1", name: "Acme Corp" }],
  activeWorkspace = { id: "ws-1", name: "Acme Corp" },
  boards = [
    { id: "b-1", title: "Sprint Board Q3" },
    { id: "b-2", title: "Product Roadmap" },
  ],
  onSelectWorkspace,
  onSelectBoard,
}: SidebarProps) {
  const [isWsOpen, setIsWsOpen] = useState(false);

  return (
    <aside className="flex w-[250px] shrink-0 flex-col border-r border-[#e9e9e7] bg-[#f7f7f5] p-3 text-[14px] dark:border-[#2f2f2f] dark:bg-[#191919]">
      {/* 1. WORKSPACE SWITCHER HEADER */}
      <div className="relative mb-2">
        <button
          onClick={() => setIsWsOpen(!isWsOpen)}
          className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5"
        >
          <div className="flex items-center gap-2.5 font-semibold min-w-0">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#37352f] text-xs font-bold text-white dark:bg-[#f1f1ef] dark:text-[#37352f]">
              {activeWorkspace.name.substring(0, 2).toUpperCase()}
            </span>
            <span className="truncate text-[15px]">{activeWorkspace.name}</span>
          </div>
          <ChevronsUpDown className="size-4 shrink-0 text-[#9b9a97]" />
        </button>

        {/* Dropdown Menu Pilih Workspace */}
        {isWsOpen && (
          <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-[#e9e9e7] bg-white p-1 shadow-lg dark:border-[#2f2f2f] dark:bg-[#202020]">
            <div className="px-2 py-1 text-[11px] font-semibold text-[#9b9a97] uppercase">
              Workspaces
            </div>
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  onSelectWorkspace?.(ws.id);
                  setIsWsOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs ${
                  ws.id === activeWorkspace.id
                    ? "bg-[#f7f7f5] font-medium text-black dark:bg-[#292929] dark:text-white"
                    : "text-[#6b6a67] hover:bg-black/5 dark:text-[#aaa] dark:hover:bg-white/5"
                }`}
              >
                <Building2 className="size-3.5" />
                <span className="truncate">{ws.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* QUICK FIND / SEARCH */}
      <div className="my-2 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[#6b6a67] shadow-sm dark:bg-[#202020] dark:text-[#aaa]">
        <Search className="size-4" />
        <span className="text-xs">Quick find</span>
        <kbd className="ml-auto rounded border border-[#e9e9e7] px-1.5 text-[10px] dark:border-[#3a3a3a]">
          ⌘ K
        </kbd>
      </div>

      {/* 2. MAIN WORKSPACE NAVIGATION */}
      <nav className="flex flex-col gap-0.5 text-[#6b6a67] dark:text-[#aaa]">
        <button className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left hover:bg-black/5 dark:hover:bg-white/5">
          <Inbox className="size-4" />
          Inbox
          <span className="ml-auto rounded bg-[#ffdcd5] px-1.5 py-0.5 text-[11px] font-medium text-[#a54f42]">
            4
          </span>
        </button>
        <button className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left hover:bg-black/5 dark:hover:bg-white/5">
          <Settings className="size-4" />
          Settings
        </button>
      </nav>

      {/* 3. BOARDS SECTION (Hanya Board milik Workspace Aktif) */}
      <div className="mt-5">
        <div className="flex items-center justify-between px-2 pb-1.5 text-xs font-semibold uppercase tracking-wider text-[#9b9a97]">
          <span>Boards</span>
          <button className="rounded p-0.5 hover:bg-black/5 dark:hover:bg-white/5">
            <Plus className="size-4" />
          </button>
        </div>
        <div className="flex flex-col gap-0.5">
          {boards.map((board, index) => {
            const Icon = index % 2 === 0 ? LayoutGrid : ClipboardList;
            return (
              <button
                key={board.id}
                onClick={() => onSelectBoard?.(board.id)}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[#6b6a67] hover:bg-black/5 dark:text-[#aaa] dark:hover:bg-white/5"
              >
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{board.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. USER PROFILE & THEME TOGGLE */}
      <div className="mt-auto border-t border-[#e9e9e7] pt-2 dark:border-[#2f2f2f]">
        <div className="flex items-center gap-2.5 px-1 py-1">
          <div className="flex size-7 items-center justify-center rounded-full bg-[#c9e1ff] text-xs font-semibold text-[#1e40af]">
            AR
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">Alex Rivera</p>
            <p className="truncate text-[11px] text-[#9b9a97]">alex@acme.co</p>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className="rounded p-1.5 text-[#9b9a97] hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
