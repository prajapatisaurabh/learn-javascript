import express from "express";
import AuthenticationController from "./controller.js";

export const authRouter = express.Router();
const authenticationController = new AuthenticationController();

authRouter.post("/signup", (req, res) => {
  authenticationController.handleSignup(req, res);
});

authRouter.post("/login", (req, res) => {
  authenticationController.handleLogin(req, res);
});
