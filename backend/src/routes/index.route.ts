import { Express } from "express";
import authRoute from "./auth.route";
import categoryRoute from "./category.route";
import expenseRoute from "./expense.route";
import groupRoute from "./group.route"
import groupMemberRoute from "./groupMember.route";

const setupRoutes = async (app: Express) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/expenses", expenseRoute)
  app.use("/api/v1/groups", groupRoute)
  app.use("/api/v1/group-members", groupMemberRoute)
};

export default setupRoutes;
