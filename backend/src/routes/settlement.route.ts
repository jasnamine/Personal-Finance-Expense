import { Router } from "express";
import  settlementController from "../controllers/settlement.controller";
import verifyJWT from "../middlewares/verifyJWT.middleware";
import { validate } from "../middlewares/validate.middleware";
import { getSettlementParamSchema, settleDebtSchema } from "../validation/settlement.validation";

const router = Router();

router.use(verifyJWT);

router.get("/:groupId", validate(getSettlementParamSchema), settlementController.getSuggestedSettlements);
router.post("/:groupId", validate(settleDebtSchema), settlementController.settleDebt)

export default router;
