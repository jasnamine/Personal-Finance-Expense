import express from "express";
import verifyJWT from "../middlewares/verifyJWT.middleware";
import {validate} from "../middlewares/validate.middleware";
import { createGroupSchema } from "../validation/group.validation";
import * as groupController from "../controllers/group.controller";

const router = express.Router();

router.use(verifyJWT);

router.post("/", validate(createGroupSchema), groupController.createGroup);
router.get("/", groupController.getUserGroups);
router.get("/:groupId", groupController.getGroupById);
router.delete("/:groupId", groupController.deleteGroup);

export default router;
