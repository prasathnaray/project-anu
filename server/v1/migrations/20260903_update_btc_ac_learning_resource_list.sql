ALTER TABLE public.resource_data
    ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;

DO $$
DECLARE
    v_learning_module_id uuid;
    v_module_count integer := 0;
    v_visible_count integer;
    v_mapped_count integer;
    v_resources jsonb := '[
      {"name":"AC Introduction","topic":"Fetal Abdomen","display_order":1,"aliases":[]},
      {"name":"Transabdominal plane & Abdominal circumference","topic":"Fetal Abdomen","display_order":2,"aliases":[]},
      {"name":"Significance","topic":"Fetal Abdomen","display_order":3,"aliases":[]},
      {"name":"Geometric shapes of key landmarks and their significance","topic":"Anatomical Landmarks","display_order":4,"aliases":["Mind Sparks - Geometric landmarks","Anatomical landmarks","Anatomical landmarks of the transabdominal plane","Anatomical Landmarks of the Transabdominal Plane"]},
      {"name":"Mind Sparks - Quiz","topic":"Anatomical Landmarks","display_order":5,"aliases":["MindSparks - Quiz","Mind Sparks - Anatomical Landmarks"]},
      {"name":"Imaging the plane","topic":"Imaging the Plane","display_order":6,"aliases":["How to acquire the transabdominal plane"]},
      {"name":"Mind Sparks - Probe Movements","topic":"Imaging the Plane","display_order":7,"aliases":["MindSparks - Probe movement","MindSparks - Probe movements","Mind Sparks - Probe movement","Mind Sparks - Probe movements","MindSparks - Probe Movements","Min Sparks - Probe movement","Min Sparks - Probe movements"]},
      {"name":"Measurement","topic":"Measurement","display_order":8,"aliases":["Measurements","How to measure AC","Ellipse method","Two-diameter method"]},
      {"name":"Interaction - Plane orientation and measurement","topic":"Measurement","display_order":9,"aliases":["Interaction - Landmark placement and measurement"]},
      {"name":"Mind Sparks - Picture Pick","topic":"Measurement","display_order":10,"aliases":["MindSparks - Picture Pick"],"topic_aliases":["Measurements"]},
      {"name":"Plane Acquisition Challenges and Common Errors","topic":"Pitfalls in Plane Acquisition and Measurement","display_order":11,"aliases":["Plane Acquisition Challenges and Common Measurement Errors","Plane Acquisition Challenges","Common Measurement Errors","Pit Falls"]},
      {"name":"Mind Sparks - Picture Pick","topic":"Pitfalls in Plane Acquisition and Measurement","display_order":12,"aliases":["MindSparks - Picture Pick"],"topic_aliases":["Plane Acquisition Challenges and Common Errors","Plane Acquisition Challenges and Common Measurement Errors","Pitfalls","Pit Falls"]},
      {"name":"AC chart","topic":"Image Diagnosis","display_order":13,"aliases":["AC Chart","Image Diagnosis"]},
      {"name":"Mind Sparks - True/False","topic":"Image Diagnosis","display_order":14,"aliases":["MindSparks - True/False","Mind Sparks - Chart Interpretation"]},
      {"name":"Crossword puzzle","topic":"OB Boosters","display_order":15,"aliases":["ALM - Crossword"]},
      {"name":"True/False","topic":"OB Boosters","display_order":16,"aliases":[]},
      {"name":"Picture Pick","topic":"OB Boosters","display_order":17,"aliases":[]}
    ]'::jsonb;
