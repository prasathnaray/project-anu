ALTER TABLE public.resource_data
    ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;

DO $$
DECLARE
    v_learning_module_id uuid;
BEGIN
    SELECT lm.learning_module_id
    INTO v_learning_module_id
    FROM public.learning_module lm
    INNER JOIN public.certification_data cd
      ON cd.certificate_id = lm.certificate_id
    WHERE lower(trim(coalesce(cd.certificate_name, ''))) = lower('UFC')
      AND (
        lower(trim(coalesce(lm.course_name, ''))) = lower('Morphology')
        OR lower(trim(coalesce(lm.module_name, ''))) = lower('Morphology')
        OR lower(trim(coalesce(lm.unit_name, ''))) = lower('Morphology')
      )
    ORDER BY lm.created_at ASC
    LIMIT 1;

    IF v_learning_module_id IS NULL THEN
        RAISE EXCEPTION 'UFC Morphology learning module not found';
    END IF;

    WITH resource_order(alias_name, canonical_name, canonical_topic, sort_order) AS (
        VALUES
            ('Image Formation and Sector Orientation', 'Image Formation & Sector Orientation', 'Image Formation & Sector Orientation', 1),
            ('Image Formation & Sector Orientation', 'Image Formation & Sector Orientation', 'Image Formation & Sector Orientation', 1),
            ('3D to 2D Imaging', '3D to 2D Imaging', '3D to 2D Imaging', 1),
            ('2D to 3D Imaging', '2D to 3D Imaging', '2D to 3D Imaging', 1)
    )
    UPDATE public.resource_data rd
    SET resource_name = ro.canonical_name,
        resource_type = 'Learning Resource',
        resource_topic = ro.canonical_topic,
        display_order = ro.sort_order,
        is_hidden = false
    FROM resource_order ro
    WHERE rd.learning_module_id = v_learning_module_id
      AND lower(trim(rd.resource_name)) = lower(trim(ro.alias_name))
      AND (
        lower(trim(ro.alias_name)) = lower(trim(ro.canonical_name))
        OR NOT EXISTS (
          SELECT 1
          FROM public.resource_data canonical
          WHERE canonical.learning_module_id = v_learning_module_id
            AND lower(trim(canonical.resource_name)) = lower(trim(ro.canonical_name))
        )
      );

    INSERT INTO public.resource_data (
        learning_module_id,
        resource_type,
        resource_topic,
        resource_name,
        display_order,
        is_hidden
    )
    SELECT v_learning_module_id, item.resource_type, item.resource_topic,
           item.resource_name, item.display_order, false
    FROM (
        VALUES
            ('Learning Resource', 'Image Formation & Sector Orientation', 'Image Formation & Sector Orientation', 1),
            ('Learning Resource', '3D to 2D Imaging', '3D to 2D Imaging', 1),
            ('Learning Resource', '2D to 3D Imaging', '2D to 3D Imaging', 1)
    ) AS item(resource_type, resource_topic, resource_name, display_order)
    WHERE NOT EXISTS (
        SELECT 1
        FROM public.resource_data existing
        WHERE existing.learning_module_id = v_learning_module_id
          AND lower(trim(existing.resource_name)) = lower(trim(item.resource_name))
    );

    UPDATE public.resource_data
    SET is_hidden = lower(trim(coalesce(resource_name, ''))) NOT IN (
            lower('Image Formation & Sector Orientation'),
            lower('3D to 2D Imaging'),
            lower('2D to 3D Imaging')
        )
    WHERE learning_module_id = v_learning_module_id
      AND (
        lower(trim(coalesce(resource_type, ''))) = lower('Learning Resource')
        OR lower(trim(coalesce(resource_type, ''))) LIKE '%mind%spark%'
        OR lower(trim(coalesce(resource_type, ''))) LIKE '%interaction%'
        OR lower(trim(coalesce(resource_name, ''))) LIKE '%mind%spark%'
        OR lower(trim(coalesce(resource_name, ''))) LIKE 'interaction%'
        OR lower(trim(coalesce(resource_name, ''))) IN (
          lower('Image formation & sector orientation'),
          lower('Mind Sparks - MCQ'),
          lower('Mind Sparks - Sector'),
          lower('Need for understanding sector orientation'),
          lower('Mind Sparks - Sector Orientation'),
          lower('Mind Sparks - ChatBot'),
          lower('Interaction - Scanning Planes'),
          lower('3D to 2D Imaging'),
          lower('Mind Sparks - Scanning'),
          lower('Mind Sparks - 3D to 2D'),
          lower('2D to 3D Imaging'),
          lower('Mind Sparks - Picture Pick'),
          lower('Interaction - Spin Wheel'),
          lower('Sector Orientation'),
          lower('3D to 2D Prediction')
        )
      );
END $$;
