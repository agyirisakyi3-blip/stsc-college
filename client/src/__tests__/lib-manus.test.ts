import { describe, it, expect, vi } from "vitest";
import {
  analyzeApplication,
  generateCourseDescription,
  handleManuError,
  type ApplicationData,
} from "../lib/manus";

describe("handleManuError", () => {
  it("returns error message for Error instances", () => {
    expect(handleManuError(new Error("test error"))).toBe("test error");
  });

  it("returns generic message for non-Error values", () => {
    expect(handleManuError("string error")).toBe(
      "An unexpected error occurred. Please try again."
    );
  });

  it("returns generic message for null", () => {
    expect(handleManuError(null)).toBe(
      "An unexpected error occurred. Please try again."
    );
  });

  it("returns generic message for objects", () => {
    expect(handleManuError({ code: 500 })).toBe(
      "An unexpected error occurred. Please try again."
    );
  });
});

describe("generateCourseDescription", () => {
  it("returns a CourseEnrichment with expected structure", async () => {
    const result = await generateCourseDescription(
      "Explore biblical theology",
      "Foundations of Biblical Theology"
    );

    expect(result).toHaveProperty("fullDescription");
    expect(result).toHaveProperty("keyTopics");
    expect(result).toHaveProperty("learningOutcomes");

    expect(typeof result.fullDescription).toBe("string");
    expect(Array.isArray(result.keyTopics)).toBe(true);
    expect(Array.isArray(result.learningOutcomes)).toBe(true);
  });

  it("includes the course title in the description", async () => {
    const result = await generateCourseDescription(
      "Test brief",
      "Test Course Title"
    );

    expect(result.fullDescription).toContain("Test Course Title");
  });

  it("returns 5 key topics", async () => {
    const result = await generateCourseDescription("brief", "title");
    expect(result.keyTopics).toHaveLength(5);
  });

  it("returns 4 learning outcomes", async () => {
    const result = await generateCourseDescription("brief", "title");
    expect(result.learningOutcomes).toHaveLength(4);
  });
});

describe("analyzeApplication", () => {
  const baseAppData: ApplicationData = {
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    courseId: "theo-01",
    bio: "I am passionate about theology.",
    education: "Bachelor in Religious Studies",
  };

  it("returns an ApplicationAnalysis with expected structure", async () => {
    const result = await analyzeApplication(baseAppData, "Theology 101");

    expect(result).toHaveProperty("summary");
    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("suggestedReply");
    expect(result).toHaveProperty("concerns");

    expect(typeof result.summary).toBe("string");
    expect(typeof result.score).toBe("number");
    expect(typeof result.suggestedReply).toBe("string");
    expect(Array.isArray(result.concerns)).toBe(true);
  });

  it("generates score between 60 and 100", async () => {
    for (let i = 0; i < 50; i++) {
      const result = await analyzeApplication(baseAppData, "Theology 101");
      expect(result.score).toBeGreaterThanOrEqual(60);
      expect(result.score).toBeLessThanOrEqual(100);
    }
  });

  it("includes applicant name in summary", async () => {
    const result = await analyzeApplication(baseAppData, "Theology 101");
    expect(result.summary).toContain("John Doe");
  });

  it("includes applicant name in suggested reply", async () => {
    const result = await analyzeApplication(baseAppData, "Theology 101");
    expect(result.suggestedReply).toContain("John Doe");
  });

  it("includes course title in summary", async () => {
    const result = await analyzeApplication(
      baseAppData,
      "Advanced Biblical Studies"
    );
    expect(result.summary).toContain("Advanced Biblical Studies");
  });

  it("includes course title in suggested reply", async () => {
    const result = await analyzeApplication(
      baseAppData,
      "Advanced Biblical Studies"
    );
    expect(result.suggestedReply).toContain("Advanced Biblical Studies");
  });

  it("includes education background in summary", async () => {
    const result = await analyzeApplication(baseAppData, "Theology 101");
    expect(result.summary).toContain("Bachelor in Religious Studies");
  });

  it("may have concerns when score is low (random)", async () => {
    const result = await analyzeApplication(baseAppData, "Theology 101");
    if (result.score < 75) {
      expect(result.concerns.length).toBeGreaterThan(0);
    }
  });
});
