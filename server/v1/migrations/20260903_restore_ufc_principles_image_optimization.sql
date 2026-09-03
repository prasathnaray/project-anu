ALTER TABLE public.resource_data
    ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;

DO $$
DECLARE
    v_learning_module_id uuid;
    v_image_optimization_count integer;
    v_activity_count integer;
BEGIN
    SELECT lm.learning_module_id
    INTO v_learning_module_id
    FROM public.learning_module lm
    INNER JOIN public.certification_data cd
      ON cd.certificate_id = lm.certificate_id
    WHERE lower(trim(coalesce(cd.certificate_name, ''))) = lower('UFC')
      AND lower(trim(coalesce(lm.course_name, ''))) = lower('Principles of ultrasound')
    ORDER BY lm.created_at ASC
    LIMIT 1;

    IF v_learning_module_id IS NULL THEN
        RAISE EXCEPTION 'UFC Principles of ultrasound learning module not found';
    END IF;

    UPDATE public.resource_data rd
    SET resource_name = 'Image Optimization',
        resource_topic = 'Image Optimization',
        display_order = 10,
        is_hidden = false
    WHERE rd.learning_module_id = v_learning_module_id
      AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
      AND (
        regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9]+', '', 'g') = 'imageoptimization'
        OR regexp_replace(lower(coalesce(rd.resource_topic, '')), '[^a-z0-9]+', '', 'g') = 'imageoptimization'
      );

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
        'Image Optimization',
        'Image Optimization',
        10,
        false
    WHERE NOT EXISTS (
        SELECT 1
        FROM public.resource_data rd
        WHERE rd.learning_module_id = v_learning_module_id
          AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
          AND regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9]+', '', 'g') = 'imageoptimization'
          AND regexp_replace(lower(coalesce(rd.resource_topic, '')), '[^a-z0-9]+', '', 'g') = 'imageoptimization'
    );

    UPDATE public.resource_data rd
    SET resource_name = 'Interaction',
        resource_topic = 'Image Otimization Activity',
        display_order = 11,
        is_hidden = false
    WHERE rd.learning_module_id = v_learning_module_id
      AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
      AND regexp_replace(lower(coalesce(rd.resource_topic, '')), '[^a-z0-9]+', '', 'g') IN (
        'imageoptimizationactivity',
        'imageotimizationactivity'
      );

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
        'Image Otimization Activity',
        'Interaction',
        11,
        false
    WHERE NOT EXISTS (
        SELECT 1
        FROM public.resource_data rd
        WHERE rd.learning_module_id = v_learning_module_id
          AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
          AND regexp_replace(lower(coalesce(rd.resource_topic, '')), '[^a-z0-9]+', '', 'g') = 'imageotimizationactivity'
          AND regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9]+', '', 'g') = 'interaction'
    );

    UPDATE public.resource_data rd
    SET display_order = 9
    WHERE rd.learning_module_id = v_learning_module_id
      AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
      AND regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9]+', '', 'g') = 'echogenicity';

    UPDATE public.resource_data rd
    SET display_order = 12
    WHERE rd.learning_module_id = v_learning_module_id
      AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
      AND regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9]+', '', 'g') = 'artifacts';

    SELECT count(*)
    INTO v_image_optimization_count
    FROM public.resource_data rd
    WHERE rd.learning_module_id = v_learning_module_id
      AND COALESCE(rd.is_hidden, false) IS NOT TRUE
      AND regexp_replace(lower(coalesce(rd.resource_topic, '')), '[^a-z0-9]+', '', 'g') = 'imageoptimization'
      AND regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9]+', '', 'g') = 'imageoptimization';

    SELECT count(*)
    INTO v_activity_count
    FROM public.resource_data rd
    WHERE rd.learning_module_id = v_learning_module_id
      AND COALESCE(rd.is_hidden, false) IS NOT TRUE
      AND regexp_replace(lower(coalesce(rd.resource_topic, '')), '[^a-z0-9]+', '', 'g') = 'imageotimizationactivity'
      AND regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9]+', '', 'g') = 'interaction';

    IF v_image_optimization_count <> 1 OR v_activity_count <> 1 THEN
        RAISE EXCEPTION
          'Expected one Image Optimization and one Image Otimization Activity resource, found % and %',
          v_image_optimization_count,
          v_activity_count;
    END IF;
END $$;
