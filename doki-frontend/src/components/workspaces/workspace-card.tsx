"use client";

import Link from "next/link";
import { ClipboardList, LayoutGrid, Users } from "lucide-react";
import Avatar from "@/components/workspaces/avatar";
import { Workspace } from "@/types";

const members = [
  { initials: "MA", color: "bg-[#d8c5ff]" },
  { initials: "JK", color: "bg-[#bde7d3]" },
  { initials: "SL", color: "bg-[#ffd4b8]" },
  { initials: "AR", color: "bg-[#c9e1ff]" },
];

export default function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  // Generate Icon & Tone secara dinamis dari nama workspace
  const icon = workspace.name ? workspace.name[0].toUpperCase() : "W";
  const iconTone = "bg-[#d8c5ff] text-[#60408c]";

  // Data fallback dari relasi database atau hitungan default
  const boardsCount = workspace.boards?.length ?? 0;
  const memberCount = workspace.members?.length ?? 1;
  const recentBoards = workspace.boards?.slice(0, 3) || [];

  return (
    <article className="group relative rounded-xl border border-[#e9e9e7] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,.03)] transition hover:border-[#c7c6c2] hover:shadow-md dark:border-[#2f2f2f] dark:bg-[#202020] dark:hover:border-[#4a4a4a]">
      {/* 1. Main Link: Mengover seluruh area card untuk redirect ke Detail Workspace */}
      <Link
        href={`/workspaces/${workspace.id}`}
        className="absolute inset-0 z-0 rounded-xl"
        aria-label={`Go to ${workspace.name}`}
      />

      {/* Content wrapper dengan pointer-events-none agar event klik tembus ke Main Link */}
      <div className="pointer-events-none relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-start justify-between">
            <div
              className={`flex size-11 items-center justify-center rounded-lg text-base font-bold ${iconTone}`}
            >
              {icon}
            </div>
            <div className="flex -space-x-2">
              {members.slice(0, Math.min(memberCount, 3)).map((member) => (
                <Avatar key={member.initials} {...member} small />
              ))}
            </div>
          </div>

          <h2 className="mt-4 text-base font-semibold text-[#37352f] dark:text-[#e9e9e7]">
            {workspace.name}
          </h2>

          <div className="mt-1.5 flex items-center gap-3 text-xs text-[#9b9a97]">
            <span className="flex items-center gap-1.5">
              <LayoutGrid className="size-3.5" />
              {boardsCount} boards
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-3.5" />
              {memberCount} {memberCount === 1 ? "member" : "members"}
            </span>
          </div>
        </div>

        {/* Section Recent Boards */}
        <div className="mt-4 border-t border-[#e9e9e7] pt-3 dark:border-[#2f2f2f]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9b9a97]">
            Recent boards
          </p>
          <div className="mt-2 flex flex-col gap-1">
            {recentBoards.length > 0 ? (
              recentBoards.map((board, index) => (
                /* 2. Sub-link langsung ke board spesifik (pointer-events-auto & z-20 agar mengoverride Main Link) */
                <Link
                  key={board.id}
                  href={`/workspaces/${workspace.id}/boards/${board.id}`}
                  className="pointer-events-auto relative z-20 flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-xs text-[#6b6a67] transition hover:bg-[#f1f1ef] dark:text-[#aaa] dark:hover:bg-[#292929]"
                >
                  <span
                    className={`flex size-6 items-center justify-center rounded-md ${
                      index === 0
                        ? "bg-[#e9ddff] text-[#6d4aa2]"
                        : "bg-[#f1f1ef] text-[#9b9a97] dark:bg-[#292929]"
                    }`}
                  >
                    <ClipboardList className="size-3.5" />
                  </span>
                  <span className="font-medium truncate">{board.title}</span>
                </Link>
              ))
            ) : (
              <p className="py-1 text-xs text-[#9b9a97]">No boards yet</p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
