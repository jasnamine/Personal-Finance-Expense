import authController from "../controllers/auth.controller";
import verifyJWT from "../middlewares/verifyJWT.middleware";
import express from "express";
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.handleRefreshToken);
router.post("/logout", verifyJWT, authController.logout);

export default router;