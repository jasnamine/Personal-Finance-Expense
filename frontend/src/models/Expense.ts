export interface ExpenseRequest {
  amount: number;
  date: Date;
  description?: string;
  categoryId: string;
  receiptUrl?: string;
}

export interface ExpenseResponse {
  _id: string;
  amount: number;
  date: Date;
  description?: string;
  categoryId: string;
  receiptUrl?: string;
}
