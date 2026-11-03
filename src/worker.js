import * as gen from '../functions/api/generate.js';
import * as quiz from '../functions/api/quiz.js';
const nf=()=>new Response('{"error":"Tidak ditemukan"}',{status:404,headers:{'content-type':'application/json'}});
export default{async fetch(request,env){
 const u=new URL(request.url),ctx={request,env},m=request.method;
 if(u.pathname==='/api/generate'&&m==='POST')return gen.onRequestPost(ctx);
 if(u.pathname==='/api/quiz'&&m==='POST')return quiz.onRequestPost(ctx);
 if(u.pathname==='/api/quiz'&&m==='GET')return quiz.onRequestGet(ctx);
 if(u.pathname.startsWith('/api/'))return nf();
 if(u.pathname.startsWith('/q/')){let r=await env.ASSETS.fetch(new Request(new URL('/q.html',u)));
  if(r.status>=300&&r.status<400)r=await env.ASSETS.fetch(new Request(new URL(r.headers.get('location'),u)));return r}
 return env.ASSETS.fetch(request)}};
