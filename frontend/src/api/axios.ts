import axios from "axios";
import ApplicationConstants from "../constants/ApplicationConstants";
import { refreshToken } from "../lib/refreshtoken";
import { useAuthStore } from "../stores/authStore";

export const axiosPublic = axios.create({
  baseURL: ApplicationConstants.API_PATH,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: ApplicationConstants.API_PATH,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosPrivate.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosPrivate.interceptors.response.use(
  (res) => res,
  async (err) => {
    const prev = err.config;

    if (err.response?.status === 403 && !prev._retry) {
      prev._retry = true;
      try {
        const newToken = await refreshToken();
        prev.headers.Authorization = `Bearer ${newToken}`;

        return axiosPrivate(prev);
      } catch (error) {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  },
);
