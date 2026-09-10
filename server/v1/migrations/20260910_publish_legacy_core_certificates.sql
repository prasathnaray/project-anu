-- BTC and UFC predate the multi-tenant course metadata introduced in
-- 20260810_multi_tenant_content_access.sql. They are shared core curricula,
-- so make their ownership explicit and publish them to every institution.
UPDATE public.certification_data
SET course_kind = 'core',
    owner_scope = 'super_admin',
    owner_centre_id = NULL,
    publication_status = 'published',
    visibility_mode = 'all',
    ownership_review_required = false,
    updated_at = now()
WHERE upper(trim(certificate_name)) IN ('BTC', 'UFC')
  AND (
      course_kind IS DISTINCT FROM 'core'
      OR owner_scope IS DISTINCT FROM 'super_admin'
      OR owner_centre_id IS NOT NULL
      OR publication_status IS DISTINCT FROM 'published'
      OR visibility_mode IS DISTINCT FROM 'all'
      OR ownership_review_required IS DISTINCT FROM false
  );
