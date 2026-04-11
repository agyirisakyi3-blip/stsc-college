/**
 * Manus AI Integration Module
 * 
 * This module provides functions to integrate Manus AI for:
 * 1. Generating enriched course descriptions
 * 2. Analyzing applications and generating summaries
 * 
 * IMPORTANT: API Key Security
 * - Never hardcode the Manus API key in client code
 * - For production, use a serverless function (Netlify, Vercel, or custom backend)
 * - The serverless function should call Manus AI with the secret API key
 * - This client module makes requests to the serverless endpoint
 */

export interface ApplicationData {
  name: string;
  email: string;
  phone: string;
  courseId: string;
  bio: string;
  education: string;
  resume?: string;
}

export interface ApplicationAnalysis {
  summary: string;
  score: number;
  suggestedReply: string;
  concerns: string[];
}

export interface CourseEnrichment {
  fullDescription: string;
  keyTopics: string[];
  learningOutcomes: string[];
}

/**
 * Generate an enriched course description using Manus AI
 * 
 * @param courseBrief - Brief course summary to expand
 * @param courseTitle - Title of the course
 * @returns Promise with enriched description
 * 
 * Usage:
 * const enriched = await generateCourseDescription(
 *   "Explore biblical theology",
 *   "Foundations of Biblical Theology"
 * );
 */
export async function generateCourseDescription(
  courseBrief: string,
  courseTitle: string
): Promise<CourseEnrichment> {
  try {
    const prompt = `You are an expert Bible school curriculum designer. 
    
Expand this course summary into a comprehensive course description:
Title: ${courseTitle}
Summary: ${courseBrief}

Please provide:
1. A 3-paragraph detailed course description emphasizing Bible study methods, outcomes, and target student profile. Keep tone pastoral but academic.
2. 5-7 key topics covered in the course
3. 4-5 specific learning outcomes

Format your response as JSON with keys: "fullDescription", "keyTopics", "learningOutcomes"`;

    // For demo mode, return mock data
    // In production, replace this with a call to your serverless function
    return {
      fullDescription: `This comprehensive course introduces students to ${courseTitle}. Through careful study of Scripture, students will explore fundamental concepts and develop a deeper understanding of biblical principles. The course emphasizes practical application and encourages critical thinking about theological questions. Students will develop skills in biblical interpretation and apply these concepts to contemporary Christian life. This course is ideal for those seeking to deepen their faith and understanding of Scripture.`,
      keyTopics: [
        "Biblical foundations and core concepts",
        "Scriptural interpretation methods",
        "Theological analysis and synthesis",
        "Contemporary application of biblical principles",
        "Spiritual growth and discipleship"
      ],
      learningOutcomes: [
        "Understand core biblical concepts and their theological significance",
        "Develop skills in biblical interpretation and analysis",
        "Apply biblical principles to contemporary Christian living",
        "Engage in meaningful theological discussion and reflection"
      ]
    };
  } catch (error) {
    console.error("Error generating course description:", error);
    throw new Error("Failed to generate course description. Please try again.");
  }
}

/**
 * Analyze an application using Manus AI
 * 
 * @param applicationData - Complete application information
 * @param courseTitle - Title of the course applied for
 * @returns Promise with analysis including summary, score, and suggested reply
 * 
 * Usage:
 * const analysis = await analyzeApplication(applicationData, "Foundations of Biblical Theology");
 */
export async function analyzeApplication(
  applicationData: ApplicationData,
  courseTitle: string
): Promise<ApplicationAnalysis> {
  try {
    const prompt = `You are an admissions advisor for a Bible school. Analyze this application:

Applicant Name: ${applicationData.name}
Email: ${applicationData.email}
Phone: ${applicationData.phone}
Course Applied For: ${courseTitle}
Bio: ${applicationData.bio}
Previous Education: ${applicationData.education}

Please provide:
1. A concise summary of the applicant's background (≤100 words)
2. An overall fit score (0-100) for this course
3. Any potential concerns or missing prerequisites
4. A short, friendly acceptance template email tailored to the applicant's course choice

Format your response as JSON with keys: "summary", "score", "concerns" (array), "suggestedReply"`;

    // For demo mode, return mock data
    // In production, replace this with a call to your serverless function
    const score = Math.floor(Math.random() * 40) + 60; // Random score 60-100 for demo
    
    return {
      summary: `${applicationData.name} is an enthusiastic applicant with interest in ${courseTitle}. Their background in ${applicationData.education} demonstrates commitment to learning. They appear well-suited for this course.`,
      score: score,
      concerns: score < 75 ? ["May benefit from foundational course first"] : [],
      suggestedReply: `Dear ${applicationData.name},

Thank you for your interest in our ${courseTitle} course! We are pleased to review your application. Your background and enthusiasm for biblical learning align well with our program goals.

We would like to invite you to join our upcoming cohort. Please confirm your participation by replying to this email.

Welcome to SUCCESS THEOLOGICAL SEMINARY AND COLLEGE!

Best regards,
Admissions Team`
    };
  } catch (error) {
    console.error("Error analyzing application:", error);
    throw new Error("Failed to analyze application. Please try again.");
  }
}

/**
 * Production Implementation Guide
 * 
 * To use Manus AI in production:
 * 
 * 1. Create a serverless function (example using Node.js/Express):
 * 
 *    // serverless/manus-api.js
 *    const fetch = require('node-fetch');
 *    
 *    exports.handler = async (event) => {
 *      const { action, prompt } = JSON.parse(event.body);
 *      const apiKey = process.env.MANUS_API_KEY;
 *      
 *      try {
 *        const response = await fetch('https://api.manus.im/v1/generate', {
 *          method: 'POST',
 *          headers: {
 *            'Authorization': `Bearer ${apiKey}`,
 *            'Content-Type': 'application/json'
 *          },
 *          body: JSON.stringify({ prompt })
 *        });
 *        
 *        const data = await response.json();
 *        return {
 *          statusCode: 200,
 *          body: JSON.stringify(data)
 *        };
 *      } catch (error) {
 *        return {
 *          statusCode: 500,
 *          body: JSON.stringify({ error: error.message })
 *        };
 *      }
 *    };
 * 
 * 2. Update the functions above to call your serverless endpoint:
 * 
 *    const response = await fetch('/.netlify/functions/manus-api', {
 *      method: 'POST',
 *      headers: { 'Content-Type': 'application/json' },
 *      body: JSON.stringify({ action: 'generate', prompt })
 *    });
 * 
 * 3. Store MANUS_API_KEY in your deployment environment variables
 */

/**
 * Demo mode toggle
 * Set to false in production to enable actual Manus API calls
 */
export const DEMO_MODE = true;

/**
 * Error handling helper
 */
export function handleManuError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
}
