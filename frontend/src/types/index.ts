export type TransactionType = "INCOME" | "EXPENSE";
export type GroupRole = "ADMIN" | "EDITOR" | "VIEWER";
export type SplitMethod = "EQUAL" | "PERCENTAGE" | "EXACT" | "SHARES";

export interface User {
  id: string;
  email: string;
  name: string;
  currency: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  userId: string;
  color?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  baseCurrency: string;
  ownerId: string;
  createdAt: string;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: GroupRole;
  joinedAt: string;
}

export interface Split {
  userId: string;
  amount?: number;
  percentage?: number;
  shares?: number;
}

export interface Expense {
  id: string;
  amount: number;
  currency: string;
  date: string;
  description: string;
  type: TransactionType;
  paidBy: string;
  categoryId?: string;
  createdBy: string;
  groupId?: string;
  splits?: Split[];
  receiptUrl?: string;
  isSettled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Settlement {
  id: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  method?: string;
  recordedAt: string;
}

export interface Balance {
  userId: string;
  balance: number;
}

export interface Debt {
  from: string;
  to: string;
  amount: number;
}

export interface AppState {
  currentUser: User | null;
  mode: "PERSONAL" | "GROUP";
  selectedGroupId: string | null;
}
