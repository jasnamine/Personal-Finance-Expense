import Category from "../models/Category.model";

const getAllCategories = async (userId: string) => {
  try {
    const categories = await Category.find({ user: userId });
    return categories;
  } catch (error) {
    throw error;
  }
};

const createCategory = async (
  userId: string,
  name: string,
  type: string,
  icon: string,
) => {
  try {
    const existingCategory = await Category.findOne({ user: userId, name });
    if (existingCategory) {
      throw new Error("Category with this name already exists");
    }
    const newCategory = new Category({ user: userId, name, type, icon });
    await newCategory.save();
    return newCategory;
  } catch (error) {
    throw error;
  }
};

const updateCategory = async (
  userId: string,
  name: string,
  type: string,
  icon: string,
) => {
  try {
    const existingCategory = await Category.findOne({ user: userId, name });
    if (!existingCategory) {
      throw new Error("Category not found");
    }

    const updateCategory = await Category.updateOne(
      { user: userId, name },
      { $set: { type, icon, name } },
    );
    return updateCategory;
  } catch (error) {}
};

const deleteCategory = async (userId: string, name: string) => {
  try {
    const existingCategory = await Category.findOne({ user: userId, name });
    if (!existingCategory) {
      throw new Error("Category not found");
    }

    const deleteCategory = await Category.deleteOne({ user: userId, name });
    return deleteCategory;
  } catch (error) {
    throw error;
  }
};

export { createCategory, deleteCategory, getAllCategories, updateCategory };
