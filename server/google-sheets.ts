import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

let sheetsClient: ReturnType<typeof google.sheets> | null = null;

function getSheets() {
  if (sheetsClient) return sheetsClient;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !key || !sheetId) {
    console.warn(
      "[google-sheets] Not configured. Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID."
    );
    return null;
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: email,
      private_key: key.replace(/\\n/g, "\n"),
    },
    scopes: SCOPES,
  });

  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
}

export async function appendApplication(data: {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseId: string;
  courseTitle: string;
  bio: string;
  education: string;
  resumeFileName: string | null;
  submittedAt: string;
  status: string;
  aiScore: number;
  aiSummary: string;
  aiConcerns: string[];
}) {
  const sheets = getSheets();
  if (!sheets) return false;

  const sheetId = process.env.GOOGLE_SHEET_ID!;

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Applications!A:L",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            data.id,
            data.name,
            data.email,
            data.phone,
            data.courseTitle,
            data.bio,
            data.education,
            data.resumeFileName || "",
            data.submittedAt,
            data.status,
            data.aiScore,
            data.aiSummary,
          ],
        ],
      },
    });
    console.log(`[google-sheets] Appended application ${data.id}`);
    return true;
  } catch (error) {
    console.error("[google-sheets] Failed to append:", error);
    return false;
  }
}

export async function ensureSheetSetup() {
  const sheets = getSheets();
  if (!sheets) return;

  const sheetId = process.env.GOOGLE_SHEET_ID!;

  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
    const existing = (meta.data.sheets || []).map(
      (s) => s.properties?.title
    );

    if (!existing.includes("Applications")) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: { title: "Applications" },
              },
            },
          ],
        },
      });
      console.log('[google-sheets] Created "Applications" sheet');
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "Applications!A1:L1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            "ID",
            "Name",
            "Email",
            "Phone",
            "Course",
            "Bio",
            "Education",
            "Resume",
            "Submitted At",
            "Status",
            "AI Score",
            "AI Summary",
          ],
        ],
      },
    });
    console.log('[google-sheets] Header row ensured');
  } catch (error) {
    console.error("[google-sheets] Setup error:", error);
  }
}
