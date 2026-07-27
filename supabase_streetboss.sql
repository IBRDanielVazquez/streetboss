-- StreetBoss MVP schema
-- Ejecutar en Supabase SQL Editor antes de usar altas remotas desde SuperAdmin.

create table if not exists public.sb_operation_data (
  client_slug text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

alter table public.sb_operation_data enable row level security;

drop policy if exists "streetboss_read_operation_data" on public.sb_operation_data;
drop policy if exists "streetboss_write_operation_data" on public.sb_operation_data;

-- MVP: acceso publico para que los celulares sin login puedan sincronizar.
-- Endurecer en fase 2 con Supabase Auth, client keys o Edge Functions.
create policy "streetboss_read_operation_data"
on public.sb_operation_data
for select
using (true);

create policy "streetboss_write_operation_data"
on public.sb_operation_data
for all
using (true)
with check (true);

do $$
begin
  alter publication supabase_realtime add table public.sb_operation_data;
exception
  when duplicate_object then null;
end $$;

alter table public.sb_operation_data replica identity full;
