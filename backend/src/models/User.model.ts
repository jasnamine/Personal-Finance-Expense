import { Schema, model, Document } from "mongoose";
import {compareValue, hashValue} from "../utils/bcrypt";

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  currency: string;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  username: { type: String },
  currency: { type: String, default: "VND" },
  createdAt: { type: Date, default: Date.now },
});

// Hash password trước khi save
userSchema.pre('save', async function (next) {
  if(this.isModified('password')) {
    this.password = await hashValue(this.password);
  }
  next();
});

// Method compare password
userSchema.methods.comparePassword = async function (password: string) {
  return await compareValue(password, this.password);
}

export default model<IUser>("User", userSchema);
