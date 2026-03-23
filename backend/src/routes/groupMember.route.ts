import express from "express";
import * as groupMemberController from "../controllers/groupMember.controller";
import verifyJWT from "../middlewares/verifyJWT.middleware";
import { validate } from "../middlewares/validate.middleware";
import { addMemberSchema, memberParamSchema, updateMemberRoleSchema } from "../validation/member.validation";

const router = express.Router();

router.use(verifyJWT);
router.get("/:groupId", validate(memberParamSchema), groupMemberController.getMembersByGroupId);
router.post("/", validate(addMemberSchema), groupMemberController.addMember);
router.put("/:groupId", validate(updateMemberRoleSchema), groupMemberController.updateMemberRole);
router.delete("/:groupId", validate(memberParamSchema), groupMemberController.deleteMember);
router.delete("/leave-group/:groupId", validate(memberParamSchema), groupMemberController.leaveGroup);

export default router;
