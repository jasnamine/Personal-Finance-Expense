export interface SettleRequest {
  fromUserId: string;
  toUserId: string;
  amount: number;
  method?: string;
  date: Date;
}

export interface SettlementResponse {
  id: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  method?: string;
}

export interface Balance {
    userId: string;
    email: string;
    balance: number;
}

export interface Debt {
  fromUserId: string;
  toUserId: string;
  amount: number;
}
