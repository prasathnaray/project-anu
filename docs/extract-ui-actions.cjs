const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const parser = require(path.join(root, 'client/node_modules/@babel/parser'));
const traverse = require(path.join(root, 'client/node_modules/@babel/traverse')).default;
const src = path.join(root, 'client/src');
const files = [];
function walk(dir) { for (const e of fs.readdirSync(dir, {withFileTypes:true})) { const p=path.join(dir,e.name); if(e.isDirectory()) walk(p); else if(/\.js$/.test(p)&&! /\.test\.js$/.test(p)) files.push(p); } }
walk(src);
const data=[];
const dependencies={};
for (const file of files) {
 const code=fs.readFileSync(file,'utf8'); let ast;
 try { ast=parser.parse(code,{sourceType:'module',plugins:['jsx']}); } catch { continue; }
 const cut=n=>n ? code.slice(n.start,n.end) : '';
 const rel=path.relative(root,file).replace(/\\/g,'/');
 dependencies[rel]=[];
 traverse(ast,{ImportDeclaration(p){if(!p.node.source.value.startsWith('.'))return; if(!p.node.specifiers.some(s=>p.scope.getBinding(s.local.name)?.referenced))return; const base=path.resolve(path.dirname(file),p.node.source.value);const resolved=[base,base+'.js',path.join(base,'index.js')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());if(resolved)dependencies[rel].push(path.relative(root,resolved).replace(/\\/g,'/'));}});
 const strings=n=>{if(!n)return ''; if(n.type==='JSXText')return n.value.replace(/\s+/g,' ').trim(); if(n.type==='StringLiteral')return n.value; if(n.type==='JSXExpressionContainer'){const e=n.expression; if(e.type==='StringLiteral')return e.value; if(e.type==='ConditionalExpression')return strings(e.consequent)+' / '+strings(e.alternate);return '';} if(n.type==='JSXElement')return n.children.map(strings).filter(Boolean).join(' '); return '';};
 traverse(ast,{JSXOpeningElement(p){
  const n=p.node, tag=cut(n.name); const attrs=n.attributes.filter(a=>a.type==='JSXAttribute');
  const attr=name=>attrs.find(a=>a.name.name===name);
  const val=name=>{const a=attr(name);return a ? strings(a.value)||cut(a.value).replace(/^\{|\}$/g,'') : '';};
  const event=attrs.filter(a=>/^on[A-Z]/.test(a.name.name));
  const native=/^(button|a|input|select|textarea|Button|IconButton|MenuItem|Tab|Pagination|TablePagination|Calendar)$/.test(tag);
  if(!event.length && !native && !attr('to') && !attr('href'))return;
  const element=p.parentPath.node;
  const label=val('aria-label')||val('title')||strings(element)||val('label')||val('placeholder')||val('name')||val('id')||tag;
  const events=[];
  for(const a of event){
   const ex=a.value?.expression; let handler=cut(ex), expanded=handler;
   if(ex?.type==='Identifier'){const b=p.scope.getBinding(ex.name); if(b){expanded=cut(b.path.node);}}
   else if(ex){const ids=[...new Set(handler.match(/\b(?:handle\w+|\w+API|save\w*|submit\w*|create\w*|delete\w*|update\w*|fetch\w*)\b/g)||[])]; for(const id of ids){const b=p.scope.getBinding(id);if(b)expanded+='\n'+cut(b.path.node);}}
   events.push({event:a.name.name,handler,expanded});
  }
  const conditions=[];let anc=p.parentPath;for(let i=0;anc&&i<6;i++,anc=anc.parentPath){if(anc.node.type==='ConditionalExpression')conditions.push(cut(anc.node.test));if(anc.node.type==='LogicalExpression'&&anc.node.operator==='&&')conditions.push(cut(anc.node.left));}
  data.push({file:path.relative(root,file).replace(/\\/g,'/'),line:n.loc.start.line,tag,label:label.slice(0,180),type:val('type'),to:val('to')||val('href'),disabled:val('disabled'),conditions,events});
 }});
}
const reachable=new Set();
function visit(f){if(reachable.has(f))return;reachable.add(f);for(const dep of dependencies[f]||[])visit(dep);}
visit('client/src/App.js');
for(const a of data)a.reachable=reachable.has(a.file);
fs.writeFileSync(path.join(__dirname,'ANU_UI_ACTION_INVENTORY.json'),JSON.stringify(data,null,2));
const rows=data.filter(a=>a.events.some(e=>e.event!=='onChange')||a.to||a.type==='submit');
const compact=rows.map(a=>`${a.file}:${a.line} | ${a.label} | ${a.events.map(e=>e.handler).join('; ').replace(/\s+/g,' ').slice(0,230)}${a.to?' -> '+a.to:''}`);
fs.writeFileSync(path.join(__dirname,'ANU_UI_ACTION_INDEX.txt'),compact.join('\n'));
console.log(JSON.stringify({allControls:data.length,clickSubmitLinkControls:rows.length,files:new Set(data.map(a=>a.file)).size}));
