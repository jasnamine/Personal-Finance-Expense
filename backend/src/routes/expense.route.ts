import { Router } from "express";
import verifyJWT from "../middlewares/verifyJWT.middleware";
import {validate} from "../middlewares/validate.middleware";
import {
  createExpenseSchema,
  updateExpenseSchema,
  expenseQuerySchema,
} from "../validation/expense.validation";
import * as expenseController from "../controllers/expense.controller";

const router = Router();

router.use(verifyJWT);

router.get("/", validate(expenseQuerySchema), expenseController.getExpenses);
router.post(
  "/",
  validate(createExpenseSchema),
  expenseController.createExpense,
);
router.put(
  "/:id",
  validate(updateExpenseSchema),
  expenseController.updateExpense,
);
router.delete("/:id", expenseController.deleteExpense);

export default router;
