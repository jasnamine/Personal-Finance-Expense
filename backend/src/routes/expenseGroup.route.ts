import { Router } from "express";
import verifyJWT from "../middlewares/verifyJWT.middleware";

import * as expenseGroupController from "../controllers/expenseGroup.controller";

const router = Router();

router.use(verifyJWT);

router.get("/:groupId", expenseGroupController.getExpenseGroupByGroupId);
router.post("/", expenseGroupController.createExpenseGroup);

export default router;
