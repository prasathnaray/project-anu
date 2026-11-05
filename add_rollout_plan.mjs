import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "file:///C:/Users/igrs/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const inputPath = "C:/Users/igrs/project-anu/outputs/dev-activities-2026/development-activities-feb-to-date.xlsx";
const outputDir = "C:/Users/igrs/project-anu/outputs/dev-activities-2026";
const outputPath = `${outputDir}/development-activities-feb-to-date.xlsx`;
const previewPath = `${outputDir}/product-rollout-plan-preview.png`;

const workstreams = [
  ["R1", "Product rollout governance", "Turn the current engineering work into a controlled product launch with clear go/no-go decisions.", "Release checklist; environment readiness; rollback plan; ownership and escalation matrix.", "High", "Prasath Narayanan", "Prepare evidence pack, checklist formatting and follow-up tracking.", "All workstreams feed into this gate.", "Nov 5-18", "Approved launch checklist and rollback decision record."],
  ["R2", "Full API functional and regression testing", "Confirm that existing and newly changed APIs work together across user journeys before release.", "Complete API inventory; positive/negative test cases; regression report; defects triaged by severity.", "High", "Prasath Narayanan", "Execute assigned test cases, record evidence and retest fixes.", "Stable test data and environments.", "Nov 5-25", "No unresolved critical or high-severity API defects."],
  ["R3", "Load testing round 1: baseline", "Measure current response time, throughput and resource usage before tuning the system.", "Baseline report covering all APIs; bottleneck list; agreed performance thresholds.", "High", "Prasath Narayanan", "Prepare test data, run repeatable scripts and document results.", "API inventory and representative test data.", "Nov 12-22", "Baseline metrics and prioritized bottleneck list."],
  ["R4", "Load testing round 2: peak traffic", "Test whether the platform can handle expected production concurrency and traffic spikes.", "Peak-load test report; capacity limits; tuning actions; evidence of system behavior under stress.", "Very High", "Prasath Narayanan", "Support execution, monitor test runs and capture failure evidence.", "Round 1 baseline and performance thresholds.", "Dec 1-10", "Peak scenario passes agreed thresholds or has a documented capacity plan."],
  ["R5", "Load testing round 3: soak and failure recovery", "Check stability over sustained usage and confirm the platform recovers from slowdowns or dependency failures.", "Soak test; restart/recovery checks; timeout and retry evidence; final performance sign-off.", "Very High", "Prasath Narayanan", "Run repeat checks and maintain the failure/recovery evidence log.", "Round 2 fixes and monitoring visibility.", "Dec 15-23", "No unacceptable memory, queue, timeout or recovery issues."],
  ["R6", "Encryption-level and data protection testing", "Verify that sensitive data is protected in transit, at rest and through access-controlled flows.", "Encryption configuration review; transport-security checks; storage/access validation; findings and remediation log.", "Very High", "Prasath Narayanan", "Collect configuration evidence and track remediation items.", "Environment access and security test accounts.", "Nov 18-29", "Security findings are closed, accepted or formally risk-owned."],
  ["R7", "Isolate Volume APIs", "Separate the volume functionality so it can be deployed, tested and scaled without destabilizing unrelated product areas.", "Service boundary; isolated routes/models/storage adapters; independent test coverage; deployment notes.", "Very High", "Prasath Narayanan", "Own targeted regression cases and documentation for the isolated boundary.", "API regression coverage and database/storage decisions.", "Nov 20-Dec 12", "Volume flows can be tested and released independently."],
  ["R8", "Database migration hardening", "Make schema changes safer for production by validating ordering, rollback and compatibility with existing code.", "Migration inventory; forward-run and rollback tests; backup/restore check; release sequencing.", "High", "Sai Varshini", "Primary execution owner with Prasath review for high-risk changes.", "Stable staging database and release branch.", "Nov 10-28", "Migrations run predictably with a tested rollback path."],
  ["R9", "Code readability and maintainability", "Reduce future defect risk and make the codebase easier for the team to review, support and extend.", "Readability pass on high-change modules; duplication cleanup; naming/documentation improvements; review checklist.", "Medium", "Sai Varshini", "Primary owner for scoped cleanup and documentation; escalate architecture changes.", "Focus on modules touched by rollout work.", "Nov 12-Dec 5", "Reviewed cleanup changes with no behavior regression."],
  ["R10", "Microfrontend scaling plan", "Prepare the frontend for independent ownership and deployment as the product grows.", "Boundary proposal; shared-component rules; deployment/versioning approach; migration sequence for priority screens.", "Very High", "Prasath Narayanan", "Document current dependencies and identify candidate modules for later separation.", "Frontend dependency map and release constraints.", "Dec 1-Jan 4", "Approved scaling design and prioritized migration backlog."],
  ["R11", "Microservices and API re-engineering", "Restructure high-change backend areas so they can scale and be maintained independently instead of growing as one tightly coupled system.", "Service-boundary assessment; API contract cleanup; dependency map; phased re-engineering plan.", "Very High", "Prasath Narayanan", "Support API inventory, contract documentation and low-risk refactoring tasks.", "Volume isolation findings and load-test bottlenecks.", "Dec 5-Jan 4", "Architecture decision record and sequenced implementation plan."],
  ["R12", "Cache enablement", "Improve response times and reduce repeated database work for frequently requested data.", "Cache candidate list; invalidation rules; stale-data policy; performance comparison before/after.", "High", "Prasath Narayanan", "Implement or test scoped cache candidates after rules are approved.", "Load-test evidence and data freshness requirements.", "Dec 8-Dec 23", "Measured improvement with no unacceptable stale-data behavior."],
  ["R13", "Queues and asynchronous processing", "Move long-running or retryable work out of user-facing requests so the product stays responsive and resilient.", "Queue candidate list; retry/dead-letter rules; idempotency checks; monitoring and operational runbook.", "Very High", "Prasath Narayanan", "Document candidate workflows and test consumer behavior for assigned queues.", "Service boundaries, failure scenarios and monitoring.", "Dec 15-Jan 4", "Priority workflows have an approved queue design and implementation backlog."],
];

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.add("Product Rollout Plan");
sheet.showGridLines = false;
sheet.tabColor = "#1F4E78";

