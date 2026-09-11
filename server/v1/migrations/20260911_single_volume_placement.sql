-- Keep the newest placement for volumes that have historical duplicates.
WITH ranked_placements AS (
    SELECT
        ctid,
        ROW_NUMBER() OVER (
            PARTITION BY volume_id
            ORDER BY created_at DESC NULLS LAST, ctid DESC
        ) AS row_number
    FROM public.volume_placements
    WHERE volume_id IS NOT NULL
)
DELETE FROM public.volume_placements AS placement
USING ranked_placements AS ranked
WHERE placement.ctid = ranked.ctid
  AND ranked.row_number > 1;

-- Database-level enforcement also protects concurrent placement requests.
CREATE UNIQUE INDEX IF NOT EXISTS uq_volume_placements_volume_id
    ON public.volume_placements (volume_id);
