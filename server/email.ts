import sgMail from "@sendgrid/mail";

const NOTIFICATION_EMAIL = "seminarycollegesuccesstheologi@gmail.com";

function getApiKey() {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) console.warn("[email] Not configured. Set SENDGRID_API_KEY.");
  return key;
}

export async function sendApplicationEmail(data: {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseTitle: string;
  bio: string;
  education: string;
  resumeFileName: string | null;
  resumeBase64: string | null;
  submittedAt: string;
  status: string;
  aiScore: number;
  aiSummary: string;
}) {
  const apiKey = getApiKey();
  if (!apiKey) return false;
  sgMail.setApiKey(apiKey);

  const msg: any = {
    from: `"STSC Applications" <${NOTIFICATION_EMAIL}>`,
    to: NOTIFICATION_EMAIL,
    subject: `New Admission Application - ${data.name} (${data.id})`,
    html: `
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
    `,
  };

  if (data.resumeBase64 && data.resumeFileName) {
    const ext = data.resumeFileName.split(".").pop() || "pdf";
    const mime =
      ext === "doc" ? "application/msword" :
      ext === "docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" :
      "application/pdf";
    msg.attachments = [
      {
        content: data.resumeBase64,
        filename: data.resumeFileName,
        type: mime,
        disposition: "attachment",
      },
    ];
  }

  try {
    await sgMail.send(msg);
    console.log(`[email] Sent application notification for ${data.id}`);
    return true;
  } catch (error) {
    console.error("[email] Failed to send application email:", error);
    return false;
  }
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}) {
  const apiKey = getApiKey();
  if (!apiKey) return false;
  sgMail.setApiKey(apiKey);

  try {
    await sgMail.send({
      from: `"STSC Contact Form" <${NOTIFICATION_EMAIL}>`,
      to: NOTIFICATION_EMAIL,
      subject: `Contact Form: ${data.subject}`,
      html: `
        <h2>New Contact Message</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif;">
          <tr><td><strong>Name</strong></td><td>${data.name}</td></tr>
          <tr><td><strong>Email</strong></td><td>${data.email}</td></tr>
          <tr><td><strong>Subject</strong></td><td>${data.subject}</td></tr>
          <tr><td colspan="2"><strong>Message</strong></td></tr>
          <tr><td colspan="2" style="white-space:pre-wrap">${data.message}</td></tr>
          <tr><td><strong>Received</strong></td><td>${data.timestamp}</td></tr>
        </table>
      `,
    });
    console.log(`[email] Sent contact notification from ${data.email}`);
    return true;
  } catch (error) {
    console.error("[email] Failed to send contact email:", error);
    return false;
  }
}
