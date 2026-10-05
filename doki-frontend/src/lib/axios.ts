import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/login") &&
      !originalRequest.url.includes("/register") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      try {
        originalRequest._retry = true;

        await api.post("/auth/refresh");

        return api(originalRequest);
      } catch (refreshError) {
        if (typeof Window === "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
