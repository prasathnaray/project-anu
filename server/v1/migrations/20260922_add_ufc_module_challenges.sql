DO $$
DECLARE
    v_certificate_id uuid := '24d9e2c4-42b0-4133-b801-d8cace4600f5';
    v_learning_module_id uuid;
    v_existing_count integer;
    challenge_item record;
BEGIN
    FOR challenge_item IN
        SELECT *
        FROM jsonb_to_recordset(
            '[
              {"module_name":"Probe Movements","resource_name":"Probe Selection and Orientations","display_order":1},
              {"module_name":"Probe Movements","resource_name":"Probe Movements","display_order":2},
              {"module_name":"Knobology","resource_name":"Find the Optimal Image","display_order":1},
              {"module_name":"Knobology","resource_name":"Image Optimization","display_order":2},
              {"module_name":"Morphology","resource_name":"Sector Orientation and Directional Terms","display_order":1},
              {"module_name":"Morphology","resource_name":"Ultrasound Spatial Visualization","display_order":2}
            ]'::jsonb
        ) AS item(module_name text, resource_name text, display_order integer)
    LOOP
        SELECT lm.learning_module_id
        INTO v_learning_module_id
        FROM public.learning_module lm
        WHERE lm.certificate_id = v_certificate_id
          AND (
              lower(trim(coalesce(lm.course_name, ''))) = lower(challenge_item.module_name)
              OR lower(trim(coalesce(lm.module_name, ''))) = lower(challenge_item.module_name)
              OR lower(trim(coalesce(lm.unit_name, ''))) = lower(challenge_item.module_name)
          )
        ORDER BY lm.created_at ASC
        LIMIT 1;

        IF v_learning_module_id IS NULL THEN
            RAISE EXCEPTION 'UFC % learning module not found', challenge_item.module_name;
        END IF;

        UPDATE public.resource_data
        SET resource_type = 'CHALLENGE',
            resource_topic = 'Challenges',
            resource_name = challenge_item.resource_name,
            display_order = challenge_item.display_order,
            is_hidden = false
        WHERE learning_module_id = v_learning_module_id
          AND lower(trim(coalesce(resource_name, ''))) = lower(challenge_item.resource_name)
          AND lower(trim(coalesce(resource_type, ''))) IN ('challenge', 'challenges');

        GET DIAGNOSTICS v_existing_count = ROW_COUNT;

        IF v_existing_count = 0 THEN
            INSERT INTO public.resource_data (
                learning_module_id,
                resource_type,
                resource_topic,
                resource_name,
                display_order,
                is_hidden
            ) VALUES (
                v_learning_module_id,
                'CHALLENGE',
                'Challenges',
                challenge_item.resource_name,
                challenge_item.display_order,
                false
            );
        END IF;

        v_learning_module_id := NULL;
    END LOOP;
END $$;
