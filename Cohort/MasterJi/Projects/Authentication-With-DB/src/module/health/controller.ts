import { type Request, type Response } from "express";

class Controller {
  // Here we will define our health check controller

  healthCheckController(req: Request, res: Response) {
    res.send("API is healthy!");
  }
}

export default Controller;
