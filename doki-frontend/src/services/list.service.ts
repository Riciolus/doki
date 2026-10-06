import { api } from "@/lib/axios";
import { CreateListInput } from "@/schemas/list.schema";

export const listService = {
  createList: async (boardId: string, payload: CreateListInput) => {
    const response = await api.post(`/boards/${boardId}/lists`, payload);
    return response.data;
  },
};
