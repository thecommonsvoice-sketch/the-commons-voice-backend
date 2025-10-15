// src/utils/tokens.ts
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { config } from "../config/index.js";

export type Role = "USER" | "REPORTER" | "EDITOR" | "ADMIN";

export interface BasePayload {
  userId: string;
  role: Role;
  email: string;
}

export interface AccessPayload extends BasePayload {
  type: "access";
}

export interface RefreshPayload extends BasePayload {
  type: "refresh";
  jti: string;
}

export const signAccessToken = (payload: BasePayload): string => {
  return jwt.sign(
    { ...payload, type: "access" },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );
};

export const signRefreshToken = (
  payload: BasePayload & { jti: string }
): string => {
  return jwt.sign(
    { ...payload, type: "refresh" },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
};

export const verifyToken = <T>(token: string) =>
  jwt.verify(token, config.jwtSecret) as T;

export const genJti = () => crypto.randomUUID(); // unique ID per refresh
