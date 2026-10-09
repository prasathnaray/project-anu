

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE SCHEMA IF NOT EXISTS "pgagent";


ALTER SCHEMA "pgagent" OWNER TO "postgres";


COMMENT ON SCHEMA "pgagent" IS 'pgAgent system tables';



COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."gender_enum" AS ENUM (
    'male',
    'female',
    'prefer_not_to_say'
);


ALTER TYPE "public"."gender_enum" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    '99',
    '101',
    '102',
    '103'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_batch_id"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.batch_id := CONCAT('BTHJUL25-MS-', LPAD(NEXTVAL('batch_id_seq')::TEXT, 4, '0'));
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."generate_batch_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_certificate_code"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    cleaned_name TEXT;
    prefix TEXT := '';
    last_code TEXT;
    last_number INT := 0;
BEGIN
    -- Normalize certificate name (remove spaces, dashes, punctuation)
    cleaned_name := LOWER(REGEXP_REPLACE(TRIM(NEW.certificate_name), '[^a-z0-9]', '', 'g'));

    -- Check for UFC prefix
    IF cleaned_name LIKE 'ufc%' THEN
        prefix := 'ufc';
    ELSE
        RETURN NEW; -- No code generation for non-UFC
    END IF;

    -- Find last code with same prefix
    SELECT code INTO last_code
    FROM certification_data
    WHERE code LIKE prefix || '%'
    ORDER BY code DESC
    LIMIT 1;

    -- Extract last number
    IF last_code IS NOT NULL THEN
        last_number := COALESCE((regexp_replace(last_code, '[^0-9]', '', 'g'))::INT, 0);
    END IF;

    -- Build new code
    NEW.code := prefix || LPAD((last_number + 1)::TEXT, 3, '0');

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."generate_certificate_code"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_modified_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_modified_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."access_course_data" (
    "course_id" "text" NOT NULL,
    "user_id" "text",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."access_course_data" OWNER TO "postgres";


COMMENT ON TABLE "public"."access_course_data" IS 'enabling access';



CREATE TABLE IF NOT EXISTS "public"."activity_logs" (
    "id" bigint NOT NULL,
    "user_id" character varying(255),
    "role" character varying(50),
    "action" character varying(100) NOT NULL,
    "module" character varying(100) NOT NULL,
    "target_type" character varying(100),
    "target_id" character varying(255),
    "status" character varying(20) DEFAULT 'SUCCESS'::character varying,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."activity_logs" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."activity_logs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."activity_logs_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."activity_logs_id_seq" OWNED BY "public"."activity_logs"."id";



CREATE TABLE IF NOT EXISTS "public"."activity_submissions" (
    "user_id" "text" NOT NULL,
    "resource_type" character varying(50) NOT NULL,
    "question_no" integer,
    "option_chosen" character varying(10),
    "is_correct" boolean,
    "match_payload" "jsonb",
    "time_taken" integer,
    "has_taken_clue" boolean,
    "total_time_taken" integer,
    "submitted_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "resource_id" "uuid" NOT NULL,
    "session_id" "uuid" NOT NULL
);


ALTER TABLE "public"."activity_submissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."asso_volume" (
    "r_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "vol_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "shadowrec_id" "uuid" DEFAULT "gen_random_uuid"(),
    "steprec_id" "uuid" DEFAULT "gen_random_uuid"()
);


ALTER TABLE "public"."asso_volume" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."batch_data" (
    "batch_id" character varying(20) NOT NULL,
    "batch_name" character varying(50),
    "batch_start_date" character varying(30),
    "batch_end_date" character varying(30),
    "certification_data" "jsonb",
    "curiculum_id" "text",
    "centre_id" "uuid"
);


ALTER TABLE "public"."batch_data" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."batch_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."batch_id_seq" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."batch_people_data" (
    "batch_id" character varying[] NOT NULL,
    "user_id" character varying DEFAULT '50'::character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."batch_people_data" OWNER TO "postgres";


COMMENT ON TABLE "public"."batch_people_data" IS 'This table represents how many people are associated with the batch';



CREATE TABLE IF NOT EXISTS "public"."certification_data" (
    "certificate_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "certificate_name" "text" DEFAULT ''::"text",
    "curiculum_id" "text" DEFAULT ''::"text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "code" character varying,
    "course_kind" "text",
    "owner_scope" "text",
    "owner_centre_id" "uuid",
    "created_by" "text",
    "publication_status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "visibility_mode" "text" DEFAULT 'none'::"text" NOT NULL,
    "ownership_review_required" boolean DEFAULT true NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."certification_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chapter_data" (
    "chapter_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "chapter_name" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "course_id" "uuid"
);


ALTER TABLE "public"."chapter_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_availability" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "text" NOT NULL,
    "certificate_id" "uuid" NOT NULL,
    "access_status" boolean DEFAULT true,
    "is_read" boolean DEFAULT false
);


ALTER TABLE "public"."course_availability" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_batch_assignments" (
    "course_id" "uuid" NOT NULL,
    "centre_id" "uuid" NOT NULL,
    "batch_id" character varying(20) NOT NULL,
    "assigned_by" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."course_batch_assignments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_content_links" (
    "link_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "course_id" "uuid" NOT NULL,
    "resource_id" "uuid",
    "volume_id" "uuid" NOT NULL,
    "shadow_recording_id" "uuid",
    "step_recording_id" "uuid",
    "created_by" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."course_content_links" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_data" (
    "course_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "course_name" character varying(30),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "curiculum_id" character varying
);


ALTER TABLE "public"."course_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_institution_access" (
    "course_id" "uuid" NOT NULL,
    "centre_id" "uuid" NOT NULL,
    "granted_by" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."course_institution_access" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_mapping" (
    "mapping_id" "uuid" NOT NULL,
    "trimester" character varying(50) NOT NULL,
    "anatomy_type" character varying(100) NOT NULL,
    "volume_id" "uuid" NOT NULL,
    "volume_name" character varying(255) NOT NULL,
    "module_name" character varying(100) NOT NULL,
    "course_type" character varying(50) NOT NULL,
    "shadow_recording_id" "uuid",
    "step_recording_id" "uuid",
    "created_by" character varying(100) NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "course_name" character varying(255),
    "description" "text",
    "doctor_name" character varying(255),
    "owner_scope" "text",
    "owner_centre_id" "uuid"
);


ALTER TABLE "public"."course_mapping" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_mapping_migrations" (
    "mapping_id" "uuid" NOT NULL,
    "course_id" "uuid" NOT NULL,
    "migrated_by" "text" NOT NULL,
    "migrated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."course_mapping_migrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_test_data" (
    "plane_identification" "text",
    "image_optimization" "text",
    "measurement" "text",
    "diagnostic_interpretation" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "r_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "text" NOT NULL
);


ALTER TABLE "public"."course_test_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_trainee_overrides" (
    "course_id" "uuid" NOT NULL,
    "centre_id" "uuid" NOT NULL,
    "trainee_id" "text" NOT NULL,
    "state" "text" NOT NULL,
    "assigned_by" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "course_trainee_override_state_check" CHECK (("state" = ANY (ARRAY['assigned'::"text", 'excluded'::"text"])))
);


