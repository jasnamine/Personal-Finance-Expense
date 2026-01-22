import { Request } from "express";
import { redisClient } from "../config/redis.config";
import User from "../models/User.model";
import {
  BadRequestException,
  NoContentException,
  UnauthorizedException,
} from "../utils/appError";
import {
  signAccesstoken,
  signRefreshtoken,
  verifyRefreshtoken,
} from "../utils/jwt";

const registerUser = async (
  email: string,
  password: string,
  username: string,
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestException("User already exists");
  }

  const newUser = new User({ email, password, username });
  await newUser.save();
  return {
    message: "User registered successfully",
  };
};

const loginUser = async (
  email: string,
  password: string,
  oldRefreshToken?: string,
) => {
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    throw new UnauthorizedException("Invalid email or password");
  }

  const accessToken = await signAccesstoken(user.id);
  const newRefreshToken = await signRefreshtoken(user.id);

  const redisKey = `refreshToken:${user.id}`;
  const storedTokens = await redisClient.get(redisKey);
  let tokenArray: string[] = storedTokens ? JSON.parse(storedTokens) : [];

  let newRefreshTokenArray = !oldRefreshToken
    ? tokenArray
    : tokenArray.filter((rt) => rt !== oldRefreshToken);

  if (oldRefreshToken) {
    const refreshToken = oldRefreshToken;

    // Kiểm tra xem token có tồn tại không (reuse detection)
    const tokenExists = tokenArray.includes(refreshToken);

    if (!tokenExists) {
      newRefreshTokenArray = [];
    }
  }

  // Thêm token mới vào mảng
  const finalTokens = [...newRefreshTokenArray, newRefreshToken];
  await redisClient.set(redisKey, JSON.stringify(finalTokens), {
    EX: 60 * 60 * 24,
  });

  return {
    message: "User logged in successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken,
    },
  };
};

const handleRefreshToken = async (req: Request) => {
  const refreshToken = req.cookies.refreshToken;

  let userId: string;
  try {
    userId = await verifyRefreshtoken(refreshToken);
  } catch (error) {
    throw new UnauthorizedException("Invalid refresh token");
  }

  const redisKey = `refreshToken:${userId}`;

  const storedTokens = await redisClient.get(redisKey);
  let tokenArray: string[] = storedTokens ? JSON.parse(storedTokens) : [];

  if (!tokenArray.includes(refreshToken)) {
    await redisClient.del(redisKey);
    throw new UnauthorizedException("Refresh token reuse detected");
  }

  // Loại bỏ token cũ
  const newRefreshTokenArray = tokenArray.filter((rt) => rt !== refreshToken);
  const newRefreshToken = await signRefreshtoken(userId);
  const newAccessToken = await signAccesstoken(userId);

  const finalTokens = [...newRefreshTokenArray, newRefreshToken];
  await redisClient.set(redisKey, JSON.stringify(finalTokens), {
    EX: 60 * 60 * 24,
  });

  return {
    message: "Token refreshed successfully",
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
  };
};

const logout = async (req: Request) => {
  const refreshToken = req.cookies.refreshToken;

  let userId: string;
  try {
    userId = await verifyRefreshtoken(refreshToken);
  } catch (error) {
    throw new NoContentException("Logged out successfully");
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

  return {
    message: "Logged out successfully",
  };
};

export default {
  registerUser,
  loginUser,
  handleRefreshToken,
  logout,
};
