import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import * as groupMemberService from "../services/groupMember.service";
import { io } from "../socket";
import { BadRequestException } from "../utils/appError";

const getMembersByGroupId = asyncHandler(
  async (req: Request, res: Response) => {
    const { groupId } = req.params as { groupId: string };
    if (!groupId) {
      throw new BadRequestException("Group ID is missing in request");
    }
    const response = await groupMemberService.getMembersByGroupId(groupId);
    return res.status(200).json(response);
  },
);

const addMember = asyncHandler(async (req: Request, res: Response) => {
  const { groupId, email, role } = req.body;
  const response = await groupMemberService.addMember(groupId, email, role);
  io.to(groupId).emit("member:added", response.data);
  return res.status(201).json(response);
});

const updateMemberRole = asyncHandler(async (req: Request, res: Response) => {
  const { groupId, userId, role } = req.body;
  const response = await groupMemberService.updateMemberRole(
    groupId,
    userId,
    role,
  );
  io.to(groupId).emit("member:updated", response.data);
  return res.status(200).json(response);
});

const deleteMember = asyncHandler(async (req: Request, res: Response) => {
  const { groupId } = req.params as { groupId: string };
  const { userId } = req.body;
  const response = await groupMemberService.deleteMember(groupId, userId);
  io.to(groupId).emit("member:deleted", { userId: userId });
  return res.status(200).json(response);
});

const leaveGroup = asyncHandler(async (req: Request, res: Response) => {
  const { groupId } = req.params as { groupId: string };

  const userId = req.user?.id;

  if (!groupId) {
       throw new BadRequestException("Group ID is missing in request");
  }

  if (!userId) {
      throw new BadRequestException("User ID is missing in request");
  }

  const response = await groupMemberService.leaveGroup(groupId, userId);

  return res.status(200).json(response);
});

export {
  addMember,
  deleteMember,
  getMembersByGroupId,
  leaveGroup,
  updateMemberRole,
};
