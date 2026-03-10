import ExpenseModel from "../models/Expense.model";
import GroupMemberModel from "../models/GroupMember.model";
import {
  default as Settlement,
  default as SettlementModel,
} from "../models/Settlement.model";
import { NotFoundException } from "../utils/appError";
import { calculateGroupBalances } from "./balance.service";

export const simplifyDebts = (balances: Record<string, number>) => {
  const creditors: { user: string; amount: number }[] = [];
  const debtors: { user: string; amount: number }[] = [];

  for (const [user, balance] of Object.entries(balances)) {
    if (balance > 0) creditors.push({ user, amount: balance });
    if (balance < 0) debtors.push({ user, amount: -balance });
  }

  const settlements = [];

  while (creditors.length && debtors.length) {
    const creditor = creditors[0];
    const debtor = debtors[0];

    const amount = Math.min(creditor.amount, debtor.amount);

    settlements.push({
      fromUserId: debtor.user,
      toUserId: creditor.user,
      amount: Number(amount.toFixed(2)),
    });

    creditor.amount -= amount;
    debtor.amount -= amount;

    if (creditor.amount < 0.01) creditors.shift();
    if (debtor.amount < 0.01) debtors.shift();
  }
  return settlements;
};

export const createSettlement = async (
  userId: string,
  groupId: string,
  fromUserId: string,
  toUserId: string,
  amount: number,
  method?: string,
) => {
  const user = await GroupMemberModel.findOne({ userId });
  if (!user) {
    throw new NotFoundException("Member not found in group");
  }

  const settlement = await Settlement.create({
    groupId,
    fromUserId,
    toUserId,
    amount,
    method,
  });

  return {
    message: "Settlement recorded",
    data: settlement,
  };
};

export const getSuggestedSettlements = async (
  userId: string,
  groupId: string,
) => {
  const user = await GroupMemberModel.findOne({ userId });
  if (!user) {
    throw new NotFoundException("Member not found in group");
  }
  const expenses = await ExpenseModel.find({ groupId });
  const settlements = await SettlementModel.find({ groupId });

  const balances = calculateGroupBalances(expenses, settlements);

  const suggestions = simplifyDebts(balances);

  return {
    message: "Fetch suggestions successfully",
    data: suggestions,
  };
};
