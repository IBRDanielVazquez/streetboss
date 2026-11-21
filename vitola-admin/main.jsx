import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import './style.css'

const url = 'https://uszhdesbewkjvphipudw.supabase.co'
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
// Recovery emails often open a new tab. Share only the PKCE verifier across tabs.
const authStorage = {
  getItem(name) { return (name.endsWith('-code-verifier') ? localStorage : sessionStorage).getItem(name) },
  setItem(name, value) { (name.endsWith('-code-verifier') ? localStorage : sessionStorage).setItem(name, value) },
  removeItem(name) { (name.endsWith('-code-verifier') ? localStorage : sessionStorage).removeItem(name) }
}
const db = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '') === url && key
  ? createClient(url, key, {auth: {storageKey: 'vitola-admin', flowType: 'pkce', storage: authStorage}}) : null
const accessPath = '/menu/la-vitola/acceso'
const catalog = () => db.from('sb_vitola_catalog')
function Panel() {
  const [user, setUser] = useState(null)
  const [mode, setMode] = useState('login')
  const [message, tell] = useState('')
  const [row, setRow] = useState(null)
  const [busy, lock] = useState(false)
  useEffect(() => {
    if (!db) return
    const {data} = db.auth.onAuthStateChange((event, session) => {
      setUser(session?.user.id || null)
      if (event === 'PASSWORD_RECOVERY') setMode('reset')
      if (!session) setRow(null)
    })
    return () => data.subscription.unsubscribe()
  }, [])
  useEffect(() => {
    let active = true
    setRow(null)
    if (user) catalog().select('draft,revision').eq('slug','la-vitola').maybeSingle().then(({data,error}) => {
      if (!active) return
      if (!data || error) tell('Esta cuenta no tiene acceso al editor.')
      else {setRow(data); tell('')}
    })
    return () => {active = false}
  }, [user])
  async function submit(event) {
    event.preventDefault()
    if (busy) return
    const form = new FormData(event.currentTarget)
    lock(true); tell('')
    try {
      const id = String(form.get('id') || '').trim()
      const password = String(form.get('password') || '')
      if (mode === 'recover') {
        const result = await db.auth.resetPasswordForEmail(id, {redirectTo: location.origin + accessPath})
        if (result.error) throw result.error
        tell('Si el correo corresponde a una cuenta, recibirá un enlace de recuperación.')
      } else if (mode === 'reset') {
        if (!user) throw new Error()
        const result = await db.auth.updateUser({password})
        if (result.error) throw result.error
        await db.auth.signOut(); setMode('login'); tell('Contraseña actualizada. Inicie sesión.')
      } else {
        const result = await db.auth.signInWithPassword(id.includes('@') ? {email:id,password} : {phone:id,password})
        if (result.error) throw result.error
      }
    } catch {tell('No se pudo completar la solicitud. Revise los datos e intente de nuevo.')}
    finally {lock(false)}
  }
  async function save(publish) {
    if (busy) return
    lock(true)
    try {
      const patch = {draft:row.draft,revision:row.revision + 1}
      if (publish) patch.published = row.draft
      const {data,error} = await catalog().update(patch).eq('slug','la-vitola').eq('revision',row.revision).select('revision').single()
      if (error) throw error
      setRow({...row,revision:data.revision}); tell(publish ? 'Cambios publicados.' : 'Borrador guardado.')
    } catch {tell('No se guardó. Revise su sesión o vuelva a cargar para ver la versión más reciente.')}
    finally {lock(false)}
  }
  function edit(i,key,value) {
    const productos = row.draft.productos.map((p,n) => n === i ? {...p,[key]:value} : p)
    setRow({...row,draft:{...row.draft,productos}})
  }
  return <><header>La Vitola</header><h1>Administrar menú</h1><p role="status">{db ? message : 'El acceso aún no está configurado.'}</p>
    {db && (!user || mode === 'reset') && <form onSubmit={submit}>
      {mode !== 'reset' && <label>{mode === 'recover' ? 'Correo de recuperación' : 'Correo o teléfono con código de país'}<input name="id" type={mode === 'recover' ? 'email':'text'} autoComplete="username" required/></label>}
      {mode !== 'recover' && <label>{mode === 'reset' ? 'Nueva contraseña':'Contraseña'}<input name="password" type="password" autoComplete={mode === 'reset'?'new-password':'current-password'} required/></label>}
      <button disabled={busy}>{mode === 'reset'?'Guardar contraseña':mode === 'recover'?'Enviar enlace':'Entrar'}</button>
      {mode !== 'reset' && <button type="button" onClick={()=>{tell('');setMode(mode === 'recover'?'login':'recover')}}>{mode === 'recover'?'Volver':'Recuperar contraseña'}</button>}</form>}
    {user && mode !== 'reset' && row && <form onSubmit={e=>{e.preventDefault();save(e.nativeEvent.submitter?.value === 'publish')}}><fieldset disabled={busy}>
      {row.draft.productos.map((p,i)=><section key={p.id}><label>Producto<input value={p.nombre} required onChange={e=>edit(i,'nombre',e.target.value)}/></label><label>Precio MXN<input type="number" min="0" max="1000000" step=".01" required value={p.precio} onChange={e=>edit(i,'precio',e.target.value === ''?'':Number(e.target.value))}/></label></section>)}
      <button>Guardar borrador</button><button value="publish">Publicar</button></fieldset></form>}
    {user && <button onClick={async()=>{const {error}=await db.auth.signOut();if(error)tell('No se pudo cerrar la sesión.')}}>Cerrar sesión</button>}
    <p><a href="/menu/la-vitola">Ver menú público</a></p></>
}
createRoot(document.getElementById('root')).render(<Panel/>)
