import { useAuthStore } from "@/stores/use-auth-store";
import axios from "axios";

let refreshPromise: Promise<unknown> | null = null;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const setUser = useAuthStore.getState().setUser;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/login") &&
      !originalRequest.url.includes("/register") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = api.post("/auth/refresh").finally(() => {
            refreshPromise = null;
          });
        }

        await refreshPromise;

        return api(originalRequest);
      } catch (refreshError) {
        setUser(null);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
