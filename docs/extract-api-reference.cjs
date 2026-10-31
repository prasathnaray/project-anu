const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const parser=require(path.join(root,'client/node_modules/@babel/parser'));
const cache=new Map();
function walk(n,fn){if(!n||typeof n!=='object')return;if(n.type)fn(n);for(const [k,v] of Object.entries(n)){if(['loc','start','end','tokens','comments','leadingComments','trailingComments'].includes(k))continue;if(Array.isArray(v))v.forEach(x=>walk(x,fn));else if(v&&typeof v==='object')walk(v,fn);}}
function name(n){return n?.name||n?.value||'';}
function prop(n){return n?.computed?name(n.property):n?.property?.name;}
function resolve(base,s){if(!s?.startsWith('.'))return null;const p=path.resolve(path.dirname(base),s);return [p,p+'.js',path.join(p,'index.js')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile())||null;}
function moduleInfo(file){if(cache.has(file))return cache.get(file);const code=fs.readFileSync(file,'utf8');let ast;try{ast=parser.parse(code,{sourceType:'unambiguous',plugins:['jsx']});}catch(e){return null;}
const m={file,code,ast,defs:{},imports:{},exports:{},routes:[],mounts:[],routerUse:[]};cache.set(file,m);
walk(ast,n=>{
 if(n.type==='FunctionDeclaration'&&n.id)m.defs[n.id.name]=n;
 if(n.type==='VariableDeclarator'){
  if(n.id.type==='Identifier')m.defs[n.id.name]=n.init;
  if(n.init?.type==='CallExpression'&&n.init.callee.name==='require'){
   const target=resolve(file,n.init.arguments[0]?.value);
   if(target){if(n.id.type==='Identifier')m.imports[n.id.name]={file:target,member:'default'};
   if(n.id.type==='ObjectPattern')for(const p of n.id.properties){if(p.type==='ObjectProperty')m.imports[name(p.value)]={file:target,member:name(p.key)};}}
  }
 }
 if(n.type==='AssignmentExpression'){
  const left=n.left;
  if(left.type==='MemberExpression'&&left.object.name==='module'&&prop(left)==='exports'){
   if(n.right.type==='ObjectExpression')for(const p of n.right.properties){if(p.type==='ObjectProperty'||p.type==='ObjectMethod')m.exports[name(p.key)]=p.value||p;}
   else m.exports.default=n.right;
  }else if(left.type==='MemberExpression'&&left.object.type==='MemberExpression'&&left.object.object.name==='module'&&prop(left.object)==='exports')m.exports[prop(left)]=n.right;
  else if(left.type==='MemberExpression'&&left.object.name==='exports')m.exports[prop(left)]=n.right;
 }
 if(n.type==='CallExpression'&&n.callee.type==='MemberExpression'){
  const meth=prop(n.callee),obj=n.callee.object.name,args=n.arguments;
  if(['get','post','put','patch','delete','head','options','all'].includes(meth)&&args[0]?.type==='StringLiteral'&&obj&&/app|route/i.test(obj))m.routes.push({method:meth.toUpperCase(),route:args[0].value,nodes:args.slice(1),line:n.loc.start.line,obj});
  if(meth==='use'&&obj==='app'&&args[0]?.type==='StringLiteral')m.mounts.push({prefix:args[0].value,nodes:args.slice(1),line:n.loc.start.line});
  if(meth==='use'&&obj!=='app'&&obj&&/router/i.test(obj))m.routerUse.push({nodes:args,line:n.loc.start.line});
 }
});return m;}
function resolveNode(m,n,seen=new Set()){
 if(!n)return null;
 if(n.type==='Identifier'){
  if(seen.has(m.file+'#'+n.name))return null;seen.add(m.file+'#'+n.name);
  if(m.imports[n.name]){const im=m.imports[n.name],other=moduleInfo(im.file);return other?resolveNode(other,other.exports[im.member]||other.defs[im.member],seen):null;}
  if(m.defs[n.name])return resolveNode(m,m.defs[n.name],seen);
 }
 if(n.type==='MemberExpression'&&n.object.type==='Identifier'&&m.imports[n.object.name]){const other=moduleInfo(m.imports[n.object.name].file);return other?resolveNode(other,other.exports[prop(n)]||other.defs[prop(n)],seen):null;}
 return {m,n};
}
function snippet(m,n){return n?m.code.slice(n.start,n.end):'';}
function analyze(m,n,output,depth=0,seen=new Set(),inputAliases={}){
 const r=resolveNode(m,n);if(!r)return;const id=r.m.file+':'+r.n.start;if(seen.has(id))return;seen.add(id);m=r.m;n=r.n;
 if(depth===0)output.handlers.push({file:path.relative(root,m.file).replace(/\\/g,'/'),line:n.loc?.start.line||1});
 const aliases={...inputAliases};
 const reqNames=new Set(['req','request']);
 const kindOf=v=>{if(v?.type==='LogicalExpression')return kindOf(v.left)||kindOf(v.right);if(v?.type==='Identifier')return aliases[v.name];if((v?.type==='MemberExpression'||v?.type==='OptionalMemberExpression')&&reqNames.has(v.object?.name)&&['body','query','params','headers','files'].includes(prop(v)))return prop(v);return null;};
 walk(n,node=>{if(node.type==='VariableDeclarator'&&node.id.type==='Identifier'){const kind=kindOf(node.init);if(kind)aliases[node.id.name]=kind;}});
 walk(n,node=>{
  if(node.type==='MemberExpression'||node.type==='OptionalMemberExpression'){
   const ob=node.object;const kind=kindOf(ob);if(kind)output[kind].add(prop(node));
  }
  if(node.type==='VariableDeclarator'&&node.id.type==='ObjectPattern'){
   const v=node.init;
   const kind=kindOf(v);
   if(kind&&output[kind])for(const p of node.id.properties)if(p.type==='ObjectProperty')output[kind].add(name(p.key));
  }
  if(node.type==='CallExpression'||node.type==='OptionalCallExpression'){
   const c=node.callee;
   if(c?.type==='MemberExpression'&&c.object?.name==='res'&&prop(c)==='status'&&node.arguments[0]?.type==='NumericLiteral')output.status.add(node.arguments[0].value);
   if(c?.type==='MemberExpression'&&['single','array','fields'].includes(prop(c))){
    if(['single','array'].includes(prop(c))&&node.arguments[0]?.type==='StringLiteral')output.upload.add(node.arguments[0].value+(prop(c)==='array'?'[]':''));
    if(prop(c)==='fields'&&node.arguments[0]?.type==='ArrayExpression')for(const f of node.arguments[0].elements||[]){const p=f?.properties?.find(x=>name(x.key)==='name');if(p?.value?.value)output.upload.add(p.value.value);}
   }
   if(depth<3&&(c?.type==='Identifier'||c?.type==='MemberExpression')){
    const target=resolveNode(m,c);if(target&&target.n!==c&&['ArrowFunctionExpression','FunctionExpression','FunctionDeclaration','ObjectMethod'].includes(target.n.type)){
     const mapped={};for(let i=0;i<node.arguments.length;i++){const kind=kindOf(node.arguments[i]);const param=target.n.params?.[i];if(kind&&param?.type==='Identifier')mapped[param.name]=kind;if(kind&&param?.type==='ObjectPattern')for(const p of param.properties)if(p.type==='ObjectProperty')output[kind].add(name(p.key));}
     analyze(target.m,target.n,output,depth+1,seen,mapped);
    }
   }
  }
 });
}
const services=[['Main LMS','server/v1/app.js'],['Medica companion','Medica/v1/app.js']];
const endpoints=[],unused=[];
for(const [service,entry] of services){const app=moduleInfo(path.join(root,entry));const mounted=new Set();
function add(m,r,prefix,auth){
 const out={body:new Set(),query:new Set(),params:new Set(),headers:new Set(),files:new Set(),upload:new Set(),status:new Set(),handlers:[]};
 for(const n of r.nodes)analyze(m,n,out);
 const full=('/'+[prefix,r.route].join('/')).replace(/\/+/g,'/').replace(/\/$/,'')||'/';
 for(const match of full.matchAll(/:([A-Za-z_]\w*)/g))out.params.add(match[1]);
 const middleware=r.nodes.slice(0,-1).map(n=>snippet(m,n));
 const localUses=m.routerUse.filter(u=>u.line<r.line).flatMap(u=>u.nodes.map(n=>snippet(m,n)));
 const texts=[...middleware,...localUses];
 let mode=auth?'Bearer token':'No shared bearer middleware';
 if(texts.some(t=>/\bAuthenticate\b/.test(t)))mode='Bearer token';
 if(texts.some(t=>/\bsoftAuth\b/.test(t)))mode='Optional decoded token';
 if(/refresh-token/i.test(full))mode='Refresh-token cookie / handler check';
 endpoints.push({service,method:r.method,endpoint:full,auth:mode,routeFile:path.relative(root,m.file).replace(/\\/g,'/'),routeLine:r.line,handlerExpression:snippet(m,r.nodes[r.nodes.length-1]),middleware:middleware.map(t=>t.replace(/\s+/g,' ')),...Object.fromEntries(Object.entries(out).map(([k,v])=>[k,v instanceof Set?[...v].filter(Boolean).sort():v]))});
}
for(const r of app.routes)add(app,r,'',r.nodes.some(n=>n.name==='Authenticate'));
for(const mount of app.mounts){
 const auth=mount.nodes.some(n=>n.name==='Authenticate');
 for(const n of mount.nodes){const imp=app.imports[n.name];if(!imp||!/routes[\\/]/.test(imp.file))continue;mounted.add(imp.file);const rm=moduleInfo(imp.file);for(const r of rm.routes)add(rm,r,mount.prefix,auth);}
}
const dir=path.join(path.dirname(app.file),'routes');
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.js'))){const file=path.join(dir,f);if(mounted.has(file))continue;const rm=moduleInfo(file);for(const r of rm?.routes||[])unused.push({service,file:path.relative(root,file).replace(/\\/g,'/'),method:r.method,relativeRoute:r.route,line:r.line});}
}
const result={generated:'2026-10-30',endpoints,unmounted:unused};
fs.writeFileSync(path.join(__dirname,'ANU_API_INVENTORY.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify({byService:Object.fromEntries(services.map(([s])=>[s,endpoints.filter(e=>e.service===s).length])),unmounted:unused.length,unresolved:endpoints.filter(e=>!e.handlers.length).map(e=>e.endpoint)}));
