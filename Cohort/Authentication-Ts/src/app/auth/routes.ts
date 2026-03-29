import express from "express";
import AuthenticationController from "./controller.js";
import { restrictTOAuthenticatedUsers } from "../middleware/auth-middleware.js";

export const authRouter = express.Router();
const authenticationController = new AuthenticationController();

authRouter.post("/signup", (req, res) => {
  authenticationController.handleSignup(req, res);
});

authRouter.post("/login", (req, res) => {
  authenticationController.handleLogin(req, res);
});

authRouter.get("/me", restrictTOAuthenticatedUsers, (req, res) => {
  authenticationController.handleMe(req, res);
});
