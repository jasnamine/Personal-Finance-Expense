import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";

import verifyJWT from "../middlewares/verifyJWT.middleware";


const router = Router();

router.use(verifyJWT);

router.get("/", dashboardController.getDashboard);


export default router;
