DO $$
DECLARE
    v_certificate_id uuid := '24d9e2c4-42b0-4133-b801-d8cace4600f5';
    v_learning_module_id uuid;
BEGIN
    SELECT learning_module_id
    INTO v_learning_module_id
    FROM public.learning_module
    WHERE certificate_id = v_certificate_id
      AND lower(trim(coalesce(course_name, ''))) = lower('Principles of ultrasound')
    ORDER BY created_at ASC
    LIMIT 1;

    IF v_learning_module_id IS NULL THEN
        RAISE EXCEPTION 'UFC Principles of ultrasound learning module not found';
    END IF;

    DELETE FROM public.resource_data
    WHERE learning_module_id = v_learning_module_id
      AND (
        lower(trim(resource_name)) = lower('Image optimization')
        OR lower(trim(resource_topic)) = lower('Image optimization')
      );

    UPDATE public.resource_data
    SET display_order = 10
    WHERE learning_module_id = v_learning_module_id
      AND lower(trim(resource_name)) = lower('Artifacts');
END $$;
