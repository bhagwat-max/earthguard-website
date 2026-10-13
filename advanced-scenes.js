'use strict';
// Original projected geometry, rendered without WebGL or hover requirements.
// Shared selection keeps one dimensional scene active at a time on phones.
(() => {
 const stages=[...document.querySelectorAll('[data-scene]')];
 const state={connection:{selected:'electrode',hold:false,paused:false,time:0,frames:0,explode:0},rooftop:{selected:'terminal',paused:false,time:0,frames:0},process:{paused:false,time:0,frames:0}};
 const scenes=[];
 const mobile=()=>matchMedia('(pointer: coarse)').matches||innerWidth<800;
 function select(){
  let best=null,score=-Infinity;
  stages.forEach(stage=>{const r=stage.getBoundingClientRect();const visible=Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(r.top,70));if(!visible)return;
   const rating=visible/Math.min(r.height,innerHeight-70)-Math.abs((r.top+r.bottom)/2-innerHeight*.52)/innerHeight*.15;
   if(rating>score){score=rating;best=stage.dataset.scene;}
  });
  const next=best||'none';
  if(window.EarthGuardActiveScene!==next){window.EarthGuardActiveScene=next;document.dispatchEvent(new CustomEvent('earthguard:active-scene',{detail:{id:next}}));}
 }
 function poly(ctx,pts,fill,stroke){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.75;ctx.stroke();}}
 function path(ctx,pts,color,width=1){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
 function projector(w,h,angle,cy=.48,denom=470){
  const scale=Math.min(w/denom,h/520)*.95;
  return (x,y,z)=>{const rx=x*Math.cos(angle)+z*Math.sin(angle),rz=-x*Math.sin(angle)+z*Math.cos(angle);const depth=rz*.86-y*.48,p=950/(950+depth);return{x:w/2+rx*p*scale,y:h*cy+(-y*.86-rz*.48)*p*scale,depth,scale};};
 }
 function boxFaces(at,x,y,z,width,height,depth,colors,highlight=false){
  const v=[[-width/2,0,-depth/2],[width/2,0,-depth/2],[width/2,0,depth/2],[-width/2,0,depth/2],[-width/2,-height,-depth/2],[width/2,-height,-depth/2],[width/2,-height,depth/2],[-width/2,-height,depth/2]].map(p=>at(x+p[0],y+p[1],z+p[2]));
  return [[0,1,2,3],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]].map((ids,n)=>{const pts=ids.map(i=>v[i]);return{pts,depth:pts.reduce((s,p)=>s+p.depth,0)/4,color:colors[n===0?0:n%2?1:2],highlight};});
 }
 function paintFaces(ctx,faces){faces.sort((a,b)=>b.depth-a.depth).forEach(f=>{poly(ctx,f.pts,f.color,f.highlight?'#0755f5aa':'#ffffff75');});}
 function cylinder(ctx,at,x,y0,y1,z,r,material='copper',highlight=false){
  const top=at(x,y1,z),base=at(x,y0,z);const radius=r*top.scale;
  const gradient=ctx.createLinearGradient(base.x-radius,0,base.x+radius,0);
  const colors=material==='copper'?['#744634','#ab7552','#f1cba6','#bb845f','#7a4933']:['#466185','#88a0bb','#eaf2fa','#9ab6d5','#466183'];
  colors.forEach((c,i)=>gradient.addColorStop(i/4,c));
  ctx.beginPath();ctx.moveTo(top.x-radius,top.y);ctx.bezierCurveTo(top.x-radius,top.y-6,top.x+radius,top.y-6,top.x+radius,top.y);ctx.lineTo(base.x+radius,base.y);ctx.bezierCurveTo(base.x+radius,base.y+5,base.x-radius,base.y+5,base.x-radius,base.y);ctx.closePath();ctx.fillStyle=gradient;ctx.fill();ctx.strokeStyle=highlight?'#0755f5':'#ffffff88';ctx.lineWidth=highlight?1.2:.6;ctx.stroke();ctx.beginPath();ctx.ellipse(top.x,top.y,radius,Math.max(1,radius*.32),0,0,Math.PI*2);ctx.fillStyle=material==='copper'?'#ddba93':'#d3e1ef';ctx.fill();
 }
 function shadow(ctx,w,h,y){ctx.save();ctx.translate(w/2,h*y);ctx.scale(1,.25);const g=ctx.createRadialGradient(0,0,3,0,0,w*.34);g.addColorStop(0,'#243d6725');g.addColorStop(1,'#243d6700');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,w*.34,0,Math.PI*2);ctx.fill();ctx.restore();}
 function dot(ctx,p,r,color){ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
 function drawConnection(scene){
  const {ctx,w,h}=scene,s=state.connection,t=s.time/1000;
  const target=s.hold?0:(1-Math.cos(t*.95))/2;s.explode+=(target-s.explode)*.1;
  const e=s.explode,at=projector(w,h,-.65+Math.sin(t*.2)*.15,.46,430),lift=Math.sin(t*.8)*4;
  shadow(ctx,w,h,.7);
  // Reference plane and aligned component axis.
  const circle=[];for(let i=0;i<=90;i++){const a=i/90*Math.PI*2;circle.push(at(Math.cos(a)*145,-148,Math.sin(a)*95));}path(ctx,circle,'#a8b9d044',.8);
  ctx.setLineDash([2,5]);path(ctx,[at(0,170,0),at(0,-155,0)],'#7f9ac74d',.8);ctx.setLineDash([]);
  cylinder(ctx,at,-12,-135+lift,158+lift,0,11,'copper',s.selected==='electrode');
  const clampY=8+e*70+lift,conductorX=e*75,conductorY=-8-e*43+lift;
  paintFaces(ctx,[...boxFaces(at,conductorX,conductorY,0,235,7,18,['#d9aa7b','#956445','#b57d52'],s.selected==='conductor'),...boxFaces(at,0,clampY,0,95,24,53,['#e2bd88','#a47849','#be965f'],s.selected==='clamp')]);
  cylinder(ctx,at,-32,clampY,clampY+13,-13,6,'steel');cylinder(ctx,at,32,clampY,clampY+13,-13,6,'steel');
  // A fine blue halo identifies the component selected with touch controls.
  const focus=s.selected==='electrode'?at(-12,95+lift,0):s.selected==='clamp'?at(0,clampY,0):at(92+conductorX,conductorY,0);
  ctx.strokeStyle='#0755f54d';ctx.lineWidth=1;ctx.beginPath();ctx.arc(focus.x,focus.y,22+Math.sin(t*1.5)*2,0,Math.PI*2);ctx.stroke();dot(ctx,{x:focus.x+24,y:focus.y},2.4,'#0755f5');
  const caption=s.selected==='electrode'?'01 / ELECTRODE':s.selected==='clamp'?'02 / CONNECTION CLAMP':'03 / CONDUCTOR';ctx.font='500 8px Inter, Arial';ctx.fillStyle='#60748f';ctx.fillText(caption,23,h-97);
  ctx.font='8px Inter, Arial';ctx.fillStyle='#8a9bb0';ctx.textAlign='right';ctx.fillText(s.hold?'ASSEMBLED VIEW':'ASSEMBLY EXPLORATION',w-23,h-97);ctx.textAlign='left';
 }
 function drawRooftop(scene){
  const {ctx,w,h}=scene,s=state.rooftop,t=s.time/1000;
  const at=projector(w,h,-.66+Math.sin(t*.2)*.055,.47,470);
  shadow(ctx,w,h,.69);
  const faces=[];
  // A cutaway block is deliberately schematic, with no installation dimensions.
  faces.push(...boxFaces(at,0,-60,0,290,57,235,['#ded7c7','#baad94','#cabda5']));
  faces.push(...boxFaces(at,0,78,0,215,138,155,['#d3e0f0','#e8eef6','#c0d0e4']));
  faces.push(...boxFaces(at,0,85,0,232,8,174,['#758ca9','#536c8c','#617b9c']));
  paintFaces(ctx,faces);
  // Rooftop solar modules make the context concrete, without implying a design.
  for(let row=0;row<2;row++)for(let col=0;col<3;col++){
   const x=-68+col*55,z=-35+row*52;
   const points=[at(x-23,86,z-19),at(x+23,86,z-19),at(x+23,86,z+19),at(x-23,86,z+19)];poly(ctx,points,'#194c8c','#b8d6f2');
   path(ctx,[at(x,86,z-19),at(x,86,z+19)],'#7fb0df77',.55);path(ctx,[at(x-23,86,z),at(x+23,86,z)],'#7fb0df77',.55);
  }
  // Gentle facade details.
  for(let n=0;n<4;n++){const x=-72+n*47;poly(ctx,[at(x-12,48,-78),at(x+12,48,-78),at(x+12,17,-78),at(x-12,17,-78)],'#acc0d9','#edf3f9');}
  cylinder(ctx,at,90,85,174,-61,3.5,'steel',s.selected==='terminal');
  cylinder(ctx,at,123,-109,-60,-118,5,'copper',s.selected==='ground');
  // The animated dot is a category-navigation trace, not electrical simulation.
  const route=[at(90,170,-61),at(90,86,-61),at(111,86,-61),at(111,86,-80),at(111,-58,-80),at(123,-60,-118),at(123,-109,-118)];
  path(ctx,route,'#7297cb',3);path(ctx,route,'#d8e9ff',1);
  const lengths=route.slice(1).map((p,i)=>Math.hypot(p.x-route[i].x,p.y-route[i].y)),total=lengths.reduce((a,b)=>a+b,0);
  let d=(t*.14%1)*total,pulse=route[0];for(let i=0;i<lengths.length;i++){if(d<=lengths[i]){const f=d/lengths[i];pulse={x:route[i].x+(route[i+1].x-route[i].x)*f,y:route[i].y+(route[i+1].y-route[i].y)*f};break;}d-=lengths[i];}
  dot(ctx,pulse,5,'#0755f518');dot(ctx,pulse,2.6,'#0755f5');
  const focus=s.selected==='terminal'?at(90,166,-61):s.selected==='conductor'?at(111,12,-80):at(123,-90,-118);
  ctx.beginPath();ctx.arc(focus.x,focus.y,16+Math.sin(t*1.4)*2,0,Math.PI*2);ctx.strokeStyle='#0755f57a';ctx.lineWidth=1.1;ctx.stroke();
  // Dashed reference below ground reinforces the schematic cutaway.
  ctx.setLineDash([2,5]);path(ctx,[at(-120,-113,-119),at(143,-113,-119)],'#9d907d66',.7);ctx.setLineDash([]);
 }
 function drawProcess(scene){
  const {ctx,w}=scene,t=state.process.time/1000,grid=scene.stage;
  const cards=[...grid.querySelectorAll('.process-card')];
  const points=cards.map(c=>innerWidth<=520?{x:7,y:c.offsetTop+27}:{x:c.offsetLeft+c.offsetWidth/2,y:9});
  if(points.length<2)return;path(ctx,points,'#bbcef0',1);
  points.forEach(p=>{dot(ctx,p,3.6,'#fff');ctx.strokeStyle='#9fb9e6';ctx.lineWidth=1;ctx.stroke();});
  const lengths=points.slice(1).map((p,i)=>Math.hypot(p.x-points[i].x,p.y-points[i].y)),total=lengths.reduce((a,b)=>a+b,0);
  let d=(t*.18%1)*total,p=points[0];for(let i=0;i<lengths.length;i++){if(d<=lengths[i]){const f=d/lengths[i];p={x:points[i].x+(points[i+1].x-points[i].x)*f,y:points[i].y+(points[i+1].y-points[i].y)*f};break;}d-=lengths[i];}
  dot(ctx,p,5,'#0755f51a');dot(ctx,p,2.8,'#0755f5');
 }
 const renderers={connection:drawConnection,rooftop:drawRooftop,process:drawProcess};
 Object.keys(renderers).forEach(id=>{
  const stage=document.querySelector(`[data-scene="${id}"]`),canvas=stage.querySelector('canvas');let ctx;
  try{ctx=canvas.getContext('2d',{alpha:true});}catch(error){}
  if(!ctx){stage.dataset.unavailable='true';canvas.hidden=true;return;}
  const scene={id,stage,canvas,ctx,w:0,h:0,dpr:1};
  scene.draw=()=>{ctx.setTransform(scene.dpr,0,0,scene.dpr,0,0);ctx.clearRect(0,0,scene.w,scene.h);renderers[id](scene);state[id].frames++;canvas.dataset.frame=String(state[id].frames);canvas.dataset.time=String(Math.round(state[id].time));};
  scene.resize=()=>{const r=stage.getBoundingClientRect();scene.w=r.width;scene.h=r.height;scene.dpr=Math.min(devicePixelRatio||1,mobile()?1.5:2);canvas.width=Math.max(1,Math.round(scene.w*scene.dpr));canvas.height=Math.max(1,Math.round(scene.h*scene.dpr));scene.draw();};
  if('ResizeObserver' in window)new ResizeObserver(scene.resize).observe(stage);else window.addEventListener('resize',scene.resize,{passive:true});
  scene.resize();scenes.push(scene);
  const pause=stage.querySelector('.scene-pause');
  if(pause)pause.addEventListener('click',()=>{const s=state[id];s.paused=!s.paused;pause.setAttribute('aria-pressed',String(s.paused));pause.setAttribute('aria-label',`${s.paused?'Play':'Pause'} ${id} animation`);pause.querySelector('span').textContent=s.paused?'▶':'Ⅱ';pause.querySelector('b').textContent=s.paused?'Play':'Pause';stage.querySelector('.scene-status').textContent=s.paused?'Motion paused':id==='connection'?(s.hold?'Assembly held':'Automatic assembly'):'Connection trace';});
 });
 const components={electrode:['The ground connection.','Share the electrode material, length and diameter required by your project specification.'],clamp:['Where the details meet.','Enquire with the rod and conductor dimensions, material and connection type. Compatibility should be checked before ordering.'],conductor:['A continuous connection.','Specify the conductor material, cross-section, quantity and the requirements from your approved project drawing.']};
 document.querySelectorAll('[data-component]').forEach(button=>button.addEventListener('click',()=>{
  state.connection.selected=button.dataset.component;document.querySelectorAll('[data-component]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  const detail=components[button.dataset.component];document.getElementById('component-title').textContent=detail[0];document.getElementById('component-description').textContent=detail[1];scenes.find(s=>s.id==='connection')?.draw();
 }));
 document.getElementById('assembly-toggle').addEventListener('click',event=>{const s=state.connection;s.hold=!s.hold;const b=event.currentTarget;b.setAttribute('aria-pressed',String(s.hold));b.innerHTML=s.hold?'Resume assembly <span>↗</span>':'Hold assembled <span>↙</span>';if(s.hold)s.explode=0;const scene=scenes.find(s=>s.id==='connection');if(scene){scene.draw();scene.stage.querySelector('.scene-status').textContent=s.paused?'Motion paused':s.hold?'Assembly held':'Automatic assembly';}});
 const routes={terminal:'Enquire with the air terminal specified for your project, including its material and dimensions.',conductor:'Share the approved conductor material and cross-section, together with the required length and connection accessories.',ground:'Send the electrode specification, quantities and associated earthing materials from your project BOM.'};
 document.querySelectorAll('[data-route]').forEach(button=>button.addEventListener('click',()=>{state.rooftop.selected=button.dataset.route;document.querySelectorAll('[data-route]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});document.getElementById('route-detail').textContent=routes[button.dataset.route];scenes.find(s=>s.id==='rooftop')?.draw();}));
 // Native rAF and a guarded timeout fallback use the same renderer and state.
 let last=0,lastRaf=performance.now(),fallback=0;
 function drawActive(dt){if(document.hidden)return;const scene=scenes.find(s=>s.id===window.EarthGuardActiveScene);if(scene&&!state[scene.id].paused){state[scene.id].time+=Math.min(dt,75);scene.draw();}}
 function tick(now){lastRaf=performance.now();if(fallback){clearTimeout(fallback);fallback=0;}if(!last)last=now;const dt=now-last;if(dt>=(mobile()?1000/30:1000/60)-1){drawActive(dt);last=now;}requestAnimationFrame(tick);}
 function fallbackTick(){fallback=0;if(document.hidden||performance.now()-lastRaf<350)return;drawActive(40);fallback=setTimeout(fallbackTick,40);}
 setInterval(()=>{select();if(!document.hidden&&!fallback&&performance.now()-lastRaf>350)fallbackTick();},400);
 window.addEventListener('scroll',select,{passive:true});window.addEventListener('resize',select,{passive:true});window.addEventListener('pageshow',()=>{last=0;select();});document.addEventListener('visibilitychange',()=>{last=0;select();});
 select();requestAnimationFrame(tick);
})();
