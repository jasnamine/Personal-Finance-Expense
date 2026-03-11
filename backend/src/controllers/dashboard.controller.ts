import { Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service";
import { BadRequestException } from "../utils/appError";

export const getDashboard = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new BadRequestException("No userId");
  }

  const summary = await dashboardService.getDashboard(userId);
  const categoryStats = await dashboardService.getExpenseByCategory(userId);
  const monthlyStats = await dashboardService.getMonthlyStats(userId);

  res.json({
    summary,
    categoryStats,
    monthlyStats,
  });
};
