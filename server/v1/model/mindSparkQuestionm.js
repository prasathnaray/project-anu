const client = require('../utils/conn');
const path = require('path');
const { uploadAsset, signAsset } = require('../utils/storageAdapter');

const isAdmin = (requester) => [99, 101, 102].includes(Number(requester.role));
const canRead = (requester) => [99, 101, 102, 103].includes(Number(requester.role));
const ASSET_BUCKET = process.env.MINDSPARK_ASSET_BUCKET || process.env.BUCKET_NAME || 'question-images';

const safePathPart = (value) => String(value || 'unknown').replace(/[^a-zA-Z0-9._-]/g, '_');

const hydrateAssetValue = async (value, key = '') => {
    if (Array.isArray(value)) return Promise.all(value.map((item) => hydrateAssetValue(item)));
    if (value && typeof value === 'object') {
        const output = {};
        for (const [childKey, child] of Object.entries(value)) {
            const isUrlField = typeof child === 'string' && ['url', 'image_url', 'public_url'].includes(childKey);
            const isStorageReference = isUrlField && (
                /supabase\.co\/storage\/v1\/object\//.test(child)
                || child.startsWith('projectanu/')
                || child.startsWith('question-images/')
            );
            if (isStorageReference) output[`${childKey}_storage_path`] = child;
            output[childKey] = await hydrateAssetValue(child, childKey);
        }
        return output;
    }
    if (typeof value !== 'string' || !['url', 'image_url', 'public_url'].includes(key)) return value;
    const isStorageReference = /supabase\.co\/storage\/v1\/object\//.test(value)
        || value.startsWith('projectanu/')
        || value.startsWith('question-images/');
    return isStorageReference ? signAsset(value, { defaultSourceBucket: ASSET_BUCKET }) : value;
};

const hydrateQuestion = async (row) => ({
    ...row,
    assets: await hydrateAssetValue(row.assets),
    options: await hydrateAssetValue(row.options),
    metadata: await hydrateAssetValue(row.metadata)
});

