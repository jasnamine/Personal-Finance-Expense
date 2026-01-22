import express from "express";
import authController from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import verifyJWT from "../middlewares/verifyJWT.middleware";
import { loginSchema, registerSchema } from "../validation/auth.validation";
const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh-token", authController.handleRefreshToken);
router.post("/logout", verifyJWT, authController.logout);

export default router;
