'use strict';
const $ = s => document.querySelector(s);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuToggle = $('.menu-toggle');
const mobileMenu = $('#mobile-menu');
function closeMenu(){menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Open menu');mobileMenu.hidden=true;}
menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')==='true';menuToggle.setAttribute('aria-expanded',String(!open));menuToggle.setAttribute('aria-label',open?'Open menu':'Close menu');mobileMenu.hidden=open;});
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
window.addEventListener('resize',()=>{if(window.innerWidth>800)closeMenu();});
const enquiry=$('#enquiry-dialog');
document.querySelectorAll('[data-enquire]').forEach(button=>button.addEventListener('click',()=>{const product=button.dataset.product;const context=$('#enquiry-context');context.hidden=!product;context.textContent=product?`Your enquiry: ${product}`:'';enquiry.showModal();}));
const credits=$('#credits-dialog');$('#credits-open').addEventListener('click',()=>credits.showModal());
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();});});
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(other=>{other.classList.toggle('active',other===button);other.setAttribute('aria-pressed',String(other===button));});document.querySelectorAll('.product-card').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)card.classList.add('visible');});}));
$('#year').textContent=String(new Date().getFullYear());
// Reveal once on entry; content remains visible if observer setup fails.
if(!reducedMotion.matches && 'IntersectionObserver' in window){
 const elements=[...document.querySelectorAll('.reveal')];
 try {
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}
  }),{threshold:0,rootMargin:'0px 0px -12px 0px'});
  elements.forEach((element,index)=>{element.style.transitionDelay=`${(index%3)*45}ms`;observer.observe(element);});
  document.documentElement.classList.add('js-motion');
 } catch(error){document.documentElement.classList.remove('js-motion');}
}
// Keep CSS motion automatic on touch screens; pointer tilt is desktop-only.
// Pause offscreen sculptures to leave the phone GPU free for scrolling.
if('IntersectionObserver' in window){
 const sceneObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  entry.target.classList.toggle('scene-offscreen',!entry.isIntersecting);
 }),{rootMargin:'100px'});
 document.querySelectorAll('.hero-art,.statement').forEach(scene=>sceneObserver.observe(scene));
}
document.addEventListener('visibilitychange',()=>{
 document.documentElement.classList.toggle('page-inactive',document.hidden);
});
let paused=false;$('#motion-toggle').addEventListener('click',()=>{paused=!paused;document.documentElement.classList.toggle('motion-paused',paused);$('#motion-toggle').textContent=paused?'▶':'Ⅱ';$('#motion-toggle').setAttribute('aria-label',paused?'Resume animations':'Pause animations');$('#motion-toggle').setAttribute('aria-pressed',String(paused));});
if(window.matchMedia('(hover: hover) and (pointer: fine)').matches&&!reducedMotion.matches){const art=$('.hero-art');const sculpture=$('#sculpture');let frame=0;art.addEventListener('pointermove',event=>{if(paused)return;if(frame)cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const r=art.getBoundingClientRect();sculpture.style.setProperty('--rx',`${((event.clientY-r.top)/r.height-.5)*-14}deg`);sculpture.style.setProperty('--ry',`${((event.clientX-r.left)/r.width-.5)*22}deg`);});});art.addEventListener('pointerleave',()=>{sculpture.style.setProperty('--rx','0deg');sculpture.style.setProperty('--ry','0deg');});document.querySelectorAll('.tilt').forEach(card=>{card.addEventListener('pointermove',event=>{if(paused)return;const r=card.getBoundingClientRect();const x=(event.clientX-r.left)/r.width-.5;const y=(event.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1200px) rotateX(${-y*5}deg) rotateY(${x*5}deg) translateY(-4px)`;});card.addEventListener('pointerleave',()=>card.style.removeProperty('transform'));});}
