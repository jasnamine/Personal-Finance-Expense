
import { useMutation } from "@tanstack/react-query";
import { privateApi } from "../api";
import type { ErrorMessage } from "../api/ApiService";
import NotifyUtils from "../lib/NotifyUtils";

const useCreateApi = <I, O>(resourceURL: string) => {
  return useMutation<O, ErrorMessage, I>({
    mutationFn: (requestBody) =>
      privateApi.post<I, O>(resourceURL, requestBody),

    onSuccess: () => {
      NotifyUtils.success("Create Successfully");
    },

    onError: (err) => {
      NotifyUtils.error(err?.message || "Create failed");
    },
  });
};

export default useCreateApi;
