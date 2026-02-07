import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "../api";
import type { ErrorMessage } from "../api/ApiService";
import NotifyUtils from "../lib/NotifyUtils";

const useUpdateApi = <I, O>(
  resourceURL: string,
  resourceKey: string,
  entityId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation<O, ErrorMessage, I>({
    mutationFn: (requestBody) =>
      privateApi.update<I, O>(resourceURL, entityId, requestBody),

    onSuccess: () => {
      NotifyUtils.success("Tạo thành công");
      void queryClient.invalidateQueries({
        queryKey: [resourceKey, "getById", entityId],
      });

      void queryClient.invalidateQueries({
        queryKey: [resourceKey, "getAll"],
      });
    },

    onError: (err) => {
      NotifyUtils.error(err?.message || "Tạo không thành công");
    },
  });
};

export default useUpdateApi;
