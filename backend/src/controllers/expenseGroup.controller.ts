import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import * as expenseGroupService from "../services/expenseGroup.service";
import { BadRequestException } from "../utils/appError";

export const getExpenseGroupByGroupId = asyncHandler(
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
    res.status(200).json(response);
  },
);

export const createExpenseGroup = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req?.user?.id as string;
    const body = req.body;
    if (!userId) {
      throw new BadRequestException("User ID is missing in request");
    }
    const response = await expenseGroupService.createExpenseGroup(userId, body);
    res.status(200).json(response);
  },
);
