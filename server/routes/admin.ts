import { Router, Request, Response } from "express";
import { getDb } from "../db.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
    const [users, programs, applications] = await Promise.all([
      db.user.count(),
      db.program.count(),
      db.application.count(),
    ]);
    const statusCounts = await db.application.groupBy({
      by: ["status"],
      _count: true,
    });
    const paymentCounts = await db.application.groupBy({
      by: ["paymentStatus"],
      _count: true,
    });

    res.json({
      totalUsers: users,
      totalPrograms: programs,
      totalApplications: applications,
      applicationsByStatus: Object.fromEntries(
        statusCounts.map((s: any) => [s.status, s._count])
      ),
      paymentsByStatus: Object.fromEntries(
        paymentCounts.map((p: any) => [p.paymentStatus, p._count])
      ),
    });
  } catch (error) {
    console.error("[admin] stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get("/programs", async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
    const programs = await db.program.findMany({ orderBy: { createdAt: "desc" } });
    res.json(programs);
  } catch (error) {
    console.error("[admin] programs error:", error);
    res.status(500).json({ error: "Failed to fetch programs" });
  }
});

router.post("/programs", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const { title, summary, fullDescription, department, duration, prerequisites, thumbnail, instructor, capacity, startDate, schedule, outcomes } = req.body;
    const program = await db.program.create({
      data: {
        title, summary, fullDescription, department, duration,
        prerequisites: prerequisites || "None",
        thumbnail, instructor: instructor || "Faculty Board",
        capacity: capacity ? parseInt(capacity) : null,
        startDate, schedule,
        outcomes: outcomes ? JSON.stringify(outcomes) : "[]",
      },
    });
    res.status(201).json(program);
  } catch (error) {
    console.error("[admin] create program error:", error);
    res.status(500).json({ error: "Failed to create program" });
  }
});

router.put("/programs/:id", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const program = await db.program.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(program);
  } catch (error) {
    console.error("[admin] update program error:", error);
    res.status(500).json({ error: "Failed to update program" });
  }
});

router.delete("/programs/:id", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    await db.program.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error("[admin] delete program error:", error);
    res.status(500).json({ error: "Failed to delete program" });
  }
});

router.get("/applications", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const { status } = req.query;
    const where = status && status !== "ALL" ? { status: status as any } : {};
    const applications = await db.application.findMany({
      where,
      include: { program: { select: { title: true } } },
      orderBy: { submittedAt: "desc" },
    });
    const mapped = applications.map((a: any) => ({
      ...a,
      outcomes: undefined,
      courseTitle: a.program.title,
    }));
    res.json(mapped);
  } catch (error) {
    console.error("[admin] applications error:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

router.put("/applications/:id", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const { status, aiScore, aiSummary, aiConcerns, aiReply, paymentStatus, paymentRef } = req.body;
    const data: any = {};
    if (status !== undefined) data.status = status;
    if (aiScore !== undefined) data.aiScore = aiScore;
    if (aiSummary !== undefined) data.aiSummary = aiSummary;
    if (aiConcerns !== undefined) data.aiConcerns = aiConcerns;
    if (aiReply !== undefined) data.aiReply = aiReply;
    if (paymentStatus !== undefined) {
      data.paymentStatus = paymentStatus;
      if (paymentStatus === "VERIFIED") data.paidAt = new Date();
    }
    if (paymentRef !== undefined) data.paymentRef = paymentRef;
    const application = await db.application.update({
      where: { id: req.params.id },
      data,
    });
    res.json(application);
  } catch (error) {
    console.error("[admin] update application error:", error);
    res.status(500).json({ error: "Failed to update application" });
  }
});

router.delete("/applications/:id", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    await db.application.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error("[admin] delete application error:", error);
    res.status(500).json({ error: "Failed to delete application" });
  }
});

router.get("/users", async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
    const users = await db.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (error) {
    console.error("[admin] users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.post("/users", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const { name, email, password, role } = req.body;
    const { hashPassword } = await import("../auth.js");
    const hashed = await hashPassword(password);
    const user = await db.user.create({
      data: { name, email, password: hashed, role: role || "STUDENT" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === "P2002") return res.status(409).json({ error: "Email already exists" });
    console.error("[admin] create user error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const { password, ...rest } = req.body;
    const data: any = { ...rest };
    if (password) {
      const { hashPassword } = await import("../auth.js");
      data.password = await hashPassword(password);
    }
    const user = await db.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.json(user);
  } catch (error) {
    console.error("[admin] update user error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    await db.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error("[admin] delete user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
