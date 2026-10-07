"use client";

import { useAuthStore } from "@/stores/use-auth-store";
import { ReactNode, useEffect } from "react";
import { Sidebar } from "@/components/workspaces/sidebar";
import { useWorkspaceStore } from "@/stores/use-workspace-store";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const { fetchWorkspaces } = useWorkspaceStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fbfbf9] dark:bg-[#121212]">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
