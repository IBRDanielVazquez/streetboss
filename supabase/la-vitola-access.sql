-- La Vitola: invitaciones privadas de activación por enlace de un solo uso.
-- No guardar tokens en texto plano; insertar SHA-256 de token temporal.
-- Aplicar únicamente en el proyecto oficial streetboss-pos.
CREATE TABLE IF NOT EXISTS public.sb_vitola_invites (
  token_hash text PRIMARY KEY,
  phone text NOT NULL CHECK (phone = '+529612548354'),
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sb_vitola_invites ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sb_vitola_invites FROM anon, authenticated;
-- La tabla sb_vitola_admins existente es la única lista de usuarios habilitados.
-- La función publicada exige token de invitación o sesión validada + membership,
-- y conserva de manera aislada el catálogo de public.sb_vitola_catalog.
