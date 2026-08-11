# Multi-tenant content access rollout

1. Back up PostgreSQL and Supabase Storage.
2. Apply `migrations/20260810_multi_tenant_content_access.sql` before deploying the API.
3. Set `PRIVATE_CONTENT_BUCKET` to a dedicated storage bucket and keep `PRIVATE_ASSET_URL_TTL_SECONDS` at `900` unless the MR session requires a different renewal interval.
4. Preview the storage change with `node scripts/configurePrivateContentBucket.js`; apply it with `node scripts/configurePrivateContentBucket.js --apply`.
5. Deploy the API, then use **Content Access → Migration review** to resolve legacy course and volume ownership. Migrated records remain drafts.
6. Validate legacy recordings, migrate legacy course mappings, configure specialized-course visibility, and publish only after review.
7. Verify two-institution isolation with direct API calls before exposing the new LMS navigation in production.

The API can sign legacy `BUCKET_NAME` assets during transition. Once all clients use signed URLs and assets have been moved or confirmed, make the legacy bucket private as a separate controlled operation.
