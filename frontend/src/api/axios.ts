import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { refreshToken } from "../lib/refreshtoken";
const BASE_URL = "http://localhost:5000/api/v1";

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
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

      const newToken = await refreshToken();
      prev.headers.Authorization = `Bearer ${newToken}`;

      return axiosPrivate(prev);
    }

    return Promise.reject(err);
  },
);
