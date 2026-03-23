import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import * as expenseGroupService from "../services/expenseGroup.service";
import { io } from "../socket";
import { BadRequestException } from "../utils/appError";

const getExpenseGroupByGroupId = asyncHandler(
  async (req: Request, res: Response) => {
    const { groupId } = req.params as { groupId: string };
    const userId = req?.user?.id as string;
    if (!userId) {
      throw new BadRequestException("User ID is missing in request");
    }
    const response = await expenseGroupService.getExpenseGroupByGroupId(
      groupId,
      userId,
    );

    return res.status(200).json(response);
  },
);

const createExpenseGroup = asyncHandler(async (req: Request, res: Response) => {
  const userId = req?.user?.id as string;
  const body = req.body;
  if (!userId) {
    throw new BadRequestException("User ID is missing in request");
  }
  const response = await expenseGroupService.createExpenseGroup(userId, body);
  io.to(body.groupId).emit("expense-group:add", response.data);
  return res.status(200).json(response);
});

const updateExpenseGroup = asyncHandler(async (req: Request, res: Response) => {
  const userId = req?.user?.id as string;
  const { expenseId, groupId } = req.params as {
    expenseId: string;
    groupId: string;
  };
  const body = req.body;
  if (!groupId || !expenseId) {
    throw new BadRequestException("Group or Expense ID is missing in request");
  }
  if (!userId) {
    throw new BadRequestException("User ID is missing in request");
  }
  const response = await expenseGroupService.updateExpenseGroup(
    userId,
    groupId,
    expenseId,
    body,
  );
  io.to(groupId).emit("expense-group:update", response.data);
  console.log("Emit expense-group:update to room:", groupId);
  return res.status(200).json(response);
});

const deleteExpenseGroup = asyncHandler(async (req: Request, res: Response) => {
  const userId = req?.user?.id as string;
  const { expenseId, groupId } = req.params as {
    expenseId: string;
    groupId: string;
  };
  if (!userId) {
    throw new BadRequestException("User ID is missing in request");
  }
  const response = await expenseGroupService.deleteExpenseGroup(
    userId,
    expenseId,
    groupId,
  );
  io.to(groupId).emit("expense-group:delete", response.data);
  return res.status(200).json(response);
});

export default {
  getExpenseGroupByGroupId,
  createExpenseGroup,
  updateExpenseGroup,
  deleteExpenseGroup,
};
