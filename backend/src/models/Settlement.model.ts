import { Schema, model, Document, Types } from "mongoose";

export interface ISettlement extends Document {
  groupId: Types.ObjectId;
  fromUserId: Types.ObjectId;
  toUserId: Types.ObjectId;
  amount: number;
  method?: string;
  recordedAt: Date;
}

const settlementSchema = new Schema<ISettlement>({
  groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
  fromUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  toUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  method: { type: String },
  recordedAt: { type: Date, default: Date.now },
});

export default model<ISettlement>("Settlement", settlementSchema);
