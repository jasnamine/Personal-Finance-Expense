import { Router } from "express";
import * as settlementController from "../controllers/settlement.controller";
import verifyJWT from "../middlewares/verifyJWT.middleware";

const router = Router();

router.use(verifyJWT);

router.get("/:groupId", settlementController.getSuggestedSettlements);
router.post("/:groupId", settlementController.settleDebt)

export default router;
