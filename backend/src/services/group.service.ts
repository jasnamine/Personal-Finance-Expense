import { GROUP_ROLE } from "../enums/GroupRole.enum";
import Group from "../models/Group.model";
import GroupMember from "../models/GroupMember.model";

const createGroup = async (userId: string, groupData: any) => {
  try {
    const { name, description, startDate, endDate, baseCurrency } = groupData;
    const group = await Group.create({
      name: name.trim(),
      description: description?.trim(),
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      baseCurrency: baseCurrency || "VND",
      ownerId: userId,
    });

    await GroupMember.create({
      groupId: group._id,
      userId,
      role: GROUP_ROLE.OWNER,
    });

    return group;
  } catch (error) {
    throw error;
  }
};

const getUserGroups = async (userId: string) => {
  try {
    const members = await GroupMember.find({ userId })
      .populate({
        path: "groupId",
        select:
          "name description startDate endDate baseCurrency ownerId createdAt",
      })
      .lean();

    return members.map((m: any) => ({
      ...m.groupId,
      role: m.role,
      _id: m.groupId._id,
    }));
  } catch (error) {
    throw error;
  }
};

const getGroupById = async (userId: string, groupId: string) => {
  try {
    const member = await GroupMember.findOne({
      userId,
      groupId,
    }).populate("groupId");
    if (!member) {
      throw new Error("Group not found or access denied");
    }

    return {
      ...member.groupId,
      role: member.role,
    };
  } catch (error) {}
};

const deleteGroup = async (userId: string, groupId: string) => {
  try {
    const member = await GroupMember.findOne({ userId, groupId });
    if (!member || member.role !== GROUP_ROLE.OWNER) {
      throw new Error("Only group owner can delete the group");
    }

    await Group.deleteOne({ _id: groupId });
    await GroupMember.deleteMany({ groupId });

    return { message: "Group deleted successfully" };
  } catch (error) {
    throw error;
  }
};

export { createGroup, getUserGroups, getGroupById, deleteGroup };
