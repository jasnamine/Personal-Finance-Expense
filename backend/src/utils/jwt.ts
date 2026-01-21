import jwt, { SignOptions } from "jsonwebtoken";

export const signAccesstoken = (userId: string) => {
  return new Promise<string>((resolve, reject) => {
    const payload = { userId };
    const secret = process.env.ACCESS_TOKEN_SECRET as string;
    const options: SignOptions = { expiresIn: "15m" };

    jwt.sign(payload, secret, options, (err: Error | null, token?: string) => {
      if (err) {
        return reject(err);
      }
      resolve(token as string);
    });
  });
};

export const signRefreshtoken = (userId: string) => {
  return new Promise<string>((resolve, reject) => {
    const payload = { userId };
    const secret = process.env.REFRESH_TOKEN_SECRET as string;
    const options: SignOptions = { expiresIn: "7d" };

    jwt.sign(payload, secret, options, (err: Error | null, token?: string) => {
      if (err) {
        return reject(err);
      }
      resolve(token as string);
    });
  });
};

export const verifyRefreshtoken = (token: string) => {
  return new Promise<string>((resolve, reject) => {
    const secret = process.env.REFRESH_TOKEN_SECRET as string;
    jwt.verify(token, secret, (err, payload) => {
      if (err) return reject(err);
      const userId = (payload as any).userId;
      resolve(userId);
    });
  });
};

export const verifyAccesstoken = (token: string) => {
  return new Promise<string>((resolve, reject) => {
    const secret = process.env.ACCESS_TOKEN_SECRET as string;
    jwt.verify(token, secret, (err, payload) => {
      if (err) return reject(err);
      const userId = (payload as any).userId;
      resolve(userId);
    });
  });
};
