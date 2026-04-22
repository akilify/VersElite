import express from "express";
import { chatWithAI } from "../../controllers/ai.controller.js";

const router = express.Router();
router.post("/chat", chatWithAI);
router.post("/chat/stream", chatWithAIStream);
export default router;
