import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string; // hashed
  name?: string;
  currency: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String },
  currency: { type: String, default: "VND" },
  createdAt: { type: Date, default: Date.now },
});

export default model<IUser>("User", userSchema);
