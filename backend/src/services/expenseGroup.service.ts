import ExpenseModel, { IExpense } from "../models/Expense.model";
import GroupModel from "../models/Group.model";
import GroupMemberModel from "../models/GroupMember.model";
import { NotFoundException } from "../utils/appError";

export const createExpenseGroup = async (userId: string, body: IExpense) => {
  const { description, amount, currency, date, type, paidBy, groupId, splits } =
    body;
  const member = await GroupMemberModel.findOne({ groupId, userId });
  const group = await GroupModel.findOne({ _id: groupId });
  if (!group || !member) {
    throw new NotFoundException("Group not found or user is not a member");
  }

  const expense = await ExpenseModel.create({
    description,
    amount,
    currency: currency || "VND",
    date: new Date(date),
    type,
    paidBy,
    groupId,
    createdBy: userId,
    splits,
  });
  return {
    message: "Expense created in group successfully",
    data: expense,
  };
};

export const getExpenseGroupByGroupId = async (groupId: string, userId: string) => {
  const expenses = await ExpenseModel.find({ groupId, userId });
  return {
    message: "Expenses retrieved successfully",
    data: expenses,
  };
}
