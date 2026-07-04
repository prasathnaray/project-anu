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
