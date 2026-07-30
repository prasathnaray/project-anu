ALTER TABLE public.resource_data
    ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;

DO $$
DECLARE
    v_target record;
    v_removed_order integer;
    v_removed_count integer;
    v_module_count integer := 0;
BEGIN
    FOR v_target IN
        SELECT DISTINCT ON (lower(trim(lm.unit_name)))
          lm.learning_module_id,
          upper(trim(lm.unit_name)) AS unit_name
        FROM public.learning_module lm
        INNER JOIN public.certification_data cd
          ON cd.certificate_id = lm.certificate_id
        WHERE lower(trim(coalesce(cd.certificate_name, ''))) = lower('BTC')
          AND lower(trim(coalesce(lm.unit_name, ''))) IN (lower('AC'), lower('FL'))
        ORDER BY lower(trim(lm.unit_name)), lm.created_at ASC
    LOOP
        v_module_count := v_module_count + 1;

        SELECT min(rd.display_order)
        INTO v_removed_order
        FROM public.resource_data rd
        WHERE rd.learning_module_id = v_target.learning_module_id
          AND lower(trim(coalesce(rd.resource_topic, ''))) = lower('Imaging the Plane')
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
        WHERE rd.learning_module_id = v_target.learning_module_id
          AND lower(trim(coalesce(rd.resource_topic, ''))) = lower('Imaging the Plane')
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
            WHERE rd.learning_module_id = v_target.learning_module_id
              AND COALESCE(rd.is_hidden, false) IS NOT TRUE
              AND rd.display_order > v_removed_order;
        ELSIF NOT EXISTS (
            SELECT 1
            FROM public.resource_data rd
            WHERE rd.learning_module_id = v_target.learning_module_id
              AND lower(trim(coalesce(rd.resource_topic, ''))) = lower('Imaging the Plane')
              AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
              AND regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9]+', '', 'g') IN (
                'mindsparksprobemovement',
                'mindsparksprobemovements',
                'minsparksprobemovement',
                'minsparksprobemovements'
              )
        ) THEN
            RAISE EXCEPTION 'BTC % MindSparks probe movement resource not found', v_target.unit_name;
        END IF;
    END LOOP;

    IF v_module_count <> 2 THEN
        RAISE EXCEPTION 'Expected BTC AC and FL learning modules, but matched %', v_module_count;
    END IF;
END $$;
