'use strict';
const $=s=>document.querySelector(s);
const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
const toggle=$('.menu-toggle'),menu=$('#mobile-menu');
const background=[document.querySelector('main'),document.querySelector('footer'),$('.mobile-contact')];
function closeMenu(returnFocus=false){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');menu.hidden=true;document.body.classList.remove('menu-open');background.forEach(e=>{if(e)e.inert=false;});if(returnFocus)toggle.focus();}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';if(open){closeMenu();return;}menu.hidden=false;toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Close menu');document.body.classList.add('menu-open');background.forEach(e=>{if(e)e.inert=true;});menu.querySelector('a').focus();});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&!menu.hidden){closeMenu(true);}
 if(e.key==='Tab'&&!menu.hidden){const links=[toggle,...menu.querySelectorAll('a')];const first=links[0],last=links[links.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
});
window.addEventListener('resize',()=>{if(window.innerWidth>800)closeMenu();},{passive:true});
function showDialog(dialog){closeMenu();if(typeof dialog.showModal==='function')dialog.showModal();else{dialog.setAttribute('open','');dialog.classList.add('dialog-fallback');}}
document.querySelectorAll('[data-enquire]').forEach(button=>button.addEventListener('click',()=>{const context=$('#enquiry-context');context.hidden=!button.dataset.product;context.textContent=button.dataset.product?`Your enquiry: ${button.dataset.product}`:'';showDialog($('#enquiry-dialog'));}));
$('#credits-open').addEventListener('click',()=>showDialog($('#credits-dialog')));
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>{if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');});dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom){if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');}});});
$('#year').textContent=String(new Date().getFullYear());
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('.filter').forEach(other=>{const active=other===button;other.classList.toggle('active',active);other.setAttribute('aria-pressed',String(active));});
 const shown=[];
 document.querySelectorAll('.product-card').forEach(card=>{const show=button.dataset.filter==='all'||card.dataset.category===button.dataset.filter;card.hidden=!show;if(show)shown.push(card);});
 $('#filter-result').textContent=`${shown.length} ${shown.length===1?'category':'categories'}`;
 if(window.gsap){gsap.killTweensOf('.product-card');gsap.set(shown,{clearProps:'opacity,transform,visibility'});if(!preference.matches)gsap.fromTo(shown,{opacity:0,y:10},{opacity:1,y:0,duration:.35,stagger:.04,clearProps:'opacity,transform,visibility',overwrite:true});}
 if(window.ScrollTrigger)ScrollTrigger.refresh();
}));
let progressFrame=0;
function updateProgress(){progressFrame=0;const height=document.documentElement.scrollHeight-innerHeight;$('.reading-progress').style.transform=`scaleX(${height>0?Math.min(1,scrollY/height):0})`;$('.mobile-contact').classList.toggle('is-visible',$('.hero-stage').getBoundingClientRect().bottom<88);}
window.addEventListener('scroll',()=>{if(!progressFrame)progressFrame=requestAnimationFrame(updateProgress);},{passive:true});
window.addEventListener('resize',updateProgress,{passive:true});updateProgress();
const checklist='EarthGuard material enquiry\n\nMaterial / category:\nSpecifications / datasheet:\nQuantity:\nDelivery location:\nRequired date:\nProject / company:\nContact number:';
$('#copy-checklist').addEventListener('click',async()=>{
 const status=$('#copy-status');status.textContent='Copying checklist…';
 let timeout;
 try {await Promise.race([navigator.clipboard.writeText(checklist),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error('Clipboard unavailable')),1200);})]);status.textContent='Copied. Paste it into your message.';}
 catch(error){
  const textarea=document.createElement('textarea');textarea.value=checklist;textarea.style.cssText='position:fixed;left:0;top:0;width:1px;height:1px;opacity:0';document.body.append(textarea);textarea.select();let copied=false;
  try{copied=document.execCommand('copy');}catch(error){}textarea.remove();
  status.textContent=copied?'Copied. Paste it into your message.':'Include material, specifications, quantity and delivery location.';
 } finally {clearTimeout(timeout);}
});
// Self-hosted GSAP; the whole site remains usable if the library is unavailable.
if(window.gsap&&window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);
 ScrollTrigger.config({ignoreMobileResize:true});
 const media=gsap.matchMedia();
 media.add('(prefers-reduced-motion: no-preference)',()=>{
  gsap.fromTo('.hero-enter',{y:20,opacity:0},{y:0,opacity:1,duration:.8,stagger:.09,ease:'power3.out',clearProps:'opacity,transform'});
  gsap.fromTo('.hero-stage',{y:25,opacity:0},{y:0,opacity:1,duration:1,ease:'power3.out',delay:.15,clearProps:'opacity,transform'});
  document.querySelectorAll('.reveal').forEach(el=>{
   gsap.fromTo(el,{y:22,opacity:0},{y:0,opacity:1,duration:.65,ease:'power3.out',immediateRender:false,clearProps:'opacity,transform',scrollTrigger:{trigger:el,start:'top 94%',once:true}});
  });
  gsap.to('.statement-lines',{xPercent:7,duration:12,repeat:-1,yoyo:true,ease:'sine.inOut',scrollTrigger:{trigger:'.statement',start:'top bottom',end:'bottom top',toggleActions:'play pause resume pause'}});
 });
 document.addEventListener('earthguard:motion',e=>{
  gsap.getTweensOf('.statement-lines').forEach(tween=>e.detail.paused?tween.pause():tween.resume());
 });
 window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>ScrollTrigger.refresh());
}
