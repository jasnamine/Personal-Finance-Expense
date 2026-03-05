import { Types } from "mongoose";
import { SplitType } from "../enums/SplitType";
import { IExpense } from "../models/Expense.model";
import { BadRequestException } from "../utils/appError";

interface SplitInput {
  userId: Types.ObjectId;
  value?: number;
  splitType: SplitType;
}

interface SplitOutput {
  userId: Types.ObjectId;
  value: number;
  splitType: SplitType;
}

export const calculateSplits = (
  amount: number,
  splits: SplitInput[],
  groupMemberIds: string[],
): SplitOutput[] => {
  if (!amount || amount <= 0) {
    throw new BadRequestException("Amount must be greater than 0");
  }

  if (!splits || splits.length === 0) {
    throw new BadRequestException("Splits cannot be empty");
  }

  const splitType = splits[0].splitType;

  if (!splits.every((s) => s.splitType === splitType)) {
    throw new BadRequestException("All splits must have same splitType");
  }

  for (const s of splits) {
    if (!groupMemberIds.includes(s.userId.toString())) {
      throw new BadRequestException("User not in group");
    }
  }

  if (splitType === "EQUAL") {
    const equalValue = Number((amount / splits.length).toFixed(2));

    return splits.map((s) => ({
      userId: s.userId,
      value: equalValue,
      splitType,
    }));
  }

  if (splitType === "EXACT") {
    const totalValue = splits.reduce((sum, s) => sum + (s.value || 0), 0);

    if (Number(totalValue.toFixed(2)) !== Number(amount.toFixed(2))) {
      throw new BadRequestException(
        "Total split amount must equal expense amount",
      );
    }

    return splits.map((s) => ({
      userId: s.userId,
      value: Number((s.value || 0).toFixed(2)),
      splitType,
    }));
  }

  throw new BadRequestException("Invalid split type");
};

export const calculateGroupBalances = (expenses: IExpense[]) => {
  const balances: Record<string, number> = {};

  for (const expense of expenses) {
    if (!expense.paidBy) {
      throw new Error("Expense missing paidBy");
    }

    if (!expense.splits) {
      throw new Error("Expense missing splits");
    }

    const payer = expense.paidBy?.toString();
    balances[payer] = (balances[payer] || 0) + expense.amount;

    for (const split of expense.splits) {
      const user = split.userId.toString();
      balances[user] = (balances[user] || 0) - split.value;
    }
  }

  return balances;
};
