"use client";

import { useState } from "react";
import { ChevronDown, Search, Settings, Inbox, Plus } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";
import type { Workspace, User } from "@/types";

interface SidebarProps {
  workspace: Workspace;
  currentUser: User;
  viewMode: "owner" | "editor" | "viewer";
}

export function Sidebar({ workspace, currentUser, viewMode }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col gap-3 border-r border-border bg-background transition-all duration-200 ${
        isCollapsed ? "w-20" : "w-60"
      } h-screen p-4 overflow-y-auto`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div
          className={`flex items-center gap-2 ${isCollapsed ? "hidden" : ""}`}
        >
          <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            D
          </div>
          <div className="flex flex-col gap-0">
            <span className="text-xs font-bold leading-tight">Dōki</span>
            <span className="text-[0.65rem] text-muted-foreground leading-tight">
              同期
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <ChevronDown
            className={`size-4 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
          />
        </button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search or jump..."
            className="w-full bg-muted border border-border rounded px-2 py-1.5 pl-8 text-xs placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      )}

      {/* Quick Nav */}
      {!isCollapsed && (
        <nav className="flex flex-col gap-1">
          <button className="text-left px-2 py-1.5 text-xs rounded hover:bg-muted transition-colors flex items-center gap-2">
            <Inbox className="size-3.5" />
            <span>Inbox</span>
          </button>
          <button className="text-left px-2 py-1.5 text-xs rounded hover:bg-muted transition-colors flex items-center gap-2">
            <Settings className="size-3.5" />
            <span>Settings</span>
          </button>
        </nav>
      )}

      {/* Workspace Selector */}
      {!isCollapsed && (
        <div className="mt-2">
          <div className="text-xs font-semibold text-muted-foreground px-2 mb-2">
            WORKSPACE
          </div>
          <button className="w-full text-left px-2 py-1.5 text-xs rounded bg-muted hover:bg-muted/80 transition-colors font-medium flex items-center justify-between gap-2">
            <span className="truncate">{workspace.name}</span>
            <ChevronDown className="size-3" />
          </button>
        </div>
      )}

      {/* Boards List */}
      {!isCollapsed && (
        <div>
          <div className="text-xs font-semibold text-muted-foreground px-2 mb-2">
            BOARDS
          </div>
          <nav className="flex flex-col gap-1">
            {workspace.boards.map((board) => (
              <button
                key={board.id}
                className="text-left px-2 py-1.5 text-xs rounded hover:bg-muted transition-colors truncate"
              >
                {board.title}
              </button>
            ))}
            {viewMode !== "viewer" && (
              <button className="text-left px-2 py-1.5 text-xs rounded hover:bg-muted transition-colors flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <Plus className="size-3" />
                <span>Add board</span>
              </button>
            )}
          </nav>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* User Profile & Theme */}
      {!isCollapsed && (
        <div className="flex flex-col gap-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between gap-2 px-2 py-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                {currentUser.avatar}
              </div>
              <div className="flex flex-col gap-0 min-w-0">
                <span className="text-xs font-medium truncate">
                  {currentUser.name}
                </span>
                <span className="text-[0.65rem] text-muted-foreground truncate">
                  {currentUser.role.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <ThemeSwitcher />
        </div>
      )}
    </aside>
  );
}
