import { Router } from "express";
import balanceController from "../controllers/balance.controller";
import { validate } from "../middlewares/validate.middleware";
import verifyJWT from "../middlewares/verifyJWT.middleware";
import { getBalancesSchema } from "../validation/balance.validation";

const router = Router();

router.use(verifyJWT);

router.get(
  "/:groupId",
  validate(getBalancesSchema),
  balanceController.getBalances,
);

export default router;
