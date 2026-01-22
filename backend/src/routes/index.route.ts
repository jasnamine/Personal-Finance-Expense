import { Express } from "express";
import authRoute from "./auth.route";
import categoryRoute from "./category.route";
import expenseRoute from "./expense.route";

const setupRoutes = async (app: Express) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/expenses", expenseRoute)
};

export default setupRoutes;
