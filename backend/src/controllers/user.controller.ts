import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import userService from "../services/user.service";
import { BadRequestException } from "../utils/appError";

const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { username, currency } = req.body;
  if (!userId) {
    throw new BadRequestException("User ID is missing in request");
  }

  const response = await userService.updateProfile(userId, username, currency);
  res.status(200).json(response);
});

export default {
  updateProfile,
};
