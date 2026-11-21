import {createClient} from '@supabase/supabase-js'

export default async function handler(req,res) {
  if (!['GET','HEAD'].includes(req.method)) return res.status(405).end()
  const url = 'https://uszhdesbewkjvphipudw.supabase.co'
  res.setHeader('Cache-Control','no-store')
  res.setHeader('X-Content-Type-Options','nosniff')
  if (process.env.VITE_SUPABASE_URL?.replace(/\/$/,'') !== url || !process.env.VITE_SUPABASE_ANON_KEY) return res.status(503).end()
  const db = createClient(url,process.env.VITE_SUPABASE_ANON_KEY,{auth:{persistSession:false}})
  const {data,error} = await db.rpc('sb_vitola_published')
  if (error || !data) return res.status(503).end()
  res.setHeader('Content-Type','application/javascript; charset=utf-8')
  return res.status(200).send('window.STREETBOSS_MENU = '+JSON.stringify(data).replaceAll('<','\\u003c')+';')
}
