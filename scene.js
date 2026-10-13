'use strict';
// Projected 3D geometry in a 2D canvas: no WebGL, CSS 3D or remote runtime.
// The scene draws automatically on touch devices, at a capped resolution/FPS.
(() => {
 const canvas=document.getElementById('grounding-canvas');
 if(!canvas)return;
 let ctx;
 try {ctx=canvas.getContext('2d',{alpha:true});}catch(error){}
 if(!ctx){document.querySelector('.canvas-fallback').hidden=false;canvas.hidden=true;return;}
 const stage=canvas.parentElement,button=document.getElementById('motion-toggle');
 const status=document.getElementById('motion-status');
 const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
 let paused=false,visible=true,raf=0,last=0,time=0,frames=0;
 let fallback=0,lastRaf=performance.now();
 let w=0,h=0,dpr=1,target=0,pointer=0;
 const mobile=()=>window.matchMedia('(pointer: coarse)').matches||window.innerWidth<800;
 function resize(){
  const rect=stage.getBoundingClientRect();w=rect.width;h=rect.height;
  dpr=Math.min(window.devicePixelRatio||1,mobile()?1.5:2);
  canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));
  draw();
 }
 function project(x,y,z,angle){
  const rx=x*Math.cos(angle)+z*Math.sin(angle),rz=-x*Math.sin(angle)+z*Math.cos(angle);
  const depth=rz*.86-y*.48,p=900/(900+depth);
  const scale=Math.min(w/465,h/520)*.86;
  return {x:w/2+rx*p*scale,y:h*.47+(-y*.86-rz*.48)*p*scale,depth};
 }
 function polygon(points,fill,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.75;ctx.stroke();}}
 function line(points,color,width=1){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
 function draw(){
  if(!w||!h)return;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const t=time*.001,angle=-.6+Math.sin(t*.32)*.48+pointer*.25;
  const float=Math.sin(t*1.2)*9;
  const at=(x,y,z)=>project(x,y+float,z,angle);
  const grid=(x,y,z)=>project(x,y,z,-.6);
  // Quiet engineering grid beneath the object.
  ctx.globalAlpha=.5;
  for(let x=-300;x<=300;x+=50){line([grid(x,-165,-280),grid(x,-165,280)],'#20324f',.55);line([grid(-300,-165,x),grid(300,-165,x)],'#20324f',.55);}
  ctx.globalAlpha=1;
  ctx.save();ctx.translate(w/2,h*.72);ctx.scale(1,.25);
  const localShadow=ctx.createRadialGradient(0,0,5,0,0,w*.32);localShadow.addColorStop(0,'#020812bb');localShadow.addColorStop(1,'#02081200');ctx.fillStyle=localShadow;ctx.beginPath();ctx.arc(0,0,w*.32,0,Math.PI*2);ctx.fill();ctx.restore();
  // Orbital current traces animate independently of touch or mouse input.
  [185,228].forEach((radius,index)=>{
   const pts=[];for(let n=0;n<=100;n++){const a=n/100*Math.PI*2;pts.push(at(Math.cos(a)*radius,-70,Math.sin(a)*radius));}
   line(pts,index?'#597fad25':'#6d9cde38',.8);
   for(let n=0;n<3;n++){const a=t*(index?-.45:.65)+n*Math.PI*2/3;const p=at(Math.cos(a)*radius,-70,Math.sin(a)*radius);ctx.beginPath();ctx.arc(p.x,p.y,index?2:3,0,Math.PI*2);ctx.fillStyle='#74a6ff';ctx.fill();}
  });
  const faces=[];
  function box(width,depth,level,thickness,index){
   const v=[[-width/2,level,-depth/2],[width/2,level,-depth/2],[width/2,level,depth/2],[-width/2,level,depth/2],[-width/2,level-thickness,-depth/2],[width/2,level-thickness,-depth/2],[width/2,level-thickness,depth/2],[-width/2,level-thickness,depth/2]].map(a=>at(...a));
   [[0,1,2,3],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]].forEach((ids,n)=>{
    const points=ids.map(i=>v[i]);faces.push({points,depth:points.reduce((a,b)=>a+b.depth,0)/4,n,index});
   });
  }
  box(215,120,-4,18,0);box(157,98,-62-Math.sin(t*1.2)*3,18,1);box(100,72,-117-Math.sin(t*1.2)*6,18,2);
  faces.sort((a,b)=>b.depth-a.depth);
  faces.forEach(face=>{
   const points=face.points;const grad=ctx.createLinearGradient(points[0].x,points[0].y,points[2].x,points[2].y);
   if(face.n===0){grad.addColorStop(0,'#8eb7ff');grad.addColorStop(.24,'#427bf7');grad.addColorStop(.72,'#0855f4');grad.addColorStop(1,'#124bc0');}
   else{grad.addColorStop(0,face.n===2?'#0a3283':'#174ec3');grad.addColorStop(1,'#041c58');}
   polygon(points,grad,face.n===0?'#a8c8ff75':'#3e6cc766');
   if(face.n===0){line([points[0],points[1]],'#d0e1ffaa',1.1);}
  });
  // Machined metal electrode. Its changing highlights make motion legible.
  const top=at(0,183,0),base=at(0,-4,0);
  const radius=Math.min(w/465,h/520)*15;
  const shine=ctx.createLinearGradient(base.x-radius,0,base.x+radius,0);
  shine.addColorStop(0,'#253a61');shine.addColorStop(.16,'#5e87bf');shine.addColorStop(.38,'#e3efff');shine.addColorStop(.49,'#b0cefa');shine.addColorStop(.7,'#3871ce');shine.addColorStop(1,'#142c54');
  ctx.beginPath();ctx.moveTo(top.x-radius,top.y);ctx.bezierCurveTo(top.x-radius,top.y-14,top.x+radius,top.y-14,top.x+radius,top.y);ctx.lineTo(base.x+radius,base.y);ctx.bezierCurveTo(base.x+radius,base.y+7,base.x-radius,base.y+7,base.x-radius,base.y);ctx.closePath();ctx.fillStyle=shine;ctx.fill();
  ctx.strokeStyle='#b7d4ff50';ctx.lineWidth=.7;ctx.stroke();
  ctx.beginPath();ctx.ellipse(top.x,top.y,radius,radius*.34,0,0,Math.PI*2);ctx.fillStyle='#bdd5f4';ctx.fill();
  // Slowly travelling energy along the spine.
  const phase=(t*.38)%1,sy=top.y+(base.y-top.y)*phase;
  const energy=ctx.createLinearGradient(0,sy-20,0,sy+20);energy.addColorStop(0,'#95c1ff00');energy.addColorStop(.5,'#dbf1ffbb');energy.addColorStop(1,'#95c1ff00');ctx.fillStyle=energy;ctx.fillRect(base.x-radius+2,sy-20,Math.max(2,radius*2-4),40);
  // Three floating details, projected with the same camera.
  [[-160,110,25],[140,55,-5],[-95,-95,80]].forEach((p,i)=>{
   const pt=at(p[0],p[1]+Math.sin(t+i*2)*15,p[2]);const s=i===1?7:4;
   ctx.save();ctx.translate(pt.x,pt.y);ctx.rotate(t*.35+i);ctx.fillStyle='#578bf3';ctx.fillRect(-s/2,-s/2,s,s);ctx.restore();
  });
  frames++;canvas.dataset.frame=String(frames);canvas.dataset.time=String(Math.round(time));
 }
 function tick(now){
  raf=0;lastRaf=performance.now();if(fallback){clearTimeout(fallback);fallback=0;}if(paused||!visible||document.hidden){last=0;return;}
  const delay=mobile()?1000/30:1000/60;
  if(!last){last=now;}
  const dt=now-last;
  if(dt>=delay-1){time+=Math.min(dt,75);last=now;pointer+=(target-pointer)*.08;draw();}
  raf=requestAnimationFrame(tick);
 }
 function start(){if(!raf&&!paused&&visible&&!document.hidden)raf=requestAnimationFrame(tick);}
 function sync(){
  document.documentElement.classList.toggle('motion-paused',paused);
  button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'Play animation':'Pause animation');
  button.querySelector('.motion-icon').textContent=paused?'▶':'Ⅱ';button.querySelector('.motion-label').textContent=paused?'Play':'Pause';
  status.textContent=paused?'Motion paused':'Live motion';
  if(paused){if(raf)cancelAnimationFrame(raf);raf=0;last=0;clearTimeout(fallback);fallback=0;}else start();
  document.dispatchEvent(new CustomEvent('earthguard:motion',{detail:{paused}}));
 }
 button.addEventListener('click',()=>{paused=!paused;sync();});
 // Playback is a site-level choice. Phone preference changes cannot reset Pause.
 const onPreference=()=>{draw();};
 if(preference.addEventListener)preference.addEventListener('change',onPreference);else preference.addListener(onPreference);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0;last=0;}else start();});
 // Geometry is the visibility authority; embedded browsers can delay or omit
 // IntersectionObserver callbacks. Keep the observer as a prompt, not a gate.
 function checkVisibility(){
  const rect=stage.getBoundingClientRect();visible=rect.bottom>-80&&rect.top<innerHeight+80;
  if(!visible&&raf){cancelAnimationFrame(raf);raf=0;last=0;}else start();
 }
 if('IntersectionObserver' in window){new IntersectionObserver(checkVisibility,{rootMargin:'80px'}).observe(stage);}
 window.addEventListener('scroll',checkVisibility,{passive:true});
 window.addEventListener('pageshow',()=>{checkVisibility();lastRaf=performance.now();start();});
 // A low-frequency watchdog handles WebViews that suspend rAF while visible.
 // The timeout path is only active while rAF is stale, never alongside it.
 function fallbackTick(){
  fallback=0;
  if(paused||document.hidden||!visible||performance.now()-lastRaf<350)return;
  time+=40;draw();fallback=setTimeout(fallbackTick,40);
 }
 setInterval(()=>{
  checkVisibility();
  if(!paused&&visible&&!document.hidden&&!fallback&&performance.now()-lastRaf>350){fallbackTick();}
 },400);
 stage.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){const rect=stage.getBoundingClientRect();target=((e.clientX-rect.left)/rect.width-.5)*2;}});
 stage.addEventListener('pointerleave',()=>target=0);
 if('ResizeObserver' in window)new ResizeObserver(resize).observe(stage);else window.addEventListener('resize',resize);
 resize();sync();
})();
