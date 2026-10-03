// Capture the actual local React UI with isolated fictional API fixtures.
// Network calls outside the local development server are intercepted.
const fs=require('fs');const path=require('path');const {chromium}=require('playwright');
const OUT=path.join(__dirname,'captures');fs.mkdirSync(OUT,{recursive:true});
const C='btc-demo';const now='2026-10-01T08:00:00Z';
const defs=[
 ['Fetal Head','Transthalamic Plane','Learning Resource'],
 ['Fetal Head','Bi-Parietal Diameter','Learning Resource'],
 ['Fetal Head','Head Circumference','Learning Resource'],
 ['Anatomical Landmarks','Anatomical Landmarks of the Transthalamic Plane','Learning Resource'],
 ['Anatomical Landmarks','MindSparks - Quiz','Learning Resource'],
 ['Imaging the Transthalamic Plane','Imaging the plane','Learning Resource'],
 ['Imaging the Transthalamic Plane','MindSparks - Probe movements','Learning Resource'],
 ['Measurement','How to measure BPD','Learning Resource'],
 ['Measurement','How to measure HC','Learning Resource'],
 ['Image Diagnosis','Image Diagnosis','Learning Resource'],
 ['OB Boosters','Picture Pick','Learning Resource'],
 ['', 'Practice 1','Practice'],['','Practice 2','Practice'],['','Practice 3','Practice'],['','Practice 4','Practice'],
 ['', 'Find the Image','Image Interpretation'],['','Annotation 1','Image Interpretation'],['','Measurement','Image Interpretation'],
 ['', 'Test 1','Test'],['','Test 2','Test']
];
let data=[];
for(const [m,unit] of ['BPD & HC','AC','FL'].entries())for(const [i,[topic,name,type]] of defs.entries())data.push({certificate_id:C,certificate_name:'BTC',learning_module_id:'module-'+m,course_name:'Second Trimester',module_name:'Biometry',unit_name:unit,resource_id:`r-${m}-${i}`,resource_name:name,resource_type:type,resource_topic:topic,display_order:i+1,is_hidden:false,is_completed:i<(m===0?12:m===1?7:3),updated_at:now,user_name:'Demo Learner',user_role:'103',user_mail:'demo@example.invalid'});
const profile={data,currentBatches:[{batch_id:'demo-batch',batch_name:'Ultrasound Training · Demo',batch_status:'current',batch_end_date:'2027-06-30',certification_data:[C]}],certificates:[{certificate_id:C,certificate_name:'BTC'}],instructors:[],completedBatches:[],testQuery:[],reAttempts:[],moduleCompletion:['BPD & HC','AC','FL'].map((n,i)=>({certificate_id:C,learning_module_id:'module-'+i,course_name:'Second Trimester',module_name:'Biometry',unit_name:n,total_resources:20,completed_resources:[12,7,3][i],completion_percentage:[60,35,15][i],is_completed:false})),latestProgress:data[4],nextModule:{learning_module_id:'module-1',unit_name:'AC',module_name:'Biometry',course_name:'Second Trimester'}};
const questions=[{question_id:'demo-q1',question_no:1,prompt:'Which module covers fetal head biometry?',question_type:'MCQ',options:[{key:'A',text:'BPD & HC'},{key:'B',text:'AC'},{key:'C',text:'FL'}],assets:[]},{question_id:'demo-q2',question_no:2,prompt:'Which resource would you review before practicing a measurement?',question_type:'MCQ',options:[{key:'A',text:'How to measure BPD'},{key:'B',text:'Course schedule'},{key:'C',text:'Profile settings'}],assets:[]}];
const activities=[{resource_id:'r-0-4',resource_type:'Learning Resource',resource_topic:'Anatomical Landmarks',total_questions:2,correct_answers:2,wrong_answers:0,score_percentage:100,attempt_count:2,session_date:now,session_id:'demo-session',configured_question_count:2}];
const metrics={attemptsConsidered:12,metrics:{accuracy:{value:78,prev:70},timePerTask:{value:4.2,prev:5.2},errorRate:{value:18,prev:24},consistency:{value:82,label:'High'}}};
const competency={attemptsConsidered:12,overall:{score:76,level:'Intermediate',confidence:{level:'High'}},skills:[['probe','Probe Handling',78,'Intermediate'],['plane','Plane Acquisition',86,'Advanced'],['biometry','Fetal Biometry',75,'Intermediate'],['anatomy','Anatomy Identification',64,'Intermediate']].map(([key,skill,score,level])=>({key,skill,score,level,trend:'up',confidence:{level:'High',score:85}})),weakestSkill:{skill:'Anatomy Identification',score:64}};
function payload(url){
 if(url.includes('/trainee/'))return profile;
 if(url.includes('batch') && url.includes('demo-batch'))return {batchInfo:{certificates:[{certificate_id:C,certificate_name:'BTC'}]}};
 if(url.includes('mind-spark-attempt-details'))return {summary:{correct_answers:2,total_questions:2,wrong_answers:0,score_percentage:100},data:questions.map(q=>({...q,correct_answer:{key:'A'},option_chosen:'A',is_correct:true}))};
 if(url.includes('mind-spark-questions'))return {data:questions};
 if(url.includes('activity-last-scores'))return {data:activities};
 if(url.includes('performance-metrics'))return metrics;
 if(url.includes('skill-competency'))return competency;
 if(url.includes('quer'))return {result:[],total:0};
 return {data:[],result:[],notifications:[],total:0};
}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const context=await browser.newContext({viewport:{width:1440,height:810},deviceScaleFactor:2});
 await context.route('**/*',route=>{
  const u=route.request().url();
  if(u.includes('/api/')||u.includes('supabase.co'))return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(payload(u))});
  if(u.startsWith('http://localhost:3017/')||u.startsWith('data:'))return route.continue();
  return route.abort();
 });
 await context.addInitScript(()=>{const token=btoa(JSON.stringify({alg:'none',typ:'JWT'}))+'.'+btoa(JSON.stringify({role:103,id:'demo-learner',sub:'demo-learner',sid:'local-video-only',exp:4102444800,name:'Demo Learner'}))+'.local-demo';localStorage.setItem('user_token',token);localStorage.setItem('people_id','demo-learner');localStorage.setItem('isVr','false');sessionStorage.setItem('user_name','Demo Learner');});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const manifest={viewport:{width:1440,height:810},screens:{},actions:{},errors};
 async function shot(name){await page.screenshot({path:path.join(OUT,name+'.png'),animations:'disabled'});manifest.screens[name]=name+'.png';console.log('Captured',name);}
 async function click(name,locator){await locator.waitFor({state:'visible'});const r=await locator.boundingBox();manifest.actions[name]={x:r.x+r.width/2,y:r.y+r.height/2};await locator.click();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
 await page.goto('http://localhost:3017/my-learning');
 await page.addStyleTag({content:'body{font-family:Segoe UI,Arial,sans-serif!important} *{caret-color:transparent!important}'});
 await page.getByText('BPD & HC',{exact:true}).first().waitFor();
 await shot('learning');
 console.log((await page.locator('body').innerText()).slice(0,2200));
 await click('anatomy',page.getByRole('button').filter({hasText:'Anatomical Landmarks'}).first());
 await shot('anatomy');
 await click('questions',page.getByRole('button',{name:'View Questions',exact:true}).first());
 await page.getByText(questions[0].prompt,{exact:true}).waitFor();
 await shot('questions');
 await click('closeQuestions',page.getByRole('button',{name:'Close',exact:true}));
 await click('score',page.getByRole('button',{name:'Score',exact:true}).first());
 await page.getByText('Correct',{exact:true}).first().waitFor();
 await shot('score');
 console.log('MODAL', (await page.locator('body').innerText()).slice(0,1300));
 await page.goto('http://localhost:3017/my-learning');
 await page.addStyleTag({content:'body{font-family:Segoe UI,Arial,sans-serif!important}'});
 await page.getByText('BPD & HC',{exact:true}).first().waitFor();
 await click('practice',page.getByRole('button',{name:'Practice',exact:true}));
 await shot('practice');
 await click('interpret',page.getByRole('button',{name:'Image Interpretation',exact:true}));
 await shot('interpret');
 await page.goto('http://localhost:3017/dashboard');
 await page.addStyleTag({content:'body{font-family:Segoe UI,Arial,sans-serif!important}'});
 await page.getByText('Demo Learner',{exact:true}).first().waitFor();
 await page.getByText('78%',{exact:true}).first().waitFor();
 await shot('dashboard');
 const performance=page.getByText('Performance Metrics',{exact:true});
 await performance.evaluate(el=>{let p=el.parentElement;while(p && !(p.scrollHeight>p.clientHeight && ['auto','scroll'].includes(getComputedStyle(p).overflowY)))p=p.parentElement;if(p)p.scrollTop+=el.getBoundingClientRect().top-p.getBoundingClientRect().top-24;});
 await shot('competency');
 await page.getByText('Learning Path Progress',{exact:true}).evaluate(el=>{let p=el.parentElement;while(p && !(p.scrollHeight>p.clientHeight && ['auto','scroll'].includes(getComputedStyle(p).overflowY)))p=p.parentElement;if(p)p.scrollTop+=el.getBoundingClientRect().top-p.getBoundingClientRect().top-150;});
 await shot('path');
 fs.writeFileSync(path.join(OUT,'manifest.json'),JSON.stringify(manifest,null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
