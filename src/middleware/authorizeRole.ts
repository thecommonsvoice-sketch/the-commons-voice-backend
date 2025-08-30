import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/tokens.js";
import { ACCESS_TOKEN_COOKIE } from "../config/authCookies.js";

export interface DecodedToken {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies?.[ACCESS_TOKEN_COOKIE];

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    try {
      const decoded = verifyToken<DecodedToken>(token);

      if (!allowedRoles.includes(decoded.role)) {
        res.status(403).json({ message: "Access denied: insufficient permissions" });
        return;
      }

      (req as any).user = { userId: decoded.userId, role: decoded.role };
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
