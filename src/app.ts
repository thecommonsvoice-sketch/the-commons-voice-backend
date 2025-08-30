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


const app = express();

// Security & middleware
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true, // <-- THIS IS CRUCIAL
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);


// Health check route with explicit types
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

export default app;
