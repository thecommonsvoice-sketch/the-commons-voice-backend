import { Request, Response } from "express";
import { prisma } from "../../prisma/client.js";

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId; // Comes from auth middleware (if any)

    // If no user (visitor), return guest response
    if (!userId) {
      res.status(200).json({ user: null }); // ← Key change: allow guests
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
