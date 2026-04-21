import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import { authenticateUser } from "./middleware/auth.js";
import newsletterRoutes from "./routes/newsletter/newsletter.routes.js";

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
app.use("/api/newsletter", newsletterRoutes);

// Dynamically import routes after env is loaded
const { default: aiRoutes } = await import("./routes/ai/ai.routes.js");
app.use("/api/ai", authenticateUser, aiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
