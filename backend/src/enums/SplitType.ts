export const SPLIT_TYPE = {
  EQUAL: "EQUAL",
  EXACT: "EXACT",
} as const;

export type SplitType = keyof typeof SPLIT_TYPE;
