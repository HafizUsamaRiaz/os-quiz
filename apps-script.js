// ================================================================
//  OS QUIZ · Google Apps Script Backend
//  Paste this entire file into Extensions → Apps Script
// ================================================================

const SHEET_NAME = "Responses";   // tab name in your spreadsheet
const MARKS_SHEET = "Marksheet";  // tab name for the master marksheet

// ── Headers (Row 1 of Responses sheet) ──────────────────────────
const HEADERS = [
  "Timestamp", "Start Time", "Name", "Roll Number",
  "Score", "Total", "Percentage (%)", "Tab Warnings", "Detailed Answers"
];

// ── GET: check if roll number already exists ─────────────────────
function doGet(e) {
  const params = e.parameter;
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  if (params.action === "check" && params.roll) {
    const sheet = getOrCreateSheet(SHEET_NAME);
    const data  = sheet.getDataRange().getValues();
    // Column D (index 3) = Roll Number
    const exists = data.slice(1).some(row => String(row[3]).toUpperCase() === params.roll.toUpperCase());
    output.setContent(JSON.stringify({ exists }));
  } else {
    output.setContent(JSON.stringify({ error: "Unknown action" }));
  }

  return output;
}

// ── POST: receive quiz submission ────────────────────────────────
function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  if (data.action === "submit") {
    const sheet = getOrCreateSheet(SHEET_NAME);

    // Duplicate guard — reject if roll number already submitted
    const existing = sheet.getDataRange().getValues();
    const alreadyExists = existing.slice(1).some(
      row => String(row[3]).toUpperCase() === String(data.rollNumber).toUpperCase()
    );
    if (alreadyExists) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "duplicate", message: "Already submitted" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Append row
    sheet.appendRow([
      data.timestamp,
      data.startTime,
      data.name,
      data.rollNumber,
      data.score,
      data.total,
      data.percentage,
      data.tabWarnings,
      data.answers,
    ]);

    // Auto-sync to Marksheet
    syncMarksheet();

    return ContentService.createTextOutput(
      JSON.stringify({ status: "ok" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(
    JSON.stringify({ status: "error", message: "Unknown action" })
  ).setMimeType(ContentService.MimeType.JSON);
}

// ── Sync Marksheet tab ────────────────────────────────────────────
function syncMarksheet() {
  const ss         = SpreadsheetApp.getActiveSpreadsheet();
  const responses  = getOrCreateSheet(SHEET_NAME);
  const marksheet  = getOrCreateSheet(MARKS_SHEET);

  // Write marksheet headers once
  const msHeaders = ["Roll Number", "Name", "Score (/10)", "Percentage (%)", "Grade", "Tab Warnings", "Submitted At"];
  if (marksheet.getLastRow() === 0) {
    marksheet.appendRow(msHeaders);
    marksheet.getRange(1, 1, 1, msHeaders.length).setFontWeight("bold");
    marksheet.setFrozenRows(1);
  }

  // Rebuild marksheet from responses
  const data = responses.getDataRange().getValues().slice(1); // skip header
  const rows = data.map(row => {
    const pct   = Number(row[6]);
    const grade = pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : "F";
    return [row[3], row[2], row[4], row[6], grade, row[7], row[0]];
    // Roll, Name, Score, Pct, Grade, TabWarnings, Timestamp
  });

  // Clear old data (keep header)
  if (marksheet.getLastRow() > 1) {
    marksheet.getRange(2, 1, marksheet.getLastRow() - 1, 7).clearContent();
  }
  if (rows.length > 0) {
    marksheet.getRange(2, 1, rows.length, 7).setValues(rows);
  }

  // Color code grades
  rows.forEach((row, i) => {
    const cell  = marksheet.getRange(i + 2, 5);
    const grade = row[4];
    const color = grade === "A" ? "#d9f2e6" : grade === "B" ? "#d6eaff" : grade === "C" ? "#fff9cc" : grade === "D" ? "#ffe6cc" : "#ffd6d6";
    cell.setBackground(color);
  });
}

// ── Helper: get or create a sheet by name ────────────────────────
function getOrCreateSheet(name) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === SHEET_NAME) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}
