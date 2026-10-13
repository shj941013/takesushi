import fs from 'node:fs';
const base='https://takesushimichigan.com';
const results=[];
for(const route of ['/','/contact','/catering']){
 const response=await fetch(base+route);
 results.push({route,status:response.status,html:response.headers.get('content-type')?.includes('text/html')});
}
const get=await fetch(base+'/api/catering-inquiry');
results.push({route:'/api/catering-inquiry',method:'GET',status:get.status,body:await get.json()});
const payload={name:'Validation Test',email:'invalid-email',phone:'2485550100',date:'2099-11-05',guests:'10',event:'Private parties',preference:'Pickup',location:'',selections:['Classic sushi rolls'],budget:'',requests:'',website:'',requestId:'d3363b2e-e577-4a71-954b-eebc243be11d',startedAt:Date.now()-5000};
const invalid=await fetch(base+'/api/catering-inquiry',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify(payload)});
const body=await invalid.json();
results.push({route:'/api/catering-inquiry',method:'POST invalid email (no send)',status:invalid.status,validationRejected:!!body.errors?.email});
if(results.some(row=>row.html===false)||(get.status!==405)||(invalid.status!==422)||!body.errors?.email)throw new Error('Live verification failed');
fs.writeFileSync('qa/netlify-recipient-live-checks.json',JSON.stringify({checkedAt:new Date().toISOString(),results,realEmailSent:false},null,2)+'\n');
console.log(JSON.stringify(results,null,2));
