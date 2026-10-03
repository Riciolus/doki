"use client";

import { useAuthStore } from "@/stores/use-auth-store";
import { ReactNode, useEffect } from "react";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <></>;
  }

  return <>{children}</>;
}
