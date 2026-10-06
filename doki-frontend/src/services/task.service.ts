import { api } from "@/lib/axios";
import { CreateTaskInput } from "@/schemas/task.schema";

export const taskService = {
  createTask: async (listId: string, payload: CreateTaskInput) => {
    const response = await api.post(`/lists/${listId}/tasks`, payload);
    return response.data;
  },
};
