import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { sendApplicationEmail, sendContactEmail } from "./email.js";
import { appendApplication, ensureSheetSetup } from "./google-sheets.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import paymentsRouter from "./routes/payments.js";
import seedRouter from "./routes/seed.js";
import { getDb } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const applicationsStore: any[] = [];

export function createApp() {
  const app = express();

  app.use(express.json({ limit: "10mb" }));

  const staticPath = process.env.VERCEL
    ? path.resolve(process.cwd(), "dist", "public")
    : process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  // Auth routes
  app.use("/api/auth", authRouter);

  // Admin routes (authenticated + admin-only)
  app.use("/api/admin", adminRouter);

  // Payment routes
  app.use("/api/payments", paymentsRouter);

  // Seed routes
  app.use("/api/seed", seedRouter);

  // POST /api/applications — Submit application to DB
  app.post("/api/applications", async (req, res) => {
    try {
      const { name, email, phone, courseTitle, bio, education, aiScore, aiSummary, aiConcerns, paymentRef, paymentChannel } = req.body;
      const db = await getDb();
      const program = await db.program.findFirst({ where: { title: courseTitle } });
      if (!program) {
        return res.status(400).json({ success: false, error: "Program not found" });
      }
      const app = await db.application.create({
        data: {
          name, email, phone, bio, education,
          aiScore: aiScore || null,
          aiSummary: aiSummary || null,
          aiConcerns: aiConcerns ? JSON.stringify(aiConcerns) : null,
          paymentRef: paymentRef || null,
          paymentChannel: paymentChannel || null,
          paymentAmount: 100,
          paymentStatus: paymentRef ? "PAID" : "UNPAID",
          paidAt: paymentRef ? new Date() : null,
          programId: program.id,
        },
      });
      res.status(201).json({ success: true, id: app.id });
    } catch (error) {
      console.error("[server] /api/applications error:", error);
      res.status(500).json({ success: false, error: "Failed to submit application" });
    }
  });

  // POST /api/apply — Legacy in-memory submission (kept for compatibility)
  app.post("/api/apply", async (req, res) => {
    try {
      const data = req.body;
      applicationsStore.push(data);

      const [emailSent] = await Promise.all([
        sendApplicationEmail(data),
        appendApplication(data).catch(() => false),
      ]);

      console.log(
        `[server] Application ${data.id}`,
        emailSent ? "email sent" : "email not configured"
      );
      res.json({ success: true, id: data.id });
    } catch (error) {
      console.error("[server] /api/apply error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to store application" });
    }
  });

  // GET /api/applications — List applications
  app.get("/api/applications", (_req, res) => {
    res.json(applicationsStore);
  });

  // DELETE /api/applications/:id — Delete an application
  app.delete("/api/applications/:id", (req, res) => {
    const idx = applicationsStore.findIndex((a) => a.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: "Not found" });
    }
    applicationsStore.splice(idx, 1);
    res.json({ success: true });
  });

  // POST /api/contact — Contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const sent = await sendContactEmail(req.body);
      console.log(
        `[server] Contact from ${req.body.email}`,
        sent ? "email sent" : "email not configured"
      );
      res.json({ success: true });
    } catch (error) {
      console.error("[server] /api/contact error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to send message" });
    }
  });

  // Serve static files
  app.use(express.static(staticPath));

  // SPA catch-all
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  ensureSheetSetup();

  return app;
}
