import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { connectRedis } from "./config/redis.config";
import { errorHandler } from "./middlewares/errorHandler.middeware";
import setupRoutes from "./routes/index.route";
import http from "http";
import { initSocket } from "./socket";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  }),
);
console.log("CORS configured for origin:", config.FRONTEND_ORIGIN);
app.use(cookieParser());

setupRoutes(app);

app.use((req, res) => {
  return res.status(404).json({
    message: "Route not found",
  });
});

app.use(errorHandler);

connectRedis();

const server = http.createServer(app);
initSocket(server);
server.listen(config.PORT, async () => {
    console.log(
      `Server listening on port ${config.PORT} in ${config.NODE_ENV}`,
    );
    await connectDatabase();
});

// app.listen(config.PORT, async () => {
//   console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
//   await connectDatabase();
// });
