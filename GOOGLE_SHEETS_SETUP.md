# Google Sheets Integration Setup

The application portal now submits applicant data to both `localStorage` and (optionally) a Google Sheet. Follow these steps to enable the Google Sheets integration.

## 1. Create a Google Sheet

1. Go to [sheets.new](https://sheets.new) (or create via Google Drive)
2. Note the **Sheet ID** from the URL: `https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit`

## 2. Enable the Google Sheets API & Create a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Go to **APIs & Services > Library**
4. Search for "Google Sheets API" and enable it
5. Go to **APIs & Services > Credentials**
6. Click **Create Credentials > Service Account**
7. Give it a name (e.g., "stsc-applications") and click **Create and Continue**
8. Skip granting roles (optional) and click **Done**
9. Click on the new service account, go to **Keys** tab
10. Click **Add Key > Create New Key > JSON**
11. Download the JSON key file

## 3. Share Your Sheet with the Service Account

1. Open your Google Sheet
2. Click **Share** (top-right)
3. Paste the `client_email` from the JSON key file (looks like `name@project.iam.gserviceaccount.com`)
4. Click **Send** (Editor permission is fine)

## 4. Set Environment Variables

Add these to your `.env` file at the project root:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=the-sheet-id-from-step-1
```

**Important:** The private key in the JSON file uses literal `\n` characters. Keep them as-is when copying into the env var.

## How It Works

- When an applicant submits the form, the client POSTs to `/api/apply`
- The server receives the data and appends a row to the **Applications** sheet
- If Google Sheets is not configured, the server logs a warning and the client still saves to `localStorage` (no data loss)
- The sheet is auto-created with headers on server startup if it doesn't exist yet

## Columns in the Sheet

| ID | Name | Email | Phone | Course | Bio | Education | Resume | Submitted At | Status | AI Score | AI Summary |
