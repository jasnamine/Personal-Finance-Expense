
import { Types } from "mongoose";
import ExpenseModel from "../models/Expense.model";

export const getDashboard = async (userId: string) => {
  const result = await ExpenseModel.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $match: {
        createdBy: new Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: "$category.type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  let income = 0;
  let expense = 0;

  result.forEach((item) => {
    if (item._id === "INCOME") income = item.total;
    if (item._id === "EXPENSE") expense = item.total;
  });

  return {
    totalIncome: income,
    totalExpense: expense,
    balance: income - expense,
  };
};

export const getExpenseByCategory = async (userId: string) => {
  return ExpenseModel.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $match: {
        createdBy: new Types.ObjectId(userId),
        "category.type": "EXPENSE",
      },
    },
    {
      $group: {
        _id: "$category.name",
        total: { $sum: "$amount" },
      },
    },
  ]);
};

export const getMonthlyStats = async (userId: string) => {
  return ExpenseModel.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $match: {
        createdBy: new Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$date" },
          year: { $year: "$date" },
          type: "$category.type",
        },
        total: { $sum: "$amount" },
      },
    },
  ]);
};
