import { Schema, model, Document, Types } from "mongoose";
import { TRANSACTION_TYPE, TransactionType } from "../enums/TransactionType.enum"; // import enum

export interface ICategory extends Document {
  name: string;
  type: TransactionType; 
  icon?: string;
  userId: Types.ObjectId;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: Object.values(TRANSACTION_TYPE), 
    required: true,
  },
  icon: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

categorySchema.index({ userId: 1, name: 1, type: 1 }, { unique: true });

export default model<ICategory>("Category", categorySchema);
