import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { SpreadsheetFile, Workbook } from "file:///C:/Users/igrs/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const outputDir = "C:/Users/igrs/project-anu/outputs/dev-activities-2026";
const outputPath = `${outputDir}/development-activities-feb-to-date.xlsx`;
const previewPath = `${outputDir}/development-activities-preview.png`;

function parseGitHistory() {
  const raw = execFileSync("git", [
    "log", "--all", "--since=2026-02-01", "--until=2026-11-06",
    "--date=short", "--pretty=format:__COMMIT__%H|%ad|%an|%s", "--numstat", "--no-merges"
  ], { cwd: "C:/Users/igrs/project-anu", encoding: "utf8", maxBuffer: 80 * 1024 * 1024 });
  const commits = [];
  let current = null;
  for (const line of raw.split(/\r?\n/)) {
    if (line.startsWith("__COMMIT__")) {
      if (current) commits.push(current);
      const [hash, date, author, ...subjectParts] = line.slice("__COMMIT__".length).split("|");
      current = { hash, date, author, subject: subjectParts.join("|"), files: [], additions: 0, deletions: 0 };
    } else if (current && /^\d+\s+\d+\s+/.test(line)) {
      const parts = line.split(/\s+/);
      const additions = Number(parts[0]);
      const deletions = Number(parts[1]);
      const path = parts.slice(2).join(" ");
      current.files.push(path);
      current.additions += additions;
      current.deletions += deletions;
    }
  }
  if (current) commits.push(current);
  return commits.sort((a, b) => a.date.localeCompare(b.date) || a.hash.localeCompare(b.hash));
}

function classify(subject) {
  const s = subject.toLowerCase();
  if (/\b(test|tests|testing|jest|playwright)\b/.test(s)) return "Testing";
  if (/\b(doc|docs|documentation|api documentation)\b/.test(s)) return "Documentation";
  if (/\b(migration|schema|database|sql)\b/.test(s)) return "Database";
  if (/\b(build|bundle|release|deploy|cloudfront)\b/.test(s)) return "Build / Release";
  if (/\b(fix|bug|resolve|repair|correct)\b/.test(s)) return "Bug Fix";
  if (/\b(refactor|chore|cleanup|clean up|remove commented)\b/.test(s)) return "Refactor / Maintenance";
  if (/\b(feat|feature|implement|add|enhance|improve|update|create)\b/.test(s)) return "Feature Development";
  return "Development";
}

function scope(files) {
  const labels = [];
  const add = (label) => { if (!labels.includes(label)) labels.push(label); };
  for (const file of files) {
    if (file.startsWith("client/")) add("Frontend");
    else if (file.startsWith("server/")) add("Backend");
    else if (file.startsWith("APIs/")) add("API");
    else if (file.startsWith("postman/")) add("Postman");
    else if (file.startsWith("scratch/")) add("Tooling");
    else add("Project / Config");
  }
  return labels.join(", ");
}

const commits = parseGitHistory();
console.log(`Parsed ${commits.length} commits`);
const activityRows = commits.map(c => [
  new Date(`${c.date}T00:00:00`), c.date.slice(0, 7), c.author, classify(c.subject), scope(c.files),
  c.subject, c.files.length, c.additions, c.deletions, c.hash.slice(0, 10)
]);

const byMonth = new Map();
for (const row of activityRows) {
  const m = row[1];
  if (!byMonth.has(m)) byMonth.set(m, { count: 0, additions: 0, deletions: 0 });
  const x = byMonth.get(m); x.count += 1; x.additions += row[7]; x.deletions += row[8];
}
const byType = new Map();
for (const row of activityRows) byType.set(row[3], (byType.get(row[3]) || 0) + 1);
const contributors = [...new Set(activityRows.map(r => r[2]))].sort();

const workbook = Workbook.create();
const summary = workbook.worksheets.add("Summary");
const log = workbook.worksheets.add("Activity Log");
summary.showGridLines = false;
log.showGridLines = false;
summary.tabColor = "#1F4E78";

