import { CreateWorkspaceInput } from "@/schemas/workspace.schema";
import { workspaceService } from "@/services/workspace.service";
import { Workspace } from "@/types";
import { AxiosError } from "axios"; // 1. Import AxiosError
import { create } from "zustand";

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;

  fetchWorkspaces: () => Promise<void>;
  fetchWorkspaceById: (id: string) => Promise<void>;
  createWorkspace: (payload: CreateWorkspaceInput) => Promise<void>;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaces: [],
  currentWorkspace: null,
  isLoading: true,
  error: null,

  fetchWorkspaces: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await workspaceService.getWorkspaces();
      set({ workspaces: response.data, isLoading: false });
    } catch (error: unknown) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An error occurred";
      set({ error: message, isLoading: false });
    }
  },

  fetchWorkspaceById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await workspaceService.getWorkspaceById({
        workspaceId: id,
      });
      set({ currentWorkspace: response.data, isLoading: false });
    } catch (error: unknown) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An error occurred";
      set({ error: message, isLoading: false });
    }
  },

  createWorkspace: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const response = await workspaceService.createWorkspace(payload);
      set((state) => ({
        isLoading: false,
        workspaces: [...state.workspaces, response.data],
      }));
    } catch (error: unknown) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "Failed to create workspace";
      set({ error: message, isLoading: false });
    }
  },

  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
}));
