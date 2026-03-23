import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import * as groupService from "../services/group.service";
import { BadRequestException } from "../utils/appError";

const createGroup = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new BadRequestException("User ID is missing in request");
  }
  const response = await groupService.createGroup(userId, req.body);
  res.status(201).json(response);
});

const getUserGroups = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new BadRequestException("User ID is missing in request");
  }
  const response = await groupService.getUserGroups(userId);
  res.status(200).json(response);
});

const getGroupById = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params?.groupId)
    ? req.params.groupId[0]
    : req.params?.groupId;

  const userId = req.user?.id;

  if (!userId) {
    throw new BadRequestException("User ID is missing in request");
  }

  if (!id) {
    throw new BadRequestException("Expense ID is missing in request");
  }
  const response = await groupService.getGroupById(userId, id);
  res.status(200).json(response);
});

const deleteGroup = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params?.groupId)
    ? req.params.groupId[0]
    : req.params?.groupId;

  const userId = req.user?.id;

  if (!userId) {
    throw new BadRequestException("User ID is missing in request");
  }

  if (!id) {
    throw new BadRequestException("Expense ID is missing in request");
  }
  const result = await groupService.deleteGroup(userId, id);
  res.status(200).json(result);
});

const updateGroup = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params?.groupId)
    ? req.params.groupId[0]
    : req.params?.groupId;

  const userId = req.user?.id;

  if (!userId) {
    throw new BadRequestException("User ID is missing in request");
  }

  if (!id) {
    throw new BadRequestException("Group ID is missing in request");
  }

  const response = await groupService.updateGroup(userId, id, req.body);

  res.status(200).json(response);
});

export default {
  createGroup,
  getUserGroups,
  getGroupById,
  deleteGroup,
  updateGroup,
};
