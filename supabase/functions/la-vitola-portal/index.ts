
import { createClient } from 'npm:@supabase/supabase-js@2.105.4';
const SB_URL = Deno.env.get('SUPABASE_URL');
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const ANON = Deno.env.get('SUPABASE_ANON_KEY');
const api = createClient(SB_URL, SERVICE, {auth:{persistSession:false,autoRefreshToken:false}});
const auth = () => createClient(SB_URL, ANON, {auth:{persistSession:false,autoRefreshToken:false}});
const PHONE = '+529612548354';
const ALIAS = 'la-vitola-9612548354@streetboss.com.mx';
const ROOT = 'https://streetboss.com.mx/menu/la-vitola/acceso';
const PUBLIC = 'https://streetboss.com.mx/menu/la-vitola';
const COOK_PATH='/menu/la-vitola/acceso';
const e = x => String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const style = ':root{color-scheme:dark;font-family:system-ui,Arial,sans-serif;background:#0d0e12;color:#fff}*{box-sizing:border-box}body{padding:22px 12px;margin:0}main{max-width:780px;margin:auto}header{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;margin:20px 0 30px}h1{font-size:28px;line-height:1.1;margin:0 0 14px}h2{font-size:20px;margin:20px 0 12px}p{color:#aeb0b9;line-height:1.5}.card{padding:23px;background:#191b22;border:1px solid #35353b;border-radius:20px;margin-bottom:18px}label{display:block;font-size:12px;font-weight:700;margin:16px 0 6px}input,textarea{display:block;width:100%;border:1px solid #42424d;border-radius:10px;padding:12px;background:#101116;color:#fff;font:inherit}textarea{min-height:70px}button,.btn{display:inline-block;background:#ff4b00;color:white;border:0;border-radius:10px;padding:12px 18px;cursor:pointer;font-size:14px;font-weight:800;text-decoration:none;margin:8px 6px 4px 0}button.subtle,.btn.subtle{background:#3c3e47}a{color:#ff914e}.row{display:flex;gap:12px;align-items:end}.row>div:first-child{flex:1}.row>div:last-child{width:125px}.error{border:1px solid #cc5544;background:#49241f;padding:13px;border-radius:12px}.success{background:#153e2b;border:1px solid #32844b;padding:15px;border-radius:12px}.category{color:#ff914e;margin:23px 0 8px;font-weight:900;font-size:12px;letter-spacing:1.3px}.product{padding-bottom:12px;border-bottom:1px solid #4445}[hidden]{display:none!important}@media(max-width:520px){.card{padding:17px}.row>div:last-child{width:100px}button,.btn{width:100%}}';
const adminStyle = '.categoryNav{display:flex;gap:8px;overflow-x:auto;position:sticky;top:0;z-index:20;padding:10px 0;background:#0d0e12}.categoryNav a{white-space:nowrap;display:block;padding:12px 15px;background:#292b34;border-radius:999px;font-size:13px;font-weight:800;text-decoration:none;color:white}.intro{margin-bottom:12px}.status{font-size:12px;color:#ff914e;font-weight:800}.dish{padding:18px 0;border-bottom:1px solid #393a42}.dish:last-child{border:0}.dishTop{display:flex;justify-content:space-between;gap:12px;align-items:center}.dish h3{font-size:16px;margin:0 0 4px}.dish small,.photoBox small{color:#9698a3}.avail,.inline{display:flex;align-items:center;gap:7px;font-size:12px;white-space:nowrap}.avail input,.inline input{width:auto}.photoBox{display:flex;align-items:center;gap:12px;border:1px dashed #51535e;border-radius:14px;padding:12px;margin-top:14px;background:#111319}.photoBox img{width:80px;height:80px;object-fit:cover;border-radius:12px}.photoBox>div{flex:1;min-width:0}.photoBox label{margin-top:3px}.photoBox input[type=file]{max-width:100%;padding:8px;font-size:12px}.formRow{display:grid;grid-template-columns:minmax(0,1fr) 116px;gap:12px}.saveBar{position:sticky;bottom:0;display:flex;gap:8px;padding:12px;background:#111319;z-index:10;border-radius:16px;border:1px solid #42424c}.saveBar button{margin:0;flex:1;min-width:0;padding:15px 8px}.dish input[type=number]{font-variant-numeric:tabular-nums}section.card{scroll-margin-top:90px}';
function respond(content, status=200, cookies=[]) {
 const h=new Headers({'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; form-action 'self' https://streetboss.com.mx; frame-ancestors 'none'; base-uri 'none'"});
 cookies.forEach(c=>h.append('Set-Cookie',c));
 return new Response('<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>La Vitola · Acceso privado</title><style>'+style+'</style></head><body><main><header><b>🟠 StreetBoss / La Vitola</b><a href="'+PUBLIC+'">Menú público</a></header>'+content+'</main></body></html>',{status,headers:h});
}
function fail(message,status=400){return respond('<section class="card"><h1>No se pudo completar</h1><div class="error">'+e(message)+'</div><p><a href="'+ROOT+'">Volver al acceso</a></p></section>',status);}
function cookie(name,val,max){return name+'='+encodeURIComponent(val)+'; HttpOnly; Secure; SameSite=Lax; Path='+COOK_PATH+'; Max-Age='+max;}
function sessionCookies(session){return [cookie('sbv_access',session.access_token,session.expires_in||3600),cookie('sbv_refresh',session.refresh_token,864000)];}
function clearCookies(){return [cookie('sbv_access','',0),cookie('sbv_refresh','',0),cookie('sbv_csrf','',0)];}
function csrfToken(req){const old=readCookies(req).sbv_csrf;return /^[a-f0-9]{64}$/.test(old||'')?old:Array.from(crypto.getRandomValues(new Uint8Array(32)),x=>x.toString(16).padStart(2,'0')).join('');}
function csrfField(value){return '<input type="hidden" name="csrf" value="'+e(value)+'">';}
function hasCsrf(req,form){const saved=readCookies(req).sbv_csrf;return !!saved&&/^[a-f0-9]{64}$/.test(saved)&&saved===String(form.get('csrf')||'');}
function redirect(cookies=[]){const h=new Headers({'Location':ROOT,'Cache-Control':'no-store'});cookies.forEach(c=>h.append('Set-Cookie',c));return new Response(null,{status:303,headers:h});}
function readCookies(req){return Object.fromEntries((req.headers.get('cookie')||'').split(';').filter(Boolean).map(s=>{const i=s.indexOf('=');return [s.slice(0,i).trim(),decodeURIComponent(s.slice(i+1))]}));}
async function whitelisted(id){const {data}=await api.from('sb_vitola_admins').select('user_id').eq('user_id',id).maybeSingle();return !!data;}
async function current(req){
 const c=readCookies(req);
 if(c.sbv_access){const {data,error}=await api.auth.getUser(c.sbv_access);if(!error&&data?.user&&await whitelisted(data.user.id))return {user:data.user,cookies:[]};}
 if(c.sbv_refresh){const {data,error}=await auth().auth.refreshSession({refresh_token:c.sbv_refresh});if(!error&&data?.user&&data?.session&&await whitelisted(data.user.id))return {user:data.user,cookies:sessionCookies(data.session)};}
 return null;
}
function login(message=''){
 return respond('<section class="card" id="login"><h1>Acceso a La Vitola</h1><p>Solo para la cuenta autorizada de este restaurante. No da acceso a StreetBoss Central.</p>'+(message?'<div class="error">'+e(message)+'</div>':'')+'<form method="post" action="'+ROOT+'"><input type="hidden" name="action" value="login"><label>Número de teléfono</label><input type="tel" name="phone" placeholder="Número de teléfono" autocomplete="username" required><label>Contraseña</label><input type="password" name="password" autocomplete="current-password" required><button>Entrar a mi cuenta</button></form><p>Para el primer acceso, abre el enlace privado de activación.</p></section><section class="card" id="activate" hidden><h1>Crea tu contraseña</h1><p>Esta invitación es de un solo uso y permite administrar únicamente La Vitola.</p><form method="post" action="'+ROOT+'"><input type="hidden" name="action" value="activate"><input type="hidden" name="token" id="token"><label>Contraseña nueva (mínimo 12 caracteres)</label><input type="password" name="password" minlength="12" maxlength="128" required autocomplete="new-password"><label>Repite la contraseña</label><input type="password" name="confirm" minlength="12" maxlength="128" required autocomplete="new-password"><button>Crear mi contraseña</button></form></section><script>const t=new URLSearchParams(location.hash.slice(1)).get("activar");if(t&&/^[a-zA-Z0-9_-]{32,150}$/.test(t)){document.getElementById("token").value=t;document.getElementById("login").hidden=true;document.getElementById("activate").hidden=false}</script>');
}
async function catalog(){const {data,error}=await api.from('sb_vitola_catalog').select('slug,revision,draft,published').eq('slug','la-vitola').single();if(error||!data)throw new Error('Catalog unavailable');return data;}
async function publishedMenu(){const c=await catalog();return new Response('window.STREETBOSS_MENU = '+JSON.stringify(c.published)+';',{headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'public,max-age=30,s-maxage=30','X-Content-Type-Options':'nosniff'}});}

function dashboard(c,csrf){
 const r=c.draft.restaurante||{};
 const cats=c.draft.categorias||[];
 const prods=c.draft.productos||[];
 const esc=v=>e(v??'');
 const input=(name,value,label,max=150)=>'<label>'+esc(label)+'</label><input type="text" name="'+name+'" value="'+esc(value||'')+'" maxlength="'+max+'">';
 const photo=(name,url,label)=>{
  let out='<div class="photoBox">';
  if(url)out+='<img loading="lazy" src="'+esc(url)+'" alt="'+esc(label)+'">';
  out+='<div><label>'+esc(label)+'</label><input type="file" accept="image/jpeg,image/png,image/webp" name="'+name+'_photo">';
  out+='<small>JPG, PNG o WebP · hasta 5 MB</small>';
  if(url)out+='<label class="inline"><input type="checkbox" name="'+name+'_delete" value="yes"> Quitar fotografía actual</label>';
  return out+'</div></div>';
 };
 let html='<section class="card intro"><h1>Edita La Vitola</h1><p>Cambia información, fotos y precios desde tu celular. Los extras solo se ofrecen al elegir una hamburguesa.</p><div class="status">Catálogo · '+prods.length+' elementos · versión '+c.revision+'</div></section>';
 html+='<nav class="categoryNav"><a href="#restaurante">Negocio</a>'+cats.map(cat=>'<a href="#cat-'+esc(cat.id)+'">'+(cat.id==='extras'?'Extras de hamburguesa':esc(cat.nombre))+'</a>').join('')+'</nav>';
 html+='<form method="post" enctype="multipart/form-data" action="'+ROOT+'">'+csrfField(csrf)+'<input type="hidden" name="revision" value="'+c.revision+'">';
 html+='<section class="card" id="restaurante"><h2>Datos del restaurante</h2>';
 html+=input('rest_name',r.nombre,'Nombre');
 html+=input('rest_whatsapp',r.whatsapp,'WhatsApp de pedidos',20);
 html+=input('rest_description',r.descripcion,'Descripción',300);
 html+=input('rest_schedule',r.horario,'Horarios',160);
 html+=input('rest_address',r.direccion,'Dirección',300);
 html+=photo('rest_logo',r.logo,'Logotipo del negocio');
 html+=photo('rest_banner',r.portada,'Fotografía de portada');
 html+='</section>';
 for(const cat of cats){
  const isExtra=cat.id==='extras';
  const products=prods.filter(x=>x.categoria===cat.id);
  html+='<section class="card" id="cat-'+esc(cat.id)+'"><h2>'+(isExtra?'Extras para personalizar hamburguesas':esc(cat.nombre))+'</h2><p>'+(isExtra?'Estos ingredientes no aparecen como productos independientes. Se ofrecen dentro de cada hamburguesa, con su precio adicional.':'Edita tus productos, precios, fotografía y disponibilidad.')+'</p>';
  for(const product of products){
   const id=esc(product.id);
   html+='<article class="dish"><div class="dishTop"><div>';
   html+='<h3>'+esc(product.nombre)+'</h3><small>'+esc(cat.nombre)+'</small>';
   html+='</div><label class="avail"><input type="checkbox" name="prod_'+id+'_active" '+(product.activo!==false?'checked':'')+'> Disponible</label></div>';
   html+=photo('prod_'+id,product.foto||product.imagen,'Fotografía del producto');
   html+='<div class="formRow"><div>'+input('prod_'+id+'_name',product.nombre,'Nombre',120)+'</div>';
   html+='<div><label>'+(isExtra?'Precio adicional (MXN)':'Precio (MXN)')+'</label><input type="number" name="prod_'+id+'_price" min="0" max="100000" step="0.01" value="'+esc(product.precio)+'" required></div></div>';
   if(!isExtra) html+='<label>Descripción</label><textarea name="prod_'+id+'_description" maxlength="500" rows="2">'+esc(product.descripcion||'')+'</textarea>';
   html+='</article>';
  }
  html+='</section>';
 }
 html+='<div class="saveBar"><button type="submit" name="action" value="save" class="subtle">Guardar borrador</button><button type="submit" name="action" value="publish">Publicar menú</button></div></form>';
 html+='<form method="post" action="'+ROOT+'">'+csrfField(csrf)+'<input type="hidden" name="action" value="logout"><button class="subtle">Cerrar sesión</button></form>';
 return html;
}
async function claim(f){
 const token=String(f.get('token')||'');const pass=String(f.get('password')||'');const confirm=String(f.get('confirm')||'');
 if(!/^[a-zA-Z0-9_-]{32,150}$/.test(token)||pass.length<12||pass.length>128||pass!==confirm)return fail('Comprueba el enlace y elige una contraseña de al menos 12 caracteres.');
 const h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));
 const sha=[...new Uint8Array(h)].map(b=>b.toString(16).padStart(2,'0')).join('');
 const {data:invite}=await api.from('sb_vitola_invites').select('token_hash,phone,used_at,expires_at').eq('token_hash',sha).maybeSingle();
 if(!invite||invite.phone!==PHONE||invite.used_at||Date.parse(invite.expires_at)<Date.now())return fail('La invitación ya se usó o ha expirado.');
 const {data:lock,error:lockErr}=await api.from('sb_vitola_invites').update({used_at:new Date().toISOString()}).eq('token_hash',sha).is('used_at',null).select('token_hash').maybeSingle();
 if(lockErr||!lock)return fail('La invitación ya no está disponible.');
 const {data:created,error:createErr}=await api.auth.admin.createUser({email:ALIAS,password:pass,email_confirm:true,app_metadata:{business_slug:'la-vitola'}});
 if(createErr||!created?.user){console.error('La Vitola user creation error',createErr?.message);return fail('No fue posible crear la cuenta. Solicita una nueva invitación.',503);}
 const {error:memberErr}=await api.from('sb_vitola_admins').insert({user_id:created.user.id});
 if(memberErr){console.error('La Vitola membership error',memberErr.message);return fail('La cuenta se creó, pero requiere revisión de acceso.',503);}
 const {data:entry,error:loginErr}=await auth().auth.signInWithPassword({email:ALIAS,password:pass});
 if(loginErr||!entry?.session)return respond('<section class="card"><h1>Cuenta activada</h1><div class="success">Tu contraseña se creó. Entra con tu número.</div><a class="btn" href="'+ROOT+'">Iniciar sesión</a></section>');
 return redirect(sessionCookies(entry.session));
}
async function doLogin(f){
 const phone='+'+String(f.get('phone')||'').replace(/[^0-9]/g,'');
 const pass=String(f.get('password')||'');
 if(phone!==PHONE||!pass)return login('Teléfono o contraseña incorrectos.');
 const {data,error}=await auth().auth.signInWithPassword({email:ALIAS,password:pass});
 if(error||!data?.session||!data?.user||!await whitelisted(data.user.id))return login('Teléfono o contraseña incorrectos.');
 return redirect(sessionCookies(data.session));
}

