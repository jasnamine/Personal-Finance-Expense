import { Request, Response } from "express";
import authService from "../services/auth.service";

const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    const response = await authService.registerUser(email, password, username);
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const response = await authService.loginUser(req, res);
    res.status(200).json(response);
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};

const handleRefreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new Error("No refresh token provided");
    }

    const response = await authService.handleRefreshToken(req, res);
    res.status(200).json(response);
  } catch (error) {
    throw error;
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new Error("No refresh token provided");
    }

    const response = await authService.logout(req, res);
    res.status(200).json(response);
  } catch (error) {
    throw error;
  }
};

export default {
  register,
  login,
  handleRefreshToken,
  logout,
};
