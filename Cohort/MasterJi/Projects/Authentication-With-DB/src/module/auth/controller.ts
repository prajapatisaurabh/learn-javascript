// here we declare login , resgister, logout and other auth related controllers

import { type Request, type Response } from "express";

// Register Controller
const registerController = (req: Request, res: Response) => {
  // Here we will handle user registration logic
  res.send("User registered successfully!");
};

// Login Controller
const loginController = (req: Request, res: Response) => {
  // Here we will handle user login logic
  res.send("User logged in successfully!");
};

// Logout Controller
const logoutController = (req: Request, res: Response) => {
  // Here we will handle user logout logic
  res.send("User logged out successfully!");
};

export { registerController, loginController, logoutController };
