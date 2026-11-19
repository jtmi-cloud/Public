// Cloudflare Pages Function: POST /api/contact
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"}});
export async function onRequestPost({request,env}){
  // Fail closed until all dependencies are configured in Pages settings.
  if(!env.TURNSTILE_SECRET_KEY||!env.CLOUDFLARE_EMAIL_API_TOKEN||!env.CLOUDFLARE_ACCOUNT_ID||!env.CONTACT_TO_EMAIL||!env.CONTACT_FROM_EMAIL)return json({error:"Contact form is not yet configured."},503);
  const type=request.headers.get("content-type")||"";
  if(!type.includes("multipart/form-data")&&!type.includes("application/x-www-form-urlencoded"))return json({error:"Unsupported form submission."},415);
  const length=Number(request.headers.get("content-length")||0);
  if(length>16000)return json({error:"Submission too large."},413);
  let form;try{form=await request.formData();}catch{return json({error:"Invalid form data."},400);}
  if(form.get("website"))return json({ok:true});
  const read=(k,max)=>{const v=form.get(k);return typeof v==="string"?v.trim().slice(0,max+1):""};
  const name=read("name",120),email=read("email",254),phone=read("phone",40),subject=read("subject",150),message=read("message",5000),token=read("cf-turnstile-response",2048);
  if(!name||name.length>120||!email||email.length>254||!subject||subject.length>150||!message||message.length>5000||phone.length>40||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return json({error:"Please check the required fields."},400);
  if(!token)return json({error:"Please complete the anti-spam verification."},400);
  const verify=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:token,remoteip:request.headers.get("CF-Connecting-IP")||""})}).then(r=>r.json()).catch(()=>null);
  const approvedHostnames=new Set((env.TURNSTILE_HOSTNAMES||"").split(",").map(h=>h.trim()).filter(Boolean));
  if(!verify?.success||verify.action!=="contact"||approvedHostnames.size===0||!approvedHostnames.has(verify.hostname))return json({error:"Anti-spam verification failed. Please retry."},403);
  const body=["New website enquiry","","Name: "+name,"Email: "+email,"Phone: "+(phone||"Not supplied"),"Subject: "+subject,"","Message:",message].join("\n");
  const sent=await fetch("https://api.cloudflare.com/client/v4/accounts/"+encodeURIComponent(env.CLOUDFLARE_ACCOUNT_ID)+"/email/sending/send",{method:"POST",headers:{"authorization":"Bearer "+env.CLOUDFLARE_EMAIL_API_TOKEN,"content-type":"application/json"},body:JSON.stringify({from:env.CONTACT_FROM_EMAIL,to:env.CONTACT_TO_EMAIL,reply_to:email,subject:"Website enquiry: "+subject,text:body})}).catch(()=>null);
  const delivery=sent?.ok?await sent.json().catch(()=>null):null;
  if(!sent?.ok||!delivery?.success||(!delivery?.result?.delivered?.length&&!delivery?.result?.queued?.length)){console.error("Cloudflare Email Service failed or rejected request",sent?.status);return json({error:"Message could not be delivered. Please try again later."},502);}
  return json({ok:true});
}
export function onRequestGet(){return json({error:"Method not allowed."},405)}
