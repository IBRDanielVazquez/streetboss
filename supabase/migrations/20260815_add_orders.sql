-- =============================================================================
-- Migration: Add Orders and Customers Tables for Real-Time cloud sync
-- =============================================================================

-- 1. Orders Table
create table if not exists public.sb_orders (
  id uuid default gen_random_uuid() primary key,
  order_id text unique not null,
  order_number text not null,
  business_id text not null,
  business_name text default '',
  customer_id text,
  customer_name text default '',
  phone text default '',
  whatsapp text default '',
  email text default '',
  delivery_type text default 'domicilio', -- 'domicilio' | 'recoleccion'
  colonia text default '',
  postal_code text default '',
  address text default '',
  items jsonb default '[]'::jsonb,
  subtotal numeric(10,2) default 0.00,
  delivery_fee numeric(10,2) default 30.00,
  total numeric(10,2) default 0.00,
  whatsapp_message text default '',
  whatsapp_status text default 'pendiente_envio', -- 'pendiente_envio', 'enviado', 'fallido'
  status text default 'pendiente_envio',          -- 'pendiente_envio', 'recibido', 'preparando', 'en_camino', 'entregado', 'cancelado'
  payment_method text default 'efectivo',        -- 'efectivo', 'transferencia', 'tarjeta'
  payment_status text default 'pendiente',        -- 'pendiente', 'comprobante_pendiente', 'pagado', 'reembolsado'
  cash_needs_change boolean default false,
  cash_pay_with text default '',
  has_terminal boolean default false,
  pending_receipt boolean default false,
  comentarios_internos text default '',
  observaciones text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_sb_orders_bid on public.sb_orders(business_id);
create index if not exists idx_sb_orders_oid on public.sb_orders(order_id);

alter table public.sb_orders enable row level security;
drop policy if exists "sb_orders_all" on public.sb_orders;
create policy "sb_orders_all" on public.sb_orders for all using (true);


-- 2. Business Customers Table (B2C Customers)
create table if not exists public.sb_business_customers (
  id uuid default gen_random_uuid() primary key,
  customer_id text unique not null,
  business_id text not null,
  name text default '',
  phone text default '',
  whatsapp text default '',
  phone_normalized text default '',
  email text default '',
  colonia text default '',
  postal_code text default '',
  address text default '',
  first_order_at timestamptz default now(),
  last_order_at timestamptz default now(),
  orders_count integer default 1,
  total_spent numeric(10,2) default 0.00,
  promo_consent boolean default false,
  promo_consent_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_sb_b2c_customers_bid on public.sb_business_customers(business_id);
create index if not exists idx_sb_b2c_customers_cid on public.sb_business_customers(customer_id);

alter table public.sb_business_customers enable row level security;
drop policy if exists "sb_business_customers_all" on public.sb_business_customers;
create policy "sb_business_customers_all" on public.sb_business_customers for all using (true);
