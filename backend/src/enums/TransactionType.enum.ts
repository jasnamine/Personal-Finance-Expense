// src/enums/TransactionType.ts
export const TRANSACTION_TYPE = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

// Export type để dùng trong interface/schema
export type TransactionType = keyof typeof TRANSACTION_TYPE;

