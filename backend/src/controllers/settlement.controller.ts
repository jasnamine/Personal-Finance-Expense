import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import * as settlementService from "../services/settlement.service";
import { BadRequestException } from "../utils/appError";
import { io } from "../socket";

export const getSuggestedSettlements = asyncHandler(
  async (req: Request, res: Response) => {
    const { groupId } = req.params as { groupId: string };
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException("No userId");
    }
    const response = await settlementService.getSuggestedSettlements(
      userId,
      groupId,
    );

    res.status(200).json(response);
  },
);

export const settleDebt = asyncHandler(async (req: Request, res: Response) => {
  const { groupId } = req.params as { groupId: string };
  const userId = req.user?.id;
  if (!userId) {
    throw new BadRequestException("No userId");
  }
  const { fromUserId, toUserId, amount, method } = req.body;

  const response = await settlementService.createSettlement(
    userId,
    groupId,
    fromUserId,
    toUserId,
    amount,
    method,
  );

  io.to(groupId).emit("settlement:created", response);
  res.status(201).json(response);
});
