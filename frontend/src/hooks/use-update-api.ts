import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "../api";
import type { ErrorMessage } from "../api/ApiService";
import NotifyUtils from "../lib/NotifyUtils";

const useUpdateApi = <I extends { id: string }, O>(
  resourceURL: string,
  resourceKey: string,
) => {
  const queryClient = useQueryClient();

  return useMutation<O, ErrorMessage, I>({
    mutationFn: ({ id, ...body }) =>
      privateApi.update<Omit<I, "id">, O>(resourceURL, id, body),

    onSuccess: () => {
      NotifyUtils.success("Cập nhật thành công");
      void queryClient.invalidateQueries({
        queryKey: [resourceKey, "getAll"],
      });
    },

    onError: (err) => {
      NotifyUtils.error(err?.message || "Cập nhật không thành công");
    },
  });
};


export default useUpdateApi;
