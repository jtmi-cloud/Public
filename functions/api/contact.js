// Cloudflare Pages Function: POST /api/contact
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"}});
export async function onRequestPost({request,env}){
  // Fail closed until all dependencies are configured in Pages settings.
  if(!env.TURNSTILE_SECRET_KEY||!env.RESEND_API_KEY||!env.CONTACT_TO_EMAIL||!env.CONTACT_FROM_EMAIL)return json({error:"Contact form is not yet configured."},503);
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
  if(!verify?.success)return json({error:"Anti-spam verification failed. Please retry."},403);
  const body=["New website enquiry","","Name: "+name,"Email: "+email,"Phone: "+(phone||"Not supplied"),"Subject: "+subject,"","Message:",message].join("\n");
  const sent=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"authorization":"Bearer "+env.RESEND_API_KEY,"content-type":"application/json"},body:JSON.stringify({from:env.CONTACT_FROM_EMAIL,to:[env.CONTACT_TO_EMAIL],reply_to:email,subject:"Website enquiry: "+subject,text:body})}).catch(()=>null);
  if(!sent?.ok){console.error("Contact email provider rejected request",sent?.status);return json({error:"Message could not be delivered. Please try again later."},502);}
  return json({ok:true});
}
export function onRequestGet(){return json({error:"Method not allowed."},405)}
