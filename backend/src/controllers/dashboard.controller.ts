import { Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service";
import { BadRequestException } from "../utils/appError";

const getDashboard = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new BadRequestException("User ID is missing in request");
  }

  const [summary, categoryStats, monthlyStats] = await Promise.all([
    dashboardService.getDashboard(userId),
    dashboardService.getExpenseByCategory(userId),
    dashboardService.getMonthlyStats(userId),
  ]);

  res.json({
    message: "Fetch dashboard successfully",
    data: {
      summary,
      categoryStats,
      monthlyStats,
    },
  });
};

export default {
  getDashboard,
};
