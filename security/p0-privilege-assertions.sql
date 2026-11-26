-- Read-only privilege checks after applying p0-containment.staging.sql in isolated staging.
DO $$
DECLARE t text; r text;
BEGIN
  FOREACH t IN ARRAY ARRAY['sb_business_customers','sb_business_delivery_zones','sb_business_directory','sb_businesses','sb_clients','sb_hq_prospect_states','sb_memberships','sb_menu_analytics_events','sb_menu_categories','sb_menu_products','sb_operation_data','sb_orders','sb_vitola_admins','sb_vitola_catalog','sb_vitola_invites','sb_vitola_requests']
  LOOP
    FOREACH r IN ARRAY ARRAY['anon','authenticated']
    LOOP
      IF has_table_privilege(r, 'public.'||t, 'TRUNCATE') THEN RAISE EXCEPTION 'Unexpected truncate grant: % / %',r,t; END IF;
    END LOOP;
  END LOOP;
  IF has_table_privilege('anon','public.sb_hq_prospect_states','SELECT,INSERT,UPDATE,DELETE') THEN RAISE EXCEPTION 'HQ anonymous grant remains'; END IF;
  IF has_table_privilege('anon','public.sb_business_customers','SELECT,INSERT,UPDATE,DELETE') THEN RAISE EXCEPTION 'Customer anonymous grant remains'; END IF;
  IF has_table_privilege('anon','public.sb_menu_analytics_events','SELECT') THEN RAISE EXCEPTION 'Anonymous analytics read remains'; END IF;
END $$;
