import { Request, Response } from "express";
import { redisClient } from "../config/redis.config";
import User from "../models/User.model";
import {
  signAccesstoken,
  signRefreshtoken,
  verifyRefreshtoken,
} from "../utils/jwt";

const registerUser = async (
  email: string,
  username: string,
  password: string,
) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser = new User({ email, username, password });
    await newUser.save();
    return {
      message: "User registered successfully",
    };
  } catch (error) {
    throw error;
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const cookies = req.cookies;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid email or password");
    }

    const accessToken = await signAccesstoken(user.id);
    const newRefreshToken = await signRefreshtoken(user.id);

    const redisKey = `refreshToken:${user.id}`;
    const storedTokens = await redisClient.get(redisKey);
    let tokenArray: string[] = storedTokens ? JSON.parse(storedTokens) : [];

    let newRefreshTokenArray = !cookies?.refreshToken
      ? tokenArray
      : tokenArray.filter((rt) => rt !== cookies.refreshToken);

    if (cookies?.refreshToken) {
      const refreshToken = cookies.refreshToken;

      // Kiểm tra xem token có tồn tại không (reuse detection)
      const tokenExists = tokenArray.includes(refreshToken);

      if (!tokenExists) {
        newRefreshTokenArray = [];
      }

      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
    }

    // Thêm token mới vào mảng
    const finalTokens = [...newRefreshTokenArray, newRefreshToken];
    await redisClient.set(redisKey, JSON.stringify(finalTokens), {
      EX: 60 * 60 * 24,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      message: "User logged in successfully",
      data: accessToken,
    };
  } catch (error) {
    throw error;
  }
};

const handleRefreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    let userId: string;
    try {
      userId = await verifyRefreshtoken(refreshToken);
    } catch (error) {
      throw new Error("Invalid refresh token");
    }

    const redisKey = `refreshToken:${userId}`;

    const storedTokens = await redisClient.get(redisKey);
    let tokenArray: string[] = storedTokens ? JSON.parse(storedTokens) : [];

    if (!tokenArray.includes(refreshToken)) {
      await redisClient.del(redisKey);
      return res.sendStatus(403);
    }

    // Loại bỏ token cũ
    const newRefreshTokenArray = tokenArray.filter((rt) => rt !== refreshToken);
    const newRefreshToken = await signRefreshtoken(userId);
    const newAccessToken = await signAccesstoken(userId);

    const finalTokens = [...newRefreshTokenArray, newRefreshToken];
    await redisClient.set(redisKey, JSON.stringify(finalTokens), {
      EX: 60 * 60 * 24,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    throw error;
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    let userId: string;
    try {
      userId = await verifyRefreshtoken(refreshToken);
    } catch (error) {
      // Token lỗi → cứ xoá cookie rồi trả về
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.sendStatus(204);
    }

    const redisKey = `refreshToken:${userId}`;

    // Lấy danh sách token từ Redis
    const storedTokens = await redisClient.get(redisKey);
    let tokenArray: string[] = storedTokens ? JSON.parse(storedTokens) : [];

    //Nếu token có trong Redis → xoá nó
    if (tokenArray.includes(refreshToken)) {
      const newTokens = tokenArray.filter((rt) => rt !== refreshToken);

      if (newTokens.length === 0) {
        // Nếu không còn token nào → xoá luôn key
        await redisClient.del(redisKey);
      } else {
        // Nếu còn token khác → cập nhật lại Redis
        await redisClient.set(redisKey, JSON.stringify(newTokens), {
          EX: 60 * 60 * 24,
        });
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return {
      message: "Logged out successfully",
    };
  } catch (error) {
    throw error;
  }
};

export default {
  registerUser,
  loginUser,
  handleRefreshToken,
  logout,
};
