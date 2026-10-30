const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/igrs/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const root = path.resolve(__dirname, '..', '..');
const source = fs.readFileSync(path.join(root, 'docs', 'PROJECT_ANU_SINGLE_CENTRALIZED_FLOW.mmd'), 'utf8');
const mermaidBundle = fs.readFileSync(path.join(root, 'tmp', 'pdfs', 'mermaid', 'mermaid.min.js'), 'utf8');
const output = path.join(root, 'output', 'pdf', 'project-anu-mermaid-centralized-flowchart.pdf');

const html = `<!doctype html>
<html><head><meta charset="utf-8">
<script>${mermaidBundle}</script>
<style>
html,body{margin:0;padding:0;background:#fff}
body{font-family:Arial,Helvetica,sans-serif}
.page{padding:22px;background:white;display:inline-block}
.title{font-size:24px;font-weight:700;color:#17313B;margin:0 0 5px}
.subtitle{font-size:12px;color:#5B737B;margin:0 0 16px}
.mermaid{display:inline-block}
</style></head>
<body><div class="page">
<div class="title">Project ANU - Single centralized technical flowchart</div>
<div class="subtitle">Admin, Instructor, Trainee and VR headset flow through authentication, LMS services, simulation, storage, streaming and analytics</div>
<div id="diagram" class="mermaid"></div>
</div>
<script>
(async()=>{
  const el = document.getElementById('diagram');
  el.textContent = ${JSON.stringify(source)};
  mermaid.initialize({startOnLoad:false, securityLevel:'loose', flowchart:{htmlLabels:true,curve:'basis',useMaxWidth:false}, theme:'base', themeVariables:{fontFamily:'Arial, Helvetica, sans-serif',fontSize:'13px',primaryTextColor:'#17313B',lineColor:'#17677C',clusterBkg:'#F8FBFC',clusterBorder:'#587078'}});
  await mermaid.run({nodes:[el]});
})();
</script>
</body></html>`;

(async()=>{
  const browser = await chromium.launch({headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const page = await browser.newPage({ viewport: { width: 2400, height: 1800 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('svg') && document.querySelector('svg').getBoundingClientRect().width > 0, null, { timeout: 60000 });
  await page.waitForTimeout(1500);
  const width = await page.locator('.page').evaluate(el => Math.ceil(el.scrollWidth));
  const height = await page.locator('.page').evaluate(el => Math.ceil(el.scrollHeight));
  await page.pdf({ path: output, printBackground: true, width: `${width}px`, height: `${height}px`, pageRanges: '1' });
  console.log(output, width, height);
  await browser.close();
})().catch(err => { console.error(err); process.exit(1); });
