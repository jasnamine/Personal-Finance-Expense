import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "../api";
import type { ErrorMessage } from "../api/ApiService";
import NotifyUtils from "../lib/NotifyUtils";

const useDeleteByIdApi = <T = string>(
  resourceURL: string,
  resourceKey: string,
  entityId: string,
) => {
  const queryClient = useQueryClient();
  return useMutation<void, ErrorMessage, T>({
    mutationFn: () => privateApi.deleteById(resourceURL, entityId),

    onSuccess: () => {
      NotifyUtils.success("Tạo thành công");
      void queryClient.invalidateQueries({
        queryKey: [resourceKey, "getAll"],
      });
    },

    onError: (err) => {
      NotifyUtils.error(err?.message || "Tạo không thành công");
    },
  });
};

export default useDeleteByIdApi;
