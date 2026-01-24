// hooks/useAxiosPrivate.ts
import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import { useAuthStore } from "../stores/authStore";
import { useRefreshToken } from "./useRefreshToken";

export const useAxiosPrivate = () => {
  const { accessToken } = useAuthStore();
  const refresh = useRefreshToken();

  useEffect(() => {
    const req = axiosPrivate.interceptors.request.use((config) => {
      if (!config.headers.Authorization && accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    const res = axiosPrivate.interceptors.response.use(
      (res) => res,
      async (err) => {
        const prev = err.config;
        if (err.response?.status === 403 && !prev._retry) {
          prev._retry = true;
          const newToken = await refresh();
          prev.headers.Authorization = `Bearer ${newToken}`;
          return axiosPrivate(prev);
        }
        return Promise.reject(err);
      },
    );

    return () => {
      axiosPrivate.interceptors.request.eject(req);
      axiosPrivate.interceptors.response.eject(res);
    };
  }, [accessToken, refresh]);

  return axiosPrivate;
};
