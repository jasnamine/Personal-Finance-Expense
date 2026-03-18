import { Types } from "mongoose";
import GroupModel from "../models/Group.model";
import GroupMemberModel from "../models/GroupMember.model";
import UserModel from "../models/User.model";
import { ForbiddenException } from "../utils/appError";

const getMembersByGroupId = async (groupId: string) => {
  const groupExists = await GroupModel.findOne({ _id: groupId });
  if (!groupExists) {
    throw new ForbiddenException("Group not found");
  }

  const members = await GroupMemberModel.find({ groupId }).populate<{
    userId: { _id: Types.ObjectId; email: string };
  }>("userId", "email");

  const formattedMembers = members.map((member) => ({
    userId: member.userId._id.toString(),
    email: member.userId?.email,
    role: member.role,
  }));

  return {
    message: "Members retrieved successfully",
    data: {
      groupId,
      members: formattedMembers,
    },
  };
};

const addMember = async (groupId: string, email: string, role: string) => {
  const groupExists = await GroupModel.findOne({ _id: groupId });
  const userExists = await UserModel.findOne({ email });
  const isMember = await GroupMemberModel.findOne({
    groupId,
    userId: userExists?._id,
  });
  if (!groupExists || !userExists || isMember) {
    throw new ForbiddenException(
      "Group or user not found, or user is already a member",
    );
  }

  const newMember = await GroupMemberModel.create({
    groupId: new Types.ObjectId(groupId),
    userId: new Types.ObjectId(userExists?._id),
    role,
  });

  const memberData = await newMember.populate<{
    userId: { _id: Types.ObjectId; email: string };
  }>("userId", "email");

  return {
    message: "Member added successfully",
    data: {
      userId: memberData.userId._id.toString(),
      email: memberData.userId?.email,
      role: memberData.role,
    },
  };
};

const updateMemberRole = async (
  groupId: string,
  memberId: string,
  newRole: string,
) => {
  const updateMember = await GroupMemberModel.findOneAndUpdate(
    {
      groupId: new Types.ObjectId(groupId),
      userId: new Types.ObjectId(memberId),
    },
    { role: newRole },
    { new: true },
  ).populate<{ userId: { _id: Types.ObjectId; email: string } }>(
    "userId",
    "email",
  );

  if (!updateMember) {
    throw new ForbiddenException("Member not found in the group");
  }

  return {
    message: "Member role updated successfully",
    data: {
      userId: updateMember.userId._id.toString(),
      email: updateMember.userId?.email,
      role: updateMember.role,
    },
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

const leaveGroup = async (groupId: string, userId: string) => {
  // 1. Tìm member đang thực hiện yêu cầu
  const currentMember = await GroupMemberModel.findOne({
    groupId: new Types.ObjectId(groupId),
    userId: new Types.ObjectId(userId),
  });

  if (!currentMember) {
    throw new ForbiddenException("Bạn không phải là thành viên của nhóm này");
  }

  // 2. Nếu là OWNER, kiểm tra xem có ai khác cũng là OWNER không
  if (currentMember.role === "OWNER") {
    const otherOwner = await GroupMemberModel.findOne({
      groupId: new Types.ObjectId(groupId),
      userId: { $ne: new Types.ObjectId(userId) }, // Không phải là chính mình ($ne: Not Equal)
      role: "OWNER",
    });

    if (!otherOwner) {
      throw new ForbiddenException(
        "Bạn là chủ nhóm duy nhất. Hãy chuyển quyền OWNER cho thành viên khác trước khi rời nhóm!",
      );
    }
  }

  // 3. Nếu vượt qua các bước check trên thì cho phép xóa khỏi nhóm
  await GroupMemberModel.deleteOne({
    groupId: new Types.ObjectId(groupId),
    userId: new Types.ObjectId(userId),
  });

  return {
    message: "Rời nhóm thành công",
    data: { groupId, userId },
  };
};

export {
  addMember,
  deleteMember,
  getMembersByGroupId,
  updateMemberRole,
  leaveGroup,
};