ALTER TABLE "public"."course_trainee_overrides" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."curiculum_data" (
    "curiculum_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "curiculum_nam" character varying,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."curiculum_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."diagnostic_interpretation" (
    "chart_interp_user" character varying(100),
    "chart_interp_expert" character varying(100),
    "chart_interp_score" numeric(5,2),
    "chart_interp_max_score" numeric(5,2),
    "range_interp_user" character varying(100),
    "range_interp_expert" character varying(100),
    "range_interp_score" numeric(5,2),
    "range_interp_max_score" numeric(5,2),
    "subtotal_score" numeric(5,2),
    "subtotal_max_score" numeric(5,2),
    "session_id" "uuid",
    "id" "text",
    "resource_id" "uuid"
);


ALTER TABLE "public"."diagnostic_interpretation" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."forgot_password_request_activity" (
    "user_mail" character varying(35),
    "ip_address" character varying(35),
    "activity_timestamp" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."forgot_password_request_activity" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ii_test_attempts_logs" (
    "resource_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "test_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "starting_time" timestamp with time zone DEFAULT "now"(),
    "is_completed" boolean DEFAULT false,
    "completed_time" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "text"
);


ALTER TABLE "public"."ii_test_attempts_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."image_optimization" (
    "gain_user" numeric(7,2),
    "gain_expert" numeric(7,2),
    "gain_score" numeric(5,2),
    "gain_max_score" numeric(5,2),
    "depth_user" numeric(7,2),
    "depth_expert" numeric(7,2),
    "depth_score" numeric(5,2),
    "depth_max_score" numeric(5,2),
    "zoom_user" numeric(7,2),
    "zoom_expert" numeric(7,2),
    "zoom_score" numeric(5,2),
    "zoom_max_score" numeric(5,2),
    "focus_user" numeric(7,2),
    "focus_expert" numeric(7,2),
    "focus_score" numeric(5,2),
    "focus_max_score" numeric(5,2),
    "dynamic_range_user" numeric(7,2),
    "dynamic_range_expert" numeric(7,2),
    "dynamic_range_score" numeric(5,2),
    "dynamic_range_max_score" numeric(5,2),
    "subtotal_score" numeric(5,2),
    "subtotal_max_score" numeric(5,2),
    "session_id" "uuid",
    "id" "text",
    "resource_id" "uuid"
);


ALTER TABLE "public"."image_optimization" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ivr_submissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "session_id" "text",
    "attempt_number" integer DEFAULT 1,
    "question_type" "text" NOT NULL,
    "question_no" integer NOT NULL,
    "is_correct" boolean NOT NULL,
    "option_chosen" integer,
    "filename" "text",
    "original_name" "text",
    "storage_path" "text",
    "public_url" "text",
    "mime_type" "text",
    "size" integer,
    "correct_label_count" integer,
    "wrong_label_count" integer,
    "unused_label_count" integer,
    "value" numeric,
    "interpretation" "text",
    "caliper_placement_interpretation" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "ivr_submissions_question_type_check" CHECK (("question_type" = ANY (ARRAY['type1'::"text", 'type2'::"text", 'annotation1'::"text", 'annotation2'::"text", 'measurement'::"text"])))
);


ALTER TABLE "public"."ivr_submissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."learning_module" (
    "learning_module_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "certificate_id" "uuid",
    "course_name" "text",
    "module_name" "text",
    "unit_name" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."learning_module" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."login_activity" (
    "loggin_attempt_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "text",
    "logged_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL
);


ALTER TABLE "public"."login_activity" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."measurements" (
    "measurement_type" character varying(10) NOT NULL,
    "caliper_method" character varying(20),
    "caliper_user_points" "jsonb",
    "caliper_expert_points" "jsonb",
    "caliper_placement_score" numeric(5,2),
    "caliper_placement_max" numeric(5,2),
    "value_user" double precision,
    "value_expert" double precision,
    "value_unit" character varying(10),
    "value_error" double precision,
    "value_score" numeric(5,2),
    "value_max_score" numeric(5,2),
    "user_image_id" character varying(100),
    "expert_image_id" character varying(100),
    "subtotal_score" numeric(5,2),
    "subtotal_max_score" numeric(5,2),
    "session_id" "uuid",
    "id" "text",
    "resource_id" "uuid",
    CONSTRAINT "measurements_measurement_type_check" CHECK ((("measurement_type")::"text" = ANY ((ARRAY['BPD'::character varying, 'HC'::character varying, 'AC'::character varying, 'FL'::character varying])::"text"[])))
);


ALTER TABLE "public"."measurements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mind_spark_questions" (
    "question_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "resource_id" "uuid" NOT NULL,
    "mindspark_no" integer DEFAULT 1 NOT NULL,
    "question_no" integer NOT NULL,
    "question_type" character varying(50) DEFAULT 'MCQ'::character varying NOT NULL,
    "prompt" "text" NOT NULL,
    "options" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "correct_answer" "jsonb" NOT NULL,
    "feedback_correct" "text",
    "feedback_wrong" "text",
    "assets" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_by" character varying(100),
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."mind_spark_questions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mind_sparks" (
    "r_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_opt" "text",
    "correct_opt" "text",
    "status" "text",
    "user_mail" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "mind_spark_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."mind_sparks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."module_data" (
    "module_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "module_name" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "chapter_id" "uuid" NOT NULL
);


ALTER TABLE "public"."module_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" integer NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "receiver_id" "uuid" NOT NULL,
    "message" "text" NOT NULL,
    "link" "text",
    "read" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."notifications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."notifications_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."notifications_id_seq" OWNED BY "public"."notifications"."id";



CREATE TABLE IF NOT EXISTS "public"."plane_identification" (
    "time_taken_user" numeric(10,3),
    "time_taken_expert" numeric(10,3),
    "time_taken_score" numeric(5,2),
    "time_taken_max_score" numeric(5,2),
    "probe_pos_user_x" double precision,
    "probe_pos_user_y" double precision,
    "probe_pos_user_z" double precision,
    "probe_rot_user_x" double precision,
    "probe_rot_user_y" double precision,
    "probe_rot_user_z" double precision,
    "probe_pos_expert_x" double precision,
    "probe_pos_expert_y" double precision,
    "probe_pos_expert_z" double precision,
    "probe_rot_expert_x" double precision,
    "probe_rot_expert_y" double precision,
    "probe_rot_expert_z" double precision,
    "probe_position_score" numeric(5,2),
    "probe_position_max" numeric(5,2),
    "probe_rotation_score" numeric(5,2),
    "probe_rotation_max" numeric(5,2),
    "subtotal_score" numeric(5,2),
    "subtotal_max_score" numeric(5,2),
    "session_id" "uuid",
    "id" "text",
    "resource_id" "uuid"
);


ALTER TABLE "public"."plane_identification" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."practice_results" (
    "resource_id" "uuid" NOT NULL,
    "practice_number" smallint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "text",
    "practice_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "results" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "practice_attempt_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    CONSTRAINT "practice_results_practice_number_check" CHECK (("practice_number" = ANY (ARRAY[1, 2])))
);


ALTER TABLE "public"."practice_results" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."progress_data" (
    "user_id" "text" NOT NULL,
    "is_completed" boolean DEFAULT false NOT NULL,
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "resourse_id" "uuid" NOT NULL
);


ALTER TABLE "public"."progress_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."queries_data" (
    "query_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "subject" character varying(255) NOT NULL,
    "instructor_id" character varying(255),
    "message" "text" NOT NULL,
    "status" character varying(50) DEFAULT 'pending'::character varying,
    "created_by" character varying(255) NOT NULL,
    "created_at" timestamp without time zone DEFAULT ("now"() AT TIME ZONE 'Asia/Kolkata'::"text")
);


ALTER TABLE "public"."queries_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reatt_data" (
    "reatt_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "uploaded_by" "text" NOT NULL,
    "resource_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "certificate_id" "uuid",
    "course_id" "uuid",
    "unit_name" "text",
    "resource_type" "text",
    "max_reattempt_count" "text"
);


ALTER TABLE "public"."reatt_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."resource_data" (
    "resource_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "resource_name" "text",
    "learning_module_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "resource_type" "text",
    "resource_topic" "text",
    "display_order" integer,
    "is_hidden" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."resource_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."scan_centers" (
    "center_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "center_name" character varying(255) NOT NULL,
    "center_email" character varying(255) NOT NULL,
    "center_phone" character varying(20),
    "center_address" "text",
    "admin_user_email" "text" NOT NULL,
    "status" "text" DEFAULT 'Pending'::"text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "scan_centers_status_check" CHECK (("status" = ANY (ARRAY['Active'::"text", 'Inactive'::"text", 'Pending'::"text"])))
);


