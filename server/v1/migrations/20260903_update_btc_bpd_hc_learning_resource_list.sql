ALTER TABLE public.resource_data
    ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;

DO $$
DECLARE
    v_learning_module_id uuid;
    v_module_count integer := 0;
    v_visible_count integer;
    v_resources jsonb := '[
      {"name":"Transthalamic Plane","topic":"Fetal Head","display_order":1},
      {"name":"Bi-Parietal Diameter","topic":"Fetal Head","display_order":2},
      {"name":"Head Circumference","topic":"Fetal Head","display_order":3},
      {"name":"Significance","topic":"Fetal Head","display_order":4},
      {"name":"Anatomical Landmarks of the Transthalamic Plane","topic":"Anatomical Landmarks","display_order":5},
      {"name":"Geometric shapes of key landmarks and their significance","topic":"Anatomical Landmarks","display_order":6},
      {"name":"Mind Sparks - Quiz","topic":"Anatomical Landmarks","display_order":7},
      {"name":"Imaging the plane","topic":"Imaging the Transthalamic Plane","display_order":8},
      {"name":"Mind Sparks - Probe Movements","topic":"Imaging the Transthalamic Plane","display_order":9},
      {"name":"How to measure BPD","topic":"Measurement","display_order":10},
      {"name":"How to measure HC","topic":"Measurement","display_order":11},
      {"name":"Plane Acquisition Challenges and Common Errors","topic":"Pitfalls in Plane Acquisition and Measurement","display_order":12},
      {"name":"Mind Sparks - Picture Pick","topic":"Pitfalls in Plane Acquisition and Measurement","display_order":13},
      {"name":"Image Diagnosis","topic":"Image Diagnosis","display_order":14},
      {"name":"Percentile Charts  & Significance","topic":"Image Diagnosis","display_order":15},
      {"name":"BPD Chart","topic":"Image Diagnosis","display_order":16},
      {"name":"HC Chart","topic":"Image Diagnosis","display_order":17},
      {"name":"Mind Sparks - Yes/No","topic":"Image Diagnosis","display_order":18},
      {"name":"Image Selection","topic":"OB Boosters","display_order":19},
      {"name":"Picture Pick","topic":"OB Boosters","display_order":20},
      {"name":"Visual Recognition","topic":"OB Boosters","display_order":21},
      {"name":"True/False","topic":"OB Boosters","display_order":22},
      {"name":"Word Search","topic":"OB Boosters","display_order":23}
    ]'::jsonb;
BEGIN
    FOR v_learning_module_id IN
        SELECT lm.learning_module_id
        FROM public.learning_module lm
        INNER JOIN public.certification_data cd
          ON cd.certificate_id = lm.certificate_id
        WHERE lower(trim(coalesce(cd.certificate_name, ''))) = lower('BTC')
          AND (
            lower(trim(coalesce(lm.course_name, ''))) = lower('BPD & HC')
            OR lower(trim(coalesce(lm.module_name, ''))) = lower('BPD & HC')
            OR lower(trim(coalesce(lm.unit_name, ''))) = lower('BPD & HC')
          )
    LOOP
        v_module_count := v_module_count + 1;

        WITH desired AS (
            SELECT *
            FROM jsonb_to_recordset(v_resources)
              AS item(name text, topic text, display_order integer)
        )
        UPDATE public.resource_data rd
        SET resource_name = desired.name,
            resource_topic = desired.topic,
            display_order = desired.display_order,
            is_hidden = false
        FROM desired
        WHERE rd.learning_module_id = v_learning_module_id
          AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
          AND regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9]+', '', 'g') =
              regexp_replace(lower(desired.name), '[^a-z0-9]+', '', 'g');

        WITH desired AS (
            SELECT *
            FROM jsonb_to_recordset(v_resources)
              AS item(name text, topic text, display_order integer)
        )
        INSERT INTO public.resource_data (
            learning_module_id,
            resource_type,
            resource_topic,
            resource_name,
            display_order,
            is_hidden
        )
        SELECT
            v_learning_module_id,
            'Learning Resource',
            desired.topic,
            desired.name,
            desired.display_order,
            false
        FROM desired
        WHERE NOT EXISTS (
            SELECT 1
            FROM public.resource_data existing
            WHERE existing.learning_module_id = v_learning_module_id
              AND lower(trim(coalesce(existing.resource_type, ''))) = lower('Learning Resource')
              AND regexp_replace(lower(coalesce(existing.resource_name, '')), '[^a-z0-9]+', '', 'g') =
                  regexp_replace(lower(desired.name), '[^a-z0-9]+', '', 'g')
        );

        WITH desired AS (
            SELECT *
            FROM jsonb_to_recordset(v_resources)
              AS item(name text, topic text, display_order integer)
        )
        UPDATE public.resource_data rd
        SET is_hidden = true
        WHERE rd.learning_module_id = v_learning_module_id
          AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
          AND NOT EXISTS (
            SELECT 1
            FROM desired
            WHERE regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9]+', '', 'g') =
                  regexp_replace(lower(desired.name), '[^a-z0-9]+', '', 'g')
          );

        SELECT count(*)
        INTO v_visible_count
        FROM public.resource_data rd
        WHERE rd.learning_module_id = v_learning_module_id
          AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
          AND COALESCE(rd.is_hidden, false) IS NOT TRUE;

        IF v_visible_count <> 23 THEN
            RAISE EXCEPTION
              'Expected 23 visible BTC BPD & HC learning resources for module %, but found %',
              v_learning_module_id,
              v_visible_count;
        END IF;
    END LOOP;

    IF v_module_count = 0 THEN
        RAISE EXCEPTION 'BTC BPD & HC learning module not found';
    END IF;
END $$;
