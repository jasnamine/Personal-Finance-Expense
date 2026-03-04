import type { GroupRole, TransactionType } from "../types";
import type { ExpenseResponse } from "./Expense";

type SplitType = "EQUAL" | "PERCENTAGE" | "EXACT";

export interface GroupRequest {
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  baseCurrency: string;
}

export interface GroupResponse {
  _id: string;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  baseCurrency: string;
  members: [
    {
      userId: string;
      email: string;
      role: string;
    },
  ];
}

export interface GroupDetailResponse {
  group: {
    _id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    baseCurrency: string;
    ownerId: string;
  };
  members?: {
    userId: string;
    email?: string;
    role?: GroupRole;
  }[];
  expenses?: ExpenseResponse[];
  totalExpense: number;
}

export interface GroupExpenseRequest {
  description?: string;
  amount: number;
  paidBy: string;
  date: Date;
  splitType: SplitType;
  splits?: {
    userId: string;
    value: number;
  }[];
  receiptUrl?: File;
}

export interface GroupExpenseResponse {
  amount: number;
  currency: string;
  date: Date;
  description?: string;
  type: TransactionType;
  paidBy?: string;
  groupId?: string;
  splits?: Array<{
    userId: string;
    amount: number;
    splitType: SplitType;
  }>;
  receiptUrl?: string;
  isSettled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupMemberRequest {
  email?: string;
  groupId: string;
  userId?: string;
  role: GroupRole;
}

export interface GroupMember {
  userId: string;
  email?: string;
  role?: GroupRole;
}

export interface GroupMemberResponse {
  groupId: string;
  data: {
    members: GroupMember[];
  };
}
