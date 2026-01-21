import { Express } from "express";
import authRoute from "./auth.route";

const setupRoutes = (app: Express) => {
  app.use("/api/v1/auth", authRoute);
};

export default setupRoutes;
