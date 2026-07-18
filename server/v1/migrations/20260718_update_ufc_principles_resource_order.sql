DO $$
DECLARE
    v_certificate_id uuid := '24d9e2c4-42b0-4133-b801-d8cace4600f5';
    v_learning_module_id uuid;
BEGIN
    SELECT learning_module_id
    INTO v_learning_module_id
    FROM public.learning_module
    WHERE certificate_id = v_certificate_id
      AND lower(course_name) = lower('Principles of ultrasound')
    ORDER BY created_at ASC
    LIMIT 1;

    IF v_learning_module_id IS NULL THEN
        RAISE EXCEPTION 'UFC Principles of ultrasound learning module not found';
    END IF;

    UPDATE public.resource_data
    SET resource_name = 'Image Formation',
        resource_topic = 'Image Formation',
        display_order = 4
    WHERE learning_module_id = v_learning_module_id
      AND lower(resource_name) = lower('Image formation');

    UPDATE public.resource_data
    SET resource_name = 'Interaction - ultrasound waves',
        resource_topic = 'Interaction of ultrasound waves',
        display_order = 7
    WHERE learning_module_id = v_learning_module_id
      AND lower(resource_name) = lower('Interaction');

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
        'Interaction Activity',
        '7. iNTERACTION Activity',
        8
    WHERE NOT EXISTS (
        SELECT 1
        FROM public.resource_data
        WHERE learning_module_id = v_learning_module_id
          AND lower(resource_name) = lower('7. iNTERACTION Activity')
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
        'Image optimization',
        'Image optimization',
        10
    WHERE NOT EXISTS (
        SELECT 1
        FROM public.resource_data
        WHERE learning_module_id = v_learning_module_id
          AND lower(resource_name) = lower('Image optimization')
    );

    UPDATE public.resource_data
    SET display_order = CASE lower(resource_name)
        WHEN lower('Ultrasound wave physics') THEN 1
        WHEN lower('Generation of ultrasound waves') THEN 2
        WHEN lower('Ultrasound wave properties') THEN 3
        WHEN lower('Image Formation') THEN 4
        WHEN lower('Imaging modes') THEN 5
        WHEN lower('Interaction of ultrasound waves') THEN 6
        WHEN lower('Interaction - ultrasound waves') THEN 7
        WHEN lower('7. iNTERACTION Activity') THEN 8
        WHEN lower('Echogenicity') THEN 9
        WHEN lower('Image optimization') THEN 10
        WHEN lower('Artifacts') THEN 11
        ELSE display_order
    END,
    resource_topic = CASE lower(resource_name)
        WHEN lower('Interaction - ultrasound waves') THEN 'Interaction of ultrasound waves'
        WHEN lower('7. iNTERACTION Activity') THEN 'Interaction Activity'
        ELSE resource_topic
    END
    WHERE learning_module_id = v_learning_module_id
      AND lower(resource_name) IN (
        lower('Ultrasound wave physics'),
        lower('Generation of ultrasound waves'),
        lower('Ultrasound wave properties'),
        lower('Image Formation'),
        lower('Imaging modes'),
        lower('Interaction of ultrasound waves'),
        lower('Interaction - ultrasound waves'),
        lower('7. iNTERACTION Activity'),
        lower('Echogenicity'),
        lower('Image optimization'),
        lower('Artifacts')
      );
END $$;
