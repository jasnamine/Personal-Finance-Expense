import { Router } from "express";
import verifyJWT from "../middlewares/verifyJWT.middleware";

import expenseGroupController from "../controllers/expenseGroup.controller";
import { validate } from "../middlewares/validate.middleware";
import { createExpenseSchema, expenseIdParamSchema } from "../validation/expenseGroup.validation";

const router = Router();

router.use(verifyJWT);

router.get("/:groupId", expenseGroupController.getExpenseGroupByGroupId);
router.post("/", validate(createExpenseSchema), expenseGroupController.createExpenseGroup);
router.put(
  "/groups/:groupId/expenses/:expenseId",
  validate(expenseIdParamSchema),
  expenseGroupController.updateExpenseGroup,
);
router.delete(
  "/groups/:groupId/expenses/:expenseId",
  validate(expenseIdParamSchema),
  expenseGroupController.deleteExpenseGroup,
);

export default router;
