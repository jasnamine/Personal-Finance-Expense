import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "../api";
import type { ErrorMessage } from "../api/ApiService";
import NotifyUtils from "../lib/NotifyUtils";

const useDeleteByIdApi = (resourceURL: string, resourceKey: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, ErrorMessage, string>({
    mutationFn: (entityId: string) =>
      privateApi.deleteById(resourceURL, entityId),

    onSuccess: () => {
      NotifyUtils.success("Xóa thành công");
      void queryClient.invalidateQueries({
        queryKey: [resourceKey, "getAll"],
      });
    },

    onError: (err) => {
      NotifyUtils.error(err?.message || "Xóa không thành công");
    },
  });
};


export default useDeleteByIdApi;
