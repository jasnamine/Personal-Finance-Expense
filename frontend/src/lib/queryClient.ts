import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // thử lại 1 lần nếu lỗi
      staleTime: 1000 * 60, // data tươi trong 1 phút
      refetchOnWindowFocus: false, // không tự refetch khi focus tab
    },
  },
});
