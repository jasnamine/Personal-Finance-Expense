import { Router } from "express";
import categoryController from "../controllers/category.controller";
import { validate } from "../middlewares/validate.middleware";
import verifyJWT from "../middlewares/verifyJWT.middleware";
import {
  createCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
} from "../validation/category.validation";

const router = Router();

router.use(verifyJWT); 

router.get("/", categoryController.getAllCategories);

router.post(
  "/",
  validate(createCategorySchema),
  categoryController.createCategory,
);

router.put(
  "/:categoryId",
  validate(updateCategorySchema),
  categoryController.updateCategory,
);

router.delete(
  "/:categoryId",
  validate(deleteCategorySchema),
  categoryController.deleteCategory,
);

export default router;
