import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import {
  getAllUsers,
  updateUserRole,
  toggleUserActiveStatus,
  adminGetAllArticles,
  changeArticleStatus,
  deleteArticleByAdmin,
  createUser
} from "../controllers/adminController.js";

const router = Router();

// ADMIN ONLY ROUTES
router.use(authenticate, authorizeRole(["ADMIN"]));

// User Management
router.get("/users", getAllUsers);
router.post("/users", createUser); // Create user
router.patch("/users/:userId/role", updateUserRole);
router.patch("/users/:userId/toggle", toggleUserActiveStatus);

// Article Management
router.get("/articles", adminGetAllArticles);
router.patch("/articles/:articleId/status", changeArticleStatus);
router.delete("/articles/:articleId", deleteArticleByAdmin);

export default router;
