ALTER TABLE public.resource_data
    ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;

DO $$
DECLARE
    v_learning_module_id uuid;
    v_removed_order integer;
    v_removed_count integer;
BEGIN
    SELECT lm.learning_module_id
    INTO v_learning_module_id
    FROM public.learning_module lm
    INNER JOIN public.certification_data cd
      ON cd.certificate_id = lm.certificate_id
    WHERE lower(trim(coalesce(cd.certificate_name, ''))) = lower('BTC')
      AND (
        lower(trim(coalesce(lm.course_name, ''))) = lower('BPD & HC')
        OR lower(trim(coalesce(lm.module_name, ''))) = lower('BPD & HC')
        OR lower(trim(coalesce(lm.unit_name, ''))) = lower('BPD & HC')
      )
    ORDER BY lm.created_at ASC
    LIMIT 1;

    IF v_learning_module_id IS NULL THEN
        RAISE EXCEPTION 'BTC BPD & HC learning module not found';
    END IF;

    SELECT min(rd.display_order)
    INTO v_removed_order
    FROM public.resource_data rd
    WHERE rd.learning_module_id = v_learning_module_id
      AND lower(trim(coalesce(rd.resource_topic, ''))) IN (
        lower('Imaging the Transthalamic Plane'),
        lower('Imaging the Plane')
      )
      AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
      AND COALESCE(rd.is_hidden, false) IS NOT TRUE
      AND regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9]+', '', 'g') IN (
        'mindsparksprobemovement',
        'mindsparksprobemovements',
        'minsparksprobemovement',
        'minsparksprobemovements'
      );

    UPDATE public.resource_data rd
    SET is_hidden = true
    WHERE rd.learning_module_id = v_learning_module_id
      AND lower(trim(coalesce(rd.resource_topic, ''))) IN (
        lower('Imaging the Transthalamic Plane'),
        lower('Imaging the Plane')
      )
      AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
      AND COALESCE(rd.is_hidden, false) IS NOT TRUE
      AND regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9]+', '', 'g') IN (
        'mindsparksprobemovement',
        'mindsparksprobemovements',
        'minsparksprobemovement',
        'minsparksprobemovements'
      );

    GET DIAGNOSTICS v_removed_count = ROW_COUNT;

    IF v_removed_count > 0 AND v_removed_order IS NOT NULL THEN
        UPDATE public.resource_data rd
        SET display_order = rd.display_order - 1
        WHERE rd.learning_module_id = v_learning_module_id
          AND COALESCE(rd.is_hidden, false) IS NOT TRUE
          AND rd.display_order > v_removed_order;
    ELSIF NOT EXISTS (
        SELECT 1
        FROM public.resource_data rd
        WHERE rd.learning_module_id = v_learning_module_id
          AND lower(trim(coalesce(rd.resource_topic, ''))) IN (
            lower('Imaging the Transthalamic Plane'),
            lower('Imaging the Plane')
          )
          AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
          AND regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9]+', '', 'g') IN (
            'mindsparksprobemovement',
            'mindsparksprobemovements',
            'minsparksprobemovement',
            'minsparksprobemovements'
          )
    ) THEN
        RAISE EXCEPTION 'BTC BPD & HC MindSparks probe movement resource not found';
    END IF;
END $$;
