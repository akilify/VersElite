import express from "express";
import { createPaymentIntent } from "../../controllers/payments.controller.js";

const router = express.Router();

// POST /api/payments/create
router.post("/create", createPaymentIntent);

export default router;
