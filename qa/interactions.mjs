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
const evaluate=async(expression)=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
await call('Page.enable');await call('Runtime.enable');

const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const results=[];
async function visit(route,width=375){
 await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
 await call('Page.navigate',{url:'http://127.0.0.1:4173'+route});await wait(500);
 for(let i=0;i<60;i++){if(await evaluate('!!document.querySelector("main h1")'))break;await wait(100);}
}
await visit('/');
await evaluate('document.querySelector(".nav-toggle").click()');
assert(await evaluate('document.querySelector(".nav-toggle").getAttribute("aria-expanded")==="true"'),'mobile nav opens');
await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
assert(await evaluate('document.querySelector(".nav-toggle").getAttribute("aria-expanded")==="false" && document.activeElement===document.querySelector(".nav-toggle")'),'Escape closes and restores focus');
await evaluate('document.querySelector(".nav-toggle").click()');await wait(50);
await evaluate(`document.querySelector('#mobile-navigation a[href="/fullmenu"]').click()`);await wait(150);
assert(await evaluate('location.pathname==="/fullmenu" && !document.querySelector("#mobile-navigation")'),'mobile menu route selection');
await evaluate('document.querySelector(".category-list button:nth-child(2)").click()');
await evaluate('const input=document.querySelector("#dish-search");Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(input,"gYoZa");input.dispatchEvent(new Event("input",{bubbles:true}));');await wait(100);
assert(await evaluate('document.querySelectorAll(".menu-item").length===1&&document.querySelector(".menu-item h3").textContent==="Gyoza"'),'case insensitive dish search');
await evaluate(`document.querySelector('button[aria-label="Clear dish search"]').click();document.querySelector('.category-list button').click()`);await wait(100);
assert(await evaluate('document.querySelectorAll(".menu-item").length===47'),'clearing filter restores 47 entries');
const pdf=await evaluate('document.querySelector("a.pdf-preview").href');assert((await fetch(pdf)).headers.get('content-type')==='application/pdf','PDF asset served');
const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync('qa/fullmenu-375-top.png',Buffer.from(shot.data,'base64'));
await visit('/');
await evaluate(`document.querySelector('.gallery-section').scrollIntoView({behavior:'instant'});document.querySelector('button[aria-label="Next gallery photos"]').click()`);await wait(100);
assert(await evaluate(`document.querySelector('.gallery-feature img').alt==='Rainbow rolls'`),'gallery next changes featured photo');
await evaluate(`document.querySelector('button[aria-label="Previous gallery photos"]').click()`);await wait(100);
assert(await evaluate(`document.querySelector('.gallery-feature img').alt==='Sushi and nigri assortment'.replace('nigri','nigiri') && document.querySelector('button[aria-label="Previous gallery photos"]').disabled`),'gallery previous returns and disables at start');
await evaluate(`document.querySelector('.gallery-thumbnail button').focus()`);
await call('Input.dispatchKeyEvent',{type:'keyDown',key:'End',code:'End',windowsVirtualKeyCode:35});await wait(100);
assert(await evaluate(`document.querySelector('button[aria-label="Next gallery photos"]').disabled && document.querySelector('.gallery-feature img').alt==='Sushi and sashimi platter'`),'keyboard End selects last image and disables next');
await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Home',code:'Home',windowsVirtualKeyCode:36});await wait(100);
assert(await evaluate(`document.querySelector('button[aria-label="Previous gallery photos"]').disabled`),'keyboard Home restores first image');
results.push('mobile navigation, Escape focus, category/search/reset, PDF, gallery controls passed');
await visit('/',1440);
const paths=['/about','/fullmenu','/contact','/'];
for(const route of paths){await evaluate(`document.querySelector('.desktop-nav a[href="${route}"]').click()`);await wait(100);assert(await evaluate(`location.pathname==="${route}" && !!document.querySelector('main h1')`),'desktop route '+route);}
results.push('desktop navigation to every existing route passed');
const links=await evaluate('Array.from(document.querySelectorAll("a")).map(a=>({href:a.getAttribute("href"),name:a.textContent.trim()}))');
assert(links.filter(a=>/Order online/i.test(a.name)).every(a=>a.href==='https://www.epipay.com/take/en/WebOrder?STORE_CODE=MTAwMA==&table_num=MTAwMA=='),'unchanged ordering URL');
assert(!links.some(a=>!a.href),'no empty links');
await call('Page.addScriptToEvaluateOnNewDocument',{source:'window.IntersectionObserver=undefined;'});
await call('Page.reload');await wait(600);
for(const top of [2000,5000,0]){await evaluate(`window.scrollTo({top:${top},behavior:'instant'})`);}
assert(await evaluate('Array.from(document.querySelectorAll("main section")).every(el=>getComputedStyle(el).opacity==="1"&&getComputedStyle(el).visibility==="visible")'),'no hidden sections after quick scroll with missing observer');
results.push('all sections visible after reload and rapid scroll with IntersectionObserver unavailable');
await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await wait(50);
const motion=await evaluate('Array.from(document.querySelectorAll("main section,.hero-content,.hero-art")).map(el=>({class:el.className,opacity:getComputedStyle(el).opacity,animation:getComputedStyle(el).animationName}))');
assert(motion.every(el=>el.opacity==='1'&&el.animation==='none'),'reduced motion visible/no animation');
results.push('reduced motion preserves visibility and disables animation');
await evaluate('window.scrollTo({top:0,behavior:"instant"});document.activeElement.blur()');
const keyboard=[];
for(let i=0;i<12;i++){await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});keyboard.push(await evaluate('({tag:document.activeElement.tagName,name:document.activeElement.getAttribute("aria-label")||document.activeElement.textContent.trim(),outline:getComputedStyle(document.activeElement).outlineStyle})'));}
assert(keyboard.some(el=>el.name==='Skip to content'&&el.outline!=='none'),'keyboard skip link focus visible');
results.push('keyboard tab traversal and skip-link focus indicator passed');
assert(errors.length===0,'browser console/runtime errors: '+errors.join('\n'));
fs.writeFileSync('qa/interactions.json',JSON.stringify({results,links,motion,keyboard,consoleErrors:errors},null,2));console.log(JSON.stringify(results,null,2));
await call('Page.close');ws.close();server.close();
