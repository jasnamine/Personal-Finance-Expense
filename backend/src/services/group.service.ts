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

  // Lấy danh sách groupId để query members
  const groupIds = userMemberships.map((m) => m.groupId._id);

  // Lấy tất cả members của các group này
  const allMembers = await GroupMember.find({ groupId: { $in: groupIds } })
    .populate("userId", "name email")
    .lean();

  // Group members theo groupId
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

  // Map lại để trả về groups kèm members
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
      role: membership.role, // role của current user
      members: membersByGroup[groupIdStr] || [], // list members
    };
  });

  return {
    message: "Groups fetched successfully",
    data: groups,
  };
};

const getGroupById = async (userId: string, groupId: string) => {
  // 1. Kiểm tra user có trong group không
  const currentMember = await GroupMember.findOne({ userId, groupId }).populate(
    "groupId",
  );

  if (!currentMember) {
    throw new ForbiddenException(
      "Bạn không phải thành viên của group này hoặc group không tồn tại",
    );
  }

  const group = currentMember.groupId as any;

  // 2. Lấy tất cả thành viên của group
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

  // 3. Lấy tất cả giao dịch trong group
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

  // 4. Tính tổng tiền đã chi (totalExpense) theo baseCurrency
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
  // 1. Kiểm tra quyền hạn: Chỉ Owner mới được update group
  const member = await GroupMember.findOne({ userId, groupId });

  if (!member) {
    throw new NotFoundException(
      "Không tìm thấy thông tin thành viên trong nhóm",
    );
  }

  if (member.role !== GROUP_ROLE.OWNER) {
    throw new ForbiddenException(
      "Chỉ chủ sở hữu nhóm mới có quyền chỉnh sửa thông tin",
    );
  }

  // 2. Lọc các field cho phép update để tránh ghi đè dữ liệu quan trọng (như ownerId)
  const { name, description, startDate, endDate, baseCurrency } = updateData;

  const updatePayload: any = {};
  if (name !== undefined) updatePayload.name = name.trim();
  if (description !== undefined) updatePayload.description = description.trim();
  if (startDate !== undefined) updatePayload.startDate = new Date(startDate);
  if (endDate !== undefined) updatePayload.endDate = new Date(endDate);
  if (baseCurrency !== undefined) updatePayload.baseCurrency = baseCurrency;

  // 3. Thực hiện update
  const updatedGroup = await Group.findByIdAndUpdate(
    groupId,
    { $set: updatePayload },
    { new: true, runValidators: true }, // new: true để trả về object sau khi đã update
  );

  if (!updatedGroup) {
    throw new NotFoundException("Nhóm không tồn tại");
  }

  return {
    message: "Cập nhật thông tin nhóm thành công",
    data: updatedGroup,
  };
};

export { createGroup, deleteGroup, getGroupById, getUserGroups, updateGroup };


