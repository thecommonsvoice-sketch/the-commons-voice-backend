import { Request, Response } from "express";
import { Role, ArticleStatus } from "@prisma/client";
import { prisma } from "../../prisma/client.js";
import { z } from "zod";
import bcrypt from "bcrypt";

// ====== VALIDATION SCHEMAS ======
const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(Role).optional().default(Role.USER), // default role if not provided
});

const updateUserRoleSchema = z.object({
  role: z.nativeEnum(Role),
});

const changeArticleStatusSchema = z.object({
  status: z.nativeEnum(ArticleStatus),
});

// ====== USER MANAGEMENT ======
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const parsed = createUserSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid user data",
      errors: parsed.error.flatten(),
    });
    return;
  }

  const { name, email, password, role } = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: "User with this email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        isActive: true,
      },
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const {
    page = "1",
    limit = "10",
    search = "",
  } = req.query;

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  try {
    const where = search
      ? {
          OR: [
            { name: { contains: search as string, mode: "insensitive" as any } },
            { email: { contains: search as string, mode: "insensitive" as any } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const parsed = updateUserRoleSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid role",
      errors: parsed.error.flatten(),
    });
    return;
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: parsed.data.role },
    });

    res.json({ message: "User role updated successfully", user: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user role" });
  }
};

export const toggleUserActiveStatus = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });

    res.json({
      message: `User ${updated.isActive ? "activated" : "deactivated"}`,
      user: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to toggle user status" });
  }
};

// ====== ARTICLE MANAGEMENT ======
export const adminGetAllArticles = async (req: Request, res: Response): Promise<void> => {
  const {
    page = "1",
    limit = "10",
    search = "",
  } = req.query;

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  try {
    const where = search
      ? {
          title: { contains: search as string, mode: "insensitive" as const },
        }
      : {};

    const [articles, total,publishedTodayCount] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
      }),
      prisma.article.count({ where }),
      prisma.article.count({ where: {
        NOT:{
          status: ArticleStatus.DRAFT || ArticleStatus.ARCHIVED
        },
        updatedAt: {
          gte: new Date(new Date().setHours(0,0,0,0)), // Greater than or equal to today's midnight
          lt: new Date(new Date().setHours(24,0,0,0)), // Less than tomorrow's midnight
        }
      }
      }),
    ]);

    res.json({
      articles,
      total,
      publishedTodayCount,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch articles" });
  }
};

export const changeArticleStatus = async (req: Request, res: Response): Promise<void> => {
  const { articleId } = req.params;
  const parsed = changeArticleStatusSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid article status",
      errors: parsed.error.flatten(),
    });
    return;
  }

  try {
    const updated = await prisma.article.update({
      where: { id: articleId },
      data: { status: parsed.data.status },
    });

    res.json({
      message: "Article status updated successfully",
      article: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update article status" });
  }
};

export const deleteArticleByAdmin = async (req: Request, res: Response): Promise<void> => {
  const { articleId } = req.params;

  try {
    await prisma.article.delete({ where: { id: articleId } });
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete article" });
  }
};
