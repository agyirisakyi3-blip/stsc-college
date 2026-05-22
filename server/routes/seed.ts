import { Router, Request, Response } from "express";
import { getDb } from "../db.js";
import { hashPassword } from "../auth.js";
import { readFileSync, existsSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadCourses(): any[] {
  const paths = [
    resolve(__dirname, "..", "..", "client", "src", "data", "courses.json"),
    resolve(__dirname, "..", "..", "dist", "public", "assets", "courses.json"),
    resolve(process.cwd(), "client", "src", "data", "courses.json"),
    resolve(process.cwd(), "src", "data", "courses.json"),
  ];
  for (const p of paths) {
    if (existsSync(p)) {
      return JSON.parse(readFileSync(p, "utf-8"));
    }
  }
  return [
    { title: "Executive Certificate in Theology", level: "Department of Theology", department: "Theology", summary: "Foundational biblical studies", fullDescription: "An introductory program covering the core tenets of Christian faith and practice.", duration: "6 months", prerequisites: "None", outcomes: ["Understand biblical foundations"] },
    { title: "Diploma in Theology", level: "Department of Theology", department: "Theology", summary: "Intermediate theological training", fullDescription: "A comprehensive diploma program for those seeking deeper theological knowledge.", duration: "1 year", prerequisites: "Executive Certificate or equivalent", outcomes: ["Develop theological competence"] },
    { title: "Bachelor of Theology", level: "Department of Theology", department: "Theology", summary: "Undergraduate degree in theology", fullDescription: "A four-year degree program preparing students for ministry and advanced study.", duration: "4 years", prerequisites: "High School Diploma or equivalent", outcomes: ["Prepare for ordained ministry"] },
  ];
}

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
      const courses = loadCourses();
      for (const c of courses) {
        await db.program.create({
          data: {
            title: c.title,
            summary: c.summary,
            fullDescription: c.fullDescription,
            department: c.level || c.department || "Theology",
            duration: c.duration || "1 year",
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
  } catch (error: any) {
    console.error("[seed] error:", error);
    res.status(500).json({ success: false, error: "Seed failed", detail: error?.message || String(error) });
  }
});

export default router;
