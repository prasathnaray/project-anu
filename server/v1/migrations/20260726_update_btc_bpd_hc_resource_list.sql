ALTER TABLE public.resource_data
    ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;

DO $$
DECLARE
    v_learning_module_id uuid;
    v_expected_resource_count integer := 23;
    v_matched_resource_count integer;
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

    WITH desired_resources(resource_name, resource_topic, sort_order) AS (
        VALUES
            ('Transthalamic Plane', 'Fetal Head', 1),
            ('Bi-Parietal Diameter', 'Fetal Head', 2),
            ('Head Circumference', 'Fetal Head', 3),
            ('Significance', 'Fetal Head', 4),
            ('Anatomical Landmarks of the Transthalamic Plane', 'Anatomical Landmarks', 5),
            ('Geometric shapes of key landmarks and their significance', 'Anatomical Landmarks', 6),
            ('MindSparks - Quiz', 'Anatomical Landmarks', 7),
            ('Imaging the plane', 'Imaging the Transthalamic Plane', 8),
            ('MindSparks - Probe movements', 'Imaging the Transthalamic Plane', 9),
            ('How to measure BPD', 'Measurement', 10),
            ('How to measure HC', 'Measurement', 11),
            ('Plane Acquisition Challenges and Common Errors', 'Pitfalls in Plane Acquisition and Measurement', 12),
            ('MindSparks - Picture Pick', 'Pitfalls in Plane Acquisition and Measurement', 13),
            ('Image Diagnosis', 'Image Diagnosis', 14),
            ('Percentile Charts & Significance', 'Image Diagnosis', 15),
            ('BPD Chart', 'Image Diagnosis', 16),
            ('HC Chart', 'Image Diagnosis', 17),
            ('MindSparks - Yes/No', 'Image Diagnosis', 18),
            ('Image Selection', 'OB Boosters', 19),
            ('Picture Pick', 'OB Boosters', 20),
            ('Visual Recognition', 'OB Boosters', 21),
            ('True/False', 'OB Boosters', 22),
            ('Word Search', 'OB Boosters', 23)
    )
    SELECT count(*)
    INTO v_matched_resource_count
    FROM public.resource_data rd
    INNER JOIN desired_resources desired
      ON lower(trim(rd.resource_name)) = lower(trim(desired.resource_name))
    WHERE rd.learning_module_id = v_learning_module_id
      AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource');

    IF v_matched_resource_count <> v_expected_resource_count THEN
        RAISE EXCEPTION
          'Expected % BTC BPD & HC learning resources, but matched %',
          v_expected_resource_count,
          v_matched_resource_count;
    END IF;

    WITH desired_resources(resource_name, resource_topic, sort_order) AS (
        VALUES
            ('Transthalamic Plane', 'Fetal Head', 1),
            ('Bi-Parietal Diameter', 'Fetal Head', 2),
            ('Head Circumference', 'Fetal Head', 3),
            ('Significance', 'Fetal Head', 4),
            ('Anatomical Landmarks of the Transthalamic Plane', 'Anatomical Landmarks', 5),
            ('Geometric shapes of key landmarks and their significance', 'Anatomical Landmarks', 6),
            ('MindSparks - Quiz', 'Anatomical Landmarks', 7),
            ('Imaging the plane', 'Imaging the Transthalamic Plane', 8),
            ('MindSparks - Probe movements', 'Imaging the Transthalamic Plane', 9),
            ('How to measure BPD', 'Measurement', 10),
            ('How to measure HC', 'Measurement', 11),
            ('Plane Acquisition Challenges and Common Errors', 'Pitfalls in Plane Acquisition and Measurement', 12),
            ('MindSparks - Picture Pick', 'Pitfalls in Plane Acquisition and Measurement', 13),
            ('Image Diagnosis', 'Image Diagnosis', 14),
            ('Percentile Charts & Significance', 'Image Diagnosis', 15),
            ('BPD Chart', 'Image Diagnosis', 16),
            ('HC Chart', 'Image Diagnosis', 17),
            ('MindSparks - Yes/No', 'Image Diagnosis', 18),
            ('Image Selection', 'OB Boosters', 19),
            ('Picture Pick', 'OB Boosters', 20),
            ('Visual Recognition', 'OB Boosters', 21),
            ('True/False', 'OB Boosters', 22),
            ('Word Search', 'OB Boosters', 23)
    )
    UPDATE public.resource_data rd
    SET resource_name = desired.resource_name,
        resource_topic = desired.resource_topic,
        display_order = desired.sort_order,
        is_hidden = false
    FROM desired_resources desired
    WHERE rd.learning_module_id = v_learning_module_id
      AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
      AND lower(trim(rd.resource_name)) = lower(trim(desired.resource_name));

    UPDATE public.resource_data rd
    SET is_hidden = true
    WHERE rd.learning_module_id = v_learning_module_id
      AND lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
      AND NOT EXISTS (
        SELECT 1
        FROM (
          VALUES
            ('Transthalamic Plane'),
            ('Bi-Parietal Diameter'),
            ('Head Circumference'),
            ('Significance'),
            ('Anatomical Landmarks of the Transthalamic Plane'),
            ('Geometric shapes of key landmarks and their significance'),
            ('MindSparks - Quiz'),
            ('Imaging the plane'),
            ('MindSparks - Probe movements'),
            ('How to measure BPD'),
            ('How to measure HC'),
            ('Plane Acquisition Challenges and Common Errors'),
            ('MindSparks - Picture Pick'),
            ('Image Diagnosis'),
            ('Percentile Charts & Significance'),
            ('BPD Chart'),
            ('HC Chart'),
            ('MindSparks - Yes/No'),
            ('Image Selection'),
            ('Picture Pick'),
            ('Visual Recognition'),
            ('True/False'),
            ('Word Search')
        ) AS desired(resource_name)
        WHERE lower(trim(desired.resource_name)) = lower(trim(rd.resource_name))
      );
END $$;