ALTER TABLE "public"."scan_centers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."session_feedback" (
    "overall_feedback" "text",
    "needs_practice" "jsonb",
    "session_id" "uuid",
    "id" "text",
    "resource_id" "uuid"
);


ALTER TABLE "public"."session_feedback" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."session_scores" (
    "plane_identification_score" numeric(5,2),
    "image_optimization_score" numeric(5,2),
    "measurement_score" numeric(5,2),
    "diagnostic_interpretation_score" numeric(5,2),
    "total_score" numeric(7,2),
    "max_score" numeric(7,2),
    "percentage" numeric(5,2),
    "session_id" "uuid",
    "id" "text",
    "resource_id" "uuid"
);


ALTER TABLE "public"."session_scores" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sessions" (
    "user_id" "text" NOT NULL,
    "session_type" character varying(20) NOT NULL,
    "session_number" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "resource_id" "uuid",
    CONSTRAINT "sessions_session_type_check" CHECK ((("session_type")::"text" = ANY ((ARRAY['practice'::character varying, 'test'::character varying])::"text"[])))
);


ALTER TABLE "public"."sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."streaming_data" (
    "user_id" "text" NOT NULL,
    "status" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "participant_id" "text" NOT NULL
);


ALTER TABLE "public"."streaming_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."streaming_publishers" (
    "user_email" character varying(100) NOT NULL,
    "centre_id" "uuid" NOT NULL,
    "session_id" "uuid" NOT NULL,
    "participant_id" "text" NOT NULL,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "source_stage_arn" "text",
    "activated_at" timestamp with time zone
);


ALTER TABLE "public"."streaming_publishers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."streaming_stages" (
    "centre_id" "uuid" NOT NULL,
    "stage_arn" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."streaming_stages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."streaming_trainee_stages" (
    "user_email" character varying(100) NOT NULL,
    "centre_id" "uuid" NOT NULL,
    "stage_arn" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."streaming_trainee_stages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."submissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "question_type" "text" NOT NULL,
    "question_no" integer NOT NULL,
    "is_correct" boolean,
    "option_chosen" integer,
    "filename" "text",
    "original_name" "text",
    "storage_path" "text",
    "public_url" "text",
    "mime_type" "text",
    "size" integer,
    "correct_label_count" integer,
    "wrong_label_count" integer,
    "unused_label_count" integer,
    "value" numeric,
    "interpretation" "text",
    "caliper_placement_interpretation" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "session_id" "text",
    "user_mail" "text",
    "resource_id" "uuid",
    "partial" numeric(2,1),
    CONSTRAINT "submissions_partial_check" CHECK ((("partial" IS NULL) OR ("partial" = ANY (ARRAY[(0)::numeric, 0.5, (1)::numeric])))),
    CONSTRAINT "submissions_question_type_check" CHECK (("question_type" = ANY (ARRAY['type1'::"text", 'type2'::"text", 'annotation1'::"text", 'annotation2'::"text", 'measurement'::"text"])))
);


ALTER TABLE "public"."submissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."submod_data" (
    "module_id" "uuid" DEFAULT "gen_random_uuid"(),
    "submod_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "submod_name" "text"
);


ALTER TABLE "public"."submod_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."targeted_learning" (
    "target_learning_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tar_name" "text",
    "curiculum_id" "text",
    "certificate_id" "text",
    "learning_module_id" character varying,
    "resources_id" character varying[],
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "start_date" character varying,
    "end_date" character varying,
    "resource_type" "text",
    "trainee_id" character varying[],
    "created_by" character varying
);


ALTER TABLE "public"."targeted_learning" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tenant_access_audit" (
    "audit_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "actor_email" "text" NOT NULL,
    "actor_role" "text" NOT NULL,
    "action" "text" NOT NULL,
    "entity_type" "text" NOT NULL,
    "entity_id" "text",
    "target_centre_id" "uuid",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."tenant_access_audit" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."test_attempts_logs" (
    "r_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "test_attempt_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."test_attempts_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_data" (
    "user_profile_photo" character varying(100),
    "user_name" character varying(50) NOT NULL,
    "user_email" character varying(100) NOT NULL,
    "user_contact_num" character varying(20),
    "user_dob" "date",
    "user_gender" "public"."gender_enum",
    "user_password" "text" NOT NULL,
    "user_role" character varying(20) NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "status" character varying(20) DEFAULT 'active'::character varying,
    "description" character varying(20) DEFAULT ''::character varying,
    "people_id" "uuid" DEFAULT "gen_random_uuid"(),
    "centre_id" "uuid" DEFAULT "gen_random_uuid"(),
    "center_name" "text",
    CONSTRAINT "status_check" CHECK ((("status")::"text" = ANY (ARRAY[('active'::character varying)::"text", ('inactive'::character varying)::"text", ('suspended'::character varying)::"text"])))
);


ALTER TABLE "public"."user_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_sessions" (
    "id" "uuid" NOT NULL,
    "user_email" character varying(100) NOT NULL,
    "role" character varying(20) NOT NULL,
    "centre_id" "uuid",
    "device" character varying(40) DEFAULT 'browser'::character varying NOT NULL,
    "os" character varying(40) DEFAULT 'Unknown'::character varying NOT NULL,
    "login_source" character varying(40) DEFAULT 'Normal Browser'::character varying NOT NULL,
    "ip_address" "inet",
    "logged_in_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_seen_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "revoked_at" timestamp with time zone
);


ALTER TABLE "public"."user_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."vol_recordings" (
    "recording_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "volume_id" "uuid" DEFAULT "gen_random_uuid"(),
    "recording_name" "text",
    "recording_type" "text",
    "rec_files" "jsonb",
    "audio_files" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "text",
    "validation_status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "validated_by" "text",
    "validated_at" timestamp with time zone,
    "image_files" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "manifest_file" "text"
);


