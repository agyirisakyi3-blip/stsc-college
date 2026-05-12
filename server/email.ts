import sgMail from "@sendgrid/mail";

const NOTIFICATION_EMAIL = "seminarycollegesuccesstheologi@gmail.com";

export async function sendApplicationEmail(data: {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseTitle: string;
  bio: string;
  education: string;
  resumeFileName: string | null;
  submittedAt: string;
  status: string;
  aiScore: number;
  aiSummary: string;
}) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.warn("[email] Not configured. Set SENDGRID_API_KEY.");
    return false;
  }

  sgMail.setApiKey(apiKey);

  const html = `
    <h2>New Application Received</h2>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif;">
      <tr><td><strong>ID</strong></td><td>${data.id}</td></tr>
      <tr><td><strong>Name</strong></td><td>${data.name}</td></tr>
      <tr><td><strong>Email</strong></td><td>${data.email}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${data.phone}</td></tr>
      <tr><td><strong>Course</strong></td><td>${data.courseTitle}</td></tr>
      <tr><td><strong>Bio</strong></td><td>${data.bio}</td></tr>
      <tr><td><strong>Education</strong></td><td>${data.education}</td></tr>
      <tr><td><strong>Resume</strong></td><td>${data.resumeFileName || "None"}</td></tr>
      <tr><td><strong>Submitted</strong></td><td>${data.submittedAt}</td></tr>
      <tr><td><strong>Status</strong></td><td>${data.status}</td></tr>
      <tr><td><strong>AI Score</strong></td><td>${data.aiScore}%</td></tr>
      <tr><td><strong>AI Summary</strong></td><td>${data.aiSummary}</td></tr>
    </table>
  `;

  try {
    await sgMail.send({
      from: `"STSC Applications" <${NOTIFICATION_EMAIL}>`,
      to: NOTIFICATION_EMAIL,
      subject: `New Admission Application - ${data.name} (${data.id})`,
      html,
    });
    console.log(`[email] Sent notification for ${data.id}`);
    return true;
  } catch (error) {
    console.error("[email] Failed to send:", error);
    return false;
  }
}
