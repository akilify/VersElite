import express from "express";
import { getCollection } from "../controllers/collection.controller.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.get("/:collectionId", authenticateUser, getCollection);

export default router;
