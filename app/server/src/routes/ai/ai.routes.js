import express from "express";
import { generatePlan } from "../../controllers/ai.controller.js";
import { authenticateUser } from "../../middleware/auth.js";

const router = express.Router();

// 🔐 Protected AI route
router.post("/plan", authenticateUser, generatePlan);

export default router;
