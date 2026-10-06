import { api } from "@/lib/axios";

export const boardService = {
  getBoardById: async (id: string) => {
    const response = await api.get(`/boards/${id}`);
    return response.data;
  },
};
