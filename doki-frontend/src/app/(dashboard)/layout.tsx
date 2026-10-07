"use client";

import { useAuthStore } from "@/stores/use-auth-store";
import { ReactNode, useEffect } from "react";
import { Sidebar } from "@/components/workspaces/sidebar";
import { useWorkspaceStore } from "@/stores/use-workspace-store";
import { useRouter } from "next/navigation";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { checkAuth, isLoading, isAuthenticated } = useAuthStore();
  const { fetchWorkspaces } = useWorkspaceStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fbfbf9] dark:bg-[#121212]">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
