-- STAGING ONLY. Do not run on production until regression, backup and rollback checks pass.
-- No catalog records, images, prices, or orders are edited.
BEGIN;
REVOKE TRUNCATE ON TABLE public.sb_business_customers FROM PUBLIC, anon, authenticated;
REVOKE TRUNCATE ON TABLE public.sb_business_delivery_zones FROM PUBLIC, anon, authenticated;
REVOKE TRUNCATE ON TABLE public.sb_business_directory FROM PUBLIC, anon, authenticated;
REVOKE TRUNCATE ON TABLE public.sb_businesses FROM PUBLIC, anon, authenticated;
REVOKE TRUNCATE ON TABLE public.sb_clients FROM PUBLIC, anon, authenticated;
REVOKE TRUNCATE ON TABLE public.sb_hq_prospect_states FROM PUBLIC, anon, authenticated;
REVOKE TRUNCATE ON TABLE public.sb_memberships FROM PUBLIC, anon, authenticated;
REVOKE TRUNCATE ON TABLE public.sb_menu_analytics_events FROM PUBLIC, anon, authenticated;
REVOKE TRUNCATE ON TABLE public.sb_menu_categories FROM PUBLIC, anon, authenticated;
REVOKE TRUNCATE ON TABLE public.sb_menu_products FROM PUBLIC, anon, authenticated;
REVOKE TRUNCATE ON TABLE public.sb_operation_data FROM PUBLIC, anon, authenticated;
REVOKE TRUNCATE ON TABLE public.sb_orders FROM PUBLIC, anon, authenticated;
REVOKE TRUNCATE ON TABLE public.sb_vitola_admins FROM PUBLIC, anon, authenticated;
REVOKE TRUNCATE ON TABLE public.sb_vitola_catalog FROM PUBLIC, anon, authenticated;
REVOKE TRUNCATE ON TABLE public.sb_vitola_invites FROM PUBLIC, anon, authenticated;
REVOKE TRUNCATE ON TABLE public.sb_vitola_requests FROM PUBLIC, anon, authenticated;
-- HQ state is private. The existing client must be migrated to Supabase Auth + MFA before release.
REVOKE ALL ON TABLE public.sb_hq_prospect_states FROM PUBLIC, anon;
DROP POLICY IF EXISTS "hq prospect states insertable" ON public.sb_hq_prospect_states;
DROP POLICY IF EXISTS "hq prospect states readable" ON public.sb_hq_prospect_states;
DROP POLICY IF EXISTS "hq prospect states updatable" ON public.sb_hq_prospect_states;
CREATE POLICY hq_state_verified_select ON public.sb_hq_prospect_states FOR SELECT TO authenticated
USING ((SELECT auth.uid()) IS NOT NULL AND (SELECT auth.jwt()->>'aal') = 'aal2' AND (SELECT public.is_superadmin()));
CREATE POLICY hq_state_verified_insert ON public.sb_hq_prospect_states FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) IS NOT NULL AND (SELECT auth.jwt()->>'aal') = 'aal2' AND (SELECT public.is_superadmin()) AND char_length(prospect_id) BETWEEN 1 AND 120);
CREATE POLICY hq_state_verified_update ON public.sb_hq_prospect_states FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) IS NOT NULL AND (SELECT auth.jwt()->>'aal') = 'aal2' AND (SELECT public.is_superadmin()))
WITH CHECK ((SELECT auth.uid()) IS NOT NULL AND (SELECT auth.jwt()->>'aal') = 'aal2' AND (SELECT public.is_superadmin()) AND char_length(prospect_id) BETWEEN 1 AND 120);
-- No public read changes to legacy menu routes in this first containment step.
-- Customers and analytics are not public menus; temporarily deny direct anonymous access.
REVOKE ALL ON TABLE public.sb_business_customers FROM PUBLIC, anon;
REVOKE SELECT ON TABLE public.sb_menu_analytics_events FROM PUBLIC, anon;
-- Legacy order and catalog APIs still need redesign before production approval.
ALTER FUNCTION public.streetboss_request_slug() SET search_path = '';
COMMIT;
