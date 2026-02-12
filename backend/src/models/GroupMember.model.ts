import { Schema, model, Document, Types } from "mongoose";
import { GROUP_ROLE, GroupRole } from "../enums/GroupRole.enum";

export interface IGroupMember extends Document {
  groupId: Types.ObjectId;
  userId: Types.ObjectId;
  role: GroupRole; 
  joinedAt: Date;
}

const groupMemberSchema = new Schema<IGroupMember>({
  groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: {
    type: String,
    enum: Object.values(GROUP_ROLE),
    required: true,
  },
  joinedAt: { type: Date, default: Date.now },
});

groupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });

export default model<IGroupMember>("GroupMember", groupMemberSchema);
