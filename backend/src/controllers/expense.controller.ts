import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import * as expenseService from "../services/expense.service";
import { BadRequestException } from "../utils/appError";

const getExpenses = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new BadRequestException("User ID is missing in request");
  }

  const response = await expenseService.getExpenses(userId, req.query);
  res.status(200).json(response);
});

const createExpense = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new BadRequestException("User ID is missing in request");
  }
  const response = await expenseService.createExpense(userId, req.body);
  res.status(201).json(response);
});

const updateExpense = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params?.id) ? req.params.id[0] : req.params?.id;

  const userId = req.user?.id;

  if (!userId) {
    throw new BadRequestException("User ID is missing in request");
  }

  if (!id) {
    throw new BadRequestException("Expense ID is missing in request");
  }

  const response = await expenseService.updateExpense(userId, id, req.body);
  res.status(200).json(response);
});

const deleteExpense = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params?.id) ? req.params.id[0] : req.params?.id;

  const userId = req.user?.id;

  if (!userId) {
    throw new BadRequestException("User ID is missing in request");
  }

  if (!id) {
    throw new BadRequestException("Expense ID is missing in request");
  }
  const result = await expenseService.deleteExpense(userId, id);
  res.status(200).json(result);
});

export default {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};