async function storePhoto(file,pathName){
 if(!file || typeof file==='string' || !file.size) return null;
 const allowed={'image/webp':'webp','image/jpeg':'jpg','image/png':'png'};
 const extension=allowed[file.type];
 if(!extension || file.size>5*1024*1024)throw new Error('Las fotos deben ser JPG, PNG o WebP y pesar menos de 5 MB.');
 const path=pathName+'/'+crypto.randomUUID()+'.'+extension;
 const {error}=await api.storage.from('la-vitola-media').upload(path,new Uint8Array(await file.arrayBuffer()),{contentType:file.type,upsert:false,cacheControl:'3600'});
 if(error)throw new Error('No se pudo subir la imagen. Comprueba su formato y vuelve a intentar.');
 return api.storage.from('la-vitola-media').getPublicUrl(path).data.publicUrl;
}
async function save(f,publish){
 const row=await catalog();const rev=Number(f.get('revision'));
 if(!Number.isSafeInteger(rev)||rev!==Number(row.revision))return fail('El menú cambió en otra sesión. Recarga la página para evitar sobrescribir cambios.',409);
 const draft=structuredClone(row.draft),r=draft.restaurante||{},ps=draft.productos||[];
 r.nombre=String(f.get('rest_name')||'').trim().slice(0,100);
 r.whatsapp=String(f.get('rest_whatsapp')||'').replace(/[^0-9]/g,'').slice(0,20);
 r.descripcion=String(f.get('rest_description')||'').trim().slice(0,300);
 r.horario=String(f.get('rest_schedule')||'').trim().slice(0,160);
 r.direccion=String(f.get('rest_address')||'').trim().slice(0,300);
 if(!r.nombre||!/^\d{10,15}$/.test(r.whatsapp))return fail('Revisa el nombre del restaurante y el número de WhatsApp.');
 try{
  for(const [field,key,path] of [['rest_logo','logo','perfil'],['rest_banner','portada','portadas']]){
   if(f.has(field+'_delete'))r[key]='';
   const url=await storePhoto(f.get(field+'_photo'),path);
   if(url)r[key]=url;
  }
  for(const product of ps){
   const prefix='prod_'+product.id;
   const name=String(f.get(prefix+'_name')||'').trim().slice(0,120);
   const price=Number(f.get(prefix+'_price'));
   if(!name||!Number.isFinite(price)||price<0||price>100000)return fail('Revisa los nombres y precios.');
   product.nombre=name;
   product.precio=Math.round(price*100)/100;
   product.activo=f.has(prefix+'_active');
   if(product.categoria!=='extras')product.descripcion=String(f.get(prefix+'_description')||'').trim().slice(0,500);
   if(f.has(prefix+'_delete'))product.foto='';
   const url=await storePhoto(f.get(prefix+'_photo'),'productos');
   if(url)product.foto=url;
  }
 }catch(err){return fail(err instanceof Error?err.message:'No se pudieron subir las fotografías.',400)}
 draft.restaurante=r;
 const changes={draft,revision:rev+1};
 if(publish)changes.published=draft;
 const {data,error}=await api.from('sb_vitola_catalog').update(changes).eq('slug','la-vitola').eq('revision',rev).select('revision').maybeSingle();
 if(error||!data)return fail('No se pudo guardar. Actualiza la página para comprobar que nadie haya cambiado el menú.',409);
 return respond('<section class="card"><h1>'+(publish?'Menú publicado':'Borrador guardado')+'</h1><div class="success">'+(publish?'Cambios publicados en la carta de La Vitola.':'Cambios guardados sin modificar el menú público.')+'</div><a class="btn" href="'+ROOT+'">Volver al editor</a><a class="btn subtle" href="'+PUBLIC+'">Ver menú público</a></section>');
}
Deno.serve(async req=>{
 try{
  if(!SB_URL||!SERVICE||!ANON)return fail('Servicio no disponible.',503);
  const u=new URL(req.url);
  if(req.method==='GET'&&u.searchParams.get('menu')==='1')return publishedMenu();
  if(req.method==='GET'){const s=await current(req);if(!s)return login();const csrf=csrfToken(req);return respond(dashboard(await catalog(),csrf),200,[...s.cookies,cookie('sbv_csrf',csrf,3600)]);}
  if(req.method!=='POST')return new Response('Method Not Allowed',{status:405});
  const f=await req.formData();const action=String(f.get('action')||'');
  if(action==='activate')return claim(f);
  if(action==='login')return doLogin(f);
  if(!hasCsrf(req,f))return fail('El formulario no es válido o venció. Vuelve al panel e inténtalo otra vez.',403);
  if(action==='logout')return redirect(clearCookies());
  const s=await current(req);if(!s)return fail('Tu sesión terminó. Vuelve a ingresar.',401);
  if(action==='save'||action==='publish')return save(f,action==='publish');
  return fail('Acción no reconocida.',400);
 } catch(err){console.error('vitola-portal',err instanceof Error?err.message:String(err));return fail('Error temporal de acceso.',500);}
});
