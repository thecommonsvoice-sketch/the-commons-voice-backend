// src/utils/tokens.ts
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { config } from "../config/index.js";

export type Role = "ADMIN" | "EDITOR" | "REPORTER" | "USER";

type AccessPayload = { userId: string; role: Role };
type RefreshPayload = { userId: string; tokenType: "refresh"; jti: string };

export const signAccessToken = (payload: AccessPayload) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: "3d" });

export const signRefreshToken = (payload: RefreshPayload) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });

export const verifyToken = <T>(token: string) =>
  jwt.verify(token, config.jwtSecret) as T;

export const genJti = () => crypto.randomUUID(); // unique ID per refresh
