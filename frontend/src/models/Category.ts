import type { TransactionType } from "../types";

export interface CategoryRequest {
  name: string;
  icon: string;
  type: TransactionType;
}

export interface CategoryResponse {
  _id: string;
  name: string;
  type: TransactionType;
  icon: string;
}
