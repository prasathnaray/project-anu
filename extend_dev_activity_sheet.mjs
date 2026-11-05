import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { FileBlob, SpreadsheetFile } from "file:///C:/Users/igrs/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const inputPath = "C:/Users/igrs/project-anu/outputs/dev-activities-2026/development-activities-feb-to-date.xlsx";
const outputDir = "C:/Users/igrs/project-anu/outputs/dev-activities-2026";
const outputPath = `${outputDir}/development-activities-feb-to-date.xlsx`;
const previewPath = `${outputDir}/file-changes-preview.png`;

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

function scope(file) {
  if (file.startsWith("client/")) return "Frontend";
  if (file.startsWith("server/")) return "Backend";
  if (file.startsWith("APIs/")) return "API";
  if (file.startsWith("postman/")) return "Postman";
  if (file.startsWith("scratch/")) return "Tooling";
  return "Project / Config";
}

function parseFileChanges() {
  const raw = execFileSync("git", [
    "log", "--all", "--since=2026-02-01", "--until=2026-11-06",
    "--date=short", "--pretty=format:__COMMIT__%H|%ad|%an|%s", "--numstat", "--no-merges"
  ], { cwd: "C:/Users/igrs/project-anu", encoding: "utf8", maxBuffer: 80 * 1024 * 1024 });
  const rows = [];
  let current = null;
  for (const line of raw.split(/\r?\n/)) {
    if (line.startsWith("__COMMIT__")) {
      const [hash, date, author, ...subjectParts] = line.slice("__COMMIT__".length).split("|");
      current = { hash, date, author, subject: subjectParts.join("|") };
    } else if (current) {
      const match = line.match(/^(\d+|-)\t(\d+|-)\t(.+)$/);
      if (!match) continue;
      const [_, addedRaw, deletedRaw, file] = match;
      rows.push([
        new Date(`${current.date}T00:00:00Z`), current.date.slice(0, 7), current.author,
        classify(current.subject), scope(file), current.subject, file,
        addedRaw === "-" ? null : Number(addedRaw), deletedRaw === "-" ? null : Number(deletedRaw), current.hash.slice(0, 10)
      ]);
    }
  }
  return rows.sort((a, b) => a[0] - b[0] || a[9].localeCompare(b[9]) || a[6].localeCompare(b[6]));
}

const fileRows = parseFileChanges();
console.log(`Parsed ${fileRows.length} file-level changes`);
const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
await fs.mkdir(outputDir, { recursive: true });

const sheet = workbook.worksheets.add("File Changes");
sheet.showGridLines = false;
sheet.tabColor = "#5B9BD5";
sheet.getRange("A1:J1").merge();
sheet.getRange("A1").values = [["File-level development changes"]];
sheet.getRange("A2:J2").merge();
sheet.getRange("A2").values = [["Every recorded file change from the repository history. Binary files have blank line counts because Git does not report numeric additions/deletions for them."]];
sheet.getRange("A4:J4").values = [["Date", "Month", "Contributor", "Activity type", "Area", "Change summary", "Changed file", "Lines added", "Lines deleted", "Commit"]];
sheet.getRange(`A5:J${fileRows.length + 4}`).values = fileRows;
sheet.getRange(`A5:A${fileRows.length + 4}`).setNumberFormat("yyyy-mm-dd");
const table = sheet.tables.add(`A4:J${fileRows.length + 4}`, true, "FileChangeRegister");
table.style = "TableStyleMedium2";
table.showFilterButton = true;
sheet.freezePanes.freezeRows(4);

sheet.getRange("A1:J1").format = { font: { name: "Arial", size: 16, bold: true, color: "#1F2937" } };
sheet.getRange("A2:J2").format = { font: { name: "Arial", size: 10, italic: true, color: "#4B5563" }, wrapText: true };
sheet.getRange("A4:J4").format = { fill: "#1F4E78", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, wrapText: true, verticalAlignment: "center" };
sheet.getRange(`A5:J${fileRows.length + 4}`).format = { font: { name: "Arial", size: 10, color: "#1F2937" }, verticalAlignment: "center" };
sheet.getRange(`A5:A${fileRows.length + 4}`).format.numberFormat = "yyyy-mm-dd";
sheet.getRange(`F5:G${fileRows.length + 4}`).format.wrapText = true;
sheet.getRange(`H5:I${fileRows.length + 4}`).format.numberFormat = "#,##0";
sheet.getRange("A:A").format.columnWidth = 13;
sheet.getRange("B:B").format.columnWidth = 10;
sheet.getRange("C:C").format.columnWidth = 20;
sheet.getRange("D:D").format.columnWidth = 23;
sheet.getRange("E:E").format.columnWidth = 18;
sheet.getRange("F:F").format.columnWidth = 64;
sheet.getRange("G:G").format.columnWidth = 58;
sheet.getRange("H:I").format.columnWidth = 13;
sheet.getRange("J:J").format.columnWidth = 13;
sheet.getRange("A1:J1").format.rowHeight = 26;
sheet.getRange("A2:J2").format.rowHeight = 30;
sheet.getRange("A4:J4").format.rowHeight = 30;

workbook.recalculate();
const inspect = await workbook.inspect({ kind: "table", range: "File Changes!A1:J10", include: "values,formulas", tableMaxRows: 10, tableMaxCols: 10, maxChars: 8000 });
console.log(inspect.ndjson);
const errors = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 100 }, summary: "final formula error scan" });
console.log(errors.ndjson);
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);
console.log(`Exported ${outputPath}`);
const preview = await workbook.render({ sheetName: "File Changes", range: "A1:J15", scale: 1, format: "png" });
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));
console.log(JSON.stringify({ outputPath, previewPath, fileRows: fileRows.length }));
