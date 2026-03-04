import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "../api";
import type { ErrorMessage } from "../api/ApiService";
import NotifyUtils from "../lib/NotifyUtils";

const useDeleteApi = <I>(resourceURL: string, resourceKey: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, ErrorMessage, { id: string; requestBody?: I }>({
    mutationFn: ({ id, requestBody }) =>
      privateApi.delete<I>(resourceURL, id, requestBody),

    onSuccess: () => {
      NotifyUtils.success("Xóa thành công");

      void queryClient.invalidateQueries({
        queryKey: [resourceKey],
      });
    },

    onError: (err) => {
      NotifyUtils.error(err?.message || "Xóa không thành công");
    },
  });
};

export default useDeleteApi;
