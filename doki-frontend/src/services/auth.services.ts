import { api } from "@/lib/axios";
import { LoginInput, RegisterInput } from "@/schemas/auth.schema";

export const authService = {
  register: async (payload: RegisterInput) => {
    const response = await api.post("/auth/register", payload);
    return response.data;
  },
  login: async (payload: LoginInput) => {
    const response = await api.post("/auth/login", payload);
    return response.data;
  },
};