BEGIN
    CREATE TEMP TABLE IF NOT EXISTS btc_ac_desired_resources (
        name text NOT NULL,
        topic text NOT NULL,
        display_order integer PRIMARY KEY,
        aliases jsonb NOT NULL,
        topic_aliases jsonb NOT NULL
    ) ON COMMIT DROP;

    CREATE TEMP TABLE IF NOT EXISTS btc_ac_resource_matches (
        display_order integer PRIMARY KEY,
        resource_id uuid UNIQUE
    ) ON COMMIT DROP;

    TRUNCATE pg_temp.btc_ac_desired_resources;

    INSERT INTO pg_temp.btc_ac_desired_resources (name, topic, display_order, aliases, topic_aliases)
    SELECT item.name,
           item.topic,
           item.display_order,
           COALESCE(item.aliases, '[]'::jsonb),
           COALESCE(item.topic_aliases, '[]'::jsonb)
    FROM jsonb_to_recordset(v_resources)
      AS item(name text, topic text, display_order integer, aliases jsonb, topic_aliases jsonb);

    FOR v_learning_module_id IN
        SELECT lm.learning_module_id
        FROM public.learning_module lm
        INNER JOIN public.certification_data cd
          ON cd.certificate_id = lm.certificate_id
        WHERE lower(trim(coalesce(cd.certificate_name, ''))) = lower('BTC')
          AND (
            lower(trim(coalesce(lm.course_name, ''))) = lower('AC')
            OR lower(trim(coalesce(lm.module_name, ''))) = lower('AC')
            OR lower(trim(coalesce(lm.unit_name, ''))) = lower('AC')
          )
    LOOP
        v_module_count := v_module_count + 1;
        TRUNCATE pg_temp.btc_ac_resource_matches;

        INSERT INTO pg_temp.btc_ac_resource_matches (display_order, resource_id)
        SELECT desired.display_order, matched.resource_id
        FROM pg_temp.btc_ac_desired_resources desired
        CROSS JOIN LATERAL (
            SELECT rd.resource_id
            FROM public.resource_data rd
            WHERE rd.learning_module_id = v_learning_module_id
              AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
              AND EXISTS (
                  SELECT 1
                  FROM jsonb_array_elements_text(desired.aliases || jsonb_build_array(desired.name)) candidate(name)
                  WHERE regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9]+', '', 'g') =
                        regexp_replace(lower(candidate.name), '[^a-z0-9]+', '', 'g')
              )
              AND (
                  (
                      SELECT count(*)
                      FROM pg_temp.btc_ac_desired_resources duplicate_name
                      WHERE regexp_replace(lower(duplicate_name.name), '[^a-z0-9]+', '', 'g') =
                            regexp_replace(lower(desired.name), '[^a-z0-9]+', '', 'g')
                  ) = 1
                  OR EXISTS (
                      SELECT 1
                      FROM jsonb_array_elements_text(desired.topic_aliases || jsonb_build_array(desired.topic)) candidate_topic(topic)
                      WHERE regexp_replace(lower(coalesce(rd.resource_topic, '')), '[^a-z0-9]+', '', 'g') =
                            regexp_replace(lower(candidate_topic.topic), '[^a-z0-9]+', '', 'g')
                  )
              )
            ORDER BY
              CASE
                WHEN regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9]+', '', 'g') =
                     regexp_replace(lower(desired.name), '[^a-z0-9]+', '', 'g') THEN 0
                ELSE 1
              END,
              CASE
                WHEN regexp_replace(lower(coalesce(rd.resource_topic, '')), '[^a-z0-9]+', '', 'g') =
                     regexp_replace(lower(desired.topic), '[^a-z0-9]+', '', 'g') THEN 0
                ELSE 1
              END,
              CASE WHEN COALESCE(rd.is_hidden, false) IS NOT TRUE THEN 0 ELSE 1 END,
              rd.created_at ASC NULLS LAST,
              rd.resource_id
            LIMIT 1
        ) matched;

        UPDATE public.resource_data rd
        SET resource_name = desired.name,
            resource_topic = desired.topic,
            display_order = desired.display_order,
            is_hidden = false
        FROM pg_temp.btc_ac_resource_matches matched
        INNER JOIN pg_temp.btc_ac_desired_resources desired
          ON desired.display_order = matched.display_order
        WHERE rd.resource_id = matched.resource_id;

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
        FROM pg_temp.btc_ac_desired_resources desired
        WHERE NOT EXISTS (
            SELECT 1
            FROM pg_temp.btc_ac_resource_matches matched
            WHERE matched.display_order = desired.display_order
        );

        TRUNCATE pg_temp.btc_ac_resource_matches;

        INSERT INTO pg_temp.btc_ac_resource_matches (display_order, resource_id)
        SELECT desired.display_order, matched.resource_id
        FROM pg_temp.btc_ac_desired_resources desired
        CROSS JOIN LATERAL (
            SELECT rd.resource_id
            FROM public.resource_data rd
            WHERE rd.learning_module_id = v_learning_module_id
              AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
              AND regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9]+', '', 'g') =
                  regexp_replace(lower(desired.name), '[^a-z0-9]+', '', 'g')
              AND regexp_replace(lower(coalesce(rd.resource_topic, '')), '[^a-z0-9]+', '', 'g') =
                  regexp_replace(lower(desired.topic), '[^a-z0-9]+', '', 'g')
              AND rd.display_order = desired.display_order
            ORDER BY
              CASE WHEN COALESCE(rd.is_hidden, false) IS NOT TRUE THEN 0 ELSE 1 END,
              rd.created_at ASC NULLS LAST,
              rd.resource_id
            LIMIT 1
        ) matched;

        UPDATE public.resource_data rd
        SET is_hidden = true
        WHERE rd.learning_module_id = v_learning_module_id
          AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
          AND NOT EXISTS (
              SELECT 1
              FROM pg_temp.btc_ac_resource_matches matched
              WHERE matched.resource_id = rd.resource_id
          );

        SELECT count(*)
        INTO v_mapped_count
        FROM pg_temp.btc_ac_resource_matches;

        SELECT count(*)
        INTO v_visible_count
        FROM public.resource_data rd
        WHERE rd.learning_module_id = v_learning_module_id
          AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
          AND COALESCE(rd.is_hidden, false) IS NOT TRUE;

        IF v_mapped_count <> 17 OR v_visible_count <> 17 THEN
            RAISE EXCEPTION
              'Expected 17 canonical visible BTC AC learning resources for module %, but mapped % and found % visible',
              v_learning_module_id,
              v_mapped_count,
              v_visible_count;
        END IF;
    END LOOP;

    IF v_module_count = 0 THEN
        RAISE EXCEPTION 'BTC AC learning module not found';
    END IF;
END $$;
