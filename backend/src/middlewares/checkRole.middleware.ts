import GroupMember from "../models/GroupMember.model.js";

const checkRole =
  async (allowedRoles: string[]) => async (req: any, res: any, next: any) => {
    try {
      const userId = req.user;
      const groupId = req.params.groupId;

      const groupMember = await GroupMember.findOne({
        user: userId,
        group: groupId,
      });
      if (!groupMember) {
        return res.sendStatus(403);
      }

      if (!allowedRoles.includes(groupMember.role)) {
        return res
          .sendStatus(403)
          .json({ message: "Access denied: insufficient permissions" });
      }

      next();
    } catch (error) {
      return res.sendStatus(500);
    }
  };

export default checkRole;