const ensureMindSparkQuestionsTable = async () => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS public.mind_spark_questions (
            question_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            resource_id uuid NOT NULL,
            mindspark_no integer NOT NULL DEFAULT 1,
            question_no integer NOT NULL,
            question_type character varying(50) NOT NULL DEFAULT 'MCQ',
            prompt text NOT NULL,
            options jsonb NOT NULL DEFAULT '[]'::jsonb,
            correct_answer jsonb NOT NULL,
            feedback_correct text,
            feedback_wrong text,
            assets jsonb NOT NULL DEFAULT '[]'::jsonb,
            metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
            is_active boolean NOT NULL DEFAULT true,
            created_by character varying(100),
            created_at timestamp without time zone DEFAULT now(),
            updated_at timestamp without time zone DEFAULT now()
        );

        UPDATE public.mind_spark_questions
        SET mindspark_no = 1
        WHERE mindspark_no IS NULL;

        ALTER TABLE public.mind_spark_questions
            ALTER COLUMN mindspark_no SET DEFAULT 1;

        ALTER TABLE public.mind_spark_questions
            ALTER COLUMN mindspark_no SET NOT NULL;

        CREATE UNIQUE INDEX IF NOT EXISTS idx_mind_spark_questions_unique_question
            ON public.mind_spark_questions(resource_id, mindspark_no, question_no);

        CREATE INDEX IF NOT EXISTS idx_mind_spark_questions_resource_id
            ON public.mind_spark_questions(resource_id);

        CREATE INDEX IF NOT EXISTS idx_mind_spark_questions_active
            ON public.mind_spark_questions(is_active);

        DELETE FROM public.mind_spark_questions WHERE question_no BETWEEN 11 AND 15 AND question_type <> 'measurement';

        INSERT INTO public.mind_spark_questions
            (resource_id, mindspark_no, question_no, question_type, prompt, options, correct_answer, feedback_correct, feedback_wrong, is_active, updated_at)
        VALUES
            ('e196c6db-dc0b-4ebd-93b2-10a2125188e5', 1, 1, 'type1',
             'Which image shows the biparietal diameter measurement plane with the thalami, arrow sign, midline falx, and cavum septi pellucidi visible?',
             '[{"key":"A","value":"1","text":"Only A"},{"key":"B","value":"2","text":"Both A & D"},{"key":"C","value":"3","text":"Only C"},{"key":"D","value":"4","text":"Both A & C"}]'::jsonb,
             '{"key":"C","value":"Only C","answer":"C. (Only C)"}'::jsonb,
             'You correctly identified the BPD measurement plane, which shows the thalami, arrow sign, midline falx, and cavum septi pellucidi, consistent with the transthalamic view.',
             'The selected image does not correspond to the transthalamic plane. Ensure the thalami, CSP, arrow sign, and midline falx are clearly visualized for accurate BPD measurement.',
             true, now()),
            ('e196c6db-dc0b-4ebd-93b2-10a2125188e5', 1, 2, 'type1',
             'Which image shows the midline falx, arrow sign, thalami, and CSP essential for BPD measurement?',
             '[{"key":"A","value":"1","text":"Only B"},{"key":"B","value":"2","text":"Both B & D"},{"key":"C","value":"3","text":"Only D"},{"key":"D","value":"4","text":"Both B & C"}]'::jsonb,
             '{"key":"B","value":"Both B & D","answer":"B. (Both B & D)"}'::jsonb,
             'Correct! You selected the transthalamic images, which show the midline falx, thalami, arrow sign, and cavum septi pellucidi, essential landmarks for BPD measurement.',
             'Incorrect. B & D are the correct images with all the key landmarks.',
             true, now()),
            ('e196c6db-dc0b-4ebd-93b2-10a2125188e5', 1, 3, 'type1',
             'Which of the following images corresponds to the transthalamic section without visualization of the cerebellum or orbits?',
             '[{"key":"A","value":"1","text":"Both B & C"},{"key":"B","value":"2","text":"Both B & A"},{"key":"C","value":"3","text":"Only A"},{"key":"D","value":"4","text":"None of the above"}]'::jsonb,
             '{"key":"A","value":"Both B & C","answer":"A. Both B & C"}'::jsonb,
             'Correct! You chose the transthalamic section showing the thalami, arrow sign, midline falx and CSP, while excluding the cerebellum and orbits.',
             'Incorrect! Images B and C actually show the correct transthalamic plane with visible thalami, arrow sign, falx and CSP, and without cerebellum or orbits.',
             true, now()),
            ('e196c6db-dc0b-4ebd-93b2-10a2125188e5', 1, 4, 'type1',
             'Select the correct image for BPD measurement.',
             '[{"key":"A","value":"1","text":"A"},{"key":"B","value":"2","text":"B"},{"key":"C","value":"3","text":"C"},{"key":"D","value":"4","text":"D"}]'::jsonb,
             '{"key":"B","value":"B","answer":"B"}'::jsonb,
             'Excellent! You chose the correct transthalamic image suitable for BPD measurement where thalami and CSP are seen clearly.',
             'The selected image corresponds to a transventricular plane. Remember, the BPD is measured in the transthalamic section showing falx, arrow sign, thalami and CSP.',
             true, now()),
            ('e196c6db-dc0b-4ebd-93b2-10a2125188e5', 1, 5, 'type1',
             'Select the correct image for HC measurement',
             '[{"key":"A","value":"1","text":"A"},{"key":"B","value":"2","text":"B"},{"key":"C","value":"3","text":"C"},{"key":"D","value":"4","text":"D"}]'::jsonb,
             '{"key":"C","value":"C","answer":"C"}'::jsonb,
             'Correct! You identified the appropriate image for HC measurement - a symmetrical transthalamic plane with the midline falx, arrow sign, thalami and CSP in view.',
             'Incorrect. The chosen image is not suitable for HC measurement.',
             true, now())
        ON CONFLICT (resource_id, mindspark_no, question_no)
        DO UPDATE SET
            prompt = EXCLUDED.prompt,
            options = EXCLUDED.options,
            correct_answer = EXCLUDED.correct_answer,
            feedback_correct = EXCLUDED.feedback_correct,
            feedback_wrong = EXCLUDED.feedback_wrong,
            is_active = true,
            updated_at = now();

        DO $$
        DECLARE
            ac_res RECORD;
        BEGIN
            FOR ac_res IN
                SELECT DISTINCT coalesce(rd.resource_id, s.resource_id) AS resource_id
                FROM public.submissions s
                FULL OUTER JOIN public.resource_data rd ON rd.resource_id = s.resource_id
                LEFT JOIN public.learning_module lm ON rd.learning_module_id = lm.learning_module_id
                WHERE (
                    lower(trim(coalesce(lm.course_name, ''))) ILIKE '%ac%'
                    OR lower(trim(coalesce(lm.module_name, ''))) ILIKE '%ac%'
                    OR lower(trim(coalesce(lm.unit_name, ''))) ILIKE '%ac%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%ac%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%abdomen%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%abdominal%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%ac%'
                )
                AND (
                    lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%find%image%'
                    OR s.question_type = 'type1'
                    OR (
                        lower(trim(coalesce(rd.resource_type, ''))) IN ('interpret', 'image interpretation')
                        AND lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%find%'
                    )
                )
                AND coalesce(rd.resource_id, s.resource_id) IS NOT NULL
                AND coalesce(rd.resource_id, s.resource_id) <> 'e196c6db-dc0b-4ebd-93b2-10a2125188e5'::uuid
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%femur%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%femur%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%femur%'
            LOOP
                INSERT INTO public.mind_spark_questions
                    (resource_id, mindspark_no, question_no, question_type, prompt, options, correct_answer, feedback_correct, feedback_wrong, is_active, updated_at)
                VALUES
                    (ac_res.resource_id, 1, 1, 'type1',
                     'Which among the given planes are used to measure AC?',
                     '[{"key":"A","value":"1","text":"Both A & C"},{"key":"B","value":"2","text":"Both B & D"},{"key":"C","value":"3","text":"Only C"},{"key":"D","value":"4","text":"None of the above"}]'::jsonb,
                     '{"key":"A","value":"Both A & C","answer":"A. (Both A & C)"}'::jsonb,
                     'Well done! A and C represent the correct transverse abdominal planes for AC measurement.',
                     'Incorrect! Both A and C show the standard AC measurement view with symmetrical appearance and correct landmarks.',
                     true, now()),
                    (ac_res.resource_id, 1, 2, 'type1',
                     'Choose the correct option for measuring AC',
                     '[{"key":"A","value":"1","text":"Both A & D"},{"key":"B","value":"2","text":"Only B"},{"key":"C","value":"3","text":"Both B & D"},{"key":"D","value":"4","text":"None of the above"}]'::jsonb,
                     '{"key":"B","value":"Only B","answer":"B. (Only B)"}'::jsonb,
                     'Perfect! You accurately selected image B — it displays the proper transverse view for measuring the fetal abdominal circumference.',
                     'Incorrect! The selected image does not represent the correct AC measurement plane. If they select None of the above: Your selection is incorrect. The correct AC plane present in B.',
                     true, now()),
                    (ac_res.resource_id, 1, 3, 'type1',
                     'Select among the given planes are used to measure AC?',
                     '[{"key":"A","value":"1","text":"A"},{"key":"B","value":"2","text":"B"},{"key":"C","value":"3","text":"C"},{"key":"D","value":"4","text":"D"}]'::jsonb,
                     '{"key":"C","value":"C","answer":"C"}'::jsonb,
                     'Well done! You identified the correct AC measurement plane that includes the stomach bubble, portal vein, ribs and cross-section of the spine.',
                     'The selected image does not represent the proper AC plane.',
                     true, now()),
                    (ac_res.resource_id, 1, 4, 'type1',
                     'Which among the given planes are used to measure AC?',
                     '[{"key":"A","value":"1","text":"A"},{"key":"B","value":"2","text":"B"},{"key":"C","value":"3","text":"C"},{"key":"D","value":"4","text":"D"}]'::jsonb,
                     '{"key":"D","value":"D","answer":"D"}'::jsonb,
                     'Good job! You correctly identified D as the AC measurement plane with the appropriate fetal abdominal landmarks.',
                     'The chosen plane is incorrect. The AC plane should include the fetal stomach and spine in a true transverse circular section of the abdomen.',
                     true, now()),
                    (ac_res.resource_id, 1, 5, 'type1',
                     'Select the correct planes for AC measurement',
                     '[{"key":"A","value":"1","text":"A"},{"key":"B","value":"2","text":"B"},{"key":"C","value":"3","text":"C"},{"key":"D","value":"4","text":"D"}]'::jsonb,
                     '{"key":"D","value":"D","answer":"D"}'::jsonb,
                     'Great work! You selected D — the correct plane for AC measurement that includes the stomach bubble and spine in a circular section.',
                     'The chosen plane is not correct.',
                     true, now()),
                    (ac_res.resource_id, 1, 6, 'type1',
                     'Watch the ultrasound video of the angulation of the probe over the fetal abdomen and find the correct timeframe revealing the transabdominal plane',
                     '[]'::jsonb,
                     '{"answer":"Transabdominal plane frame","timeframe":"Transabdominal plane","expected_timeframe":"Transabdominal plane"}'::jsonb,
                     'Perfect freeze! The image shows all the key landmarks: the stomach bubble, ribs, portal vein, and spine.',
                     'Incorrect freeze! The frozen frame lacks one or more key landmarks',
                     true, now()),
                    (ac_res.resource_id, 1, 7, 'type1',
                     'Watch the ultrasound video of the angulation of the probe over the fetal abdomen and find the correct timeframe revealing the transabdominal plane',
                     '[]'::jsonb,
                     '{"answer":"Transabdominal plane frame","timeframe":"Transabdominal plane","expected_timeframe":"Transabdominal plane"}'::jsonb,
                     'Perfect freeze! The image shows all the key landmarks: the stomach bubble, ribs, portal vein, and spine.',
                     'Incorrect freeze! The frozen frame lacks one or more key landmarks',
                     true, now()),
                    (ac_res.resource_id, 1, 8, 'type1',
                     'Watch the ultrasound video of the angulation of the probe over the fetal abdomen and find the correct timeframe revealing the transabdominal plane',
                     '[]'::jsonb,
                     '{"answer":"Transabdominal plane frame","timeframe":"Transabdominal plane","expected_timeframe":"Transabdominal plane"}'::jsonb,
                     'Perfect freeze! The image shows all the key landmarks: the stomach bubble, ribs, portal vein, and spine.',
                     'Incorrect freeze! The frozen frame lacks one or more key landmarks',
                     true, now()),
                    (ac_res.resource_id, 1, 9, 'type1',
                     'Watch the ultrasound video of the angulation of the probe over the fetal abdomen and find the correct timeframe revealing the transabdominal plane',
                     '[]'::jsonb,
                     '{"answer":"Transabdominal plane frame","timeframe":"Transabdominal plane","expected_timeframe":"Transabdominal plane"}'::jsonb,
                     'Perfect freeze! The image shows all the key landmarks: the stomach bubble, ribs, portal vein, and spine.',
                     'Incorrect freeze! The frozen frame lacks one or more key landmarks',
                     true, now()),
                    (ac_res.resource_id, 1, 10, 'type1',
                     'Watch the ultrasound video of the angulation of the probe over the fetal abdomen and find the correct timeframe revealing the transabdominal plane',
                     '[]'::jsonb,
                     '{"answer":"Transabdominal plane frame","timeframe":"Transabdominal plane","expected_timeframe":"Transabdominal plane"}'::jsonb,
                     'Perfect freeze! The image shows all the key landmarks: the stomach bubble, ribs, portal vein, and spine.',
                     'Incorrect freeze! The frozen frame lacks one or more key landmarks',
                     true, now())
                ON CONFLICT (resource_id, mindspark_no, question_no)
                DO UPDATE SET
                    prompt = EXCLUDED.prompt,
                    options = EXCLUDED.options,
                    correct_answer = EXCLUDED.correct_answer,
                    feedback_correct = EXCLUDED.feedback_correct,
                    feedback_wrong = EXCLUDED.feedback_wrong,
                    is_active = true,
                    updated_at = now();

                DELETE FROM public.mind_spark_questions
                WHERE resource_id = ac_res.resource_id AND question_no >= 11;
            END LOOP;
        END $$;

        DO $$
        DECLARE
            fl_res RECORD;
        BEGIN
            FOR fl_res IN
                SELECT DISTINCT coalesce(rd.resource_id, s.resource_id) AS resource_id
                FROM public.submissions s
                FULL OUTER JOIN public.resource_data rd ON rd.resource_id = s.resource_id
                LEFT JOIN public.learning_module lm ON rd.learning_module_id = lm.learning_module_id
                WHERE (
                    lower(trim(coalesce(lm.course_name, ''))) ILIKE '%fl%'
                    OR lower(trim(coalesce(lm.module_name, ''))) ILIKE '%fl%'
                    OR lower(trim(coalesce(lm.unit_name, ''))) ILIKE '%fl%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%fl%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%fl%'
                    OR lower(trim(coalesce(lm.course_name, ''))) ILIKE '%femur%'
                    OR lower(trim(coalesce(lm.module_name, ''))) ILIKE '%femur%'
                    OR lower(trim(coalesce(lm.unit_name, ''))) ILIKE '%femur%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%femur%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%femur%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%femoral%'
                )
                AND (
                    lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%find%image%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%freeze%'
                    OR s.question_type = 'type1'
                    OR (
                        lower(trim(coalesce(rd.resource_type, ''))) IN ('interpret', 'image interpretation')
                        AND (
                            lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%find%'
                            OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%freeze%'
                        )
                    )
                )
                AND coalesce(rd.resource_id, s.resource_id) IS NOT NULL
                AND coalesce(rd.resource_id, s.resource_id) <> 'e196c6db-dc0b-4ebd-93b2-10a2125188e5'::uuid
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%ac%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%ac%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%ac%'
            LOOP
                INSERT INTO public.mind_spark_questions
                    (resource_id, mindspark_no, question_no, question_type, prompt, options, correct_answer, feedback_correct, feedback_wrong, is_active, updated_at)
                VALUES
                    (fl_res.resource_id, 1, 1, 'type1',
                     'Select the correct planes for the Femur Length measurement',
                     '[{"key":"A","value":"1","text":"Both A & B"},{"key":"B","value":"2","text":"A, B & D"},{"key":"C","value":"3","text":"Both B & D"},{"key":"D","value":"4","text":"None of the above"}]'::jsonb,
                     '{"key":"A","value":"Both A & B","answer":"a.  Both A & B"}'::jsonb,
                     'Correct! The selected planes show the femur in proper orientation for measurement.',
                     'Not correct! Both A and B are the correct femur diaphysis.',
                     true, now()),
                    (fl_res.resource_id, 1, 2, 'type1',
                     'Select the correct planes for Femur Length(FL) measurement',
                     '[{"key":"A","value":"1","text":"Both A & D"},{"key":"B","value":"2","text":"A, B & D"},{"key":"C","value":"3","text":"A, B & C"},{"key":"D","value":"4","text":"None of the above"}]'::jsonb,
                     '{"key":"C","value":"A, B & C","answer":"c. A, B & C"}'::jsonb,
                     'Great! You selected all correct FL planes, clearly depicting the long axis of the femur suitable for accurate biometry.',
                     'Incorrect. A, B & C images represent the proper femur orientation.',
                     true, now()),
                    (fl_res.resource_id, 1, 3, 'type1',
                     'Select the correct planes for Femur Length(FL) measurement',
                     '[{"key":"A","value":"1","text":"Both A & C"},{"key":"B","value":"2","text":"Only D"},{"key":"C","value":"3","text":"Both C & D"},{"key":"D","value":"4","text":"None of the above"}]'::jsonb,
                     '{"key":"A","value":"Both A & C","answer":"a. Both A & C"}'::jsonb,
                     'Nice work! You correctly picked the planes displaying the femur in its entirety, suitable for accurate length measurement.',
                     'Incorrect selection! Both A and C are the accurate femur diaphysis length.',
                     true, now()),
                    (fl_res.resource_id, 1, 4, 'type1',
                     'Choose the correct options that contain the correct plane for  measuring Femur Length.',
                     '[{"key":"A","value":"1","text":"Both A & D"},{"key":"B","value":"2","text":"Only C"},{"key":"C","value":"3","text":"Both C & D"},{"key":"D","value":"4","text":"None of the above"}]'::jsonb,
                     '{"key":"B","value":"Only C","answer":"B Only C"}'::jsonb,
                     'Perfect! You accurately selected the correct femur plane showing a clear and complete visualization of the femoral shaft.',
                     'Incorrect. The selected planes do not show the femur. If they select None of the above: Your selection is incorrect. The correct FL planes are present in C.',
                     true, now()),
                    (fl_res.resource_id, 1, 5, 'type1',
                     'Select the correct planes for Femur Length(FL) measurement',
                     '[{"key":"A","value":"1","text":"A"},{"key":"B","value":"2","text":"B"},{"key":"C","value":"3","text":"C"},{"key":"D","value":"4","text":"D"}]'::jsonb,
                     '{"key":"A","value":"A","answer":"A"}'::jsonb,
                     'You accurately identified the correct FL plane with full femur visualization.',
                     'Incorrect choice! The selected image does not represent the proper femur orientation.',
                     true, now()),
                    (fl_res.resource_id, 1, 6, 'type1',
                     'Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane',
                     '[]'::jsonb,
                     '{"answer":"Femur plane frame","timeframe":"Femur plane","expected_timeframe":"Femur plane"}'::jsonb,
                     'Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.',
                     'Incorrect freeze! The frozen frame lacks one or more key landmarks',
                     true, now()),
                    (fl_res.resource_id, 1, 7, 'type1',
                     'Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane',
                     '[]'::jsonb,
                     '{"answer":"Femur plane frame","timeframe":"Femur plane","expected_timeframe":"Femur plane"}'::jsonb,
                     'Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.',
                     'Incorrect freeze! The frozen frame lacks one or more key landmarks',
                     true, now()),
                    (fl_res.resource_id, 1, 8, 'type1',
                     'Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane',
                     '[]'::jsonb,
                     '{"answer":"Femur plane frame","timeframe":"Femur plane","expected_timeframe":"Femur plane"}'::jsonb,
                     'Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.',
                     'Incorrect freeze! The frozen frame lacks one or more key landmarks',
                     true, now()),
                    (fl_res.resource_id, 1, 9, 'type1',
                     'Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane',
                     '[]'::jsonb,
                     '{"answer":"Femur plane frame","timeframe":"Femur plane","expected_timeframe":"Femur plane"}'::jsonb,
                     'Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.',
                     'Incorrect freeze! The frozen frame lacks one or more key landmarks',
                     true, now()),
                    (fl_res.resource_id, 1, 10, 'type1',
                     'Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane',
                     '[]'::jsonb,
                     '{"answer":"Femur plane frame","timeframe":"Femur plane","expected_timeframe":"Femur plane"}'::jsonb,
                     'Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.',
                     'Incorrect freeze! The frozen frame lacks one or more key landmarks',
                     true, now()),
                    (fl_res.resource_id, 1, 11, 'type1',
                     'Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane',
                     '[]'::jsonb,
                     '{"answer":"Femur plane frame","timeframe":"Femur plane","expected_timeframe":"Femur plane"}'::jsonb,
                     'Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.',
                     'Incorrect freeze! The frozen frame lacks one or more key landmarks',
                     true, now()),
                    (fl_res.resource_id, 1, 12, 'type1',
                     'Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane',
                     '[]'::jsonb,
                     '{"answer":"Femur plane frame","timeframe":"Femur plane","expected_timeframe":"Femur plane"}'::jsonb,
                     'Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.',
                     'Incorrect freeze! The frozen frame lacks one or more key landmarks',
                     true, now()),
                    (fl_res.resource_id, 1, 13, 'type1',
                     'Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane',
                     '[]'::jsonb,
                     '{"answer":"Femur plane frame","timeframe":"Femur plane","expected_timeframe":"Femur plane"}'::jsonb,
                     'Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.',
                     'Incorrect freeze! The frozen frame lacks one or more key landmarks',
                     true, now()),
                    (fl_res.resource_id, 1, 14, 'type1',
                     'Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane',
                     '[]'::jsonb,
                     '{"answer":"Femur plane frame","timeframe":"Femur plane","expected_timeframe":"Femur plane"}'::jsonb,
                     'Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.',
                     'Incorrect freeze! The frozen frame lacks one or more key landmarks',
                     true, now()),
                    (fl_res.resource_id, 1, 15, 'type1',
                     'Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane',
                     '[]'::jsonb,
                     '{"answer":"Femur plane frame","timeframe":"Femur plane","expected_timeframe":"Femur plane"}'::jsonb,
                     'Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.',
                     'Incorrect freeze! The frozen frame lacks one or more key landmarks',
                     true, now())
                ON CONFLICT (resource_id, mindspark_no, question_no)
                DO UPDATE SET
                    prompt = EXCLUDED.prompt,
                    options = EXCLUDED.options,
                    correct_answer = EXCLUDED.correct_answer,
                    feedback_correct = EXCLUDED.feedback_correct,
                    feedback_wrong = EXCLUDED.feedback_wrong,
                    is_active = true,
                    updated_at = now();

                DELETE FROM public.mind_spark_questions
                WHERE resource_id = fl_res.resource_id AND question_no >= 16;
            END LOOP;
        END $$;

        DO $$
        DECLARE
            bpd_annot_res RECORD;
        BEGIN
            FOR bpd_annot_res IN
                SELECT DISTINCT coalesce(rd.resource_id, s.resource_id) AS resource_id
                FROM public.submissions s
                FULL OUTER JOIN public.resource_data rd ON rd.resource_id = s.resource_id
                LEFT JOIN public.learning_module lm ON rd.learning_module_id = lm.learning_module_id
                WHERE (
                    lower(trim(coalesce(lm.course_name, ''))) ILIKE '%bpd%'
                    OR lower(trim(coalesce(lm.module_name, ''))) ILIKE '%bpd%'
                    OR lower(trim(coalesce(lm.unit_name, ''))) ILIKE '%bpd%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%bpd%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%bpd%'
                    OR lower(trim(coalesce(lm.course_name, ''))) ILIKE '%head%'
                    OR lower(trim(coalesce(lm.module_name, ''))) ILIKE '%head%'
                    OR lower(trim(coalesce(lm.unit_name, ''))) ILIKE '%head%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%head%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%head%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%transthalamic%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%transthalamic%'
                    OR s.question_type = 'annotation1'
                )
                AND (
                    lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%drag%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation 1%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation: drag%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation%drag%'
                    OR (
                        lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation%'
                        AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%label%'
                        AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%2%'
                    )
                    OR s.question_type = 'annotation1'
                )
                AND coalesce(rd.resource_id, s.resource_id) IS NOT NULL
                AND coalesce(rd.resource_id, s.resource_id) <> 'e196c6db-dc0b-4ebd-93b2-10a2125188e5'::uuid
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%ac%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%ac%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%ac%'
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%femur%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%femur%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%femur%'
            LOOP
                INSERT INTO public.mind_spark_questions
                    (resource_id, mindspark_no, question_no, question_type, prompt, options, correct_answer, feedback_correct, feedback_wrong, metadata, is_active, updated_at)
                VALUES
                    (bpd_annot_res.resource_id, 1, 1, 'annotation1',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"],"answer":"Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"}'::jsonb,
                     E'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transthalamic plane.\nThe expected landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     E'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transthalamic plane and understand the key landmarks.\nThe correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     '{"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"]}'::jsonb,
                     true, now()),
                    (bpd_annot_res.resource_id, 1, 2, 'annotation1',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"],"answer":"Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"}'::jsonb,
                     E'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transthalamic plane.\nThe expected landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     E'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transthalamic plane and understand the key landmarks.\nThe correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     '{"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"]}'::jsonb,
                     true, now()),
                    (bpd_annot_res.resource_id, 1, 3, 'annotation1',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"],"answer":"Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"}'::jsonb,
                     E'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transthalamic plane.\nThe expected landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     E'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transthalamic plane and understand the key landmarks.\nThe correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     '{"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"]}'::jsonb,
                     true, now()),
                    (bpd_annot_res.resource_id, 1, 4, 'annotation1',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"],"answer":"Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"}'::jsonb,
                     E'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transthalamic plane.\nThe expected landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     E'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transthalamic plane and understand the key landmarks.\nThe correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     '{"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"]}'::jsonb,
                     true, now()),
                    (bpd_annot_res.resource_id, 1, 5, 'annotation1',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"],"answer":"Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"}'::jsonb,
                     E'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transthalamic plane.\nThe expected landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     E'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transthalamic plane and understand the key landmarks.\nThe correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     '{"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"]}'::jsonb,
                     true, now())
                ON CONFLICT (resource_id, mindspark_no, question_no)
                DO UPDATE SET
                    question_type = EXCLUDED.question_type,
                    prompt = EXCLUDED.prompt,
                    options = EXCLUDED.options,
                    correct_answer = EXCLUDED.correct_answer,
                    feedback_correct = EXCLUDED.feedback_correct,
                    feedback_wrong = EXCLUDED.feedback_wrong,
                    metadata = EXCLUDED.metadata,
                    is_active = true,
                    updated_at = now();

                DELETE FROM public.mind_spark_questions
                WHERE resource_id = bpd_annot_res.resource_id AND question_no >= 6;
            END LOOP;
        END $$;

        DO $$
        DECLARE
            bpd_annot2_res RECORD;
        BEGIN
            FOR bpd_annot2_res IN
                SELECT DISTINCT coalesce(rd.resource_id, s.resource_id) AS resource_id
                FROM public.submissions s
                FULL OUTER JOIN public.resource_data rd ON rd.resource_id = s.resource_id
                LEFT JOIN public.learning_module lm ON rd.learning_module_id = lm.learning_module_id
                WHERE (
                    lower(trim(coalesce(lm.course_name, ''))) ILIKE '%bpd%'
                    OR lower(trim(coalesce(lm.module_name, ''))) ILIKE '%bpd%'
                    OR lower(trim(coalesce(lm.unit_name, ''))) ILIKE '%bpd%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%bpd%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%bpd%'
                    OR lower(trim(coalesce(lm.course_name, ''))) ILIKE '%head%'
                    OR lower(trim(coalesce(lm.module_name, ''))) ILIKE '%head%'
                    OR lower(trim(coalesce(lm.unit_name, ''))) ILIKE '%head%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%head%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%head%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%transthalamic%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%transthalamic%'
                    OR s.question_type = 'annotation2'
                )
                AND (
                    lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%label%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation 2%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation: label%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation%label%'
                    OR s.question_type = 'annotation2'
                )
                AND coalesce(rd.resource_id, s.resource_id) IS NOT NULL
                AND coalesce(rd.resource_id, s.resource_id) <> 'e196c6db-dc0b-4ebd-93b2-10a2125188e5'::uuid
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%ac%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%ac%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%ac%'
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%femur%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%femur%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%femur%'
            LOOP
                INSERT INTO public.mind_spark_questions
                    (resource_id, mindspark_no, question_no, question_type, prompt, options, correct_answer, feedback_correct, feedback_wrong, metadata, is_active, updated_at)
                VALUES
                    (bpd_annot2_res.resource_id, 1, 1, 'annotation2',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"],"answer":"Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"}'::jsonb,
                     E'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transthalamic plane. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     E'Your annotations are WRONG!\nOops! None of the labelling was done! \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     '{"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"]}'::jsonb,
                     true, now()),
                    (bpd_annot2_res.resource_id, 1, 2, 'annotation2',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"],"answer":"Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"}'::jsonb,
                     E'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transthalamic plane. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     E'Your annotations are WRONG!\nOops! None of the labelling was done! \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     '{"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"]}'::jsonb,
                     true, now()),
                    (bpd_annot2_res.resource_id, 1, 3, 'annotation2',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"],"answer":"Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"}'::jsonb,
                     E'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transthalamic plane. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     E'Your annotations are WRONG!\nOops! None of the labelling was done! \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     '{"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"]}'::jsonb,
                     true, now()),
                    (bpd_annot2_res.resource_id, 1, 4, 'annotation2',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"],"answer":"Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"}'::jsonb,
                     E'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transthalamic plane. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     E'Your annotations are WRONG!\nOops! None of the labelling was done! \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     '{"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"]}'::jsonb,
                     true, now()),
                    (bpd_annot2_res.resource_id, 1, 5, 'annotation2',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"],"answer":"Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"}'::jsonb,
                     E'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transthalamic plane. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     E'Your annotations are WRONG!\nOops! None of the labelling was done! \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                     '{"expected_landmarks":["Arrow Sign","Midline Falx","Thalamus","CSP","Cranium"]}'::jsonb,
                     true, now())
                ON CONFLICT (resource_id, mindspark_no, question_no)
                DO UPDATE SET
                    question_type = EXCLUDED.question_type,
                    prompt = EXCLUDED.prompt,
                    options = EXCLUDED.options,
                    correct_answer = EXCLUDED.correct_answer,
                    feedback_correct = EXCLUDED.feedback_correct,
                    feedback_wrong = EXCLUDED.feedback_wrong,
                    metadata = EXCLUDED.metadata,
                    is_active = true,
                    updated_at = now();

                DELETE FROM public.mind_spark_questions
                WHERE resource_id = bpd_annot2_res.resource_id AND question_no >= 6;
            END LOOP;
        END $$;

        DO $$
        DECLARE
            ac_annot_res RECORD;
        BEGIN
            FOR ac_annot_res IN
                SELECT DISTINCT coalesce(rd.resource_id, s.resource_id) AS resource_id
                FROM public.submissions s
                FULL OUTER JOIN public.resource_data rd ON rd.resource_id = s.resource_id
                LEFT JOIN public.learning_module lm ON rd.learning_module_id = lm.learning_module_id
                WHERE (
                    lower(trim(coalesce(lm.course_name, ''))) ILIKE '%ac%'
                    OR lower(trim(coalesce(lm.module_name, ''))) ILIKE '%ac%'
                    OR lower(trim(coalesce(lm.unit_name, ''))) ILIKE '%ac%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%ac%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%abdomen%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%abdominal%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%ac%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%abdomen%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%abdominal%'
                )
                AND (
                    lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%drag%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation 1%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation: drag%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation%drag%'
                    OR (
                        lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation%'
                        AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%label%'
                        AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%2%'
                    )
                    OR s.question_type = 'annotation1'
                )
                AND coalesce(rd.resource_id, s.resource_id) IS NOT NULL
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%femur%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%femur%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%femur%'
            LOOP
                INSERT INTO public.mind_spark_questions
                    (resource_id, mindspark_no, question_no, question_type, prompt, options, correct_answer, feedback_correct, feedback_wrong, metadata, is_active, updated_at)
                VALUES
                    (ac_annot_res.resource_id, 1, 1, 'annotation1',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"],"answer":"Rib 1, Rib 2, Stomach bubble, Spine, Portal vein"}'::jsonb,
                     E'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the abdominal plane.\nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     E'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the abdominal plane and understand the key landmarks.\nThe correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     '{"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"]}'::jsonb,
                     true, now()),
                    (ac_annot_res.resource_id, 1, 2, 'annotation1',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"],"answer":"Rib 1, Rib 2, Stomach bubble, Spine, Portal vein"}'::jsonb,
                     E'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the abdominal plane.\nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     E'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the abdominal plane and understand the key landmarks.\nThe correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     '{"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"]}'::jsonb,
                     true, now()),
                    (ac_annot_res.resource_id, 1, 3, 'annotation1',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"],"answer":"Rib 1, Rib 2, Stomach bubble, Spine, Portal vein"}'::jsonb,
                     E'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the abdominal plane.\nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     E'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the abdominal plane and understand the key landmarks.\nThe correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     '{"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"]}'::jsonb,
                     true, now()),
                    (ac_annot_res.resource_id, 1, 4, 'annotation1',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"],"answer":"Rib 1, Rib 2, Stomach bubble, Spine, Portal vein"}'::jsonb,
                     E'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the abdominal plane.\nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     E'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the abdominal plane and understand the key landmarks.\nThe correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     '{"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"]}'::jsonb,
                     true, now()),
                    (ac_annot_res.resource_id, 1, 5, 'annotation1',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"],"answer":"Rib 1, Rib 2, Stomach bubble, Spine, Portal vein"}'::jsonb,
                     E'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the abdominal plane.\nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     E'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the abdominal plane and understand the key landmarks.\nThe correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     '{"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"]}'::jsonb,
                     true, now())
                ON CONFLICT (resource_id, mindspark_no, question_no)
                DO UPDATE SET
                    question_type = EXCLUDED.question_type,
                    prompt = EXCLUDED.prompt,
                    options = EXCLUDED.options,
                    correct_answer = EXCLUDED.correct_answer,
                    feedback_correct = EXCLUDED.feedback_correct,
                    feedback_wrong = EXCLUDED.feedback_wrong,
                    metadata = EXCLUDED.metadata,
                    is_active = true,
                    updated_at = now();

                DELETE FROM public.mind_spark_questions
                WHERE resource_id = ac_annot_res.resource_id AND question_no >= 6;
            END LOOP;
        END $$;

        DO $$
        DECLARE
            ac_annot2_res RECORD;
        BEGIN
            FOR ac_annot2_res IN
                SELECT DISTINCT coalesce(rd.resource_id, s.resource_id) AS resource_id
                FROM public.submissions s
                FULL OUTER JOIN public.resource_data rd ON rd.resource_id = s.resource_id
                LEFT JOIN public.learning_module lm ON rd.learning_module_id = lm.learning_module_id
                WHERE (
                    lower(trim(coalesce(lm.course_name, ''))) ILIKE '%ac%'
                    OR lower(trim(coalesce(lm.module_name, ''))) ILIKE '%ac%'
                    OR lower(trim(coalesce(lm.unit_name, ''))) ILIKE '%ac%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%ac%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%abdomen%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%abdominal%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%ac%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%abdomen%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%abdominal%'
                    OR s.question_type = 'annotation2'
                )
                AND (
                    lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%label%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation 2%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation: label%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation%label%'
                    OR s.question_type = 'annotation2'
                )
                AND coalesce(rd.resource_id, s.resource_id) IS NOT NULL
                AND coalesce(rd.resource_id, s.resource_id) <> 'e196c6db-dc0b-4ebd-93b2-10a2125188e5'::uuid
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%head%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%head%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%head%'
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%femur%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%femur%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%femur%'
            LOOP
                INSERT INTO public.mind_spark_questions
                    (resource_id, mindspark_no, question_no, question_type, prompt, options, correct_answer, feedback_correct, feedback_wrong, metadata, is_active, updated_at)
                VALUES
                    (ac_annot2_res.resource_id, 1, 1, 'annotation2',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"],"answer":"Rib 1, Rib 2, Stomach bubble, Spine, Portal vein"}'::jsonb,
                     E'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the abdominal plane. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     E'Your annotations are WRONG! \nOops! None of the labelling was done! \nRefer to the annotated reference image of the abdominal plane and label the key landmarks. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     '{"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"]}'::jsonb,
                     true, now()),
                    (ac_annot2_res.resource_id, 1, 2, 'annotation2',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"],"answer":"Rib 1, Rib 2, Stomach bubble, Spine, Portal vein"}'::jsonb,
                     E'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the abdominal plane. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     E'Your annotations are WRONG! \nOops! None of the labelling was done! \nRefer to the annotated reference image of the abdominal plane and label the key landmarks. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     '{"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"]}'::jsonb,
                     true, now()),
                    (ac_annot2_res.resource_id, 1, 3, 'annotation2',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"],"answer":"Rib 1, Rib 2, Stomach bubble, Spine, Portal vein"}'::jsonb,
                     E'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the abdominal plane. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     E'Your annotations are WRONG! \nOops! None of the labelling was done! \nRefer to the annotated reference image of the abdominal plane and label the key landmarks. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     '{"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"]}'::jsonb,
                     true, now()),
                    (ac_annot2_res.resource_id, 1, 4, 'annotation2',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"],"answer":"Rib 1, Rib 2, Stomach bubble, Spine, Portal vein"}'::jsonb,
                     E'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the abdominal plane. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     E'Your annotations are WRONG! \nOops! None of the labelling was done! \nRefer to the annotated reference image of the abdominal plane and label the key landmarks. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     '{"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"]}'::jsonb,
                     true, now()),
                    (ac_annot2_res.resource_id, 1, 5, 'annotation2',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":5,"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"],"answer":"Rib 1, Rib 2, Stomach bubble, Spine, Portal vein"}'::jsonb,
                     E'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the abdominal plane. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     E'Your annotations are WRONG! \nOops! None of the labelling was done! \nRefer to the annotated reference image of the abdominal plane and label the key landmarks. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                     '{"expected_landmarks":["Rib 1","Rib 2","Stomach bubble","Spine","Portal vein"]}'::jsonb,
                     true, now())
                ON CONFLICT (resource_id, mindspark_no, question_no)
                DO UPDATE SET
                    question_type = EXCLUDED.question_type,
                    prompt = EXCLUDED.prompt,
                    options = EXCLUDED.options,
                    correct_answer = EXCLUDED.correct_answer,
                    feedback_correct = EXCLUDED.feedback_correct,
                    feedback_wrong = EXCLUDED.feedback_wrong,
                    metadata = EXCLUDED.metadata,
                    is_active = true,
                    updated_at = now();

                DELETE FROM public.mind_spark_questions
                WHERE resource_id = ac_annot2_res.resource_id AND question_no >= 6;
            END LOOP;
        END $$;

        DO $$
        DECLARE
            fl_annot_res RECORD;
        BEGIN
            FOR fl_annot_res IN
                SELECT DISTINCT coalesce(rd.resource_id, s.resource_id) AS resource_id
                FROM public.submissions s
                FULL OUTER JOIN public.resource_data rd ON rd.resource_id = s.resource_id
                LEFT JOIN public.learning_module lm ON rd.learning_module_id = lm.learning_module_id
                WHERE (
                    lower(trim(coalesce(lm.course_name, ''))) ILIKE '%fl%'
                    OR lower(trim(coalesce(lm.module_name, ''))) ILIKE '%fl%'
                    OR lower(trim(coalesce(lm.unit_name, ''))) ILIKE '%fl%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%fl%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%fl%'
                    OR lower(trim(coalesce(lm.course_name, ''))) ILIKE '%femur%'
                    OR lower(trim(coalesce(lm.module_name, ''))) ILIKE '%femur%'
                    OR lower(trim(coalesce(lm.unit_name, ''))) ILIKE '%femur%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%femur%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%femur%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%femoral%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%transfemoral%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%transfemoral%'
                )
                AND (
                    lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%drag%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation 1%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation: drag%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation%drag%'
                    OR (
                        lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation%'
                        AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%label%'
                        AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%2%'
                    )
                    OR s.question_type = 'annotation1'
                )
                AND coalesce(rd.resource_id, s.resource_id) IS NOT NULL
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%ac%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%ac%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%ac%'
            LOOP
                INSERT INTO public.mind_spark_questions
                    (resource_id, mindspark_no, question_no, question_type, prompt, options, correct_answer, feedback_correct, feedback_wrong, metadata, is_active, updated_at)
                VALUES
                    (fl_annot_res.resource_id, 1, 1, 'annotation1',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":2,"expected_landmarks":["Diaphysis","Metaphysis"],"answer":"Diaphysis and Metaphysis"}'::jsonb,
                     E'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transfemoral plane.\nThe expected landmarks to be labelled are Diaphysis and Metaphysis.',
                     E'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane and understand the key landmarks.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.',
                     '{"expected_landmarks":["Diaphysis","Metaphysis"]}'::jsonb,
                     true, now()),
                    (fl_annot_res.resource_id, 1, 2, 'annotation1',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":2,"expected_landmarks":["Diaphysis","Metaphysis"],"answer":"Diaphysis and Metaphysis"}'::jsonb,
                     E'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transfemoral plane.\nThe expected landmarks to be labelled are Diaphysis and Metaphysis.',
                     E'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane and understand the key landmarks.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.',
                     '{"expected_landmarks":["Diaphysis","Metaphysis"]}'::jsonb,
                     true, now()),
                    (fl_annot_res.resource_id, 1, 3, 'annotation1',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":2,"expected_landmarks":["Diaphysis","Metaphysis"],"answer":"Diaphysis and Metaphysis"}'::jsonb,
                     E'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transfemoral plane.\nThe expected landmarks to be labelled are Diaphysis and Metaphysis.',
                     E'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane and understand the key landmarks.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.',
                     '{"expected_landmarks":["Diaphysis","Metaphysis"]}'::jsonb,
                     true, now()),
                    (fl_annot_res.resource_id, 1, 4, 'annotation1',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":2,"expected_landmarks":["Diaphysis","Metaphysis"],"answer":"Diaphysis and Metaphysis"}'::jsonb,
                     E'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transfemoral plane.\nThe expected landmarks to be labelled are Diaphysis and Metaphysis.',
                     E'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane and understand the key landmarks.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.',
                     '{"expected_landmarks":["Diaphysis","Metaphysis"]}'::jsonb,
                     true, now()),
                    (fl_annot_res.resource_id, 1, 5, 'annotation1',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":2,"expected_landmarks":["Diaphysis","Metaphysis"],"answer":"Diaphysis and Metaphysis"}'::jsonb,
                     E'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transfemoral plane.\nThe expected landmarks to be labelled are Diaphysis and Metaphysis.',
                     E'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane and understand the key landmarks.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.',
                     '{"expected_landmarks":["Diaphysis","Metaphysis"]}'::jsonb,
                     true, now())
                ON CONFLICT (resource_id, mindspark_no, question_no)
                DO UPDATE SET
                    question_type = EXCLUDED.question_type,
                    prompt = EXCLUDED.prompt,
                    options = EXCLUDED.options,
                    correct_answer = EXCLUDED.correct_answer,
                    feedback_correct = EXCLUDED.feedback_correct,
                    feedback_wrong = EXCLUDED.feedback_wrong,
                    metadata = EXCLUDED.metadata,
                    is_active = true,
                    updated_at = now();

                DELETE FROM public.mind_spark_questions
                WHERE resource_id = fl_annot_res.resource_id AND question_no >= 6;
            END LOOP;
        END $$;

        DO $$
        DECLARE
            fl_annot2_res RECORD;
        BEGIN
            FOR fl_annot2_res IN
                SELECT DISTINCT coalesce(rd.resource_id, s.resource_id) AS resource_id
                FROM public.submissions s
                FULL OUTER JOIN public.resource_data rd ON rd.resource_id = s.resource_id
                LEFT JOIN public.learning_module lm ON rd.learning_module_id = lm.learning_module_id
                WHERE (
                    lower(trim(coalesce(lm.course_name, ''))) ILIKE '%fl%'
                    OR lower(trim(coalesce(lm.module_name, ''))) ILIKE '%fl%'
                    OR lower(trim(coalesce(lm.unit_name, ''))) ILIKE '%fl%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%fl%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%fl%'
                    OR lower(trim(coalesce(lm.course_name, ''))) ILIKE '%femur%'
                    OR lower(trim(coalesce(lm.module_name, ''))) ILIKE '%femur%'
                    OR lower(trim(coalesce(lm.unit_name, ''))) ILIKE '%femur%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%femur%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%femur%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%femoral%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%transfemoral%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%transfemoral%'
                    OR s.question_type = 'annotation2'
                )
                AND (
                    lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%label%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation 2%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation: label%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%annotation%label%'
                    OR s.question_type = 'annotation2'
                )
                AND coalesce(rd.resource_id, s.resource_id) IS NOT NULL
                AND coalesce(rd.resource_id, s.resource_id) <> 'e196c6db-dc0b-4ebd-93b2-10a2125188e5'::uuid
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%head%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%head%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%head%'
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%ac%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%ac%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%ac%'
            LOOP
                INSERT INTO public.mind_spark_questions
                    (resource_id, mindspark_no, question_no, question_type, prompt, options, correct_answer, feedback_correct, feedback_wrong, metadata, is_active, updated_at)
                VALUES
                    (fl_annot2_res.resource_id, 1, 1, 'annotation2',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":2,"expected_landmarks":["Diaphysis","Metaphysis"],"answer":"Diaphysis and Metaphysis"}'::jsonb,
                     E'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transfemoral plane. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis.',
                     E'Your annotations are WRONG! \nOops! None of the labelling was done! \nRefer to the annotated reference image of the transfemoral plane and label the key landmarks. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis.',
                     '{"expected_landmarks":["Diaphysis","Metaphysis"]}'::jsonb,
                     true, now()),
                    (fl_annot2_res.resource_id, 1, 2, 'annotation2',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":2,"expected_landmarks":["Diaphysis","Metaphysis"],"answer":"Diaphysis and Metaphysis"}'::jsonb,
                     E'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transfemoral plane. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis.',
                     E'Your annotations are WRONG! \nOops! None of the labelling was done! \nRefer to the annotated reference image of the transfemoral plane and label the key landmarks. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis.',
                     '{"expected_landmarks":["Diaphysis","Metaphysis"]}'::jsonb,
                     true, now()),
                    (fl_annot2_res.resource_id, 1, 3, 'annotation2',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":2,"expected_landmarks":["Diaphysis","Metaphysis"],"answer":"Diaphysis and Metaphysis"}'::jsonb,
                     E'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transfemoral plane. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis.',
                     E'Your annotations are WRONG! \nOops! None of the labelling was done! \nRefer to the annotated reference image of the transfemoral plane and label the key landmarks. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis.',
                     '{"expected_landmarks":["Diaphysis","Metaphysis"]}'::jsonb,
                     true, now()),
                    (fl_annot2_res.resource_id, 1, 4, 'annotation2',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":2,"expected_landmarks":["Diaphysis","Metaphysis"],"answer":"Diaphysis and Metaphysis"}'::jsonb,
                     E'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transfemoral plane. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis.',
                     E'Your annotations are WRONG! \nOops! None of the labelling was done! \nRefer to the annotated reference image of the transfemoral plane and label the key landmarks. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis.',
                     '{"expected_landmarks":["Diaphysis","Metaphysis"]}'::jsonb,
                     true, now()),
                    (fl_annot2_res.resource_id, 1, 5, 'annotation2',
                     'Label the correct anatomical parts in the image',
                     '[]'::jsonb,
                     '{"expected_label_count":2,"expected_landmarks":["Diaphysis","Metaphysis"],"answer":"Diaphysis and Metaphysis"}'::jsonb,
                     E'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transfemoral plane. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis.',
                     E'Your annotations are WRONG! \nOops! None of the labelling was done! \nRefer to the annotated reference image of the transfemoral plane and label the key landmarks. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis.',
                     '{"expected_landmarks":["Diaphysis","Metaphysis"]}'::jsonb,
                     true, now())
                ON CONFLICT (resource_id, mindspark_no, question_no)
                DO UPDATE SET
                    question_type = EXCLUDED.question_type,
                    prompt = EXCLUDED.prompt,
                    options = EXCLUDED.options,
                    correct_answer = EXCLUDED.correct_answer,
                    feedback_correct = EXCLUDED.feedback_correct,
                    feedback_wrong = EXCLUDED.feedback_wrong,
                    metadata = EXCLUDED.metadata,
                    is_active = true,
                    updated_at = now();

                DELETE FROM public.mind_spark_questions
                WHERE resource_id = fl_annot2_res.resource_id AND question_no >= 6;
            END LOOP;
        END $$;

        DO $$
        DECLARE
            bpd_meas_res RECORD;
        BEGIN
            FOR bpd_meas_res IN
                SELECT DISTINCT coalesce(rd.resource_id, s.resource_id) AS resource_id
                FROM public.submissions s
                FULL OUTER JOIN public.resource_data rd ON rd.resource_id = s.resource_id
                LEFT JOIN public.learning_module lm ON rd.learning_module_id = lm.learning_module_id
                WHERE (
                    lower(trim(coalesce(lm.course_name, ''))) ILIKE '%bpd%'
                    OR lower(trim(coalesce(lm.module_name, ''))) ILIKE '%bpd%'
                    OR lower(trim(coalesce(lm.unit_name, ''))) ILIKE '%bpd%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%bpd%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%bpd%'
                    OR lower(trim(coalesce(lm.course_name, ''))) ILIKE '%head%'
                    OR lower(trim(coalesce(lm.module_name, ''))) ILIKE '%head%'
                    OR lower(trim(coalesce(lm.unit_name, ''))) ILIKE '%head%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%head%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%head%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%transthalamic%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%transthalamic%'
                    OR s.question_type = 'measurement'
                )
                AND (
                    lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%measure%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%measure%'
                    OR s.question_type = 'measurement'
                )
                AND coalesce(rd.resource_id, s.resource_id) IS NOT NULL
                AND coalesce(rd.resource_id, s.resource_id) <> 'e196c6db-dc0b-4ebd-93b2-10a2125188e5'::uuid
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%ac%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%ac%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%ac%'
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%femur%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%femur%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%femur%'
            LOOP
                INSERT INTO public.mind_spark_questions
                    (resource_id, mindspark_no, question_no, question_type, prompt, options, correct_answer, feedback_correct, feedback_wrong, metadata, is_active, updated_at)
                VALUES
                    (bpd_meas_res.resource_id, 1, 1, 'measurement',
                     'Place the caliper and measure the Biparietal diameter and interpret the values, given the gestational age for each case.',
                     '[]'::jsonb,
                     '{"answer":"Normal BPD","measurement_type":"BPD","method":"caliper"}'::jsonb,
                     E'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct.',
                     E'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"BPD","method":"caliper"}'::jsonb,
                     true, now()),
                    (bpd_meas_res.resource_id, 1, 2, 'measurement',
                     'Place the caliper and measure the Biparietal diameter and interpret the values, given the gestational age for each case.',
                     '[]'::jsonb,
                     '{"answer":"Normal BPD","measurement_type":"BPD","method":"caliper"}'::jsonb,
                     E'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct.',
                     E'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"BPD","method":"caliper"}'::jsonb,
                     true, now()),
                    (bpd_meas_res.resource_id, 1, 3, 'measurement',
                     'Place the caliper and measure the Biparietal diameter and interpret the values, given the gestational age for each case.',
                     '[]'::jsonb,
                     '{"answer":"Normal BPD","measurement_type":"BPD","method":"caliper"}'::jsonb,
                     E'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct.',
                     E'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"BPD","method":"caliper"}'::jsonb,
                     true, now()),
                    (bpd_meas_res.resource_id, 1, 4, 'measurement',
                     'Place the caliper and measure the Biparietal diameter and interpret the values, given the gestational age for each case.',
                     '[]'::jsonb,
                     '{"answer":"Normal BPD","measurement_type":"BPD","method":"caliper"}'::jsonb,
                     E'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct.',
                     E'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"BPD","method":"caliper"}'::jsonb,
                     true, now()),
                    (bpd_meas_res.resource_id, 1, 5, 'measurement',
                     'Place the caliper and measure the Biparietal diameter and interpret the values, given the gestational age for each case.',
                     '[]'::jsonb,
                     '{"answer":"Normal BPD","measurement_type":"BPD","method":"caliper"}'::jsonb,
                     E'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct.',
                     E'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"BPD","method":"caliper"}'::jsonb,
                     true, now()),
                    (bpd_meas_res.resource_id, 1, 6, 'measurement',
                     'Place the caliper and measure the Head circumference by measuring  BPD and OFD, and interpret the values given the gestational age given in each case.',
                     '[]'::jsonb,
                     '{"answer":"Normal HC","measurement_type":"HC","method":"caliper_bpd_ofd"}'::jsonb,
                     E'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct.',
                     E'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"HC","method":"caliper_bpd_ofd"}'::jsonb,
                     true, now()),
                    (bpd_meas_res.resource_id, 1, 7, 'measurement',
                     'Place the caliper and measure the Head circumference by measuring  BPD and OFD, and interpret the values given the gestational age given in each case.',
                     '[]'::jsonb,
                     '{"answer":"Normal HC","measurement_type":"HC","method":"caliper_bpd_ofd"}'::jsonb,
                     E'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct.',
                     E'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"HC","method":"caliper_bpd_ofd"}'::jsonb,
                     true, now()),
                    (bpd_meas_res.resource_id, 1, 8, 'measurement',
                     'Place the caliper and measure the Head circumference by measuring  BPD and OFD, and interpret the values given the gestational age given in each case.',
                     '[]'::jsonb,
                     '{"answer":"Normal HC","measurement_type":"HC","method":"caliper_bpd_ofd"}'::jsonb,
                     E'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct.',
                     E'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"HC","method":"caliper_bpd_ofd"}'::jsonb,
                     true, now()),
                    (bpd_meas_res.resource_id, 1, 9, 'measurement',
                     'Place the caliper and measure the Head circumference by measuring  BPD and OFD, and interpret the values given the gestational age given in each case.',
                     '[]'::jsonb,
                     '{"answer":"Normal HC","measurement_type":"HC","method":"caliper_bpd_ofd"}'::jsonb,
                     E'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct.',
                     E'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"HC","method":"caliper_bpd_ofd"}'::jsonb,
                     true, now()),
                    (bpd_meas_res.resource_id, 1, 10, 'measurement',
                     'Place the caliper and measure the Head circumference by measuring  BPD and OFD, and interpret the values given the gestational age given in each case.',
                     '[]'::jsonb,
                     '{"answer":"Normal HC","measurement_type":"HC","method":"caliper_bpd_ofd"}'::jsonb,
                     E'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct.',
                     E'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"HC","method":"caliper_bpd_ofd"}'::jsonb,
                     true, now()),
                    (bpd_meas_res.resource_id, 1, 11, 'measurement',
                     'Measure the head circumference using the ellipse method. Compare the measurement with the percentile chart to interpret it based on the given gestational age.',
                     '[]'::jsonb,
                     '{"answer":"Normal HC","measurement_type":"HC","method":"ellipse"}'::jsonb,
                     E'Excellent work! \nThe ellipse is correctly positioned along the outer border of the cranium. \nYour interpretation based on this measurement is also accurate. ',
                     E'Good attempt! \nThe ellipse is correctly placed along the outer border of the cranium; however, the interpretation is incorrect. \nAccording to standard biometry charts, HC values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"HC","method":"ellipse"}'::jsonb,
                     true, now()),
                    (bpd_meas_res.resource_id, 1, 12, 'measurement',
                     'Measure the head circumference using the ellipse method. Compare the measurement with the percentile chart to interpret it based on the given gestational age.',
                     '[]'::jsonb,
                     '{"answer":"Normal HC","measurement_type":"HC","method":"ellipse"}'::jsonb,
                     E'Excellent work! \nThe ellipse is correctly positioned along the outer border of the cranium. \nYour interpretation based on this measurement is also accurate. ',
                     E'Good attempt! \nThe ellipse is correctly placed along the outer border of the cranium; however, the interpretation is incorrect. \nAccording to standard biometry charts, HC values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"HC","method":"ellipse"}'::jsonb,
                     true, now()),
                    (bpd_meas_res.resource_id, 1, 13, 'measurement',
                     'Measure the head circumference using the ellipse method. Compare the measurement with the percentile chart to interpret it based on the given gestational age.',
                     '[]'::jsonb,
                     '{"answer":"Normal HC","measurement_type":"HC","method":"ellipse"}'::jsonb,
                     E'Excellent work! \nThe ellipse is correctly positioned along the outer border of the cranium. \nYour interpretation based on this measurement is also accurate. ',
                     E'Good attempt! \nThe ellipse is correctly placed along the outer border of the cranium; however, the interpretation is incorrect. \nAccording to standard biometry charts, HC values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"HC","method":"ellipse"}'::jsonb,
                     true, now()),
                    (bpd_meas_res.resource_id, 1, 14, 'measurement',
                     'Measure the head circumference using the ellipse method. Compare the measurement with the percentile chart to interpret it based on the given gestational age.',
                     '[]'::jsonb,
                     '{"answer":"Normal HC","measurement_type":"HC","method":"ellipse"}'::jsonb,
                     E'Excellent work! \nThe ellipse is correctly positioned along the outer border of the cranium. \nYour interpretation based on this measurement is also accurate. ',
                     E'Good attempt! \nThe ellipse is correctly placed along the outer border of the cranium; however, the interpretation is incorrect. \nAccording to standard biometry charts, HC values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"HC","method":"ellipse"}'::jsonb,
                     true, now()),
                    (bpd_meas_res.resource_id, 1, 15, 'measurement',
                     'Measure the head circumference using the ellipse method. Compare the measurement with the percentile chart to interpret it based on the given gestational age.',
                     '[]'::jsonb,
                     '{"answer":"Normal HC","measurement_type":"HC","method":"ellipse"}'::jsonb,
                     E'Excellent work! \nThe ellipse is correctly positioned along the outer border of the cranium. \nYour interpretation based on this measurement is also accurate. ',
                     E'Good attempt! \nThe ellipse is correctly placed along the outer border of the cranium; however, the interpretation is incorrect. \nAccording to standard biometry charts, HC values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"HC","method":"ellipse"}'::jsonb,
                     true, now())
                ON CONFLICT (resource_id, mindspark_no, question_no)
                DO UPDATE SET
                    question_type = EXCLUDED.question_type,
                    prompt = EXCLUDED.prompt,
                    options = EXCLUDED.options,
                    correct_answer = EXCLUDED.correct_answer,
                    feedback_correct = EXCLUDED.feedback_correct,
                    feedback_wrong = EXCLUDED.feedback_wrong,
                    metadata = EXCLUDED.metadata,
                    is_active = true,
                    updated_at = now();

                DELETE FROM public.mind_spark_questions
                WHERE resource_id = bpd_meas_res.resource_id AND question_no >= 16;
            END LOOP;
        END $$;

        DO $$
        DECLARE
            ac_meas_res RECORD;
        BEGIN
            FOR ac_meas_res IN
                SELECT DISTINCT coalesce(rd.resource_id, s.resource_id) AS resource_id
                FROM public.submissions s
                FULL OUTER JOIN public.resource_data rd ON rd.resource_id = s.resource_id
                LEFT JOIN public.learning_module lm ON rd.learning_module_id = lm.learning_module_id
                WHERE (
                    lower(trim(coalesce(lm.course_name, ''))) ILIKE '%ac%'
                    OR lower(trim(coalesce(lm.module_name, ''))) ILIKE '%ac%'
                    OR lower(trim(coalesce(lm.unit_name, ''))) ILIKE '%ac%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%ac%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%ac%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%abdomen%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%abdominal%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%abdomen%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%abdominal%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%transabdominal%'
                    OR lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%transabdominal%'
                )
                AND (
                    lower(trim(coalesce(rd.resource_name, ''))) ILIKE '%measure%'
                    OR lower(trim(coalesce(rd.resource_topic, ''))) ILIKE '%measure%'
                    OR s.question_type = 'measurement'
                )
                AND coalesce(rd.resource_id, s.resource_id) IS NOT NULL
                AND coalesce(rd.resource_id, s.resource_id) <> 'e196c6db-dc0b-4ebd-93b2-10a2125188e5'::uuid
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%bpd%'
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(rd.resource_name, ''))) NOT ILIKE '%femur%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(lm.module_name, ''))) NOT ILIKE '%femur%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%fl%'
                AND lower(trim(coalesce(lm.unit_name, ''))) NOT ILIKE '%femur%'
            LOOP
                INSERT INTO public.mind_spark_questions
                    (resource_id, mindspark_no, question_no, question_type, prompt, options, correct_answer, feedback_correct, feedback_wrong, metadata, is_active, updated_at)
                VALUES
                    (ac_meas_res.resource_id, 1, 1, 'measurement',
                     'Measure the AC through the APAD and TAD method and interpret the image, given the gestational age',
                     '[]'::jsonb,
                     '{"answer":"Normal AC","measurement_type":"AC","method":"caliper_apad_tad"}'::jsonb,
                     E'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct. ',
                     E'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"AC","method":"caliper_apad_tad"}'::jsonb,
                     true, now()),
                    (ac_meas_res.resource_id, 1, 2, 'measurement',
                     'Measure the AC through the APAD and TAD method and interpret the image, given the gestational age',
                     '[]'::jsonb,
                     '{"answer":"Normal AC","measurement_type":"AC","method":"caliper_apad_tad"}'::jsonb,
                     E'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct. ',
                     E'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"AC","method":"caliper_apad_tad"}'::jsonb,
                     true, now()),
                    (ac_meas_res.resource_id, 1, 3, 'measurement',
                     'Measure the AC through the APAD and TAD method and interpret the image, given the gestational age',
                     '[]'::jsonb,
                     '{"answer":"Normal AC","measurement_type":"AC","method":"caliper_apad_tad"}'::jsonb,
                     E'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct. ',
                     E'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"AC","method":"caliper_apad_tad"}'::jsonb,
                     true, now()),
                    (ac_meas_res.resource_id, 1, 4, 'measurement',
                     'Measure the AC through the APAD and TAD method and interpret the image, given the gestational age',
                     '[]'::jsonb,
                     '{"answer":"Normal AC","measurement_type":"AC","method":"caliper_apad_tad"}'::jsonb,
                     E'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct. ',
                     E'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"AC","method":"caliper_apad_tad"}'::jsonb,
                     true, now()),
                    (ac_meas_res.resource_id, 1, 5, 'measurement',
                     'Measure the AC through the APAD and TAD method and interpret the image, given the gestational age',
                     '[]'::jsonb,
                     '{"answer":"Normal AC","measurement_type":"AC","method":"caliper_apad_tad"}'::jsonb,
                     E'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct. ',
                     E'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"AC","method":"caliper_apad_tad"}'::jsonb,
                     true, now()),
                    (ac_meas_res.resource_id, 1, 6, 'measurement',
                     'Measure the abdominal circumference using the ellipse method. Compare the measurement with the percentile chart to interpret it based on the given gestational age.',
                     '[]'::jsonb,
                     '{"answer":"Normal AC","measurement_type":"AC","method":"ellipse"}'::jsonb,
                     E'Excellent work! \nThe ellipse is correctly positioned along the outer skin edge of the fetal abdomen. \nYour interpretation based on this measurement is also accurate. ',
                     E'Good attempt! \nThe ellipse is accurately placed along the outer skin edge of the fetal abdomen; however, the interpretation is incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"AC","method":"ellipse"}'::jsonb,
                     true, now()),
                    (ac_meas_res.resource_id, 1, 7, 'measurement',
                     'Measure the abdominal circumference using the ellipse method. Compare the measurement with the percentile chart to interpret it based on the given gestational age.',
                     '[]'::jsonb,
                     '{"answer":"Normal AC","measurement_type":"AC","method":"ellipse"}'::jsonb,
                     E'Excellent work! \nThe ellipse is correctly positioned along the outer skin edge of the fetal abdomen. \nYour interpretation based on this measurement is also accurate. ',
                     E'Good attempt! \nThe ellipse is accurately placed along the outer skin edge of the fetal abdomen; however, the interpretation is incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"AC","method":"ellipse"}'::jsonb,
                     true, now()),
                    (ac_meas_res.resource_id, 1, 8, 'measurement',
                     'Measure the abdominal circumference using the ellipse method. Compare the measurement with the percentile chart to interpret it based on the given gestational age.',
                     '[]'::jsonb,
                     '{"answer":"Normal AC","measurement_type":"AC","method":"ellipse"}'::jsonb,
                     E'Excellent work! \nThe ellipse is correctly positioned along the outer skin edge of the fetal abdomen. \nYour interpretation based on this measurement is also accurate. ',
                     E'Good attempt! \nThe ellipse is accurately placed along the outer skin edge of the fetal abdomen; however, the interpretation is incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"AC","method":"ellipse"}'::jsonb,
                     true, now()),
                    (ac_meas_res.resource_id, 1, 9, 'measurement',
                     'Measure the abdominal circumference using the ellipse method. Compare the measurement with the percentile chart to interpret it based on the given gestational age.',
                     '[]'::jsonb,
                     '{"answer":"Normal AC","measurement_type":"AC","method":"ellipse"}'::jsonb,
                     E'Excellent work! \nThe ellipse is correctly positioned along the outer skin edge of the fetal abdomen. \nYour interpretation based on this measurement is also accurate. ',
                     E'Good attempt! \nThe ellipse is accurately placed along the outer skin edge of the fetal abdomen; however, the interpretation is incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"AC","method":"ellipse"}'::jsonb,
                     true, now()),
                    (ac_meas_res.resource_id, 1, 10, 'measurement',
                     'Measure the abdominal circumference using the ellipse method. Compare the measurement with the percentile chart to interpret it based on the given gestational age.',
                     '[]'::jsonb,
                     '{"answer":"Normal AC","measurement_type":"AC","method":"ellipse"}'::jsonb,
                     E'Excellent work! \nThe ellipse is correctly positioned along the outer skin edge of the fetal abdomen. \nYour interpretation based on this measurement is also accurate. ',
                     E'Good attempt! \nThe ellipse is accurately placed along the outer skin edge of the fetal abdomen; however, the interpretation is incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                     '{"measurement_type":"AC","method":"ellipse"}'::jsonb,
                     true, now())
                ON CONFLICT (resource_id, mindspark_no, question_no)
                DO UPDATE SET
                    question_type = EXCLUDED.question_type,
                    prompt = EXCLUDED.prompt,
                    options = EXCLUDED.options,
                    correct_answer = EXCLUDED.correct_answer,
                    feedback_correct = EXCLUDED.feedback_correct,
                    feedback_wrong = EXCLUDED.feedback_wrong,
                    metadata = EXCLUDED.metadata,
                    is_active = true,
                    updated_at = now();

                DELETE FROM public.mind_spark_questions
                WHERE resource_id = ac_meas_res.resource_id AND question_no >= 11;
            END LOOP;
        END $$;
    `);
};

const normalizeQuestion = (question) => ({
    resource_id: question.resource_id,
    mindspark_no: question.mindspark_no ?? question.mindsparkNo ?? 1,
    question_no: question.question_no ?? question.questionNo,
    question_type: question.question_type ?? question.questionType ?? 'MCQ',
    prompt: question.prompt ?? question.question_query ?? question.question ?? null,
    options: question.options ?? question.options_available ?? [],
    correct_answer: question.correct_answer ?? question.correctAnswer ?? question.answer ?? null,
    feedback_correct: question.feedback_correct ?? question.feedbackCorrect ?? null,
    feedback_wrong: question.feedback_wrong ?? question.feedbackWrong ?? null,
    assets: question.assets ?? [],
    metadata: question.metadata ?? {},
    is_active: question.is_active ?? question.isActive ?? true,
});

const createMindSparkQuestions = async (requester, payload) => {
    if (!isAdmin(requester)) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to configure Mindspark questions.'
        };
    }

    const questions = Array.isArray(payload.questions) ? payload.questions : [payload];
    const normalizedQuestions = questions.map((question) => normalizeQuestion({
        ...question,
        resource_id: question.resource_id ?? payload.resource_id,
        mindspark_no: question.mindspark_no ?? question.mindsparkNo ?? payload.mindspark_no ?? payload.mindsparkNo,
    }));

    await ensureMindSparkQuestionsTable();

    const db = await client.connect();
    try {
        await db.query('BEGIN');

        const rows = [];
        for (const question of normalizedQuestions) {
            const result = await db.query(
                `INSERT INTO mind_spark_questions
                    (resource_id, mindspark_no, question_no, question_type, prompt, options,
                     correct_answer, feedback_correct, feedback_wrong, assets, metadata, is_active, created_by, updated_at)
                 VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9, $10::jsonb, $11::jsonb, $12, $13, NOW())
                 ON CONFLICT (resource_id, mindspark_no, question_no)
                 DO UPDATE SET
                    question_type = EXCLUDED.question_type,
                    prompt = EXCLUDED.prompt,
                    options = EXCLUDED.options,
                    correct_answer = EXCLUDED.correct_answer,
                    feedback_correct = EXCLUDED.feedback_correct,
                    feedback_wrong = EXCLUDED.feedback_wrong,
                    assets = EXCLUDED.assets,
                    metadata = EXCLUDED.metadata,
                    is_active = EXCLUDED.is_active,
                    updated_at = NOW()
                 RETURNING *`,
                [
                    question.resource_id,
                    question.mindspark_no,
                    question.question_no,
                    question.question_type,
                    question.prompt,
                    JSON.stringify(question.options),
                    JSON.stringify(question.correct_answer),
                    question.feedback_correct,
                    question.feedback_wrong,
                    JSON.stringify(question.assets),
                    JSON.stringify(question.metadata),
                    question.is_active,
                    requester.user_mail,
                ]
            );
            rows.push(result.rows[0]);
        }

        await db.query('COMMIT');
        return { status: 'Success', code: 200, data: rows };
    } catch (err) {
        await db.query('ROLLBACK');
        throw err;
    } finally {
        db.release();
    }
};

const uploadMindSparkAsset = async (requester, file) => {
    if (!isAdmin(requester)) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to upload Mindspark assets.'
        };
    }

    if (!file) {
        return {
            status: 'Bad Request',
            code: 400,
            message: 'image file is required'
        };
    }

    if (!String(file.mimetype || '').startsWith('image/')) {
        return {
            status: 'Bad Request',
            code: 400,
            message: 'Only image files are allowed'
        };
    }

    const ext = path.extname(file.originalname || '') || '.png';
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const storagePath = `mindspark/${safePathPart(requester.user_mail)}/${filename}`;
    const uploaded = await uploadAsset({
        sourceBucket: ASSET_BUCKET, objectKey: storagePath, body: file.buffer,
        contentType: file.mimetype, upsert: false
    });

    return {
        status: 'Success',
        code: 200,
        data: {
            filename,
            original_name: file.originalname,
            storage_path: uploaded.reference,
            public_url: await signAsset(uploaded.reference),
            mime_type: file.mimetype,
            size: file.size,
        }
    };
};

const normalizeHydratedMindSparkRow = (row) => {
    const qNo = Number(row.question_no);
    const prompt = String(row.prompt || '');
    const isFlAnnotation2 = (
        (row.question_type === 'annotation2' && (
            /transfemoral|femur|diaphysis|metaphysis/i.test(String(row.feedback_correct || ''))
            || /transfemoral|femur|diaphysis|metaphysis/i.test(String(row.feedback_wrong || ''))
            || /\bfl\b|femur|femoral/i.test(String(row.resource_name || ''))
            || (row.metadata && Array.isArray(row.metadata.expected_landmarks) && row.metadata.expected_landmarks.includes('Diaphysis'))
            || (row.correct_answer && /diaphysis|metaphysis/i.test(JSON.stringify(row.correct_answer)))
        ))
        || (/annotation 2|labelling|label/i.test(String(row.resource_name || '')) && /transfemoral|femur|diaphysis|metaphysis/i.test(String(row.feedback_correct || '')))
    );

    if (isFlAnnotation2 && qNo >= 1 && qNo <= 5) {
        return {
            ...row,
            question_type: 'annotation2',
            prompt: 'Label the correct anatomical parts in the image',
            options: Array.isArray(row.options) ? row.options : [],
            correct_answer: {
                expected_label_count: 2,
                expected_landmarks: ['Diaphysis', 'Metaphysis'],
                answer: 'Diaphysis and Metaphysis',
            },
            metadata: {
                ...(row.metadata || {}),
                expected_landmarks: ['Diaphysis', 'Metaphysis'],
                feedback_wrong_cases: {
                    case1: 'Your annotations are WRONG! \nOops! None of the labelling was done! \nRefer to the annotated reference image of the transfemoral plane and label the key landmarks. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis. ',
                    case2: 'Your annotations are WRONG! \nOops! Only non-essential landmarks were labelled. \nRefer to the annotated reference image of the transfemoral plane and label the key landmarks. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis. ',
                    case3: 'Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS! \nAlmost there!, You have correctly labelled the key landmarks, but have also used non-essential landmarks. \nRefer to the annotated reference image of the transfemoral plane and label the key landmarks. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis. ',
                    case4: 'Your annotations are WRONG! \nOops! You have selected the correct landmarks, but placed them in wrong positions. \nRefer to the annotated reference image of the transfemoral plane and correct your placements. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis. ',
                    case5: 'Your annotations are ALMOST CORRECT! \nAlmost there! You have correctly labelled some landmarks, but also used non-essential landmarks. \nRefer to the annotated reference image of the transfemoral plane and correct your placements. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis. ',
                    case6: 'Your annotations are ALMOST CORRECT! \nAlmost there! You have correctly labelled some landmarks, but missed out on some. \nRefer to the annotated reference image of the transfemoral plane and correct your placements. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis. ',
                    case7: 'Your annotations are WRONG! \nOops! None of the key landmarks were correctly labelled and also used non-essential landmarks. \nRefer to the annotated reference image of the transfemoral plane and correct your placements. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis. ',
                    case8: 'Your annotations are WRONG! \nOops! The landmarks you selected are correct, but they are placed in wrong positions. \nRefer to the annotated reference image of the transfemoral plane and correct your placements. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis. ',
                    case9: 'Your annotations are ALMOST CORRECT! \nAlmost there! You have identified all the correct landmarks, but some are placed in wrong positions. \nRefer to the annotated reference image of the transfemoral plane and correct your placements. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis. ',
                    case10: 'Your annotations are ALMOST CORRECT! \nAlmost there! You have identified the correct landmarks, but misplaced and also used non-essential landmarks. \nRefer to the annotated reference image of the transfemoral plane and improve your understanding. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis. ',
                    case11: 'Your annotations are REVIEW NEEDED \nReview needed Please review your selections. \nRefer to the annotated reference image of the transfemoral plane and try again. ',
                },
            },
            feedback_correct: 'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transfemoral plane. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis. ',
            feedback_wrong: row.feedback_wrong || 'Your annotations are WRONG! \nOops! None of the labelling was done! \nRefer to the annotated reference image of the transfemoral plane and label the key landmarks. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis. ',
        };
    }

    const isFlAnnotation1 = !isFlAnnotation2 && row.question_type !== 'annotation2' && (row.question_type === 'annotation1' || /anatomical parts/i.test(prompt)) && (
        /transfemoral|femur|diaphysis|metaphysis/i.test(String(row.feedback_correct || ''))
        || (row.metadata && Array.isArray(row.metadata.expected_landmarks) && row.metadata.expected_landmarks.includes('Diaphysis'))
        || (row.correct_answer && /diaphysis|metaphysis/i.test(JSON.stringify(row.correct_answer)))
    );

    if (isFlAnnotation1 && qNo >= 1 && qNo <= 5) {
        return {
            ...row,
            question_type: 'annotation1',
            prompt: 'Label the correct anatomical parts in the image',
            options: Array.isArray(row.options) ? row.options : [],
            correct_answer: {
                expected_label_count: 2,
                expected_landmarks: ['Diaphysis', 'Metaphysis'],
                answer: 'Diaphysis and Metaphysis',
            },
            metadata: {
                ...(row.metadata || {}),
                expected_landmarks: ['Diaphysis', 'Metaphysis'],
                feedback_wrong_cases: {
                    case1: 'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane and understand the key landmarks.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.',
                    case2: 'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.',
                    case3: 'Your annotations are ALMOST CORRECT!\nAlmost there! You have labelled some landmarks correctly, but have also included non-essential landmarks.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.',
                    case4: 'Your annotations are ALMOST CORRECT!\nAlmost there! You have labelled some landmarks correctly and missed out on some.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.',
                    case5: 'Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS!\nAlmost there! You have correctly labelled all the key landmarks, but have also included non-essential landmarks.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.',
                    case6: 'Your annotations are ALMOST CORRECT!\nAlmost there! You have correctly identified some landmarks.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.',
                },
            },
            feedback_correct: 'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transfemoral plane.\nThe expected landmarks to be labelled are Diaphysis and Metaphysis.',
            feedback_wrong: row.feedback_wrong || 'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane and understand the key landmarks.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.',
        };
    }

    const isAcAnnotation2 = !isFlAnnotation1 && !isFlAnnotation2 && (
        (row.question_type === 'annotation2' && (
            /review needed/i.test(String(row.feedback_wrong || ''))
            || /abdominal|stomach|portal|rib 1/i.test(String(row.feedback_correct || ''))
            || /abdominal|stomach|portal|rib 1/i.test(String(row.feedback_wrong || ''))
            || /ac\b|abdomen|abdominal/i.test(String(row.resource_name || ''))
            || (row.metadata && Array.isArray(row.metadata.expected_landmarks) && row.metadata.expected_landmarks.includes('Rib 1'))
            || (row.correct_answer && /rib 1|stomach bubble/i.test(JSON.stringify(row.correct_answer)))
        ))
        || (/annotation 2|labelling|label/i.test(String(row.resource_name || '')) && /abdominal|stomach|portal|rib 1/i.test(String(row.feedback_correct || '')))
    );

    if (isAcAnnotation2 && qNo >= 1 && qNo <= 5) {
        return {
            ...row,
            question_type: 'annotation2',
            prompt: 'Label the correct anatomical parts in the image',
            options: Array.isArray(row.options) ? row.options : [],
            correct_answer: {
                expected_label_count: 5,
                expected_landmarks: ['Rib 1', 'Rib 2', 'Stomach bubble', 'Spine', 'Portal vein'],
                answer: 'Rib 1, Rib 2, Stomach bubble, Spine, Portal vein',
            },
            metadata: {
                ...(row.metadata || {}),
                expected_landmarks: ['Rib 1', 'Rib 2', 'Stomach bubble', 'Spine', 'Portal vein'],
                feedback_wrong_cases: {
                    case1: 'Your annotations are WRONG! \nOops! None of the labelling was done! \nRefer to the annotated reference image of the abdominal plane and label the key landmarks. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein. ',
                    case2: 'Your annotations are WRONG! \nOops! Only non-essential landmarks were labelled. \nRefer to the annotated reference image of the abdominal plane and label the key landmarks. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein. ',
                    case3: 'Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS! \nAlmost there! You have correctly labelled the key landmarks, but have also used non-essential landmarks. \nRefer to the annotated reference image of the abdominal plane and label the key landmarks. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                    case4: 'Your annotations are WRONG! \nOops! You have selected the correct landmarks, but placed them in wrong positions. \nRefer to the annotated reference image of the abdominal plane and correct your placements. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.  ',
                    case5: 'Your annotations are ALMOST CORRECT! \nAlmost there! You have correctly labelled some landmarks, but also used non-essential landmarks. \nRefer to the annotated reference image of the abdominal plane and correct your placements. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein. ',
                    case6: 'Your annotations are ALMOST CORRECT! \nAlmost there! You have correctly labelled some landmarks, but missed out on some. \nRefer to the annotated reference image of the abdominal plane and correct your placements. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein. ',
                    case7: 'Your annotations are WRONG! \nOops! None of the key landmarks were correctly labelled and also used non-essential landmarks. \nRefer to the annotated reference image of the abdominal plane and correct your placements. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein. ',
                    case8: 'Your annotations are WRONG! \nOops! The landmarks you selected are correct, but they are placed in wrong positions. \nRefer to the annotated reference image of the abdominal plane and correct your placements. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein. ',
                    case9: 'Your annotations are ALMOST CORRECT! \nAlmost there! You have identified all the correct landmarks, but some are placed in wrong positions. \nRefer to the annotated reference image of the abdominal plane and correct your placements. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein. ',
                    case10: 'Your annotations are ALMOST CORRECT! \nAlmost there! You have identified the correct landmarks, but misplaced and also used non-essential landmarks. \nRefer to the annotated reference image of the abdominal plane and improve your understanding. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein. ',
                    case11: 'Your annotations are REVIEW NEEDED \nReview needed Please review your selections. \nRefer to the annotated reference image of the abdominal plane and try again. ',
                },
            },
            feedback_correct: 'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the abdominal plane. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein. ',
            feedback_wrong: row.feedback_wrong || 'Your annotations are WRONG! \nOops! None of the labelling was done! \nRefer to the annotated reference image of the abdominal plane and label the key landmarks. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein. ',
        };
    }

    const isAcAnnotation1 = !isFlAnnotation1 && !isAcAnnotation2 && row.question_type !== 'annotation2' && (row.question_type === 'annotation1' || /anatomical parts/i.test(prompt)) && (
        /abdominal|stomach|portal|rib 1/i.test(String(row.feedback_correct || ''))
        || (row.metadata && Array.isArray(row.metadata.expected_landmarks) && row.metadata.expected_landmarks.includes('Stomach bubble'))
        || (row.correct_answer && /stomach bubble|portal vein/i.test(JSON.stringify(row.correct_answer)))
    );

    if (isAcAnnotation1 && qNo >= 1 && qNo <= 5) {
        return {
            ...row,
            question_type: 'annotation1',
            prompt: 'Label the correct anatomical parts in the image',
            options: Array.isArray(row.options) ? row.options : [],
            correct_answer: {
                expected_label_count: 5,
                expected_landmarks: ['Rib 1', 'Rib 2', 'Stomach bubble', 'Spine', 'Portal vein'],
                answer: 'Rib 1, Rib 2, Stomach bubble, Spine, Portal vein',
            },
            metadata: {
                ...(row.metadata || {}),
                expected_landmarks: ['Rib 1', 'Rib 2', 'Stomach bubble', 'Spine', 'Portal vein'],
                feedback_wrong_cases: {
                    case1: 'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the abdominal plane and understand the key landmarks.\nThe correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                    case2: 'Your annotations are ALMOST CORRECT!\nAlmost there! You have labelled some landmarks correctly, but have also included non-essential landmarks.\nRefer to the annotated reference image of the abdominal plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                    case3: 'Your annotations are ALMOST CORRECT!\nAlmost there! You have labelled some landmarks correctly and missed out on some.\nRefer to the annotated reference image of the abdominal plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                    case4: 'Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS!\nAlmost there! You have correctly labelled all the key landmarks, but have also included non-essential landmarks.\nRefer to the annotated reference image of the abdominal plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                    case5: 'Your annotations are ALMOST CORRECT!\nAlmost there! You have correctly identified some landmarks.\nRefer to the annotated reference image of the abdominal plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                },
            },
            feedback_correct: 'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the abdominal plane.\nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
            feedback_wrong: row.feedback_wrong || 'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the abdominal plane and understand the key landmarks.\nThe correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
        };
    }

    const isBpdAnnotation2 = !isFlAnnotation1 && !isAcAnnotation1 && !isAcAnnotation2 && (
        (row.question_type === 'annotation2' && !/abdominal|stomach|portal|rib 1/i.test(String(row.feedback_correct || '')))
        || /the arrow sign/i.test(String(row.feedback_correct || ''))
        || /the arrow sign/i.test(String(row.feedback_wrong || ''))
        || (/annotation 2|labelling|label/i.test(String(row.resource_name || '')) && /transthalamic|bpd|head/i.test(String(row.feedback_correct || '')))
    );

    if (isBpdAnnotation2 && qNo >= 1 && qNo <= 5) {
        return {
            ...row,
            question_type: 'annotation2',
            prompt: 'Label the correct anatomical parts in the image',
            options: Array.isArray(row.options) ? row.options : [],
            correct_answer: {
                expected_label_count: 5,
                expected_landmarks: ['Arrow Sign', 'Midline Falx', 'Thalamus', 'CSP', 'Cranium'],
                answer: 'Arrow Sign, Midline Falx, Thalamus, CSP, Cranium',
            },
            metadata: {
                ...(row.metadata || {}),
                expected_landmarks: ['Arrow Sign', 'Midline Falx', 'Thalamus', 'CSP', 'Cranium'],
                feedback_wrong_cases: {
                    case1: 'Your annotations are WRONG!\nOops! None of the labelling was done! \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                    case2: 'Your annotations are WRONG! \nOops! Only non-essential landmarks were labelled. \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                    case3: 'Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS! \nAlmost there!You have correctly labelled the key landmarks, but have also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                    case4: 'Your annotations are WRONG! \nOops! You have selected the correct landmarks, but placed them in wrong positions. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                    case5: 'Your annotations are ALMOST CORRECT! \nAlmost there! You have correctly labelled some landmarks, but also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                    case6: 'Your annotations are ALMOST CORRECT! \nAlmost there! You have correctly labelled some landmarks, but missed out on some. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                    case7: 'Your annotations are WRONG! \nOops! None of the key landmarks were correctly labelled and also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                    case8: 'Your annotations are WRONG! \nOops! The landmarks you selected are correct, but they are placed in wrong positions. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                    case9: 'Your annotations are ALMOST CORRECT! \nAlmost there! You have identified all the correct landmarks, but some are placed in wrong positions. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                    case10: 'Your annotations are ALMOST CORRECT! \nAlmost there! You have identified the correct landmarks, but misplaced and also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                },
            },
            feedback_correct: 'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transthalamic plane. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
            feedback_wrong: row.feedback_wrong || 'Your annotations are WRONG!\nOops! None of the labelling was done! \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
        };
    }

    const isBpdAnnotation1 = !isFlAnnotation1 && !isAcAnnotation1 && !isBpdAnnotation2 && row.question_type !== 'annotation2' && (
        row.question_type === 'annotation1'
        || /anatomical parts/i.test(prompt)
        || (/annotation/i.test(prompt) && /transthalamic/i.test(String(row.feedback_correct || '')))
        || (row.metadata && Array.isArray(row.metadata.expected_landmarks) && row.metadata.expected_landmarks.includes('Arrow Sign'))
        || (row.feedback_correct && /transthalamic/i.test(row.feedback_correct) && /arrow sign/i.test(row.feedback_correct))
    );

    if (isBpdAnnotation1 && qNo >= 1 && qNo <= 5) {
        return {
            ...row,
            question_type: 'annotation1',
            prompt: 'Label the correct anatomical parts in the image',
            options: Array.isArray(row.options) ? row.options : [],
            correct_answer: {
                expected_label_count: 5,
                expected_landmarks: ['Arrow Sign', 'Midline Falx', 'Thalamus', 'CSP', 'Cranium'],
                answer: 'Arrow Sign, Midline Falx, Thalamus, CSP, Cranium',
            },
            metadata: {
                ...(row.metadata || {}),
                expected_landmarks: ['Arrow Sign', 'Midline Falx', 'Thalamus', 'CSP', 'Cranium'],
                feedback_wrong_cases: {
                    case1: 'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transthalamic plane and understand the key landmarks.\nThe correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                    case2: 'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transthalamic plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                    case3: 'Your annotations are ALMOST CORRECT!\nAlmost there! You have labelled some landmarks correctly, but have also included non-essential landmarks.\nRefer to the annotated reference image of the transthalamic plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                    case4: 'Your annotations are ALMOST CORRECT!\nAlmost there! You have labelled some landmarks correctly and missed out on some.\nRefer to the annotated reference image of the transthalamic plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                    case5: 'Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS!\nAlmost there! You have correctly labelled all the key landmarks, but have also included non-essential landmarks.\nRefer to the annotated reference image of the transthalamic plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                    case6: 'Your annotations are ALMOST CORRECT!\nAlmost there! You have correctly identified some landmarks.\nRefer to the annotated reference image of the transthalamic plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                },
            },
            feedback_correct: 'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transthalamic plane.\nThe expected landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
            feedback_wrong: row.feedback_wrong || 'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transthalamic plane and understand the key landmarks.\nThe correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
        };
    }

    const isBpdHcMeasurement = (
        (row.question_type === 'measurement' && (
            /bpd|biparietal|head circumference|ofd|ellipse|cranium|transthalamic/i.test(prompt)
            || /bpd|biparietal|head circumference|ofd|ellipse|cranium|transthalamic/i.test(String(row.feedback_correct || ''))
            || /bpd|biparietal|head circumference|ofd|ellipse|cranium|transthalamic/i.test(String(row.feedback_wrong || ''))
            || /bpd|head/i.test(String(row.resource_name || ''))
            || /measure/i.test(String(row.resource_name || ''))
        ))
        || (/measure/i.test(String(row.resource_name || '')) && !/ac|fl|femur|abdomen|abdominal/i.test(String(row.resource_name || '')))
    ) && !/abdominal|abdomen|femur|transfemoral/i.test(String(row.resource_name || '')) && !/abdominal|abdomen|femur|transfemoral/i.test(prompt);

    if (isBpdHcMeasurement && qNo >= 1 && qNo <= 15) {
        const isEllipse = /ellipse/i.test(prompt) || qNo >= 11 || /ellipse/i.test(String(row.resource_name || ''));
        const isHcCaliper = !isEllipse && (/bpd and ofd|ofd|head circumference/i.test(prompt) || (qNo >= 6 && qNo <= 10) || /how to measure hc/i.test(String(row.resource_name || '')));

        if (isEllipse) {
            return {
                ...row,
                question_type: 'measurement',
                prompt: 'Measure the head circumference using the ellipse method. Compare the measurement with the percentile chart to interpret it based on the given gestational age.',
                options: Array.isArray(row.options) ? row.options : [],
                correct_answer: { answer: 'Normal HC', measurement_type: 'HC', method: 'ellipse' },
                metadata: {
                    ...(row.metadata || {}),
                    measurement_type: 'HC',
                    method: 'ellipse',
                    feedback_wrong_cases: {
                        case1: 'Good attempt! \nThe ellipse is correctly placed along the outer border of the cranium; however, the interpretation is incorrect. \nAccording to standard biometry charts, HC values between the 5th and 95th percentiles are considered normal. ',
                        case2: 'The interpretation is correct; however, the ellipse placement does not match the reference standard. \nEnsure the ellipse is positioned accurately along the outer border of the cranium to obtain a valid measurement. ',
                        case3: 'The measurement and interpretation are both incorrect. \nThe ellipse placement does not match the reference standard and is not positioned along the outer skin edge of the fetal abdomen. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                    },
                },
                feedback_correct: 'Excellent work! \nThe ellipse is correctly positioned along the outer border of the cranium. \nYour interpretation based on this measurement is also accurate. ',
                feedback_wrong: row.feedback_wrong || 'Good attempt! \nThe ellipse is correctly placed along the outer border of the cranium; however, the interpretation is incorrect. \nAccording to standard biometry charts, HC values between the 5th and 95th percentiles are considered normal. ',
            };
        } else if (isHcCaliper) {
            return {
                ...row,
                question_type: 'measurement',
                prompt: 'Place the caliper and measure the Head circumference by measuring  BPD and OFD, and interpret the values given the gestational age given in each case.',
                options: Array.isArray(row.options) ? row.options : [],
                correct_answer: { answer: 'Normal HC', measurement_type: 'HC', method: 'caliper_bpd_ofd' },
                metadata: {
                    ...(row.metadata || {}),
                    measurement_type: 'HC',
                    method: 'caliper_bpd_ofd',
                    feedback_wrong_cases: {
                        case1: 'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                        case2: 'Your interpretation is clinically correct, but the caliper placement is inaccurate. \nThe placement is suboptimal and does not align with the standard reference positioning. ',
                        case3: 'The measurement and interpretation are both incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                    },
                },
                feedback_correct: 'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct.',
                feedback_wrong: row.feedback_wrong || 'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
            };
        } else {
            return {
                ...row,
                question_type: 'measurement',
                prompt: 'Place the caliper and measure the Biparietal diameter and interpret the values, given the gestational age for each case.',
                options: Array.isArray(row.options) ? row.options : [],
                correct_answer: { answer: 'Normal BPD', measurement_type: 'BPD', method: 'caliper' },
                metadata: {
                    ...(row.metadata || {}),
                    measurement_type: 'BPD',
                    method: 'caliper',
                    feedback_wrong_cases: {
                        case1: 'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                        case2: 'Your interpretation is clinically correct, but the caliper placement is inaccurate. \nThe placement is suboptimal and does not align with the standard reference positioning. ',
                        case3: 'The measurement and interpretation are both incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                    },
                },
                feedback_correct: 'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct.',
                feedback_wrong: row.feedback_wrong || 'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
            };
        }
    }

    const isAcMeasurement = (
        (row.question_type === 'measurement' && (
            /apad|tad|abdominal circumference|fetal abdomen/i.test(prompt)
            || /apad|tad|abdominal circumference|fetal abdomen/i.test(String(row.feedback_correct || ''))
            || /apad|tad|abdominal circumference|fetal abdomen/i.test(String(row.feedback_wrong || ''))
            || (/ac\b|abdomen|abdominal/i.test(String(row.resource_name || '')) && /measure/i.test(String(row.resource_name || '')))
        ))
        || (/measure/i.test(String(row.resource_name || '')) && /ac\b|abdomen|abdominal/i.test(String(row.resource_name || '')))
    ) && !/femur|transfemoral|fl\b|bpd|biparietal|transthalamic/i.test(String(row.resource_name || ''))
      && !/femur|transfemoral|fl\b|bpd|biparietal|transthalamic/i.test(prompt);

    if (isAcMeasurement && qNo >= 1 && qNo <= 10) {
        const isEllipse = /ellipse/i.test(prompt) || qNo >= 6 || /ellipse/i.test(String(row.resource_name || ''));
        if (isEllipse) {
            return {
                ...row,
                question_type: 'measurement',
                prompt: 'Measure the abdominal circumference using the ellipse method. Compare the measurement with the percentile chart to interpret it based on the given gestational age.',
                options: Array.isArray(row.options) ? row.options : [],
                correct_answer: { answer: 'Normal AC', measurement_type: 'AC', method: 'ellipse' },
                metadata: {
                    ...(row.metadata || {}),
                    measurement_type: 'AC',
                    method: 'ellipse',
                    feedback_wrong_cases: {
                        case1: 'Good attempt! \nThe ellipse is accurately placed along the outer skin edge of the fetal abdomen; however, the interpretation is incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                        case2: 'The interpretation is correct; however, the ellipse placement does not match the reference standard. \nEnsure the ellipse is positioned along the outer skin edge of the fetal abdomen to obtain a valid measurement. ',
                        case3: 'The measurement and interpretation are both incorrect. \nThe ellipse placement does not match the reference standard and is not positioned along the outer skin edge of the fetal abdomen. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                    },
                },
                feedback_correct: 'Excellent work! \nThe ellipse is correctly positioned along the outer skin edge of the fetal abdomen. \nYour interpretation based on this measurement is also accurate. ',
                feedback_wrong: row.feedback_wrong || 'Good attempt! \nThe ellipse is accurately placed along the outer skin edge of the fetal abdomen; however, the interpretation is incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
            };
        } else {
            return {
                ...row,
                question_type: 'measurement',
                prompt: 'Measure the AC through the APAD and TAD method and interpret the image, given the gestational age',
                options: Array.isArray(row.options) ? row.options : [],
                correct_answer: { answer: 'Normal AC', measurement_type: 'AC', method: 'caliper_apad_tad' },
                metadata: {
                    ...(row.metadata || {}),
                    measurement_type: 'AC',
                    method: 'caliper_apad_tad',
                    feedback_wrong_cases: {
                        case1: 'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                        case2: 'Your interpretation is clinically correct, but the caliper placement is inaccurate. \nThe placement is suboptimal and does not align with the standard reference positioning. ',
                        case3: 'The measurement and interpretation are both incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                    },
                },
                feedback_correct: 'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct. ',
                feedback_wrong: row.feedback_wrong || 'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
            };
        }
    }

    const isFl = /fl\b/i.test(prompt)
        || /femur/i.test(prompt)
        || /femoral/i.test(prompt)
        || (row.options && Array.isArray(row.options) && row.options.some(opt => typeof opt?.text === 'string' && /both a & b/i.test(opt.text)))
        || (row.feedback_correct && /femur|femoral/i.test(row.feedback_correct))
        || (row.feedback_wrong && /femur|femoral/i.test(row.feedback_wrong));

    if (isFl) {
        if (qNo === 1) {
            return {
                ...row,
                prompt: 'Select the correct planes for the Femur Length measurement',
                options: (row.options && row.options.length > 0 && !row.options[0]?.text?.includes('Both A & C')) ? row.options : [
                    { key: 'A', value: '1', text: 'Both A & B' },
                    { key: 'B', value: '2', text: 'A, B & D' },
                    { key: 'C', value: '3', text: 'Both B & D' },
                    { key: 'D', value: '4', text: 'None of the above' },
                ],
                correct_answer: { key: 'A', value: 'Both A & B', answer: 'a.  Both A & B' },
                feedback_correct: 'Correct! The selected planes show the femur in proper orientation for measurement.',
                feedback_wrong: 'Not correct! Both A and B are the correct femur diaphysis.',
            };
        }
        if (qNo === 2) {
            return {
                ...row,
                prompt: 'Select the correct planes for Femur Length(FL) measurement',
                options: (row.options && row.options.length > 0 && row.options.some(o => /both a & d/i.test(o.text))) ? row.options : [
                    { key: 'A', value: '1', text: 'Both A & D' },
                    { key: 'B', value: '2', text: 'A, B & D' },
                    { key: 'C', value: '3', text: 'A, B & C' },
                    { key: 'D', value: '4', text: 'None of the above' },
                ],
                correct_answer: { key: 'C', value: 'A, B & C', answer: 'c. A, B & C' },
                feedback_correct: 'Great! You selected all correct FL planes, clearly depicting the long axis of the femur suitable for accurate biometry.',
                feedback_wrong: 'Incorrect. A, B & C images represent the proper femur orientation.',
            };
        }
        if (qNo === 3) {
            return {
                ...row,
                prompt: 'Select the correct planes for Femur Length(FL) measurement',
                options: (row.options && row.options.length > 0 && row.options.some(o => /only d/i.test(o.text))) ? row.options : [
                    { key: 'A', value: '1', text: 'Both A & C' },
                    { key: 'B', value: '2', text: 'Only D' },
                    { key: 'C', value: '3', text: 'Both C & D' },
                    { key: 'D', value: '4', text: 'None of the above' },
                ],
                correct_answer: { key: 'A', value: 'Both A & C', answer: 'a. Both A & C' },
                feedback_correct: 'Nice work! You correctly picked the planes displaying the femur in its entirety, suitable for accurate length measurement.',
                feedback_wrong: 'Incorrect selection! Both A and C are the accurate femur diaphysis length.',
            };
        }
        if (qNo === 4) {
            return {
                ...row,
                prompt: 'Choose the correct options that contain the correct plane for  measuring Femur Length.',
                options: (row.options && row.options.length > 0 && row.options.some(o => /only c/i.test(o.text))) ? row.options : [
                    { key: 'A', value: '1', text: 'Both A & D' },
                    { key: 'B', value: '2', text: 'Only C' },
                    { key: 'C', value: '3', text: 'Both C & D' },
                    { key: 'D', value: '4', text: 'None of the above' },
                ],
                correct_answer: { key: 'B', value: 'Only C', answer: 'B Only C' },
                feedback_correct: 'Perfect! You accurately selected the correct femur plane showing a clear and complete visualization of the femoral shaft.',
                feedback_wrong: 'Incorrect. The selected planes do not show the femur. If they select None of the above: Your selection is incorrect. The correct FL planes are present in C.',
            };
        }
        if (qNo === 5) {
            return {
                ...row,
                prompt: 'Select the correct planes for Femur Length(FL) measurement',
                options: (row.options && row.options.length > 0 && row.options.length >= 4) ? row.options : [
                    { key: 'A', value: '1', text: 'A' },
                    { key: 'B', value: '2', text: 'B' },
                    { key: 'C', value: '3', text: 'C' },
                    { key: 'D', value: '4', text: 'D' },
                ],
                correct_answer: { key: 'A', value: 'A', answer: 'A' },
                feedback_correct: 'You accurately identified the correct FL plane with full femur visualization.',
                feedback_wrong: 'Incorrect choice! The selected image does not represent the proper femur orientation.',
            };
        }
    }

    const isAc = !isFl && (
        /ac\b/i.test(prompt)
        || /transabdominal/i.test(prompt)
        || /abdomen/i.test(prompt)
        || /abdominal/i.test(prompt)
        || /planes are used to measure/i.test(prompt)
        || /measuring ac/i.test(prompt)
        || /planes for ac measurement/i.test(prompt)
        || (row.options && Array.isArray(row.options) && row.options.some(opt => typeof opt?.text === 'string' && /both a & c/i.test(opt.text)))
        || (row.correct_answer && typeof row.correct_answer === 'object' && /transabdominal/i.test(JSON.stringify(row.correct_answer)))
    );

    if (isAc) {
        if (qNo === 1) {
            return {
                ...row,
                prompt: 'Which among the given planes are used to measure AC?',
                options: (row.options && row.options.length > 0 && !row.options[0]?.text?.includes('Only A')) ? row.options : [
                    { key: 'A', value: '1', text: 'Both A & C' },
                    { key: 'B', value: '2', text: 'Both B & D' },
                    { key: 'C', value: '3', text: 'Only C' },
                    { key: 'D', value: '4', text: 'None of the above' },
                ],
                correct_answer: { key: 'A', value: 'Both A & C', answer: 'A. (Both A & C)' },
                feedback_correct: 'Well done! A and C represent the correct transverse abdominal planes for AC measurement.',
                feedback_wrong: 'Incorrect! Both A and C show the standard AC measurement view with symmetrical appearance and correct landmarks.',
            };
        }
        if (qNo === 2) {
            return {
                ...row,
                prompt: 'Choose the correct option for measuring AC',
                options: (row.options && row.options.length > 0 && !row.options[0]?.text?.includes('Only B')) ? row.options : [
                    { key: 'A', value: '1', text: 'Both A & D' },
                    { key: 'B', value: '2', text: 'Only B' },
                    { key: 'C', value: '3', text: 'Both B & D' },
                    { key: 'D', value: '4', text: 'None of the above' },
                ],
                correct_answer: { key: 'B', value: 'Only B', answer: 'B. (Only B)' },
                feedback_correct: 'Perfect! You accurately selected image B — it displays the proper transverse view for measuring the fetal abdominal circumference.',
                feedback_wrong: 'Incorrect! The selected image does not represent the correct AC measurement plane. If they select None of the above: Your selection is incorrect. The correct AC plane present in B.',
            };
        }
        if (qNo === 3) {
            return {
                ...row,
                prompt: 'Select among the given planes are used to measure AC?',
                options: (row.options && row.options.length > 0 && !row.options[0]?.text?.includes('Both B & C')) ? row.options : [
                    { key: 'A', value: '1', text: 'A' },
                    { key: 'B', value: '2', text: 'B' },
                    { key: 'C', value: '3', text: 'C' },
                    { key: 'D', value: '4', text: 'D' },
                ],
                correct_answer: { key: 'C', value: 'C', answer: 'C' },
                feedback_correct: 'Well done! You identified the correct AC measurement plane that includes the stomach bubble, portal vein, ribs and cross-section of the spine.',
                feedback_wrong: 'The selected image does not represent the proper AC plane.',
            };
        }
        if (qNo === 4) {
            return {
                ...row,
                prompt: 'Which among the given planes are used to measure AC?',
                options: (row.options && row.options.length > 0) ? row.options : [
                    { key: 'A', value: '1', text: 'A' },
                    { key: 'B', value: '2', text: 'B' },
                    { key: 'C', value: '3', text: 'C' },
                    { key: 'D', value: '4', text: 'D' },
                ],
                correct_answer: { key: 'D', value: 'D', answer: 'D' },
                feedback_correct: 'Good job! You correctly identified D as the AC measurement plane with the appropriate fetal abdominal landmarks.',
                feedback_wrong: 'The chosen plane is incorrect. The AC plane should include the fetal stomach and spine in a true transverse circular section of the abdomen.',
            };
        }
        if (qNo === 5) {
            return {
                ...row,
                prompt: 'Select the correct planes for AC measurement',
                options: (row.options && row.options.length > 0) ? row.options : [
                    { key: 'A', value: '1', text: 'A' },
                    { key: 'B', value: '2', text: 'B' },
                    { key: 'C', value: '3', text: 'C' },
                    { key: 'D', value: '4', text: 'D' },
                ],
                correct_answer: { key: 'D', value: 'D', answer: 'D' },
                feedback_correct: 'Great work! You selected D — the correct plane for AC measurement that includes the stomach bubble and spine in a circular section.',
                feedback_wrong: 'The chosen plane is not correct.',
            };
        }
    }

    if (qNo === 4 && (/bpd/i.test(prompt) || /transthalamic/i.test(prompt) || (!isAc && !isFl && row.question_type === 'type1' && !/ac/i.test(prompt)))) {
        return {
            ...row,
            correct_answer: { key: 'B', value: 'B', answer: 'B' },
            feedback_correct: 'Excellent! You chose the correct transthalamic image suitable for BPD measurement where thalami and CSP are seen clearly.',
            feedback_wrong: 'The selected image corresponds to a transventricular plane. Remember, the BPD is measured in the transthalamic section showing falx, arrow sign, thalami and CSP.',
        };
    }
    if ((qNo >= 6 && qNo <= 10) || (qNo >= 11 && qNo <= 15)) {
        if (isFl) {
            return {
                ...row,
                prompt: 'Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane',
                correct_answer: { answer: 'Femur plane frame', timeframe: 'Femur plane', expected_timeframe: 'Femur plane' },
                feedback_correct: 'Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.',
                feedback_wrong: 'Incorrect freeze! The frozen frame lacks one or more key landmarks',
            };
        }
        if (isAc) {
            return {
                ...row,
                prompt: 'Watch the ultrasound video of the angulation of the probe over the fetal abdomen and find the correct timeframe revealing the transabdominal plane',
                correct_answer: { answer: 'Transabdominal plane frame', timeframe: 'Transabdominal plane', expected_timeframe: 'Transabdominal plane' },
                feedback_correct: 'Perfect freeze! The image shows all the key landmarks: the stomach bubble, ribs, portal vein, and spine.',
                feedback_wrong: 'Incorrect freeze! The frozen frame lacks one or more key landmarks',
            };
        }
        return {
            ...row,
            prompt: 'Watch the ultrasound video of the angulation of the probe over the fetal head and find the correct timeframe revealing the transthalamic plane',
            feedback_correct: 'Perfect freeze! The image consists of all the key landmarks: midline falx, box-shaped CSP, and symmetric thalami.',
            feedback_wrong: 'Incorrect freeze! The frozen frame lacks one or more key landmarks',
        };
    }
    return row;
};

const getMindSparkQuestions = async (requester, { resource_id, mindspark_no, include_inactive }) => {
    if (!canRead(requester)) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to view Mindspark questions.'
        };
    }

    await ensureMindSparkQuestionsTable();

    const conditions = ['resource_id = $1'];
    const values = [resource_id];

    if (mindspark_no !== undefined && mindspark_no !== null && mindspark_no !== '') {
        values.push(mindspark_no);
        conditions.push(`mindspark_no = $${values.length}`);
    }

    if (!include_inactive) {
        conditions.push('is_active = TRUE');
    }

    const result = await client.query(
        `SELECT *
         FROM mind_spark_questions
         WHERE ${conditions.join(' AND ')}
         ORDER BY mindspark_no ASC NULLS LAST, question_no ASC, created_at ASC`,
        values
    );

    const hydratedRows = await Promise.all(result.rows.map(hydrateQuestion));
    const filteredHydrated = hydratedRows.filter(r => !(Number(r.question_no) >= 11 && Number(r.question_no) <= 15 && r.question_type !== 'measurement'));
    const normalizedRows = filteredHydrated.map(normalizeHydratedMindSparkRow);

    if (normalizedRows.length === 0 && resource_id) {
        try {
            const resCheck = await client.query(
                `SELECT rd.resource_id, rd.resource_name, rd.resource_topic, lm.module_name, lm.unit_name, lm.course_name
                 FROM public.resource_data rd
                 LEFT JOIN public.learning_module lm ON rd.learning_module_id = lm.learning_module_id
                 WHERE rd.resource_id = $1
                 LIMIT 1`,
                [resource_id]
            );
            const rRow = resCheck.rows[0];
            const isBpdAnnotRes = rRow && (
                String(rRow.resource_name || '').toLowerCase().includes('drag')
                || String(rRow.resource_name || '').toLowerCase().includes('annotation 1')
                || (
                    String(rRow.resource_name || '').toLowerCase().includes('annotation')
                    && !String(rRow.resource_name || '').toLowerCase().includes('label')
                    && !String(rRow.resource_name || '').toLowerCase().includes('2')
                )
            ) && (
                String(rRow.resource_name || '').toLowerCase().includes('bpd')
                || String(rRow.resource_topic || '').toLowerCase().includes('bpd')
                || String(rRow.module_name || '').toLowerCase().includes('bpd')
                || String(rRow.unit_name || '').toLowerCase().includes('bpd')
                || String(rRow.course_name || '').toLowerCase().includes('bpd')
                || String(rRow.resource_name || '').toLowerCase().includes('head')
                || String(rRow.resource_topic || '').toLowerCase().includes('head')
                || String(rRow.module_name || '').toLowerCase().includes('head')
                || String(rRow.unit_name || '').toLowerCase().includes('head')
                || String(rRow.course_name || '').toLowerCase().includes('head')
                || String(rRow.resource_name || '').toLowerCase().includes('transthalamic')
                || String(rRow.resource_topic || '').toLowerCase().includes('transthalamic')
            );
            const isFlAnnot2Res = rRow && (
                String(rRow.resource_name || '').toLowerCase().includes('label')
                || String(rRow.resource_name || '').toLowerCase().includes('annotation 2')
                || String(rRow.resource_name || '').toLowerCase().includes('annotation: label')
            ) && (
                String(rRow.resource_name || '').toLowerCase().includes('fl')
                || String(rRow.resource_topic || '').toLowerCase().includes('fl')
                || String(rRow.module_name || '').toLowerCase().includes('fl')
                || String(rRow.unit_name || '').toLowerCase().includes('fl')
                || String(rRow.course_name || '').toLowerCase().includes('fl')
                || String(rRow.resource_name || '').toLowerCase().includes('femur')
                || String(rRow.resource_topic || '').toLowerCase().includes('femur')
                || String(rRow.module_name || '').toLowerCase().includes('femur')
                || String(rRow.unit_name || '').toLowerCase().includes('femur')
                || String(rRow.course_name || '').toLowerCase().includes('femur')
                || String(rRow.resource_name || '').toLowerCase().includes('femoral')
                || String(rRow.resource_topic || '').toLowerCase().includes('femoral')
                || String(rRow.resource_name || '').toLowerCase().includes('transfemoral')
                || String(rRow.resource_topic || '').toLowerCase().includes('transfemoral')
            );
            if (isFlAnnot2Res) {
                const syntheticQuestions = [1, 2, 3, 4, 5].map(qNo => ({
                    resource_id,
                    mindspark_no: 1,
                    question_no: qNo,
                    question_type: 'annotation2',
                    prompt: 'Label the correct anatomical parts in the image',
                    options: [],
                    correct_answer: {
                        expected_label_count: 2,
                        expected_landmarks: ['Diaphysis', 'Metaphysis'],
                        answer: 'Diaphysis and Metaphysis',
                    },
                    feedback_correct: 'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transfemoral plane. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis. ',
                    feedback_wrong: 'Your annotations are WRONG! \nOops! None of the labelling was done! \nRefer to the annotated reference image of the transfemoral plane and label the key landmarks. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis. ',
                    metadata: {
                        expected_landmarks: ['Diaphysis', 'Metaphysis'],
                    },
                    assets: [],
                    is_active: true,
                }));
                return { status: 'Success', code: 200, data: syntheticQuestions };
            }

            const isFlAnnotRes = !isFlAnnot2Res && rRow && (
                String(rRow.resource_name || '').toLowerCase().includes('drag')
                || String(rRow.resource_name || '').toLowerCase().includes('annotation 1')
                || (
                    String(rRow.resource_name || '').toLowerCase().includes('annotation')
                    && !String(rRow.resource_name || '').toLowerCase().includes('label')
                    && !String(rRow.resource_name || '').toLowerCase().includes('2')
                )
            ) && (
                String(rRow.resource_name || '').toLowerCase().includes('fl')
                || String(rRow.resource_topic || '').toLowerCase().includes('fl')
                || String(rRow.module_name || '').toLowerCase().includes('fl')
                || String(rRow.unit_name || '').toLowerCase().includes('fl')
                || String(rRow.course_name || '').toLowerCase().includes('fl')
                || String(rRow.resource_name || '').toLowerCase().includes('femur')
                || String(rRow.resource_topic || '').toLowerCase().includes('femur')
                || String(rRow.module_name || '').toLowerCase().includes('femur')
                || String(rRow.unit_name || '').toLowerCase().includes('femur')
                || String(rRow.course_name || '').toLowerCase().includes('femur')
                || String(rRow.resource_name || '').toLowerCase().includes('femoral')
                || String(rRow.resource_topic || '').toLowerCase().includes('femoral')
                || String(rRow.resource_name || '').toLowerCase().includes('transfemoral')
                || String(rRow.resource_topic || '').toLowerCase().includes('transfemoral')
            );
            if (isFlAnnotRes) {
                const syntheticQuestions = [1, 2, 3, 4, 5].map(qNo => ({
                    resource_id,
                    mindspark_no: 1,
                    question_no: qNo,
                    question_type: 'annotation1',
                    prompt: 'Label the correct anatomical parts in the image',
                    options: [],
                    correct_answer: {
                        expected_label_count: 2,
                        expected_landmarks: ['Diaphysis', 'Metaphysis'],
                        answer: 'Diaphysis and Metaphysis',
                    },
                    feedback_correct: 'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transfemoral plane.\nThe expected landmarks to be labelled are Diaphysis and Metaphysis.',
                    feedback_wrong: 'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane and understand the key landmarks.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.',
                    metadata: {
                        expected_landmarks: ['Diaphysis', 'Metaphysis'],
                    },
                    assets: [],
                    is_active: true,
                }));
                return { status: 'Success', code: 200, data: syntheticQuestions };
            }

            const isAcAnnotRes = !isFlAnnotRes && rRow && (
                String(rRow.resource_name || '').toLowerCase().includes('drag')
                || String(rRow.resource_name || '').toLowerCase().includes('annotation 1')
                || (
                    String(rRow.resource_name || '').toLowerCase().includes('annotation')
                    && !String(rRow.resource_name || '').toLowerCase().includes('label')
                    && !String(rRow.resource_name || '').toLowerCase().includes('2')
                )
            ) && (
                String(rRow.resource_name || '').toLowerCase().includes('ac')
                || String(rRow.resource_topic || '').toLowerCase().includes('ac')
                || String(rRow.module_name || '').toLowerCase().includes('ac')
                || String(rRow.unit_name || '').toLowerCase().includes('ac')
                || String(rRow.course_name || '').toLowerCase().includes('ac')
                || String(rRow.resource_name || '').toLowerCase().includes('abdomen')
                || String(rRow.resource_topic || '').toLowerCase().includes('abdomen')
                || String(rRow.module_name || '').toLowerCase().includes('abdomen')
                || String(rRow.unit_name || '').toLowerCase().includes('abdomen')
                || String(rRow.course_name || '').toLowerCase().includes('abdomen')
                || String(rRow.resource_name || '').toLowerCase().includes('abdominal')
                || String(rRow.resource_topic || '').toLowerCase().includes('abdominal')
            );
            if (isAcAnnotRes) {
                const syntheticQuestions = [1, 2, 3, 4, 5].map(qNo => ({
                    resource_id,
                    mindspark_no: 1,
                    question_no: qNo,
                    question_type: 'annotation1',
                    prompt: 'Label the correct anatomical parts in the image',
                    options: [],
                    correct_answer: {
                        expected_label_count: 5,
                        expected_landmarks: ['Rib 1', 'Rib 2', 'Stomach bubble', 'Spine', 'Portal vein'],
                        answer: 'Rib 1, Rib 2, Stomach bubble, Spine, Portal vein',
                    },
                    feedback_correct: 'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the abdominal plane.\nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                    feedback_wrong: 'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the abdominal plane and understand the key landmarks.\nThe correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.',
                    metadata: {
                        expected_landmarks: ['Rib 1', 'Rib 2', 'Stomach bubble', 'Spine', 'Portal vein'],
                    },
                    assets: [],
                    is_active: true,
                }));
                return { status: 'Success', code: 200, data: syntheticQuestions };
            }

            const isAcAnnot2Res = rRow && (
                String(rRow.resource_name || '').toLowerCase().includes('label')
                || String(rRow.resource_name || '').toLowerCase().includes('annotation 2')
                || String(rRow.resource_name || '').toLowerCase().includes('annotation: label')
            ) && (
                String(rRow.resource_name || '').toLowerCase().includes('ac')
                || String(rRow.resource_topic || '').toLowerCase().includes('ac')
                || String(rRow.module_name || '').toLowerCase().includes('ac')
                || String(rRow.unit_name || '').toLowerCase().includes('ac')
                || String(rRow.course_name || '').toLowerCase().includes('ac')
                || String(rRow.resource_name || '').toLowerCase().includes('abdomen')
                || String(rRow.resource_topic || '').toLowerCase().includes('abdomen')
                || String(rRow.module_name || '').toLowerCase().includes('abdomen')
                || String(rRow.unit_name || '').toLowerCase().includes('abdomen')
                || String(rRow.course_name || '').toLowerCase().includes('abdomen')
                || String(rRow.resource_name || '').toLowerCase().includes('abdominal')
                || String(rRow.resource_topic || '').toLowerCase().includes('abdominal')
            );
            if (isAcAnnot2Res) {
                const syntheticQuestions = [1, 2, 3, 4, 5].map(qNo => ({
                    resource_id,
                    mindspark_no: 1,
                    question_no: qNo,
                    question_type: 'annotation2',
                    prompt: 'Label the correct anatomical parts in the image',
                    options: [],
                    correct_answer: {
                        expected_label_count: 5,
                        expected_landmarks: ['Rib 1', 'Rib 2', 'Stomach bubble', 'Spine', 'Portal vein'],
                        answer: 'Rib 1, Rib 2, Stomach bubble, Spine, Portal vein',
                    },
                    feedback_correct: 'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the abdominal plane. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein. ',
                    feedback_wrong: 'Your annotations are WRONG! \nOops! None of the labelling was done! \nRefer to the annotated reference image of the abdominal plane and label the key landmarks. \nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein. ',
                    metadata: {
                        expected_landmarks: ['Rib 1', 'Rib 2', 'Stomach bubble', 'Spine', 'Portal vein'],
                    },
                    assets: [],
                    is_active: true,
                }));
                return { status: 'Success', code: 200, data: syntheticQuestions };
            }

            const isBpdAnnot2Res = !isAcAnnot2Res && rRow && (
                String(rRow.resource_name || '').toLowerCase().includes('label')
                || String(rRow.resource_name || '').toLowerCase().includes('annotation 2')
                || String(rRow.resource_name || '').toLowerCase().includes('annotation: label')
            ) && (
                String(rRow.resource_name || '').toLowerCase().includes('bpd')
                || String(rRow.resource_topic || '').toLowerCase().includes('bpd')
                || String(rRow.module_name || '').toLowerCase().includes('bpd')
                || String(rRow.unit_name || '').toLowerCase().includes('bpd')
                || String(rRow.course_name || '').toLowerCase().includes('bpd')
                || String(rRow.resource_name || '').toLowerCase().includes('head')
                || String(rRow.resource_topic || '').toLowerCase().includes('head')
                || String(rRow.module_name || '').toLowerCase().includes('head')
                || String(rRow.unit_name || '').toLowerCase().includes('head')
                || String(rRow.course_name || '').toLowerCase().includes('head')
                || String(rRow.resource_name || '').toLowerCase().includes('transthalamic')
                || String(rRow.resource_topic || '').toLowerCase().includes('transthalamic')
            );
            if (isBpdAnnot2Res) {
                const syntheticQuestions = [1, 2, 3, 4, 5].map(qNo => ({
                    resource_id,
                    mindspark_no: 1,
                    question_no: qNo,
                    question_type: 'annotation2',
                    prompt: 'Label the correct anatomical parts in the image',
                    options: [],
                    correct_answer: {
                        expected_label_count: 5,
                        expected_landmarks: ['Arrow Sign', 'Midline Falx', 'Thalamus', 'CSP', 'Cranium'],
                        answer: 'Arrow Sign, Midline Falx, Thalamus, CSP, Cranium',
                    },
                    feedback_correct: 'Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transthalamic plane. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                    feedback_wrong: 'Your annotations are WRONG!\nOops! None of the labelling was done! \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                    metadata: {
                        expected_landmarks: ['Arrow Sign', 'Midline Falx', 'Thalamus', 'CSP', 'Cranium'],
                    },
                    assets: [],
                    is_active: true,
                }));
                return { status: 'Success', code: 200, data: syntheticQuestions };
            }

            if (isBpdAnnotRes) {
                const syntheticQuestions = [1, 2, 3, 4, 5].map(qNo => ({
                    resource_id,
                    mindspark_no: 1,
                    question_no: qNo,
                    question_type: 'annotation1',
                    prompt: 'Label the correct anatomical parts in the image',
                    options: [],
                    correct_answer: {
                        expected_label_count: 5,
                        expected_landmarks: ['Arrow Sign', 'Midline Falx', 'Thalamus', 'CSP', 'Cranium'],
                        answer: 'Arrow Sign, Midline Falx, Thalamus, CSP, Cranium',
                    },
                    feedback_correct: 'Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transthalamic plane.\nThe expected landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                    feedback_wrong: 'Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transthalamic plane and understand the key landmarks.\nThe correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.',
                    metadata: {
                        expected_landmarks: ['Arrow Sign', 'Midline Falx', 'Thalamus', 'CSP', 'Cranium'],
                    },
                    assets: [],
                    is_active: true,
                }));
                return { status: 'Success', code: 200, data: syntheticQuestions };
            }

            const isBpdHcMeasurementRes = rRow && (
                String(rRow.resource_name || '').toLowerCase().includes('measure')
                || String(rRow.resource_topic || '').toLowerCase().includes('measure')
            ) && (
                String(rRow.resource_name || '').toLowerCase().includes('bpd')
                || String(rRow.resource_name || '').toLowerCase().includes('hc')
                || String(rRow.resource_topic || '').toLowerCase().includes('bpd')
                || String(rRow.resource_topic || '').toLowerCase().includes('head')
                || String(rRow.module_name || '').toLowerCase().includes('bpd')
                || String(rRow.unit_name || '').toLowerCase().includes('bpd')
                || String(rRow.course_name || '').toLowerCase().includes('bpd')
            ) && !String(rRow.resource_name || '').toLowerCase().includes('ac')
              && !String(rRow.resource_name || '').toLowerCase().includes('fl');

            if (isBpdHcMeasurementRes) {
                const syntheticQuestions = Array.from({ length: 15 }, (_, i) => {
                    const qNo = i + 1;
                    if (qNo >= 11) {
                        return {
                            resource_id,
                            mindspark_no: 1,
                            question_no: qNo,
                            question_type: 'measurement',
                            prompt: 'Measure the head circumference using the ellipse method. Compare the measurement with the percentile chart to interpret it based on the given gestational age.',
                            options: [],
                            correct_answer: { answer: 'Normal HC', measurement_type: 'HC', method: 'ellipse' },
                            feedback_correct: 'Excellent work! \nThe ellipse is correctly positioned along the outer border of the cranium. \nYour interpretation based on this measurement is also accurate. ',
                            feedback_wrong: 'Good attempt! \nThe ellipse is correctly placed along the outer border of the cranium; however, the interpretation is incorrect. \nAccording to standard biometry charts, HC values between the 5th and 95th percentiles are considered normal. ',
                            metadata: {
                                measurement_type: 'HC',
                                method: 'ellipse',
                                feedback_wrong_cases: {
                                    case1: 'Good attempt! \nThe ellipse is correctly placed along the outer border of the cranium; however, the interpretation is incorrect. \nAccording to standard biometry charts, HC values between the 5th and 95th percentiles are considered normal. ',
                                    case2: 'The interpretation is correct; however, the ellipse placement does not match the reference standard. \nEnsure the ellipse is positioned accurately along the outer border of the cranium to obtain a valid measurement. ',
                                    case3: 'The measurement and interpretation are both incorrect. \nThe ellipse placement does not match the reference standard and is not positioned along the outer skin edge of the fetal abdomen. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                                },
                            },
                            assets: [],
                            is_active: true,
                        };
                    } else if (qNo >= 6) {
                        return {
                            resource_id,
                            mindspark_no: 1,
                            question_no: qNo,
                            question_type: 'measurement',
                            prompt: 'Place the caliper and measure the Head circumference by measuring  BPD and OFD, and interpret the values given the gestational age given in each case.',
                            options: [],
                            correct_answer: { answer: 'Normal HC', measurement_type: 'HC', method: 'caliper_bpd_ofd' },
                            feedback_correct: 'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct.',
                            feedback_wrong: 'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                            metadata: {
                                measurement_type: 'HC',
                                method: 'caliper_bpd_ofd',
                                feedback_wrong_cases: {
                                    case1: 'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                                    case2: 'Your interpretation is clinically correct, but the caliper placement is inaccurate. \nThe placement is suboptimal and does not align with the standard reference positioning. ',
                                    case3: 'The measurement and interpretation are both incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                                },
                            },
                            assets: [],
                            is_active: true,
                        };
                    } else {
                        return {
                            resource_id,
                            mindspark_no: 1,
                            question_no: qNo,
                            question_type: 'measurement',
                            prompt: 'Place the caliper and measure the Biparietal diameter and interpret the values, given the gestational age for each case.',
                            options: [],
                            correct_answer: { answer: 'Normal BPD', measurement_type: 'BPD', method: 'caliper' },
                            feedback_correct: 'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct.',
                            feedback_wrong: 'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                            metadata: {
                                measurement_type: 'BPD',
                                method: 'caliper',
                                feedback_wrong_cases: {
                                    case1: 'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                                    case2: 'Your interpretation is clinically correct, but the caliper placement is inaccurate. \nThe placement is suboptimal and does not align with the standard reference positioning. ',
                                    case3: 'The measurement and interpretation are both incorrect. \nAccording to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. ',
                                },
                            },
                            assets: [],
                            is_active: true,
                        };
                    }
                });
                return { status: 'Success', code: 200, data: syntheticQuestions };
            }

            const isAcMeasurementRes = !isBpdHcMeasurementRes && rRow && (
                String(rRow.resource_name || '').toLowerCase().includes('measure')
                || String(rRow.resource_topic || '').toLowerCase().includes('measure')
            ) && (
                String(rRow.resource_name || '').toLowerCase().includes('ac')
                || String(rRow.resource_topic || '').toLowerCase().includes('ac')
                || String(rRow.resource_name || '').toLowerCase().includes('abdomen')
                || String(rRow.resource_name || '').toLowerCase().includes('abdominal')
                || String(rRow.resource_topic || '').toLowerCase().includes('abdomen')
                || String(rRow.resource_topic || '').toLowerCase().includes('abdominal')
                || String(rRow.module_name || '').toLowerCase().includes('ac')
                || String(rRow.unit_name || '').toLowerCase().includes('ac')
                || String(rRow.course_name || '').toLowerCase().includes('ac')
            ) && !String(rRow.resource_name || '').toLowerCase().includes('fl')
              && !String(rRow.resource_name || '').toLowerCase().includes('femur');

            if (isAcMeasurementRes) {
                const syntheticQuestions = Array.from({ length: 10 }, (_, i) => {
                    const qNo = i + 1;
                    if (qNo >= 6) {
                        return {
                            resource_id,
                            mindspark_no: 1,
                            question_no: qNo,
                            question_type: 'measurement',
                            prompt: 'Measure the abdominal circumference using the ellipse method. Compare the measurement with the percentile chart to interpret it based on the given gestational age.',
                            options: [],
                            correct_answer: { answer: 'Normal AC', measurement_type: 'AC', method: 'ellipse' },
                            feedback_correct: 'Excellent work! \nThe ellipse is correctly positioned along the outer skin edge of the fetal abdomen. \nYour interpretation based on this measurement is also accurate. ',
                            feedback_wrong: 'Good attempt! \nThe ellipse is accurately placed along the outer skin edge of the fetal abdomen; however, the interpretation is incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                            metadata: {
                                measurement_type: 'AC',
                                method: 'ellipse',
                                feedback_wrong_cases: {
                                    case1: 'Good attempt! \nThe ellipse is accurately placed along the outer skin edge of the fetal abdomen; however, the interpretation is incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                                    case2: 'The interpretation is correct; however, the ellipse placement does not match the reference standard. \nEnsure the ellipse is positioned along the outer skin edge of the fetal abdomen to obtain a valid measurement. ',
                                    case3: 'The measurement and interpretation are both incorrect. \nThe ellipse placement does not match the reference standard and is not positioned along the outer skin edge of the fetal abdomen. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                                },
                            },
                            assets: [],
                            is_active: true,
                        };
                    } else {
                        return {
                            resource_id,
                            mindspark_no: 1,
                            question_no: qNo,
                            question_type: 'measurement',
                            prompt: 'Measure the AC through the APAD and TAD method and interpret the image, given the gestational age',
                            options: [],
                            correct_answer: { answer: 'Normal AC', measurement_type: 'AC', method: 'caliper_apad_tad' },
                            feedback_correct: 'Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct. ',
                            feedback_wrong: 'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                            metadata: {
                                measurement_type: 'AC',
                                method: 'caliper_apad_tad',
                                feedback_wrong_cases: {
                                    case1: 'Well done! Your caliper placement is accurate, but the interpretation is incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                                    case2: 'Your interpretation is clinically correct, but the caliper placement is inaccurate. \nThe placement is suboptimal and does not align with the standard reference positioning. ',
                                    case3: 'The measurement and interpretation are both incorrect. \nAccording to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. ',
                                },
                            },
                            assets: [],
                            is_active: true,
                        };
                    }
                });
                return { status: 'Success', code: 200, data: syntheticQuestions };
            }
        } catch (e) {
            console.error('Error generating fallback measurement questions:', e);
        }
    }

    return { status: 'Success', code: 200, data: normalizedRows };
};

const updateMindSparkQuestion = async (requester, questionId, payload) => {
    if (!isAdmin(requester)) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to update Mindspark questions.'
        };
    }

    await ensureMindSparkQuestionsTable();

    const question = {
        mindspark_no: payload.mindspark_no ?? payload.mindsparkNo,
        question_no: payload.question_no ?? payload.questionNo,
        question_type: payload.question_type ?? payload.questionType,
        prompt: payload.prompt ?? payload.question_query ?? payload.question,
        options: payload.options ?? payload.options_available,
        correct_answer: payload.correct_answer ?? payload.correctAnswer ?? payload.answer,
        feedback_correct: payload.feedback_correct ?? payload.feedbackCorrect,
        feedback_wrong: payload.feedback_wrong ?? payload.feedbackWrong,
        assets: payload.assets,
        metadata: payload.metadata,
        is_active: payload.is_active ?? payload.isActive,
    };

    const result = await client.query(
        `UPDATE mind_spark_questions
         SET
            mindspark_no = COALESCE($2, mindspark_no),
            question_no = COALESCE($3, question_no),
            question_type = COALESCE($4, question_type),
            prompt = COALESCE($5, prompt),
            options = COALESCE($6::jsonb, options),
            correct_answer = COALESCE($7::jsonb, correct_answer),
            feedback_correct = COALESCE($8, feedback_correct),
            feedback_wrong = COALESCE($9, feedback_wrong),
            assets = COALESCE($10::jsonb, assets),
            metadata = COALESCE($11::jsonb, metadata),
            is_active = COALESCE($12, is_active),
            updated_at = NOW()
         WHERE question_id = $1
         RETURNING *`,
        [
            questionId,
            question.mindspark_no,
            question.question_no,
            question.question_type,
            question.prompt,
            question.options !== undefined ? JSON.stringify(question.options) : null,
            question.correct_answer !== undefined ? JSON.stringify(question.correct_answer) : null,
            question.feedback_correct,
            question.feedback_wrong,
            question.assets !== undefined ? JSON.stringify(question.assets) : null,
            question.metadata !== undefined ? JSON.stringify(question.metadata) : null,
            question.is_active ?? null,
        ]
    );

    return { status: 'Success', code: 200, data: result.rows[0] ? await hydrateQuestion(result.rows[0]) : null };
};

const deleteMindSparkQuestion = async (requester, questionId) => {
    if (!isAdmin(requester)) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to delete Mindspark questions.'
        };
    }

    await ensureMindSparkQuestionsTable();

    const result = await client.query(
        `UPDATE mind_spark_questions
         SET is_active = FALSE, updated_at = NOW()
         WHERE question_id = $1
         RETURNING *`,
        [questionId]
    );

    return { status: 'Success', code: 200, data: result.rows[0] ?? null };
};

const getMindSparkAttemptDetails = async (requester, { resource_id, session_id }) => {
    if (!canRead(requester)) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to view Mindspark attempt details.'
        };
    }

    await ensureMindSparkQuestionsTable();

    const latestSessionResult = await client.query(
        `SELECT session_id
         FROM activity_submissions
         WHERE user_id = $1
           AND resource_id = $2
           AND ($3::uuid IS NULL OR session_id = $3::uuid)
         GROUP BY session_id
         ORDER BY MAX(submitted_at) DESC
         LIMIT 1`,
        [requester.user_mail, resource_id, session_id || null]
    );

    const latestSessionId = latestSessionResult.rows[0]?.session_id || null;
    if (!latestSessionId) {
        return {
            status: 'Success',
            code: 200,
            data: [],
            summary: {
                session_id: null,
                total_questions: 0,
                correct_answers: 0,
                wrong_answers: 0,
                score_percentage: null,
            }
        };
    }
   
    const result = await client.query(
        `WITH latest_submissions AS (
            SELECT *
            FROM (
                SELECT
                    ass.*,
                    ROW_NUMBER() OVER (
                        PARTITION BY ass.resource_id, ass.question_no, ass.session_id, ass.user_id
                        ORDER BY ass.submitted_at DESC
                    ) AS row_rank
                FROM activity_submissions ass
                WHERE ass.resource_id = $1
                  AND ass.session_id = $2
                  AND ass.user_id = $3
            ) ranked
            WHERE row_rank = 1
         )
         SELECT
            msq.question_id,
            msq.question_no,
            msq.question_type,
            msq.prompt,
            msq.options,
            msq.correct_answer,
            msq.feedback_correct,
            msq.feedback_wrong,
            msq.assets,
            msq.metadata,
            ass.session_id,
            ass.option_chosen,
            ass.is_correct,
            ass.submitted_at
         FROM mind_spark_questions msq
         LEFT JOIN latest_submissions ass
            ON ass.resource_id = msq.resource_id
           AND ass.question_no = msq.question_no
         WHERE msq.resource_id = $1
           AND msq.is_active = true
         ORDER BY msq.question_no ASC`,
        [resource_id, latestSessionId, requester.user_mail]
    );

    const rows = result.rows;
    const total = rows.length;
    const correct = rows.filter(row => row.is_correct === true).length;
    const wrong = rows.filter(row => row.is_correct === false).length;

    const hydratedRows = await Promise.all(rows.map(hydrateQuestion));
    const normalizedRows = hydratedRows.map(normalizeHydratedMindSparkRow);

    return {
        status: 'Success',
        code: 200,
        data: normalizedRows,
        summary: {
            session_id: latestSessionId,
            total_questions: total,
            correct_answers: correct,
            wrong_answers: wrong,
            score_percentage: total > 0 ? Number(((correct / total) * 100).toFixed(2)) : null,
        }
    };
};

module.exports = {
    ensureMindSparkQuestionsTable,
    createMindSparkQuestions,
    uploadMindSparkAsset,
    getMindSparkQuestions,
    updateMindSparkQuestion,
    deleteMindSparkQuestion,
    getMindSparkAttemptDetails,
};
