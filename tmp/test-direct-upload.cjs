const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
let signed, stored, size = 20 * 1024 * 1024, valid = true;
const metadata = Object.fromEntries(['volume_type','measurements','plane','volume_name','volume_ga','volume_fetal_presentation','trimester','description'].map(k => [k,k]));
class Command { constructor(input) { this.input = input; } }
const context = { exports: {}, Buffer, console, process: { env: { AWS_S3_BUCKET: 'test', ACCESS_TOKEN_SECRET: 'test' } }, require(name) {
  if (name === '@aws-sdk/client-s3') return { S3Client: class { async send(command) { return command.input.Range ? { Body: { transformToByteArray: async () => Buffer.from('KRETZFILE') } } : { ContentLength: size }; } }, PutObjectCommand: Command, HeadObjectCommand: Command, GetObjectCommand: Command };
  if (name === '@aws-sdk/s3-request-presigner') return { getSignedUrl: async (_, cmd) => { assert.equal(cmd.input.IfNoneMatch, '*'); return 'https://storage.test/upload'; } };
  if (name === 'jsonwebtoken') return { sign: payload => { signed = payload; return 'ticket'; }, verify: () => signed };
  if (name === 'crypto') return require(name);
  if (name === '../model/Volumem') return { svUploadModel: async (...args) => { stored = args; return { rowCount: 1 }; } };
  if (name === './volumeController') return { isValidVolBuffer: () => valid };
  throw Error(name);
} };
vm.runInNewContext(fs.readFileSync('server/v1/controller/directVolumeUpload.js', 'utf8'), context);
const user = { role: 102, user_mail: 'test@example.test', centre_id: 'centre-a' };
function response() { return { code: 200, status(n) { this.code=n; return this; }, set() { return this; }, json(body) { this.body=body; return this; } }; }
(async () => {
  let res=response(); await context.exports.prepare({ user, body: { ...metadata, filename:'test.vol', size } }, res); assert.equal(res.code,200);
  res=response(); await context.exports.complete({ user, body:{ uploadToken:'ticket' } },res); assert.equal(res.code,200); assert.equal(stored[4], metadata.volume_name); assert.match(stored[9], /institutions\/centre-a\//);
  res=response(); await context.exports.complete({ user:{...user, user_mail:'other'}, body:{uploadToken:'ticket'} },res); assert.equal(res.code,403);
  size=1; res=response(); await context.exports.complete({user,body:{uploadToken:'ticket'}},res); assert.equal(res.code,400);
  size=signed.size; valid=false; res=response(); await context.exports.complete({user,body:{uploadToken:'ticket'}},res); assert.equal(res.code,400);
  res=response(); await context.exports.prepare({user,body:{...metadata,filename:'test.vol',size:101*1024*1024}},res); assert.equal(res.code,400);
  res=response(); await context.exports.prepare({user:{...user,role:103},body:{}},res); assert.equal(res.code,403);
  console.log('PASS: 20MB flow, metadata mapping, owner isolation, size mismatch, invalid content, size cap, role check');
})().catch(e=>{console.error(e);process.exitCode=1;});