ALTER TABLE "public"."vol_recordings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."volume_conv_logs" (
    "volume_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "conversion_completion" boolean,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "converted_by" "text",
    "completed_at" timestamp without time zone,
    "error_message" "text",
    "output_file" "text",
    "output_size" bigint,
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "output_size_kb" numeric(10,2),
    "output_size_mb" numeric(10,2),
    "public_url" "text"
);


ALTER TABLE "public"."volume_conv_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."volume_placements" (
    "placed_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "volume_id" "uuid" NOT NULL,
    "placed_by" "text"
);


ALTER TABLE "public"."volume_placements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."volumes" (
    "volume_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "volume_type" "text",
    "volume_name" "text",
    "volume_ga" "text",
    "volume_fetal_presentation" "text",
    "volume_file" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" boolean DEFAULT false,
    "added_by" "text",
    "approver_id" "text" DEFAULT 'admin@anu.in'::"text",
    "conversion_process_status" boolean DEFAULT false,
    "converted_file_path" "text",
    "trimester" "text",
    "description" "text",
    "owner_scope" "text",
    "owner_centre_id" "uuid",
    "lifecycle_status" "text" DEFAULT 'uploaded'::"text" NOT NULL,
    "ownership_review_required" boolean DEFAULT true NOT NULL,
    "uploader_role" smallint
);


ALTER TABLE "public"."volumes" OWNER TO "postgres";


ALTER TABLE ONLY "public"."activity_logs" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."activity_logs_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."notifications" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."notifications_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."access_course_data"
    ADD CONSTRAINT "access_course_data_pkey" PRIMARY KEY ("course_id");



ALTER TABLE ONLY "public"."access_course_data"
    ADD CONSTRAINT "access_course_data_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."activity_logs"
    ADD CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."asso_volume"
    ADD CONSTRAINT "asso_volume_pkey" PRIMARY KEY ("r_id", "vol_id");



ALTER TABLE ONLY "public"."batch_data"
    ADD CONSTRAINT "batch_data_pkey" PRIMARY KEY ("batch_id");



ALTER TABLE ONLY "public"."batch_people_data"
    ADD CONSTRAINT "batch_people_data_pkey" PRIMARY KEY ("user_id");



ALTER TABLE "public"."certification_data"
    ADD CONSTRAINT "certification_course_kind_check" CHECK ((("course_kind" IS NULL) OR ("course_kind" = ANY (ARRAY['core'::"text", 'specialized'::"text", 'institution'::"text"])))) NOT VALID;



ALTER TABLE "public"."certification_data"
    ADD CONSTRAINT "certification_owner_consistency_check" CHECK ((("owner_scope" IS NULL) OR (("owner_scope" = 'super_admin'::"text") AND ("owner_centre_id" IS NULL) AND ("course_kind" = ANY (ARRAY['core'::"text", 'specialized'::"text"]))) OR (("owner_scope" = 'institution'::"text") AND ("owner_centre_id" IS NOT NULL) AND ("course_kind" = 'institution'::"text")))) NOT VALID;



ALTER TABLE "public"."certification_data"
    ADD CONSTRAINT "certification_owner_scope_check" CHECK ((("owner_scope" IS NULL) OR ("owner_scope" = ANY (ARRAY['super_admin'::"text", 'institution'::"text"])))) NOT VALID;



ALTER TABLE "public"."certification_data"
    ADD CONSTRAINT "certification_publication_status_check" CHECK (("publication_status" = ANY (ARRAY['draft'::"text", 'published'::"text", 'archived'::"text"]))) NOT VALID;



ALTER TABLE "public"."certification_data"
    ADD CONSTRAINT "certification_visibility_mode_check" CHECK (("visibility_mode" = ANY (ARRAY['none'::"text", 'all'::"text", 'selected'::"text"]))) NOT VALID;



ALTER TABLE ONLY "public"."certification_data"
    ADD CONSTRAINT "certifications_pkey" PRIMARY KEY ("certificate_id");



ALTER TABLE ONLY "public"."chapter_data"
    ADD CONSTRAINT "chapter_data_pkey" PRIMARY KEY ("chapter_id");



ALTER TABLE ONLY "public"."course_availability"
    ADD CONSTRAINT "course_availability_pkey" PRIMARY KEY ("certificate_id");



ALTER TABLE ONLY "public"."course_batch_assignments"
    ADD CONSTRAINT "course_batch_assignments_pkey" PRIMARY KEY ("course_id", "centre_id", "batch_id");



ALTER TABLE ONLY "public"."course_content_links"
    ADD CONSTRAINT "course_content_links_course_id_resource_id_volume_id_shadow_key" UNIQUE ("course_id", "resource_id", "volume_id", "shadow_recording_id", "step_recording_id");



ALTER TABLE ONLY "public"."course_content_links"
    ADD CONSTRAINT "course_content_links_pkey" PRIMARY KEY ("link_id");



ALTER TABLE ONLY "public"."course_data"
    ADD CONSTRAINT "course_data_pkey" PRIMARY KEY ("course_id");



ALTER TABLE ONLY "public"."course_institution_access"
    ADD CONSTRAINT "course_institution_access_pkey" PRIMARY KEY ("course_id", "centre_id");



ALTER TABLE ONLY "public"."course_mapping_migrations"
    ADD CONSTRAINT "course_mapping_migrations_pkey" PRIMARY KEY ("mapping_id");



ALTER TABLE ONLY "public"."course_mapping"
    ADD CONSTRAINT "course_mapping_pkey" PRIMARY KEY ("mapping_id");



ALTER TABLE ONLY "public"."course_test_data"
    ADD CONSTRAINT "course_test_data_pkey" PRIMARY KEY ("r_id", "user_id");



ALTER TABLE ONLY "public"."course_trainee_overrides"
    ADD CONSTRAINT "course_trainee_overrides_pkey" PRIMARY KEY ("course_id", "centre_id", "trainee_id");



ALTER TABLE ONLY "public"."curiculum_data"
    ADD CONSTRAINT "curiculum_data_pkey" PRIMARY KEY ("curiculum_id");



ALTER TABLE ONLY "public"."ii_test_attempts_logs"
    ADD CONSTRAINT "ii_test_attempts_logs_pkey" PRIMARY KEY ("test_id");



ALTER TABLE ONLY "public"."ivr_submissions"
    ADD CONSTRAINT "ivr_submissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."learning_module"
    ADD CONSTRAINT "learning_module_pkey" PRIMARY KEY ("learning_module_id");



