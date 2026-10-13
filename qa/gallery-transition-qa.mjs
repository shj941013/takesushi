import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
const root=path.resolve('build');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.pdf':'application/pdf','.json':'application/json'};
const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return;}if(!fs.existsSync(file)||fs.statSync(file).isDirectory())file=path.join(root,'index.html');res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
server.listen(4173,'127.0.0.1');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const target=await fetch('http://127.0.0.1:9333/json/new?about:blank',{method:'PUT'}).then(r=>r.json());
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let seq=0;const pending=new Map(),errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(m.error);else p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text+': '+(m.params.exceptionDetails.exception?.description||''));else if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(m.params.args.map(a=>a.value||a.description).join(' '));});
const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async(expression)=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text);return r.result.value;};
await call('Page.enable');await call('Runtime.enable');
const rows=[];
for(const width of [375,768,1440,1920])for(const route of ['/']){
 errors.length=0;
 await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
 await call('Page.navigate',{url:'http://127.0.0.1:4173'+route});
 for(let attempt=0;attempt<100;attempt++){if(await evaluate('!!document.querySelector("main h1")'))break;await wait(100);}
 await evaluate('Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,6000))]).then(()=>true)');
 await evaluate('Promise.all(Array.from(document.querySelectorAll("main img")).map(img=>{img.loading="eager";return img.complete?true:new Promise(r=>{img.addEventListener("load",r,{once:true});img.addEventListener("error",r,{once:true});setTimeout(r,5000);});})).then(()=>true)');
 await wait(600);
 const metrics=await evaluate(`(()=>{
 const w=innerWidth, sections=Array.from(document.querySelectorAll('main section'));
 const overflow=Array.from(document.querySelectorAll('body *')).filter(el=>!el.closest('.gallery-track,.category-list')).filter(el=>{const b=el.getBoundingClientRect();return b.width>0&&(b.right>w+2||b.left< -2);}).map(el=>({tag:el.tagName,class:el.className,left:Math.round(el.getBoundingClientRect().left),right:Math.round(el.getBoundingClientRect().right)})).slice(0,20);
 return {width:w,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,overflow,sections:sections.map(el=>({class:el.className,height:Math.round(el.getBoundingClientRect().height),opacity:getComputedStyle(el).opacity})),brokenImages:Array.from(document.querySelectorAll('img')).filter(el=>!el.naturalWidth).map(el=>el.src),literalEntities:document.querySelector('main').textContent.match(/&[a-zA-Z]+;/g)||[]};})()`);
 const name=(route==='/'?'home':route.slice(1))+'-'+width;
 const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height:Math.min(metrics.height,18000),scale:1}});
 fs.writeFileSync('qa/gallery-transition-home-'+width+'.png',Buffer.from(shot.data,'base64'));
 if(route==='/'){
   for(const selector of ['.hero','.intro','.gallery-section']){
     await evaluate(`document.querySelector('${selector}').scrollIntoView({behavior:'instant',block:'start'})`);await wait(150);
     const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync('qa/'+'gallery-transition-'+width+'-'+selector.slice(1)+'.png',Buffer.from(shot.data,'base64'));
   }
 }
 rows.push({route,width,...metrics,consoleErrors:[...errors]});
 console.log(JSON.stringify({route,width,scrollWidth:metrics.scrollWidth,overflow:metrics.overflow,brokenImages:metrics.brokenImages,entities:metrics.literalEntities,errors:[...errors]}));
}
await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
await call('Page.navigate',{url:'http://127.0.0.1:4173/'});await wait(600);
const reduced=await evaluate(`Array.from(document.querySelectorAll('main section')).map(el=>({class:el.className,opacity:getComputedStyle(el).opacity,animation:getComputedStyle(el).animationName}))`);
fs.writeFileSync('qa/gallery-transition-results.json',JSON.stringify({rows,reduced},null,2));
await call('Page.close');ws.close();server.close();
