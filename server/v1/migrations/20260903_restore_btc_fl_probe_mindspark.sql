ALTER TABLE public.resource_data
    ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;

DO $$
DECLARE
    v_learning_module_id uuid;
    v_resource_id uuid;
    v_resource_order integer;
    v_was_hidden boolean;
    v_target_count integer;
    v_module_count integer := 0;
BEGIN
    FOR v_learning_module_id IN
        SELECT lm.learning_module_id
        FROM public.learning_module lm
        INNER JOIN public.certification_data cd
          ON cd.certificate_id = lm.certificate_id
        WHERE lower(trim(coalesce(cd.certificate_name, ''))) = lower('BTC')
          AND (
            lower(trim(coalesce(lm.course_name, ''))) IN (lower('FL'), lower('FL Learning Resource'))
            OR lower(trim(coalesce(lm.module_name, ''))) IN (lower('FL'), lower('FL Learning Resource'))
            OR lower(trim(coalesce(lm.unit_name, ''))) IN (lower('FL'), lower('FL Learning Resource'))
          )
    LOOP
        v_module_count := v_module_count + 1;

        SELECT count(*), min(rd.resource_id::text)::uuid, min(rd.display_order), bool_or(COALESCE(rd.is_hidden, false))
        INTO v_target_count, v_resource_id, v_resource_order, v_was_hidden
        FROM public.resource_data rd
        WHERE rd.learning_module_id = v_learning_module_id
          AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
          AND regexp_replace(lower(coalesce(rd.resource_topic, '')), '[^a-z0-9]+', '', 'g') IN (
            'imagingtheplane',
            'imagingthetransfemoralplane'
          )
          AND regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9]+', '', 'g') IN (
            'mindsparksprobemovement',
            'mindsparksprobemovements',
            'minsparksprobemovement',
            'minsparksprobemovements'
          );

        IF v_target_count <> 1 THEN
            RAISE EXCEPTION
              'Expected one BTC FL probe-movement Mind Spark for module %, found %',
              v_learning_module_id,
              v_target_count;
        END IF;

        IF v_was_hidden IS TRUE THEN
            UPDATE public.resource_data rd
            SET display_order = rd.display_order + 1
            WHERE rd.learning_module_id = v_learning_module_id
              AND rd.resource_id <> v_resource_id
              AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
              AND COALESCE(rd.is_hidden, false) IS NOT TRUE
              AND rd.display_order >= v_resource_order;
        END IF;

        UPDATE public.resource_data rd
        SET resource_name = 'Mind Sparks - Probe Movements',
            resource_topic = 'Imaging the Plane',
            display_order = 8,
            is_hidden = false
        WHERE rd.resource_id = v_resource_id;
    END LOOP;

    IF v_module_count = 0 THEN
        RAISE EXCEPTION 'BTC FL learning module not found';
    END IF;
END $$;
