import { Router } from "express";
import userController from "../controllers/user.controller";
import verifyJWT from "../middlewares/verifyJWT.middleware";

const router = Router();

router.use(verifyJWT);

router.put("/", userController.updateProfile);

export default router;
