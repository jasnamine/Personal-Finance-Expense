import { Schema, model, Document, Types } from "mongoose";

export interface IGroup extends Document {
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  baseCurrency: string;
  ownerId: Types.ObjectId;
  createdAt: Date;
}

const groupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  baseCurrency: { type: String, default: "VND" },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<IGroup>("Group", groupSchema);
