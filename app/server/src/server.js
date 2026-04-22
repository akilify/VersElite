import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import newsletterRoutes from "./routes/newsletter/newsletter.routes.js";
import chatRoutes from "./routes/ai/chat.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("VersElite API running ✅");
});

// Routes
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/ai", chatRoutes); // Chat endpoint – no auth required (or add authenticateUser if desired)

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
