// Here we define all routes for authentication related operations like login, register, logout, etc.

import { Router } from "express";

const authRouter = Router();
import {
  registerController,
  loginController,
  logoutController,
} from "./controller.js";

// Register Route
authRouter.post("/auth/register", registerController);
// Login Route
authRouter.post("/auth/login", loginController);
// Logout Route
authRouter.post("/auth/logout", logoutController);

export default authRouter;
