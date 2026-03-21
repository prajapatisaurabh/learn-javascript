import { Router } from "express";
import APIOneController from "./APIOneController.js";

const router = Router();
const aPIOneController = new APIOneController();

router.get("/", aPIOneController.healthCheck.bind(aPIOneController));

export default router;
