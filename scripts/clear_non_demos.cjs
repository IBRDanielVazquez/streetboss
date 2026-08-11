const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Helper to parse env files
function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    const key = parts[0].trim();
    let val = parts.slice(1).join('=').trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  });
  return env;
}

async function run() {
  const envPath = path.join(__dirname, '..', '.env.prod.vercel');
  if (!fs.existsSync(envPath)) {
    console.error('Error: El archivo .env.prod.vercel no existe.');
    process.exit(1);
  }

  const env = parseEnv(envPath);
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Las variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY están vacías.');
    process.exit(1);
  }

  console.log('Conectando a Supabase:', supabaseUrl);
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  console.log('Buscando clientes B2B no demos...');
  const { data: businesses, error: fetchError } = await supabase
    .from('sb_businesses')
    .select('business_id, name, slug, is_demo');

  if (fetchError) {
    console.error('Error al consultar Supabase:', fetchError.message);
    process.exit(1);
  }

  const nonDemos = businesses.filter(b => !b.is_demo);
  console.log(`Encontrados ${nonDemos.length} clientes B2B creados (no demos).`);

  if (nonDemos.length === 0) {
    console.log('No hay clientes de prueba que eliminar en Supabase.');
    process.exit(0);
  }

  console.log('Eliminando clientes B2B no demos de Supabase...');
  const { error: deleteError } = await supabase
    .from('sb_businesses')
    .delete()
    .eq('is_demo', false);

  if (deleteError) {
    console.error('Error al eliminar en Supabase:', deleteError.message);
    process.exit(1);
  }

  console.log('¡Limpieza completada con éxito en la base de datos central de Supabase!');
}

run().catch(err => {
  console.error('Error inesperado:', err);
  process.exit(1);
});
