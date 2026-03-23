import { Types } from "mongoose";
import { SplitType } from "../enums/SplitType";
import ExpenseModel, { IExpense } from "../models/Expense.model";
import GroupMemberModel from "../models/GroupMember.model";
import SettlementModel, { ISettlement } from "../models/Settlement.model";
import { BadRequestException, NotFoundException } from "../utils/appError";
import UserModel from "../models/User.model";

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
    const base = Math.floor((amount / splits.length) * 100) / 100;

    let remaining = amount;

    return splits.map((s, index) => {
      const value =
        index === splits.length - 1 ? Number(remaining.toFixed(2)) : base;

      remaining -= value;

      return {
        userId: s.userId,
        value,
        splitType,
      };
    });
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

export const calculateGroupBalances = (
  expenses: IExpense[],
  settlements: ISettlement[],
) => {
  const balances: Record<string, number> = {};

  for (const expense of expenses) {
    if (!expense.paidBy) {
      throw new Error("Expense missing paidBy");
    }

    if (!expense.splits) {
      throw new Error("Expense missing splits");
    }
    const payer = expense.paidBy.toString();

    balances[payer] = (balances[payer] || 0) + expense.amount;

    for (const split of expense.splits) {
      const user = split.userId.toString();

      balances[user] = (balances[user] || 0) - split.value;
    }
  }

  for (const s of settlements) {
    const from = s.fromUserId.toString();
    const to = s.toUserId.toString();

    balances[from] = (balances[from] || 0) + s.amount;
    balances[to] = (balances[to] || 0) - s.amount;
  }

  return balances;
};

export const getGroupBalances = async (userId: string, groupId: string) => {
  const user = await GroupMemberModel.findOne({ userId });
  if (!user) {
    throw new NotFoundException("Member not found in group");
  }
  const expenses = await ExpenseModel.find({ groupId });
  const settlements = await SettlementModel.find({ groupId });

  const balances = calculateGroupBalances(expenses, settlements);
  const userIds = Object.keys(balances);

  const users = await UserModel.find({
    _id: { $in: userIds },
  }).select("email");

  const emailMap = {} as any;
  users.forEach((u) => {
    emailMap[u._id.toString()] = u.email;
  });

  const result = Object.entries(balances).map(([userId, balance]) => ({
    userId,
    email: emailMap[userId],
    balance,
  }));

  return {
    message: "Fetch balances successfully",
    data: result,
  };
};
