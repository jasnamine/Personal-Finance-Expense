import { NextFunction, Request, Response } from "express";
import { verifyAccesstoken } from "../utils/jwt";

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
      !authHeader ||
      typeof authHeader !== "string" ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.sendStatus(401); 
    }

    const token = authHeader.split(" ")[1];
    const userId = await verifyAccesstoken(token);
    if (!userId) {
      return res.sendStatus(403);
    }
    req.user = userId;
    next();
  } catch (error) {
    return res.sendStatus(403); 
  }
};

export default verifyJWT;
