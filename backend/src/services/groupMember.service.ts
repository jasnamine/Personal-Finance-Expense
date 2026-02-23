import { Types } from "mongoose";
import GroupModel from "../models/Group.model";
import GroupMemberModel from "../models/GroupMember.model";
import UserModel from "../models/User.model";
import { ForbiddenException } from "../utils/appError";

const addMember = async (groupId: string, userId: string, role: string) => {
  const groupExists = await GroupModel.findOne({ _id: groupId });
  const userExists = await UserModel.findOne({ _id: userId });
  const isMember = await GroupMemberModel.findOne({ groupId, userId });
  if (!groupExists || !userExists || isMember) {
    throw new ForbiddenException(
      "Group or user not found, or user is already a member",
    );
  }

  const newMember = await GroupMemberModel.create({
    groupId: new Types.ObjectId(groupId),
    userId: new Types.ObjectId(userId),
    role,
  });

  return {
    message: "Member added successfully",
    data: newMember,
  };
};

const updateMemberRole = async (
  groupId: string,
  memberId: string,
  newRole: string,
) => {
  const member = await GroupMemberModel.findOne({ groupId, userId: memberId });
  if (!member) {
    throw new ForbiddenException("Member not found in the group");
  }
  const updateMember = await GroupMemberModel.findOneAndUpdate(
    {
      groupId,
      userId: memberId,
    },
    { role: newRole },
    { new: true },
  );

  return {
    message: "Member role updated successfully",
    data: updateMember,
  };
};

const deleteMember = async (groupId: string, memberId: string) => {
  const member = await GroupMemberModel.findOne({ groupId, userId: memberId });
  const owner = await GroupMemberModel.findOne({
    groupId,
    userId: memberId,
    role: "OWNER",
  });
  if (!member) {
    throw new ForbiddenException("Member not found in the group");
  }

  if (owner) {
    throw new ForbiddenException("Cannot delete the owner of the group");
  }

  const deletedMember = await GroupMemberModel.deleteOne({
    groupId,
    userId: memberId,
  });

  return {
    message: "Member deleted successfully",
    data: deletedMember,
  };
};

export { addMember, deleteMember, updateMemberRole };
