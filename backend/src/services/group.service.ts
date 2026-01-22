import { GROUP_ROLE } from "../enums/GroupRole.enum";
import Group from "../models/Group.model";
import GroupMember from "../models/GroupMember.model";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "../utils/appError";

const createGroup = async (userId: string, groupData: any) => {
  const { name, description, startDate, endDate, baseCurrency } = groupData;

  if (!name?.trim()) {
    throw new BadRequestException("Group name is required");
  }

  const group = await Group.create({
    name: name.trim(),
    description: description?.trim(),
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    baseCurrency: baseCurrency || "VND",
    ownerId: userId,
  });

  await GroupMember.create({
    groupId: group._id,
    userId,
    role: GROUP_ROLE.OWNER,
  });

  return {
    message: "Group created successfully",
    data: group,
  };
};

const getUserGroups = async (userId: string) => {
  const members = await GroupMember.find({ userId })
    .populate({
      path: "groupId",
      select:
        "name description startDate endDate baseCurrency ownerId createdAt",
    })
    .lean();

  const groups = members.map((m: any) => ({
    ...m.groupId,
    role: m.role,
    _id: m.groupId._id,
  }));

  return {
    message: "Groups fetched successfully",
    data: groups,
  };
};

const getGroupById = async (userId: string, groupId: string) => {
  const member = await GroupMember.findOne({
    userId,
    groupId,
  }).populate("groupId");

  if (!member) {
    throw new NotFoundException("Group not found or access denied");
  }

  return {
    message: "Group fetched successfully",
    data: member
  };
};

const deleteGroup = async (userId: string, groupId: string) => {
  const member = await GroupMember.findOne({ userId, groupId });

  if (!member) {
    throw new NotFoundException("Group not found");
  }

  if (member.role !== GROUP_ROLE.OWNER) {
    throw new ForbiddenException("Only group owner can delete the group");
  }

  await Group.deleteOne({ _id: groupId });
  await GroupMember.deleteMany({ groupId });

  return {
    message: "Group deleted successfully",
  };
};

export { createGroup, getUserGroups, getGroupById, deleteGroup };