summary.getRange("A1:H1").merge();
summary.getRange("A1").values = [["Development activities from February 2026 to date"]];
summary.getRange("A2:H2").merge();
summary.getRange("A2").values = [["Source: Git history in the project repository, 2026-02-01 through 2026-11-05. Non-merge commits are listed in the activity log."]];
summary.getRange("A4:B7").values = [
  ["Metric", "Value"],
  ["Development activities", null],
  ["Contributors", contributors.length],
  ["Lines added", null]
];
summary.getRange("B5").formulas = [["=COUNTA('Activity Log'!A2:A1000)"]];
summary.getRange("B7").formulas = [["=SUM('Activity Log'!H2:H1000)"]];
summary.getRange("D4:E7").values = [
  ["Metric", "Value"],
  ["Lines deleted", null],
  ["Files changed", null],
  ["Period end", new Date("2026-11-05T00:00:00")]
];
summary.getRange("E5").formulas = [["=SUM('Activity Log'!I2:I1000)"]];
summary.getRange("E6").formulas = [["=SUM('Activity Log'!G2:G1000)"]];
summary.getRange("E7").setNumberFormat("yyyy-mm-dd");

summary.getRange("A10:D10").values = [["Month", "Activities", "Lines added", "Lines deleted"]];
const monthRows = [...byMonth.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([m, x]) => [new Date(`${m}-01T00:00:00Z`).toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }), x.count, x.additions, x.deletions]);
summary.getRange(`A11:D${10 + monthRows.length}`).values = monthRows;

summary.getRange("F10:G10").values = [["Activity type", "Count"]];
const typeRows = [...byType.entries()].sort((a, b) => b[1] - a[1]).map(([type, count]) => [type, count]);
summary.getRange(`F11:G${10 + typeRows.length}`).values = typeRows;

summary.getRange("A23:B23").values = [["Contributors", ""]];
summary.getRange(`A24:A${23 + contributors.length}`).values = contributors.map(x => [x]);
summary.getRange("D23:E23").values = [["Method", ""]];
summary.getRange("D24:E27").values = [
  ["Included", "Non-merge commits on all refs"],
  ["Date range", "2026-02-01 to 2026-11-05"],
  ["Activity basis", "Commit subject, files changed, additions and deletions"],
  ["Note", "Commit history is evidence of recorded development work; non-committed work is not represented."]
];

log.getRange("A1:J1").values = [["Date", "Month", "Contributor", "Activity type", "Area", "Development activity", "Files changed", "Lines added", "Lines deleted", "Commit"]];
log.getRange(`A2:J${activityRows.length + 1}`).values = activityRows;
log.getRange(`A2:A${activityRows.length + 1}`).setNumberFormat("yyyy-mm-dd");
const table = log.tables.add(`A1:J${activityRows.length + 1}`, true, "DevelopmentActivityLog");
table.style = "TableStyleMedium2";
table.showFilterButton = true;
log.freezePanes.freezeRows(1);

