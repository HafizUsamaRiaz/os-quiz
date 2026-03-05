# OS Quiz — Setup Guide
## ITU · CE210T · Labs 1–3

---

## What You'll Have When Done

```
students open URL → take quiz (once only) → score auto-saved → you see live gradebook in Google Sheets
```

---

## PART 1 — Google Sheets Gradebook (10 minutes)

### Step 1 · Create the Spreadsheet

1. Go to **sheets.google.com** → click **Blank spreadsheet**
2. Rename it: **"OS Quiz — CE210T Results"**
3. You don't need to add any headers — the script does it automatically

---

### Step 2 · Add the Apps Script

1. In your spreadsheet: click **Extensions → Apps Script**
2. Delete all existing code in the editor
3. Open the file **`apps-script.js`** (included in this folder)
4. Copy its entire contents and paste into the Apps Script editor
5. Click **Save** (💾 icon or Ctrl+S)

---

### Step 3 · Deploy as a Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙ next to "Select type" → choose **Web app**
3. Fill in:
   - Description: `OS Quiz Backend`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Click **Authorize access** → sign in with your Google account → Allow
6. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
   ⚠️ Keep this URL — you need it in the next part.

---

### Step 4 · Test the Script

Open this URL in your browser (replace with your actual URL):
```
https://script.google.com/macros/s/YOUR_ID/exec?action=check&roll=TEST123
```
You should see: `{"exists":false}`
If you see that, the backend is working. ✅

---

## PART 2 — Deploy Quiz to Vercel (5 minutes)

### Step 1 · Create GitHub Account (if you don't have one)
Go to **github.com** → Sign up (free)

---

### Step 2 · Upload the Quiz Code

**Option A — GitHub Desktop (easier)**
1. Download GitHub Desktop from **desktop.github.com**
2. Click **File → New Repository**
   - Name: `os-quiz`
   - Local path: choose where to save
3. Click **Create Repository**
4. Copy all files from this folder into the repository folder
5. Click **Commit to main** → **Publish repository** (set to Public)

**Option B — GitHub Website**
1. Go to **github.com/new** → name it `os-quiz` → Public → Create
2. Click **uploading an existing file**
3. Drag and drop: `package.json`, `vite.config.js`, `index.html`, and the entire `src/` folder
4. Click **Commit changes**

---

### Step 3 · Paste Your Apps Script URL

Before uploading, open **`src/App.jsx`** and find these two lines near the top:

```javascript
const SHEET_CHECK_URL  = "YOUR_APPS_SCRIPT_URL_HERE";
const SHEET_SUBMIT_URL = "YOUR_APPS_SCRIPT_URL_HERE";
```

Replace **both** `"YOUR_APPS_SCRIPT_URL_HERE"` with your actual Web App URL from Part 1 Step 3.

---

### Step 4 · Deploy on Vercel

1. Go to **vercel.com** → Sign up with your GitHub account
2. Click **Add New → Project**
3. Find and click your `os-quiz` repository → click **Import**
4. Leave all settings as default (Vercel auto-detects Vite)
5. Click **Deploy**
6. Wait ~1 minute → Vercel gives you a URL like:
   ```
   https://os-quiz-yourname.vercel.app
   ```

**That URL is what you share with students!** 🎉

---

### Step 5 · Custom Domain (Optional)

In Vercel dashboard → your project → **Settings → Domains**
You can add a custom domain like `quiz.itu.edu.pk` if your university provides one.

---

## PART 3 — Understanding Your Gradebook

When students complete the quiz, your Google Sheet gets two tabs:

### Tab 1: "Responses" (raw data)
| Timestamp | Start Time | Name | Roll Number | Score | Total | Percentage | Tab Warnings | Detailed Answers |
|-----------|------------|------|-------------|-------|-------|------------|--------------|-----------------|
| 2025-03-05 10:22 | 10:20 | Ali Hassan | 23-CE-001 | 8 | 10 | 80 | 0 | [...] |

### Tab 2: "Marksheet" (auto-generated gradebook)
| Roll Number | Name | Score (/10) | Percentage | Grade | Tab Warnings | Submitted At |
|-------------|------|-------------|------------|-------|--------------|--------------|
| 23-CE-001 | Ali Hassan | 8 | 80 | **A** | 0 | 2025-03-05 |

Grades are color-coded automatically:
- 🟢 A = 80%+
- 🔵 B = 70–79%
- 🟡 C = 60–69%
- 🟠 D = 50–59%
- 🔴 F = below 50%

---

## PART 4 — One Attempt Enforcement

The system enforces single attempts in **two layers**:

**Layer 1 — Before quiz starts:**
When a student enters their roll number and clicks Begin, the app queries the Google Sheet. If that roll number exists, they see an error and cannot proceed.

**Layer 2 — On submission:**
The Apps Script checks again server-side before saving. Even if someone bypasses the frontend check, the backend rejects duplicate submissions.

---

## PART 5 — Sharing With Students

Send students this message (replace the URL):

> **OS Labs Quiz (Labs 1–3)**
> Complete your quiz at: **https://os-quiz-yourname.vercel.app**
>
> - Enter your full name and roll number exactly as registered
> - You have **45 seconds per question**
> - Each student may attempt **only once**
> - Your score is recorded automatically

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Gradebook submission failed" | Re-deploy Apps Script (Deploy → Manage → Edit → Deploy) |
| Student can't submit | Check Apps Script URL is correct in App.jsx |
| Vercel build fails | Make sure package.json and vite.config.js are in the root folder |
| Duplicate not blocked | Make sure Apps Script has "Anyone" access in deployment settings |

---

## Files in This Folder

```
os-quiz/
├── index.html          ← HTML entry point
├── package.json        ← Dependencies
├── vite.config.js      ← Build config
├── apps-script.js      ← Paste into Google Apps Script
├── SETUP.md            ← This file
└── src/
    ├── main.jsx        ← React entry
    ├── App.jsx         ← Main quiz app (PUT YOUR URL HERE)
    └── questions.js    ← All 25 questions (edit to add more)
```
