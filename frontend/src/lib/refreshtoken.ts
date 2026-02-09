import { axiosPublic } from "../api/axios";
import { useAuthStore } from "../stores/authStore";

export const refreshToken = async (): Promise<string> => {
  const res = await axiosPublic.post(
    "/auth/refresh-token",
    {},
    { withCredentials: true },
  );

  const newToken = res.data.data.accessToken;

  useAuthStore.getState().setAuth({
    accessToken: newToken,
    isAuthenticated: true,
  });

  return newToken;
};
