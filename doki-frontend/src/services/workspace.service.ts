import { api } from "@/lib/axios";
import {
  CreateWorkspaceInput,
  WorkspaceIdInput,
} from "@/schemas/workspace.schema";

export const workspaceService = {
  getWorkspaces: async () => {
    const response = await api.get("/workspaces");
    return response.data;
  },

  getWorkspaceById: async ({ workspaceId }: WorkspaceIdInput) => {
    const response = await api.get(`/workspaces/${workspaceId}`);
    return response.data;
  },

  createWorkspace: async (payload: CreateWorkspaceInput) => {
    const response = await api.post("/workspaces", payload);
    return response.data;
  },
};
