import { api } from "@/lib/axios";
import { CreateBoardInput } from "@/schemas/board.schema";

export const boardService = {
  getBoards: async (workspaceId: string) => {
    const response = await api.get(`/workspaces/${workspaceId}`);
    return response.data;
  },

  getBoardById: async (id: string) => {
    const response = await api.get(`/boards/${id}`);
    return response.data;
  },

  createBoard: async (workspaceId: string, payload: CreateBoardInput) => {
    const response = await api.post(
      `/workspaces/${workspaceId}/boards`,
      payload,
    );
    return response.data;
  },
};
