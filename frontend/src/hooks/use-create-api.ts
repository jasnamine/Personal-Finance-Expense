
import { useMutation } from "@tanstack/react-query";
import { privateApi } from "../api";
import type { ErrorMessage } from "../api/ApiService";
import NotifyUtils from "../lib/NotifyUtils";

const useCreateApi = <I, O>(resourceURL: string) => {
  return useMutation<O, ErrorMessage, I>({
    mutationFn: (requestBody) =>
      privateApi.post<I, O>(resourceURL, requestBody),

    onSuccess: () => {
      NotifyUtils.success("Tạo thành công");
    },

    onError: (err) => {
      NotifyUtils.error(err?.message || "Tạo không thành công");
    },
  });
};

export default useCreateApi;
