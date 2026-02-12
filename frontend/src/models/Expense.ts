import type { Split, TransactionType } from "../types";

export interface ExpenseRequest {
  amount: number;
  currency?: string;
  date: string;
  description: string;
  type: TransactionType;
  paidBy?: string;
  categoryId: string;
  createdBy?: string;
  groupId?: string;
  splits?: Split[];
  receiptUrl?: string;
  isSettled?: boolean;
}

export interface ExpenseResponse {
  _id: string;
  amount?: number;
  currency?: string;
  date?: string;
  description?: string;
  type?: TransactionType;
  paidBy: string;
  categoryId?: string;
  createdBy: string;
  groupId?: string;
  splits?: Split[];
  receiptUrl?: string;
  isSettled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
