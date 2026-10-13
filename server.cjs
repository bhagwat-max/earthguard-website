// Dependency-free local preview for Windows, macOS and Linux.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp'};
const port = Number(process.env.PORT || 3000);
http.createServer((req,res)=>{
 let pathname;
 try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); }
 catch { res.writeHead(400);res.end('Bad request');return; }
 const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
 if(file !== root && !file.startsWith(root + path.sep)){res.writeHead(403);res.end('Forbidden');return;}
 fs.stat(file,(error,stat)=>{
  if(error || !stat.isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  if(req.method==='HEAD'){res.end();return;}
  fs.createReadStream(file).on('error',()=>res.destroy()).pipe(res);
 });
}).listen(port,()=>console.log(`EarthGuard preview: http://localhost:${port}`));
