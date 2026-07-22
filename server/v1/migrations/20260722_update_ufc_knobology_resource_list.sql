ALTER TABLE public.resource_data
    ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;

DO $$
DECLARE
    v_certificate_id uuid := '24d9e2c4-42b0-4133-b801-d8cace4600f5';
    v_learning_module_id uuid;
BEGIN
    SELECT learning_module_id
    INTO v_learning_module_id
    FROM public.learning_module
    WHERE certificate_id = v_certificate_id
      AND (
        lower(trim(coalesce(course_name, ''))) = lower('Knobology')
        OR lower(trim(coalesce(module_name, ''))) = lower('Knobology')
        OR lower(trim(coalesce(unit_name, ''))) = lower('Knobology')
      )
    ORDER BY created_at ASC
    LIMIT 1;

    IF v_learning_module_id IS NULL THEN
        RAISE EXCEPTION 'UFC Knobology learning module not found';
    END IF;

    WITH resource_order(alias_name, canonical_name, canonical_topic, sort_order, hidden) AS (
        VALUES
            ('Ultrasound machine', 'Ultrasound machine', 'Overview of ultrasound machine', 1, true),
            ('Ultrasound machine - LR (LMS Animation)', 'Ultrasound machine', 'Overview of ultrasound machine', 1, true),
            ('Ultrasound machine - LR', 'Ultrasound machine', 'Overview of ultrasound machine', 1, true),
            ('Overview of ultrasound machine', 'Ultrasound machine', 'Overview of ultrasound machine', 1, true),
            ('Interaction - Ultrasound Machine Interaction', 'Interaction - Ultrasound Machine Interaction', 'Function of the Knobs', 2, false),
            ('Mindsparks - Quiz', 'Mind Sparks - US Machine - Quiz', 'Function of the Knobs', 4, false),
            ('Mind Sparks - US Machine - Quiz', 'Mind Sparks - US Machine - Quiz', 'Function of the Knobs', 4, false),
            ('Functions of knobs', 'Function of knobs', 'Function of the Knobs', 1, true),
            ('Functions of knobs - LR (LMS Animation)', 'Function of knobs', 'Function of the Knobs', 1, true),
            ('Functions of knobs - LR', 'Function of knobs', 'Function of the Knobs', 1, true),
            ('Function of knobs', 'Function of knobs', 'Function of the Knobs', 1, true),
            ('Function of the Knobs', 'Function of knobs', 'Function of the Knobs', 1, true),
            ('Mindsparks - Drag & Drop', 'Interaction - Knobology Interaction Activity', 'Function of the Knobs', 3, false),
            ('Interaction - Knobology Interaction Activity', 'Interaction - Knobology Interaction Activity', 'Function of the Knobs', 3, false),
            ('Imaging Modes', 'Imaging modes', 'Imaging Modes', 1, true),
            ('Imaging Modes - LR (LMS Animation)', 'Imaging modes', 'Imaging Modes', 1, true),
            ('Imaging Modes - LR', 'Imaging modes', 'Imaging Modes', 1, true),
            ('Imaging modes', 'Imaging modes', 'Imaging Modes', 1, true),
            ('MindSparks - Imaging Modes - True / False', 'MindSparks - Imaging Modes - True / False', 'Imaging Modes', 2, false),
            ('Mindsparks - True/False', 'MindSparks - Imaging Modes - True / False', 'Imaging Modes', 2, false),
            ('Echo Dose - Match', 'Knobs - Match', 'Echo Dose', 1, false),
            ('Knobs - Match', 'Knobs - Match', 'Echo Dose', 1, false),
            ('Echo Dose - Crossword', 'Knobs & Machine - Crossword Puzzle', 'Echo Dose', 2, false),
            ('Knobs & Machine - Crossword Puzzle', 'Knobs & Machine - Crossword Puzzle', 'Echo Dose', 2, false)
    )
    UPDATE public.resource_data rd
    SET resource_name = ro.canonical_name,
        resource_type = 'Learning Resource',
        resource_topic = ro.canonical_topic,
        display_order = ro.sort_order,
        is_hidden = ro.hidden
    FROM resource_order ro
    WHERE rd.learning_module_id = v_learning_module_id
      AND lower(trim(rd.resource_name)) = lower(trim(ro.alias_name));

    INSERT INTO public.resource_data (
        learning_module_id,
        resource_type,
        resource_topic,
        resource_name,
        display_order,
        is_hidden
    )
    SELECT v_learning_module_id, item.resource_type, item.resource_topic,
           item.resource_name, item.display_order, item.is_hidden
    FROM (
        VALUES
            ('Learning Resource', 'Overview of ultrasound machine', 'Ultrasound machine', 1, true),
            ('Learning Resource', 'Function of the Knobs', 'Interaction - Ultrasound Machine Interaction', 2, false),
            ('Learning Resource', 'Function of the Knobs', 'Interaction - Knobology Interaction Activity', 3, false),
            ('Learning Resource', 'Function of the Knobs', 'Mind Sparks - US Machine - Quiz', 4, false),
            ('Learning Resource', 'Function of the Knobs', 'Function of knobs', 1, true),
            ('Learning Resource', 'Imaging Modes', 'Imaging modes', 1, true),
            ('Learning Resource', 'Imaging Modes', 'MindSparks - Imaging Modes - True / False', 2, false),
            ('Learning Resource', 'Echo Dose', 'Knobs - Match', 1, false),
            ('Learning Resource', 'Echo Dose', 'Knobs & Machine - Crossword Puzzle', 2, false)
    ) AS item(resource_type, resource_topic, resource_name, display_order, is_hidden)
    WHERE NOT EXISTS (
        SELECT 1
        FROM public.resource_data existing
        WHERE existing.learning_module_id = v_learning_module_id
          AND lower(trim(existing.resource_name)) = lower(trim(item.resource_name))
    );
END $$;
