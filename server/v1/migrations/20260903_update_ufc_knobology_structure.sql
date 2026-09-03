ALTER TABLE public.resource_data
    ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;

DO $$
DECLARE
    v_learning_module_id uuid;
    v_resource_id uuid;
    v_keep_ids uuid[] := ARRAY[]::uuid[];
    v_visible_count integer;
    item record;
BEGIN
    SELECT lm.learning_module_id
    INTO v_learning_module_id
    FROM public.learning_module lm
    INNER JOIN public.certification_data cd
      ON cd.certificate_id = lm.certificate_id
    WHERE lower(trim(coalesce(cd.certificate_name, ''))) = lower('UFC')
      AND (
        lower(trim(coalesce(lm.course_name, ''))) = lower('Knobology')
        OR lower(trim(coalesce(lm.module_name, ''))) = lower('Knobology')
        OR lower(trim(coalesce(lm.unit_name, ''))) = lower('Knobology')
      )
    ORDER BY lm.created_at ASC
    LIMIT 1;

    IF v_learning_module_id IS NULL THEN
        RAISE EXCEPTION 'UFC Knobology learning module not found';
    END IF;

    FOR item IN
        SELECT *
        FROM (VALUES
            ('Overview of Ultrasound Machine', 'Overview of Ultrasound Machine', 1,
             ARRAY['overviewofultrasoundmachine', 'ultrasoundmachine', 'ultrasoundmachinelr', 'ultrasoundmachinelr(lmsanimation)']),
            ('Function of the Knobs', 'Functions of Knobs', 1,
             ARRAY['functionsoftheknobs', 'functionsofknobs', 'functionofknobs', 'functionofknobs', 'functionsofknobslr', 'functionsofknobslr(lmsanimation)']),
            ('Function of the Knobs', 'Interaction - Ultrasound Machine Interaction', 2,
             ARRAY['interactionultrasoundmachineinteraction']),
            ('Function of the Knobs', 'Interaction - Knobology Optimization Activity', 3,
             ARRAY['interactionknobologyoptimizationactivity', 'interactionknobologyinteractionactivity', 'mindsparksdragdrop']),
            ('Function of the Knobs', 'Mind Sparks - Quiz', 4,
             ARRAY['mindsparksquiz', 'mindsparksusmachinequiz']),
            ('Imaging Modes', 'Imaging Modes', 1,
             ARRAY['imagingmodes', 'imagingmodeslr', 'imagingmodeslr(lmsanimation)']),
            ('Imaging Modes', 'MindSparks - True / False', 2,
             ARRAY['mindsparkstruefalse', 'mindsparksimagingmodestruefalse']),
            ('Echo Dose', 'Match', 1,
             ARRAY['match', 'echodosematch', 'knobsmatch']),
            ('Echo Dose', 'Crossword', 2,
             ARRAY['crossword', 'echodosecrossword', 'knobsmachinecrosswordpuzzle'])
        ) AS desired(resource_topic, resource_name, display_order, alias_tokens)
    LOOP
        SELECT rd.resource_id
        INTO v_resource_id
        FROM public.resource_data rd
        WHERE rd.learning_module_id = v_learning_module_id
          AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
          AND regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9()]+', '', 'g') = ANY(item.alias_tokens)
          AND NOT (rd.resource_id = ANY(v_keep_ids))
        ORDER BY
          CASE WHEN regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9()]+', '', 'g') =
                    regexp_replace(lower(item.resource_name), '[^a-z0-9()]+', '', 'g') THEN 0 ELSE 1 END,
          COALESCE(rd.is_hidden, false),
          rd.created_at ASC
        LIMIT 1;

        IF v_resource_id IS NULL THEN
            INSERT INTO public.resource_data (
                learning_module_id,
                resource_type,
                resource_topic,
                resource_name,
                display_order,
                is_hidden
            ) VALUES (
                v_learning_module_id,
                'Learning Resource',
                item.resource_topic,
                item.resource_name,
                item.display_order,
                false
            )
            RETURNING resource_id INTO v_resource_id;
        ELSE
            UPDATE public.resource_data
            SET resource_type = 'Learning Resource',
                resource_topic = item.resource_topic,
                resource_name = item.resource_name,
                display_order = item.display_order,
                is_hidden = false
            WHERE resource_id = v_resource_id;
        END IF;

        v_keep_ids := array_append(v_keep_ids, v_resource_id);
        v_resource_id := NULL;
    END LOOP;

    UPDATE public.resource_data rd
    SET is_hidden = true
    WHERE rd.learning_module_id = v_learning_module_id
      AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
      AND NOT (rd.resource_id = ANY(v_keep_ids));

    SELECT count(*)
    INTO v_visible_count
    FROM public.resource_data rd
    WHERE rd.learning_module_id = v_learning_module_id
      AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
      AND COALESCE(rd.is_hidden, false) IS NOT TRUE;

    IF cardinality(v_keep_ids) <> 9 OR v_visible_count <> 9 THEN
        RAISE EXCEPTION 'Expected exactly 9 visible UFC Knobology resources, found %', v_visible_count;
    END IF;
END $$;
