import express from "express";
import * as groupMemberController from "../controllers/groupMember.controller";
import verifyJWT from "../middlewares/verifyJWT.middleware";

const router = express.Router();

router.use(verifyJWT);
router.get("/:groupId", groupMemberController.getMembersByGroupId);
router.post("/", groupMemberController.addMember);
router.put("/:groupId", groupMemberController.updateMemberRole);
router.delete("/:groupId", groupMemberController.deleteMember);
router.delete("/leave-group/:groupId", groupMemberController.leaveGroup);

export default router;
