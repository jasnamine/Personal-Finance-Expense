import type { TransactionType } from "../types";

export interface ExpenseRequest {
  amount: number;
  date: Date;
  description?: string;
  // type: TransactionType;
  categoryId: string;
  receiptUrl?: string;
}

export interface ExpenseResponse {
  _id: string;
  amount: number;
  date: Date;
  description?: string;
  // type: TransactionType;
  categoryId: string;
  receiptUrl?: string;
}
