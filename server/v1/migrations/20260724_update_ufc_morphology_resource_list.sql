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
        lower(trim(coalesce(course_name, ''))) = lower('Morphology')
        OR lower(trim(coalesce(module_name, ''))) = lower('Morphology')
        OR lower(trim(coalesce(unit_name, ''))) = lower('Morphology')
      )
    ORDER BY created_at ASC
    LIMIT 1;

    IF v_learning_module_id IS NULL THEN
        RAISE EXCEPTION 'UFC Morphology learning module not found';
    END IF;

    WITH resource_order(alias_name, canonical_name, canonical_topic, sort_order) AS (
        VALUES
            ('Mind Sparks - MCQ', 'Mind Sparks - Sector', 'Image Formation & Sector Orientation', 1),
            ('Mind Sparks - Sector', 'Mind Sparks - Sector', 'Image Formation & Sector Orientation', 1),
            ('Need for understanding sector orientation', 'Mind Sparks - Sector Orientation', 'Image Formation & Sector Orientation', 2),
            ('Mind Sparks - Sector Orientation', 'Mind Sparks - Sector Orientation', 'Image Formation & Sector Orientation', 2),
            ('Mind Sparks - ChatBot', 'Interaction - Scanning Planes', 'Image Formation & Sector Orientation', 3),
            ('Interaction - Scanning Planes', 'Interaction - Scanning Planes', 'Image Formation & Sector Orientation', 3),
            ('Mind Sparks - Scanning', 'Mind Sparks - 3D to 2D', '3D to 2D Imaging', 1),
            ('Mind Sparks - 3D to 2D', 'Mind Sparks - 3D to 2D', '3D to 2D Imaging', 1),
            ('Mind Sparks - Picture Pick', '2D to 3D - Picture Pick', '2D to 3D Imaging', 1),
            ('2D to 3D - Picture Pick', '2D to 3D - Picture Pick', '2D to 3D Imaging', 1),
            ('Sector Orientation', 'Sector - Finding with clues', 'Echo Dose', 1),
            ('Sector - Finding with clues', 'Sector - Finding with clues', 'Echo Dose', 1),
            ('3D to 2D Prediction', '3D to 2D', 'Echo Dose', 2),
            ('3D to 2D', '3D to 2D', 'Echo Dose', 2)
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
            ('Learning Resource', 'Image Formation & Sector Orientation', 'Mind Sparks - Sector', 1),
            ('Learning Resource', 'Image Formation & Sector Orientation', 'Mind Sparks - Sector Orientation', 2),
            ('Learning Resource', 'Image Formation & Sector Orientation', 'Interaction - Scanning Planes', 3),
            ('Learning Resource', '3D to 2D Imaging', 'Mind Sparks - 3D to 2D', 1),
            ('Learning Resource', '2D to 3D Imaging', '2D to 3D - Picture Pick', 1),
            ('Learning Resource', 'Echo Dose', 'Sector - Finding with clues', 1),
            ('Learning Resource', 'Echo Dose', '3D to 2D', 2)
    ) AS item(resource_type, resource_topic, resource_name, display_order)
    WHERE NOT EXISTS (
        SELECT 1
        FROM public.resource_data existing
        WHERE existing.learning_module_id = v_learning_module_id
          AND lower(trim(existing.resource_name)) = lower(trim(item.resource_name))
    );

    UPDATE public.resource_data
    SET is_hidden = lower(trim(coalesce(resource_name, ''))) NOT IN (
            lower('Mind Sparks - Sector'),
            lower('Mind Sparks - Sector Orientation'),
            lower('Interaction - Scanning Planes'),
            lower('Mind Sparks - 3D to 2D'),
            lower('2D to 3D - Picture Pick'),
            lower('Sector - Finding with clues'),
            lower('3D to 2D')
        )
    WHERE learning_module_id = v_learning_module_id
      AND (
        lower(trim(coalesce(resource_type, ''))) = lower('Learning Resource')
        OR lower(trim(coalesce(resource_name, ''))) IN (
          lower('Image formation & sector orientation'),
          lower('Mind Sparks - MCQ'),
          lower('Need for understanding sector orientation'),
          lower('Mind Sparks - ChatBot'),
          lower('3D to 2D Imaging'),
          lower('Mind Sparks - Scanning'),
          lower('2D to 3D Imaging'),
          lower('Mind Sparks - Picture Pick'),
          lower('Interaction - Spin Wheel'),
          lower('Sector Orientation'),
          lower('3D to 2D Prediction')
        )
      );
END $$;
