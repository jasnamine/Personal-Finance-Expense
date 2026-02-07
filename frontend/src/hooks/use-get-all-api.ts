import { useQuery } from "@tanstack/react-query";
import { privateApi } from "../api";
import type {
  ErrorMessage,
  ListResponse,
  RequestParams,
} from "../api/ApiService";

const useGetAllApi = <O>(
  resourceURL: string,
  resourceKey: string,
  requestParams?: RequestParams,
) => {
  return useQuery<ListResponse<O>, ErrorMessage>({
    queryKey: [resourceKey, "getAll", requestParams],
    queryFn: () => privateApi.getAll<O>(resourceURL, requestParams),
    placeholderData: (prev) => prev,
  });
};

export default useGetAllApi;
