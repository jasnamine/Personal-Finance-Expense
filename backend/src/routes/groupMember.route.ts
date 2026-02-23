import express from "express";
import * as groupMemberController from "../controllers/groupMember.controller";
import verifyJWT from "../middlewares/verifyJWT.middleware";

const router = express.Router();

router.use(verifyJWT);
router.post("/member", groupMemberController.addMember);
router.put("/member", groupMemberController.updateMemberRole);
router.delete("/member", groupMemberController.deleteMember);

export default router;
