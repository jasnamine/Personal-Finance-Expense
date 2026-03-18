import express from "express";
import * as groupController from "../controllers/group.controller";
import { validate } from "../middlewares/validate.middleware";
import verifyJWT from "../middlewares/verifyJWT.middleware";
import { createGroupSchema } from "../validation/group.validation";

const router = express.Router();

router.use(verifyJWT);

router.post("/", validate(createGroupSchema), groupController.createGroup);
router.get("/", groupController.getUserGroups);
router.get("/:groupId", groupController.getGroupById);
router.put("/:groupId", groupController.updateGroup);
router.delete("/:groupId", groupController.deleteGroup);

export default router;