const titleFmt = { font: { name: "Arial", size: 16, bold: true, color: "#1F2937" } };
summary.getRange("A1:H1").format = titleFmt;
summary.getRange("A2:H2").format = { font: { name: "Arial", size: 10, italic: true, color: "#4B5563" }, wrapText: true };
summary.getRange("A4:B4").format = { fill: "#1F4E78", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" } };
summary.getRange("D4:E4").format = { fill: "#1F4E78", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" } };
summary.getRange("A10:D10").format = { fill: "#5B9BD5", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" } };
summary.getRange("F10:G10").format = { fill: "#5B9BD5", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" } };
summary.getRange("A23:B23").format = { fill: "#D9EAF7", font: { name: "Arial", size: 10, bold: true, color: "#1F2937" } };
summary.getRange("D23:E23").format = { fill: "#D9EAF7", font: { name: "Arial", size: 10, bold: true, color: "#1F2937" } };
summary.getRange("A1:H27").format.font = { name: "Arial", size: 10, color: "#1F2937" };
summary.getRange("A1:H1").format = titleFmt;
summary.getRange("A2:H2").format = { font: { name: "Arial", size: 10, italic: true, color: "#4B5563" }, wrapText: true };
summary.getRange("B5:B7").format.font = { name: "Arial", size: 12, bold: true, color: "#1F4E78" };
summary.getRange("E5:E7").format.font = { name: "Arial", size: 12, bold: true, color: "#1F4E78" };
summary.getRange("A4:B7").format.borders = { preset: "outside", style: "thin", color: "#B7C9D6" };
summary.getRange("D4:E7").format.borders = { preset: "outside", style: "thin", color: "#B7C9D6" };
summary.getRange(`A10:D${10 + monthRows.length}`).format.borders = { preset: "outside", style: "thin", color: "#D9E2F3" };
summary.getRange(`F10:G${10 + typeRows.length}`).format.borders = { preset: "outside", style: "thin", color: "#D9E2F3" };
summary.getRange("A1:H27").format.verticalAlignment = "center";
summary.getRange("A1:H27").format.wrapText = false;
summary.getRange("A2:H2").format.wrapText = true;
summary.getRange("A1:H27").format.autofitColumns();
summary.getRange("A1:H27").format.autofitRows();
summary.getRange("A:A").format.columnWidth = 15;
summary.getRange("A:A").format.columnWidth = 23;
summary.getRange("B:B").format.columnWidth = 15;
summary.getRange("C:C").format.columnWidth = 15;
summary.getRange("D:D").format.columnWidth = 18;
summary.getRange("D:D").format.columnWidth = 18;
summary.getRange("E:E").format.columnWidth = 42;
summary.getRange("F:F").format.columnWidth = 24;
summary.getRange("G:G").format.columnWidth = 12;
summary.getRange("A2:H2").format.rowHeight = 30;
summary.getRange("B5:B7").format.numberFormat = "#,##0";
summary.getRange("E5:E6").format.numberFormat = "#,##0";
summary.getRange(`B11:D${10 + monthRows.length}`).format.numberFormat = "#,##0";
summary.getRange(`G11:G${10 + typeRows.length}`).format.numberFormat = "#,##0";
log.getRange(`A1:J${activityRows.length + 1}`).format.font = { name: "Arial", size: 10, color: "#1F2937" };
log.getRange("A1:J1").format = { fill: "#1F4E78", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, wrapText: true, verticalAlignment: "center" };
log.getRange(`A1:J${activityRows.length + 1}`).format.verticalAlignment = "center";
log.getRange(`A2:A${activityRows.length + 1}`).format.numberFormat = "yyyy-mm-dd";
log.getRange(`F2:F${activityRows.length + 1}`).format.wrapText = true;
log.getRange("A:A").format.columnWidth = 13;
log.getRange("B:B").format.columnWidth = 10;
log.getRange("C:C").format.columnWidth = 20;
log.getRange("D:D").format.columnWidth = 23;
log.getRange("E:E").format.columnWidth = 18;
log.getRange("F:F").format.columnWidth = 72;
log.getRange("G:I").format.columnWidth = 13;
log.getRange("J:J").format.columnWidth = 13;
log.getRange("A1:J1").format.rowHeight = 30;

const chart = summary.charts.add("line", summary.getRange(`A10:B${10 + monthRows.length}`));
chart.title = "Development activities by month";
chart.titleTextStyle.typeface = "Arial";
chart.titleTextStyle.fontSize = 12;
chart.hasLegend = false;
chart.setPosition("I4", "P18");

console.log("Workbook built; recalculating");
workbook.recalculate();
console.log("Recalculated; inspecting");
const inspect = await workbook.inspect({ kind: "table", range: "Summary!A1:G27", include: "values,formulas", tableMaxRows: 27, tableMaxCols: 8, maxChars: 9000 });
console.log(inspect.ndjson);
const errors = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 100 }, summary: "final formula error scan" });
console.log(errors.ndjson);
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await fs.mkdir(outputDir, { recursive: true });
await xlsx.save(outputPath);
console.log(`Exported ${outputPath}`);
try {
  const preview = await workbook.render({ sheetName: "Summary", range: "A1:P27", scale: 1, format: "png" });
  await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));
  console.log(`Rendered ${previewPath}`);
} catch (error) {
  console.log(`Preview render skipped: ${error.message}`);
}
console.log(JSON.stringify({ outputPath, previewPath, commits: activityRows.length, contributors, months: monthRows.length }));
