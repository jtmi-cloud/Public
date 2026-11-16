'use strict';
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const nav=$('#main-nav'),menu=$('.menu-toggle');
function closeMenu(){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
$$('#main-nav a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
$$('dialog').forEach(dialog=>{
 $('.dialog-close',dialog)?.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
});
$('[data-about]')?.addEventListener('click',()=>$('#about-dialog').showModal());
const plans={
 household:{name:'Household',price:'Free',description:'For personal and household participation.',benefits:['Your monthly programme journey','Practical resources for everyday life','Your own action and progress record','Community news and programme updates']},
 business:{name:'Business',price:'Paid · price to be confirmed',description:'A shared programme for your agreed workplace team.',benefits:['Programme access for your agreed team','Workplace resources and activities','A named programme coordinator','Team participation reporting']},
 corporate:{name:'Corporate',price:'Paid · price to be confirmed',description:'A coordinated programme across agreed teams or sites.',benefits:['Everything in Business','Coordination across agreed teams or sites','Organisation-wide participation reporting','Rollout planning for your organisation']},
 council:{name:'Local council',price:'Call for pricing',description:'A programme licence for your agreed community scope.',benefits:['Agreed audience and area','Programme coordination and rollout','Defined resources and participation reporting','Licence scope, support and pricing by agreement']},
 state:{name:'State government',price:'Call for pricing',description:'Programme participation tailored to your agency or initiative.',benefits:['Agreed audience and agency scope','Programme coordination and rollout','Defined resources and participation reporting','Licence scope, support and pricing by agreement']}
};
const params=new URLSearchParams(location.search);
const ownPlan=value=>Object.prototype.hasOwnProperty.call(plans,value);
let selectedPlan=ownPlan(params.get('plan'))?params.get('plan'):($('#payment-back')?'business':'household');
function renderPlan(key){
 const plan=plans[key];if(!plan)return;
 $$('[data-plan-name]').forEach(e=>e.textContent=plan.name);
 $$('[data-plan-price]').forEach(e=>e.textContent=plan.price);
 $$('[data-plan-description]').forEach(e=>e.textContent=plan.description);
 $$('[data-plan-benefits]').forEach(list=>{list.replaceChildren();plan.benefits.forEach(benefit=>{const item=document.createElement('li');item.textContent=benefit;list.append(item);});});
}
renderPlan(selectedPlan);
const signup=$('#signup-form'),planSelect=$('#membership-plan');
function updateSignup(){
 selectedPlan=planSelect.value;renderPlan(selectedPlan);
 const government=['council','state'].includes(selectedPlan),organisation=selectedPlan!=='household';
 $('#signup-fields').hidden=government;$('#government-route').hidden=!government;
 $('#signup-organisation').hidden=!organisation;
 $('#organisation-name').required=organisation&&!government;
 $('#signup-name').required=!government;$('#signup-email').required=!government;
 $('#signup-name-label').textContent=organisation?'Coordinator name':'Your name';
 $('#next-step-label').textContent=government?'03 Pricing conversation':organisation?'03 Review & payment':'03 Member home';
 $('#signup-route-note').textContent=organisation?'This is an organisation membership. Price, participant allocation, licence scope and billing terms must be agreed before payment and activation.':'Household membership is free and intended for personal and household use. If you represent an organisation, please select the appropriate membership above.';
 $('#signup-submit').textContent=organisation?'Continue to payment review →':'Continue with free membership →';
 $('#government-link').href='contact.html?type='+selectedPlan;
}
if(signup){
 planSelect.value=selectedPlan;updateSignup();planSelect.addEventListener('change',updateSignup);
 signup.addEventListener('submit',event=>{event.preventDefault();const plan=selectedPlan;signup.reset();location.href=(plan==='household'?'members.html?plan=household':'payment.html?plan='+plan);});
}
$('#signin-form')?.addEventListener('submit',event=>{event.preventDefault();const plan=$('#signin-plan').value;event.target.reset();location.href='members.html?plan='+plan;});
if($('#payment-back')){
 $('#payment-back').href='signup.html?plan='+selectedPlan;
 $('#payment-question').href='contact.html?type='+selectedPlan;
 $('#member-layout-link').href='members.html?plan='+selectedPlan;
 if(selectedPlan==='household'){
  $('.order-total strong').textContent='Free — no payment required';
  $('.payment-preview').replaceChildren();
  const title=document.createElement('h2');title.textContent='No payment needed.';
  const copy=document.createElement('p');copy.textContent='Household membership is free for personal and household use.';
  const link=document.createElement('a');link.href='signup.html?plan=household';link.className='button button-dark';link.textContent='Continue to free sign-up →';
  $('.payment-preview').append(title,copy,link);
 }
 if(['council','state'].includes(selectedPlan))location.replace('contact.html?type='+selectedPlan);
}
if($('#pricing-form')){
 const type=params.get('type');if(['council','state','business','corporate','other'].includes(type))$('#enquiry-type').value=type;
 $('#pricing-form').addEventListener('submit',event=>{event.preventDefault();event.target.reset();event.target.hidden=true;$('#pricing-result').hidden=false;$('#pricing-result').scrollIntoView({block:'center'});});
}
// Clear only sample data previously created by this concept; never retain account or enquiry details.
try{localStorage.removeItem('bth12rs-concept-checkins-v1');}catch{}
