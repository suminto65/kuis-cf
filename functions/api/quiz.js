const j=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{'content-type':'application/json'}});
export async function onRequestPost({request,env}){
 if(!env.ACCESS_CODE||request.headers.get('x-code')!==env.ACCESS_CODE)return j({error:'Kode akses salah'},401);
 const q=await request.json();if(!q.questions?.length)return j({error:'Kuis kosong'},400);
 const id=/^[a-z0-9]{8}$/.test(q.id||'')?q.id:crypto.randomUUID().replace(/-/g,'').slice(0,8);
 await env.QUIZ_KV.put('q:'+id,JSON.stringify({title:q.title,duration:q.duration,questions:q.questions}),{expirationTtl:31536000});
 return j({id});}
export async function onRequestGet({request,env}){
 const id=new URL(request.url).searchParams.get('id');const v=id&&await env.QUIZ_KV.get('q:'+id);
 return v?new Response(v,{headers:{'content-type':'application/json'}}):j({error:'Tidak ditemukan'},404);}
