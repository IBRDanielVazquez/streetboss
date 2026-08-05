-- =============================================================================
-- Migration: StreetBoss V3 Multi-Tenant Core Architecture
-- Clean Relational Schema for Demos, Businesses, Menus, Delivery Zones, Prospects & Audit
-- =============================================================================

-- 1. Businesses Table (Multi-tenant core: handles both demos and real client businesses)
create table if not exists public.sb_businesses (
  id uuid default gen_random_uuid() primary key,
  business_id text unique not null,
  name text not null,
  slug text unique not null,
  business_type text default 'Restaurante',
  is_demo boolean default false,
  demo_status text default 'Activo', -- 'Activo', 'Inactivo', 'En preparación', 'Archivado'
  status text default 'activo',      -- 'activo', 'pausado', 'suspendido', 'archivado'
  template_version text default '3.0',
  base_demo_id text,                 -- Refers to demo business_id used as template
  owner_name text default '',
  phone text default '',
  whatsapp text default '',
  email text default '',
  address text default '',
  ext_number text default '',
  int_number text default '',
  colonia text default '',
  postal_code text default '',
  city text default 'Tuxtla Gutiérrez',
  municipality text default 'Tuxtla Gutiérrez',
  state text default 'Chiapas',
  maps_url text default '',
  facebook_url text default '',
  instagram_url text default '',
  tiktok_url text default '',
  website_url text default '',
  logo_url text default '',
  banner_url text default '',
  gallery_urls text[] default '{}',
  brand_color text default '#FF4B00',
  main_message text default '¡Gracias por tu preferencia! Pedidos al instante por WhatsApp.',
  description text default '',
  schedule_text text default 'Lun a Dom · 9:00 am – 10:00 pm',
  schedule_daily jsonb default '{}'::jsonb,
  is_open boolean default true,
  has_delivery boolean default true,
  delivery_mode text default 'fijo', -- 'fijo', 'pendiente', 'km'
  base_delivery_fee numeric(10,2) default 30.00,
  estimated_delivery_time text default '30–40 min',
  owner_username text default '',
  temp_password text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create index if not exists idx_sb_businesses_slug on public.sb_businesses(slug);
create index if not exists idx_sb_businesses_bid on public.sb_businesses(business_id);
create index if not exists idx_sb_businesses_is_demo on public.sb_businesses(is_demo);

-- RLS for sb_businesses
alter table public.sb_businesses enable row level security;
drop policy if exists "sb_businesses_public_read" on public.sb_businesses;
drop policy if exists "sb_businesses_all" on public.sb_businesses;

create policy "sb_businesses_public_read" on public.sb_businesses for select using (deleted_at is null);
create policy "sb_businesses_all" on public.sb_businesses for all using (true);


-- 2. Menu Categories Table
create table if not exists public.sb_menu_categories (
  id uuid default gen_random_uuid() primary key,
  business_id text references public.sb_businesses(business_id) on delete cascade not null,
  name text not null,
  category_type text default 'normal', -- 'normal', 'promo', 'especial'
  is_plus boolean default false,
  is_visible boolean default true,
  position integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_sb_categories_bid on public.sb_menu_categories(business_id);

alter table public.sb_menu_categories enable row level security;
drop policy if exists "sb_categories_public_read" on public.sb_menu_categories;
drop policy if exists "sb_categories_all" on public.sb_menu_categories;

create policy "sb_categories_public_read" on public.sb_menu_categories for select using (is_visible = true);
create policy "sb_categories_all" on public.sb_menu_categories for all using (true);


-- 3. Menu Products Table
create table if not exists public.sb_menu_products (
  id uuid default gen_random_uuid() primary key,
  business_id text references public.sb_businesses(business_id) on delete cascade not null,
  category_id uuid references public.sb_menu_categories(id) on delete cascade not null,
  name text not null,
  price numeric(10,2) not null,
  description text default '',
  image_url text default '',
  is_out_of_stock boolean default false,
  is_active boolean default true,
  is_featured boolean default false,
  is_promo boolean default false,
  position integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_sb_products_bid on public.sb_menu_products(business_id);
create index if not exists idx_sb_products_cid on public.sb_menu_products(category_id);

alter table public.sb_menu_products enable row level security;
drop policy if exists "sb_products_public_read" on public.sb_menu_products;
drop policy if exists "sb_products_all" on public.sb_menu_products;

create policy "sb_products_public_read" on public.sb_menu_products for select using (is_active = true);
create policy "sb_products_all" on public.sb_menu_products for all using (true);


-- 4. Business Delivery Zones Table
create table if not exists public.sb_business_delivery_zones (
  id uuid default gen_random_uuid() primary key,
  business_id text references public.sb_businesses(business_id) on delete cascade not null,
  postal_code text not null,
  settlement_name text not null,
  settlement_type text default 'Colonia',
  municipality text default 'Tuxtla Gutiérrez',
  state text default 'Chiapas',
  delivery_fee numeric(10,2) default 30.00,
  minimum_order numeric(10,2) default 0.00,
  estimated_minutes integer default 35,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint uq_sb_business_settlement_v3 unique (business_id, postal_code, settlement_name)
);

create index if not exists idx_sb_delivery_zones_bid on public.sb_business_delivery_zones(business_id);
create index if not exists idx_sb_delivery_zones_cp on public.sb_business_delivery_zones(postal_code);

alter table public.sb_business_delivery_zones enable row level security;
drop policy if exists "sb_delivery_zones_public_read" on public.sb_business_delivery_zones;
drop policy if exists "sb_delivery_zones_all" on public.sb_business_delivery_zones;

create policy "sb_delivery_zones_public_read" on public.sb_business_delivery_zones for select using (is_active = true);
create policy "sb_delivery_zones_all" on public.sb_business_delivery_zones for all using (true);


-- 5. Prospects Table
create table if not exists public.sb_prospects (
  id uuid default gen_random_uuid() primary key,
  business_name text not null,
  category text default 'Restaurante',
  contact_name text default '',
  phone text default '',
  whatsapp text default '',
  email text default '',
  address text default '',
  colonia text default '',
  city text default 'Tuxtla Gutiérrez',
  state text default 'Chiapas',
  facebook text default '',
  instagram text default '',
  tiktok text default '',
  website text default '',
  source text default 'Manual', -- 'Manual', 'Importación', 'Web'
  notes text default '',
  status text default 'Nuevo',   -- 'Nuevo', 'Contactado', 'En negociación', 'Convertido', 'Descartado'
  contact_date date default CURRENT_DATE,
  next_followup date,
  converted_client_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.sb_prospects enable row level security;
drop policy if exists "sb_prospects_all" on public.sb_prospects;
create policy "sb_prospects_all" on public.sb_prospects for all using (true);


-- 6. Audit Logs Table
create table if not exists public.sb_audit_logs (
  id uuid default gen_random_uuid() primary key,
  action text not null,
  user_id text default 'crm_user',
  target_id text default '',
  details jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.sb_audit_logs enable row level security;
drop policy if exists "sb_audit_logs_all" on public.sb_audit_logs;
create policy "sb_audit_logs_all" on public.sb_audit_logs for all using (true);
