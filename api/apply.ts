import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sendApplicationEmail } from "../server/email.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sent = await sendApplicationEmail(req.body);
    console.log(
      `[api/apply] Application ${req.body.id}`,
      sent ? "email sent" : "email not configured"
    );
    return res.json({ success: true });
  } catch (error) {
    console.error("[api/apply] Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to process application" });
  }
}
