import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import * as balanceService from "../services/balance.service";
import { BadRequestException } from "../utils/appError";

const getBalances = asyncHandler(async (req: Request, res: Response) => {
  const { groupId } = req.params as { groupId: string };
  const userId = req.user?.id;
  if (!userId) {
    throw new BadRequestException("User ID is missing in request");
  }

  const response = await balanceService.getGroupBalances(userId, groupId);

  res.status(200).json(response);
});

export default {
  getBalances,
};
