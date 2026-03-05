// src/enums/TransactionType.ts
export const SPLIT_TYPE = {
  EQUAL: "EQUAL",
  EXACT: "EXACT",
} as const;

// Export type để dùng trong interface/schema
export type SplitType = keyof typeof SPLIT_TYPE;
