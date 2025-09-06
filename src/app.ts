import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import articleRoutes from "./routes/article.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import adminRoutes from "./routes/adminRoutes.js";
import commentRoutes from "./routes/comment.routes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js";

const app = express();

// Security & middleware
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// ✅ Prevent compression on 304 responses
app.use(
  compression({
    filter: (req, res) => {
      const shouldCompress = compression.filter(req, res);
      return shouldCompress && res.statusCode !== 304;
    },
  })
);

// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 200,
//   })
// );

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/comments", commentRoutes); // Comments API
app.use("/api/bookmarks", bookmarkRoutes); // Bookmarks API

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

export default app;
