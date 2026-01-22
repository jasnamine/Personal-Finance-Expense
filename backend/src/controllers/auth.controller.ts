import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import authService from "../services/auth.service";
import { BadRequestException } from "../utils/appError";

const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, username } = req.body;
  const response = await authService.registerUser(email, password, username);
  res.status(201).json(response);
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const oldRefreshToken = req.cookies?.refreshToken;
  const { email, password } = req.body;
  const response = await authService.loginUser(
    email,
    password,
    oldRefreshToken,
  );

  if (oldRefreshToken) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
  }

  res.cookie("refreshToken", response.data.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json(response);
});

const handleRefreshToken = asyncHandler( async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new BadRequestException("No refresh token provided");
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  const response = await authService.handleRefreshToken(req);

  res.cookie("refreshToken", response.data.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json(response);
});

const logout = asyncHandler( async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new BadRequestException("No refresh token provided");
    }

    const response = await authService.logout(req);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json(response);
});

export default {
  register,
  login,
  handleRefreshToken,
  logout,
};
