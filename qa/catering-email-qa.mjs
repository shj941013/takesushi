import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
const root=path.resolve('build');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.pdf':'application/pdf','.json':'application/json'};

// Local QA only: run the real function with a mocked SDK. No real email is sent.
import { createHandler } from '../netlify/functions/catering-inquiry.js';
let providerCalls=0;
const keys=[];
const handler=createHandler({env:{RESEND_API_KEY:'mock-only',CATERING_FROM_EMAIL:'catering@example.com',CATERING_TO_EMAIL:'restaurant@example.com'},makeClient:()=>({emails:{send:async(mail,options)=>{providerCalls++;keys.push(options.idempotencyKey);await new Promise(r=>setTimeout(r,250));return providerCalls===1?{data:null,error:{message:'Simulated rejection'}}:{data:{id:'mock-browser-email-id'},error:null};}}})});
const server=http.createServer(async(req,res)=>{
 if(req.url==='/api/catering-inquiry'){
  const chunks=[];for await(const chunk of req)chunks.push(chunk);
  const response=await handler(new Request('http://127.0.0.1:4173/api/catering-inquiry',{method:req.method,headers:req.headers,body:Buffer.concat(chunks)}));
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;
 }
 let file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return;}
 if(!fs.existsSync(file)||fs.statSync(file).isDirectory())file=path.join(root,'index.html');
 res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
server.listen(4173,'127.0.0.1');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const target=await fetch('http://127.0.0.1:9333/json/new?about:blank',{method:'PUT'}).then(r=>r.json());
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let seq=0;const pending=new Map(),errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(m.error);else p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text+': '+(m.params.exceptionDetails.exception?.description||''));else if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(m.params.args.map(a=>a.value||a.description).join(' '));});
const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async(expression)=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error((r.exceptionDetails.exception?.description||r.exceptionDetails.text)+' Runtime errors: '+errors.join(' | '));return r.result.value;};
await call('Page.enable');await call('Runtime.enable');

const assert=(ok,message)=>{if(!ok)throw new Error(message);};
await call('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:false});
await call('Page.navigate',{url:'http://127.0.0.1:4173/catering'});await wait(600);
for(let i=0;i<50;i++){if(await evaluate(`!!document.querySelector('.catering-form')`))break;await wait(100);}
await evaluate(`document.querySelector('.catering-form button[type="submit"]').click()`);await wait(100);
assert(await evaluate(`document.querySelectorAll('.field-error').length===8`),'client validation errors');
const values={name:'QA Test Guest',email:'qa@example.com',phone:'2485550100',date:'2099-11-05',guests:'25',event:'Private parties',preference:'Delivery'};
await evaluate(`(()=>{const values=${JSON.stringify(values)};for(const [name,value] of Object.entries(values)){const input=document.querySelector('[name="'+name+'"]');const type=input.tagName==='SELECT'?HTMLSelectElement:HTMLInputElement;Object.getOwnPropertyDescriptor(type.prototype,'value').set.call(input,value);input.dispatchEvent(new Event(input.tagName==='SELECT'?'change':'input',{bubbles:true}));}})()`);await wait(100);
await evaluate(`(()=>{const input=document.querySelector('[name="location"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'QA Test Address');input.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('input[value="Classic sushi rolls"]').click();})()`);await wait(2500);
await evaluate(`document.querySelector('.catering-form button[type="submit"]').click();document.querySelector('.catering-form button[type="submit"]').click()`);await wait(80);
assert(await evaluate(`document.querySelector('.catering-form button[type="submit"]').disabled`),'busy state');await wait(350);
assert(await evaluate(`document.querySelector('.inquiry-message').getAttribute('role')==='alert'&&document.querySelector('[name="name"]').value==='QA Test Guest'`),'provider error preserves fields');
await evaluate(`document.querySelector('.catering-inquiry').scrollIntoView({behavior:'instant'})`);
let shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync('qa/catering-email-375-error.png',Buffer.from(shot.data,'base64'));
await evaluate(`document.querySelector('.catering-form button[type="submit"]').click()`);await wait(500);
assert(await evaluate(`document.querySelector('.inquiry-message').textContent.includes('has been submitted')&&document.querySelector('.catering-form button[type="submit"]').disabled`),'accepted success');
assert(providerCalls===2&&keys[0]===keys[1],'duplicate prevention and idempotent retry');
assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth&&!document.querySelector('a[href^="mailto:"]')`),'mobile layout and no email-app flow');
await evaluate(`document.querySelector('.inquiry-message').scrollIntoView({behavior:'instant'})`);shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync('qa/catering-email-375-accepted-mock.png',Buffer.from(shot.data,'base64'));
const layout=[];
for(const width of [768,1440,1920]){
 await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
 await evaluate(`document.querySelector('.catering-inquiry').scrollIntoView({behavior:'instant'})`);
 assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth`),'layout '+width);
 layout.push(width);
 shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync('qa/catering-email-'+width+'.png',Buffer.from(shot.data,'base64'));
}
// The expected HTTP 502 produces a browser network-console entry; filter only that expected resource failure.
const unexpected=errors.filter(error=>!error.includes('502')&&!error.includes('Failed to load resource'));
assert(unexpected.length===0,'unexpected runtime errors');
fs.writeFileSync('qa/catering-email-results.json',JSON.stringify({provider:'MOCK: no real email sent',checks:['validation','busy/duplicate guard','server rejection preserves fields','retry acceptance','same idempotency key','no mailto flow','responsive layout'],widths:[375,...layout],providerCalls,unexpectedConsoleErrors:unexpected},null,2));
console.log('Real function + browser form passed using a mocked Resend SDK. No real email was sent.');
await call('Page.close');ws.close();server.close();