sheet.getRange("A1:J1").merge();
sheet.getRange("A1").values = [["Two-month product rollout engineering plan"]];
sheet.getRange("A2:J2").merge();
sheet.getRange("A2").values = [["Manager view: the next two months cover product launch validation, security, performance, architecture and operational scaling. The work is sequenced by risk and can run in parallel where ownership is clear."]];

sheet.getRange("A4:B8").values = [
  ["Planning signal", "Manager-friendly interpretation"],
  ["Product stage", "Moving from feature delivery toward a production-ready product rollout."],
  ["Validation depth", "Full API testing plus 3 load-testing rounds: baseline, peak traffic, and sustained-use/recovery."],
  ["Engineering layers", "Frontend, backend, APIs, database migrations, security, performance and operations."],
  ["Parallel ownership", "High-risk architecture and performance work stays with Prasath; scoped execution can be delegated to Sai Varshini."],
];
sheet.getRange("D4:E8").values = [
  ["Planning metric", "Value"],
  ["Planned workstreams", null],
  ["Very high complexity items", null],
  ["Load-testing rounds", 3],
  ["Primary execution owners", 2],
];
sheet.getRange("E5").formulas = [["=COUNTA(A11:A23)"]];
sheet.getRange("E6").formulas = [["=COUNTIF(E11:E23,\"Very High\")"]];

sheet.getRange("A10:J10").values = [["ID", "Workstream", "Why it matters to the product", "Deliverables and evidence", "Complexity", "Primary owner", "Proposed Sai Varshini contribution", "Dependencies / risk", "Target window", "Definition of done"]];
sheet.getRange(`A11:J${workstreams.length + 10}`).values = workstreams;
const table = sheet.tables.add(`A10:J${workstreams.length + 10}`, true, "ProductRolloutWorkstreams");
table.style = "TableStyleMedium2";
table.showFilterButton = true;
sheet.freezePanes.freezeRows(10);

sheet.getRange("A1:J1").format = { font: { name: "Arial", size: 16, bold: true, color: "#1F2937" } };
sheet.getRange("A2:J2").format = { font: { name: "Arial", size: 10, italic: true, color: "#4B5563" }, wrapText: true };
sheet.getRange("A4:B4").format = { fill: "#1F4E78", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, wrapText: true };
sheet.getRange("D4:E4").format = { fill: "#1F4E78", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, wrapText: true };
sheet.getRange("A10:J10").format = { fill: "#1F4E78", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, wrapText: true, verticalAlignment: "center" };
sheet.getRange("A1:J24").format.font = { name: "Arial", size: 10, color: "#1F2937" };
sheet.getRange("A1:J1").format = { font: { name: "Arial", size: 16, bold: true, color: "#1F2937" } };
sheet.getRange("A2:J2").format = { font: { name: "Arial", size: 10, italic: true, color: "#4B5563" }, wrapText: true };
sheet.getRange("A4:B4").format = { fill: "#1F4E78", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" } };
sheet.getRange("D4:E4").format = { fill: "#1F4E78", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" } };
sheet.getRange("D5:E8").format.borders = { preset: "outside", style: "thin", color: "#B7C9D6" };
sheet.getRange("A4:B8").format.borders = { preset: "outside", style: "thin", color: "#B7C9D6" };
sheet.getRange("E5:E8").format.font = { name: "Arial", size: 12, bold: true, color: "#1F4E78" };
sheet.getRange(`A11:J${workstreams.length + 10}`).format = { font: { name: "Arial", size: 10, color: "#1F2937" }, wrapText: true, verticalAlignment: "center" };
sheet.getRange("A1:J24").format.verticalAlignment = "center";
sheet.getRange("A2:J2").format.rowHeight = 32;
sheet.getRange("A10:J10").format.rowHeight = 42;
sheet.getRange("A:A").format.columnWidth = 8;
sheet.getRange("B:B").format.columnWidth = 29;
sheet.getRange("C:C").format.columnWidth = 42;
sheet.getRange("D:D").format.columnWidth = 47;
sheet.getRange("E:E").format.columnWidth = 15;
sheet.getRange("F:F").format.columnWidth = 22;
sheet.getRange("G:G").format.columnWidth = 42;
sheet.getRange("H:H").format.columnWidth = 38;
sheet.getRange("I:I").format.columnWidth = 16;
sheet.getRange("J:J").format.columnWidth = 42;

workbook.recalculate();
const inspect = await workbook.inspect({ kind: "table", range: "Product Rollout Plan!A1:J24", include: "values,formulas", tableMaxRows: 24, tableMaxCols: 10, maxChars: 12000 });
console.log(inspect.ndjson);
const errors = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 100 }, summary: "final formula error scan" });
console.log(errors.ndjson);
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await fs.mkdir(outputDir, { recursive: true });
await xlsx.save(outputPath);
console.log(`Exported ${outputPath}`);
const preview = await workbook.render({ sheetName: "Product Rollout Plan", range: "A1:J24", scale: 1, format: "png" });
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));
console.log(JSON.stringify({ outputPath, previewPath, workstreams: workstreams.length }));
