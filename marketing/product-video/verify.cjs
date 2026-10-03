// Verify the actual exported media and the review player in a real browser.
// Usage: NODE_PATH=<path-to-node_modules> node verify.cjs
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const page = await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:1});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/');
  await page.locator('video').evaluate(async v=>{
    if(v.readyState<1) await new Promise((resolve,reject)=>{v.addEventListener('loadedmetadata',resolve,{once:true});v.addEventListener('error',()=>reject(new Error('Media failed to load')),{once:true});});
  });
  const master=await page.locator('video').evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight,error:v.error?.message||null}));
  if(Math.abs(master.duration-45)>.15||master.width!==1920||master.height!==1080||master.error)throw new Error(JSON.stringify(master));
  await page.getByRole('button',{name:'Progress',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('video').currentTime>=25);
  await page.locator('video').evaluate(async v=>{v.pause();v.currentTime=29;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));});
  await page.waitForFunction(()=>document.querySelector('video').currentTime>=28.9 && document.querySelector('video').readyState>=4);
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  await page.screenshot({path:path.join(__dirname,'player-preview.jpg'),fullPage:true,type:'jpeg',quality:92});
  await page.locator('video').evaluate(async v=>{v.src='anu-product-demo-v2-web.mp4';v.load();await new Promise((resolve,reject)=>{v.addEventListener('loadedmetadata',resolve,{once:true});v.addEventListener('error',()=>reject(new Error('Web media failed')),{once:true});});});
  const web=await page.locator('video').evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight,error:v.error?.message||null}));
  if(Math.abs(web.duration-45)>.15||web.width!==1920||web.height!==1080||web.error)throw new Error(JSON.stringify(web));
  await page.setViewportSize({width:390,height:844});
  const mobile=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
  if(mobile.scrollWidth>mobile.width)throw new Error('Mobile player overflows');
  if(errors.length)throw new Error(errors.join('\n'));
  const report={master,web,mobile,chapterNavigation:'passed',browserErrors:errors};
  fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
