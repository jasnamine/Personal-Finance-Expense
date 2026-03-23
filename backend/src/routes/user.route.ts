import { Router } from "express";
import userController from "../controllers/user.controller";
import verifyJWT from "../middlewares/verifyJWT.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateProfileSchema } from "../validation/user.validation";

const router = Router();

router.use(verifyJWT);

router.put("/", validate(updateProfileSchema), userController.updateProfile);

export default router;
