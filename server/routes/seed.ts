import { Router, Request, Response } from "express";
import { getDb } from "../db.js";
import { hashPassword } from "../auth.js";
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

router.post("/", async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
    const results: string[] = [];

    const existingAdmin = await db.user.findUnique({ where: { email: "admin@stsc.edu" } });
    if (!existingAdmin) {
      const hashed = await hashPassword("admin123");
      await db.user.create({
        data: { name: "Admin", email: "admin@stsc.edu", password: hashed, role: "ADMIN" },
      });
      results.push("Admin user created (admin@stsc.edu / admin123)");
    } else {
      results.push("Admin user already exists");
    }

    const existingPrograms = await db.program.count();
    if (existingPrograms === 0) {
      const coursesPath = resolve(__dirname, "..", "..", "client", "src", "data", "courses.json");
      const courses = JSON.parse(readFileSync(coursesPath, "utf-8"));

      for (const c of courses) {
        await db.program.create({
          data: {
            title: c.title,
            summary: c.summary,
            fullDescription: c.fullDescription,
            department: c.level,
            duration: c.duration,
            prerequisites: c.prerequisites || "None",
            thumbnail: c.thumbnail || null,
            instructor: c.instructor || "Faculty Board",
            capacity: c.capacity || null,
            startDate: c.startDate || null,
            schedule: c.schedule || null,
            outcomes: JSON.stringify(c.outcomes || []),
            isActive: true,
          },
        });
      }
      results.push(`Seeded ${courses.length} programs`);
    } else {
      results.push(`${existingPrograms} programs already exist`);
    }

    res.json({ success: true, messages: results });
  } catch (error) {
    console.error("[seed] error:", error);
    res.status(500).json({ success: false, error: "Seed failed" });
  }
});

export default router;
