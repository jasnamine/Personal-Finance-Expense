import { Types } from "mongoose";
import { GROUP_ROLE } from "../enums/GroupRole.enum";
import ExpenseModel from "../models/Expense.model";
import Group, { IGroup } from "../models/Group.model";
import GroupMember from "../models/GroupMember.model";
import { ForbiddenException, NotFoundException } from "../utils/appError";

const createGroup = async (userId: string, groupData: IGroup) => {
  const { name, description, startDate, endDate, baseCurrency } = groupData;

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
  const userMemberships = await GroupMember.find({ userId })
    .populate({
      path: "groupId",
      select:
        "name description startDate endDate baseCurrency ownerId createdAt",
    })
    .lean();

  const groupIds = userMemberships.map((m) => m.groupId._id);

  const allMembers = await GroupMember.find({ groupId: { $in: groupIds } })
    .populate("userId", "name email")
    .lean();

  const membersByGroup = allMembers.reduce(
    (acc: Record<string, any[]>, m: any) => {
      const groupIdStr = m.groupId.toString();
      if (!acc[groupIdStr]) acc[groupIdStr] = [];
      acc[groupIdStr].push({
        userId: m.userId._id.toString(),
        name: m.userId.name,
        email: m.userId.email,
        role: m.role,
        joinedAt: m.joinedAt,
      });
      return acc;
    },
    {},
  );

  const groups = userMemberships.map((membership: any) => {
    const group = membership.groupId;
    const groupIdStr = group._id.toString();

    return {
      _id: group._id,
      name: group.name,
      description: group.description,
      startDate: group.startDate,
      endDate: group.endDate,
      baseCurrency: group.baseCurrency,
      ownerId: group.ownerId,
      createdAt: group.createdAt,
      role: membership.role,
      members: membersByGroup[groupIdStr] || [],
    };
  });

  return {
    message: "Groups fetched successfully",
    data: groups,
  };
};

const getGroupById = async (userId: string, groupId: string) => {
  const currentMember = await GroupMember.findOne({ userId, groupId }).populate(
    "groupId",
  );

  if (!currentMember) {
    throw new ForbiddenException(
      "You are not a member of this group or the group does not exist",
    );
  }

  const group = currentMember.groupId as any;

  const members = await GroupMember.find({ groupId })
    .populate("userId", "name email")
    .lean();

  const formattedMembers = members.map((m: any) => ({
    userId: m.userId._id.toString(),
    name: m.userId.name,
    email: m.userId.email,
    role: m.role,
    joinedAt: m.joinedAt,
  }));

  const expenses = await ExpenseModel.find({ groupId })
    .populate("paidBy", "email")
    .populate("createdBy", "email")
    .lean();

  const formattedExpenses = expenses.map((e: any) => ({
    _id: e._id.toString(),
    amount: e.amount,
    currency: e.currency,
    date: e.date,
    description: e.description,
    type: e.type,
    paidBy: e.paidBy?.email.toString(),
    paidById: e.paidBy?._id.toString(),
    createdBy: e.createdBy?.email.toString(),
    splits: e.splits?.map((s: any) => ({
      userId: s.userId.toString(),
      value: s.value,
      splitType: s.splitType,
    })),
    receiptUrl: e.receiptUrl,
    isSettled: e.isSettled,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  }));

  const totalExpenseResult = await ExpenseModel.aggregate([
    { $match: { groupId: new Types.ObjectId(groupId) } },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const totalExpense = totalExpenseResult[0]?.total || 0;

  return {
    group: {
      _id: group._id,
      name: group.name,
      description: group.description,
      startDate: group.startDate,
      endDate: group.endDate,
      baseCurrency: group.baseCurrency,
      ownerId: group.ownerId,
      createdAt: group.createdAt,
      role: currentMember.role,
    },
    members: formattedMembers,
    expenses: formattedExpenses,
    totalExpense,
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

const updateGroup = async (
  userId: string,
  groupId: string,
  updateData: Partial<IGroup>,
) => {
  const member = await GroupMember.findOne({ userId, groupId });

  if (!member) {
    throw new NotFoundException("Member information not found in this group");
  }

  if (member.role !== GROUP_ROLE.OWNER) {
    throw new ForbiddenException(
      "Only the group owner has the right to edit information",
    );
  }

  const { name, description, startDate, endDate, baseCurrency } = updateData;

  const updatePayload: any = {};
  if (name !== undefined) updatePayload.name = name.trim();
  if (description !== undefined) updatePayload.description = description.trim();
  if (startDate !== undefined) updatePayload.startDate = new Date(startDate);
  if (endDate !== undefined) updatePayload.endDate = new Date(endDate);
  if (baseCurrency !== undefined) updatePayload.baseCurrency = baseCurrency;

  const updatedGroup = await Group.findByIdAndUpdate(
    groupId,
    { $set: updatePayload },
    { new: true, runValidators: true },
  );

  if (!updatedGroup) {
    throw new NotFoundException("Group does not exist");
  }

  return {
    message: "Group information updated successfully",
    data: updatedGroup,
  };
};

export { createGroup, deleteGroup, getGroupById, getUserGroups, updateGroup };
