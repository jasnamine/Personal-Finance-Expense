import { Document, Schema, Types, model } from "mongoose";
import { SPLIT_TYPE, SplitType } from "../enums/SplitType";

export interface IExpense extends Document {
  amount: number;
  currency: string;
  date: Date;
  description?: string;
  paidBy?: Types.ObjectId;
  categoryId?: Types.ObjectId;
  createdBy?: Types.ObjectId;
  groupId?: Types.ObjectId;
  splits?: Array<{
    userId: Types.ObjectId;
    value: number;
    splitType: SplitType;
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
  paidBy: { type: Schema.Types.ObjectId, ref: "User" },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  groupId: { type: Schema.Types.ObjectId, ref: "Group" },
  splits: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      value: { type: Number },
      splitType: {
        type: String,
        enum: Object.values(SPLIT_TYPE),
      },
    },
  ],
  receiptUrl: { type: String },
  isSettled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

expenseSchema.index({ groupId: 1, date: -1 });
expenseSchema.index({ groupId: 1 });

export default model<IExpense>("Expense", expenseSchema);
