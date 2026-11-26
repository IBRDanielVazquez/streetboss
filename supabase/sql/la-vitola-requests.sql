-- Registro independiente de solicitudes originadas por el menú de La Vitola.
-- Los registros NO significan pedidos confirmados ni ventas pagadas.
CREATE TABLE IF NOT EXISTS public.sb_vitola_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id uuid NOT NULL UNIQUE,
  customer_name text NOT NULL CHECK (char_length(customer_name) BETWEEN 2 AND 120),
  customer_phone text NOT NULL CHECK (customer_phone ~ '^[0-9]{10}$'),
  requested_at timestamptz NOT NULL DEFAULT now(),
  delivery_type text NOT NULL CHECK (delivery_type IN ('domicilio', 'recoger')),
  items jsonb NOT NULL,
  subtotal numeric(12,2) NOT NULL CHECK (subtotal >= 0),
  final_total numeric(12,2) CHECK (final_total >= 0),
  status text NOT NULL DEFAULT 'solicitud' CHECK (status IN ('solicitud', 'confirmado', 'cancelado')),
  marketing_opt_in boolean NOT NULL DEFAULT false,
  marketing_opt_in_at timestamptz,
  confirmed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sb_vitola_requests_phone_idx ON public.sb_vitola_requests(customer_phone);
CREATE INDEX IF NOT EXISTS sb_vitola_requests_date_idx ON public.sb_vitola_requests(requested_at DESC);
ALTER TABLE public.sb_vitola_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sb_vitola_requests FORCE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.sb_vitola_requests FROM PUBLIC, anon, authenticated;
-- Sin políticas públicas; solo la Edge Function con service role puede insertar
-- y el portal privado, tras verificar el usuario autorizado, puede consultar/cambiar estados.
