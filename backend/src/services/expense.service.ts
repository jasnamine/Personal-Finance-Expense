import { TRANSACTION_TYPE } from "../enums/TransactionType.enum";
import Expense, { IExpense } from "../models/Expense.model";
import { BadRequestException, NotFoundException } from "../utils/appError";
interface ExpenseQueryParams {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: "INCOME" | "EXPENSE";
  search?: string;
  page?: string | number;
  limit?: string | number;
}

export const findExpenses = async (
  userId: string,
  query: ExpenseQueryParams,
) => {
  const {
    startDate,
    endDate,
    categoryId,
    type,
    search,
    page = 1,
    limit = 10,
  } = query;

  const filter: any = { createdBy: userId, groupId: null };
  if (startDate) {
    filter.date = { $gte: new Date(startDate) };
  }

  if (endDate) {
    filter.date = { ...filter.date, $lte: new Date(endDate) };
  }

  if (categoryId) {
    filter.categoryId = categoryId;
  }

  if (type) {
    if (!Object.values(TRANSACTION_TYPE).includes(type)) {
      throw new BadRequestException("Type phải là INCOME hoặc EXPENSE");
    }
    filter.type = type;
  }

  if (search && search.trim()) {
    filter.description = { $regex: search.trim(), $options: "i" };
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);

  if (isNaN(pageNum) || pageNum < 1)
    throw new BadRequestException("Page phải là số nguyên dương");
  if (isNaN(limitNum) || limitNum < 1)
    throw new BadRequestException("Limit phải là số nguyên dương");

  const skip = (pageNum - 1) * limitNum;

  const expenses = await Expense.find(filter)
    .populate("categoryId", "name type icon")
    .sort({ date: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Expense.countDocuments(filter);

  return {
    message: "Expenses fetched successfully",
    data: expenses,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  };
};

export const createExpense = async (userId: string, body: IExpense) => {
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
  body: IExpense,
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

export const getExpenseSummary = async (
  userId: string,
  query: { startDate?: string; endDate?: string },
) => {
  const filter: any = { createdBy: userId, groupId: null };

  if (query.startDate) filter.date = { $gte: new Date(query.startDate) };
  if (query.endDate)
    filter.date = { ...filter.date, $lte: new Date(query.endDate) };

  const stats = await Expense.aggregate([
    { $match: filter },
    { $group: { _id: "$type", total: { $sum: "$amount" } } },
  ]);

  const income =
    stats.find((s) => s._id === TRANSACTION_TYPE.INCOME)?.total || 0;
  const expense =
    stats.find((s) => s._id === TRANSACTION_TYPE.EXPENSE)?.total || 0;

  const categoryBreakdown = await Expense.aggregate([
    { $match: { ...filter, type: TRANSACTION_TYPE.EXPENSE } },
    { $group: { _id: "$categoryId", total: { $sum: "$amount" } } },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    { $project: { name: "$category.name", value: "$total" } },
  ]);

  return {
    message: "Summary fetched successfully",
    data: {
      income,
      expense,
      balance: income - expense,
      categoryBreakdown,
    },
  };
};


