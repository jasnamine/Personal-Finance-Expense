import Expense from "../models/Expense.model";

const findExpenses = async (userId: string, queryParams: any = {}) => {
  try {
    const { startDate, endDate, category, minAmount, maxAmount } = queryParams;

    const filter: any = { user: userId, groupId: null };
    if (startDate) filter.date = { $gte: new Date(startDate) };
    if (endDate) filter.date = { ...filter.date, $lte: new Date(endDate) };
    if (category) filter.categoryId = category;
    if (minAmount !== undefined)
      filter.amount = { ...filter.amount, $gte: minAmount };
    if (maxAmount !== undefined)
      filter.amount = { ...filter.amount, $lte: maxAmount };
    return await Expense.find(filter)
      .populate("categoryId", "name type icon")
      .sort({ date: -1 });
  } catch (error) {
    throw error;
  }
};

const createExpense = async (userId: string, expenseData: any) => {
  try {
    const { amount, currency, date, description, type, categoryId } =
      expenseData;
    const expense = await Expense.create({
      amount,
      currency: currency || "VND",
      date: new Date(date),
      description,
      type,
      paidBy: userId,
      createdBy: userId,
      categoryId,
      groupId: null, // personal mode
    });
    return expense;
  } catch (error) {
    throw error;
  }
};

const updateExpense = async (
  userId: string,
  expenseId: string,
  expenseData: any,
) => {
  try {
    const existingExpense = await Expense.findOne({
      _id: expenseId,
      createdBy: userId,
      groupId: null,
    });
    if (!existingExpense) {
      throw new Error("Expense not found");
    }

    const updatedExpense = await Expense.updateOne(
      { _id: expenseId, createdBy: userId, groupId: null },
      { $set: expenseData },
    );
    return updatedExpense;
  } catch (error) {
    throw error;
  }
};

const deleteExpense = async (userId: string, expenseId: string) => {
  try {
    const existingExpense = await Expense.findOne({
      _id: expenseId,
      createdBy: userId,
      groupId: null,
    });
    if (!existingExpense) {
      throw new Error("Expense not found");
    }

    const deletedExpense = await Expense.deleteOne({
      _id: expenseId,
      createdBy: userId,
      groupId: null,
    });
    return deletedExpense;
  } catch (error) {
    throw error;
  }
};

export {
  findExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};
