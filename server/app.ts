import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { sendApplicationEmail } from "./email.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  app.use(express.json());

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  // API route
  app.post("/api/apply", async (req, res) => {
    try {
      const sent = await sendApplicationEmail(req.body);
      console.log(
        `[server] Application ${req.body.id}`,
        sent ? "email sent" : "email not configured (saved locally)"
      );
      res.json({ success: true });
    } catch (error) {
      console.error("[server] /api/apply error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to store application" });
    }
  });

  // Serve static files
  app.use(express.static(staticPath));

  // SPA catch-all
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  return app;
}
