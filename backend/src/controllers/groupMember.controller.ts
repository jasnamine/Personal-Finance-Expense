import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import * as groupMemberService from "../services/groupMember.service";
import { io } from "../socket";

const addMember = asyncHandler(async (req: Request, res: Response) => {
  const { groupId, memberId, role } = req.body;
  const response = await groupMemberService.addMember(groupId, memberId, role);
  io.to(groupId).emit("member:added", response.data);
  return res.status(201).json(response);
});

const updateMemberRole = asyncHandler(async (req: Request, res: Response) => {
  const { groupId, memberId, newRole } = req.body;
  const response = await groupMemberService.updateMemberRole(
    groupId,
    memberId,
    newRole,
  );
  io.to(groupId).emit("member:updated", response.data);
  return res.status(200).json(response);
});

const deleteMember = asyncHandler(async (req: Request, res: Response) => {
  const { groupId, memberId } = req.body;
  const response = await groupMemberService.deleteMember(groupId, memberId);
  io.to(groupId).emit("member:deleted", { userId: memberId });
  return res.status(200).json(response);
});

export { addMember, deleteMember, updateMemberRole };
