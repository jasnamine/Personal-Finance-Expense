import { axiosPublic } from "../api/axios";
import { useAuthStore } from "../stores/authStore";

export const refreshToken = async (): Promise<string> => {
  const res = await axiosPublic.post(
    "/auth/refresh",
    {},
    { withCredentials: true },
  );

  const newToken = res.data.accessToken;

  useAuthStore.getState().setAuth({
    accessToken: newToken,
    isAuthenticated: true,
  });

  return newToken;
};
