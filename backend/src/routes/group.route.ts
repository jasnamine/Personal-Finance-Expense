import express from "express";
import  groupController from "../controllers/group.controller";
import { validate } from "../middlewares/validate.middleware";
import verifyJWT from "../middlewares/verifyJWT.middleware";
import {
  createGroupSchema,
  groupIdParamSchema,
  updateGroupSchema,
} from "../validation/group.validation";

const router = express.Router();

router.use(verifyJWT);

router.post("/", validate(createGroupSchema), groupController.createGroup);
router.get("/", groupController.getUserGroups);
router.get(
  "/:groupId",
  validate(groupIdParamSchema),
  groupController.getGroupById,
);
router.put(
  "/:groupId",
  validate(updateGroupSchema),
  groupController.updateGroup,
);
router.delete(
  "/:groupId",
  validate(groupIdParamSchema),
  groupController.deleteGroup,
);

router.post("/", validate(createGroupSchema), groupController.createGroup);

export default router;
