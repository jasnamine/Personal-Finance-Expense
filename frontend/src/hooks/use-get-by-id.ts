import { useQuery } from "@tanstack/react-query";
import { privateApi } from "../api";
import type { ErrorMessage } from "../api/ApiService";

const useGetById = <O>(
  resourceURL: string,
  resourceKey: string,
  entityId: string,
) => {
  return useQuery<O, ErrorMessage>({
    queryKey: [resourceKey, "getById", entityId],
    queryFn: () => privateApi.getById<O>(resourceURL, entityId),
    placeholderData: (prev) => prev,
  });
};

export default useGetById;
