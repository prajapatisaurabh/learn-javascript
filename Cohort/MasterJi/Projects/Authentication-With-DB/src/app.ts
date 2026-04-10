import express, { type Request, type Response } from "express";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
import authRouter from "./module/auth/router.js";
import healthRouter from "./module/health/routes.js";

app.use("/api", authRouter);
app.use("/api", healthRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
