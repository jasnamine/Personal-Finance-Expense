import { Router } from "express";
import * as balanceController from "../controllers/balance.controller";
import verifyJWT from "../middlewares/verifyJWT.middleware";

const router = Router();

router.use(verifyJWT);

router.get("/:groupId", balanceController.getBalances);

export default router;
