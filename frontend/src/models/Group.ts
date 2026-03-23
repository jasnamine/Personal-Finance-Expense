import type { GroupRole, SplitType, TransactionType } from "../types";

export interface Group {
  id: string;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  baseCurrency: string;
  ownerId: string;
  createdAt: string;
}

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
  expenses?: GroupExpenseResponse[];
  totalExpense: number;
}

export interface GroupExpenseRequest {
  description?: string;
  amount: number;
  paidBy: string;
  date: Date;
  splitType: SplitType;
  splits: {
    userId: string;
    value: number;
    splitType: SplitType;
  }[];
  receiptUrl?: File;
}

export interface GroupExpenseResponse {
  _id: string;
  amount: number;
  currency: string;
  date: Date;
  description?: string;
  type?: TransactionType;
  paidBy: string;
  paidById?: string;
  groupId: string;
  splitType: SplitType;
  splits: Array<{
    userId: string;
    value: number;
    splitType: SplitType;
  }>;
  receiptUrl?: string;
  isSettled?: boolean;
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
