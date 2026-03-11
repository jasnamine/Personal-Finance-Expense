import { Express } from "express";
import authRoute from "./auth.route";
import balanceRoute from "./balance.route";
import categoryRoute from "./category.route";
import dashboardRoute from "./dashboard.route";
import expenseRoute from "./expense.route";
import expenseGroupRoute from "./expenseGroup.route";
import groupRoute from "./group.route";
import groupMemberRoute from "./groupMember.route";
import settlementRoute from "./settlement.route";

const setupRoutes = async (app: Express) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/expenses", expenseRoute);
  app.use("/api/v1/groups", groupRoute);
  app.use("/api/v1/group-members", groupMemberRoute);
  app.use("/api/v1/expense-groups", expenseGroupRoute);
  app.use("/api/v1/balances", balanceRoute);
  app.use("/api/v1/settlements", settlementRoute);
  app.use("/api/v1/dashboard", dashboardRoute);
};

export default setupRoutes;
