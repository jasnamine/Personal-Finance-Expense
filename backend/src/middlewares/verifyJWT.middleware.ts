import { NextFunction, Request, Response } from "express";
import { verifyAccesstoken } from "../utils/jwt";
import { ForbiddenException } from "../utils/appError";

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
      !authHeader ||
      typeof authHeader !== "string" ||
      !authHeader.startsWith("Bearer ")
    ) {
      throw new ForbiddenException("Access token is missing");
    }

    const token = authHeader.split(" ")[1];
    let userId: string;
    try {
      userId = await verifyAccesstoken(token);
    } catch {
      throw new ForbiddenException("Invalid or expired access token");
    }

    req.user = { id: userId };
    next();
  } catch (error) {
    next(error);
  }
};

export default verifyJWT;
