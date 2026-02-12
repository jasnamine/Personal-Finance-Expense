export interface GroupRequest {
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  baseCurrency: string;
  createdAt: Date;
}
export interface GroupResponse {
  _id: string;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  baseCurrency: string;
  createdAt: Date;
}
