
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
const dashboardScript = "\n(function(){\n  const panels=[...document.querySelectorAll('[data-panel]')];\n  function go(tab){\n    panels.forEach(p=>p.hidden=p.dataset.panel!==tab);\n    document.querySelectorAll('.navButton').forEach(b=>b.classList.toggle('selected',b.dataset.go===tab));\n    window.scrollTo({top:0,behavior:'instant'});\n  }\n  document.addEventListener('click',function(ev){\n    const nav=ev.target.closest('[data-go]'); if(nav){go(nav.dataset.go);return;}\n    const open=ev.target.closest('[data-dialog]');\n    if(open){const d=document.getElementById(open.dataset.dialog);if(d&&d.showModal)d.showModal();return;}\n    const close=ev.target.closest('[data-close]');\n    if(close){const d=close.closest('dialog');if(d)d.close();return;}\n    if(ev.target.matches('dialog.sheet'))ev.target.close();\n  });\n  document.querySelectorAll('input[type=file][data-preview]').forEach(function(input){\n    input.addEventListener('change',function(){\n      const file=this.files&&this.files[0];if(!file)return;\n      const box=this.closest('.imageInput');if(!box)return;\n      const preview=box.querySelector('.currentImage');\n      const old=preview.querySelector('img');if(old&&old.dataset.tempUrl)URL.revokeObjectURL(old.dataset.tempUrl);\n      const img=document.createElement('img');const url=URL.createObjectURL(file);\n      img.src=url;img.dataset.tempUrl=url;img.className='photoPreview';img.alt='Vista previa de la nueva imagen';\n      preview.replaceChildren(img);\n      const label=box.querySelector('.illustrative');if(label)label.textContent='Vista previa · aún sin publicar';\n    });\n  });\n  const initial=(location.hash||'').replace('#','');\n  if(['menu','envios','pagos','redes'].includes(initial))go(initial);else go('inicio');\n})();\n";
const visualDashboardCss = "\nbody:has([data-vitola-admin]){padding:0;background:#0b0d12}\nbody:has([data-vitola-admin]) main{max-width:900px;padding:0 12px 95px}\nbody:has([data-vitola-admin]) main>header{padding:14px 5px;margin:0}\nbody:has([data-vitola-admin]) main>header b{font-size:13px}\nbody:has([data-vitola-admin]) h1{font-size:25px}\n.workspace{background:#151820;border-radius:22px;overflow:hidden;margin:2px 0 15px;border:1px solid #292c36}\n.heroThumb{position:relative;height:150px;overflow:hidden;background:linear-gradient(120deg,#101116,#ef4b00)}\n.heroThumb .cover{width:100%;height:100%;object-fit:cover}\n.coverShade{position:absolute;inset:0;background:linear-gradient(0deg,#141821 0%,transparent 85%)}\n.profileThumb{position:absolute;bottom:10px;left:14px;width:72px;height:72px;border:3px solid #fff;border-radius:20px;overflow:hidden;background:#0e1018}\n.profileThumb img{width:100%;height:100%;object-fit:cover}\n.welcome{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:13px 16px 3px}\n.eyebrow{font-size:9px;color:#ff884b;font-weight:900;letter-spacing:.15em}\n.welcome h1{margin:2px 0;font-size:25px}.welcome p{margin:1px 0 7px;font-size:12px}\n.viewMenu{font-size:12px;font-weight:800;white-space:nowrap;color:white;border:1px solid #565b66;padding:11px;border-radius:11px;text-decoration:none}\n.stateLine{display:flex;justify-content:space-between;gap:8px;padding:8px 16px 17px;font-size:11px;color:#a2a4ae}\n.stateLine span:first-child{color:#ff7844}\n.tabPanel{margin:0 0 14px}.tabPanel[hidden]{display:none!important}.panelHeader{padding:12px 5px 16px}.panelHeader h2{margin:0 0 5px;font-size:23px}.panelHeader p{font-size:13px;margin:0}\n.quickGrid{display:grid;grid-template-columns:1fr 1fr;gap:11px}.quick{border:1px solid #393b48;background:#191b23;color:#fff;border-radius:19px;min-height:128px;padding:17px 13px;display:flex;align-items:flex-start;flex-direction:column;text-align:left;margin:0}\n.quick b{font-size:27px;line-height:30px;margin:0 0 7px}.quick span{font-weight:900;font-size:13px}.quick small{color:#adb1bb;font-size:10px;margin-top:3px}.quick.accent{border-color:#ff4b00;background:#302017}\n.miniPreview,.settingsCard{background:#191c24;border:1px solid #383d48;border-radius:19px;padding:16px;margin:12px 0}.miniPreview h3,.settingsCard h3{margin:0 0 6px;font-size:17px}.miniPreview p{font-size:12px}.miniPreview>a{display:block;font-size:12px;font-weight:900;margin:16px 0 4px;color:#ff8d53}\n.miniProducts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.miniProd{background:#0e1016;border-radius:12px;overflow:hidden;min-width:0}.miniProd img{width:100%;height:84px;object-fit:cover}.miniProd b{display:block;font-size:10px;padding:6px 7px 0;min-height:38px}.miniProd strong{font-size:12px;display:block;color:#ff8b4c;padding:3px 7px 9px}\n.sectionTop{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-bottom:6px;font-size:12px;color:#b9bbc6}.smallAdd{font-size:12px;padding:9px 12px;margin:0}\n.categoryTitle{margin:22px 0 10px;color:#fff;font-size:19px}.itemGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.itemCard{background:#1c2029;border:1px solid #353a46;color:#fff;border-radius:16px;overflow:hidden;padding:0 0 10px;margin:0;text-align:left;display:flex;flex-direction:column;align-items:stretch;min-width:0}\n.itemCard img{display:block;width:100%;height:133px;object-fit:cover}.itemName{padding:9px 10px 0;font-weight:800;font-size:12px;min-height:40px}.itemPrice{padding:3px 10px;color:#ff8950;font-size:15px;font-weight:900}\n.photoTag,.unavailable{font-size:9px;margin:5px 10px;padding:4px 7px;background:#292d37;color:#c5c9d0;border-radius:6px;align-self:flex-start}.unavailable{color:#ffb6ac;background:#492724}\n.sheet{inset:auto 0 0 0;max-height:93dvh;overflow:auto;width:100%;max-width:570px;border:1px solid #363a45;border-radius:25px 25px 0 0;background:#14161e;color:#fff;padding:0;margin:auto auto 0}\n.sheet::backdrop{background:rgba(0,0,0,.74);backdrop-filter:blur(4px)}\n.sheetHead{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 17px;border-bottom:1px solid #363945;position:sticky;top:0;background:#14161e;z-index:3}.sheetHead h2{font-size:19px;margin:0}.closeSheet{width:38px;height:38px;border-radius:99px;padding:0;margin:0;background:#373a43}\n.sheetBody{padding:16px 18px 18px}.sheetBody .field{margin:15px 0}.field>span{display:block;margin:0 0 6px;color:#d8d8dd;font-weight:700;font-size:12px}.field small,.hint{display:block;margin:7px 0 0;color:#a5a7b2;font-size:11px;line-height:1.4}.field input,.field textarea,.field select{width:100%;border-radius:12px;background:#0c0e14;border:1px solid #434650;color:#fff;padding:12px;font-size:14px;min-height:46px;font-family:inherit}\n.field textarea{min-height:80px}\n.imageInput{display:flex;gap:12px;align-items:flex-start;padding:10px;background:#21242e;border:1px solid #393d48;border-radius:15px;margin:9px 0 14px}\n.currentImage{width:93px;height:93px;flex:0 0 93px;overflow:hidden;border-radius:12px;background:#101218}\n.currentImage img{height:100%;width:100%;object-fit:cover}\n.imageActions{flex:1;min-width:0}.imageActions b{display:block;font-size:12px;margin:0 0 6px}.imageActions input[type=file]{width:100%;max-width:100%;font-size:10px;border:0;padding:7px 0}.imageActions small,.illustrative{display:block;font-size:10px;color:#b0b3bd}.illustrative{color:#ffb58f}.tinyCheck{font-size:11px;display:flex;gap:6px;align-items:center;margin:5px 0}.tinyCheck input{width:auto}\n.sheetDone{display:block;width:100%;margin:16px 0 0;min-height:48px;background:#ff4b00}\n.formFooter{display:flex;gap:10px;background:#15171f;border:1px solid #383e48;padding:10px;border-radius:16px;margin:18px 0}.formFooter button{flex:1;min-height:50px;margin:0;padding:9px;font-size:12px}\n.sheet .formFooter{position:sticky;bottom:0;border-radius:0;margin:0;border:0;border-top:1px solid #383e48}\n.skip{display:block;background:none;color:#abb0bc;text-decoration:underline;padding:12px;margin:5px auto 16px;font-size:12px}\n.switchRow{display:flex;align-items:center;gap:12px;font-size:13px;font-weight:800;min-height:52px;cursor:pointer}.switchRow input{width:20px;height:20px;accent-color:#ff4b00;flex:0 0 auto}\n.notice{background:#142d27;border:1px solid #326d52;color:#d9eee1;border-radius:12px;padding:13px;font-size:12px;line-height:1.5;margin-top:13px}\n.accountBottom{margin:20px 0 40px;text-align:center}.logout{background:none;color:#a7a9b5;font-size:12px;text-decoration:underline}\n.iosNav{position:fixed;left:0;right:0;bottom:0;z-index:40;background:rgba(22,25,33,.97);border-top:1px solid #41434a;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));padding:8px max(4px,env(safe-area-inset-left)) calc(8px + env(safe-area-inset-bottom));gap:1px}\n.iosNav button{min-width:0;width:100%;height:54px;background:transparent;padding:5px 0;margin:0;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:#aeb0bb}\n.iosNav button span{font-size:22px;line-height:24px}.iosNav button small{font-size:9px;font-weight:700}.iosNav button.selected{color:#ff7a3c;background:#3b251d}.iosNav button.navAdd{color:#fff}.iosNav .navAdd span{background:#ff4b00;width:35px;height:31px;line-height:26px;border-radius:10px;font-size:25px}\n@media(min-width:640px){.sheet{margin:auto;border-radius:24px;max-height:88dvh}.itemGrid{grid-template-columns:repeat(3,1fr)}}\n";
function respond(content, status=200, cookies=[]) {
 const h=new Headers({'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data: blob: https:; script-src 'unsafe-inline'; form-action 'self' https://streetboss.com.mx; frame-ancestors 'none'; base-uri 'none'"});
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
 const r=c.draft.restaurante||{},cats=c.draft.categorias||[],prods=c.draft.productos||[];
 const pay=c.draft.pagos||{},transfer=pay.transferencia||{},card=pay.tarjeta||{},delivery=c.draft.entregas||{},social=r.redes||{};
 const esc=v=>e(v??'');
 const phone=String(r.whatsapp||'');
 const formHead=section=>'<input type="hidden" name="csrf" value="'+esc(csrf)+'"><input type="hidden" name="revision" value="'+c.revision+'"><input type="hidden" name="section" value="'+section+'">';
 const field=(name,label,value,opts={})=>{
   const kind=opts.kind||'text',help=opts.help?'<small>'+esc(opts.help)+'</small>':'';
   const input=kind==='textarea'
    ?'<textarea name="'+name+'" rows="3" maxlength="'+(opts.max||500)+'" placeholder="'+esc(opts.placeholder||'')+'">'+esc(value||'')+'</textarea>'
    :'<input type="'+kind+'" name="'+name+'" value="'+esc(value??'')+'" '+(kind==='number'?'step="0.01" min="0" max="100000" ':'')+'maxlength="'+(opts.max||300)+'" placeholder="'+esc(opts.placeholder||'')+'">';
   return '<label class="field"><span>'+esc(label)+'</span>'+input+help+'</label>';
 };
 const img=(url,alt,css='')=>url?'<img class="'+css+'" src="'+esc(url)+'" alt="'+esc(alt)+'" loading="lazy">':'<div class="fallback '+css+'">🍽️</div>';
 const photo=(fieldName,url,label,illustrative=false)=>{
   let html='<div class="imageInput"><div class="currentImage">'+img(url,label,'photoPreview')+'</div><div class="imageActions"><b>'+esc(label)+'</b>';
   if(illustrative)html+='<span class="illustrative">Foto ilustrativa · puedes cambiarla</span>';
   html+='<input aria-label="Elegir imagen para '+esc(label)+'" type="file" accept="image/jpeg,image/png,image/webp" name="'+esc(fieldName)+'_photo" data-preview="1"><small>Foto nueva: JPG, PNG o WebP · hasta 5 MB</small>';
   if(url)html+='<label class="tinyCheck"><input type="checkbox" name="'+esc(fieldName)+'_delete" value="yes"> Quitar foto</label>';
   return html+'</div></div>';
 };
 const footer=next=>'<div class="formFooter"><button type="submit" name="action" value="save" class="subtle">Guardar borrador</button><button type="submit" name="action" value="publish">Publicar cambios</button></div><button type="button" class="skip" data-go="'+next+'">Omitir por ahora →</button>';
 let html='<div data-vitola-admin="1">';
 html+='<section class="workspace">';
 html+='<div class="heroThumb">'+img(r.portada,'Portada de La Vitola','cover')+'<div class="coverShade"></div><div class="profileThumb">'+img(r.logo,'Perfil La Vitola','avatar')+'</div></div>';
 html+='<div class="welcome"><div><span class="eyebrow">MI RESTAURANTE</span><h1>'+esc(r.nombre||'La Vitola')+'</h1><p>Tu menú, tus ventas, tu control.</p></div><a class="viewMenu" href="'+PUBLIC+'" target="_blank" rel="noreferrer">Ver menú ↗</a></div>';
 html+='<div class="stateLine"><span>● Borrador '+c.revision+'</span><span>'+prods.filter(p=>p.activo!==false&&p.oculto!==true&&p.categoria!=='extras').length+' platillos visibles</span></div>';
 html+='</section>';
 const section=(id,title,desc)=>'<section class="tabPanel" id="tab-'+id+'" data-panel="'+id+'" hidden><div class="panelHeader"><h2>'+title+'</h2><p>'+desc+'</p></div>';
 html+=section('inicio','Tu restaurante','Toca una tarjeta para editarla. Los cambios solo se muestran al publicarlos.');
 html+='<div class="quickGrid"><button class="quick" type="button" data-dialog="business"><b>🏪</b><span>Perfil y portada</span><small>Editar fotos y datos</small></button>';
 html+='<button class="quick" type="button" data-go="menu"><b>🍔</b><span>Editar menú</span><small>Productos y extras</small></button>';
 html+='<button class="quick" type="button" data-go="envios"><b>🛵</b><span>Servicio a domicilio</span><small>Entregas y colonias</small></button>';
 html+='<button class="quick" type="button" data-go="pagos"><b>💳</b><span>Datos para cobrar</span><small>Después de confirmar</small></button>';
 html+='<button class="quick" type="button" data-go="redes"><b>📱</b><span>Redes sociales</span><small>Maps, WhatsApp y TikTok</small></button>';
 html+='<button class="quick accent" type="button" data-dialog="newproduct"><b>＋</b><span>Agregar producto</span><small>Con fotografía y precio</small></button></div>';
 html+='<div class="miniPreview"><h3>Vista previa de tu menú</h3><p>Así aparecen tus fotografías actualmente.</p><div class="miniProducts">';
 for(const p of prods.filter(x=>x.activo!==false&&x.oculto!==true&&x.categoria!=='extras').slice(0,6)){
   html+='<div class="miniProd">'+img(p.foto||p.imagen,p.nombre,'')+'<b>'+esc(p.nombre)+'</b><strong>$'+Number(p.precio).toFixed(2)+'</strong></div>';
 }
 html+='</div><a href="'+PUBLIC+'" target="_blank" rel="noreferrer">Abrir menú público →</a></div>';
 html+='</section>';
 // Formulario del negocio, abierto en ventana.
 html+='<dialog id="business" class="sheet"><div class="sheetHead"><h2>Perfil del negocio</h2><button type="button" class="closeSheet" data-close="1">✕</button></div>';
 html+='<form method="post" enctype="multipart/form-data" action="'+ROOT+'">'+formHead('negocio')+'<div class="sheetBody">';
 html+=photo('rest_banner',r.portada,'Portada del menú',!!r.portadaIlustrativa);
 html+=photo('rest_logo',r.logo,'Imagen de perfil',!!r.logoProvisional);
 html+=field('rest_name','Nombre del restaurante',r.nombre);
 html+=field('rest_description','Descripción corta',r.descripcion,{kind:'textarea'});
 html+=field('rest_schedule','Horario del negocio',r.horario);
 html+=field('rest_address','Dirección del local',r.direccion,{kind:'textarea'});
 html+='</div>'+footer('menu')+'</form></dialog>';
 // Menú, tarjetas y ventanas por producto.
 html+=section('menu','Edita tu menú','Toca un platillo para cambiar su foto, precio o disponibilidad.');
 html+='<div class="sectionTop"><span>'+prods.length+' elementos (incluye extras)</span><button type="button" class="smallAdd" data-dialog="newproduct">＋ Agregar producto</button></div>';
 html+='<form method="post" enctype="multipart/form-data" action="'+ROOT+'">'+formHead('menu');
 for(const cat of cats){
   const inCat=prods.filter(x=>x.categoria===cat.id);
   html+='<h3 class="categoryTitle">'+esc(cat.id==='extras'?'Extras de hamburguesas':cat.nombre)+'</h3>';
   if(cat.id==='extras')html+='<p class="hint">Estos ingredientes se seleccionan dentro de una hamburguesa; no se venden por separado.</p>';
   html+='<div class="itemGrid">';
   for(const p of inCat){
    const id=String(p.id||'');
    if(!/^[a-z0-9-]{1,80}$/.test(id))continue;
    const display=p.foto||p.imagen||'',name='prod_'+id;
    html+='<button type="button" class="itemCard" data-dialog="product-'+id+'">'+img(display,p.nombre,'productPhoto')+'<span class="itemName">'+esc(p.nombre)+'</span><span class="itemPrice">$'+Number(p.precio).toFixed(2)+'</span>';
    if(p.activo===false)html+='<span class="unavailable">No disponible</span>';
    if(p.foto_ilustrativa)html+='<span class="photoTag">Imagen ilustrativa</span>';
    html+='</button>';
   }
   html+='</div>';
 }
 // Products editors must remain inside menu form so all fields submit.
 for(const p of prods){
  const id=String(p.id||'');
  if(!/^[a-z0-9-]{1,80}$/.test(id))continue;
  const name='prod_'+id,display=p.foto||p.imagen||'';
  html+='<dialog id="product-'+id+'" class="sheet productSheet"><div class="sheetHead"><h2>Editar platillo</h2><button type="button" class="closeSheet" data-close="1">✕</button></div><div class="sheetBody">';
  html+=photo(name,display,p.nombre,!!p.foto_ilustrativa);
  html+=field(name+'_name','Nombre',p.nombre,{max:120});
  html+=field(name+'_price','Precio en pesos',p.precio,{kind:'number'});
  if(p.categoria!=='extras')html+=field(name+'_description','Descripción',p.descripcion||'',{kind:'textarea'});
  html+='<label class="switchRow"><input type="checkbox" name="'+name+'_active" '+(p.activo!==false?'checked':'')+'> Disponible para pedidos</label>';
  html+='<label class="switchRow"><input type="checkbox" name="'+name+'_remove" value="yes"> Ocultar este producto del menú</label>';
  html+='<p class="hint">La fotografía, precio y disponibilidad se actualizan al publicar.</p>';
  html+='<button type="button" class="sheetDone" data-close="1">Listo, seguir editando</button></div></dialog>';
 }
 html+=footer('envios')+'</form></section>';
 // Nuevo producto: alta aislada para que pueda agregarse desde cualquier pestaña.
 html+='<dialog id="newproduct" class="sheet"><div class="sheetHead"><h2>Agregar producto</h2><button type="button" class="closeSheet" data-close="1">✕</button></div>';
 html+='<form method="post" enctype="multipart/form-data" action="'+ROOT+'">'+formHead('nuevo')+'<div class="sheetBody">';
 html+=photo('new_prod','', 'Foto del producto');
 html+=field('new_name','Nombre del producto','',{placeholder:'Nombre del platillo',max:120});
 html+=field('new_price','Precio en pesos','',{kind:'number'});
 html+=field('new_description','Descripción (opcional)','',{kind:'textarea',max:500});
 html+='<label class="field"><span>Categoría</span><select name="new_category" required>'+cats.map(cat=>'<option value="'+esc(cat.id)+'">'+esc(cat.id==='extras'?'Extra de hamburguesas':cat.nombre)+'</option>').join('')+'</select></label>';
 html+='<p class="hint">Si agregas un extra, aparecerá al personalizar una hamburguesa.</p>';
 html+='</div><div class="formFooter"><button name="action" value="create" type="submit" class="subtle">Guardar borrador</button><button name="action" value="create_publish" type="submit">Agregar y publicar</button></div>';
 html+='<button type="button" class="skip" data-close="1">Omitir por ahora</button></form></dialog>';
 // Entregas.
 html+=section('envios','Servicio a domicilio','Sin tarifas inventadas: el restaurante confirma el envío antes de cobrar.');
 html+='<form method="post" action="'+ROOT+'">'+formHead('envios');
 html+='<div class="settingsCard"><label class="switchRow"><input type="checkbox" name="delivery_enabled" '+(delivery.activo!==false&&(c.draft.modalidades||[]).includes('domicilio')?'checked':'')+'> Ofrecer envío a domicilio</label>';
 html+='<p class="hint">Si no activas el envío, los clientes solo podrán recoger en el local.</p>';
 html+=field('delivery_zones','Colonias de cobertura (opcional)',(delivery.zonas||[]).join('\n'),{kind:'textarea',help:'Una colonia por línea. Se confirma cobertura por WhatsApp.'});
 html+=field('delivery_notes','Indicaciones para la entrega',delivery.indicaciones||'',{kind:'textarea',help:'Puedes dejarlo vacío; se cotiza el envío antes de pagar.'});
 html+='<div class="notice">✓ El cliente envía su pedido por WhatsApp. El negocio confirma disponibilidad, costo del envío y total. Después se acuerda el pago.</div></div>';
 html+=footer('pagos')+'</form></section>';
 // Pagos: solo datos para pago posterior a confirmación, no captura de tarjeta.
 html+=section('pagos','Datos para cobrar','Configura cómo recibir pagos después de confirmar el pedido y el envío.');
 html+='<form method="post" action="'+ROOT+'">'+formHead('pagos');
 html+='<div class="settingsCard"><h3>🏦 Transferencia bancaria</h3><label class="switchRow"><input type="checkbox" name="bank_enabled" '+(transfer.activo?'checked':'')+'> Ofrecer transferencia</label>';
 html+=field('bank_name','Banco',transfer.banco||'');
 html+=field('bank_owner','Titular de la cuenta',transfer.titular||'');
 html+=field('bank_clabe','CLABE de 18 dígitos',transfer.clabe||'',{max:18});
 html+='<p class="hint">El comprador verá estos datos solo después de indicar que el restaurante confirmó su total.</p></div>';
 html+='<div class="settingsCard"><h3>💳 Pago con tarjeta</h3><label class="switchRow"><input type="checkbox" name="card_enabled" '+(card.activo?'checked':'')+'> Mostrar enlace para pagar con tarjeta</label>';
 html+=field('card_link','Enlace de cobro del proveedor',card.enlace||'',{kind:'url',help:'Solo URL HTTPS de un proveedor de pagos externo. Nunca ingreses números de tarjeta ni CVV aquí.'});
 html+='<div class="notice">StreetBoss no procesa tarjetas ni cobra al cliente. La Vitola comparte el enlace externo cuando el pedido y el importe final estén confirmados.</div></div>';
 html+=footer('redes')+'</form></section>';
 // Redes y ubicación.
 html+=section('redes','Redes y ubicación','Agrega únicamente las redes que utilice el restaurante. Puedes omitir las demás.');
 html+='<form method="post" action="'+ROOT+'">'+formHead('redes');
 html+='<div class="settingsCard"><h3>📲 Contacto directo</h3>';
 html+=field('social_whatsapp','WhatsApp de pedidos',phone,{kind:'tel',max:20});
 html+=field('social_maps','Enlace de ubicación en Google Maps',r.maps||'',{kind:'url',help:'Copia el enlace de compartir ubicación del negocio.'});
 html+='</div><div class="settingsCard"><h3>🌐 Redes sociales</h3>';
 html+=field('social_instagram','Instagram',social.instagram||'',{kind:'url'});
 html+=field('social_facebook','Facebook',social.facebook||'',{kind:'url'});
 html+=field('social_tiktok','TikTok',social.tiktok||'',{kind:'url'});
 html+=field('social_youtube','YouTube',social.youtube||'',{kind:'url'});
 html+=field('social_website','Sitio web',social.website||'',{kind:'url'});
 html+='</div>'+footer('inicio')+'</form></section>';
 html+='<div class="accountBottom"><form method="post" action="'+ROOT+'">'+csrfField(csrf)+'<input type="hidden" name="action" value="logout"><button type="submit" class="logout">Cerrar sesión de La Vitola</button></form></div>';
 html+='<nav class="iosNav" aria-label="Navegación del dashboard">';
 for(const [sectionId,symbol,text] of [['inicio','⌂','Inicio'],['menu','▦','Menú'],['nuevo','＋','Agregar'],['envios','↗','Envíos'],['pagos','▣','Pagos'],['redes','◎','Redes']]){
   if(sectionId==='nuevo')html+='<button type="button" class="navAdd" data-dialog="newproduct" aria-label="Agregar producto"><span>'+symbol+'</span><small>'+text+'</small></button>';
   else html+='<button type="button" data-go="'+sectionId+'" class="navButton '+(sectionId==='inicio'?'selected':'')+'"><span>'+symbol+'</span><small>'+text+'</small></button>';
 }
 html+='</nav>';
 html+='</div><script>'+dashboardScript+'</script>';
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

function safeHttps(value){
 const raw=String(value||'').trim();
 if(!raw)return '';
 const candidate=/^https?:\/\//i.test(raw)?raw:'https://'+raw;
 try{
  const url=new URL(candidate);
  if(url.protocol!=='https:' || !url.hostname.includes('.'))throw new Error();
  return url.href.slice(0,500);
 }catch(_){throw new Error('El enlace debe ser una dirección HTTPS válida.')}
}
function validMoney(v){
 const raw=String(v??'').trim();
 const n=Number(raw);
 if(!raw || !Number.isFinite(n) || n<0 || n>100000)throw new Error('Revisa los precios. Deben ser números válidos en pesos.');
 return Math.round(n*100)/100;
}
async function save(f,publish){
 const row=await catalog(),rev=Number(f.get('revision'));
 if(!Number.isSafeInteger(rev)||rev!==Number(row.revision))return fail('El menú cambió en otra sesión. Vuelve a abrir el editor para evitar sobrescribirlo.',409);
 const section=String(f.get('section')||'');
 const draft=structuredClone(row.draft), r=draft.restaurante||{}, ps=draft.productos||[];
 if(!['negocio','menu','nuevo','envios','pagos','redes'].includes(section))return fail('Sección no reconocida.',400);
 try{
  if(section==='negocio'){
   const name=String(f.get('rest_name')||'').trim().slice(0,100);
   if(!name)throw new Error('El nombre del negocio es obligatorio.');
   r.nombre=name;
   r.descripcion=String(f.get('rest_description')||'').trim().slice(0,300);
   r.horario=String(f.get('rest_schedule')||'').trim().slice(0,160);
   r.direccion=String(f.get('rest_address')||'').trim().slice(0,300);
   for(const [field,key,dir,provisionalKey] of [['rest_logo','logo','perfil','logoProvisional'],['rest_banner','portada','portadas','portadaIlustrativa']]){
    if(f.has(field+'_delete')){r[key]='';r[provisionalKey]=false;}
    const url=await storePhoto(f.get(field+'_photo'),dir);
    if(url){r[key]=url;r[provisionalKey]=false;}
   }
  }
  if(section==='menu'){
   for(const product of ps){
    if(!/^[a-z0-9-]{1,80}$/.test(String(product.id||'')))continue;
    const prefix='prod_'+product.id;
    if(!f.has(prefix+'_name'))continue;
    const name=String(f.get(prefix+'_name')||'').trim().slice(0,120);
    if(!name)throw new Error('Cada producto necesita un nombre.');
    product.nombre=name;
    product.precio=validMoney(f.get(prefix+'_price'));
    product.activo=f.has(prefix+'_active');
    product.oculto=f.has(prefix+'_remove');
    if(product.categoria!=='extras')product.descripcion=String(f.get(prefix+'_description')||'').trim().slice(0,500);
    if(f.has(prefix+'_delete')){product.foto='';product.foto_ilustrativa=false;}
    const image=await storePhoto(f.get(prefix+'_photo'),'productos');
    if(image){product.foto=image;product.foto_ilustrativa=false;}
   }
  }
  if(section==='nuevo'){
   const name=String(f.get('new_name')||'').trim().slice(0,120);
   const category=String(f.get('new_category')||'');
   if(!name)throw new Error('Escribe el nombre del nuevo producto.');
   if(!draft.categorias?.some(cat=>cat.id===category))throw new Error('Selecciona una categoría válida.');
   if(ps.length>=300)throw new Error('Se alcanzó el límite de productos de este menú.');
   const price=validMoney(f.get('new_price'));
   const image=await storePhoto(f.get('new_prod_photo'),'productos');
   const categoryDefaults={tacos:'/demos/tacos-el-guero/products/taco-campechano.jpg',hamburguesas:'/demos/burger-house/products/burger-clasica.jpg',bebidas:'/demos/tacos-el-guero/products/agua-jamaica.jpg',extras:'/demos/burger-house/products/burger-clasica.jpg'};
   const id='producto-'+crypto.randomUUID();
   ps.push({id,nombre:name,precio:price,categoria:category,descripcion:String(f.get('new_description')||'').trim().slice(0,500),foto:image||categoryDefaults[category]||'',activo:true,oculto:false,foto_ilustrativa:!image});
  }
  if(section==='envios'){
   const active=f.has('delivery_enabled');
   const zones=String(f.get('delivery_zones')||'').split(/\r?\n/).map(s=>s.trim().slice(0,100)).filter(Boolean);
   draft.entregas={activo:active,zonas:[...new Set(zones)].slice(0,100),indicaciones:String(f.get('delivery_notes')||'').trim().slice(0,500),cotizacionObligatoria:true};
   const modes=Array.isArray(draft.modalidades)?draft.modalidades:[];
   draft.modalidades=[...new Set([...modes.filter(m=>m!=='domicilio'),...(active?['domicilio']:[])])];
  }
  if(section==='pagos'){
   const bEnabled=f.has('bank_enabled'),cEnabled=f.has('card_enabled');
   const clabe=String(f.get('bank_clabe')||'').replace(/\s+/g,'');
   const banco=String(f.get('bank_name')||'').trim().slice(0,100);
   const titular=String(f.get('bank_owner')||'').trim().slice(0,150);
   const enlace=safeHttps(f.get('card_link'));
   if(bEnabled && (!/^\d{18}$/.test(clabe)||!banco||!titular))
    throw new Error('Para activar transferencia, escribe banco, titular y CLABE de 18 dígitos.');
   if(cEnabled && !enlace)throw new Error('Para activar tarjeta, agrega un enlace de cobro HTTPS.');
   draft.pagos={transferencia:{activo:bEnabled,banco,titular,clabe},tarjeta:{activo:cEnabled,enlace},soloTrasConfirmacion:true};
  }
  if(section==='redes'){
   const w=String(f.get('social_whatsapp')||'').replace(/[^0-9]/g,'');
   if(!/^\d{10,15}$/.test(w))throw new Error('Escribe un WhatsApp válido de entre 10 y 15 dígitos.');
   r.whatsapp=w;
   r.maps=safeHttps(f.get('social_maps'));
   r.redes={
    instagram:safeHttps(f.get('social_instagram')),
    facebook:safeHttps(f.get('social_facebook')),
    tiktok:safeHttps(f.get('social_tiktok')),
    youtube:safeHttps(f.get('social_youtube')),
    website:safeHttps(f.get('social_website')),
   };
  }
 }catch(err){return fail(err instanceof Error?err.message:'Verifica la información.',400)}
 draft.restaurante=r;draft.productos=ps;
 const changes={draft,revision:rev+1};
 if(publish)changes.published=draft;
 const {data:updated,error}=await api.from('sb_vitola_catalog').update(changes).eq('slug','la-vitola').eq('revision',rev).select('revision').maybeSingle();
 if(error||!updated)return fail('No se pudo guardar. Actualiza el editor y vuelve a intentar.',409);
 const title=publish?'¡Cambios publicados!':'Borrador guardado';
 const message=publish?'Los cambios están guardados en el menú público de La Vitola.':'Los cambios están guardados. Cuando quieras, toca Publicar cambios.';
 const back=section==='nuevo'?'menu':section;
 return respond('<section class="card"><h1>'+title+'</h1><div class="success">'+message+'</div><p><a class="btn" href="'+ROOT+'#'+back+'">Volver al editor</a><a class="btn subtle" href="'+PUBLIC+'">Ver menú público</a></p></section>');
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
  if(['save','publish','create','create_publish'].includes(action))return save(f,action==='publish'||action==='create_publish');
  return fail('Acción no reconocida.',400);
 } catch(err){console.error('vitola-portal',err instanceof Error?err.message:String(err));return fail('Error temporal de acceso.',500);}
});
