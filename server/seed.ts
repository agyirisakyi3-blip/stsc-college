import { getDb } from "./db.js";
import { hashPassword } from "./auth.js";
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function seed() {
  const db = await getDb();
  const existingAdmin = await db.user.findUnique({ where: { email: "admin@stsc.edu" } });
  if (!existingAdmin) {
    const hashed = await hashPassword("admin123");
    await db.user.create({
      data: { name: "Admin", email: "admin@stsc.edu", password: hashed, role: "ADMIN" },
    });
    console.log("✅ Admin user created (admin@stsc.edu / admin123)");
  } else {
    console.log("ℹ️ Admin user already exists");
  }

  const existingPrograms = await db.program.count();
  if (existingPrograms === 0) {
    const coursesPath = resolve(__dirname, "..", "client", "src", "data", "courses.json");
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
    console.log(`✅ Seeded ${courses.length} programs from courses.json`);
  } else {
    console.log(`ℹ️ ${existingPrograms} programs already exist, skipping seed`);
  }

  await db.$disconnect();
}

seed().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
