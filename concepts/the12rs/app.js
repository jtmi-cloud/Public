'use strict';
const chapters = [
  ['Respect','Begin with the people, places and living things you care about. What would you like your everyday actions to protect?','Choose one place that matters to you. Take a moment to notice it.'],
  ['Reflect & rethink','Pause and look at an everyday habit with fresh eyes. A question can be the beginning of a different choice.','Notice one thing you buy or throw away regularly. Ask what you could do differently.'],
  ['Reclaim','Look again at something that has been overlooked. Consider what still has value and how it could be brought back into use.','Find an unused item at home and consider a useful next step for it.'],
  ['Refuse','Explore the choices you can make before something becomes waste. Consider when a simple no could help.','Notice an unnecessary single-use item you could decline.'],
  ['Reduce','Consider how much you really need. Find a manageable way to use fewer resources in an ordinary part of your day.','Choose one area of everyday consumption to pay closer attention to.'],
  ['Reuse & repurpose','Look for another life in an item you already have. A little imagination can make an everyday object useful again.','Find a safe, practical second use for something you were about to discard.'],
  ['Repair & restore','Give attention to the things that could last longer. Explore the value of care, maintenance and repair.','Identify one item to maintain or ask a repairer about.'],
  ['Recycle','Find out what belongs where. Local guidance matters when sorting items for resource recovery.','Check your council’s current advice for one item you are unsure about.'],
  ['Recognition','Notice the effort around you. Recognising what people contribute can encourage continued participation.','Thank someone for a practical action that supports your community.'],
  ['Rot','Explore how organic materials return to the soil, and what options are appropriate in your local area.','Find out which food scraps your local organics service or compost system can accept.'],
  ['Regeneration','Think about how the places around us can be cared for and renewed over time.','Find a local habitat or restoration initiative and learn about its work.'],
  ['The final chapter','The published storyline leaves the last R to be revealed. This concept preserves that invitation rather than inventing a replacement.','What questions would you bring to the next chapter of the story?']
];
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const controls = $('.chapter-controls');
chapters.forEach(([name], index) => {
  const button = document.createElement('button');
  button.type = 'button'; button.textContent = String(index + 1).padStart(2, '0');
  button.setAttribute('aria-label', `Chapter ${index + 1}: ${name}`);
  button.setAttribute('aria-pressed', String(index === 0));
  button.addEventListener('click', () => {
    $$('.chapter-controls button').forEach((item, i) => item.setAttribute('aria-pressed', String(i === index)));
    $('#chapter-tag').textContent = `CHAPTER ${String(index + 1).padStart(2, '0')}`;
    $('#chapter-title').textContent = chapters[index][0];
    $('#chapter-description').textContent = chapters[index][1];
    $('#chapter-prompt').textContent = chapters[index][2];
  });
  controls.append(button);
});
const nav = $('#main-nav'), menuToggle = $('.menu-toggle');
menuToggle.addEventListener('click', () => { const open = menuToggle.getAttribute('aria-expanded') !== 'true'; menuToggle.setAttribute('aria-expanded',String(open)); nav.classList.toggle('open',open); });
$$('#main-nav a').forEach(link => link.addEventListener('click', () => {nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');}));
document.addEventListener('keydown', event => { if(event.key === 'Escape'){nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');} });
$$('dialog').forEach(dialog => {
  $('.dialog-close',dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {if(event.target === dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
});
$('[data-wheel]').addEventListener('click', () => $('#wheel-dialog').showModal());
$('[data-about]').addEventListener('click', () => $('#about-dialog').showModal());
const joinDialog = $('#join-dialog'), joinForm = $('#join-form'), participantType = $('#participant-type');
function updateRoute(){
  const org = participantType.value !== 'household';
  $('#organisation-fields').hidden = !org; $('#organisation-name').required = org;
  $('#participant-name-label').textContent = org ? 'Coordinator name' : 'Your name';
  $('#route-explanation').textContent = org ? 'Organisation route: application review, agreed licence scope and a named coordinator. Submitting an enquiry would not grant a licence. Fees and availability are confirmed with Em.' : 'Household route: personal participation in the programme. Pricing and start dates are to be agreed.';
}
participantType.addEventListener('change', updateRoute);
$$('[data-join]').forEach(button => button.addEventListener('click', () => {
  joinForm.reset();joinForm.hidden=false;$('.join-result').hidden=true;
  participantType.value = button.dataset.join === 'organisation' ? 'business' : 'household';
  updateRoute();joinDialog.showModal();
}));
joinForm.addEventListener('submit', event => {
  event.preventDefault();
  const org=participantType.value!=='household';
  $('#join-result-title').textContent=org?'An organisation conversation.':'A welcome to the journey.';
  $('#join-result-copy').textContent=org?'In the live programme, Em would review your organisation’s goals, proposed audience and requested support. You would agree the pilot, licence, fees and dates before access is approved.':'In the live programme, you would confirm your email and receive your cohort details. Your first approved chapter would open on the agreed start date.';
  joinForm.hidden=true;$('.join-result').hidden=false;
  // Do not persist personal form values, even in the concept.
  joinForm.reset();$('#join-dialog').scrollTop=0;
});
$('.join-result a').addEventListener('click',()=>joinDialog.close());
joinDialog.addEventListener('close',()=>joinForm.reset());

const storageKey='bth12rs-concept-checkins-v1';
let checkins=[null,null,null],selectedChapter=0,storageAvailable=true;
try{const stored=JSON.parse(localStorage.getItem(storageKey));if(Array.isArray(stored)&&stored.length===3)checkins=stored.map(x=>x&&typeof x.note==='string'?{note:x.note.slice(0,400)}:null);}catch{storageAvailable=false;}
function updateProgress(){
  const count=checkins.filter(Boolean).length;
  $('#progress-value').textContent=`${count} of 3 check-ins`;
  $('.progress-track').setAttribute('aria-valuenow',String(count));$('.progress-track>span').style.width=`${count/3*100}%`;
  $$('.dashboard-chapter').forEach((button,index)=>{button.classList.toggle('completed',!!checkins[index]);$('span',button).textContent=checkins[index]?'✓':String(index+1).padStart(2,'0');});
}
function selectDemoChapter(index){
  selectedChapter=index;
  $$('.dashboard-chapter').forEach((button,i)=>{button.classList.toggle('active',i===index);button.setAttribute('aria-pressed',String(i===index));});
  $('#reflection-label').textContent=`Your ${chapters[index][0]} check-in`;
  $('#reflection').value=checkins[index]?.note||'';$('#action-complete').checked=!!checkins[index];
  $('#checkin-status').textContent=checkins[index]?'Your sample check-in is saved on this device.':'';
}
$$('.dashboard-chapter').forEach(button=>button.addEventListener('click',()=>selectDemoChapter(Number(button.dataset.demoChapter))));
$('#checkin-form').addEventListener('submit', event=>{
  event.preventDefault();checkins[selectedChapter]={note:$('#reflection').value.trim()};
  try{localStorage.setItem(storageKey,JSON.stringify(checkins));}catch{storageAvailable=false;}
  updateProgress();$('#checkin-status').textContent=storageAvailable?'Sample check-in saved on this device. No information was sent.':'Sample check-in added for this visit. Browser storage is unavailable.';
});
$('.reset-demo').addEventListener('click',()=>{
  checkins=[null,null,null];try{localStorage.removeItem(storageKey);}catch{storageAvailable=false;}
  updateProgress();selectDemoChapter(0);$('#checkin-status').textContent='Sample progress reset.';
});
updateProgress();selectDemoChapter(0);
