import ExpenseModel, { IExpense } from "../models/Expense.model";
import GroupModel from "../models/Group.model";
import GroupMemberModel from "../models/GroupMember.model";
import { BadRequestException, NotFoundException } from "../utils/appError";
import { calculateSplits } from "./balance.service";

export const createExpenseGroup = async (userId: string, body: IExpense) => {
  const { description, amount, currency, date, paidBy, groupId, splits } = body;
  if (!splits || splits.length === 0) {
    throw new BadRequestException("Splits are required");
  }

  const member = await GroupMemberModel.findOne({ groupId, userId });
  const group = await GroupModel.findOne({ _id: groupId });
  if (!group || !member) {
    throw new NotFoundException("Group not found or user is not a member");
  }

  const members = await GroupMemberModel.find({ groupId });
  const memberIds = members.map((m) => m.userId.toString());
  const calculatedSplits = calculateSplits(amount, splits, memberIds);

  const expense = await ExpenseModel.create({
    description,
    amount,
    currency: currency || "VND",
    date: new Date(date),
    paidBy,
    groupId,
    createdBy: userId,
    splits: calculatedSplits,
  });
  return {
    message: "Expense created in group successfully",
    data: expense,
  };
};

export const getExpenseGroupByGroupId = async (
  groupId: string,
  userId: string,
) => {
  const member = await GroupMemberModel.findOne({ groupId, userId });
  if (!member) {
    throw new NotFoundException("User not in group");
  }
  const expenses = await ExpenseModel.find({ groupId });
  return {
    message: "Expenses retrieved successfully",
    data: expenses,
  };
};

export const updateExpenseGroup = async (
  userId: string,
  groupId: string,
  expenseId:string,
  updateData: Partial<IExpense>,
) => {
  const { amount, splits } = updateData;

  const member = await GroupMemberModel.findOne({ groupId, userId });

  if (!member) {
    throw new NotFoundException("User not in group");
  }

  const groupMembers = await GroupMemberModel.find({ groupId });
  const memberIds = groupMembers.map((m) => m.userId.toString());

  let calculatedSplits = splits;

  if (splits && amount) {
    calculatedSplits = calculateSplits(amount, splits, memberIds);
  }

  const expense = await ExpenseModel.findOneAndUpdate(
    { _id: expenseId, groupId },
    {
      ...updateData,
      splits: calculatedSplits,
    },
    { new: true },
  );

  if (!expense) {
    throw new NotFoundException("Expense not found");
  }

  return {
    message: "Expense updated successfully",
    data: expense,
  };
};

export const deleteExpenseGroup = async (
  userId: string,
  expenseId: string,
  groupId: string,
) => {
  const member = await GroupMemberModel.findOne({ groupId, userId });
  if (!member) {
    throw new NotFoundException("Group not found or user is not a member");
  }

  const expense = await ExpenseModel.findOneAndDelete({
    _id: expenseId,
    groupId,
  });

  if (!expense) {
    throw new NotFoundException("Expense not found in the group");
  }

  return {
    message: "Expense deleted successfully",
    data: expense,
  };
};
