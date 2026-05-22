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

export async function sendReceiptEmail(
  toEmail: string,
  receipt: {
    receiptNumber: string;
    reference: string;
    amount: number;
    currency: string;
    channel: string;
    status: string;
    paidAt: string;
    customer: { email: string; name: string };
  }
) {
  const apiKey = getApiKey();
  if (!apiKey) return false;
  sgMail.setApiKey(apiKey);

  try {
    await sgMail.send({
      from: `"STSC Payments" <${NOTIFICATION_EMAIL}>`,
      to: toEmail,
      subject: `Payment Receipt - ${receipt.receiptNumber}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#8B0000;color:white;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
            <h1 style="margin:0;">Payment Receipt</h1>
            <p style="margin:8px 0 0;opacity:0.9;">Success Theological Seminary &amp; College</p>
          </div>
          <div style="border:1px solid #e0e0e0;border-top:0;padding:24px;border-radius:0 0 8px 8px;">
            <p style="color:#666;">Receipt #: <strong>${receipt.receiptNumber}</strong></p>
            <p style="color:#666;">Date: <strong>${new Date(receipt.paidAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</strong></p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Customer</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">${receipt.customer.name} (${receipt.customer.email})</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Amount Paid</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">${receipt.currency} ${receipt.amount.toFixed(2)}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Payment Method</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;text-transform:capitalize;">${receipt.channel}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Transaction Ref</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;font-family:monospace;">${receipt.reference}</td></tr>
              <tr><td style="padding:8px;color:#666;">Status</td><td style="padding:8px;font-weight:bold;color:#16a34a;">${receipt.status}</td></tr>
            </table>
            <p style="color:#999;font-size:12px;text-align:center;margin-top:24px;">Thank you for your payment. This is an auto-generated receipt.</p>
          </div>
        </div>
      `,
    });
    console.log(`[email] Sent receipt to ${toEmail}`);
    return true;
  } catch (error) {
    console.error("[email] Failed to send receipt:", error);
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
