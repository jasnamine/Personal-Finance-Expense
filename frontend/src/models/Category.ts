import type { TransactionType } from "../types";

export interface CategoryRequest {
  name: string;
  icon?: string;
  type: TransactionType;
}

export interface CategoryResponse {
  userId: string;
  categoryId: string;
  name: string;
  icon?: string;
  type: TransactionType;
}
