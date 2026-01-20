import cors from "cors";
import "dotenv/config";
import express from "express";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  }),
);

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
