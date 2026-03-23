import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import * as settlementService from "../services/settlement.service";
import { io } from "../socket";
import { BadRequestException } from "../utils/appError";

const getSuggestedSettlements = asyncHandler(
  async (req: Request, res: Response) => {
    const { groupId } = req.params as { groupId: string };
    const userId = req.user?.id;
    if (!userId) {
     throw new BadRequestException("User ID is missing in request");
    }
    const response = await settlementService.getSuggestedSettlements(
      userId,
      groupId,
    );

    res.status(200).json(response);
  },
);

const settleDebt = asyncHandler(async (req: Request, res: Response) => {
  const { groupId } = req.params as { groupId: string };
  const userId = req.user?.id;
  if (!userId) {
     throw new BadRequestException("User ID is missing in request");
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

export default {
  getSuggestedSettlements,
  settleDebt,
};
