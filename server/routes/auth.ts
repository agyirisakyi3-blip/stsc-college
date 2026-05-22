import { Router, Request, Response } from "express";
import { getDb } from "../db.js";
import { hashPassword, comparePassword, signToken } from "../auth.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    const db = await getDb();
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const hashed = await hashPassword(password);
    const user = await db.user.create({
      data: { name, email, password: hashed, role: role || "STUDENT" },
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("[auth] register error:", error);
    res.status(500).json({ error: "Failed to register" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const db = await getDb();
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid email or password" });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("[auth] login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

router.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const user = await db.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("[auth] me error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
