const {S3Client,PutObjectCommand,HeadObjectCommand,DeleteObjectCommand}=require('../server/v1/node_modules/@aws-sdk/client-s3');
const {getSignedUrl}=require('../server/v1/node_modules/@aws-sdk/s3-request-presigner');
const {randomUUID}=require('crypto');
const s3=new S3Client({region:'ap-south-1',requestChecksumCalculation:'WHEN_REQUIRED'});
(async()=>{
 const object={Bucket:'project-anu-content-299822065337-ap-south-1',Key:`projectanu/deployment-tests/${randomUUID()}.vol`};
 const body=Buffer.alloc(12*1024*1024); body.write('KRETZFILE');
 const url=await getSignedUrl(s3,new PutObjectCommand({...object,ContentType:'application/octet-stream',ContentLength:body.length,IfNoneMatch:'*'}),{expiresIn:120});
 let uploaded=false;
 try {
  const result=await fetch(url,{method:'PUT',headers:{'Content-Type':'application/octet-stream','If-None-Match':'*'},body});
  if(!result.ok) throw Error(`PUT failed ${result.status}: ${await result.text()}`);
  uploaded=true;
  const head=await s3.send(new HeadObjectCommand(object));
  if(head.ContentLength!==body.length)throw Error('Size mismatch');
  console.log('PASS: signed browser-style PUT uploaded and verified 12 MB');
 }finally{if(uploaded){await s3.send(new DeleteObjectCommand(object));console.log('Removed generated test object');}}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
