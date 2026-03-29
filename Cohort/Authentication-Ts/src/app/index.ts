import express from "express";
import type { Express } from "express";
import { authRouter } from "./auth/routes.js";
import { authenticationMiddleware } from "./middleware/auth-middleware.js";

export function createApplication(): Express {
  const app = express();

  // Middlewares
  app.use(express.json());
  app.use(authenticationMiddleware);

  // Routes
  app.use("/auth", authRouter);

  return app;
}
