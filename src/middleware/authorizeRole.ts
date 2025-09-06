import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/client.js";

export const authorizeRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not authenticated" });
      return;
    }

    try {
      // Fetch the user's role from the database to ensure it's up-to-date
      const dbUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { role: true },
      });

      const role = dbUser?.role || user.role;

      if (!allowedRoles.includes(role)) {
        res.status(403).json({ message: "Access denied: insufficient permissions" });
        return;
      }

      // Attach the updated role to req.user
        req.user={userId:user.userId,role}
      

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(500).json({ message: "Error verifying user role" });
    }
  };
};
