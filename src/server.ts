// src/server.ts
import app from "./app.js";
import { prisma } from "../prisma/client.js"; // correct path for your setup
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown (disconnect Prisma on SIGINT/SIGTERM)
const shutdown = async () => {
  console.log("🔌 Shutting down gracefully...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("✅ Server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
