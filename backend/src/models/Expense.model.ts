import { Schema, model, Document, Types } from "mongoose";
import { TRANSACTION_TYPE, TransactionType } from "../enums/TransactionType.enum";

export interface IExpense extends Document {
  amount: number;
  currency: string;
  date: Date;
  description?: string;
  type: TransactionType; 
  paidBy?: Types.ObjectId;
  categoryId?: Types.ObjectId;
  createdBy?: Types.ObjectId;
  groupId?: Types.ObjectId;
  splits?: Array<{
    userId: Types.ObjectId;
    amount: number;
    percentage?: number;
    shares?: number;
  }>;
  receiptUrl?: string;
  isSettled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>({
  amount: { type: Number, required: true },
  currency: { type: String, default: "VND" },
  date: { type: Date, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: Object.values(TRANSACTION_TYPE),
    required: true,
  },
  paidBy: { type: Schema.Types.ObjectId, ref: "User" },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User"},
  groupId: { type: Schema.Types.ObjectId, ref: "Group" },
  splits: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      amount: { type: Number },
      percentage: { type: Number },
      shares: { type: Number },
    },
  ],
  receiptUrl: { type: String },
  isSettled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

expenseSchema.index({ userId: 1, groupId: 1, date: -1 });
expenseSchema.index({ groupId: 1 });

export default model<IExpense>("Expense", expenseSchema);

