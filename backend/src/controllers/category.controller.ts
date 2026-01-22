import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import categoryService from "../services/category.service";
import { BadRequestException } from "../utils/appError";

const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new BadRequestException("User ID is missing in request");
  }

  const response = await categoryService.getAllCategories(userId);
  res.status(200).json(response);
});

const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { name, type, icon } = req.body;

  if (!userId) {
    throw new BadRequestException("User ID is missing in request");
  }

  const response = await categoryService.createCategory(
    userId,
    name,
    type,
    icon,
  );
  res.status(201).json(response);
});

const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new BadRequestException("User ID is missing in request");
  }
  const { name, type, icon } = req.body;

  const response = await categoryService.updateCategory(
    userId,
    name,
    type,
    icon,
  );
  res.status(200).json(response);
});

const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { name } = req.body;

  if (!userId) {
    throw new BadRequestException("User ID is missing in request");
  }

  const response = await categoryService.deleteCategory(userId, name);
  res.status(200).json(response);
});

export default {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
