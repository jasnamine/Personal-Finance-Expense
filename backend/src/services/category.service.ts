import { TransactionType } from "../enums/TransactionType.enum";
import Category from "../models/Category.model";
import { BadRequestException, NotFoundException } from "../utils/appError";

const getAllCategories = async (userId: string) => {
  const categories = await Category.find({ user: userId });
  return {
    message: "Categories fetched successfully",
    data: categories,
  };
};

const createCategory = async (
  userId: string,
  name: string,
  type: string,
  icon: string,
) => {
  const existingCategory = await Category.findOne({ user: userId, name });
  if (existingCategory) {
    throw new BadRequestException("Category with this name already exists");
  }

  const newCategory = new Category({ user: userId, name, type, icon });
  await newCategory.save();

  return {
    message: "Category created successfully",
    data: newCategory,
  };
};

const updateCategory = async (
  userId: string,
  name: string,
  type: TransactionType,
  icon: string,
) => {
  try {
    const category = await Category.findOne({ user: userId, name });
    if (!category) {
      throw new NotFoundException("Category not found");
    }

    category.name = name;
    category.type = type;
    category.icon = icon;
    await category.save();

    return {
      message: "Category updated successfully",
      data: category,
    };
  } catch (error) {}
};

const deleteCategory = async (userId: string, name: string) => {
  try {
    const category = await Category.findOne({ user: userId, name });
    if (!category) {
      throw new NotFoundException("Category not found");
    }

    await Category.deleteOne({ user: userId, name });

    return {
      message: "Category deleted successfully",
    };
  } catch (error) {
    throw error;
  }
};

export default { createCategory, deleteCategory, getAllCategories, updateCategory };
