import Expense from "../models/Expense.model";
import { NotFoundException, BadRequestException } from "../utils/appError";

export const findExpenses = async (userId: string, query: any) => {
  const { startDate, endDate, category, minAmount, maxAmount } = query;

  const filter: any = { createdBy: userId, groupId: null };

  if (startDate) filter.date = { $gte: new Date(startDate) };
  if (endDate) filter.date = { ...filter.date, $lte: new Date(endDate) };
  if (category) filter.categoryId = category;

  if (minAmount !== undefined)
    filter.amount = { ...filter.amount, $gte: Number(minAmount) };

  if (maxAmount !== undefined)
    filter.amount = { ...filter.amount, $lte: Number(maxAmount) };

  const expenses = await Expense.find(filter)
    .populate("categoryId", "name type icon")
    .sort({ date: -1 });

  return {
    message: "Expenses fetched successfully",
    data: expenses,
  };
};

export const createExpense = async (userId: string, body: any) => {
  const { amount, currency, date, description, type, categoryId } = body;

  if (!amount || !date || !type) {
    throw new BadRequestException("Missing required fields");
  }

  const expense = await Expense.create({
    amount,
    currency: currency || "VND",
    date: new Date(date),
    description,
    type,
    paidBy: userId,
    createdBy: userId,
    categoryId,
    groupId: null,
  });

  return {
    message: "Expense created successfully",
    data: expense,
  };
};

export const updateExpense = async (
  userId: string,
  expenseId: string,
  body: any,
) => {
  const expense = await Expense.findOne({
    _id: expenseId,
    createdBy: userId,
    groupId: null,
  });

  if (!expense) {
    throw new NotFoundException("Expense not found");
  }

  await Expense.updateOne(
    { _id: expenseId, createdBy: userId, groupId: null },
    { $set: body },
  );

  return {
    message: "Expense updated successfully",
  };
};

export const deleteExpense = async (userId: string, expenseId: string) => {
  const expense = await Expense.findOne({
    _id: expenseId,
    createdBy: userId,
    groupId: null,
  });

  if (!expense) {
    throw new NotFoundException("Expense not found");
  }

  await Expense.deleteOne({
    _id: expenseId,
    createdBy: userId,
    groupId: null,
  });

  return {
    message: "Expense deleted successfully",
  };
};