ALTER TABLE ONLY "public"."login_activity"
    ADD CONSTRAINT "login_activity_pkey" PRIMARY KEY ("loggin_attempt_id");



ALTER TABLE ONLY "public"."mind_spark_questions"
    ADD CONSTRAINT "mind_spark_questions_pkey" PRIMARY KEY ("question_id");



ALTER TABLE ONLY "public"."mind_sparks"
    ADD CONSTRAINT "mind_sparks_pkey" PRIMARY KEY ("mind_spark_id");



ALTER TABLE ONLY "public"."module_data"
    ADD CONSTRAINT "module_data_pkey" PRIMARY KEY ("module_id", "chapter_id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."practice_results"
    ADD CONSTRAINT "practice_results_pkey" PRIMARY KEY ("practice_id", "practice_attempt_id");



ALTER TABLE ONLY "public"."progress_data"
    ADD CONSTRAINT "progress_data_pkey" PRIMARY KEY ("user_id", "resourse_id");



ALTER TABLE ONLY "public"."progress_data"
    ADD CONSTRAINT "progress_data_user_resource_unique" UNIQUE ("user_id", "resourse_id");



ALTER TABLE ONLY "public"."queries_data"
    ADD CONSTRAINT "queries_data_pkey" PRIMARY KEY ("query_id");



ALTER TABLE ONLY "public"."reatt_data"
    ADD CONSTRAINT "reatt_data_pkey" PRIMARY KEY ("reatt_id");



ALTER TABLE "public"."vol_recordings"
    ADD CONSTRAINT "recording_validation_status_check" CHECK (("validation_status" = ANY (ARRAY['draft'::"text", 'validated'::"text", 'rejected'::"text"]))) NOT VALID;



ALTER TABLE ONLY "public"."resource_data"
    ADD CONSTRAINT "resource_data_pkey" PRIMARY KEY ("resource_id", "learning_module_id");



ALTER TABLE ONLY "public"."scan_centers"
    ADD CONSTRAINT "scan_centers_center_email_key" UNIQUE ("center_email");



ALTER TABLE ONLY "public"."scan_centers"
    ADD CONSTRAINT "scan_centers_pkey" PRIMARY KEY ("center_id");



ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."streaming_data"
    ADD CONSTRAINT "streaming_data_pkey" PRIMARY KEY ("user_id", "participant_id");



ALTER TABLE ONLY "public"."streaming_publishers"
    ADD CONSTRAINT "streaming_publishers_participant_id_key" UNIQUE ("participant_id");



ALTER TABLE ONLY "public"."streaming_publishers"
    ADD CONSTRAINT "streaming_publishers_pkey" PRIMARY KEY ("user_email");



ALTER TABLE ONLY "public"."streaming_publishers"
    ADD CONSTRAINT "streaming_publishers_session_id_key" UNIQUE ("session_id");



ALTER TABLE ONLY "public"."streaming_stages"
    ADD CONSTRAINT "streaming_stages_pkey" PRIMARY KEY ("centre_id");



ALTER TABLE ONLY "public"."streaming_stages"
    ADD CONSTRAINT "streaming_stages_stage_arn_key" UNIQUE ("stage_arn");



ALTER TABLE ONLY "public"."streaming_trainee_stages"
    ADD CONSTRAINT "streaming_trainee_stages_pkey" PRIMARY KEY ("user_email");



ALTER TABLE ONLY "public"."streaming_trainee_stages"
    ADD CONSTRAINT "streaming_trainee_stages_stage_arn_key" UNIQUE ("stage_arn");



ALTER TABLE ONLY "public"."submissions"
    ADD CONSTRAINT "submissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."submod_data"
    ADD CONSTRAINT "submod_data_pkey" PRIMARY KEY ("submod_id");



ALTER TABLE ONLY "public"."targeted_learning"
    ADD CONSTRAINT "targeted_learning_pkey" PRIMARY KEY ("target_learning_id");



ALTER TABLE ONLY "public"."tenant_access_audit"
    ADD CONSTRAINT "tenant_access_audit_pkey" PRIMARY KEY ("audit_id");



ALTER TABLE ONLY "public"."test_attempts_logs"
    ADD CONSTRAINT "test_attempts_logs_pkey" PRIMARY KEY ("test_attempt_id");



ALTER TABLE ONLY "public"."user_data"
    ADD CONSTRAINT "user_data_pkey" PRIMARY KEY ("user_email");



ALTER TABLE "public"."user_data"
    ADD CONSTRAINT "user_institution_scope_check" CHECK (((("user_role")::"text" <> ALL ((ARRAY['99'::character varying, '101'::character varying, '102'::character varying, '103'::character varying])::"text"[])) OR ((("user_role")::"text" = '99'::"text") AND ("centre_id" IS NULL)) OR ((("user_role")::"text" = ANY ((ARRAY['101'::character varying, '102'::character varying, '103'::character varying])::"text"[])) AND ("centre_id" IS NOT NULL)))) NOT VALID;



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_data"
    ADD CONSTRAINT "user_table_user_contact_num_key" UNIQUE ("user_contact_num");



ALTER TABLE ONLY "public"."user_data"
    ADD CONSTRAINT "user_table_user_email_key" UNIQUE ("user_email");



ALTER TABLE ONLY "public"."vol_recordings"
    ADD CONSTRAINT "vol_recordings_pkey" PRIMARY KEY ("recording_id");



ALTER TABLE ONLY "public"."volume_conv_logs"
    ADD CONSTRAINT "volume_conv_logs_pkey" PRIMARY KEY ("started_at");



ALTER TABLE ONLY "public"."volume_conv_logs"
    ADD CONSTRAINT "volume_conv_logs_volume_id_key" UNIQUE ("volume_id");



ALTER TABLE ONLY "public"."volume_placements"
    ADD CONSTRAINT "volume_placements_pkey" PRIMARY KEY ("volume_id");



ALTER TABLE "public"."volumes"
    ADD CONSTRAINT "volumes_owner_consistency_check" CHECK ((("owner_scope" IS NULL) OR (("owner_scope" = 'super_admin'::"text") AND ("owner_centre_id" IS NULL)) OR (("owner_scope" = 'institution'::"text") AND ("owner_centre_id" IS NOT NULL)))) NOT VALID;



ALTER TABLE "public"."volumes"
    ADD CONSTRAINT "volumes_owner_scope_check" CHECK ((("owner_scope" IS NULL) OR ("owner_scope" = ANY (ARRAY['super_admin'::"text", 'institution'::"text"])))) NOT VALID;



ALTER TABLE ONLY "public"."volumes"
    ADD CONSTRAINT "volumes_pkey" PRIMARY KEY ("volume_id");



ALTER TABLE "public"."volumes"
    ADD CONSTRAINT "volumes_uploader_role_check" CHECK ((("uploader_role" IS NULL) OR ("uploader_role" = ANY (ARRAY[99, 101, 102])))) NOT VALID;



CREATE INDEX "batch_id_idx" ON "public"."batch_data" USING "btree" ("batch_id");



CREATE INDEX "idx_activity_logs_action" ON "public"."activity_logs" USING "btree" ("action");



CREATE INDEX "idx_activity_logs_created_at" ON "public"."activity_logs" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_activity_logs_module" ON "public"."activity_logs" USING "btree" ("module");



CREATE INDEX "idx_activity_logs_role" ON "public"."activity_logs" USING "btree" ("role");



CREATE INDEX "idx_activity_logs_status" ON "public"."activity_logs" USING "btree" ("status");



CREATE INDEX "idx_activity_logs_user_id" ON "public"."activity_logs" USING "btree" ("user_id");



CREATE INDEX "idx_batch_data_centre_id" ON "public"."batch_data" USING "btree" ("centre_id");



CREATE INDEX "idx_certification_owner" ON "public"."certification_data" USING "btree" ("owner_scope", "owner_centre_id");



CREATE INDEX "idx_certification_publication" ON "public"."certification_data" USING "btree" ("publication_status", "course_kind", "visibility_mode");



CREATE INDEX "idx_course_batch_assignments_batch" ON "public"."course_batch_assignments" USING "btree" ("centre_id", "batch_id", "course_id");



CREATE INDEX "idx_course_content_links_course" ON "public"."course_content_links" USING "btree" ("course_id");



CREATE INDEX "idx_course_institution_access_centre" ON "public"."course_institution_access" USING "btree" ("centre_id", "course_id");



CREATE INDEX "idx_course_mapping_course_type" ON "public"."course_mapping" USING "btree" ("course_type");



CREATE INDEX "idx_course_mapping_module_name" ON "public"."course_mapping" USING "btree" ("module_name");



CREATE INDEX "idx_course_mapping_owner" ON "public"."course_mapping" USING "btree" ("owner_scope", "owner_centre_id");



CREATE INDEX "idx_course_mapping_volume_id" ON "public"."course_mapping" USING "btree" ("volume_id");



CREATE INDEX "idx_course_trainee_overrides_trainee" ON "public"."course_trainee_overrides" USING "btree" ("centre_id", "trainee_id", "course_id");



CREATE INDEX "idx_ivr_question_type" ON "public"."ivr_submissions" USING "btree" ("question_type");



CREATE INDEX "idx_ivr_session_id" ON "public"."ivr_submissions" USING "btree" ("session_id");



CREATE INDEX "idx_ivr_user_id" ON "public"."ivr_submissions" USING "btree" ("user_id");



CREATE INDEX "idx_mind_spark_questions_active" ON "public"."mind_spark_questions" USING "btree" ("is_active");



CREATE INDEX "idx_mind_spark_questions_resource_id" ON "public"."mind_spark_questions" USING "btree" ("resource_id");



CREATE UNIQUE INDEX "idx_mind_spark_questions_unique_question" ON "public"."mind_spark_questions" USING "btree" ("resource_id", "mindspark_no", "question_no");



CREATE INDEX "idx_volume_conv_logs_volume_id" ON "public"."volume_conv_logs" USING "btree" ("volume_id");



CREATE INDEX "idx_volumes_conversion_status" ON "public"."volumes" USING "btree" ("conversion_process_status");



CREATE INDEX "idx_volumes_owner" ON "public"."volumes" USING "btree" ("owner_scope", "owner_centre_id");



CREATE INDEX "idx_volumes_private_access" ON "public"."volumes" USING "btree" ("added_by", "uploader_role", "owner_centre_id");



CREATE INDEX "reatt_data_certificate_id_idx" ON "public"."reatt_data" USING "btree" ("certificate_id");



CREATE INDEX "reatt_data_course_id_idx" ON "public"."reatt_data" USING "btree" ("course_id");



CREATE INDEX "reatt_data_resource_id_idx" ON "public"."reatt_data" USING "btree" ("resource_id");



CREATE INDEX "reatt_data_uploaded_by_idx" ON "public"."reatt_data" USING "btree" ("uploaded_by");



CREATE INDEX "streaming_publishers_centre_idx" ON "public"."streaming_publishers" USING "btree" ("centre_id", "started_at" DESC);



CREATE INDEX "streaming_trainee_stages_centre_idx" ON "public"."streaming_trainee_stages" USING "btree" ("centre_id");



CREATE INDEX "user_sessions_centre_history_idx" ON "public"."user_sessions" USING "btree" ("centre_id", "logged_in_at" DESC);



CREATE INDEX "user_sessions_user_history_idx" ON "public"."user_sessions" USING "btree" ("user_email", "logged_in_at" DESC);



CREATE OR REPLACE TRIGGER "batch_id_trigger" BEFORE INSERT ON "public"."batch_data" FOR EACH ROW EXECUTE FUNCTION "public"."generate_batch_id"();



CREATE OR REPLACE TRIGGER "trg_generate_certificate_code" BEFORE INSERT ON "public"."certification_data" FOR EACH ROW EXECUTE FUNCTION "public"."generate_certificate_code"();



CREATE OR REPLACE TRIGGER "update_volume_conv_logs_modtime" BEFORE UPDATE ON "public"."volume_conv_logs" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



CREATE OR REPLACE TRIGGER "update_volume_conv_logs_updated_at" BEFORE UPDATE ON "public"."volume_conv_logs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."certification_data"
    ADD CONSTRAINT "certification_owner_centre_fk" FOREIGN KEY ("owner_centre_id") REFERENCES "public"."scan_centers"("center_id") NOT VALID;



ALTER TABLE ONLY "public"."course_batch_assignments"
    ADD CONSTRAINT "course_batch_assignments_centre_id_fkey" FOREIGN KEY ("centre_id") REFERENCES "public"."scan_centers"("center_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."course_batch_assignments"
    ADD CONSTRAINT "course_batch_assignments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."certification_data"("certificate_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."course_content_links"
    ADD CONSTRAINT "course_content_links_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."certification_data"("certificate_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."course_content_links"
    ADD CONSTRAINT "course_content_links_volume_id_fkey" FOREIGN KEY ("volume_id") REFERENCES "public"."volumes"("volume_id");



ALTER TABLE ONLY "public"."course_institution_access"
    ADD CONSTRAINT "course_institution_access_centre_id_fkey" FOREIGN KEY ("centre_id") REFERENCES "public"."scan_centers"("center_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."course_institution_access"
    ADD CONSTRAINT "course_institution_access_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."certification_data"("certificate_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."course_mapping_migrations"
    ADD CONSTRAINT "course_mapping_migrations_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."certification_data"("certificate_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."course_trainee_overrides"
    ADD CONSTRAINT "course_trainee_overrides_centre_id_fkey" FOREIGN KEY ("centre_id") REFERENCES "public"."scan_centers"("center_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."course_trainee_overrides"
    ADD CONSTRAINT "course_trainee_overrides_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."certification_data"("certificate_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."diagnostic_interpretation"
    ADD CONSTRAINT "diagnostic_interpretation_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id");



ALTER TABLE ONLY "public"."image_optimization"
    ADD CONSTRAINT "image_optimization_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id");



ALTER TABLE ONLY "public"."ivr_submissions"
    ADD CONSTRAINT "ivr_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."measurements"
    ADD CONSTRAINT "measurements_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id");



ALTER TABLE ONLY "public"."plane_identification"
    ADD CONSTRAINT "plane_identification_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id");



