import { logout } from "@/auth/authService";
import { useStore } from "@/store";
import axios, { AxiosError } from "axios";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_API_URL ?? "http://localhost:8000"}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withXSRFToken: true,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = useStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    if (err.response?.status === 401) {
      useStore.getState().authActions.clearUserInfo();
      await logout();

      return Promise.reject();
    }

    return Promise.reject(err);
  }
);

export default apiClient;
