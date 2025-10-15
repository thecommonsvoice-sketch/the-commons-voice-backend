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

declare global {
  namespace Express {
    interface User {
      userId: string;
      role: string;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies?.[ACCESS_TOKEN_COOKIE];

  if (!token) {
    res.status(401).json({ message: "Authorization token missing" });
    return;
  }

  try {
    const decoded = verifyToken<JwtPayload>(token);

    // Attach user details to req.user
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
