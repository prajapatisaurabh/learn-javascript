// Here we will define our health check route

import { Router } from "express";
import Controller from "./controller.js";

const healthRouter = Router();
const controller = new Controller();

// Health Check Route
healthRouter.get("/health", controller.healthCheckController);

export default healthRouter;
