import { axiosPublic } from "../api/axios";
import { useAuthStore } from "../stores/authStore";

export const useRefreshToken = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return async () => {
    const res = await axiosPublic.post("/auth/refresh");
    setAuth({ accessToken: res.data.accessToken });
    return res.data.accessToken;
  };
};
