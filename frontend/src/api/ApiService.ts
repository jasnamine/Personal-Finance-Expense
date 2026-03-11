import type { AxiosInstance } from "axios";

// Thay vì interface, hãy dùng type
export type RequestParams = {
  page?: number;
  size?: number;
  sort?: string;
  filter?: string | null;
  search?: string;
  type?: string | null;
  categoryId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  all?: number;
};
/**
 * ListResponse dùng để thể hiện đối tượng trả về sau lệnh getAll
 */
export interface ListResponse<O = unknown> {
  data: O[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

/**
 * ListByIdResponse dùng để thể hiện đối tượng trả về sau lệnh getById
 */
export interface ListByIdResponse<O = unknown>{
  data: O;
  message: string;
}

/**
 * ErrorMessage dùng để thể hiện đối tượng lỗi trả về sau lệnh fetch
 */
export interface ErrorMessage {
  statusCode: number;
  timestamp: string;
  message: string;
  description: string;
}

type BasicRequestParams = Record<string, string | number | null | boolean>;

class ApiService {
  private axios: AxiosInstance;
  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  /**
   * Hàm getAll dùng để lấy danh sách tất cả đối tượng (có thể theo một số tiêu chí, cài đặt trong requestParams)
   * @param resourceUrl
   * @param requestParams
   */

  async getAll<O>(
    resourceURL: string,
    params?: BasicRequestParams,
  ): Promise<ListResponse<O>> {
    const response = await this.axios.get<ListResponse<O>>(
      ApiService.concatParams(resourceURL, params),
    );
    return response.data;
  }

  /**
   * Hàm getById dùng để lấy entity có id cho trước
   * @param resourceUrl
   * @param entityId
   */
  async getById<O>(resourceURL: string, id: string): Promise<O> {
    const response = await this.axios.get<O>(`${resourceURL}/${id}`);
    return response.data;
  }

  /**
   * Hàm post dùng để tạo entity từ requestBody
   * @param resourceUrl
   * @param requestBody
   */
  async post<I, O>(resourceURL: string, data: I): Promise<O> {
    const response = await this.axios.post<O>(resourceURL, data);
    return response.data;
  }

  /**
   * Hàm update dùng để cập nhật entity theo id và requestBody nhận được
   * @param resourceUrl
   * @param entityId
   * @param requestBody
   */
  async update<I, O>(
    resourceURL: string,
    id: string,
    requestBody: I,
  ): Promise<O> {
    const response = await this.axios.put<O>(
      `${resourceURL}/${id}`,
      requestBody,
    );
    return response.data;
  }

  /**
   * Hàm deleteById xóa entity theo id nhận được
   * @param resourceUrl
   * @param entityId
   */
  async deleteById(resourceURL: string, id: string): Promise<void> {
    await this.axios.delete(`${resourceURL}/${id}`);
  }

  async delete<I>(resourceURL: string, id: string, requestBody?: I): Promise<void>{
    await this.axios.delete(`${resourceURL}/${id}`, { data: requestBody });
  }

  /**
   * Hàm concatParams dùng để nối url và requestParams
   * @param url
   * @param requestParams
   */
  private static concatParams = (
    url: string,
    requestParams?: BasicRequestParams,
  ) => {
    if (requestParams) {
      const filteredRequestParams = Object.fromEntries(
        Object.entries(requestParams).filter(
          ([, v]) => v != null && String(v).trim() !== "",
        ),
      ) as Record<string, string>;
      if (Object.keys(filteredRequestParams).length === 0) {
        return url;
      }
      return url + "?" + new URLSearchParams(filteredRequestParams).toString();
    }
    return url;
  };
}

export default ApiService;
