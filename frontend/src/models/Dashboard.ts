export interface DashboardResponse {
  summary: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };

  categoryStats: {
    _id: string;
    total: number;
  }[];

  monthlyStats: {
    _id: {
      month: number;
      year: number;
      type: "INCOME" | "EXPENSE";
    };
    total: number;
  }[];
}


export interface CategoryStat {
  _id: string;   
  total: number; 
}

export interface MonthlyStat {
  month: string;  
  income: number;
  expense: number;
}


