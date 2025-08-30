import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/tokens.js";
import { ACCESS_TOKEN_COOKIE } from "../config/authCookies.js";

interface JwtPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

// Extend Express Request type
declare module "express-serve-static-core" {
  interface Request {
    user?: Pick<JwtPayload, "userId" | "role">;
  }
}

export const maybeAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.[ACCESS_TOKEN_COOKIE];

  if (!token) {
    res.status(200).json({ message: "Authorization token missing",access:false,user:null});
    return;
  }

  try {
    const decoded = verifyToken<JwtPayload>(token);
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    res.status(200).json({ message: "Invalid or expired token" });
  }
};
