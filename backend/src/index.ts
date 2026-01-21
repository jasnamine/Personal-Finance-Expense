import cors from "cors";
import "dotenv/config";
import express from "express";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { connectRedis } from "./config/redis.config";
import setupRoutes from "./routes/index.route";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  }),
);

setupRoutes(app);

app.use((req, res) => {
  return res.send("404 not found");
});


connectRedis();

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
