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
        lower(trim(coalesce(course_name, ''))) = lower('Probe Movements')
        OR lower(trim(coalesce(module_name, ''))) = lower('Probe Movements')
        OR lower(trim(coalesce(unit_name, ''))) = lower('Probe Movements')
      )
    ORDER BY created_at ASC
    LIMIT 1;

    IF v_learning_module_id IS NULL THEN
        RAISE EXCEPTION 'UFC Probe Movements learning module not found';
    END IF;

    WITH resource_order(alias_name, canonical_name, canonical_topic, sort_order) AS (
        VALUES
            ('Anatomy planes', 'Anatomy Plane', 'Anatomy planes', 1),
            ('Anatomy Plane', 'Anatomy Plane', 'Anatomy planes', 1),
            ('Anatomy Plane - LR (LMS Animation)', 'Anatomy Plane', 'Anatomy planes', 1),
            ('Mindsparks - Drag & Drop', 'Mind Sparks - Anatomical Plane - Quiz', 'Anatomy planes', 2),
            ('Mindsparks - Anatomical Plane - Quiz', 'Mind Sparks - Anatomical Plane - Quiz', 'Anatomy planes', 2),
            ('Mind Sparks - Anatomical Plane - Quiz', 'Mind Sparks - Anatomical Plane - Quiz', 'Anatomy planes', 2),
            ('Types of probe', 'Types of probe', 'Types of probe', 3),
            ('Types of Probe', 'Types of probe', 'Types of probe', 3),
            ('Types of probe - LR (LMS Animation)', 'Types of probe', 'Types of probe', 3),
            ('Interaction - Probe Selection', 'Interaction - Probe Selection', 'Types of probe', 4),
            ('Mindsparks - Quiz', 'Mind Sparks - Quiz', 'Types of probe', 5),
            ('Mind Sparks - Quiz', 'Mind Sparks - Quiz', 'Types of probe', 5),
            ('Probe Orientation', 'Probe Orientation', 'Probe orientation', 6),
            ('Probe orientation', 'Probe Orientation', 'Probe orientation', 6),
            ('Probe Orientation - LR', 'Probe Orientation', 'Probe orientation', 6),
            ('Mindsparks - Picture Pick', 'Mind Sparks - Picture Pick', 'Probe orientation', 7),
            ('Mind Sparks - Picture Pick', 'Mind Sparks - Picture Pick', 'Probe orientation', 7),
            ('Probe Movements - LR (LMS Animation)', 'Probe Movements', 'Probe movements', 8),
            ('Mindsparks - Probe movements', 'Mindsparks - probe movements', 'Probe movements', 9),
            ('Mindsparks - Probe Movements', 'Mindsparks - probe movements', 'Probe movements', 9),
            ('Mindsparks - probe movements', 'Mindsparks - probe movements', 'Probe movements', 9),
            ('Mind Sparks - Probe Movements', 'Mindsparks - probe movements', 'Probe movements', 9),
            ('Drag & Drop - Directional terms', 'Drag & drop', 'Echo Dose', 10),
            ('Drag & Drop', 'Drag & drop', 'Echo Dose', 10),
            ('Drag & drop', 'Drag & drop', 'Echo Dose', 10),
            ('True or False - Probe Orientation', 'True/False', 'Echo Dose', 11),
            ('True / False', 'True/False', 'Echo Dose', 11),
            ('True/False', 'True/False', 'Echo Dose', 11),
            ('Probe movements - Real-time', 'Probe movements', 'Echo Dose', 12)
    )
    UPDATE public.resource_data rd
    SET resource_name = ro.canonical_name,
        resource_type = 'Learning Resource',
        resource_topic = ro.canonical_topic,
        display_order = ro.sort_order
    FROM resource_order ro
    WHERE rd.learning_module_id = v_learning_module_id
      AND lower(trim(rd.resource_name)) = lower(trim(ro.alias_name));

    UPDATE public.resource_data
    SET resource_name = 'Probe Movements',
        resource_type = 'Learning Resource',
        resource_topic = 'Probe movements',
        display_order = 8
    WHERE learning_module_id = v_learning_module_id
      AND lower(trim(resource_name)) IN (lower('Probe Movements'), lower('Probe movements'))
      AND lower(trim(coalesce(resource_topic, ''))) <> lower('Echo Dose');

    UPDATE public.resource_data rd
    SET resource_name = regexp_replace(
            regexp_replace(rd.resource_name, '\s*-\s*LR\s*\(LMS Animation\)\s*$', '', 'i'),
            '\s*-\s*LR\s*$',
            '',
            'i'
        )
    FROM public.learning_module lm
    WHERE rd.learning_module_id = lm.learning_module_id
      AND lm.certificate_id = v_certificate_id
      AND (
        rd.resource_name ~* '\s*-\s*LR\s*\(LMS Animation\)\s*$'
        OR rd.resource_name ~* '\s*-\s*LR\s*$'
      );

    INSERT INTO public.resource_data (
        learning_module_id,
        resource_type,
        resource_topic,
        resource_name,
        display_order
    )
    SELECT
        v_learning_module_id,
        'Learning Resource',
        'Types of probe',
        'Interaction - Probe Selection',
        4
    WHERE NOT EXISTS (
        SELECT 1
        FROM public.resource_data
        WHERE learning_module_id = v_learning_module_id
          AND lower(trim(resource_name)) = lower('Interaction - Probe Selection')
    );

    INSERT INTO public.resource_data (
        learning_module_id,
        resource_type,
        resource_topic,
        resource_name,
        display_order
    )
    SELECT
        v_learning_module_id,
        'Learning Resource',
        'Probe movements',
        'Mindsparks - probe movements',
        9
    WHERE NOT EXISTS (
        SELECT 1
        FROM public.resource_data
        WHERE learning_module_id = v_learning_module_id
          AND lower(trim(resource_name)) = lower('Mindsparks - probe movements')
    );

    UPDATE public.resource_data
    SET resource_name = 'Probe movements',
        resource_type = 'Learning Resource',
        resource_topic = 'Echo Dose',
        display_order = 12
    WHERE learning_module_id = v_learning_module_id
      AND lower(trim(resource_name)) IN (lower('Probe Movements'), lower('Probe movements'))
      AND lower(trim(coalesce(resource_topic, ''))) = lower('Echo Dose');
END $$;
