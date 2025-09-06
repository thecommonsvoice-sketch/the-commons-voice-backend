// src/routes/auth.routes.ts
import { Router } from "express";
import { register,
     login,
    //   refresh, 
      logout } from "../controllers/auth.controller.js";
// import { authenticate } from "../middleware/auth.middleware.js";
import { getProfile } from "../controllers/userController.js";
import { maybeAuthenticate } from "middleware/maybeAuthenticated.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
// router.post("/refresh", refresh);
router.post("/logout", logout);

router.get("/me", maybeAuthenticate, getProfile);

export default router;
