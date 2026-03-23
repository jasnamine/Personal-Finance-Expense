export const TRANSACTION_TYPE = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

export type TransactionType = keyof typeof TRANSACTION_TYPE;

