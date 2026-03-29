import express from "express";
import type { Express } from "express";
import { authRouter } from "./auth/routes.js";

export function createApplication(): Express {
  const app = express();
  // Middlewares
  // Routes
  app.use(express.json());
  app.use("/auth", authRouter);

  return app;
}
