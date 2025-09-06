import { Request, Response, NextFunction } from "express";

export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {


  try {
    const user = req.user;
    console.log("req user check user:",user);
    next();
  } catch (error) {
    console.error("Authentication error:", error);
  }
};
