import type { GroupRole } from "../types";
import type { ExpenseResponse } from "./Expense";

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

  members: {
    userId: string;
    email: string;
    role: string;
  }[];

  expenses?: ExpenseResponse[];

  totalExpense: number;
}

export interface GroupMemberRequest {
  email: string;
  groupId: string;
  userId: string;
  role: GroupRole;
}

export interface GroupMember {
  userId: string;
  email: string;
  role: string;
}

export interface GroupMemberResponse {
  groupId: string;
  members: GroupMember[];
}