ALTER TABLE ONLY "public"."session_feedback"
    ADD CONSTRAINT "session_feedback_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id");



ALTER TABLE ONLY "public"."session_scores"
    ADD CONSTRAINT "session_scores_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id");



ALTER TABLE ONLY "public"."streaming_publishers"
    ADD CONSTRAINT "streaming_publishers_centre_id_fkey" FOREIGN KEY ("centre_id") REFERENCES "public"."scan_centers"("center_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."streaming_publishers"
    ADD CONSTRAINT "streaming_publishers_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "public"."user_data"("user_email") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."streaming_stages"
    ADD CONSTRAINT "streaming_stages_centre_id_fkey" FOREIGN KEY ("centre_id") REFERENCES "public"."scan_centers"("center_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."streaming_trainee_stages"
    ADD CONSTRAINT "streaming_trainee_stages_centre_id_fkey" FOREIGN KEY ("centre_id") REFERENCES "public"."scan_centers"("center_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."streaming_trainee_stages"
    ADD CONSTRAINT "streaming_trainee_stages_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "public"."user_data"("user_email") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."volumes"
    ADD CONSTRAINT "volumes_owner_centre_fk" FOREIGN KEY ("owner_centre_id") REFERENCES "public"."scan_centers"("center_id") NOT VALID;



ALTER TABLE "public"."access_course_data" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."asso_volume" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."batch_people_data" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."certification_data" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chapter_data" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."course_test_data" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."curiculum_data" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ii_test_attempts_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."learning_module" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."login_activity" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mind_sparks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."module_data" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."progress_data" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."resource_data" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."streaming_data" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."submod_data" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."test_attempts_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."vol_recordings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."volume_conv_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."volume_placements" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."course_availability";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."generate_batch_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_batch_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_batch_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_certificate_code"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_certificate_code"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_certificate_code"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."access_course_data" TO "anon";
GRANT ALL ON TABLE "public"."access_course_data" TO "authenticated";
GRANT ALL ON TABLE "public"."access_course_data" TO "service_role";



GRANT ALL ON TABLE "public"."activity_logs" TO "anon";
GRANT ALL ON TABLE "public"."activity_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."activity_logs" TO "service_role";



GRANT ALL ON SEQUENCE "public"."activity_logs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."activity_logs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."activity_logs_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."activity_submissions" TO "anon";
GRANT ALL ON TABLE "public"."activity_submissions" TO "authenticated";
GRANT ALL ON TABLE "public"."activity_submissions" TO "service_role";



GRANT ALL ON TABLE "public"."asso_volume" TO "anon";
GRANT ALL ON TABLE "public"."asso_volume" TO "authenticated";
GRANT ALL ON TABLE "public"."asso_volume" TO "service_role";



GRANT ALL ON TABLE "public"."batch_data" TO "anon";
GRANT ALL ON TABLE "public"."batch_data" TO "authenticated";
GRANT ALL ON TABLE "public"."batch_data" TO "service_role";



GRANT ALL ON SEQUENCE "public"."batch_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."batch_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."batch_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."batch_people_data" TO "anon";
GRANT ALL ON TABLE "public"."batch_people_data" TO "authenticated";
GRANT ALL ON TABLE "public"."batch_people_data" TO "service_role";



GRANT ALL ON TABLE "public"."certification_data" TO "anon";
GRANT ALL ON TABLE "public"."certification_data" TO "authenticated";
GRANT ALL ON TABLE "public"."certification_data" TO "service_role";



GRANT ALL ON TABLE "public"."chapter_data" TO "anon";
GRANT ALL ON TABLE "public"."chapter_data" TO "authenticated";
GRANT ALL ON TABLE "public"."chapter_data" TO "service_role";



GRANT ALL ON TABLE "public"."course_availability" TO "anon";
GRANT ALL ON TABLE "public"."course_availability" TO "authenticated";
GRANT ALL ON TABLE "public"."course_availability" TO "service_role";



GRANT ALL ON TABLE "public"."course_batch_assignments" TO "anon";
GRANT ALL ON TABLE "public"."course_batch_assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."course_batch_assignments" TO "service_role";



GRANT ALL ON TABLE "public"."course_content_links" TO "anon";
GRANT ALL ON TABLE "public"."course_content_links" TO "authenticated";
GRANT ALL ON TABLE "public"."course_content_links" TO "service_role";



GRANT ALL ON TABLE "public"."course_data" TO "anon";
GRANT ALL ON TABLE "public"."course_data" TO "authenticated";
GRANT ALL ON TABLE "public"."course_data" TO "service_role";



GRANT ALL ON TABLE "public"."course_institution_access" TO "anon";
GRANT ALL ON TABLE "public"."course_institution_access" TO "authenticated";
GRANT ALL ON TABLE "public"."course_institution_access" TO "service_role";



GRANT ALL ON TABLE "public"."course_mapping" TO "anon";
GRANT ALL ON TABLE "public"."course_mapping" TO "authenticated";
GRANT ALL ON TABLE "public"."course_mapping" TO "service_role";



GRANT ALL ON TABLE "public"."course_mapping_migrations" TO "anon";
GRANT ALL ON TABLE "public"."course_mapping_migrations" TO "authenticated";
GRANT ALL ON TABLE "public"."course_mapping_migrations" TO "service_role";



GRANT ALL ON TABLE "public"."course_test_data" TO "anon";
GRANT ALL ON TABLE "public"."course_test_data" TO "authenticated";
GRANT ALL ON TABLE "public"."course_test_data" TO "service_role";



GRANT ALL ON TABLE "public"."course_trainee_overrides" TO "anon";
GRANT ALL ON TABLE "public"."course_trainee_overrides" TO "authenticated";
GRANT ALL ON TABLE "public"."course_trainee_overrides" TO "service_role";



GRANT ALL ON TABLE "public"."curiculum_data" TO "anon";
GRANT ALL ON TABLE "public"."curiculum_data" TO "authenticated";
GRANT ALL ON TABLE "public"."curiculum_data" TO "service_role";



GRANT ALL ON TABLE "public"."diagnostic_interpretation" TO "anon";
GRANT ALL ON TABLE "public"."diagnostic_interpretation" TO "authenticated";
GRANT ALL ON TABLE "public"."diagnostic_interpretation" TO "service_role";



GRANT ALL ON TABLE "public"."forgot_password_request_activity" TO "anon";
GRANT ALL ON TABLE "public"."forgot_password_request_activity" TO "authenticated";
GRANT ALL ON TABLE "public"."forgot_password_request_activity" TO "service_role";



GRANT ALL ON TABLE "public"."ii_test_attempts_logs" TO "anon";
GRANT ALL ON TABLE "public"."ii_test_attempts_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."ii_test_attempts_logs" TO "service_role";



GRANT ALL ON TABLE "public"."image_optimization" TO "anon";
GRANT ALL ON TABLE "public"."image_optimization" TO "authenticated";
GRANT ALL ON TABLE "public"."image_optimization" TO "service_role";



GRANT ALL ON TABLE "public"."ivr_submissions" TO "anon";
GRANT ALL ON TABLE "public"."ivr_submissions" TO "authenticated";
GRANT ALL ON TABLE "public"."ivr_submissions" TO "service_role";



GRANT ALL ON TABLE "public"."learning_module" TO "anon";
GRANT ALL ON TABLE "public"."learning_module" TO "authenticated";
GRANT ALL ON TABLE "public"."learning_module" TO "service_role";



GRANT ALL ON TABLE "public"."login_activity" TO "anon";
GRANT ALL ON TABLE "public"."login_activity" TO "authenticated";
GRANT ALL ON TABLE "public"."login_activity" TO "service_role";



GRANT ALL ON TABLE "public"."measurements" TO "anon";
GRANT ALL ON TABLE "public"."measurements" TO "authenticated";
GRANT ALL ON TABLE "public"."measurements" TO "service_role";



GRANT ALL ON TABLE "public"."mind_spark_questions" TO "anon";
GRANT ALL ON TABLE "public"."mind_spark_questions" TO "authenticated";
GRANT ALL ON TABLE "public"."mind_spark_questions" TO "service_role";



GRANT ALL ON TABLE "public"."mind_sparks" TO "anon";
GRANT ALL ON TABLE "public"."mind_sparks" TO "authenticated";
GRANT ALL ON TABLE "public"."mind_sparks" TO "service_role";



GRANT ALL ON TABLE "public"."module_data" TO "anon";
GRANT ALL ON TABLE "public"."module_data" TO "authenticated";
GRANT ALL ON TABLE "public"."module_data" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."plane_identification" TO "anon";
GRANT ALL ON TABLE "public"."plane_identification" TO "authenticated";
GRANT ALL ON TABLE "public"."plane_identification" TO "service_role";



GRANT ALL ON TABLE "public"."practice_results" TO "anon";
GRANT ALL ON TABLE "public"."practice_results" TO "authenticated";
GRANT ALL ON TABLE "public"."practice_results" TO "service_role";



GRANT ALL ON TABLE "public"."progress_data" TO "anon";
GRANT ALL ON TABLE "public"."progress_data" TO "authenticated";
GRANT ALL ON TABLE "public"."progress_data" TO "service_role";



GRANT ALL ON TABLE "public"."queries_data" TO "anon";
GRANT ALL ON TABLE "public"."queries_data" TO "authenticated";
GRANT ALL ON TABLE "public"."queries_data" TO "service_role";



GRANT ALL ON TABLE "public"."reatt_data" TO "anon";
GRANT ALL ON TABLE "public"."reatt_data" TO "authenticated";
GRANT ALL ON TABLE "public"."reatt_data" TO "service_role";



GRANT ALL ON TABLE "public"."resource_data" TO "anon";
GRANT ALL ON TABLE "public"."resource_data" TO "authenticated";
GRANT ALL ON TABLE "public"."resource_data" TO "service_role";



GRANT ALL ON TABLE "public"."scan_centers" TO "anon";
GRANT ALL ON TABLE "public"."scan_centers" TO "authenticated";
GRANT ALL ON TABLE "public"."scan_centers" TO "service_role";



GRANT ALL ON TABLE "public"."session_feedback" TO "anon";
GRANT ALL ON TABLE "public"."session_feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."session_feedback" TO "service_role";



GRANT ALL ON TABLE "public"."session_scores" TO "anon";
GRANT ALL ON TABLE "public"."session_scores" TO "authenticated";
GRANT ALL ON TABLE "public"."session_scores" TO "service_role";



GRANT ALL ON TABLE "public"."sessions" TO "anon";
GRANT ALL ON TABLE "public"."sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."sessions" TO "service_role";



GRANT ALL ON TABLE "public"."streaming_data" TO "anon";
GRANT ALL ON TABLE "public"."streaming_data" TO "authenticated";
GRANT ALL ON TABLE "public"."streaming_data" TO "service_role";



GRANT ALL ON TABLE "public"."streaming_publishers" TO "anon";
GRANT ALL ON TABLE "public"."streaming_publishers" TO "authenticated";
GRANT ALL ON TABLE "public"."streaming_publishers" TO "service_role";



GRANT ALL ON TABLE "public"."streaming_stages" TO "anon";
GRANT ALL ON TABLE "public"."streaming_stages" TO "authenticated";
GRANT ALL ON TABLE "public"."streaming_stages" TO "service_role";



GRANT ALL ON TABLE "public"."streaming_trainee_stages" TO "anon";
GRANT ALL ON TABLE "public"."streaming_trainee_stages" TO "authenticated";
GRANT ALL ON TABLE "public"."streaming_trainee_stages" TO "service_role";



GRANT ALL ON TABLE "public"."submissions" TO "anon";
GRANT ALL ON TABLE "public"."submissions" TO "authenticated";
GRANT ALL ON TABLE "public"."submissions" TO "service_role";



GRANT ALL ON TABLE "public"."submod_data" TO "anon";
GRANT ALL ON TABLE "public"."submod_data" TO "authenticated";
GRANT ALL ON TABLE "public"."submod_data" TO "service_role";



GRANT ALL ON TABLE "public"."targeted_learning" TO "anon";
GRANT ALL ON TABLE "public"."targeted_learning" TO "authenticated";
GRANT ALL ON TABLE "public"."targeted_learning" TO "service_role";



GRANT ALL ON TABLE "public"."tenant_access_audit" TO "anon";
GRANT ALL ON TABLE "public"."tenant_access_audit" TO "authenticated";
GRANT ALL ON TABLE "public"."tenant_access_audit" TO "service_role";



GRANT ALL ON TABLE "public"."test_attempts_logs" TO "anon";
GRANT ALL ON TABLE "public"."test_attempts_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."test_attempts_logs" TO "service_role";



GRANT ALL ON TABLE "public"."user_data" TO "anon";
GRANT ALL ON TABLE "public"."user_data" TO "authenticated";
GRANT ALL ON TABLE "public"."user_data" TO "service_role";



GRANT ALL ON TABLE "public"."user_sessions" TO "anon";
GRANT ALL ON TABLE "public"."user_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."user_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."vol_recordings" TO "anon";
GRANT ALL ON TABLE "public"."vol_recordings" TO "authenticated";
GRANT ALL ON TABLE "public"."vol_recordings" TO "service_role";



GRANT ALL ON TABLE "public"."volume_conv_logs" TO "anon";
GRANT ALL ON TABLE "public"."volume_conv_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."volume_conv_logs" TO "service_role";



GRANT ALL ON TABLE "public"."volume_placements" TO "anon";
GRANT ALL ON TABLE "public"."volume_placements" TO "authenticated";
GRANT ALL ON TABLE "public"."volume_placements" TO "service_role";



GRANT ALL ON TABLE "public"."volumes" TO "anon";
GRANT ALL ON TABLE "public"."volumes" TO "authenticated";
GRANT ALL ON TABLE "public"."volumes" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
