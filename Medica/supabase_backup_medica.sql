--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_net; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_net IS 'Async HTTP';


--
-- Name: pgagent; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA pgagent;


ALTER SCHEMA pgagent OWNER TO postgres;

--
-- Name: SCHEMA pgagent; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA pgagent IS 'pgAgent system tables';


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: supabase_functions; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA supabase_functions;


ALTER SCHEMA supabase_functions OWNER TO supabase_admin;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: gender_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.gender_enum AS ENUM (
    'male',
    'female',
    'prefer_not_to_say'
);


ALTER TYPE public.gender_enum OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    '99',
    '101',
    '102',
    '103'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
    IF EXISTS (
      SELECT 1
      FROM pg_event_trigger_ddl_commands() AS ev
      JOIN pg_extension AS ext
      ON ev.objid = ext.oid
      WHERE ext.extname = 'pg_net'
    )
    THEN
      GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

      IF EXISTS (
        SELECT FROM pg_extension
        WHERE extname = 'pg_net'
        -- all versions in use on existing projects as of 2025-02-20
        -- version 0.12.0 onwards don't need these applied
        AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
      ) THEN
        ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
        ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

        ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
        ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

        REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
        REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

        GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
        GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      END IF;
    END IF;
  END;
  $$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: generate_batch_id(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_batch_id() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.batch_id := CONCAT('BTHJUL25-MS-', LPAD(NEXTVAL('batch_id_seq')::TEXT, 4, '0'));
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.generate_batch_id() OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


ALTER FUNCTION storage.add_prefixes(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


ALTER FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


ALTER FUNCTION storage.delete_prefix(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


ALTER FUNCTION storage.delete_prefix_hierarchy_trigger() OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION storage.get_level(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


ALTER FUNCTION storage.get_prefix(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


ALTER FUNCTION storage.get_prefixes(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: lock_top_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


ALTER FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_insert_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_update_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_level_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_level_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Set the new level
        NEW."level" := "storage"."get_level"(NEW."name");
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_level_trigger() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.prefixes_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.prefixes_insert_trigger() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

--
-- Name: http_request(); Type: FUNCTION; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE FUNCTION supabase_functions.http_request() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'supabase_functions'
    AS $$
    DECLARE
      request_id bigint;
      payload jsonb;
      url text := TG_ARGV[0]::text;
      method text := TG_ARGV[1]::text;
      headers jsonb DEFAULT '{}'::jsonb;
      params jsonb DEFAULT '{}'::jsonb;
      timeout_ms integer DEFAULT 1000;
    BEGIN
      IF url IS NULL OR url = 'null' THEN
        RAISE EXCEPTION 'url argument is missing';
      END IF;

      IF method IS NULL OR method = 'null' THEN
        RAISE EXCEPTION 'method argument is missing';
      END IF;

      IF TG_ARGV[2] IS NULL OR TG_ARGV[2] = 'null' THEN
        headers = '{"Content-Type": "application/json"}'::jsonb;
      ELSE
        headers = TG_ARGV[2]::jsonb;
      END IF;

      IF TG_ARGV[3] IS NULL OR TG_ARGV[3] = 'null' THEN
        params = '{}'::jsonb;
      ELSE
        params = TG_ARGV[3]::jsonb;
      END IF;

      IF TG_ARGV[4] IS NULL OR TG_ARGV[4] = 'null' THEN
        timeout_ms = 1000;
      ELSE
        timeout_ms = TG_ARGV[4]::integer;
      END IF;

      CASE
        WHEN method = 'GET' THEN
          SELECT http_get INTO request_id FROM net.http_get(
            url,
            params,
            headers,
            timeout_ms
          );
        WHEN method = 'POST' THEN
          payload = jsonb_build_object(
            'old_record', OLD,
            'record', NEW,
            'type', TG_OP,
            'table', TG_TABLE_NAME,
            'schema', TG_TABLE_SCHEMA
          );

          SELECT http_post INTO request_id FROM net.http_post(
            url,
            payload,
            params,
            headers,
            timeout_ms
          );
        ELSE
          RAISE EXCEPTION 'method argument % is invalid', method;
      END CASE;

      INSERT INTO supabase_functions.hooks
        (hook_table_id, hook_name, request_id)
      VALUES
        (TG_RELID, TG_NAME, request_id);

      RETURN NEW;
    END
  $$;


ALTER FUNCTION supabase_functions.http_request() OWNER TO supabase_functions_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: access_course_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.access_course_data (
    course_id text NOT NULL,
    user_id text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.access_course_data OWNER TO postgres;

--
-- Name: TABLE access_course_data; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.access_course_data IS 'enabling access';


--
-- Name: batch_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.batch_data (
    batch_id character varying(20) NOT NULL,
    batch_name character varying(50),
    batch_start_date character varying(30),
    batch_end_date character varying(30),
    course_data jsonb,
    curiculum_id text
);


ALTER TABLE public.batch_data OWNER TO postgres;

--
-- Name: batch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.batch_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.batch_id_seq OWNER TO postgres;

--
-- Name: batch_people_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.batch_people_data (
    batch_id character varying[] NOT NULL,
    user_id character varying DEFAULT '50'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.batch_people_data OWNER TO postgres;

--
-- Name: TABLE batch_people_data; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.batch_people_data IS 'This table represents how many people are associated with the batch';


--
-- Name: chapter_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chapter_data (
    chapter_id uuid DEFAULT gen_random_uuid() NOT NULL,
    chapter_name text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    course_id uuid
);


ALTER TABLE public.chapter_data OWNER TO postgres;

--
-- Name: course_availability; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_availability (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id text NOT NULL,
    course_id uuid NOT NULL,
    access_status boolean DEFAULT true,
    is_read boolean DEFAULT false
);


ALTER TABLE public.course_availability OWNER TO postgres;

--
-- Name: course_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_data (
    course_id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_name character varying(30),
    created_at timestamp with time zone DEFAULT now(),
    curiculum_id character varying
);


ALTER TABLE public.course_data OWNER TO postgres;

--
-- Name: curiculum_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.curiculum_data (
    curiculum_id uuid DEFAULT gen_random_uuid() NOT NULL,
    curiculum_nam character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.curiculum_data OWNER TO postgres;

--
-- Name: forgot_password_request_activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forgot_password_request_activity (
    user_mail character varying(35),
    ip_address character varying(35),
    activity_timestamp timestamp without time zone DEFAULT now()
);


ALTER TABLE public.forgot_password_request_activity OWNER TO postgres;

--
-- Name: module_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.module_data (
    module_id uuid DEFAULT gen_random_uuid() NOT NULL,
    module_name text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    chapter_id uuid NOT NULL
);


ALTER TABLE public.module_data OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    sender_id uuid NOT NULL,
    receiver_id uuid NOT NULL,
    message text NOT NULL,
    link text,
    read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: progress_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.progress_data (
    user_id text NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    resourse_id uuid NOT NULL
);


ALTER TABLE public.progress_data OWNER TO postgres;

--
-- Name: resource_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resource_data (
    resource_id uuid DEFAULT gen_random_uuid() NOT NULL,
    resource_name text,
    module_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL
);


ALTER TABLE public.resource_data OWNER TO postgres;

--
-- Name: streaming_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.streaming_data (
    user_id text NOT NULL,
    status boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    participant_id text NOT NULL
);


ALTER TABLE public.streaming_data OWNER TO postgres;

--
-- Name: submod_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.submod_data (
    module_id uuid DEFAULT gen_random_uuid(),
    submod_id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    submod_name text
);


ALTER TABLE public.submod_data OWNER TO postgres;

--
-- Name: targeted_learning; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.targeted_learning (
    target_learning_id uuid DEFAULT gen_random_uuid() NOT NULL,
    tar_name text,
    curiculum_id text,
    chapter_id text,
    modules_id character varying[],
    resources_id character varying[],
    created_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    start_date character varying,
    end_date character varying,
    course_id text,
    trainee_id character varying[]
);


ALTER TABLE public.targeted_learning OWNER TO postgres;

--
-- Name: user_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_data (
    user_profile_photo character varying(100),
    user_name character varying(50) NOT NULL,
    user_email character varying(100) NOT NULL,
    user_contact_num character varying(20),
    user_dob date,
    user_gender public.gender_enum,
    user_password text NOT NULL,
    user_role character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    status character varying(20) DEFAULT 'active'::character varying,
    description character varying(20) DEFAULT ''::character varying,
    people_id uuid DEFAULT gen_random_uuid(),
    CONSTRAINT status_check CHECK (((status)::text = ANY (ARRAY[('active'::character varying)::text, ('inactive'::character varying)::text, ('suspended'::character varying)::text])))
);


ALTER TABLE public.user_data OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: messages_2025_10_23; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_10_23 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_10_23 OWNER TO supabase_admin;

--
-- Name: messages_2025_10_24; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_10_24 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_10_24 OWNER TO supabase_admin;

--
-- Name: messages_2025_10_25; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_10_25 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_10_25 OWNER TO supabase_admin;

--
-- Name: messages_2025_10_26; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_10_26 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_10_26 OWNER TO supabase_admin;

--
-- Name: messages_2025_10_27; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_10_27 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_10_27 OWNER TO supabase_admin;

--
-- Name: messages_2025_10_28; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_10_28 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_10_28 OWNER TO supabase_admin;

--
-- Name: messages_2025_10_29; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_10_29 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_10_29 OWNER TO supabase_admin;

--
-- Name: messages_2025_10_30; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_10_30 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_10_30 OWNER TO supabase_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE storage.prefixes OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: hooks; Type: TABLE; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE TABLE supabase_functions.hooks (
    id bigint NOT NULL,
    hook_table_id integer NOT NULL,
    hook_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    request_id bigint
);


ALTER TABLE supabase_functions.hooks OWNER TO supabase_functions_admin;

--
-- Name: TABLE hooks; Type: COMMENT; Schema: supabase_functions; Owner: supabase_functions_admin
--

COMMENT ON TABLE supabase_functions.hooks IS 'Supabase Functions Hooks: Audit trail for triggered hooks.';


--
-- Name: hooks_id_seq; Type: SEQUENCE; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE SEQUENCE supabase_functions.hooks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE supabase_functions.hooks_id_seq OWNER TO supabase_functions_admin;

--
-- Name: hooks_id_seq; Type: SEQUENCE OWNED BY; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER SEQUENCE supabase_functions.hooks_id_seq OWNED BY supabase_functions.hooks.id;


--
-- Name: migrations; Type: TABLE; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE TABLE supabase_functions.migrations (
    version text NOT NULL,
    inserted_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE supabase_functions.migrations OWNER TO supabase_functions_admin;

--
-- Name: messages_2025_10_23; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_10_23 FOR VALUES FROM ('2025-10-23 00:00:00') TO ('2025-10-24 00:00:00');


--
-- Name: messages_2025_10_24; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_10_24 FOR VALUES FROM ('2025-10-24 00:00:00') TO ('2025-10-25 00:00:00');


--
-- Name: messages_2025_10_25; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_10_25 FOR VALUES FROM ('2025-10-25 00:00:00') TO ('2025-10-26 00:00:00');


--
-- Name: messages_2025_10_26; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_10_26 FOR VALUES FROM ('2025-10-26 00:00:00') TO ('2025-10-27 00:00:00');


--
-- Name: messages_2025_10_27; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_10_27 FOR VALUES FROM ('2025-10-27 00:00:00') TO ('2025-10-28 00:00:00');


--
-- Name: messages_2025_10_28; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_10_28 FOR VALUES FROM ('2025-10-28 00:00:00') TO ('2025-10-29 00:00:00');


--
-- Name: messages_2025_10_29; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_10_29 FOR VALUES FROM ('2025-10-29 00:00:00') TO ('2025-10-30 00:00:00');


--
-- Name: messages_2025_10_30; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_10_30 FOR VALUES FROM ('2025-10-30 00:00:00') TO ('2025-10-31 00:00:00');


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: hooks id; Type: DEFAULT; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER TABLE ONLY supabase_functions.hooks ALTER COLUMN id SET DEFAULT nextval('supabase_functions.hooks_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id) FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
\.


--
-- Data for Name: access_course_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.access_course_data (course_id, user_id, updated_at) FROM stdin;
\.


--
-- Data for Name: batch_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.batch_data (batch_id, batch_name, batch_start_date, batch_end_date, course_data, curiculum_id) FROM stdin;
BTHJUL25-MS-0039	MR SIM Internal Testing	2025-10-21T18:30:00.000Z	2025-10-30T18:30:00.000Z	["c081843a-d258-4223-8306-15cede84375f"]	5860cba0-c994-4ebb-bf2f-5f3141d6e752
\.


--
-- Data for Name: batch_people_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.batch_people_data (batch_id, user_id, created_at) FROM stdin;
{BTHJUL25-MS-0033}	check@123.com	2025-09-01 05:31:30.473712+00
{BTHJUL25-MS-0034}	chetta@gmail.com	2025-09-01 05:41:36.990773+00
{BTHJUL25-MS-0035,BTHJUL25-MS-0033}	test@test.com	2025-09-02 06:00:37.554146+00
{BTHJUL25-MS-0035}	person@test.co.in	2025-09-02 06:01:52.411325+00
{BTHJUL25-MS-0033}	vish@htic.iitm.ac.in	2025-09-20 09:28:36.964759+00
{BTHJUL25-MS-0033}	rohinth@htic.iitm.ac.in	2025-09-20 10:05:16.306499+00
{BTHJUL25-MS-0036}	test@test.cin	2025-10-03 09:45:50.520741+00
{BTHJUL25-MS-0037}	email3@gmail.com	2025-10-04 06:00:22.352768+00
{BTHJUL25-MS-0037}	tr1@gmail.com	2025-10-04 06:02:42.75233+00
{BTHJUL25-MS-0036,BTHJUL25-MS-0034}	pk@gmail.com	2025-10-07 04:12:25.417644+00
{BTHJUL25-MS-0039}	aparna@gmail.com	2025-10-22 09:11:44.537149+00
{BTHJUL25-MS-0039}	akil@gmail.com	2025-10-22 09:12:47.604886+00
{BTHJUL25-MS-0039}	vasu@gmail.com	2025-10-22 09:16:17.11689+00
{BTHJUL25-MS-0039}	kavin@gmail.com	2025-10-22 09:17:05.764805+00
{BTHJUL25-MS-0039}	kamal@gmail.com	2025-10-22 09:32:47.883742+00
{BTHJUL25-MS-0039}	shah@gmail.com	2025-10-22 09:33:44.574666+00
{BTHJUL25-MS-0039}	dharani@gmail.com	2025-10-22 09:34:44.016548+00
{BTHJUL25-MS-0039}	rokesh@gmail.com	2025-10-22 09:35:36.371497+00
{BTHJUL25-MS-0039}	rohinth@gmail.com	2025-10-22 09:37:51.739827+00
{BTHJUL25-MS-0039}	abiya@gmail.com	2025-10-22 09:38:44.438333+00
\.


--
-- Data for Name: chapter_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chapter_data (chapter_id, chapter_name, created_at, course_id) FROM stdin;
0de1cf27-5fb8-4168-968b-d415f1f46cb1	6 Step Approach	2025-09-18 12:37:03.02323+00	c081843a-d258-4223-8306-15cede84375f
fbf5152c-aa14-4414-a2db-22b12d058711	Biometry	2025-09-22 06:34:09.377559+00	c081843a-d258-4223-8306-15cede84375f
\.


--
-- Data for Name: course_availability; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_availability (created_at, user_id, course_id, access_status, is_read) FROM stdin;
2025-09-02 06:44:46.645618+00	prasath@htic.iitm.ac.in	0e0576fc-31f1-4723-bbc7-49c4edc8821d	t	t
2025-09-02 10:25:10.473144+00	nara@gmail.com	550e8400-e29b-41d4-a716-446655440000	f	t
2025-09-11 10:45:59.588221+00	prasath@htic.iitm.ac.in	5861a431-7db6-4620-9c05-9bb95ee8e20e	t	t
2025-09-22 06:47:33.626454+00	prasath@htic.iitm.ac.in	c081843a-d258-4223-8306-15cede84375f	t	t
\.


--
-- Data for Name: course_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_data (course_id, course_name, created_at, curiculum_id) FROM stdin;
c081843a-d258-4223-8306-15cede84375f	BTC	2025-09-18 06:43:12.146546+00	5860cba0-c994-4ebb-bf2f-5f3141d6e752
97ce26fe-aa47-45ff-951d-e1a1e74ee4c1	SVT	2025-10-03 11:11:34.722053+00	5860cba0-c994-4ebb-bf2f-5f3141d6e752
6b3a8b1d-e5d8-437b-a22a-2482f07ec59e	SVT	2025-10-03 11:12:34.479658+00	5860cba0-c994-4ebb-bf2f-5f3141d6e752
3be214fe-bac3-41a1-9400-e765df24ae6b	Check1998	2025-10-10 04:56:50.210344+00	5860cba0-c994-4ebb-bf2f-5f3141d6e752
\.


--
-- Data for Name: curiculum_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.curiculum_data (curiculum_id, curiculum_nam, created_at) FROM stdin;
5860cba0-c994-4ebb-bf2f-5f3141d6e752	OBG	2025-09-02 05:58:26.671637+00
33b054dc-0dda-48fc-918e-234285cd48c0	QWERTY123	2025-10-07 05:09:35.189575+00
\.


--
-- Data for Name: forgot_password_request_activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.forgot_password_request_activity (user_mail, ip_address, activity_timestamp) FROM stdin;
test@example.com	172.16.101.112	2025-06-30 17:27:18.642749
test@example.com	172.16.101.112	2025-07-01 12:25:23.726862
prasath@htic.iitm.ac.in	::1	2025-07-29 05:34:32.165401
prasath@htic.iitm.ac.in	::1	2025-07-29 06:01:10.126847
prasath@htic.iitm.ac.in	::1	2025-07-29 06:33:54.515357
prasath@htic.iitm.ac.in	::1	2025-07-29 06:34:33.222339
prasath@htic.iitm.ac.in	::1	2025-07-29 06:35:09.888998
prasath@htic.iitm.ac.in	::1	2025-07-29 09:22:19.757816
prasath@htic.iitm.ac.in	::1	2025-07-29 09:22:58.657967
prasath@htic.iitm.ac.in	::1	2025-07-30 17:12:57.671765
prasath@htic.iitm.ac.in	::1	2025-08-07 12:41:12.490117
prasath@htic.iitm.ac.in	::1	2025-08-11 09:40:20.914348
prasath@htic.iitm.ac.in	172.16.101.62	2025-08-21 11:48:56.204432
\.


--
-- Data for Name: module_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.module_data (module_id, module_name, created_at, chapter_id) FROM stdin;
9e8828a9-d9c4-4f9c-895e-93e954012d80	Module-13	2025-09-18 17:22:49.971986+00	0de1cf27-5fb8-4168-968b-d415f1f46cb1
40fdfae3-7884-4e5e-8c68-c206b2183c5b	BPD	2025-09-22 06:29:09.538283+00	0de1cf27-5fb8-4168-968b-d415f1f46cb1
e04ab260-4d2d-41be-9c07-fdef1607b1c8	FL	2025-09-22 12:14:42.463089+00	fbf5152c-aa14-4414-a2db-22b12d058711
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, sender_id, receiver_id, message, link, read, created_at) FROM stdin;
\.


--
-- Data for Name: progress_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.progress_data (user_id, is_completed, updated_at, resourse_id) FROM stdin;
vish@htic.iitm.ac.in	t	2025-09-20 10:31:12.087174+00	254b9d21-d3ce-4013-904b-30cd76a361ce
vish@htic.iitm.ac.in	t	2025-09-20 10:31:20.001517+00	3c1759d6-8533-4eb0-8d64-4d57f776b0e3
vish@htic.iitm.ac.in	t	2025-09-20 10:31:26.994527+00	64172498-ab89-4dda-ba15-085c2a37a27d
vish@htic.iitm.ac.in	t	2025-09-20 10:31:34.656117+00	92f817e5-643d-4fe0-8071-cc963b65a688
vish@htic.iitm.ac.in	t	2025-09-20 10:31:42.320874+00	aa661d7b-e521-4b2b-acf7-373cabba6530
vish@htic.iitm.ac.in	t	2025-09-20 10:31:49.765441+00	be882026-70f8-4fd7-b97b-1be181736eb1
vish@htic.iitm.ac.in	t	2025-09-20 10:31:57.103685+00	e39f6609-0a09-42bb-8195-2b22a1c44eab
person@test.co.in	t	2025-09-20 10:52:03.9266+00	e39f6609-0a09-42bb-8195-2b22a1c44eab
person@test.co.in	t	2025-09-22 05:40:05.356069+00	be882026-70f8-4fd7-b97b-1be181736eb1
person@test.co.in	t	2025-09-22 05:40:24.515006+00	aa661d7b-e521-4b2b-acf7-373cabba6530
person@test.co.in	t	2025-09-22 05:40:43.445417+00	92f817e5-643d-4fe0-8071-cc963b65a688
person@test.co.in	t	2025-09-22 05:40:59.33025+00	64172498-ab89-4dda-ba15-085c2a37a27d
person@test.co.in	t	2025-09-22 05:41:14.388317+00	3c1759d6-8533-4eb0-8d64-4d57f776b0e3
person@test.co.in	t	2025-09-22 05:41:24.447657+00	254b9d21-d3ce-4013-904b-30cd76a361ce
person@test.co.in	t	2025-09-22 06:30:59.322418+00	f2ffd1a5-dedc-4d3f-8e25-e619fc76fe10
person@test.co.in	t	2025-10-03 10:28:35.603262+00	c0acd661-ac88-4c6d-b3dc-ecbe52832e69
test@test.cin	t	2025-10-03 10:33:11.311704+00	3c1759d6-8533-4eb0-8d64-4d57f776b0e3
test@test.cin	t	2025-10-03 10:38:51.776935+00	64172498-ab89-4dda-ba15-085c2a37a27d
test@test.cin	t	2025-10-03 10:38:54.207426+00	92f817e5-643d-4fe0-8071-cc963b65a688
test@test.cin	t	2025-10-03 10:44:53.2074+00	aa661d7b-e521-4b2b-acf7-373cabba6530
test@test.cin	t	2025-10-03 10:44:58.939038+00	f2ffd1a5-dedc-4d3f-8e25-e619fc76fe10
test@test.cin	t	2025-10-03 10:45:25.311019+00	e39f6609-0a09-42bb-8195-2b22a1c44eab
test@test.cin	t	2025-10-03 10:45:34.06262+00	3d265721-0066-48f9-ae09-dbb26a7377eb
person@test.co.in	t	2025-10-03 10:51:00.910084+00	3d265721-0066-48f9-ae09-dbb26a7377eb
test@test.cin	t	2025-10-03 11:17:44.207298+00	be882026-70f8-4fd7-b97b-1be181736eb1
abiya@gmail.com	t	2025-10-25 11:33:15.754055+00	be882026-70f8-4fd7-b97b-1be181736eb1
abiya@gmail.com	t	2025-10-26 09:25:17.935468+00	64172498-ab89-4dda-ba15-085c2a37a27d
abiya@gmail.com	t	2025-10-26 09:25:43.109627+00	aa661d7b-e521-4b2b-acf7-373cabba6530
abiya@gmail.com	t	2025-10-26 09:29:18.942693+00	3c1759d6-8533-4eb0-8d64-4d57f776b0e3
\.


--
-- Data for Name: resource_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resource_data (resource_id, resource_name, module_id, created_at) FROM stdin;
92f817e5-643d-4fe0-8071-cc963b65a688	Learning resource	9e8828a9-d9c4-4f9c-895e-93e954012d80	2025-09-19 06:47:56.154017+00
3c1759d6-8533-4eb0-8d64-4d57f776b0e3	Practice 1	9e8828a9-d9c4-4f9c-895e-93e954012d80	2025-09-19 06:48:07.534582+00
64172498-ab89-4dda-ba15-085c2a37a27d	Practice 2	9e8828a9-d9c4-4f9c-895e-93e954012d80	2025-09-19 06:48:15.640811+00
aa661d7b-e521-4b2b-acf7-373cabba6530	Practise 3	9e8828a9-d9c4-4f9c-895e-93e954012d80	2025-09-19 06:48:23.318506+00
e39f6609-0a09-42bb-8195-2b22a1c44eab	Image interpretation	9e8828a9-d9c4-4f9c-895e-93e954012d80	2025-09-19 06:48:37.001002+00
be882026-70f8-4fd7-b97b-1be181736eb1	Test	9e8828a9-d9c4-4f9c-895e-93e954012d80	2025-09-19 06:48:45.903164+00
254b9d21-d3ce-4013-904b-30cd76a361ce	Image Int 2	9e8828a9-d9c4-4f9c-895e-93e954012d80	2025-09-20 06:14:08.956131+00
f2ffd1a5-dedc-4d3f-8e25-e619fc76fe10	Checking	40fdfae3-7884-4e5e-8c68-c206b2183c5b	2025-09-22 06:29:22.761529+00
c0acd661-ac88-4c6d-b3dc-ecbe52832e69	Practice 4	9e8828a9-d9c4-4f9c-895e-93e954012d80	2025-09-29 09:18:02.550894+00
3d265721-0066-48f9-ae09-dbb26a7377eb	learning resource	e04ab260-4d2d-41be-9c07-fdef1607b1c8	2025-09-29 09:22:42.249763+00
\.


--
-- Data for Name: streaming_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.streaming_data (user_id, status, created_at, participant_id) FROM stdin;
abc@abc.abc	f	2025-08-29 12:00:47.574829+00	c7BrMq3Bui1j
abc@abc.abc	f	2025-08-29 12:01:22.91251+00	EqT9HShgiyDp
abc@abc.abc	f	2025-08-29 12:04:25.142378+00	JDwmkVSAzd7N
abc@abc.abc	f	2025-08-29 12:04:41.240088+00	x82Mt8WkMYWP
abc@abc.abc	f	2025-08-29 12:04:50.000939+00	uGEtYfnDTJUk
abc@abc.abc	f	2025-08-29 12:05:06.762835+00	zRTrQsXkfev5
abc@abc.abc	f	2025-08-30 10:31:06.899289+00	3bAWpNMbHXkR
abc@abc.abc	f	2025-08-30 10:32:23.530016+00	DJFgZB6VR64X
abc@abc.abc	f	2025-08-30 10:37:58.685945+00	8IwcApifIMqC
abc@abc.abc	f	2025-08-30 10:37:58.79014+00	4mcYf7xtMiTF
abc@abc.abc	f	2025-08-30 10:40:46.721963+00	TBJOXLlAnojP
abc@abc.abc	f	2025-08-30 10:40:46.827693+00	TPIX7EaaZiQ2
abc@abc.abc	f	2025-08-30 10:44:27.609588+00	315miFWICzDB
abc@abc.abc	f	2025-08-30 10:44:27.686286+00	iqsxGFdfz0SB
abc@abc.abc	f	2025-08-30 10:51:35.085172+00	DHoT4pKmgbOo
abc@abc.abc	f	2025-08-30 10:51:35.115514+00	NovYvLgFHOcW
abc@abc.abc	f	2025-08-30 10:51:53.461543+00	FV1K7U2HT4Gz
abc@abc.abc	f	2025-08-30 10:51:53.553504+00	PiyAlr98zZW6
abc@abc.abc	f	2025-08-30 10:56:29.213615+00	QSAVcUfcP7w8
abc@abc.abc	f	2025-08-30 10:56:29.243712+00	gNQd24n3aOBx
abc@abc.abc	f	2025-08-30 10:58:42.634346+00	wiGrtnTUduTH
abc@abc.abc	f	2025-09-04 07:10:28.649997+00	TfCfhDzy39Ny
abc@abc.abc	f	2025-09-04 07:30:10.347038+00	JRuBVWGv7ID8
abc@abc.abc	f	2025-09-04 07:34:06.168925+00	Vwb1pQ6U7O24
abc@abc.abc	f	2025-09-04 07:34:11.001891+00	LtBuq4J88lgX
abc@abc.abc	f	2025-09-04 08:18:19.445818+00	kQY8teeTOjwV
abc@abc.abc	f	2025-09-04 10:18:05.599525+00	TC9Q0ZMRnbQI
abc@abc.abc	f	2025-09-04 10:20:29.706195+00	A63BG4fkahhq
abc@abc.abc	f	2025-09-04 10:20:35.03937+00	FjRGkWz9pLkf
abc@abc.abc	f	2025-09-04 10:20:35.16033+00	hJE3aJplQPF2
abc@abc.abc	f	2025-09-04 10:21:52.747073+00	59IDMW8KF5lb
abc@abc.abc	f	2025-09-04 10:21:52.797396+00	7Q5Bw9ABOJSA
abc@abc.abc	f	2025-09-04 10:23:17.021395+00	8IIQiLKJMiBz
abc@abc.abc	f	2025-09-04 10:23:17.069856+00	B8ITOcZNwAcr
abc@abc.abc	f	2025-09-04 10:23:19.449887+00	1B3VYHb6o1yh
abc@abc.abc	f	2025-09-04 10:23:19.494946+00	etdeEQQr8kG1
abc@abc.abc	f	2025-09-04 10:23:44.736991+00	0VRGWHyKnBlq
abc@abc.abc	f	2025-09-04 10:23:44.782921+00	E7V6fvKmuDfg
abc@abc.abc	f	2025-09-04 10:24:25.728739+00	EMzAVOIqUtzd
abc@abc.abc	f	2025-09-04 10:24:25.781659+00	DrDkS0AQxc8d
abc@abc.abc	f	2025-09-04 10:24:28.596638+00	4XYLSY0akfWt
abc@abc.abc	f	2025-09-04 10:24:28.702569+00	6ziQdLDCyTU8
abc@abc.abc	f	2025-09-04 10:28:50.407355+00	VOLF5bBONEDs
abc@abc.abc	f	2025-09-04 10:28:50.456417+00	SEnOJGSCD5yO
abc@abc.abc	f	2025-09-04 10:55:37.640557+00	VoeUkDdRP6kJ
abc@abc.abc	f	2025-09-04 10:55:37.686344+00	46vFi8HXo9t9
abc@abc.abc	f	2025-09-04 11:39:27.980068+00	inV8BZHgDFKO
abc@abc.abc	f	2025-09-04 11:40:00.906169+00	E0aD8XlsgIu8
abc@abc.abc	f	2025-09-04 11:40:06.572058+00	r72andHysPjo
abc@abc.abc	f	2025-09-04 11:45:43.696248+00	OaXnWTny7U2R
abc@abc.abc	f	2025-09-04 11:50:14.771175+00	pZ45JtztTNRW
abc@abc.abc	f	2025-09-04 11:52:40.752191+00	Ae4s55NxB4HJ
abc@abc.abc	f	2025-09-04 12:19:33.689368+00	IfzdCYGkKxng
abc@abc.abc	f	2025-09-04 17:28:24.371892+00	bj6cbLpjuh8k
abc@abc.abc	f	2025-09-04 17:45:47.518989+00	ZxBkoF4XP1YD
abc@abc.abc	f	2025-09-04 17:45:47.5428+00	Zvkg3K1GHEBf
abc@abc.abc	f	2025-09-04 17:45:57.202403+00	Mku57Va5JhKa
abc@abc.abc	f	2025-09-04 17:45:57.222952+00	wAS5hSCHx56V
abc@abc.abc	f	2025-09-04 17:47:20.212929+00	cL3AYFMLlBHl
abc@abc.abc	f	2025-09-04 17:47:20.23786+00	swPps2l2uMg3
abc@abc.abc	f	2025-09-04 17:48:08.116814+00	5wIj73DlXfh6
abc@abc.abc	f	2025-09-04 17:48:08.166161+00	MGn7xA1EnlEU
abc@abc.abc	f	2025-09-04 17:49:41.490034+00	TwPxAYPYDpSL
abc@abc.abc	f	2025-09-04 17:49:41.513082+00	gDf46D17A0eN
abc@abc.abc	f	2025-09-04 17:49:41.534184+00	TDbbCTiodfIA
abc@abc.abc	f	2025-09-04 17:49:41.555179+00	EIygrXorvIMy
abc@abc.abc	f	2025-09-04 17:49:57.057824+00	1ZgOUraHpER8
abc@abc.abc	f	2025-09-04 17:49:57.078608+00	30SRmVPq6892
abc@abc.abc	f	2025-09-04 17:50:08.858901+00	9Q3cxVhYeSXH
abc@abc.abc	f	2025-09-04 17:50:08.879349+00	RxsFQMHBuIVw
abc@abc.com	f	2025-09-04 17:58:08.713903+00	HxC9g2RaD7Vp
abc@abc.com	f	2025-09-04 17:58:08.769382+00	tzELTITQRBBS
abc@abc.com	f	2025-09-04 17:59:42.341104+00	CMBAcw6v6B3l
abc@abc.com	f	2025-09-04 17:59:42.36233+00	rxTQHOYvdsud
abc@abc.abc	f	2025-09-04 18:08:20.546382+00	uqQd8euOed7N
abc@abc.abc	f	2025-09-04 18:08:20.654578+00	hoUXqlvKjZBr
abc@abc.abc	f	2025-09-04 18:22:12.60263+00	QgjATcUHHuri
abc@abc.abc	f	2025-09-04 18:22:12.626721+00	OfyqawPeiL4C
abc@abc.abc	f	2025-09-04 18:23:00.699344+00	VRP8oQZCZj23
abc@abc.abc	f	2025-09-04 18:23:00.725202+00	nEt08RDGpSuU
abc@abc.abc	f	2025-09-04 18:23:10.498515+00	sLCAw9EjXpT9
abc@abc.abc	f	2025-09-04 18:23:10.521333+00	nSZjNTkGB46N
abc@abc.abc	f	2025-09-04 18:23:14.001956+00	xtI85SDKUqrc
abc@abc.abc	f	2025-09-04 18:23:14.022268+00	3DhuH22eKtf6
abc@abc.abc	f	2025-09-04 18:23:17.474775+00	NYUG4FHYYo3j
abc@abc.abc	f	2025-09-04 18:23:17.498551+00	IP2hxkTq3cyQ
abc@abc.abc	f	2025-09-04 18:23:22.607674+00	nw2oJaG0yjDV
abc@abc.abc	f	2025-09-04 18:23:22.659812+00	sjn5nfJk1EyY
abc@abc.abc	f	2025-09-04 18:23:26.796761+00	7rlym0r1sYYV
abc@abc.abc	f	2025-09-04 18:23:26.895934+00	tjgcWgfCoUX6
abc@abc.abc	f	2025-09-04 18:23:38.833175+00	Q032116ObR0w
abc@abc.abc	f	2025-09-04 18:23:38.854979+00	lxqCLuhAYJG1
abc@abc.abc	f	2025-09-04 18:23:41.179346+00	zwifbjwGofgx
abc@abc.abc	f	2025-09-04 18:23:41.20137+00	YwlylrZfLvx2
abc@abc.abc	f	2025-09-04 18:24:12.860037+00	2uCPibcOLTcD
abc@abc.abc	f	2025-09-04 18:24:12.881201+00	f5gmEiC5JZWU
abc@abc.abc	f	2025-09-04 18:26:13.451021+00	O13KJFvbvMR0
abc@abc.abc	f	2025-09-04 18:26:13.473889+00	12q0cm89KImh
abc@abc.abc	f	2025-09-04 18:26:47.310276+00	BNXwyD736oJY
abc@abc.abc	f	2025-09-04 18:26:47.337334+00	2SZQZCWU2W4r
abc@abc.abc	f	2025-09-04 18:27:02.488795+00	b25xoRKxVX4d
abc@abc.abc	f	2025-09-04 18:27:05.490342+00	OygCo670Nt16
abc@abc.abc	f	2025-09-04 18:27:26.476804+00	EJ7wtklSUeun
abc@abc.abc	f	2025-09-04 18:27:26.511575+00	1GFkYs36pLyf
abc@abc.abc	f	2025-09-04 18:28:37.742738+00	ENb17QpDbcap
abc@abc.abc	f	2025-09-04 18:28:42.883367+00	Ec4VN9iLleRU
abc@abc.abc	f	2025-09-04 18:28:42.905861+00	imV74CR30gxh
abc@abc.abc	f	2025-09-04 18:28:50.318975+00	fOOaT6E3l5SW
abc@abc.abc	f	2025-09-04 18:28:50.349321+00	ZTTF60uSTmgw
abc@abc.abc	f	2025-09-04 18:29:30.501233+00	VIo0PpOmLm2J
abc@abc.abc	f	2025-09-04 18:29:31.526661+00	RZgHTyOoZv4N
abc@abc.abc	f	2025-09-04 18:29:35.955839+00	ZA1gEw6gAtrw
abc@abc.abc	f	2025-09-04 18:29:35.991585+00	FfEa44Omry69
abc@abc.abc	f	2025-09-05 04:14:30.191793+00	ad8atU3KDtdl
abc@abc.abc	f	2025-09-05 04:14:30.395182+00	pCDJhSouoJt9
abc@abc.abc	f	2025-09-05 04:14:49.374211+00	t7kPfyIRoha0
abc@abc.abc	f	2025-09-05 04:14:49.428599+00	uvvbEZze9CPm
abc@abc.com	f	2025-09-05 04:21:10.899759+00	6DTpo3oO0RsJ
abc@abc.com	f	2025-09-05 04:21:10.926855+00	NZ96WtAz3SJ4
abc@abc.abc	f	2025-09-17 10:36:07.048331+00	SQydgB46IzTQ
prasath@htic.iitm.ac.in	f	2025-09-05 04:31:37.995036+00	GBqSvlEAQoG5
prasath@htic.iitm.ac.in	f	2025-09-05 04:33:53.143992+00	QUqbKQ4Dg8sN
prasath@htic.iitm.ac.in	f	2025-09-05 04:33:53.215489+00	9gGLofeqlFyt
prasath@htic.iitm.ac.in	f	2025-09-05 04:34:49.301029+00	MERJs7ovBClh
prasath@htic.iitm.ac.in	f	2025-09-05 04:34:49.579345+00	03sjD0n9XDr1
prasath@htic.iitm.ac.in	f	2025-09-05 04:34:53.74774+00	43gSAbqgfcOO
prasath@htic.iitm.ac.in	f	2025-09-05 04:34:54.003362+00	XQlGhE62UXq5
prasath@htic.iitm.ac.in	f	2025-09-05 04:37:05.98543+00	1JWxIxXG7Fjn
prasath@htic.iitm.ac.in	f	2025-09-05 04:37:06.207995+00	KbPLW8Eq9nje
prasath@htic.iitm.ac.in	f	2025-09-05 04:40:42.991156+00	QgNzu0HnI7S4
prasath@htic.iitm.ac.in	f	2025-09-05 04:40:43.012632+00	II97gzU6IX3u
prasath@htic.iitm.ac.in	f	2025-09-05 04:40:58.150171+00	fAqrNwGxe5vO
prasath@htic.iitm.ac.in	f	2025-09-05 04:40:58.21098+00	JPCnAXpTo9KN
prasath@htic.iitm.ac.in	f	2025-09-05 04:41:35.034532+00	Qr4X3r2L47oe
prasath@htic.iitm.ac.in	f	2025-09-05 04:41:35.061886+00	pQjP9ror3Cke
prasath@htic.iitm.ac.in	f	2025-09-05 04:41:51.675664+00	3hsosAj9AwHk
prasath@htic.iitm.ac.in	f	2025-09-05 04:41:51.706661+00	FF0DTdJg0lkR
prasath@htic.iitm.ac.in	f	2025-09-05 04:45:13.121823+00	9RYwg7twafL5
prasath@htic.iitm.ac.in	f	2025-09-05 04:46:58.135251+00	WslQx7Rp8jBp
prasath@htic.iitm.ac.in	f	2025-09-05 04:49:06.756284+00	djEGBMh5fqtr
prasath@htic.iitm.ac.in	f	2025-09-05 04:49:06.827414+00	uoD4LtbNeUuv
prasath@htic.iitm.ac.in	f	2025-09-05 04:49:23.080691+00	x9qFQvA9e5IK
prasath@htic.iitm.ac.in	f	2025-09-05 04:49:23.103204+00	IZM9hhfvfRWA
prasath@htic.iitm.ac.in	f	2025-09-05 04:49:31.090834+00	1wHyWlb828xW
prasath@htic.iitm.ac.in	f	2025-09-05 04:49:31.178573+00	gbYhVOU5Bjsn
prasath@htic.iitm.ac.in	f	2025-09-05 04:49:32.910454+00	5b6H28HMSOL2
prasath@htic.iitm.ac.in	f	2025-09-05 04:49:33.022336+00	Nqy8bbynJoaI
prasath@htic.iitm.ac.in	f	2025-09-05 04:49:41.413127+00	lYv9Rib5flwq
prasath@htic.iitm.ac.in	f	2025-09-05 04:49:41.514988+00	GlB5rBUJyyGr
prasath@htic.iitm.ac.in	f	2025-09-05 04:51:47.537936+00	wKIHDXGsMvme
prasath@htic.iitm.ac.in	f	2025-09-05 04:51:47.566605+00	AcADbnZCePJI
prasath@htic.iitm.ac.in	f	2025-09-05 04:52:48.357501+00	tjcIkZtc6idl
prasath@htic.iitm.ac.in	f	2025-09-05 04:52:48.385719+00	dXZzLfob13dZ
prasath@htic.iitm.ac.in	f	2025-09-05 04:53:05.528809+00	eXb9OuZcrRHq
prasath@htic.iitm.ac.in	f	2025-09-05 04:53:05.550017+00	6PrkBZapgDfG
prasath@htic.iitm.ac.in	f	2025-09-05 04:53:15.06104+00	AdNjSv7BqKCg
prasath@htic.iitm.ac.in	f	2025-09-05 04:53:23.136603+00	b9lvaVdGmxwA
prasath@htic.iitm.ac.in	f	2025-09-05 04:53:25.005396+00	JiYa32qplku5
prasath@htic.iitm.ac.in	f	2025-09-05 04:53:25.046594+00	c2wsbHHhxUIQ
prasath@htic.iitm.ac.in	f	2025-09-05 04:53:31.184435+00	t6nrHsJTzEfi
prasath@htic.iitm.ac.in	f	2025-09-05 04:53:31.206726+00	SzmV7LC1VnAO
prasath@htic.iitm.ac.in	f	2025-09-05 04:53:39.114478+00	CCmh4xglQZpn
prasath@htic.iitm.ac.in	f	2025-09-05 04:53:40.971457+00	Rc5JSXRCDKQt
prasath@htic.iitm.ac.in	f	2025-09-05 04:53:41.009163+00	KMKaWaO9vPVi
prasath@htic.iitm.ac.in	f	2025-09-05 04:57:20.508858+00	Xo1CkCV6rsda
prasath@htic.iitm.ac.in	f	2025-09-05 04:57:20.531626+00	h7cwHjvD0KBE
prasath@htic.iitm.ac.in	f	2025-09-05 04:57:22.118882+00	j0nNqWjgQvzT
prasath@htic.iitm.ac.in	f	2025-09-05 04:57:22.153672+00	SVVaXqBrPt24
prasath@htic.iitm.ac.in	f	2025-09-05 05:11:49.242841+00	e3IFTWnctPcE
prasath@htic.iitm.ac.in	f	2025-09-05 05:12:24.783281+00	D6NGGvdj1MmH
prasath@htic.iitm.ac.in	f	2025-09-05 05:12:24.808784+00	XZXrV75qbDsA
prasath@htic.iitm.ac.in	f	2025-09-05 05:12:44.286846+00	3Oz8lHVjZJut
prasath@htic.iitm.ac.in	f	2025-09-05 05:12:44.310624+00	BfHe3nM40ksz
prasath@htic.iitm.ac.in	f	2025-09-05 05:13:03.912399+00	pRYXlpaQZZ3c
prasath@htic.iitm.ac.in	f	2025-09-05 05:13:03.947099+00	iuNpUmAceKvz
prasath@htic.iitm.ac.in	f	2025-09-05 05:13:39.157973+00	EdKkJvdyd67g
prasath@htic.iitm.ac.in	f	2025-09-05 05:13:39.182186+00	taZGoGOdMjbm
prasath@htic.iitm.ac.in	f	2025-09-05 05:14:23.166353+00	OQSoEieAMtl3
prasath@htic.iitm.ac.in	f	2025-09-05 05:14:25.376231+00	ouiagayZsUKo
prasath@htic.iitm.ac.in	f	2025-09-05 05:14:25.400795+00	iCxcRyBnFZf8
prasath@htic.iitm.ac.in	f	2025-09-05 05:14:31.032121+00	2L3bKlH8xL7a
prasath@htic.iitm.ac.in	f	2025-09-05 05:14:33.160702+00	ruDDP6sEXIn0
prasath@htic.iitm.ac.in	f	2025-09-05 05:14:33.187864+00	suiOgVfJ44C7
prasath@htic.iitm.ac.in	f	2025-09-05 05:22:17.80289+00	uKgLIDXm0WVW
prasath@htic.iitm.ac.in	f	2025-09-05 05:22:17.863811+00	n4Yc67LyXTRx
prasath@htic.iitm.ac.in	f	2025-09-05 05:22:23.176689+00	QuwEsF57NpUE
prasath@htic.iitm.ac.in	f	2025-09-05 05:22:23.212242+00	LqDXI8mZZLuV
prasath@htic.iitm.ac.in	f	2025-09-05 05:22:56.771607+00	m3JI0iTwDvT2
prasath@htic.iitm.ac.in	f	2025-09-05 05:22:56.806282+00	dj7C2qOqRIpS
prasath@htic.iitm.ac.in	f	2025-09-05 05:30:44.053113+00	A3KfPMGcyyRb
prasath@htic.iitm.ac.in	f	2025-09-05 05:30:44.083478+00	8RRIdO7NuxyA
prasath@htic.iitm.ac.in	f	2025-09-05 05:31:45.396379+00	VAf7KwnG9vTx
prasath@htic.iitm.ac.in	f	2025-09-05 05:31:45.424433+00	G1ZO9B8qfeH2
prasath@htic.iitm.ac.in	f	2025-09-05 05:32:55.078108+00	ceWu6tdXsz4N
prasath@htic.iitm.ac.in	f	2025-09-05 05:32:58.523354+00	UPThN9HSn9gp
prasath@htic.iitm.ac.in	f	2025-09-05 05:32:58.544834+00	x4W4XkeSnJdQ
prasath@htic.iitm.ac.in	f	2025-09-05 05:33:14.532462+00	U1ugyE5HdhtO
prasath@htic.iitm.ac.in	f	2025-09-05 05:33:14.558033+00	lAARFp1z4NQC
prasath@htic.iitm.ac.in	f	2025-09-05 05:33:22.018378+00	WpN0XdmC1u70
prasath@htic.iitm.ac.in	f	2025-09-05 05:33:22.048495+00	oWfR7TRvWAtk
prasath@htic.iitm.ac.in	f	2025-09-05 05:35:03.444869+00	7zJF63eWTKF6
prasath@htic.iitm.ac.in	f	2025-09-05 05:35:03.479783+00	PCUGS3Y5O2hI
rokesh@htic.iitm.ac.in	f	2025-09-05 05:35:27.675889+00	z5m5Gtsivcmu
rokesh@htic.iitm.ac.in	f	2025-09-05 05:35:29.834996+00	QBr4avqdqzM0
rokesh@htic.iitm.ac.in	f	2025-09-05 05:35:29.85577+00	MmHx6li7RlFD
prasath@htic.iitm.ac.in	f	2025-09-05 05:35:58.747187+00	PHcc4OAyhN3b
prasath@htic.iitm.ac.in	f	2025-09-05 05:35:58.771075+00	yGiuboEZlM5g
abc@abc.abc	f	2025-09-05 05:39:30.20094+00	kXIfyj8m1UYn
rokesh@htic.iitm.ac.in	f	2025-09-05 05:40:07.756889+00	v8JnqFTXDnsX
rokesh@htic.iitm.ac.in	f	2025-09-05 05:40:08.027299+00	upoTmQzesnXj
prasath@htic.iitm.ac.in	f	2025-09-05 05:41:11.106063+00	JzTtjQFma6W1
prasath@htic.iitm.ac.in	f	2025-09-05 05:41:18.791499+00	eS3TVXzOWswJ
prasath@htic.iitm.ac.in	f	2025-09-05 05:41:18.842498+00	mGi7xgtnxZWa
rokesh@gmail.com	f	2025-09-05 05:42:59.06083+00	oVzWRIZYZo55
rokesh@gmail.com	f	2025-09-05 05:43:07.429879+00	A3ZlGyA7elGA
rokesh@gmail.com	f	2025-09-05 05:43:07.502186+00	wXj7Vj6zpz6h
prasath@htic.iitm.ac.in	f	2025-09-05 05:44:22.687231+00	r3bRI1gJeAHO
prasath@htic.iitm.ac.in	f	2025-09-05 05:44:22.738997+00	xOJCiEPRayTk
rokesh@gmail.com	f	2025-09-05 05:49:11.397035+00	wNdSEcipusiA
rokesh@gmail.com	f	2025-09-05 05:49:11.420548+00	93OwqmD1EWcV
prasath@htic.iitm.ac.in	f	2025-09-05 05:50:04.112405+00	CuLAdZNWgHJc
prasath@htic.iitm.ac.in	f	2025-09-05 05:50:08.797247+00	ukOuHXOGwAg1
prasath@htic.iitm.ac.in	f	2025-09-05 05:50:08.865776+00	yf1WVYWmmUrg
prasath@htic.iitm.ac.in	f	2025-09-05 05:50:11.957154+00	XWwxuMUDddAY
prasath@htic.iitm.ac.in	f	2025-09-05 05:50:11.979328+00	VXXTrahD7mfM
rokesh@gamer.com	f	2025-09-05 05:51:16.069179+00	LCrH1mzDmA8C
rokesh@gamer.com	f	2025-09-05 05:51:23.33971+00	GWv33QUECRjm
rokesh@gamer.com	f	2025-09-05 05:51:23.363569+00	wNXAzYqVBNbt
rokesh@gamer.com	f	2025-09-05 05:54:09.427791+00	U8A0FNRj4F6S
rokesh@gamer.com	f	2025-09-05 05:54:09.450695+00	9lDOGbxLAT4m
prasath@htic.iitm.ac.in	f	2025-09-05 05:55:05.462165+00	6PkSWS9mnfGN
prasath@htic.iitm.ac.in	f	2025-09-05 05:55:05.491261+00	yfM0PwUIRtdp
rokesh@gamer.com	f	2025-09-05 05:55:38.715749+00	6CaSBMJ6oAMj
rokesh@gamer.com	f	2025-09-05 05:55:38.737859+00	EMD06LkKoR5z
rokesh@gamer.com	f	2025-09-05 05:55:45.024586+00	5TdWY5EK5xRA
rokesh@gamer.com	f	2025-09-05 05:55:45.045957+00	OI8jXdyZf1EV
rokesh@gamer.com	f	2025-09-05 05:55:46.187663+00	LOcZzJB4VHvR
rokesh@gamer.com	f	2025-09-05 05:55:46.214963+00	zlwb7MiRYVRc
prasath@htic.iitm.ac.in	f	2025-09-05 06:00:47.379763+00	5f7faVlX2hCA
prasath@htic.iitm.ac.in	f	2025-09-05 06:00:47.475978+00	lgkVsGCzfYjh
rokesh@data.data	f	2025-09-05 06:00:49.599126+00	DqNsQYAwJuQ8
rokesh@data.data	f	2025-09-05 06:00:49.626363+00	FP6ZxLOaVxIP
rokesh@data.data	f	2025-09-05 06:02:21.899335+00	NEoU95XYsfjG
rokesh@data.data	f	2025-09-05 06:02:21.931045+00	MDDRmULYAgAZ
rokesh@data.data	f	2025-09-05 06:02:56.076487+00	ZKjuR2RB6mgS
rokesh@data.data	f	2025-09-05 06:04:08.07408+00	yM36pNPARBE0
rokesh@data.data	f	2025-09-05 06:04:26.123024+00	Tpsl5qn5lQI4
rokesh@data.data	f	2025-09-05 06:04:29.104463+00	OzK28UKrN64L
rokesh@data.data	f	2025-09-05 06:05:16.07799+00	rfftUmyGSBGC
rokesh@data.data	f	2025-09-05 06:06:02.735873+00	ysAriQx2dTl3
rokesh@data.data	f	2025-09-05 06:06:02.774317+00	Q232rziYfMs4
rokesh@data.data	f	2025-09-05 06:06:07.676845+00	dUk9rW849yG5
rokesh@data.data	f	2025-09-05 06:06:07.702639+00	KzMMhPdpwYI6
prasath@htic.iitm.ac.in	f	2025-09-05 06:06:14.439008+00	6sszIDwIAShK
prasath@htic.iitm.ac.in	f	2025-09-05 06:06:14.486722+00	pR4oNHdUU3dw
rokesh@data.data	f	2025-09-05 06:06:15.602937+00	mhwLhhSAAbK5
rokesh@data.data	f	2025-09-05 06:06:15.630648+00	UGtOVrAU4QPq
rokesh@data.data	f	2025-09-05 06:06:36.116458+00	pzGIH97ZWwzN
rokesh@data.data	f	2025-09-05 06:06:41.180532+00	battsXV8USxK
rokesh@data.data	f	2025-09-05 06:06:41.207709+00	j5oqcIUyFMCx
rokesh@data.data	f	2025-09-05 06:08:12.126061+00	asv1edieHVL5
rokesh@data.data	f	2025-09-05 06:08:19.041435+00	IgkjGHmtvOeh
rokesh@data.data	f	2025-09-05 06:08:19.066815+00	Qh8j2HZzrQop
rokesh@data.data	f	2025-09-05 06:08:55.082014+00	AXgKVQvbOVpV
rokesh@data.data	f	2025-09-05 06:09:44.082708+00	xu39AyMJ05Tm
rokesh@data.data	f	2025-09-05 06:09:49.978851+00	fQgAVa1ztU5T
rokesh@data.data	f	2025-09-05 06:09:50.006952+00	wYKD1YWLvjss
rokesh@data.data	f	2025-09-05 06:10:56.074235+00	oVBssFBqANIh
rokesh@data.data	f	2025-09-05 06:11:00.231508+00	R8zKeTcrbW2j
rokesh@data.data	f	2025-09-05 06:11:00.253491+00	LaHLyZkvDj6H
rokesh@data.data	f	2025-09-05 06:11:47.146615+00	7Om1fXzTy1TA
rokesh@data.data	f	2025-09-05 06:11:52.991325+00	W9FxIjEjmnfD
rokesh@data.data	f	2025-09-05 06:11:53.039659+00	rZupLpifW3Wd
abc@abc.com	f	2025-09-05 06:13:44.15524+00	OAkqklNfjM4O
abc@abc.com	f	2025-09-05 06:14:04.911872+00	4HawdUtEgL7i
abc@abc.com	f	2025-09-05 06:14:05.043695+00	TIrlwF94toiY
subscriber@demo.com	f	2025-09-05 06:17:36.426732+00	dZHVzlb0LejL
subscriber@demo.com	f	2025-09-05 06:17:36.457048+00	aFQwm1La5kp7
subscriber@demo.com	f	2025-09-05 06:17:45.730258+00	IDSmrfoATtBY
subscriber@demo.com	f	2025-09-05 06:17:45.78369+00	ZIUOz5eSealC
abc@abc.com	f	2025-09-05 06:18:24.102574+00	2M3fcqotJwtX
abc@abc.com	f	2025-09-05 06:18:24.136249+00	2LKANXZXqHTs
prasath@htic.iitm.ac.in	f	2025-09-05 06:18:43.561266+00	WKGH0jtyrBtR
prasath@htic.iitm.ac.in	f	2025-09-05 06:18:43.584735+00	az2nLgIMRn2v
prasath@htic.iitm.ac.in	f	2025-09-05 06:19:19.435022+00	rlxfSoBQxmnw
prasath@htic.iitm.ac.in	f	2025-09-05 06:19:19.480527+00	Hdi4nSEzxfmM
prasath@htic.iitm.ac.in	f	2025-09-05 06:23:07.799634+00	Izjqn3aVMpRb
prasath@htic.iitm.ac.in	f	2025-09-05 06:23:07.823383+00	V8VWGR4roRaa
prasath@htic.iitm.ac.in	f	2025-09-05 06:24:33.47202+00	iqVruTLzET1J
prasath@htic.iitm.ac.in	f	2025-09-05 06:24:33.509193+00	clgl1ofc2FWp
prasath@htic.iitm.ac.in	f	2025-09-05 06:29:53.774672+00	K9cYg356XPTo
prasath@htic.iitm.ac.in	f	2025-09-05 06:29:53.808628+00	6M45qkiUmJ8V
prasath@htic.iitm.ac.in	f	2025-09-05 06:31:00.167139+00	BKY2zbfZR2Ul
prasath@htic.iitm.ac.in	f	2025-09-05 06:31:00.196356+00	Gz2oZ3pDV4HU
prasath@htic.iitm.ac.in	f	2025-09-05 06:37:04.204285+00	xzQP9NKBph03
prasath@htic.iitm.ac.in	f	2025-09-05 06:37:40.778455+00	FHvEOHJqAuqD
prasath@htic.iitm.ac.in	f	2025-09-05 06:37:40.837732+00	t2hwKtniBssM
prasath@htic.iitm.ac.in	f	2025-09-05 06:39:26.100391+00	ChwE0D2KxR0y
prasath@htic.iitm.ac.in	f	2025-09-05 06:39:32.330636+00	juHDM8ohGKqB
prasath@htic.iitm.ac.in	f	2025-09-05 06:39:32.352787+00	5DrulB2c14Qb
prasath@htic.iitm.ac.in	f	2025-09-05 06:39:45.103151+00	WK0bjiehqJU4
prasath@htic.iitm.ac.in	f	2025-09-05 06:39:51.139634+00	AYcHCvUUa6FD
prasath@htic.iitm.ac.in	f	2025-09-05 06:40:21.117811+00	SyXzVzsZCkkv
prasath@htic.iitm.ac.in	f	2025-09-05 06:41:02.099971+00	AWeaNEGrF4kj
prasath@htic.iitm.ac.in	f	2025-09-05 06:41:17.287629+00	iztPLLsW9bWA
prasath@htic.iitm.ac.in	f	2025-09-05 06:41:17.319605+00	ODkVZtNofhiZ
prasath@htic.iitm.ac.in	f	2025-09-05 06:41:29.11224+00	kcqw3lHVecA0
prasath@htic.iitm.ac.in	f	2025-09-05 06:41:33.039375+00	QI45Gs4anANI
prasath@htic.iitm.ac.in	f	2025-09-05 06:41:35.392399+00	5VnBBY6Knevs
prasath@htic.iitm.ac.in	f	2025-09-05 06:41:35.417125+00	U5fHAUHGCRPW
prasath@htic.iitm.ac.in	f	2025-09-05 06:43:40.14457+00	Gxtnhszwh7CH
prasath@htic.iitm.ac.in	f	2025-09-05 06:43:40.172822+00	mZiNC0HuN7Ff
prasath@htic.iitm.ac.in	f	2025-09-05 06:43:43.108939+00	EqK17FGdr8fc
prasath@htic.iitm.ac.in	f	2025-09-05 06:43:43.168361+00	1bSOoJT1ZzGp
prasath@htic.iitm.ac.in	f	2025-09-05 06:46:05.123184+00	ZZC217sne7Lc
prasath@htic.iitm.ac.in	f	2025-09-05 06:46:09.088331+00	xOJKOFT2twNY
prasath@htic.iitm.ac.in	f	2025-09-05 06:46:26.080279+00	OIxD53VoE26K
prasath@htic.iitm.ac.in	f	2025-09-05 06:46:33.107611+00	Ow1bE1pxg8E7
prasath@htic.iitm.ac.in	f	2025-09-05 06:46:41.132559+00	ml2fwesMy4iz
prasath@htic.iitm.ac.in	f	2025-09-05 06:46:45.205579+00	21V8rP9BTjnt
prasath@htic.iitm.ac.in	f	2025-09-05 06:47:00.153033+00	FChJcRTPRYkn
prasath@htic.iitm.ac.in	f	2025-09-05 06:47:00.176986+00	JvzZWvRYq2Pe
prasath@htic.iitm.ac.in	f	2025-09-05 06:47:48.156711+00	7O5lZavxWwJi
prasath@htic.iitm.ac.in	f	2025-09-05 06:48:02.124078+00	ERAjTnaMtqjj
prasath@htic.iitm.ac.in	f	2025-09-05 06:48:06.210935+00	cSSJwUizgDhv
prasath@htic.iitm.ac.in	f	2025-09-05 06:48:06.235944+00	AmauTHt7x9OS
prasath@htic.iitm.ac.in	f	2025-09-05 06:48:08.539039+00	GEcOhatwDTiR
prasath@htic.iitm.ac.in	f	2025-09-05 06:48:08.697117+00	O0UESkdpMCLh
prasath@htic.iitm.ac.in	f	2025-09-05 06:48:11.677928+00	8tHwmHKkRbSP
prasath@htic.iitm.ac.in	f	2025-09-05 06:48:11.703965+00	4iEABJttlDfr
prasath@htic.iitm.ac.in	f	2025-09-05 06:48:20.362311+00	EcKlxXFKiPZA
prasath@htic.iitm.ac.in	f	2025-09-05 06:48:27.414783+00	qptJ8dadrZlK
prasath@htic.iitm.ac.in	f	2025-09-05 06:48:27.444506+00	fSOXbITeyxKE
prasath@htic.iitm.ac.in	f	2025-09-05 06:48:44.727787+00	OjMLzFmXfj0M
prasath@htic.iitm.ac.in	f	2025-09-05 06:49:13.394427+00	3WUcy5E31yJt
prasath@htic.iitm.ac.in	f	2025-09-05 06:49:13.423585+00	f3TM27mi25LL
prasath@htic.iitm.ac.in	f	2025-09-05 06:50:08.092996+00	A7t4wbCroygk
prasath@htic.iitm.ac.in	f	2025-09-05 06:50:13.470955+00	EHaLnnUY08Al
prasath@htic.iitm.ac.in	f	2025-09-05 06:50:13.619703+00	MANzejGVKm3W
prasath@htic.iitm.ac.in	f	2025-09-05 06:50:27.20527+00	sj04uAzUl4bm
prasath@htic.iitm.ac.in	f	2025-09-05 06:54:49.837168+00	hFOKdTJaFGyZ
prasath@htic.iitm.ac.in	f	2025-09-05 06:54:49.863335+00	m1N0PkVIf4nv
prasath@htic.iitm.ac.in	f	2025-09-05 06:54:58.035002+00	JQKXxCfbFvD2
prasath@htic.iitm.ac.in	f	2025-09-05 06:54:58.05807+00	5jpzo2o495a8
prasath@htic.iitm.ac.in	f	2025-09-05 06:55:15.754611+00	i5vhOoPHkxxM
prasath@htic.iitm.ac.in	f	2025-09-05 06:55:15.791797+00	4n9lpfNHgn2y
prasath@htic.iitm.ac.in	f	2025-09-05 06:57:07.157699+00	p2Qi7FFV3MuV
prasath@htic.iitm.ac.in	f	2025-09-05 06:57:07.198941+00	zqbWf2SNBC11
prasath@htic.iitm.ac.in	f	2025-09-05 06:57:23.923755+00	L3lRr72IabPc
prasath@htic.iitm.ac.in	f	2025-09-05 06:57:24.083067+00	DKkskZ1T0M4T
prasath@htic.iitm.ac.in	f	2025-09-05 07:06:22.123452+00	ZyKSm5f6BvOR
prasath@htic.iitm.ac.in	f	2025-09-05 07:06:39.110299+00	euNLv2mLgqZH
prasath@htic.iitm.ac.in	f	2025-09-05 07:07:10.673493+00	CZtggsHgjKNF
prasath@htic.iitm.ac.in	f	2025-09-05 07:07:10.696353+00	OiwNuV2hT8n8
prasath@htic.iitm.ac.in	f	2025-09-05 07:07:26.56636+00	Ek6bUWzObwYt
prasath@htic.iitm.ac.in	f	2025-09-05 07:07:26.588196+00	l0TrxLdQ2xNO
prasath@htic.iitm.ac.in	f	2025-09-05 07:07:33.234624+00	EyxP5GjFSikF
prasath@htic.iitm.ac.in	f	2025-09-05 07:07:33.256232+00	h1YHY89jpM9h
prasath@htic.iitm.ac.in	f	2025-09-05 07:16:06.53731+00	dz2oIwPs1Zqc
prasath@htic.iitm.ac.in	f	2025-09-05 07:16:06.635707+00	AjG5sZMCEbR2
prasath@htic.iitm.ac.in	f	2025-09-05 07:16:14.341956+00	obTcJC1UMQOs
prasath@htic.iitm.ac.in	f	2025-09-05 07:16:14.365523+00	KHBvF2OKGm2h
prasath@htic.iitm.ac.in	f	2025-09-05 07:16:59.072573+00	JETvT7n3Ic95
prasath@htic.iitm.ac.in	f	2025-09-05 07:16:59.171474+00	vdSQQImCMQbq
prasath@htic.iitm.ac.in	f	2025-09-05 07:17:28.726742+00	uMQZAreoZ7xp
prasath@htic.iitm.ac.in	f	2025-09-05 07:17:35.723391+00	dCPfBHwI24fu
prasath@htic.iitm.ac.in	f	2025-09-05 07:18:10.68569+00	Lnhfo0XtKXQI
prasath@htic.iitm.ac.in	f	2025-09-05 07:18:10.708211+00	0B3aZoEB8Qve
prasath@htic.iitm.ac.in	f	2025-09-05 07:18:14.001919+00	yg8rPWpAFKPq
prasath@htic.iitm.ac.in	f	2025-09-05 07:29:16.177221+00	7RrEXH3ITudP
prasath@htic.iitm.ac.in	f	2025-09-05 07:29:16.246082+00	KwRa8wZ0LvmH
prasath@htic.iitm.ac.in	f	2025-09-05 07:30:03.573184+00	Y8hvSmbRHVhC
prasath@htic.iitm.ac.in	f	2025-09-05 07:30:04.128301+00	GbA0Askt10Ne
prasath@htic.iitm.ac.in	f	2025-09-05 07:31:34.752426+00	FnsSEo2q1XpN
prasath@htic.iitm.ac.in	f	2025-09-05 07:36:14.811125+00	CKkszTHf6vGE
prasath@htic.iitm.ac.in	f	2025-09-05 07:36:14.871668+00	jC9yOjv5DZ3q
prasath@htic.iitm.ac.in	f	2025-09-05 07:37:08.963799+00	Lb63rZq2h4kT
prasath@htic.iitm.ac.in	f	2025-09-05 07:39:34.734091+00	7r8RHjROpCd9
prasath@htic.iitm.ac.in	f	2025-09-05 07:41:35.527051+00	5dPhwMnwzV3z
prasath@htic.iitm.ac.in	f	2025-09-05 07:41:35.550061+00	5uDsVhdItIxG
prasath@htic.iitm.ac.in	f	2025-09-05 07:42:42.034009+00	lYixbk3Jzpln
prasath@htic.iitm.ac.in	f	2025-09-05 07:42:42.13866+00	rdIr0l1YflgY
prasath@htic.iitm.ac.in	f	2025-09-05 07:42:44.143533+00	Vt4nsqPYZrsG
prasath@htic.iitm.ac.in	f	2025-09-05 07:42:44.168819+00	s940YTgw9IKr
prasath@htic.iitm.ac.in	f	2025-09-05 07:47:33.330591+00	8AOiFYYkHO7L
prasath@htic.iitm.ac.in	f	2025-09-05 07:47:33.379727+00	mB7CAZ6A8My2
prasath@htic.iitm.ac.in	f	2025-09-05 07:47:40.227005+00	3s9AaQIId000
prasath@htic.iitm.ac.in	f	2025-09-05 07:47:40.3251+00	m6DfsAwt68RG
prasath@htic.iitm.ac.in	f	2025-09-05 07:49:36.875621+00	yUGKEBCHJuem
prasath@htic.iitm.ac.in	f	2025-09-05 07:49:43.728212+00	v7YxCrEfNchJ
prasath@htic.iitm.ac.in	f	2025-09-05 07:49:43.752002+00	qa0bd5Urmgfn
prasath@htic.iitm.ac.in	f	2025-09-05 07:50:40.246433+00	mehpjBfVk9zG
prasath@htic.iitm.ac.in	f	2025-09-05 07:50:40.364861+00	9cBUcNzKgLfr
prasath@htic.iitm.ac.in	f	2025-09-05 07:55:59.806544+00	2cYLXuttvsFv
prasath@htic.iitm.ac.in	f	2025-09-05 07:56:13.899862+00	IqehMW3kHbom
prasath@htic.iitm.ac.in	f	2025-09-05 07:56:13.932922+00	86sJkjnUvsAj
prasath@htic.iitm.ac.in-publisher	f	2025-09-05 08:00:45.034828+00	JV5nEQ2LLaHi
prasath@htic.iitm.ac.in-publisher	f	2025-09-05 08:00:45.126719+00	HGiQXEQqmGQr
prasath@htic.iitm.ac.in-publisher	f	2025-09-05 08:01:00.574324+00	WiU6db5eHkZQ
prasath@htic.iitm.ac.in-publisher	f	2025-09-05 08:01:00.597279+00	y6FmCI7WIQAU
prasath@htic.iitm.ac.in-publisher	f	2025-09-05 08:02:40.525572+00	9WrvEjuUDueV
prasath@htic.iitm.ac.in-publisher	f	2025-09-05 08:02:40.549175+00	XR04v7cFDOdc
prasath@htic.iitm.ac.in-publisher	f	2025-09-05 08:04:03.706022+00	WFC9cM4q4w2R
prasath@htic.iitm.ac.in-publisher	f	2025-09-05 08:05:33.480804+00	BVGp8HrWLPAj
prasath@htic.iitm.ac.in	f	2025-09-05 10:17:42.609433+00	8SUFTBy5rsiW
prasath@htic.iitm.ac.in	f	2025-09-05 10:17:42.638943+00	hnJjEgtYZ9lS
prasath@htic.iitm.ac.in	f	2025-09-05 10:17:52.68053+00	oF7UunF3h818
prasath@htic.iitm.ac.in	f	2025-09-05 10:17:52.775838+00	EPBnhpzowDcm
prasath@htic.iitm.ac.in-publisher	f	2025-09-05 10:17:55.329664+00	fQEM48xwbLqD
prasath@htic.iitm.ac.in	f	2025-09-05 10:18:29.130882+00	Ssg6yxewEwfY
prasath@htic.iitm.ac.in	f	2025-09-05 10:18:29.25564+00	Dm5JlSR48hig
prasath@htic.iitm.ac.in-publisher	f	2025-09-05 10:19:14.495984+00	SrfNv06SPsZX
prasath@htic.iitm.ac.in	f	2025-09-05 10:21:33.123739+00	sC8hwNwWDdwV
prasath@htic.iitm.ac.in	f	2025-09-05 10:21:33.541625+00	pmgkqeFiy4We
prasath@htic.iitm.ac.in	f	2025-09-05 10:28:38.345563+00	A79a4qO7ijmX
prasath@htic.iitm.ac.in	f	2025-09-05 10:28:38.374353+00	RtNHYdcC1sUb
prasath@htic.iitm.ac.in	f	2025-09-05 10:28:53.923227+00	nWtkH2jjfRLR
prasath@htic.iitm.ac.in	f	2025-09-05 10:28:53.972226+00	Qx43hwtHayBn
prasath@htic.iitm.ac.in	f	2025-09-05 10:29:09.731975+00	G3PKo1gOhm4M
prasath@htic.iitm.ac.in	f	2025-09-05 10:29:09.775166+00	Xs296piA3Fjq
abc@abc.abc	f	2025-09-05 10:30:53.166272+00	Ai32JvsDmmGc
prasath@htic.iitm.ac.in	f	2025-09-05 10:38:44.535453+00	2xJ5xPZWKTxr
prasath@htic.iitm.ac.in	f	2025-09-05 10:38:44.559538+00	JJnHMozig5jW
prasath@htic.iitm.ac.in	f	2025-09-05 10:38:57.975719+00	0z86kzCro6aM
prasath@htic.iitm.ac.in	f	2025-09-05 10:38:58.038391+00	z6nmyCC7pqg0
prasath@htic.iitm.ac.in	f	2025-09-05 10:39:55.239987+00	2MgLEQMXgCEM
prasath@htic.iitm.ac.in	f	2025-09-05 10:39:55.271405+00	0vv7yC3URaoC
prasath@htic.iitm.ac.in	f	2025-09-05 10:39:56.183568+00	Q7dxzy9Ibq1S
prasath@htic.iitm.ac.in	f	2025-09-05 10:39:56.220054+00	NQ2sD0sIVsEy
prasath@htic.iitm.ac.in	f	2025-09-05 10:39:57.816818+00	4fKsnnEUNfnJ
prasath@htic.iitm.ac.in	f	2025-09-05 10:39:57.852336+00	GMlEspESosti
prasath@htic.iitm.ac.in	f	2025-09-05 10:41:09.726979+00	8uzGznQGvdyB
prasath@htic.iitm.ac.in	f	2025-09-05 10:41:09.807818+00	8c30rzKlvAeh
prasath@htic.iitm.ac.in	f	2025-09-05 10:42:43.179478+00	j2qNThVyCDAU
prasath@htic.iitm.ac.in	f	2025-09-05 10:42:43.209046+00	o3npQhrKBeQT
prasath@htic.iitm.ac.in	f	2025-09-05 10:43:58.922189+00	4YGStpBUdDXJ
prasath@htic.iitm.ac.in	f	2025-09-05 10:43:58.949856+00	Xgyw7wJ4UasT
prasath@htic.iitm.ac.in	f	2025-09-05 10:44:01.573889+00	jwKCxUviEKsJ
prasath@htic.iitm.ac.in	f	2025-09-05 10:44:01.79783+00	nKCUKdv71jS1
prasath@htic.iitm.ac.in	f	2025-09-05 10:44:02.806865+00	357B54zqg2K3
prasath@htic.iitm.ac.in	f	2025-09-05 10:44:02.839203+00	EiXaMKZ7EEUl
prasath@htic.iitm.ac.in	f	2025-09-05 10:47:53.33065+00	XZIeKAq30e7z
prasath@htic.iitm.ac.in	f	2025-09-05 10:47:53.389981+00	rMIioz7E6oeF
prasath@htic.iitm.ac.in	f	2025-09-05 10:57:04.072913+00	NADBzmU3Hqlx
prasath@htic.iitm.ac.in	f	2025-09-05 10:57:04.94463+00	CxIhg0DZHo5X
prasath@htic.iitm.ac.in	f	2025-09-05 10:58:41.342022+00	7ZLWhgflrrYO
prasath@htic.iitm.ac.in	f	2025-09-05 10:58:41.369322+00	cf8MOkgR8LKM
prasath@htic.iitm.ac.in	f	2025-09-05 10:58:59.612119+00	UG7e3AONZhsT
prasath@htic.iitm.ac.in	f	2025-09-05 10:58:59.642469+00	hJIniuMl2GFf
abc@abc.abc	f	2025-09-05 11:00:05.768431+00	5suzd6nShzqv
prasath@htic.iitm.ac.in	f	2025-09-05 11:00:22.357545+00	CwgTjfkdUHBU
prasath@htic.iitm.ac.in	f	2025-09-05 11:01:07.300184+00	7OfNqTLOysfM
prasath@htic.iitm.ac.in	f	2025-09-05 11:01:07.331239+00	fzBYnjNiBcsc
prasath@htic.iitm.ac.in	f	2025-09-05 11:01:31.725622+00	BE7BkuJrWH8I
prasath@htic.iitm.ac.in	f	2025-09-05 11:01:31.751827+00	qczXZQ45duOx
prasath@htic.iitm.ac.in	f	2025-09-05 11:02:00.344387+00	uhMeREybW0ZI
prasath@htic.iitm.ac.in	f	2025-09-05 11:02:21.585809+00	wTTobsIowPCE
prasath@htic.iitm.ac.in	f	2025-09-05 11:02:21.614909+00	Rx6t8Ax2kOdF
prasath@htic.iitm.ac.in	f	2025-09-05 11:02:47.618098+00	iXYekJFQI9yu
prasath@htic.iitm.ac.in	f	2025-09-05 11:02:47.661155+00	gB2OgsqPdt05
prasath@htic.iitm.ac.in	f	2025-09-05 11:03:34.564273+00	MPxuY3UTBYz5
prasath@htic.iitm.ac.in	f	2025-09-05 11:03:34.592287+00	HzYtFxmCc5Ct
prasath@htic.iitm.ac.in	f	2025-09-05 11:03:35.026288+00	6zu6is20Ct7g
prasath@htic.iitm.ac.in	f	2025-09-05 11:03:35.054666+00	C5BGOcRvKKdY
prasath@htic.iitm.ac.in	f	2025-09-05 11:03:37.320979+00	bGZTJpeqz7Fs
prasath@htic.iitm.ac.in	f	2025-09-05 11:03:37.351282+00	wjXzBr9MchXV
prasath@htic.iitm.ac.in	f	2025-09-05 11:06:04.968022+00	oAeGA89XaAaG
prasath@htic.iitm.ac.in	f	2025-09-05 11:06:05.032469+00	Ha1U215497ua
prasath@htic.iitm.ac.in	f	2025-09-05 11:06:07.873102+00	GiAKKnfxGyLs
prasath@htic.iitm.ac.in	f	2025-09-05 11:06:07.900077+00	M5XXrGTQQWIh
prasath@htic.iitm.ac.in	f	2025-09-05 11:06:38.434418+00	psHaBstDhRfq
prasath@htic.iitm.ac.in	f	2025-09-05 11:06:38.492877+00	YlKR5FEP1ScU
prasath@htic.iitm.ac.in	f	2025-09-05 11:07:06.859211+00	40FubATilSTS
prasath@htic.iitm.ac.in	f	2025-09-05 11:07:06.924164+00	fOCjQgGyWSJP
prasath@htic.iitm.ac.in	f	2025-09-05 11:08:30.325446+00	6oJAgNpS9D7n
prasath@htic.iitm.ac.in	f	2025-09-05 11:10:20.714755+00	ZQge5JkdMmiX
prasath@htic.iitm.ac.in	f	2025-09-05 11:10:21.108307+00	1X4FxlkzOxfK
prasath@htic.iitm.ac.in	f	2025-09-05 11:14:54.49984+00	24PMqed6pk1z
prasath@htic.iitm.ac.in	f	2025-09-05 11:14:54.527956+00	1tdRWSx06ZqN
prasath@htic.iitm.ac.in	f	2025-09-05 11:15:54.786878+00	imdvLoxqjSXe
prasath@htic.iitm.ac.in	f	2025-09-05 11:15:54.827327+00	XPZo96nskGon
prasath@htic.iitm.ac.in	f	2025-09-05 11:16:48.2521+00	1ilZeRy0cVeC
prasath@htic.iitm.ac.in	f	2025-09-05 11:16:48.280628+00	o6gqhFB7uWke
prasath@htic.iitm.ac.in	f	2025-09-05 11:17:29.577848+00	6aQEjNAG7gTR
prasath@htic.iitm.ac.in	f	2025-09-05 11:17:29.64561+00	ZUlBnaYvlK5w
prasath@htic.iitm.ac.in	f	2025-09-05 11:17:50.618453+00	rO7GcNVdUuYl
prasath@htic.iitm.ac.in	f	2025-09-05 11:17:50.645804+00	67DJzTyzoczh
prasath@htic.iitm.ac.in-publisher	f	2025-09-05 11:20:35.527088+00	FQF7L8jtjHLF
prasath@htic.iitm.ac.in	f	2025-09-05 11:20:58.623155+00	1oIwNloqVVsG
prasath@htic.iitm.ac.in	f	2025-09-05 11:20:58.717477+00	WpjAamDhhSIW
prasath@htic.iitm.ac.in	f	2025-09-05 11:23:33.392178+00	A7Dr6wFoABor
prasath@htic.iitm.ac.in	f	2025-09-05 11:23:43.618799+00	MKwCHhxMEpiW
prasath@htic.iitm.ac.in	f	2025-09-05 11:23:43.647598+00	xHBRNpwZ89Sf
prasath@htic.iitm.ac.in	f	2025-09-05 11:29:03.62389+00	zQ54ud9kFeGl
prasath@htic.iitm.ac.in	f	2025-09-05 11:29:03.653419+00	gxUCI2fU7zoo
prasath@htic.iitm.ac.in	f	2025-09-05 11:29:18.74491+00	luA2AvUZeci2
prasath@htic.iitm.ac.in	f	2025-09-05 11:29:18.773961+00	jmW1rlCNCkcv
test-publisher-1757072221175	f	2025-09-05 11:37:00.256131+00	LodLvCIMGq37
test-publisher-1757072227160	f	2025-09-05 11:37:06.195791+00	s7DYaZR8UguK
prasath@htic.iitm.ac.in	f	2025-09-05 11:38:20.257852+00	AiZxsUartJ3L
prasath@htic.iitm.ac.in	f	2025-09-05 11:38:20.372952+00	VwRHBa6870gE
prasath@htic.iitm.ac.in	f	2025-09-05 11:39:18.89926+00	jK1oXHx5XqgA
prasath@htic.iitm.ac.in	f	2025-09-05 11:39:30.030338+00	lJrF0ITeBNSV
prasath@htic.iitm.ac.in	f	2025-09-05 11:47:26.664947+00	sFHqJdKnrnoC
prasath@htic.iitm.ac.in	f	2025-09-05 11:47:26.694456+00	uyIuAT0MoYLp
prasath@htic.iitm.ac.in	f	2025-09-05 11:52:53.63212+00	MhjmQoMZleW2
prasath@htic.iitm.ac.in	f	2025-09-05 11:52:56.408561+00	ZXm25qevny4Z
prasath@htic.iitm.ac.in-viewer-1757073357596	f	2025-09-05 11:55:57.78279+00	BKE8FvbJxfFL
prasath@htic.iitm.ac.in-viewer-1757073357596	f	2025-09-05 11:55:57.817817+00	QFztAZ7qMK3q
prasath@htic.iitm.ac.in-viewer-1757073434238	f	2025-09-05 11:57:14.488992+00	GZKqUpdNzTEM
abc@abc.abc	f	2025-09-05 11:57:22.514907+00	abY5i2qopv5t
prasath@htic.iitm.ac.in-viewer-1757073452343	f	2025-09-05 11:57:32.465027+00	Er3MGAjlOx8a
abc@abc.abc	f	2025-09-17 10:51:53.773764+00	nlyzI1dA0j6R
prasath@htic.iitm.ac.in-viewer-1757073452342	f	2025-09-05 11:57:32.533578+00	eXifNPZPQNws
prasath@htic.iitm.ac.in	f	2025-09-05 11:59:09.396514+00	bO9igQanlCt2
prasath@htic.iitm.ac.in	f	2025-09-05 11:59:09.47301+00	4bebQWFUHfde
prasath@htic.iitm.ac.in	f	2025-09-05 11:59:28.617292+00	IrF4I0KhuOnr
prasath@htic.iitm.ac.in	f	2025-09-05 11:59:28.663481+00	wDMoxH9bap4C
prasath@htic.iitm.ac.in	f	2025-09-05 12:00:03.383411+00	alTvJC6w2oEu
prasath@htic.iitm.ac.in	f	2025-09-05 12:00:03.475302+00	xN1eH9x7nN6l
abc@abc.abc	f	2025-09-05 12:00:53.8307+00	kYi2BwnfTW94
prasath@htic.iitm.ac.in	f	2025-09-05 12:02:42.533087+00	D7qJWBhN5Vmw
prasath@htic.iitm.ac.in	f	2025-09-05 12:02:42.596642+00	QcQaOlIigUb0
abc@abc.abc	f	2025-09-05 12:06:11.727375+00	C85HHKHg2dtV
prasath@htic.iitm.ac.in	f	2025-09-05 12:09:22.207835+00	fSzsMDQbaZ6j
prasath@htic.iitm.ac.in	f	2025-09-05 12:09:22.301247+00	1FPTHwlxGVa8
prasath@htic.iitm.ac.in	f	2025-09-05 17:05:18.771971+00	77huL6nmIvSG
prasath@htic.iitm.ac.in	f	2025-09-05 17:05:18.835725+00	rwoOUTco6O6E
prasath@htic.iitm.ac.in	f	2025-09-05 17:05:35.631766+00	lR8VqmD4Ca3Q
prasath@htic.iitm.ac.in	f	2025-09-05 17:05:35.693258+00	eEGiq36c1YHE
prasath@htic.iitm.ac.in	f	2025-09-05 17:15:47.575506+00	WO5Ox3mactzk
prasath@htic.iitm.ac.in	f	2025-09-05 17:15:47.599601+00	SjTRLZcQF757
prasath@htic.iitm.ac.in	f	2025-09-05 17:15:57.679177+00	xsZW9OBt3QTO
prasath@htic.iitm.ac.in	f	2025-09-05 17:15:57.70432+00	u3Ba6H5lwKfU
prasath@htic.iitm.ac.in	f	2025-09-05 17:17:54.225805+00	jk1jkQWBlB2m
prasath@htic.iitm.ac.in	f	2025-09-05 17:17:54.271681+00	ie0O47NOQXoi
prasath@htic.iitm.ac.in	f	2025-09-05 17:18:57.163492+00	PMxbDfUFNlVJ
prasath@htic.iitm.ac.in	f	2025-09-05 17:18:57.200616+00	DlbRuaeSwQ5Y
prasath@htic.iitm.ac.in	f	2025-09-05 17:21:24.172684+00	XWp4gLrshLtb
prasath@htic.iitm.ac.in	f	2025-09-05 17:21:24.194533+00	DHikVU3pRRzx
prasath@htic.iitm.ac.in	f	2025-09-05 17:26:33.278398+00	Nce8U6nZovWD
prasath@htic.iitm.ac.in	f	2025-09-05 17:26:33.319377+00	9N5HjXgYtGVY
prasath@htic.iitm.ac.in	f	2025-09-05 17:27:03.064964+00	HyfsgCed9aVc
prasath@htic.iitm.ac.in	f	2025-09-05 17:27:03.09111+00	kefF2dO8HurA
prasath@htic.iitm.ac.in	f	2025-09-06 06:07:44.539537+00	wi0zVmhcUR01
prasath@htic.iitm.ac.in	f	2025-09-06 06:07:44.605836+00	U1vXg7XIy5RB
prasath@htic.iitm.ac.in	f	2025-09-06 06:13:34.401181+00	xOxRD2S4Ctm9
prasath@htic.iitm.ac.in	f	2025-09-06 06:13:34.488056+00	ZdrSnUEuEpRz
prasath@htic.iitm.ac.in	f	2025-09-06 06:14:10.957396+00	iv65WNFoFNP1
prasath@htic.iitm.ac.in	f	2025-09-06 06:14:11.01673+00	pOF4ZyAk37d5
prasath@htic.iitm.ac.in	f	2025-09-06 06:14:20.214946+00	iMD29O78yhlH
prasath@htic.iitm.ac.in	f	2025-09-06 06:14:20.271278+00	bVBLLseFJkUb
prasath@htic.iitm.ac.in	f	2025-09-06 06:16:09.793917+00	Fhyq3pfbqfZZ
prasath@htic.iitm.ac.in	f	2025-09-06 06:16:13.784456+00	mBzDZCYuRcau
prasath@htic.iitm.ac.in	f	2025-09-06 06:16:29.816929+00	t8IrevgaoVk1
prasath@htic.iitm.ac.in	f	2025-09-06 06:16:35.813669+00	74fUHdzVM8OD
prasath@htic.iitm.ac.in	f	2025-09-06 06:16:59.808056+00	yWWvxkYCDyfG
prasath@htic.iitm.ac.in	f	2025-09-06 06:17:08.791994+00	laPa9pZqD89J
prasath@htic.iitm.ac.in	f	2025-09-06 06:25:49.779915+00	AbGFbUfz5gRH
prasath@htic.iitm.ac.in	f	2025-09-06 06:26:11.842777+00	lEHdTGJfE4oo
prasath@htic.iitm.ac.in	f	2025-09-06 06:26:11.909015+00	M2Mum6r59EAG
prasath@htic.iitm.ac.in	f	2025-09-06 06:26:55.881281+00	QF3T3QjgBWdL
prasath@htic.iitm.ac.in	f	2025-09-06 06:26:55.951346+00	CqqtYxYOrx0U
prasath@htic.iitm.ac.in	f	2025-09-06 06:28:32.85376+00	UjxnMyISJPPt
prasath@htic.iitm.ac.in	f	2025-09-06 06:28:32.909362+00	RopyyD6wivkH
prasath@htic.iitm.ac.in	f	2025-09-06 06:30:01.901897+00	9JFrI8dADffc
prasath@htic.iitm.ac.in	f	2025-09-06 06:30:01.957679+00	k3R2SHOvkoBV
prasath@htic.iitm.ac.in	f	2025-09-06 06:32:15.813663+00	p4dtCYyd0eQT
prasath@htic.iitm.ac.in	f	2025-09-06 06:32:22.851979+00	foISyaLeTC0k
prasath@htic.iitm.ac.in	f	2025-09-06 06:32:22.920198+00	6f0OpnBTsWHa
prasath@htic.iitm.ac.in	f	2025-09-06 06:35:41.023383+00	mBvneWuIK1Ri
prasath@htic.iitm.ac.in	f	2025-09-06 06:35:51.755241+00	6eFc20VdBVNM
prasath@htic.iitm.ac.in	f	2025-09-06 06:36:02.628716+00	hrRgYCVYjNSi
prasath@htic.iitm.ac.in	f	2025-09-06 06:36:08.059548+00	Uw7nDxtIUeYh
prasath@htic.iitm.ac.in	f	2025-09-06 06:36:08.116388+00	ALQ9VJLMvC4V
prasath@htic.iitm.ac.in	f	2025-09-06 06:40:13.873434+00	Psqe8jUJ9jn7
prasath@htic.iitm.ac.in	f	2025-09-06 06:40:17.866725+00	PBFmtkgopQNW
prasath@htic.iitm.ac.in	f	2025-09-06 06:40:17.937539+00	fD6uF1c8zDPH
prasath@htic.iitm.ac.in	f	2025-09-06 06:41:49.803351+00	6swtc2KMNdK6
prasath@htic.iitm.ac.in	f	2025-09-06 06:41:51.863402+00	CR5OvuwFV0DL
prasath@htic.iitm.ac.in	f	2025-09-06 06:42:07.743464+00	xJ0osRo3TuFI
prasath@htic.iitm.ac.in	f	2025-09-06 06:42:07.799627+00	TA3hKQlYRoZx
prasath@htic.iitm.ac.in	f	2025-09-06 06:42:48.818747+00	EnPQOFKCl67O
prasath@htic.iitm.ac.in	f	2025-09-06 06:42:51.552886+00	2MqBjbTZZQb4
prasath@htic.iitm.ac.in	f	2025-09-06 06:42:51.613317+00	7lD9fi76A528
prasath@htic.iitm.ac.in	f	2025-09-06 06:43:39.264986+00	CmMca8gLcmqv
prasath@htic.iitm.ac.in	f	2025-09-06 06:43:39.322566+00	BTgbdM3hZTy2
prasath@htic.iitm.ac.in	f	2025-09-06 06:44:35.284278+00	z4B44YMMjo7I
prasath@htic.iitm.ac.in	f	2025-09-06 06:44:35.342153+00	CDXaYOjtPO7O
prasath@htic.iitm.ac.in	f	2025-09-06 06:44:54.826341+00	0pEBKjzAXZSr
prasath@htic.iitm.ac.in	f	2025-09-06 06:45:00.125767+00	vGE5NgdrfdEC
prasath@htic.iitm.ac.in	f	2025-09-06 06:45:00.184045+00	1aO9Al8uG59C
prasath@htic.iitm.ac.in	f	2025-09-06 06:45:30.783046+00	62N34bRmGLHU
prasath@htic.iitm.ac.in	f	2025-09-06 06:45:34.641733+00	boWJsRf9SV1A
prasath@htic.iitm.ac.in	f	2025-09-06 06:45:34.701265+00	HqqFamcuKV8b
prasath@htic.iitm.ac.in	f	2025-09-06 06:45:52.06316+00	mxNCAXwqU2b1
prasath@htic.iitm.ac.in	f	2025-09-06 06:45:52.122439+00	DnmQasPAkrDS
prasath@htic.iitm.ac.in	f	2025-09-06 06:47:03.414088+00	pDjbBOOlIZ1f
prasath@htic.iitm.ac.in	f	2025-09-06 06:47:03.474251+00	47nAWidf6ul6
prasath@htic.iitm.ac.in	f	2025-09-06 06:47:03.975334+00	YTjAgb8ACEnI
prasath@htic.iitm.ac.in	f	2025-09-06 06:47:04.031118+00	pVV6rA1GIETY
prasath@htic.iitm.ac.in	f	2025-09-06 06:47:05.344819+00	2zsjOPxAGGFW
prasath@htic.iitm.ac.in	f	2025-09-06 06:47:05.40142+00	pXeup4KYt59v
prasath@htic.iitm.ac.in	f	2025-09-06 06:47:43.534299+00	5GDIkYR90bRq
prasath@htic.iitm.ac.in	f	2025-09-06 06:47:43.59053+00	cyBktcBctvWg
prasath@htic.iitm.ac.in	f	2025-09-06 06:48:34.799557+00	yuVwZD1u9oJ5
prasath@htic.iitm.ac.in	f	2025-09-06 06:48:34.873355+00	UspLaRPboevi
prasath@htic.iitm.ac.in	f	2025-09-06 06:48:42.190839+00	FJmAtMeqDQKm
prasath@htic.iitm.ac.in	f	2025-09-06 06:48:42.246344+00	TPZ9I4Txy0Uu
prasath@htic.iitm.ac.in	f	2025-09-06 06:51:22.813567+00	VPY4oqvjpIRD
prasath@htic.iitm.ac.in	f	2025-09-06 06:51:46.834285+00	EhzfEued5ghg
prasath@htic.iitm.ac.in	f	2025-09-06 06:53:14.863412+00	JW9jcN41Qw3e
prasath@htic.iitm.ac.in	f	2025-09-06 06:53:28.04328+00	3p6fBeO26JAd
prasath@htic.iitm.ac.in	f	2025-09-06 06:53:28.275802+00	tIZ4b2c50xNp
prasath@htic.iitm.ac.in	f	2025-09-06 06:55:38.498523+00	of2Eom7oM1Sq
prasath@htic.iitm.ac.in	f	2025-09-06 06:55:38.557457+00	MTRqt76ubFPX
prasath@htic.iitm.ac.in	f	2025-09-06 06:56:49.608602+00	gplYQPNGj5z2
prasath@htic.iitm.ac.in	f	2025-09-06 06:56:49.664414+00	o2OP2IKVXfjZ
prasath@htic.iitm.ac.in	f	2025-09-06 07:03:53.881543+00	d3GgAJESD8aa
prasath@htic.iitm.ac.in	f	2025-09-06 07:04:01.788856+00	OEVRg125Os5L
prasath@htic.iitm.ac.in	f	2025-09-06 07:04:01.850172+00	wnzWsyyRtytL
prasath@htic.iitm.ac.in	f	2025-09-06 07:04:45.217742+00	uYt7z2yIjq9R
prasath@htic.iitm.ac.in	f	2025-09-06 07:04:45.364733+00	QTfJYkPIN1As
prasath@htic.iitm.ac.in	f	2025-09-06 07:05:32.819781+00	46CGQXk8VP1g
prasath@htic.iitm.ac.in	f	2025-09-06 07:05:55.790645+00	oP5V7daG0Y3E
prasath@htic.iitm.ac.in	f	2025-09-06 07:06:19.780314+00	l7XhmliaAk9p
prasath@htic.iitm.ac.in	f	2025-09-06 07:06:30.802203+00	kzRBKRUN4AIi
prasath@htic.iitm.ac.in	f	2025-09-06 07:06:34.80086+00	aJYZj15AvHh6
prasath@htic.iitm.ac.in	f	2025-09-06 07:06:49.821812+00	iaLPL2DMKNj8
prasath@htic.iitm.ac.in	f	2025-09-06 07:07:59.82667+00	NIMJcJZKb0ud
prasath@htic.iitm.ac.in	f	2025-09-06 07:08:02.8025+00	M5wH7hyU47kk
prasath@htic.iitm.ac.in	f	2025-09-06 07:10:08.827545+00	0PZ31KrwEjvz
prasath@htic.iitm.ac.in	f	2025-09-06 07:10:30.800267+00	8APYuPmhR5ei
prasath@htic.iitm.ac.in	f	2025-09-06 07:10:40.814632+00	XdHpbdHs28El
prasath@htic.iitm.ac.in	f	2025-09-06 07:11:10.797991+00	gSSBCePBff4a
prasath@htic.iitm.ac.in	f	2025-09-06 07:11:59.78064+00	LPCW8RGjYOB0
prasath@htic.iitm.ac.in	f	2025-09-06 07:13:26.63202+00	pNYPDLwf3Bq9
prasath@htic.iitm.ac.in	f	2025-09-06 07:13:26.74934+00	FVVqLC3NEgKU
prasath@htic.iitm.ac.in	f	2025-09-06 07:14:02.591946+00	UMb3K00xAzW3
prasath@htic.iitm.ac.in	f	2025-09-06 07:14:02.657766+00	awmr9ieNtvlY
prasath@htic.iitm.ac.in	f	2025-09-06 07:14:33.09372+00	NQgwnvW58dEQ
prasath@htic.iitm.ac.in	f	2025-09-06 07:14:33.151037+00	EAQWi1z1YYuQ
prasath@htic.iitm.ac.in	f	2025-09-06 07:17:05.774655+00	67g298XpBZP2
prasath@htic.iitm.ac.in	f	2025-09-06 07:17:08.793823+00	GB8rQNjsbvEV
prasath@htic.iitm.ac.in	f	2025-09-06 07:17:22.905963+00	UCyvRow9Hl8R
prasath@htic.iitm.ac.in	f	2025-09-06 07:17:36.374743+00	sb3IRPtbEKR5
prasath@htic.iitm.ac.in	f	2025-09-06 07:17:36.430117+00	G6iHcd5CF5gD
prasath@htic.iitm.ac.in	f	2025-09-06 07:18:50.745915+00	g1Hd3aVbUsl4
prasath@htic.iitm.ac.in	f	2025-09-06 07:18:50.801912+00	DKBJPps9pnVx
prasath@htic.iitm.ac.in	f	2025-09-06 07:18:58.112822+00	CkQc5OyU62zq
prasath@htic.iitm.ac.in	f	2025-09-06 07:18:58.18063+00	bTPVKVwDTpfm
prasath@htic.iitm.ac.in	f	2025-09-06 07:26:53.866694+00	tQB3piyFlaGP
prasath@htic.iitm.ac.in	f	2025-09-06 07:27:37.799911+00	lMSZlKcWBGds
prasath@htic.iitm.ac.in	f	2025-09-06 07:27:42.063495+00	K1CLktCWXAsu
prasath@htic.iitm.ac.in	f	2025-09-06 07:27:42.12177+00	A5JCCZJXErjS
prasath@htic.iitm.ac.in	f	2025-09-06 07:28:07.367562+00	sWY6OXjQWINB
prasath@htic.iitm.ac.in	f	2025-09-06 07:28:07.426937+00	0Xm3mx0L7GD5
prasath@htic.iitm.ac.in	f	2025-09-06 07:31:01.227848+00	wyjWLqKskt5I
prasath@htic.iitm.ac.in	f	2025-09-06 07:31:01.287147+00	W2F1xtZvwjP7
prasath@htic.iitm.ac.in	f	2025-09-06 07:31:18.613666+00	7RqUW45qPjY0
prasath@htic.iitm.ac.in	f	2025-09-06 07:31:18.67337+00	TnJjrKN1Q7W1
prasath@htic.iitm.ac.in	f	2025-09-06 07:32:13.795879+00	jwgm8l47jHS7
prasath@htic.iitm.ac.in	f	2025-09-06 07:32:13.851772+00	xSYIJknYelsN
prasath@htic.iitm.ac.in	f	2025-09-06 07:32:21.501128+00	lF7L0LjLBcji
prasath@htic.iitm.ac.in	f	2025-09-06 07:32:21.562366+00	seAZ0PsITYwa
prasath@htic.iitm.ac.in	f	2025-09-06 07:34:59.828763+00	MPagIxt3MOaZ
prasath@htic.iitm.ac.in	f	2025-09-06 07:35:03.754472+00	5OzX5rtbH8OS
prasath@htic.iitm.ac.in	f	2025-09-06 07:35:50.814534+00	Aons8fRKigrl
prasath@htic.iitm.ac.in	f	2025-09-06 07:36:03.000523+00	e9GwmkwLp0aA
prasath@htic.iitm.ac.in	f	2025-09-06 07:36:03.055981+00	KrLUgy1zG55I
prasath@htic.iitm.ac.in	f	2025-09-06 07:39:49.831064+00	839yBydQczPI
prasath@htic.iitm.ac.in	f	2025-09-06 07:40:25.788213+00	3k3a9GnZCL5p
prasath@htic.iitm.ac.in	f	2025-09-06 07:40:29.808964+00	pWasAmq0vm37
prasath@htic.iitm.ac.in	f	2025-09-06 07:40:40.220297+00	JPqwvNzGab6W
prasath@htic.iitm.ac.in	f	2025-09-06 07:40:40.279986+00	dIw3NunBSL8H
prasath@htic.iitm.ac.in	f	2025-09-06 07:41:03.819735+00	fZOtLVm0S7Uo
prasath@htic.iitm.ac.in	f	2025-09-06 07:41:16.024753+00	jn6Dj13bWCVa
prasath@htic.iitm.ac.in	f	2025-09-06 07:44:24.841867+00	sQqTwJtuAFnm
prasath@htic.iitm.ac.in	f	2025-09-06 07:44:38.480186+00	44KJnv4b7v9x
prasath@htic.iitm.ac.in	f	2025-09-06 07:44:38.547297+00	stjpVDg9FaOG
prasath@htic.iitm.ac.in	f	2025-09-06 07:45:11.586263+00	EfW0n6WmMbgL
prasath@htic.iitm.ac.in	f	2025-09-06 07:45:16.972908+00	CpBSsQOcMDMY
prasath@htic.iitm.ac.in	f	2025-09-06 07:45:17.029671+00	mhcSkYmfq8FQ
prasath@htic.iitm.ac.in	f	2025-09-06 07:46:18.693087+00	oY77XqCKuQF7
prasath@htic.iitm.ac.in	f	2025-09-06 07:46:18.763237+00	0QHv4Z8yrmwB
prasath@htic.iitm.ac.in	f	2025-09-06 07:46:38.248464+00	RprnfEL26qsA
prasath@htic.iitm.ac.in	f	2025-09-06 07:55:06.871433+00	t89sAHb5VzME
prasath@htic.iitm.ac.in	f	2025-09-06 07:55:10.732979+00	hbdU3W8C0kZW
prasath@htic.iitm.ac.in	f	2025-09-06 07:55:10.796654+00	5fMF0BTlchk0
prasath@htic.iitm.ac.in	f	2025-09-06 07:55:25.673088+00	ROCEbrX6HBuX
prasath@htic.iitm.ac.in	f	2025-09-06 07:57:24.845219+00	7ZfUKwph5bIs
prasath@htic.iitm.ac.in	f	2025-09-06 07:57:31.799077+00	1yZf5cRuU8hl
prasath@htic.iitm.ac.in	f	2025-09-06 08:04:32.377025+00	tKX6xKx3AUhg
prasath@htic.iitm.ac.in	f	2025-09-06 08:04:32.43715+00	hEhmFVnngD1s
prasath@htic.iitm.ac.in	f	2025-09-06 08:05:42.848124+00	fjWnle81Kuk8
prasath@htic.iitm.ac.in	f	2025-09-06 08:06:13.813147+00	NxCBxBdv0pid
prasath@htic.iitm.ac.in	f	2025-09-06 08:06:15.294793+00	vPXdnzReD1Ie
prasath@htic.iitm.ac.in	f	2025-09-06 08:06:17.887598+00	05e5ch5jFW90
prasath@htic.iitm.ac.in	f	2025-09-06 08:06:17.948237+00	NPiSJeqT5STg
prasath@htic.iitm.ac.in	f	2025-09-06 08:06:34.103842+00	et5svzp9MU5n
prasath@htic.iitm.ac.in	f	2025-09-06 08:06:37.747583+00	N5XtQXMnOFmM
prasath@htic.iitm.ac.in	f	2025-09-06 08:06:46.064712+00	pHNOjiu8bi0m
prasath@htic.iitm.ac.in	f	2025-09-06 08:07:30.487638+00	hEN0N47HAofJ
prasath@htic.iitm.ac.in	f	2025-09-06 08:08:48.855327+00	nPy4mY7hPNZ6
prasath@htic.iitm.ac.in	f	2025-09-06 08:09:00.832653+00	vgxenUP5a119
prasath@htic.iitm.ac.in	f	2025-09-06 08:09:03.839025+00	pIoyOoWSRylB
prasath@htic.iitm.ac.in	f	2025-09-06 08:09:10.846192+00	oMiDy2NkW2sJ
prasath@htic.iitm.ac.in	f	2025-09-06 08:10:06.278513+00	xes4Ol46PtQT
prasath@htic.iitm.ac.in	f	2025-09-06 08:12:24.27226+00	iUOhDbLrF2Qy
prasath@htic.iitm.ac.in	f	2025-09-06 08:12:24.462618+00	DmW7WOelz5Cm
prasath@htic.iitm.ac.in	f	2025-09-06 08:15:23.828176+00	k2Fpd5b1LciP
prasath@htic.iitm.ac.in	f	2025-09-06 08:15:23.894611+00	h8lSI52lxxs5
prasath@htic.iitm.ac.in	f	2025-09-06 08:16:42.903824+00	CRgQXm7I8GmT
prasath@htic.iitm.ac.in	f	2025-09-06 08:18:15.906979+00	Pw6H3SlAkHS6
prasath@htic.iitm.ac.in	f	2025-09-06 08:18:20.232866+00	BSLSHWeYE7u1
prasath@htic.iitm.ac.in	f	2025-09-06 08:18:20.631557+00	1A9sy2aeX99D
prasath@htic.iitm.ac.in	f	2025-09-06 08:19:49.212242+00	F4jhYaZLo7dy
prasath@htic.iitm.ac.in	f	2025-09-06 08:19:49.285841+00	Y1Ca2l7niUhb
prasath@htic.iitm.ac.in	f	2025-09-06 08:20:19.668572+00	B0sXiVTOV2OE
prasath@htic.iitm.ac.in	f	2025-09-06 08:20:19.743887+00	mOQbxZRwaUl3
prasath@htic.iitm.ac.in	f	2025-09-06 08:22:51.127361+00	XE4ffb6UAj53
prasath@htic.iitm.ac.in	f	2025-09-06 08:22:51.199039+00	9d22SULe2iMg
prasath@htic.iitm.ac.in	f	2025-09-06 08:23:04.672612+00	pRGbg4XWFeuW
prasath@htic.iitm.ac.in	f	2025-09-06 08:23:04.756618+00	aZSuY1IslKVV
prasath@htic.iitm.ac.in	f	2025-09-06 08:26:33.875263+00	imZGOee5z6GA
prasath@htic.iitm.ac.in	f	2025-09-06 08:26:44.15864+00	lHA8o0NBgQ2c
prasath@htic.iitm.ac.in	f	2025-09-06 08:26:44.276921+00	cYCzy4EZ9vTF
prasath@htic.iitm.ac.in	f	2025-09-06 08:26:56.80557+00	aLEcVcJ4EBq8
prasath@htic.iitm.ac.in	f	2025-09-06 08:26:56.879298+00	epFyiAIZqq8y
prasath@htic.iitm.ac.in	f	2025-09-06 08:26:58.771265+00	f7DMcd8etaBW
prasath@htic.iitm.ac.in	f	2025-09-06 08:27:27.889995+00	biONzvEG2i6H
prasath@htic.iitm.ac.in	f	2025-09-06 08:27:30.898587+00	NLdkt3QBF3AS
prasath@htic.iitm.ac.in	f	2025-09-06 08:27:32.86856+00	bnelFHReTjgt
prasath@htic.iitm.ac.in	f	2025-09-06 08:27:35.880006+00	Tu6FJzTcK0My
prasath@htic.iitm.ac.in	f	2025-09-06 08:27:37.872613+00	UeDEzyM2MOw2
prasath@htic.iitm.ac.in	f	2025-09-06 08:27:38.855272+00	1r1Cyj02vqE8
prasath@htic.iitm.ac.in	f	2025-09-06 08:27:41.890198+00	JVOoApLFVQIh
prasath@htic.iitm.ac.in	f	2025-09-06 08:27:44.889848+00	QuT2mMPlxKdn
prasath@htic.iitm.ac.in	f	2025-09-06 08:28:01.675042+00	uHYBtRLSOnuS
prasath@htic.iitm.ac.in	f	2025-09-06 08:29:30.896302+00	tdEkwVMFVAln
prasath@htic.iitm.ac.in	f	2025-09-06 08:30:31.876345+00	iC68r3ixiJc1
prasath@htic.iitm.ac.in	f	2025-09-06 08:30:38.020795+00	wQB5zABiwyJz
prasath@htic.iitm.ac.in	f	2025-09-06 08:30:38.09201+00	XQraol0sb6BZ
prasath@htic.iitm.ac.in	f	2025-09-06 08:31:27.933234+00	lD0XQqPI3LeK
prasath@htic.iitm.ac.in	f	2025-09-06 08:32:03.860134+00	DfTvfJN45sCa
prasath@htic.iitm.ac.in	f	2025-09-06 08:32:29.189952+00	YXXI2kEh2rXg
prasath@htic.iitm.ac.in	f	2025-09-06 08:32:29.256935+00	p6a0YuIKFE1u
prasath@htic.iitm.ac.in	f	2025-09-06 08:33:26.828644+00	HvDPVAlR1igA
prasath@htic.iitm.ac.in	f	2025-09-06 08:33:58.767097+00	SOnvGpdovhq1
prasath@htic.iitm.ac.in	f	2025-09-06 08:33:58.825719+00	QbDevs9RakWM
prasath@htic.iitm.ac.in	f	2025-09-06 08:34:25.011841+00	wtwvQyaQYUmN
prasath@htic.iitm.ac.in	f	2025-09-06 08:34:25.913424+00	VAq527mEdgq6
prasath@htic.iitm.ac.in	f	2025-09-06 08:34:55.871314+00	iIJYdAqC9EVh
prasath@htic.iitm.ac.in	f	2025-09-06 08:34:55.951324+00	LPgzo6M7lOaJ
prasath@htic.iitm.ac.in	f	2025-09-06 08:37:47.841793+00	vyi0yk8JU5P0
prasath@htic.iitm.ac.in	f	2025-09-06 08:37:47.902158+00	mdPHAPY0UAcx
prasath@htic.iitm.ac.in	f	2025-09-06 08:37:54.777132+00	9Ny8rkWuk5vu
prasath@htic.iitm.ac.in	f	2025-09-06 08:37:54.849287+00	zilK1qUmSsr8
prasath@htic.iitm.ac.in	f	2025-09-06 08:38:45.926672+00	taDHBTVXxBd7
prasath@htic.iitm.ac.in	f	2025-09-06 08:38:45.997332+00	wmFe1z8uGUFE
prasath@htic.iitm.ac.in	f	2025-09-06 08:38:49.370382+00	LGfGKtzbmj4H
prasath@htic.iitm.ac.in	f	2025-09-06 08:38:49.456324+00	zlx2dVlbsUay
prasath@htic.iitm.ac.in	f	2025-09-06 08:40:57.798349+00	PpAtieJOjrjw
prasath@htic.iitm.ac.in	f	2025-09-06 08:40:57.896492+00	YrAAA3qWiQyR
prasath@htic.iitm.ac.in	f	2025-09-06 08:41:23.395438+00	TyXc3cQdm732
prasath@htic.iitm.ac.in	f	2025-09-06 08:41:23.45531+00	w1wQtwyr1X4E
prasath@htic.iitm.ac.in	f	2025-09-06 08:43:11.181326+00	lrfo4AeWudrz
prasath@htic.iitm.ac.in	f	2025-09-06 08:43:11.279771+00	6LVwdpFC17xx
prasath@htic.iitm.ac.in	f	2025-09-06 08:43:44.859941+00	JFv4Zqt0B9Wd
prasath@htic.iitm.ac.in	f	2025-09-06 08:44:00.421554+00	62bPNu9cTs4u
prasath@htic.iitm.ac.in	f	2025-09-06 08:44:00.476892+00	D0meh4bjbVK0
prasath@htic.iitm.ac.in	f	2025-09-06 08:48:27.887775+00	Y5VzGgzsP4zh
prasath@htic.iitm.ac.in	f	2025-09-06 08:49:05.879463+00	gXamdvQBw9dG
prasath@htic.iitm.ac.in	f	2025-09-06 08:49:06.107819+00	zWDPF7yVJyFU
abc@abc.abc	f	2025-09-06 08:51:04.157105+00	i2yrhHZ4z4pD
prasath@htic.iitm.ac.in	f	2025-09-06 08:54:01.48231+00	wQpk2C38fvOm
prasath@htic.iitm.ac.in	f	2025-09-06 08:54:01.540607+00	75V51e5mtgJH
prasath@htic.iitm.ac.in	f	2025-09-06 08:54:35.902563+00	0Apc4H6sMFcD
prasath@htic.iitm.ac.in	f	2025-09-06 08:54:39.699934+00	KhfGTqII4UAq
prasath@htic.iitm.ac.in	f	2025-09-06 08:54:39.756074+00	OqiH0THjWCdx
prasath@htic.iitm.ac.in	f	2025-09-06 08:54:59.214734+00	TAUBhXlOTP98
abc@abc.abc	f	2025-09-06 09:05:09.672432+00	thstJlky8TBU
abc@abc.abc	f	2025-09-06 09:05:33.279331+00	SdUyEHG7ARbU
abc@abc.abc	f	2025-09-06 09:05:51.875214+00	mbBWsQq7CPxK
abc@abc.abc	f	2025-09-06 09:06:10.234777+00	yMt0LqPcihBh
prasath@htic.iitm.ac.in	f	2025-09-06 09:07:27.540518+00	32LzawaJ07eW
prasath@htic.iitm.ac.in	f	2025-09-06 09:07:27.832066+00	6iJnNkak9io5
prasath@htic.iitm.ac.in	f	2025-09-06 09:08:13.988803+00	cDoYnMbNL8SG
prasath@htic.iitm.ac.in	f	2025-09-06 09:08:14.066732+00	IhJoXwbPgooz
prasath@htic.iitm.ac.in	f	2025-09-06 09:10:11.568246+00	B4CGkEJ2QxpY
prasath@htic.iitm.ac.in	f	2025-09-06 09:10:11.624008+00	09VXdYtcmsuw
prasath@htic.iitm.ac.in	f	2025-09-06 09:10:18.834587+00	fyStDpEEP0Ys
prasath@htic.iitm.ac.in	f	2025-09-06 09:10:18.890098+00	XmsfkYiXELcN
prasath@htic.iitm.ac.in	f	2025-09-06 09:10:20.656593+00	Aks751FlRZH8
prasath@htic.iitm.ac.in	f	2025-09-06 09:10:20.747523+00	7al2kJ2w1pVU
prasath@htic.iitm.ac.in	f	2025-09-06 09:12:03.827336+00	z0PScfirxehw
prasath@htic.iitm.ac.in	f	2025-09-06 09:12:03.888679+00	2BBgpAy54GmH
prasath@htic.iitm.ac.in	f	2025-09-06 09:12:12.560924+00	C5hxc3gX9xmq
prasath@htic.iitm.ac.in	f	2025-09-06 09:12:12.617469+00	qjKeKdJ9u0uR
prasath@htic.iitm.ac.in	f	2025-09-06 09:14:22.80182+00	6SiwpnxhhoTt
prasath@htic.iitm.ac.in	f	2025-09-06 09:14:22.900077+00	9n2DONEzQUlx
prasath@htic.iitm.ac.in	f	2025-09-06 09:15:01.376555+00	BtsNrlOZ7tOU
prasath@htic.iitm.ac.in	f	2025-09-06 09:15:01.435914+00	TWp5dc0ROBGm
prasath@htic.iitm.ac.in	f	2025-09-06 09:16:08.598533+00	YQHKglQ4xtEo
prasath@htic.iitm.ac.in	f	2025-09-06 09:16:08.701929+00	7zyLskZTyDb3
prasath@htic.iitm.ac.in	f	2025-09-06 09:16:23.246926+00	IYuOgPJYGeCH
prasath@htic.iitm.ac.in	f	2025-09-06 09:16:23.30688+00	WUPbY8ThNNjZ
prasath@htic.iitm.ac.in	f	2025-09-06 09:16:49.334959+00	zuvkNzyhzhkv
prasath@htic.iitm.ac.in	f	2025-09-06 09:16:49.406259+00	ja60IawHbNkD
prasath@htic.iitm.ac.in	f	2025-09-06 09:17:39.887664+00	uThezAXY2C2a
prasath@htic.iitm.ac.in	f	2025-09-06 09:17:39.960978+00	3406bwlvEECb
prasath@htic.iitm.ac.in	f	2025-09-06 09:20:15.814846+00	xf16SQAo8Lnz
prasath@htic.iitm.ac.in	f	2025-09-06 09:20:15.92871+00	TkCXKAjQkXSg
prasath@htic.iitm.ac.in	f	2025-09-06 09:20:45.354054+00	gCvI2IRm84jq
prasath@htic.iitm.ac.in	f	2025-09-06 09:20:45.418385+00	wBib4IbLv6gx
prasath@htic.iitm.ac.in	f	2025-09-06 09:25:22.111922+00	cqCZSkOfCiVi
prasath@htic.iitm.ac.in	f	2025-09-06 09:25:22.177087+00	KNxWN8vDAxjl
prasath@htic.iitm.ac.in	f	2025-09-06 09:25:22.239056+00	TOvEbxUXpSSw
prasath@htic.iitm.ac.in	f	2025-09-06 09:25:22.357516+00	UOV3X0TaGStz
prasath@htic.iitm.ac.in	f	2025-09-06 09:25:31.090717+00	1UWghKY2Saex
prasath@htic.iitm.ac.in	f	2025-09-06 09:25:31.255446+00	IRaQztP8SOyv
prasath@htic.iitm.ac.in	f	2025-09-06 09:26:39.008282+00	KTRmb08dpj9N
prasath@htic.iitm.ac.in	f	2025-09-06 09:26:39.077862+00	1vKg4QSitFDm
prasath@htic.iitm.ac.in	f	2025-09-06 09:26:44.832416+00	uZxRpzzfyeuY
prasath@htic.iitm.ac.in	f	2025-09-06 09:26:44.896344+00	XPdAmEi5b82A
prasath@htic.iitm.ac.in	f	2025-09-06 09:30:22.866405+00	AFWWIGkkD8dO
prasath@htic.iitm.ac.in	f	2025-09-06 09:30:22.958745+00	pF01soIvPLmv
prasath@htic.iitm.ac.in	f	2025-09-06 09:36:10.234767+00	mtQ1HlqtBLoM
prasath@htic.iitm.ac.in	f	2025-09-06 09:36:10.292242+00	fhIN3NKEXXKO
prasath@htic.iitm.ac.in	f	2025-09-06 09:37:07.543211+00	YTuwfhSoX9Zd
prasath@htic.iitm.ac.in	f	2025-09-06 09:37:07.602974+00	a4qUj3mFApLs
prasath@htic.iitm.ac.in	f	2025-09-06 14:11:33.103998+00	0P0KwJ2skKG4
prasath@htic.iitm.ac.in	f	2025-09-06 14:11:33.242002+00	e1vNucv5RU0B
prasath@htic.iitm.ac.in	f	2025-09-06 14:11:42.165686+00	cLPDesW7pUk2
prasath@htic.iitm.ac.in	f	2025-09-06 14:11:42.253128+00	YRoX3t8YTIwt
abc@abc.abc	f	2025-09-06 14:54:46.829308+00	yH48p9AEcnTX
prasath@htic.iitm.ac.in	f	2025-09-06 15:03:38.060057+00	ZnzCwmjAzHwk
prasath@htic.iitm.ac.in	f	2025-09-06 15:03:55.714617+00	2NerXWt3worN
prasath@htic.iitm.ac.in	f	2025-09-06 15:03:55.825617+00	Nb9R3jq19vJm
prasath@htic.iitm.ac.in	f	2025-09-06 15:04:44.04626+00	AKNWotjCHN6S
prasath@htic.iitm.ac.in	f	2025-09-06 15:04:47.011749+00	UjZKCpt0ZTap
prasath@htic.iitm.ac.in	f	2025-09-06 15:04:48.034273+00	8smEctuwTXn7
prasath@htic.iitm.ac.in	f	2025-09-06 15:04:50.997019+00	nwez8dl2htgC
prasath@htic.iitm.ac.in	f	2025-09-06 15:04:59.810286+00	B9DquRi41xvj
prasath@htic.iitm.ac.in	f	2025-09-06 15:05:06.060718+00	k3Y6hBYASzCW
prasath@htic.iitm.ac.in	f	2025-09-06 15:07:30.191022+00	XULFj380bdEN
prasath@htic.iitm.ac.in	f	2025-09-06 15:07:30.217938+00	hmYwlPudcs4a
prasath@htic.iitm.ac.in	f	2025-09-06 15:09:01.008619+00	3Ix9SQNfpEPx
prasath@htic.iitm.ac.in	f	2025-09-06 15:09:39.7534+00	PKbDdoIKAZxJ
prasath@htic.iitm.ac.in	f	2025-09-06 15:10:01.765778+00	AMNY5J9XHa2k
prasath@htic.iitm.ac.in	f	2025-09-06 15:10:43.013816+00	NLBrjTstciJs
prasath@htic.iitm.ac.in	f	2025-09-06 15:10:54.074975+00	vZI3rFioZupa
prasath@htic.iitm.ac.in	f	2025-09-06 15:12:07.593485+00	qPWQxMWJ4m7c
prasath@htic.iitm.ac.in	f	2025-09-06 15:12:23.448439+00	88Bo80jj8RT6
prasath@htic.iitm.ac.in	f	2025-09-06 15:12:45.02279+00	DcRJbYPgy2GW
prasath@htic.iitm.ac.in	f	2025-09-06 15:12:48.019458+00	kRfOALw6wX3E
prasath@htic.iitm.ac.in	f	2025-09-06 15:12:51.001918+00	sTvyrj4jJEUe
prasath@htic.iitm.ac.in	f	2025-09-06 15:12:54.406952+00	sqE0rJ0hnmtv
prasath@htic.iitm.ac.in	f	2025-09-06 15:12:57.008304+00	pu9XAN85fR7k
prasath@htic.iitm.ac.in	f	2025-09-06 15:12:58.032278+00	0LFQfy1sQxi7
prasath@htic.iitm.ac.in	f	2025-09-06 15:12:59.017185+00	te6uApEqcxzS
prasath@htic.iitm.ac.in	f	2025-09-06 15:13:02.006541+00	hJ3ex2YuMybN
prasath@htic.iitm.ac.in	f	2025-09-06 15:13:04.989891+00	S9OGvEJh6cD1
prasath@htic.iitm.ac.in	f	2025-09-06 15:13:08.999552+00	6O3GcPk3LUDb
prasath@htic.iitm.ac.in	f	2025-09-06 15:13:10.996729+00	vpaWOjai4yXe
prasath@htic.iitm.ac.in	f	2025-09-06 15:13:13.025864+00	nKtMHo6kd4Wb
prasath@htic.iitm.ac.in	f	2025-09-06 15:13:17.020877+00	iQFEWr8zBzoK
prasath@htic.iitm.ac.in	f	2025-09-06 15:13:19.014264+00	QtQaeKj8kvRU
prasath@htic.iitm.ac.in	f	2025-09-06 15:13:21.033796+00	ACdasjWcZcv0
prasath@htic.iitm.ac.in	f	2025-09-06 15:13:23.969316+00	nWtlMtzpMSaZ
prasath@htic.iitm.ac.in	f	2025-09-06 15:13:29.020906+00	8veEU8lb2cWr
prasath@htic.iitm.ac.in	f	2025-09-06 15:13:31.011953+00	DAof7HsBWgob
prasath@htic.iitm.ac.in	f	2025-09-06 15:13:33.002367+00	2cnZW0Fg7pDB
prasath@htic.iitm.ac.in	f	2025-09-06 15:13:36.030997+00	2ZDqdfbewCuL
prasath@htic.iitm.ac.in	f	2025-09-06 15:13:38.974512+00	DfhRtDZDxLkd
prasath@htic.iitm.ac.in	f	2025-09-06 15:13:42.042926+00	tq23wSDdue2N
prasath@htic.iitm.ac.in	f	2025-09-06 15:13:43.024616+00	0HhPSgYKFeQu
prasath@htic.iitm.ac.in	f	2025-09-06 15:13:47.009158+00	KJ2KxODhVQl7
prasath@htic.iitm.ac.in	f	2025-09-06 15:13:50.007466+00	2jfMkH3mJcGa
prasath@htic.iitm.ac.in	f	2025-09-06 15:13:53.00737+00	tcwmTwZ85MIm
prasath@htic.iitm.ac.in	f	2025-09-06 15:14:28.013108+00	EAgsKj3Dfpsi
prasath@htic.iitm.ac.in	f	2025-09-06 15:14:49.757786+00	t9t0cMgQ0dFh
prasath@htic.iitm.ac.in	f	2025-09-06 15:14:57.684323+00	04rdU116LffZ
prasath@htic.iitm.ac.in	f	2025-09-06 15:14:57.732416+00	uUgtFUJWWNhO
prasath@htic.iitm.ac.in	f	2025-09-06 16:03:40.66279+00	mt4J1SSnlSWn
prasath@htic.iitm.ac.in	f	2025-09-06 16:03:40.686961+00	8HoQkUDffF9n
prasath@htic.iitm.ac.in	f	2025-09-06 16:04:25.538121+00	vdMcVNxXTBin
prasath@htic.iitm.ac.in	f	2025-09-06 16:04:25.55996+00	I3yRva4sVu0i
prasath@htic.iitm.ac.in	f	2025-09-06 16:07:08.838193+00	GB7N2qWjp16W
prasath@htic.iitm.ac.in	f	2025-09-06 16:07:08.918288+00	09IEsuGzaP0r
prasath@htic.iitm.ac.in	f	2025-09-06 16:07:40.775472+00	RdzTYBxv3LqB
prasath@htic.iitm.ac.in	f	2025-09-06 16:07:40.797601+00	hsBknCeHL0Py
prasath@htic.iitm.ac.in	f	2025-09-06 16:09:26.269268+00	P1z8SIUEIlzN
prasath@htic.iitm.ac.in	f	2025-09-06 16:09:26.291409+00	6Wcy5tb6YsA8
prasath@htic.iitm.ac.in	f	2025-09-06 16:09:46.777146+00	jFT5vUhrE0wa
prasath@htic.iitm.ac.in	f	2025-09-06 16:09:55.796718+00	x0CzBkzIa2JA
prasath@htic.iitm.ac.in	f	2025-09-06 16:09:55.817812+00	rczRxMUK7vPh
prasath@htic.iitm.ac.in	f	2025-09-06 16:14:46.30356+00	f4uQFxubO6Hd
prasath@htic.iitm.ac.in	f	2025-09-06 16:14:46.327173+00	4Xawq2M2kGeK
prasath@htic.iitm.ac.in	f	2025-09-06 16:25:45.217844+00	XYHLVP6mddig
prasath@htic.iitm.ac.in	f	2025-09-06 16:26:04.103608+00	HkaK2whBjJR2
prasath@htic.iitm.ac.in	f	2025-09-06 16:26:04.130541+00	rsJT1jelPUkp
prasath@htic.iitm.ac.in	f	2025-09-06 16:27:02.114906+00	dSAIyXQ1xNAQ
prasath@htic.iitm.ac.in	f	2025-09-06 16:27:08.607372+00	JRcWzdpDFPwe
prasath@htic.iitm.ac.in	f	2025-09-06 16:27:08.641273+00	G6TXjGQ68wg0
prasath@htic.iitm.ac.in	f	2025-09-06 16:28:50.350769+00	jp6JNQsDABWl
prasath@htic.iitm.ac.in	f	2025-09-06 16:28:50.388724+00	x9YoFbspj5KW
prasath@htic.iitm.ac.in	f	2025-09-06 16:30:15.180217+00	Oi9cVPR4aQvV
prasath@htic.iitm.ac.in	f	2025-09-06 16:30:15.203077+00	DrDuHf6knqN8
prasath@htic.iitm.ac.in	f	2025-09-06 16:32:21.122736+00	vTxrF4wzotTv
prasath@htic.iitm.ac.in	f	2025-09-06 16:32:36.105202+00	CTisT0367Qsc
prasath@htic.iitm.ac.in	f	2025-09-06 16:32:42.160693+00	0JIHNWWbPWBl
prasath@htic.iitm.ac.in	f	2025-09-06 16:32:48.054557+00	Xtv6FgUhdRNv
prasath@htic.iitm.ac.in	f	2025-09-06 16:32:48.091495+00	lH1JGbOijn4u
prasath@htic.iitm.ac.in	f	2025-09-06 16:33:27.152703+00	pdwkFlWo1FKu
prasath@htic.iitm.ac.in	f	2025-09-06 16:33:50.128636+00	fqE9lXzcLSoc
prasath@htic.iitm.ac.in	f	2025-09-06 16:33:59.081964+00	A5jp9CDijn8p
prasath@htic.iitm.ac.in	f	2025-09-06 16:34:56.293021+00	DcCVfRKQzx0X
prasath@htic.iitm.ac.in	f	2025-09-06 16:35:26.40593+00	MPbaOv98LLDi
prasath@htic.iitm.ac.in	f	2025-09-06 16:36:11.232716+00	p3vS44v7prhN
prasath@htic.iitm.ac.in	f	2025-09-06 16:36:11.257379+00	USKu1znGaLrE
prasath@htic.iitm.ac.in	f	2025-09-06 16:36:28.117661+00	L0pdBRvWuZ2T
prasath@htic.iitm.ac.in	f	2025-09-06 16:36:38.153753+00	F9dzyv0Coi15
prasath@htic.iitm.ac.in	f	2025-09-06 16:37:34.354853+00	4f2AHhP9miD7
prasath@htic.iitm.ac.in	f	2025-09-06 16:37:51.887708+00	7vdHoxQNweD4
prasath@htic.iitm.ac.in	f	2025-09-06 16:38:03.173305+00	GiGfnJ3VaFXs
prasath@htic.iitm.ac.in	f	2025-09-06 16:38:32.143015+00	7OcSLT4nNh6D
prasath@htic.iitm.ac.in	f	2025-09-06 16:38:37.679951+00	B5zVnwGlwrxO
prasath@htic.iitm.ac.in	f	2025-09-06 16:38:49.094954+00	WnwUF0raDo1d
prasath@htic.iitm.ac.in	f	2025-09-06 16:39:32.107584+00	0ANbTcg8gfys
prasath@htic.iitm.ac.in	f	2025-09-06 16:39:43.813035+00	kQZFT9yTohcR
prasath@htic.iitm.ac.in	f	2025-09-06 16:39:53.038109+00	r62MGJWSauwD
prasath@htic.iitm.ac.in	f	2025-09-06 16:40:16.123425+00	AF1TUQ1L03PK
prasath@htic.iitm.ac.in	f	2025-09-06 16:40:23.116968+00	RmGHNy65KLcw
prasath@htic.iitm.ac.in	f	2025-09-06 16:41:16.216135+00	5hm7w6JiOMLR
prasath@htic.iitm.ac.in	f	2025-09-06 16:43:34.12563+00	2nM6aTtETOLP
prasath@htic.iitm.ac.in	f	2025-09-06 16:45:22.175576+00	fHKxm9kapxP2
prasath@htic.iitm.ac.in	f	2025-09-06 16:45:52.28006+00	MzdpCvOdronE
prasath@htic.iitm.ac.in	f	2025-09-06 16:45:52.329228+00	wuzyOgnScvLg
prasath@htic.iitm.ac.in	f	2025-09-08 05:24:07.872844+00	EwGInT57wqpa
prasath@htic.iitm.ac.in	f	2025-09-08 05:24:07.912853+00	CoMzvsVeq6La
prasath@htic.iitm.ac.in	f	2025-09-08 05:57:06.764137+00	MTk8hNGxcBOf
prasath@htic.iitm.ac.in	f	2025-09-08 05:57:06.843854+00	XD0ZXdmuf0lF
prasath@htic.iitm.ac.in	f	2025-09-08 05:58:47.713111+00	n69fumDjcTQ8
prasath@htic.iitm.ac.in	f	2025-09-08 05:58:47.745008+00	UQWTzoTp4UAK
abc@abc.abc	f	2025-09-08 06:25:22.274279+00	50CAkYd8jk3m
prasath@htic.iitm.ac.in	f	2025-09-08 06:27:21.627893+00	hauYDi35bTDS
prasath@htic.iitm.ac.in	f	2025-09-08 06:27:21.869785+00	zc56N39tZ5Xg
prasath@htic.iitm.ac.in	f	2025-09-08 06:27:35.499796+00	nyDt0bVRqcr4
prasath@htic.iitm.ac.in	f	2025-09-08 06:27:35.565617+00	yKzTtonQxfxj
prasath@htic.iitm.ac.in	f	2025-09-08 06:44:28.589977+00	xPH3G1lfh1Bm
prasath@htic.iitm.ac.in	f	2025-09-08 06:44:28.649929+00	u3QBED62JEJr
prasath@htic.iitm.ac.in	f	2025-09-08 06:44:47.400622+00	MC7dR8qe6rvZ
prasath@htic.iitm.ac.in	f	2025-09-08 06:44:47.428953+00	GKzoOZyXi1uZ
prasath@htic.iitm.ac.in	f	2025-09-08 07:39:41.089007+00	Ia6mw9k01sCS
prasath@htic.iitm.ac.in	f	2025-09-08 07:39:41.127924+00	VdsBossdWyqF
prasath@htic.iitm.ac.in	f	2025-09-08 07:41:35.060828+00	LM4TIkIUNvhl
prasath@htic.iitm.ac.in	f	2025-09-08 07:41:35.260748+00	2xVAJWUaUgV5
prasath@htic.iitm.ac.in	f	2025-09-08 07:42:04.179209+00	TpglGQJtVr5P
prasath@htic.iitm.ac.in	f	2025-09-08 07:42:04.209597+00	HQZ9t0pu9Kcv
prasath@htic.iitm.ac.in	f	2025-09-08 07:42:11.379115+00	L1eiD88RZDYr
prasath@htic.iitm.ac.in	f	2025-09-08 07:44:00.731194+00	wQQZpECsMwfN
prasath@htic.iitm.ac.in	f	2025-09-08 07:44:03.459469+00	018jkMkt5EkU
prasath@htic.iitm.ac.in	f	2025-09-08 07:44:21.419568+00	Hvn28sVkeIsr
prasath@htic.iitm.ac.in	f	2025-09-08 07:45:05.633553+00	6nml0d4RylpV
prasath@htic.iitm.ac.in	f	2025-09-08 07:45:05.663498+00	FBZhCxstra6F
prasath@htic.iitm.ac.in	f	2025-09-08 07:45:31.886635+00	FDDhbebgS1Km
prasath@htic.iitm.ac.in	f	2025-09-08 07:45:39.58278+00	ELXCTLK3QtFW
prasath@htic.iitm.ac.in	f	2025-09-08 07:45:50.441371+00	sip7X01imBjf
prasath@htic.iitm.ac.in	f	2025-09-08 07:45:59.611566+00	2ysPETBaA9Ym
prasath@htic.iitm.ac.in	f	2025-09-08 07:46:10.215598+00	VymZ7vje8c0Q
prasath@htic.iitm.ac.in	f	2025-09-08 07:46:16.553816+00	bwHLhk2zAmPl
prasath@htic.iitm.ac.in	f	2025-09-08 07:46:23.6993+00	GKiJvngrNW3n
prasath@htic.iitm.ac.in	f	2025-09-08 07:46:23.724256+00	pfRSjCUdWW8j
prasath@htic.iitm.ac.in	f	2025-09-08 07:47:38.613326+00	EmAIbj9YUMOt
prasath@htic.iitm.ac.in	f	2025-09-08 07:47:38.642778+00	4LXhr4pbhioe
prasath@htic.iitm.ac.in	f	2025-09-08 07:47:49.944051+00	4sxUwXabKMlV
prasath@htic.iitm.ac.in	f	2025-09-08 07:47:49.981053+00	Ctt4o0XIvNAJ
prasath@htic.iitm.ac.in	f	2025-09-08 07:50:10.796205+00	TreQNxn33MXU
prasath@htic.iitm.ac.in	f	2025-09-08 07:51:28.663639+00	pr1eEmhurQfr
prasath@htic.iitm.ac.in	f	2025-09-08 07:52:55.404799+00	MYv8G9WgfoDB
prasath@htic.iitm.ac.in	f	2025-09-08 07:58:18.805009+00	1K5ul9sj3zUS
prasath@htic.iitm.ac.in	f	2025-09-08 07:58:30.078995+00	MRt2b2j6DMrU
prasath@htic.iitm.ac.in	f	2025-09-08 07:58:50.561084+00	7oNOnW7Owb3Y
prasath@htic.iitm.ac.in	f	2025-09-08 07:59:27.695843+00	fCChaw9mTh10
prasath@htic.iitm.ac.in	f	2025-09-08 07:59:27.837852+00	CjoF1SeUVk6i
prasath@htic.iitm.ac.in	f	2025-09-08 07:59:55.637938+00	P0IMLUdRh0rk
prasath@htic.iitm.ac.in	f	2025-09-08 08:00:13.698883+00	3ESJjXrjdWNX
prasath@htic.iitm.ac.in	f	2025-09-08 08:00:40.120014+00	UaiIMzDisa3x
prasath@htic.iitm.ac.in	f	2025-09-08 08:01:55.796962+00	5pGEYwxSgLlJ
prasath@htic.iitm.ac.in	f	2025-09-08 08:01:55.822611+00	iTM69SIRpwJL
prasath@htic.iitm.ac.in	f	2025-09-08 08:02:03.009223+00	oYtpwZBDQsl1
prasath@htic.iitm.ac.in	f	2025-09-08 08:02:03.032438+00	eucHP57eFveM
prasath@htic.iitm.ac.in	f	2025-09-08 08:04:39.708816+00	N2DJamGeYlgP
prasath@htic.iitm.ac.in	f	2025-09-08 08:04:44.722246+00	ipOR10zmJiRC
prasath@htic.iitm.ac.in	f	2025-09-08 08:04:54.690453+00	qInaReEq6vKd
prasath@htic.iitm.ac.in	f	2025-09-08 08:05:03.957753+00	jpyC2ALMGB0L
prasath@htic.iitm.ac.in	f	2025-09-08 08:05:23.96867+00	d83lBeEAa5Wf
prasath@htic.iitm.ac.in	f	2025-09-08 08:19:29.829707+00	zqn6itOWH7SC
prasath@htic.iitm.ac.in	f	2025-09-08 08:19:34.756805+00	iKhkDML1ftnD
prasath@htic.iitm.ac.in	f	2025-09-08 09:15:35.839797+00	EjxVb994PldL
prasath@htic.iitm.ac.in	f	2025-09-08 09:15:35.86574+00	2FiRF3HkDqnq
prasath@htic.iitm.ac.in	f	2025-09-08 09:15:35.890424+00	BnwJHbRaQ8e9
prasath@htic.iitm.ac.in	f	2025-09-08 09:15:36.081313+00	8WSePsYVEDJl
prasath@htic.iitm.ac.in	f	2025-09-08 09:15:44.141205+00	b1gQ2jKW3oCy
prasath@htic.iitm.ac.in	f	2025-09-08 09:15:44.165324+00	O9GiBztyuNZ5
prasath@htic.iitm.ac.in	f	2025-09-08 09:16:06.656703+00	Ld0XUg18cqJh
prasath@htic.iitm.ac.in	f	2025-09-08 09:16:06.681907+00	TVuu0aKLPtfs
prasath@htic.iitm.ac.in	f	2025-09-08 09:16:06.708055+00	3FIMWScJz9A5
prasath@htic.iitm.ac.in	f	2025-09-08 09:16:07.821063+00	ZzCpLCBOJEft
prasath@htic.iitm.ac.in	f	2025-09-08 09:16:50.673615+00	TTwZc4SPVHwB
prasath@htic.iitm.ac.in	f	2025-09-08 09:16:50.698318+00	yeI222JJTzaF
prasath@htic.iitm.ac.in	f	2025-09-08 09:16:50.727843+00	F2Dw5kaqjCkX
prasath@htic.iitm.ac.in	f	2025-09-08 09:16:50.768201+00	dCYWUyYwfhkD
prasath@htic.iitm.ac.in	f	2025-09-08 09:16:58.039724+00	SrOhNz1wzLCi
prasath@htic.iitm.ac.in	f	2025-09-08 09:16:58.295941+00	cwKEUgqA7cSa
prasath@htic.iitm.ac.in	f	2025-09-08 09:18:11.669428+00	41eku82L4KJT
prasath@htic.iitm.ac.in	f	2025-09-08 09:18:11.69561+00	uP0LbgRMfId8
prasath@htic.iitm.ac.in	f	2025-09-08 09:18:14.668025+00	BQ0fTE74wN7M
prasath@htic.iitm.ac.in	f	2025-09-08 09:18:14.693672+00	VU5Ay4HOkYM4
prasath@htic.iitm.ac.in	f	2025-09-08 09:18:18.067537+00	kgddm9NFFKZl
prasath@htic.iitm.ac.in	f	2025-09-08 09:18:18.09363+00	70mAC4JmLhmL
prasath@htic.iitm.ac.in	f	2025-09-08 09:18:25.956946+00	SBdMjdSspp4b
prasath@htic.iitm.ac.in	f	2025-09-08 09:18:26.003296+00	asEwnpnfuvLc
prasath@htic.iitm.ac.in	f	2025-09-08 09:20:53.703665+00	HgGMXmaHjjAI
prasath@htic.iitm.ac.in	f	2025-09-08 09:20:53.730154+00	ErYQuCfA7rU7
prasath@htic.iitm.ac.in	f	2025-09-08 09:20:53.898162+00	dEY43KKz80ne
prasath@htic.iitm.ac.in	f	2025-09-08 09:20:53.923512+00	ONhIySHdLce6
prasath@htic.iitm.ac.in	f	2025-09-08 09:21:10.630034+00	QQq2Rde2jkAG
prasath@htic.iitm.ac.in	f	2025-09-08 09:21:10.656192+00	mGvVoEM7w2YE
prasath@htic.iitm.ac.in	f	2025-09-08 09:21:10.68318+00	UedZkJpMu43H
prasath@htic.iitm.ac.in	f	2025-09-08 09:21:10.709646+00	90nwk7V0COXU
prasath@htic.iitm.ac.in	f	2025-09-08 09:21:22.026555+00	6fdsZgQXwlRX
prasath@htic.iitm.ac.in	f	2025-09-08 09:21:22.294045+00	BFyndmYRp387
prasath@htic.iitm.ac.in	f	2025-09-08 09:24:30.685824+00	eiBdFDRgSzY6
prasath@htic.iitm.ac.in	f	2025-09-08 09:24:30.714621+00	X3N0fuPcvzjx
prasath@htic.iitm.ac.in	f	2025-09-08 09:24:37.67814+00	yvFagLM4L9BE
prasath@htic.iitm.ac.in	f	2025-09-08 09:24:37.702981+00	9slnukYCizle
prasath@htic.iitm.ac.in	f	2025-09-08 09:24:43.697266+00	5hDX75KLCkWM
prasath@htic.iitm.ac.in	f	2025-09-08 09:24:43.736425+00	1xQhRpBMQTXH
prasath@htic.iitm.ac.in	f	2025-09-08 09:24:49.019577+00	BtnRPXC7K8QW
prasath@htic.iitm.ac.in	f	2025-09-08 09:24:49.046763+00	MUeVJpAy65kG
prasath@htic.iitm.ac.in	f	2025-09-08 09:24:57.661191+00	UDzcXH28gd2O
prasath@htic.iitm.ac.in	f	2025-09-08 09:24:57.688285+00	4JVuSI7VPkrd
prasath@htic.iitm.ac.in	f	2025-09-08 09:26:19.693558+00	CzLAJ8OMf6hO
prasath@htic.iitm.ac.in	f	2025-09-08 09:26:19.723982+00	cXK3OcnchrxC
prasath@htic.iitm.ac.in	f	2025-09-08 09:26:24.675165+00	lipUxmiQLxKR
prasath@htic.iitm.ac.in	f	2025-09-08 09:26:24.706233+00	8OOL6SK5bssF
prasath@htic.iitm.ac.in	f	2025-09-08 09:32:32.926199+00	0OqFU8hXPqya
prasath@htic.iitm.ac.in	f	2025-09-08 09:32:32.951423+00	A3v9o7Fs1RA7
prasath@htic.iitm.ac.in	f	2025-09-08 09:33:09.374835+00	cdOYGjJzOOa6
prasath@htic.iitm.ac.in	f	2025-09-08 09:33:09.415375+00	BXcvUuidZpcm
prasath@htic.iitm.ac.in	f	2025-09-08 09:33:29.461125+00	1iEhR2NJq7wy
prasath@htic.iitm.ac.in	f	2025-09-08 09:33:29.705616+00	T32VwQQ8KQJR
prasath@htic.iitm.ac.in	f	2025-09-08 09:33:46.680101+00	S19mObEEVcbL
prasath@htic.iitm.ac.in	f	2025-09-08 09:33:46.707881+00	KZNGNsN2y0KM
prasath@htic.iitm.ac.in	f	2025-09-08 09:34:01.782698+00	2Mm2I3Ybhsu3
prasath@htic.iitm.ac.in	f	2025-09-08 09:34:02.101643+00	sNQgMdV1nYQi
prasath@htic.iitm.ac.in	f	2025-09-08 09:36:06.672878+00	g9goCCt4g8JC
prasath@htic.iitm.ac.in	f	2025-09-08 09:36:06.702482+00	eInv7VLk4xqx
prasath@htic.iitm.ac.in	f	2025-09-08 09:36:11.499469+00	vbNtg4NoXOjz
prasath@htic.iitm.ac.in	f	2025-09-08 09:36:11.52651+00	ScYAXa8X7wvk
prasath@htic.iitm.ac.in	f	2025-09-08 09:36:37.171458+00	J46algGZuRKc
prasath@htic.iitm.ac.in	f	2025-09-08 09:38:04.234587+00	hGyMcB4Rudu1
prasath@htic.iitm.ac.in	f	2025-09-08 09:38:04.504378+00	iL6KTLqdHuaG
prasath@htic.iitm.ac.in	f	2025-09-08 09:38:21.226138+00	zs8ELke5Iq13
prasath@htic.iitm.ac.in	f	2025-09-08 09:38:21.463455+00	9yCnovvSapuA
prasath@htic.iitm.ac.in	f	2025-09-08 09:38:36.091063+00	h2kCx0o3DKMF
prasath@htic.iitm.ac.in	f	2025-09-08 09:38:36.11614+00	R2kN5yPUC67T
prasath@htic.iitm.ac.in	f	2025-09-08 09:38:38.880372+00	Av8Da33D62tI
prasath@htic.iitm.ac.in	f	2025-09-08 09:38:39.201576+00	tSv58UnVoMPx
prasath@htic.iitm.ac.in	f	2025-09-08 09:38:46.364175+00	NchYJZzku81X
prasath@htic.iitm.ac.in	f	2025-09-08 09:38:46.388785+00	lM7vciwqV0X5
prasath@htic.iitm.ac.in	f	2025-09-08 09:38:53.318507+00	8Dd7BuzoZWmw
prasath@htic.iitm.ac.in	f	2025-09-08 09:38:53.570901+00	Z5SxgybhJPPf
prasath@htic.iitm.ac.in	f	2025-09-08 09:39:02.98803+00	3YCaRtmvQgb0
prasath@htic.iitm.ac.in	f	2025-09-08 09:39:03.055353+00	DDcYT3PN5McD
prasath@htic.iitm.ac.in	f	2025-09-08 09:39:05.666201+00	F9EXTJh3ccez
prasath@htic.iitm.ac.in	f	2025-09-08 09:39:05.691332+00	vBiBhPBYrT0b
prasath@htic.iitm.ac.in	f	2025-09-08 09:41:03.789942+00	L1eOPOCzxgQb
prasath@htic.iitm.ac.in	f	2025-09-08 09:41:03.818023+00	ibvyJOj46xpa
prasath@htic.iitm.ac.in	f	2025-09-08 09:41:17.705709+00	KRLxXXnAmO8Z
prasath@htic.iitm.ac.in	f	2025-09-08 09:41:17.731607+00	MdrD9ppDZp8e
prasath@htic.iitm.ac.in	f	2025-09-08 09:41:24.199036+00	T6J7dwKMHUwJ
prasath@htic.iitm.ac.in	f	2025-09-08 09:41:24.237009+00	xw7OcM8tQbll
prasath@htic.iitm.ac.in	f	2025-09-08 09:41:32.796384+00	UxRVcrEXwjnY
prasath@htic.iitm.ac.in	f	2025-09-08 09:41:32.825363+00	4DRvpzhCTLLH
prasath@htic.iitm.ac.in	f	2025-09-08 09:43:43.870046+00	GI8vfiTn9fiu
prasath@htic.iitm.ac.in	f	2025-09-08 09:43:43.893843+00	uIojwDEl4lss
prasath@htic.iitm.ac.in	f	2025-09-08 09:44:13.45833+00	bSfjQHTpKTWK
prasath@htic.iitm.ac.in	f	2025-09-08 09:44:13.685892+00	6cVMnuq1Ggyq
prasath@htic.iitm.ac.in	f	2025-09-08 09:44:18.33557+00	kNAJYm4H7TCa
prasath@htic.iitm.ac.in	f	2025-09-08 09:44:18.363288+00	bAQKRhAckGYl
prasath@htic.iitm.ac.in	f	2025-09-08 09:44:25.029354+00	848vxHHICfKS
prasath@htic.iitm.ac.in	f	2025-09-08 09:44:25.363097+00	fvLPZUxsSEiz
prasath@htic.iitm.ac.in	f	2025-09-08 09:45:13.694171+00	br2S8NgEDlRR
prasath@htic.iitm.ac.in	f	2025-09-08 09:45:13.719616+00	LRxa7IxC9r0q
prasath@htic.iitm.ac.in	f	2025-09-08 09:45:21.327551+00	fHSEmO2DIN48
prasath@htic.iitm.ac.in	f	2025-09-08 09:45:21.355395+00	5laCN0hKe88C
prasath@htic.iitm.ac.in	f	2025-09-08 09:45:24.111895+00	d2SB18kRdEkO
prasath@htic.iitm.ac.in	f	2025-09-08 09:45:24.136942+00	2wgwltJMXF2H
prasath@htic.iitm.ac.in	f	2025-09-08 09:45:55.78036+00	Ubw1IL703GsA
prasath@htic.iitm.ac.in	f	2025-09-08 09:45:55.807541+00	Q3tUYSgEjGu1
prasath@htic.iitm.ac.in	f	2025-09-08 09:46:28.748011+00	xSYt6jpMHq7W
prasath@htic.iitm.ac.in	f	2025-09-08 09:46:28.790797+00	t6uESdXvgVZM
prasath@htic.iitm.ac.in	f	2025-09-08 09:46:41.914149+00	S4VIP2IwyVYh
prasath@htic.iitm.ac.in	f	2025-09-08 09:46:41.940299+00	I9co0BxePKyL
prasath@htic.iitm.ac.in	f	2025-09-08 09:46:58.035695+00	k1rtA13MXbEu
prasath@htic.iitm.ac.in	f	2025-09-08 09:46:58.675265+00	yvsGwIKDBy0e
prasath@htic.iitm.ac.in	f	2025-09-08 09:46:59.783254+00	hhpHgFCq97ao
prasath@htic.iitm.ac.in	f	2025-09-08 09:46:59.811021+00	JST1l4dmC6G0
prasath@htic.iitm.ac.in	f	2025-09-08 09:47:05.30626+00	bcaGuDYq2UGa
prasath@htic.iitm.ac.in	f	2025-09-08 09:47:05.332483+00	5ZsOXo2zKK1c
prasath@htic.iitm.ac.in	f	2025-09-08 09:47:12.731814+00	veXUet438pE6
prasath@htic.iitm.ac.in	f	2025-09-08 09:47:13.686407+00	igD3XcsJveCK
prasath@htic.iitm.ac.in	f	2025-09-08 09:47:13.829298+00	48msWoRZK3DT
prasath@htic.iitm.ac.in	f	2025-09-08 09:47:13.855026+00	0YfAbvqJJPf3
prasath@htic.iitm.ac.in	f	2025-09-08 09:47:19.741326+00	wa2U76gjxkfD
prasath@htic.iitm.ac.in	f	2025-09-08 09:47:20.020086+00	ryPyv8nyII0p
prasath@htic.iitm.ac.in	f	2025-09-08 09:47:47.680282+00	BGpeMwRBtci7
prasath@htic.iitm.ac.in	f	2025-09-08 09:47:47.714574+00	oMaA3qiuOSMX
prasath@htic.iitm.ac.in	f	2025-09-08 09:47:48.031975+00	mLcA4JKZVJf5
prasath@htic.iitm.ac.in	f	2025-09-08 09:47:48.06029+00	HToXxEOeJ49m
prasath@htic.iitm.ac.in	f	2025-09-08 09:48:00.02676+00	FPZMGk5ZKJX7
prasath@htic.iitm.ac.in	f	2025-09-08 09:48:00.05572+00	7bmlJJ86ysGP
prasath@htic.iitm.ac.in	f	2025-09-08 09:48:23.186699+00	c1Uz1seEilB2
prasath@htic.iitm.ac.in	f	2025-09-08 09:48:23.427929+00	Hia17sLipFyh
prasath@htic.iitm.ac.in	f	2025-09-08 09:49:00.679643+00	AxfKYzWS1Ngk
prasath@htic.iitm.ac.in	f	2025-09-08 09:49:00.706262+00	gwg7b4WcxkN9
prasath@htic.iitm.ac.in	f	2025-09-08 09:49:06.699264+00	ogolKCqs8pGP
prasath@htic.iitm.ac.in	f	2025-09-08 09:49:07.264665+00	1yZWzeGICMoP
prasath@htic.iitm.ac.in	f	2025-09-08 09:49:09.281969+00	YAYBhVr7ut6W
prasath@htic.iitm.ac.in	f	2025-09-08 09:49:09.522316+00	RxnLWtG2Xvpo
prasath@htic.iitm.ac.in	f	2025-09-08 09:49:48.817544+00	NFqjDvZi0Z8h
prasath@htic.iitm.ac.in	f	2025-09-08 09:49:48.849882+00	QEXMZ0C1QYLx
prasath@htic.iitm.ac.in	f	2025-09-08 09:50:42.919958+00	I4JUfQzT4lP3
prasath@htic.iitm.ac.in	f	2025-09-08 09:50:43.479198+00	RTZMPD6QmYFI
prasath@htic.iitm.ac.in	f	2025-09-08 09:51:05.332711+00	ZPtC6z6uSP7R
prasath@htic.iitm.ac.in	f	2025-09-08 09:51:05.689698+00	vThlPiskyuat
prasath@htic.iitm.ac.in	f	2025-09-08 09:51:41.690684+00	RIFt5rZWwhNz
prasath@htic.iitm.ac.in	f	2025-09-08 09:51:41.715727+00	vxE3Bj3znGZN
prasath@htic.iitm.ac.in	f	2025-09-08 09:51:45.961445+00	6OqtBid1LwOp
prasath@htic.iitm.ac.in	f	2025-09-08 09:51:45.986751+00	yY7UQ2vuuUQE
prasath@htic.iitm.ac.in	f	2025-09-08 09:51:54.776813+00	kh2O5vMcXZea
prasath@htic.iitm.ac.in	f	2025-09-08 09:51:54.803903+00	brJZwQGuRsv2
prasath@htic.iitm.ac.in	f	2025-09-08 09:52:38.432259+00	byOxTyvOdrFM
prasath@htic.iitm.ac.in	f	2025-09-08 09:52:38.721058+00	hTxHAXYnStTP
prasath@htic.iitm.ac.in	f	2025-09-08 09:52:57.556184+00	gwPk0XOOfwnp
prasath@htic.iitm.ac.in	f	2025-09-08 09:52:57.581188+00	TEvUqlzDOZuL
prasath@htic.iitm.ac.in	f	2025-09-08 09:53:19.863672+00	EQsCVWOocpwC
prasath@htic.iitm.ac.in	f	2025-09-08 09:53:20.692764+00	UrzfXtJuAjuo
prasath@htic.iitm.ac.in	f	2025-09-08 09:54:03.297571+00	bbW8NqQOWLaO
prasath@htic.iitm.ac.in	f	2025-09-08 09:54:03.532045+00	ZRB5ACK1DaVP
prasath@htic.iitm.ac.in	f	2025-09-08 09:54:22.429103+00	FK9Kine2CETQ
prasath@htic.iitm.ac.in	f	2025-09-08 09:54:22.456171+00	6mvlEMJCLXxP
prasath@htic.iitm.ac.in	f	2025-09-08 09:54:29.985299+00	3Pphb03BbhJF
prasath@htic.iitm.ac.in	f	2025-09-08 09:54:30.010943+00	D642klTz0d9d
prasath@htic.iitm.ac.in	f	2025-09-08 09:54:33.335536+00	uf3fHcXXcpMj
prasath@htic.iitm.ac.in	f	2025-09-08 09:54:33.362473+00	dS3dIztokIWP
prasath@htic.iitm.ac.in	f	2025-09-08 09:54:36.835804+00	1e1B6ZnaQgiX
prasath@htic.iitm.ac.in	f	2025-09-08 09:54:36.86065+00	ZUoeK7uE7pLm
prasath@htic.iitm.ac.in	f	2025-09-08 09:55:19.016585+00	Wa0G4r3TvTB5
prasath@htic.iitm.ac.in	f	2025-09-08 09:55:19.044829+00	fWUXw3n29MUQ
prasath@htic.iitm.ac.in	f	2025-09-08 09:55:28.455412+00	mfdrvzXfD2tZ
prasath@htic.iitm.ac.in	f	2025-09-08 09:55:28.491871+00	yr144EC6LZZ2
prasath@htic.iitm.ac.in	f	2025-09-08 10:34:36.708899+00	2BeJHygjjDre
prasath@htic.iitm.ac.in	f	2025-09-08 10:34:36.944458+00	ejDNP8hGS8Wh
prasath@htic.iitm.ac.in	f	2025-09-08 10:35:33.706293+00	tXMx13RHSodm
prasath@htic.iitm.ac.in	f	2025-09-08 10:35:33.795067+00	s3ouTdWmlqLX
prasath@htic.iitm.ac.in	f	2025-09-08 10:36:23.483372+00	H7R0EZX9Mtt5
prasath@htic.iitm.ac.in	f	2025-09-08 10:36:23.534228+00	sqZDKt8188Oi
prasath@htic.iitm.ac.in	f	2025-09-08 10:38:11.881212+00	MaWgUBEokFTE
prasath@htic.iitm.ac.in	f	2025-09-08 10:38:11.919678+00	zBjDWdswoIMr
prasath@htic.iitm.ac.in	f	2025-09-08 10:38:12.268692+00	shVwSx6qIQBi
prasath@htic.iitm.ac.in	f	2025-09-08 10:38:12.319149+00	60BFOgCPKyE2
prasath@htic.iitm.ac.in	f	2025-09-08 10:38:56.546125+00	eUI2yyY0rJkM
prasath@htic.iitm.ac.in	f	2025-09-08 10:38:56.604506+00	6cqPeQmyuMvX
prasath@htic.iitm.ac.in	f	2025-09-08 10:39:41.676171+00	lDrNb8uvgcGp
prasath@htic.iitm.ac.in	f	2025-09-08 10:39:41.712219+00	y2Mrh5mncCm6
prasath@htic.iitm.ac.in	f	2025-09-08 10:39:50.336042+00	ZGdnz2GkjuFS
prasath@htic.iitm.ac.in	f	2025-09-08 10:39:50.406893+00	cF7yyq0bVOIe
prasath@htic.iitm.ac.in	f	2025-09-08 10:40:03.307036+00	gMMyWclVpyRS
prasath@htic.iitm.ac.in	f	2025-09-08 10:40:04.018274+00	auNQwpysbIAE
prasath@htic.iitm.ac.in	f	2025-09-08 10:40:27.153524+00	hlZDF1FpcFc7
prasath@htic.iitm.ac.in	f	2025-09-08 10:40:28.105863+00	9CW3hMLaCFna
prasath@htic.iitm.ac.in	f	2025-09-08 10:40:41.588932+00	W5xtPTdYg23O
prasath@htic.iitm.ac.in	f	2025-09-08 10:40:41.984177+00	FWdYA0VRXbih
prasath@htic.iitm.ac.in	f	2025-09-08 10:40:48.301404+00	S59lVDSHY495
prasath@htic.iitm.ac.in	f	2025-09-08 10:40:48.331309+00	7W05kLPorlMO
prasath@htic.iitm.ac.in	f	2025-09-08 10:41:22.967098+00	aMLGMa2U4uCE
prasath@htic.iitm.ac.in	f	2025-09-08 10:41:23.039219+00	Snosx2ZTxxJC
prasath@htic.iitm.ac.in	f	2025-09-08 10:41:46.022542+00	yiquPo8172Qb
prasath@htic.iitm.ac.in	f	2025-09-08 10:41:46.06253+00	bdjSnbqdAjXO
prasath@htic.iitm.ac.in	f	2025-09-08 10:41:49.015666+00	lUGx6ChNDisU
prasath@htic.iitm.ac.in	f	2025-09-08 10:41:49.054718+00	Nfg6fz7p3eV0
prasath@htic.iitm.ac.in	f	2025-09-08 10:42:06.104772+00	FJPdAFzKGs4c
prasath@htic.iitm.ac.in	f	2025-09-08 10:42:06.991268+00	j1l0EUVzYkPe
prasath@htic.iitm.ac.in	f	2025-09-08 10:42:36.979443+00	KAOVqzUNyoCq
prasath@htic.iitm.ac.in	f	2025-09-08 10:42:37.027567+00	vfI2n2KzxiJc
prasath@htic.iitm.ac.in	f	2025-09-08 10:42:43.41325+00	ZQ9XNvdxvddS
prasath@htic.iitm.ac.in	f	2025-09-08 10:42:43.994914+00	Tg1w3vPJtItU
prasath@htic.iitm.ac.in	f	2025-09-08 10:43:00.523104+00	8XUK0KCuVN9v
prasath@htic.iitm.ac.in	f	2025-09-08 10:43:01.113155+00	wKaThvSWlBD4
prasath@htic.iitm.ac.in	f	2025-09-08 10:43:15.302276+00	bkfrmRgftfro
prasath@htic.iitm.ac.in	f	2025-09-08 10:43:16.01075+00	JTeWSNjArqmp
prasath@htic.iitm.ac.in	f	2025-09-08 10:43:26.584886+00	urzUklOKO07g
prasath@htic.iitm.ac.in	f	2025-09-08 10:43:26.618165+00	A6xTRmAvjHqG
prasath@htic.iitm.ac.in	f	2025-09-08 10:45:34.631844+00	vVkeiYeyLvyl
prasath@htic.iitm.ac.in	f	2025-09-08 10:45:34.675167+00	rKlRE97cInsj
prasath@htic.iitm.ac.in	f	2025-09-08 10:46:03.95342+00	on1it2ucomin
prasath@htic.iitm.ac.in	f	2025-09-08 10:46:03.997133+00	C1aHwVL5agtb
prasath@htic.iitm.ac.in	f	2025-09-08 10:46:04.048955+00	59dlE4dSYLEA
prasath@htic.iitm.ac.in	f	2025-09-08 10:46:04.087173+00	AAKvvMhWFTBr
prasath@htic.iitm.ac.in	f	2025-09-08 10:46:17.423816+00	FaQygxhJKQ5U
prasath@htic.iitm.ac.in	f	2025-09-08 10:46:17.559913+00	40dWdI0E3Sps
prasath@htic.iitm.ac.in	f	2025-09-08 10:46:23.987606+00	ryjk6vlHRue2
prasath@htic.iitm.ac.in	f	2025-09-08 10:46:24.115932+00	oEeZnmfUsahT
prasath@htic.iitm.ac.in	f	2025-09-08 10:58:56.587383+00	KGlw7MdWTVIU
prasath@htic.iitm.ac.in	f	2025-09-08 10:58:56.618332+00	l6hVaQnc44bT
prasath@htic.iitm.ac.in	f	2025-09-08 11:00:22.855931+00	lVjGvPIkEGF2
prasath@htic.iitm.ac.in	f	2025-09-08 11:00:22.886682+00	510s3OUy2L7z
prasath@htic.iitm.ac.in	f	2025-09-08 11:01:41.835975+00	uLiAe2yaNBak
prasath@htic.iitm.ac.in	f	2025-09-08 11:01:41.917914+00	SFfbSTBvj3Yy
prasath@htic.iitm.ac.in	f	2025-09-08 11:02:01.914415+00	4JF8HY4ZPqq9
prasath@htic.iitm.ac.in	f	2025-09-08 11:02:01.948361+00	yZE0Zz102I0f
prasath@htic.iitm.ac.in	f	2025-09-08 11:02:04.976448+00	HdE2srQkvb29
prasath@htic.iitm.ac.in	f	2025-09-08 11:02:05.016698+00	LwO5Ws2mA30g
prasath@htic.iitm.ac.in	f	2025-09-08 11:03:18.829717+00	Mza7eUuhR8FH
prasath@htic.iitm.ac.in	f	2025-09-08 11:03:18.863384+00	eBsIvpmjsgxv
prasath@htic.iitm.ac.in	f	2025-09-08 11:06:03.690411+00	8aGFkUWN5Jcd
prasath@htic.iitm.ac.in	f	2025-09-08 11:06:03.80092+00	KxZ4wju0SdLm
prasath@htic.iitm.ac.in	f	2025-09-08 11:15:54.183264+00	kQ1onaaIuGTb
prasath@htic.iitm.ac.in	f	2025-09-08 11:15:54.286371+00	AAPFE9Mkirxo
prasath@htic.iitm.ac.in	f	2025-09-08 11:16:04.270946+00	nrAhI5Xalm4w
prasath@htic.iitm.ac.in	f	2025-09-08 11:16:04.317668+00	miyUb4f3cC3c
prasath@htic.iitm.ac.in	f	2025-09-08 11:16:28.445563+00	iw2rH6SbLusT
prasath@htic.iitm.ac.in	f	2025-09-08 11:16:28.488256+00	BAGx75maeV6C
prasath@htic.iitm.ac.in	f	2025-09-08 12:27:21.022345+00	hs0vhwaTwR4v
prasath@htic.iitm.ac.in	f	2025-09-08 12:27:21.054827+00	vNSMfe8te81j
prasath@htic.iitm.ac.in	f	2025-09-08 12:32:48.377043+00	ux3HIx124Gwh
prasath@htic.iitm.ac.in	f	2025-09-08 12:32:48.855341+00	JqWwNl2G9R8p
prasath@htic.iitm.ac.in	f	2025-09-08 12:33:10.822393+00	yEGUhuliHWBO
prasath@htic.iitm.ac.in	f	2025-09-08 12:33:11.038317+00	9crqYe0EZOHH
prasath@htic.iitm.ac.in	f	2025-09-08 12:33:26.070561+00	rc08pcVjLOQP
prasath@htic.iitm.ac.in	f	2025-09-08 12:33:26.11403+00	5TA2Q7por5j3
prasath@htic.iitm.ac.in	f	2025-09-08 12:33:33.330339+00	9HEtLbpf84jk
prasath@htic.iitm.ac.in	f	2025-09-08 12:33:33.378802+00	JJlMedrBw6Cl
prasath@htic.iitm.ac.in	f	2025-09-08 12:33:51.346807+00	XQBTcuZC2BhM
prasath@htic.iitm.ac.in	f	2025-09-08 12:33:51.376554+00	RUr24zINre1a
prasath@htic.iitm.ac.in	f	2025-09-08 12:33:59.573373+00	fpC0t6HkFgjU
prasath@htic.iitm.ac.in	f	2025-09-08 12:33:59.606198+00	F6VRDth8iW07
prasath@htic.iitm.ac.in	f	2025-09-08 12:34:11.269918+00	Ktr7STwaZov9
prasath@htic.iitm.ac.in	f	2025-09-08 12:34:11.435338+00	wLqDiEXHgcsw
prasath@htic.iitm.ac.in	f	2025-09-08 12:39:19.375578+00	aLxvZfboeUX2
prasath@htic.iitm.ac.in	f	2025-09-08 12:39:19.408249+00	hip2peYopOpN
prasath@htic.iitm.ac.in	f	2025-09-09 04:47:06.567808+00	wlRMlshCbPQh
prasath@htic.iitm.ac.in	f	2025-09-09 04:47:08.528045+00	WReKkWjzakj5
prasath@htic.iitm.ac.in	f	2025-09-09 04:47:08.76915+00	Y5cjBQ01Grtj
prasath@htic.iitm.ac.in	f	2025-09-09 05:36:54.620104+00	3pVzVGYv5hWs
prasath@htic.iitm.ac.in	f	2025-09-09 05:36:54.822246+00	ziZkq6CYtVZe
prasath@htic.iitm.ac.in	f	2025-09-09 05:54:21.622375+00	mm5IREWFmlet
prasath@htic.iitm.ac.in	f	2025-09-09 05:54:21.670954+00	GCbbFxvaybG2
prasath@htic.iitm.ac.in	f	2025-09-09 05:54:24.316722+00	bGGEqM9OQYYk
prasath@htic.iitm.ac.in	f	2025-09-09 05:54:24.364632+00	oZpZy3QPiDRb
prasath@htic.iitm.ac.in	f	2025-09-09 05:54:31.218077+00	4GnG2YQFT55m
prasath@htic.iitm.ac.in	f	2025-09-09 05:54:31.266169+00	J1DOJn67kjjQ
prasath@htic.iitm.ac.in	f	2025-09-09 05:54:41.188787+00	ThAE6aolTq0D
prasath@htic.iitm.ac.in	f	2025-09-09 05:54:41.395691+00	gtZuxdRRzceo
prasath@htic.iitm.ac.in	f	2025-09-09 05:55:27.739206+00	Lnh0MaFeZxZR
prasath@htic.iitm.ac.in	f	2025-09-09 05:55:27.79149+00	idjnvDmru2MA
prasath@htic.iitm.ac.in	f	2025-09-09 05:55:57.908024+00	4y5GsajvY3dG
prasath@htic.iitm.ac.in	f	2025-09-09 05:55:57.956664+00	cg8yE0ctEaif
prasath@htic.iitm.ac.in	f	2025-09-09 05:56:30.019279+00	obK1ijPDMpUj
prasath@htic.iitm.ac.in	f	2025-09-09 05:56:30.071914+00	PLdACR2yGz44
prasath@htic.iitm.ac.in	f	2025-09-09 05:57:00.783728+00	bjsQ7RheMEa8
prasath@htic.iitm.ac.in	f	2025-09-09 05:57:00.830608+00	BqDKQ1QUlmHi
prasath@htic.iitm.ac.in	f	2025-09-09 05:57:12.086474+00	25ibaPJrLvTj
prasath@htic.iitm.ac.in	f	2025-09-09 05:57:12.133488+00	NukMOjy2EZ8q
prasath@htic.iitm.ac.in	f	2025-09-09 05:58:16.162296+00	QG3keOSmQkUX
prasath@htic.iitm.ac.in	f	2025-09-09 05:58:16.215336+00	GX8lTwHC1qEF
prasath@htic.iitm.ac.in	f	2025-09-09 05:58:20.556383+00	ZebgRWouSbYs
prasath@htic.iitm.ac.in	f	2025-09-09 05:58:20.602216+00	5Nr7i37wuYDM
prasath@htic.iitm.ac.in	f	2025-09-09 06:00:42.623335+00	StGxnmWenppK
prasath@htic.iitm.ac.in	f	2025-09-09 06:00:42.681633+00	spqentMw7n9z
prasath@htic.iitm.ac.in	f	2025-09-09 06:06:22.112023+00	cmDiqpmknK9g
prasath@htic.iitm.ac.in	f	2025-09-09 06:06:22.212707+00	e6pyBuxU6Q1o
prasath@htic.iitm.ac.in	f	2025-09-09 06:06:25.481647+00	bxso5dSq0TU6
prasath@htic.iitm.ac.in	f	2025-09-09 06:06:25.533819+00	l80HjMvmj5ju
prasath@htic.iitm.ac.in	f	2025-09-09 06:06:49.542757+00	OftTE4hGoXWs
prasath@htic.iitm.ac.in	f	2025-09-09 06:06:49.666259+00	uQTbxOXRwwLi
prasath@htic.iitm.ac.in	f	2025-09-09 06:07:30.445637+00	yLg3SnN5p1PR
prasath@htic.iitm.ac.in	f	2025-09-09 06:07:30.498374+00	S7gwnP6OTmA2
prasath@htic.iitm.ac.in	f	2025-09-09 06:07:42.958929+00	XGnnSlKDvsp2
prasath@htic.iitm.ac.in	f	2025-09-09 06:07:43.001772+00	uAIutrsiVhLn
prasath@htic.iitm.ac.in	f	2025-09-09 06:08:08.599785+00	vYimxz9oOxNU
prasath@htic.iitm.ac.in	f	2025-09-09 06:08:08.64826+00	ecABBXKvcPPK
prasath@htic.iitm.ac.in	f	2025-09-09 06:09:15.517114+00	M8nmlWApC8I3
prasath@htic.iitm.ac.in	f	2025-09-09 06:09:15.595828+00	FJ1MgHh9kHtU
prasath@htic.iitm.ac.in	f	2025-09-09 06:24:00.657652+00	Qtns9lDHZzQQ
prasath@htic.iitm.ac.in	f	2025-09-09 06:24:00.70897+00	u1WYEJF37yFn
prasath@htic.iitm.ac.in	f	2025-09-09 07:23:42.503875+00	R1BTQjPaDt27
prasath@htic.iitm.ac.in	f	2025-09-09 07:23:42.605182+00	JDK7wE74CmXN
prasath@htic.iitm.ac.in	f	2025-09-09 07:23:52.231562+00	Ge0n4jUHQz44
prasath@htic.iitm.ac.in	f	2025-09-09 07:23:52.277524+00	9tq8tIXkSawn
prasath@htic.iitm.ac.in	f	2025-09-09 09:42:42.503324+00	xij8SdGqqAmD
prasath@htic.iitm.ac.in	f	2025-09-09 09:42:42.527985+00	JewEMrHDRRYG
prasath@htic.iitm.ac.in	f	2025-09-09 09:43:14.484095+00	mNb1p4KCLsoG
prasath@htic.iitm.ac.in	f	2025-09-09 09:43:14.516859+00	MGBQzQ97exuK
prasath@htic.iitm.ac.in	f	2025-09-09 09:43:53.55629+00	rDVzS2qQ1Xye
prasath@htic.iitm.ac.in	f	2025-09-09 09:43:53.614632+00	1wxaTpsEnmvW
prasath@htic.iitm.ac.in	f	2025-09-09 09:44:41.726687+00	XEgQAR8jtEIR
prasath@htic.iitm.ac.in	f	2025-09-09 09:44:41.748196+00	62oZhXSbIwNq
prasath@htic.iitm.ac.in	f	2025-09-09 10:25:42.130177+00	GQ3uFLV9kJD5
prasath@htic.iitm.ac.in	f	2025-09-09 10:25:42.158989+00	UnSRJ58PTyRE
prasath@htic.iitm.ac.in	f	2025-09-09 10:26:29.714387+00	bfawaqB61bsD
prasath@htic.iitm.ac.in	f	2025-09-09 10:26:29.73806+00	mHlVcE8HzEa3
prasath@htic.iitm.ac.in	f	2025-09-09 10:31:47.808159+00	MtNjXK2fTF9R
prasath@htic.iitm.ac.in	f	2025-09-09 10:31:47.863063+00	hB48H4yWYfV3
prasath@htic.iitm.ac.in	f	2025-09-09 10:32:03.442907+00	ok7N7U7C0wtd
prasath@htic.iitm.ac.in	f	2025-09-09 10:32:03.489745+00	V2ObyfXU7Fpd
prasath@htic.iitm.ac.in	f	2025-09-09 10:32:13.10011+00	N1Y77FXnS9EF
prasath@htic.iitm.ac.in	f	2025-09-09 10:32:13.199931+00	0rXQyb9MCzHq
prasath@htic.iitm.ac.in	f	2025-09-09 10:37:33.175578+00	7ZFcBoxPvmcR
prasath@htic.iitm.ac.in	f	2025-09-09 10:37:33.197164+00	VcDJFt0VGzws
prasath@htic.iitm.ac.in	f	2025-09-09 10:39:41.578084+00	Y38EVVgiWD2N
prasath@htic.iitm.ac.in	f	2025-09-09 10:39:41.724414+00	xKEzuCFbZ892
prasath@htic.iitm.ac.in	f	2025-09-10 06:38:39.477909+00	hovvoWGMGorg
prasath@htic.iitm.ac.in	f	2025-09-10 06:38:39.542645+00	DogKHEuk3lYH
prasath@htic.iitm.ac.in	f	2025-09-10 06:41:34.240957+00	pLPX9j0HbTEu
prasath@htic.iitm.ac.in	f	2025-09-10 06:41:34.271863+00	ZLob5H3Rfz6b
prasath@htic.iitm.ac.in	f	2025-09-10 07:30:51.571329+00	iBDPZEELa1p5
prasath@htic.iitm.ac.in	f	2025-09-10 07:30:51.608515+00	RCoK60xegv8B
prasath@htic.iitm.ac.in	f	2025-09-10 11:02:01.344113+00	Ffqa7eNpZG9x
prasath@htic.iitm.ac.in	f	2025-09-10 11:02:01.4549+00	Gj8wkDifPfF7
prasath@htic.iitm.ac.in	f	2025-09-10 11:08:02.213039+00	EguwqLHzAh2F
prasath@htic.iitm.ac.in	f	2025-09-10 11:08:02.332258+00	s1Y2dJgqfcS8
prasath@htic.iitm.ac.in	f	2025-09-10 11:09:54.799514+00	yx4Yp1bu14rh
prasath@htic.iitm.ac.in	f	2025-09-10 11:09:54.846135+00	jBeaVwD5gclx
prasath@htic.iitm.ac.in	f	2025-09-10 11:13:24.386801+00	eqMIRRuZ8LhH
prasath@htic.iitm.ac.in	f	2025-09-10 11:13:24.436222+00	20nhPIW81au1
prasath@htic.iitm.ac.in	f	2025-09-10 11:21:21.711912+00	a2fjfgn6060N
prasath@htic.iitm.ac.in	f	2025-09-10 11:21:21.762114+00	HcOZczuOUvOW
prasath@htic.iitm.ac.in	f	2025-09-10 11:21:24.561821+00	V8LrFugsR2Uu
prasath@htic.iitm.ac.in	f	2025-09-10 11:21:24.609708+00	T9AfYUobZBhY
prasath@htic.iitm.ac.in	f	2025-09-10 11:25:09.857673+00	v3OfDiF17wEP
prasath@htic.iitm.ac.in	f	2025-09-10 11:25:09.903978+00	Z18ZaVbyxxh3
prasath@htic.iitm.ac.in	f	2025-09-10 11:25:14.028196+00	838g5hpLKuHW
prasath@htic.iitm.ac.in	f	2025-09-10 11:25:14.118867+00	MtmpLkwOYqf6
prasath@htic.iitm.ac.in	f	2025-09-10 11:25:39.558878+00	3fKRm1BbnEDy
prasath@htic.iitm.ac.in	f	2025-09-10 11:25:39.617644+00	w6pzJEF1vLBZ
prasath@htic.iitm.ac.in	f	2025-09-10 11:32:10.562214+00	SQBTUaBy3kAK
prasath@htic.iitm.ac.in	f	2025-09-10 11:32:10.620464+00	hSGFve5esLnm
prasath@htic.iitm.ac.in	f	2025-09-10 11:32:12.730825+00	S9Evn4VWt1m4
prasath@htic.iitm.ac.in	f	2025-09-10 11:32:12.775364+00	wchX1LYjhS9m
prasath@htic.iitm.ac.in	f	2025-09-10 11:51:47.691679+00	sH27e2JrnGn1
prasath@htic.iitm.ac.in	f	2025-09-10 11:51:47.749316+00	H61ohZJb9yb2
prasath@htic.iitm.ac.in	f	2025-09-10 11:51:52.660894+00	Nq41FtT3v46C
prasath@htic.iitm.ac.in	f	2025-09-10 11:51:52.707407+00	th5kDwg6XKzl
prasath@htic.iitm.ac.in	f	2025-09-10 11:53:26.334298+00	LHRTnYDXbYdg
prasath@htic.iitm.ac.in	f	2025-09-10 11:53:26.380921+00	kgk2zHDhn1iB
prasath@htic.iitm.ac.in	f	2025-09-10 11:53:28.810403+00	csrMzpn9fGx5
prasath@htic.iitm.ac.in	f	2025-09-10 11:53:28.856215+00	J3ugM1fxGhf2
prasath@htic.iitm.ac.in	f	2025-09-10 11:54:41.800671+00	EUaukjFk93vF
prasath@htic.iitm.ac.in	f	2025-09-10 11:54:41.848732+00	KgRaUx8WwMwk
prasath@htic.iitm.ac.in	f	2025-09-11 05:28:23.36642+00	z3r0C6SpH1mV
prasath@htic.iitm.ac.in	f	2025-09-11 05:28:23.404656+00	U7a8NrvliKer
prasath@htic.iitm.ac.in	f	2025-09-11 05:40:45.772608+00	a4txpPQLH7iH
prasath@htic.iitm.ac.in	f	2025-09-11 05:40:45.820874+00	acmPavILI3Fm
prasath@htic.iitm.ac.in	f	2025-09-11 07:05:15.586873+00	1yp2vFX8FVDW
prasath@htic.iitm.ac.in	f	2025-09-11 07:05:15.707987+00	zxXBWBRvtvmK
prasath@htic.iitm.ac.in	f	2025-09-11 07:23:03.088192+00	dBNjsJtiHAsH
prasath@htic.iitm.ac.in	f	2025-09-11 07:23:03.121158+00	quhZ3fWu34aw
prasath@htic.iitm.ac.in	f	2025-09-11 07:23:29.147516+00	oybO67yzxfIx
prasath@htic.iitm.ac.in	f	2025-09-11 07:23:29.178243+00	pVntX0QNl9tg
prasath@htic.iitm.ac.in	f	2025-09-11 10:34:16.715689+00	vbCOBPiLAH4Z
prasath@htic.iitm.ac.in	f	2025-09-11 10:34:16.781014+00	uY5XOAwdqdI8
prasath@htic.iitm.ac.in	f	2025-09-11 10:46:36.581662+00	2TLAi95daJ6s
prasath@htic.iitm.ac.in	f	2025-09-11 10:46:36.642889+00	QGJWqLERFn5t
prasath@htic.iitm.ac.in	f	2025-09-11 10:48:02.664249+00	TXmqqWhorIQ5
prasath@htic.iitm.ac.in	f	2025-09-11 10:48:02.726109+00	vw4aPy5NubG5
prasath@htic.iitm.ac.in	f	2025-09-11 11:09:26.84406+00	ABlkP9IRXlpI
prasath@htic.iitm.ac.in	f	2025-09-11 11:09:26.873586+00	WjPRx6Vunvqk
prasath@htic.iitm.ac.in	f	2025-09-11 12:02:15.911103+00	Udacm4pEVUga
prasath@htic.iitm.ac.in	f	2025-09-11 12:02:16.002601+00	AsyYTyngIfvb
prasath@htic.iitm.ac.in	f	2025-09-11 12:05:43.166401+00	DrZmbsUisiUc
prasath@htic.iitm.ac.in	f	2025-09-11 12:05:43.265596+00	caZYyrHycq45
prasath@htic.iitm.ac.in	f	2025-09-12 06:07:04.71277+00	drXJtyA4jtcq
prasath@htic.iitm.ac.in	f	2025-09-12 06:07:05.095463+00	cJOQFqulv2yw
prasath@htic.iitm.ac.in	f	2025-09-12 06:07:39.478953+00	OjI7pUjLE4nd
prasath@htic.iitm.ac.in	f	2025-09-12 06:07:39.856888+00	9cVKS1TMbn9l
prasath@htic.iitm.ac.in	f	2025-09-12 06:10:57.196262+00	FbF1JRKP2JE6
prasath@htic.iitm.ac.in	f	2025-09-12 06:10:57.22113+00	7VVJHCxnkYLd
prasath@htic.iitm.ac.in	f	2025-09-12 09:41:59.823264+00	v6EVXcgfDynm
prasath@htic.iitm.ac.in	f	2025-09-12 09:41:59.875294+00	Xd1aI7wGeudg
prasath@htic.iitm.ac.in	f	2025-09-12 09:42:14.713958+00	01cEkW1GvRNY
prasath@htic.iitm.ac.in	f	2025-09-12 09:42:14.763899+00	iBSS741LPzeZ
prasath@htic.iitm.ac.in	f	2025-09-12 09:42:37.86648+00	wEju2c0nIbTJ
prasath@htic.iitm.ac.in	f	2025-09-12 09:42:37.914463+00	jIiwb3fUrwQZ
prasath@htic.iitm.ac.in	f	2025-09-15 05:45:21.199296+00	TtbutSLNYMut
prasath@htic.iitm.ac.in	f	2025-09-15 05:45:21.255834+00	5Ts07n3hzKm2
prasath@htic.iitm.ac.in	f	2025-09-15 06:22:30.164722+00	p9UqRBoIF3ty
prasath@htic.iitm.ac.in	f	2025-09-15 06:26:11.008124+00	HkFvmfBHlWRI
prasath@htic.iitm.ac.in	f	2025-09-15 07:36:30.384703+00	rMKlc1urNdwe
prasath@htic.iitm.ac.in	f	2025-09-15 07:36:30.416041+00	rKxq4BLr6WCq
prasath@htic.iitm.ac.in	f	2025-09-15 07:52:42.65522+00	5VIe8VAQFdA1
prasath@htic.iitm.ac.in	f	2025-09-15 07:52:42.686413+00	starOp2Tr9iC
prasath@htic.iitm.ac.in	f	2025-09-15 07:52:45.084017+00	K0hOLEhGdXYJ
prasath@htic.iitm.ac.in	f	2025-09-15 07:52:45.176901+00	XWAZJUBUh3TG
prasath@htic.iitm.ac.in	f	2025-09-15 07:52:45.778206+00	FsjLqEyBpKN3
prasath@htic.iitm.ac.in	f	2025-09-15 07:52:45.839597+00	fxiYy4Lf0kg8
prasath@htic.iitm.ac.in	f	2025-09-15 07:52:45.917541+00	62Sf6CPyPwy1
prasath@htic.iitm.ac.in	f	2025-09-15 07:52:45.949829+00	1RkkAfabdsIU
prasath@htic.iitm.ac.in	f	2025-09-15 07:52:46.09884+00	47DfK3jnImCE
prasath@htic.iitm.ac.in	f	2025-09-15 07:52:46.137622+00	gjX0vigdhhTn
prasath@htic.iitm.ac.in	f	2025-09-15 07:52:46.264907+00	RV3jqSn2sUPs
prasath@htic.iitm.ac.in	f	2025-09-15 07:52:46.316897+00	LHJ2wYbn4mNX
prasath@htic.iitm.ac.in	f	2025-09-15 07:53:56.140892+00	naVofRYoFQ7Q
prasath@htic.iitm.ac.in	f	2025-09-15 07:53:56.188756+00	lxn6vQXDqwgY
prasath@htic.iitm.ac.in	f	2025-09-15 07:54:03.35912+00	9Ej58npl80Wi
prasath@htic.iitm.ac.in	f	2025-09-15 07:54:03.393598+00	QZDRsY3RLc6j
prasath@htic.iitm.ac.in	f	2025-09-15 07:54:13.549061+00	gHgwqKpDHHJy
prasath@htic.iitm.ac.in	f	2025-09-15 07:54:13.636175+00	gShLchL8LJSJ
prasath@htic.iitm.ac.in	f	2025-09-15 11:11:50.483537+00	9k7pvCXrE6e3
prasath@htic.iitm.ac.in	f	2025-09-15 11:11:50.54593+00	J84TQYvmLVbg
prasath@htic.iitm.ac.in	f	2025-09-15 11:22:02.003141+00	NJUsq1eR9l73
prasath@htic.iitm.ac.in	f	2025-09-15 11:22:02.101059+00	9yUjsRk1FKRb
prasath@htic.iitm.ac.in	f	2025-09-16 06:16:08.947504+00	PmCtU3mr0B8Z
prasath@htic.iitm.ac.in	f	2025-09-16 06:16:09.060135+00	ooIT97fWvoUN
prasath@htic.iitm.ac.in	f	2025-09-16 07:49:42.240571+00	K2hmmzP572y6
prasath@htic.iitm.ac.in	f	2025-09-16 07:49:42.292366+00	5rn5NXaIRReN
prasath@htic.iitm.ac.in	f	2025-09-16 07:49:44.466173+00	EN04vgmklCLi
prasath@htic.iitm.ac.in	f	2025-09-16 07:49:44.520162+00	mXezCg3MbXJV
prasath@htic.iitm.ac.in	f	2025-09-16 07:51:01.488165+00	UMvhnEFlyXwd
prasath@htic.iitm.ac.in	f	2025-09-16 07:51:01.527387+00	aO6IOawg2ZUs
prasath@htic.iitm.ac.in	f	2025-09-16 07:51:38.300046+00	EbjCpa8SZB2l
prasath@htic.iitm.ac.in	f	2025-09-16 07:51:38.370052+00	lMUoxBhxurhF
abc@abc.abc	f	2025-09-16 07:59:29.905987+00	d5uoi1pW9t81
prasath@gmail.com	f	2025-09-16 07:59:45.50765+00	c0SbU6Nn3s6m
prasath@htic.iitm.ac.in	f	2025-09-16 08:02:17.789203+00	uL90tRYbSK9j
prasath@htic.iitm.ac.in	f	2025-09-16 08:02:17.952817+00	bprfuww5nN3J
prasath@htic.iitm.ac.in	f	2025-09-16 08:02:42.727265+00	4wLqwgAQdaWG
prasath@htic.iitm.ac.in	f	2025-09-16 08:02:42.800339+00	QFXNl8lk2fVw
prasath@htic.iitm.ac.in	f	2025-09-16 08:03:28.563554+00	YqExt4TE8WMM
prasath@htic.iitm.ac.in	f	2025-09-16 08:03:28.667951+00	4uf43CKqS8s9
prasath@htic.iitm.ac.in	f	2025-09-16 08:04:16.059687+00	2WElpMnzI26c
prasath@htic.iitm.ac.in	f	2025-09-16 08:04:16.186527+00	QMpmxoAMemJk
prasath@htic.iitm.ac.in	f	2025-09-16 08:05:12.063896+00	TAzq4okTZukF
prasath@htic.iitm.ac.in	f	2025-09-16 08:05:12.129495+00	3Ng9uGO2khmB
prasath@htic.iitm.ac.in	f	2025-09-16 08:05:30.830507+00	nr6AwPogf87i
prasath@htic.iitm.ac.in	f	2025-09-16 08:05:30.932545+00	YcU218NvcWXX
prasath@htic.iitm.ac.in	f	2025-09-16 08:05:36.334437+00	WLGCJkvoxPzC
prasath@htic.iitm.ac.in	f	2025-09-16 08:05:36.414767+00	NVGoRpXpTWqY
prasath@gmail.com	f	2025-09-16 08:06:41.118371+00	stYKGjdU35iK
prasath@htic.iitm.ac.in	f	2025-09-16 08:57:22.5703+00	GjRXbeCJBBKU
prasath@htic.iitm.ac.in	f	2025-09-16 08:57:22.628695+00	uK5VghL7K4xp
prasath@htic.iitm.ac.in	f	2025-09-16 09:01:37.757824+00	DHEmQzhkvB0u
prasath@htic.iitm.ac.in	f	2025-09-16 09:01:37.864731+00	GuAfO5tLW53G
prasath@htic.iitm.ac.in	f	2025-09-16 09:02:24.860384+00	7eYyXUOKqKo5
prasath@htic.iitm.ac.in	f	2025-09-16 09:02:24.970463+00	6MD1inWy08FQ
prasath@htic.iitm.ac.in	f	2025-09-16 09:23:20.295411+00	ATFcKUobbJWi
prasath@htic.iitm.ac.in	f	2025-09-16 09:23:20.431751+00	AqvQPa3l9Pp4
prasath@htic.iitm.ac.in	f	2025-09-16 09:23:28.34001+00	85LadwwZIC6e
prasath@htic.iitm.ac.in	f	2025-09-16 09:23:28.429794+00	g2MyIARtukpz
prasath@htic.iitm.ac.in	f	2025-09-16 09:25:31.674108+00	RnWSVM0NMLYa
prasath@htic.iitm.ac.in	f	2025-09-16 09:25:31.762033+00	gd5sM0JemKdW
prasath@htic.iitm.ac.in	f	2025-09-16 09:31:25.913736+00	tFaw0UHJja6h
prasath@htic.iitm.ac.in	f	2025-09-16 09:31:25.991829+00	48b8y6Pjc8mH
prasath@htic.iitm.ac.in	f	2025-09-16 09:31:27.740816+00	QCgtFvW9bobY
prasath@htic.iitm.ac.in	f	2025-09-16 09:31:27.821148+00	9XpCQzCnEc3k
prasath@htic.iitm.ac.in	f	2025-09-16 09:57:23.327358+00	S9zx5TBXeXuR
prasath@htic.iitm.ac.in	f	2025-09-16 09:57:23.441282+00	0crkyH6IOT4A
prasath@htic.iitm.ac.in	f	2025-09-16 09:57:25.980051+00	buRemVeqI4Fv
prasath@htic.iitm.ac.in	f	2025-09-16 09:57:26.06537+00	rGqYAq9GkLp3
prasath@htic.iitm.ac.in	f	2025-09-16 10:01:51.03064+00	nfOlkNZHFDWZ
prasath@htic.iitm.ac.in	f	2025-09-16 10:01:51.137036+00	6rBiXJwfdUtN
prasath@htic.iitm.ac.in	f	2025-09-16 10:04:26.781789+00	KfabTJhA5Tx1
prasath@htic.iitm.ac.in	f	2025-09-16 10:04:26.941759+00	GEZBUWxYoxTn
prasath@htic.iitm.ac.in	f	2025-09-16 10:05:48.693877+00	U0CH4O50RI1b
prasath@htic.iitm.ac.in	f	2025-09-16 10:05:48.798858+00	cxGmkQ5xSIIV
prasath@htic.iitm.ac.in	f	2025-09-17 06:31:49.451829+00	cmZrtQsuoxMA
prasath@htic.iitm.ac.in	f	2025-09-17 06:31:49.527892+00	RFBGhaUduKbu
abc@abc.abc	f	2025-09-17 08:49:02.866222+00	IPndC99VIgi8
af5616bb-3ed7-4686-8e03-cc44374009b0	f	2025-09-17 10:58:27.150451+00	ZHkC54hDBSO3
abc@abc.abc	f	2025-09-17 11:02:57.833437+00	kSJErfA6FP2v
abc@abc.abc	f	2025-09-17 11:10:04.233914+00	JOVCDH3oFTYo
b42b52b6-213f-4293-9265-447a6379c437	f	2025-09-17 11:10:57.965556+00	SgU9icY0xK0G
prasath@htic.iitm.ac.in	f	2025-09-17 11:14:04.572408+00	m6Ssg2LArmze
prasath@htic.iitm.ac.in	f	2025-09-17 11:14:04.820617+00	ctS7iz3L6Q1Y
abc@abc.abc	f	2025-09-17 11:20:52.818399+00	27IbwNXfcmKJ
abc@abc.abc	f	2025-09-17 11:21:26.61028+00	KP80OXchZDlq
66a0436c-a279-4cf5-a74c-b2b704d99e57	f	2025-09-17 11:22:16.444229+00	RptY68oTn475
prasath@htic.iitm.ac.in	f	2025-09-17 11:31:10.808274+00	J33SRhyRhKDK
prasath@htic.iitm.ac.in	f	2025-09-17 11:31:10.907781+00	9KGa1tPw1ghJ
abc@abc.abc	f	2025-09-17 11:31:49.016263+00	JdGsYSm1Dzfp
abc@abc.abc	f	2025-09-17 11:42:14.452767+00	dnbO74Z7TInl
abc@abc.abc	f	2025-09-17 11:53:54.396874+00	Hu6t9hsVf2On
abc@abc.abc	f	2025-09-17 11:54:25.121875+00	nqK07DiIIuzU
abc@abc.abc	f	2025-09-17 11:56:11.491412+00	2vEMt2ZblizV
abc@abc.abc	f	2025-09-17 11:56:47.53809+00	aEUtNWxma5Pw
abc@abc.abc	f	2025-09-17 12:00:13.672212+00	ib9BjW62jm3Q
abc@abc.abc	f	2025-09-17 12:04:31.218791+00	pBqF7Vbw17bI
abc@abc.abc	f	2025-09-17 12:14:32.255319+00	0T88hzdogiui
prasath@htic.iitm.ac.in	f	2025-09-17 12:18:53.494024+00	nyl1jfsJnsH4
prasath@htic.iitm.ac.in	f	2025-09-17 12:18:53.564553+00	FbbTKimY7yH4
prasath@htic.iitm.ac.in	f	2025-09-17 12:18:58.481742+00	jbjsNyocJR49
prasath@htic.iitm.ac.in	f	2025-09-17 12:18:58.513898+00	kdz0u9YMpxFE
prasath@htic.iitm.ac.in	f	2025-09-17 12:19:07.323549+00	WxUzyt1in5UD
prasath@htic.iitm.ac.in	f	2025-09-17 12:19:07.384271+00	mnNFnWwNWeIL
prasath@htic.iitm.ac.in	f	2025-09-17 12:19:17.286714+00	FPaJul1KYBSM
prasath@htic.iitm.ac.in	f	2025-09-17 12:19:17.324131+00	66Zz8fEVo3bO
prasath@htic.iitm.ac.in	f	2025-09-17 12:19:27.67618+00	MM6xeZHSGfkp
prasath@htic.iitm.ac.in	f	2025-09-17 12:19:27.71158+00	bhvD5qmX9Z7d
prasath@htic.iitm.ac.in	f	2025-09-17 12:22:05.750026+00	jigOZB6uqAQR
prasath@htic.iitm.ac.in	f	2025-09-17 12:22:05.889719+00	iyz8yNzde8fi
abc@abc.abc	f	2025-09-17 12:23:24.467045+00	taU2nC8vi7dt
prasath@htic.iitm.ac.in	f	2025-09-17 12:23:46.672892+00	RfO53wEKdrdM
prasath@htic.iitm.ac.in	f	2025-09-17 12:23:46.721058+00	L2hJ4hTuCAcz
prasath@htic.iitm.ac.in	f	2025-09-17 12:23:56.166821+00	OX2UuQgSQI4n
prasath@htic.iitm.ac.in	f	2025-09-17 12:23:56.21326+00	mU6X2g1BHD4S
prasath@htic.iitm.ac.in	f	2025-09-17 12:26:08.414467+00	dtmN3kEielci
prasath@htic.iitm.ac.in	f	2025-09-17 12:26:08.486391+00	rXYTYqkZzUw7
prasath@htic.iitm.ac.in	f	2025-09-17 12:26:12.388821+00	cPa9zaJ26tB7
prasath@htic.iitm.ac.in	f	2025-09-17 12:26:12.430121+00	MMRIbTTnUHjT
abc@abc.abc	f	2025-09-17 12:49:04.327105+00	ekm2ed4Zc5wZ
abc@abc.abc	f	2025-09-17 12:49:30.883151+00	UXNB2Cpkrc8M
abc@abc.abc	f	2025-09-17 12:49:54.501497+00	KDA8yaJdxZNm
abc@abc.abc	f	2025-09-17 12:50:52.652495+00	ga8XCcQ5G9ai
abc@abc.abc	f	2025-09-17 12:51:55.602659+00	5HX30rHXsHOg
abc@abc.abc	f	2025-09-17 12:52:13.706892+00	gJBJcBSrgJBd
abc@abc.abc	f	2025-09-17 12:53:45.233844+00	XjhJElvH2QVU
prasath@htic.iitm.ac.in	f	2025-09-18 03:10:39.416064+00	fEDjXl3ezXOb
prasath@htic.iitm.ac.in	f	2025-09-18 03:10:39.442281+00	wO1T9klnWt48
prasath@htic.iitm.ac.in	f	2025-09-18 07:28:08.523581+00	jheQrVI7Mqjc
prasath@htic.iitm.ac.in	f	2025-09-18 07:28:08.549228+00	89KGQiM3IeeC
prasath@htic.iitm.ac.in	f	2025-09-19 06:47:25.564591+00	Dn8GuMuzbyQw
prasath@htic.iitm.ac.in	f	2025-09-19 06:47:25.612451+00	RMvW9OQELzMV
prasath@htic.iitm.ac.in	f	2025-09-20 04:51:04.572535+00	00YECJjlRG94
prasath@htic.iitm.ac.in	f	2025-09-20 04:51:04.611029+00	QHnH5noZOXAe
prasath@htic.iitm.ac.in	f	2025-09-20 16:05:38.954256+00	KpiNKqNzF4vE
prasath@htic.iitm.ac.in	f	2025-09-20 16:05:38.985497+00	W0DZQW5gcMlD
prasath@htic.iitm.ac.in	f	2025-09-22 06:58:31.560575+00	9w8nPbgt67W7
prasath@htic.iitm.ac.in	f	2025-09-22 06:58:31.606826+00	OB5jRXmGZnoc
prasath@htic.iitm.ac.in	f	2025-09-22 06:58:35.810025+00	Wv6xF6xHTd6q
prasath@htic.iitm.ac.in	f	2025-09-22 06:58:35.841478+00	hLVNnSqWL2Sv
prasath@htic.iitm.ac.in	f	2025-09-22 06:58:38.106675+00	oK6oLns94B5H
prasath@htic.iitm.ac.in	f	2025-09-22 06:58:38.133376+00	i2HXhC6W0s7J
person@test.co.in	f	2025-09-22 07:11:03.132342+00	QoKDQr5exLDo
person@test.co.in	f	2025-09-22 07:11:03.223094+00	YW3MVdC6FUHK
prasath@htic.iitm.ac.in	f	2025-09-22 09:19:04.189826+00	n3yI7gtks6OD
prasath@htic.iitm.ac.in	f	2025-09-22 09:19:04.276844+00	9e9E0eEjPn9z
prasath@htic.iitm.ac.in	f	2025-09-22 09:51:38.569675+00	kNIstGosPKBg
prasath@htic.iitm.ac.in	f	2025-09-22 09:51:38.629619+00	7zhcwuZlsGnk
prasath@htic.iitm.ac.in	f	2025-09-22 09:56:23.293512+00	QNuYxYOsEfnl
prasath@htic.iitm.ac.in	f	2025-09-22 09:56:23.351737+00	zQarOG1oaCRn
prasath@htic.iitm.ac.in	f	2025-09-22 12:56:14.683526+00	xm7iRlqpIld1
prasath@htic.iitm.ac.in	f	2025-09-22 12:56:14.728941+00	GK4BsRR0T4sb
abc@abc.abc	f	2025-09-25 07:42:13.419259+00	OtszXa48aNpD
prasath@htic.iitm.ac.in	f	2025-09-25 07:48:43.025712+00	lDsNPr1hUUHH
prasath@htic.iitm.ac.in	f	2025-09-25 07:48:43.066376+00	w3QUS1Ah6JpL
prasath@htic.iitm.ac.in	f	2025-09-25 07:48:44.691444+00	c2UmSTSEXP70
prasath@htic.iitm.ac.in	f	2025-09-25 07:48:45.090058+00	uGndsWF1RY1m
prasath@htic.iitm.ac.in	f	2025-09-25 07:48:48.362012+00	LhN6h5KbjXnm
prasath@htic.iitm.ac.in	f	2025-09-25 07:48:48.39635+00	xB5TQ7qD4QHx
prasath@htic.iitm.ac.in	f	2025-09-25 07:51:43.880546+00	tG3Bd96voRmc
prasath@htic.iitm.ac.in	f	2025-09-25 07:51:43.925463+00	3sc4io5qGP8T
abc@abc.abc	f	2025-09-25 10:09:02.141244+00	MPURsQwKZ64J
prasath@htic.iitm.ac.in	f	2025-09-25 10:10:33.293379+00	uCjUMDYxTCC6
prasath@htic.iitm.ac.in	f	2025-09-25 10:10:33.365475+00	AVvUZhJF0c11
prasath@htic.iitm.ac.in	f	2025-09-25 10:10:45.425285+00	uvnKVLCDdGJW
prasath@htic.iitm.ac.in	f	2025-09-25 10:10:45.574376+00	9rwbyQyqaUgC
abc@abc.abc	f	2025-09-25 10:11:21.801914+00	x7HkIWpwaMnY
prasath@htic.iitm.ac.in	f	2025-09-25 10:11:38.615193+00	okxgllbDqlBx
prasath@htic.iitm.ac.in	f	2025-09-25 10:11:38.679892+00	ozlgKXlOjQnM
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:04.729291+00	zG3tjRu38UPj
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:04.82965+00	USOOJ4eRT3Rr
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:05.459251+00	1LE8ETuDKGdd
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:05.523273+00	tKwZ8LL25TeG
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:05.657342+00	QQHWLWwymEYg
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:05.725788+00	meIuBIKjtnCx
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:05.863721+00	tVZpVmAEw2XH
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:05.953499+00	aljR3vxHNntD
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:06.060011+00	9RlNjEFCzUT7
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:06.143283+00	5SfUbxhmKvse
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:06.248884+00	9YnuKQrctwIb
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:06.313437+00	wi3Q2bf2MZsm
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:06.432068+00	CYrMGuFtEHiH
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:06.491444+00	l5c1h972ZvtT
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:06.60706+00	Amh4iqqb57nt
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:06.684384+00	jMk2JJOpmjze
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:06.821107+00	44VD8S9gQ3dF
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:06.882811+00	b45b2cc3wyTf
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:06.954544+00	x4u67n6B4ve6
prasath@htic.iitm.ac.in	f	2025-09-25 10:12:07.012897+00	MGOywy9CeoQT
abc@abc.abc	f	2025-09-25 10:13:44.430863+00	y8ZLvagk7i8U
abc@abc.abc	f	2025-09-25 10:14:42.329933+00	2FGgYRjWYcUj
prasath@htic.iitm.ac.in	f	2025-09-25 10:16:20.435648+00	bdeoREc33RdA
prasath@htic.iitm.ac.in	f	2025-09-25 10:16:20.526131+00	Ww6AXIJ6bGC4
abc@abc.abc	f	2025-09-25 10:20:00.315953+00	L4eXEoAkGzlR
prasath@htic.iitm.ac.in	f	2025-09-25 10:20:24.571431+00	HmKEL22m78XS
prasath@htic.iitm.ac.in	f	2025-09-25 10:20:24.631408+00	Kb2GQKxa2nCg
prasath@htic.iitm.ac.in	f	2025-09-25 10:20:46.065045+00	gt8WRvkZQeh6
prasath@htic.iitm.ac.in	f	2025-09-25 10:20:46.149362+00	Xo8DWYMj2RCq
prasath@htic.iitm.ac.in	f	2025-09-25 10:21:01.826991+00	1QiZjZmfxyi1
prasath@htic.iitm.ac.in	f	2025-09-25 10:21:01.918606+00	n5H83OyQdywq
abc@abc.abc	f	2025-09-25 10:21:07.736747+00	JoUQ26lvCHHr
abc@abc.abc	f	2025-09-25 10:24:29.040532+00	q5DIiK27feVo
abc@abc.abc	f	2025-09-25 10:30:05.118719+00	45leIYUJEJjo
abc@abc.abc	f	2025-09-25 10:31:08.6958+00	YjRZfmluS3b9
abc@abc.abc	f	2025-09-25 10:31:13.912799+00	QqGQVzMueXrx
prasath@htic.iitm.ac.in	f	2025-09-25 10:46:53.070444+00	oMUBd8b9oN3h
prasath@htic.iitm.ac.in	f	2025-09-25 10:46:53.111893+00	YMiUMdMib0F1
abc@abc.abc	f	2025-09-25 10:50:46.383199+00	yejZfCZBh7kK
abc@abc.abc	f	2025-09-25 10:52:18.096265+00	DVaEqoiRxJJz
abc@abc.abc	f	2025-09-25 10:52:36.051604+00	UUvSP9dDsyTX
prasath@htic.iitm.ac.in	f	2025-09-25 10:53:29.909195+00	6FetnUeawlpn
prasath@htic.iitm.ac.in	f	2025-09-25 10:53:30.036415+00	60Hn7nLxM6nl
prasath@htic.iitm.ac.in	f	2025-09-25 10:53:30.305797+00	Hq0P12HvHQyB
prasath@htic.iitm.ac.in	f	2025-09-25 10:53:30.392992+00	TN44bThj2sCH
prasath@htic.iitm.ac.in	f	2025-09-25 10:53:34.222606+00	lA6VpiwMbnzm
prasath@htic.iitm.ac.in	f	2025-09-25 10:53:34.261362+00	djhNvqlw1hTa
abc@abc.abc	f	2025-09-25 10:54:08.070795+00	FOZhCQ4RwAOL
prasath@htic.iitm.ac.in	f	2025-09-25 10:54:27.178655+00	wImv4nBRFDj6
prasath@htic.iitm.ac.in	f	2025-09-25 10:54:27.217843+00	PC73Ds2XvXra
prasath@htic.iitm.ac.in	f	2025-09-25 10:54:32.150931+00	1REBYr7cgzMC
prasath@htic.iitm.ac.in	f	2025-09-25 10:54:32.25443+00	Yu37de4OCSsH
abc@abc.abc	f	2025-09-25 10:54:35.198293+00	8wqDRxW6ErOg
prasath@htic.iitm.ac.in	f	2025-09-25 10:54:36.887353+00	ywTH7VYsptK4
prasath@htic.iitm.ac.in	f	2025-09-25 10:54:36.961101+00	dEs3GmcduOjl
prasath@htic.iitm.ac.in	f	2025-09-25 10:54:40.316054+00	bwhENoWEOgFS
prasath@htic.iitm.ac.in	f	2025-09-25 10:54:40.355691+00	E6n1fE9RNKBH
prasath@htic.iitm.ac.in	f	2025-09-25 10:55:00.799276+00	mqbgmjFZHBJS
prasath@htic.iitm.ac.in	f	2025-09-25 10:55:00.839485+00	wojKlLcnYXmw
prasath@htic.iitm.ac.in	f	2025-09-25 10:55:02.910409+00	F2rn2reTZvxm
prasath@htic.iitm.ac.in	f	2025-09-25 10:55:02.952048+00	8LroaDIFvgHK
prasath@htic.iitm.ac.in	f	2025-09-25 10:55:42.282993+00	u1WdjuwmmVlR
prasath@htic.iitm.ac.in	f	2025-09-25 10:55:42.321005+00	1IjoFuOZfHdD
prasath@htic.iitm.ac.in	f	2025-09-25 10:55:45.580339+00	hi5LgnJjYR2Q
prasath@htic.iitm.ac.in	f	2025-09-25 10:55:45.620418+00	peh2FWYxa1lr
abc@abc.abc	f	2025-09-25 10:55:58.231952+00	hF3cdkE2uMcH
abc@abc.abc	f	2025-09-25 10:56:02.525641+00	J3VEsNA3IcEJ
abc@abc.abc	f	2025-09-25 11:39:20.918235+00	vQtZgTRe6ZDM
abc@abc.abc	f	2025-09-25 11:58:39.609349+00	XqWuqYLfpHsI
abc@abc.abc	f	2025-09-25 12:06:15.080546+00	yMAzm8SIPalG
abc@abc.abc	f	2025-09-25 12:13:38.411878+00	ZM11S7dMZcyq
abc@abc.abc	f	2025-09-25 12:14:54.927483+00	PfRZmlhIve5B
abc@abc.abc	f	2025-09-25 12:17:19.273863+00	E1X1tqsLjDZa
abc@abc.abc	f	2025-09-25 12:20:23.674355+00	329wztq5Spfj
abc@abc.abc	f	2025-09-25 12:22:58.628285+00	mniRN2J09Opk
abc@abc.abc	f	2025-09-25 12:25:00.846799+00	UdtvMDpNOJwy
abc@abc.abc	f	2025-09-25 12:27:32.896689+00	acaINzuw4KpO
abc@abc.abc	f	2025-09-25 12:29:30.813423+00	35DcgO5BKr22
abc@abc.abc	f	2025-09-25 12:31:51.286334+00	t0yRrSbh0NPx
abc@abc.abc	f	2025-09-25 12:33:54.339784+00	9AOoA7lqWRaN
abc@abc.abc	f	2025-09-25 12:48:06.365052+00	t5wh69GsJfK5
abc@abc.abc	f	2025-09-25 12:48:52.360376+00	tlJBvj1son1y
abc@abc.abc	f	2025-09-25 12:49:52.155022+00	pYCIBC9LBX1R
abc@abc.abc	f	2025-09-25 12:50:29.965526+00	028ye86sdLdl
abc@abc.abc	f	2025-09-25 12:50:30.629843+00	y7forzNEg8eI
abc@abc.abc	f	2025-09-25 12:50:56.28979+00	F8t1pPKOGCLY
abc@abc.abc	f	2025-09-25 12:50:57.560425+00	cHnIJ6TcnPfZ
abc@abc.abc	f	2025-09-25 12:51:22.294628+00	XyBxN0jAM8ON
abc@abc.abc	f	2025-09-25 12:51:22.603899+00	QNzUyLviAV08
abc@abc.abc	f	2025-09-25 12:51:59.967113+00	w6lZnTQyv8LT
abc@abc.abc	f	2025-09-25 12:52:02.372648+00	PfJaW14gqopH
abc@abc.abc	f	2025-09-25 12:52:41.659337+00	lPJoOFoRkRCi
abc@abc.abc	f	2025-09-25 12:52:42.069213+00	JdsVT2fwJUPr
abc@abc.abc	f	2025-09-25 12:53:26.284482+00	m6evu0qrJllu
abc@abc.abc	f	2025-09-25 12:53:27.86519+00	5Mp1AoDKXZCb
abc@abc.abc	f	2025-09-25 12:53:46.938239+00	37Y2WgcuYztY
abc@abc.abc	f	2025-09-25 12:53:47.817943+00	CSsatzCC9rrR
abc@abc.abc	f	2025-09-25 12:54:44.949723+00	RjJUHLzKeyMN
abc@abc.abc	f	2025-09-25 12:54:45.925532+00	ZfX7Rwbaqy17
abc@abc.abc	f	2025-09-25 12:55:46.897731+00	iRe7IuNT2YQU
abc@abc.abc	f	2025-09-25 12:56:20.129991+00	l2GdaG9est78
abc@abc.abc	f	2025-09-25 12:56:21.359973+00	SExH5k9SMJIW
abc@abc.abc	f	2025-09-25 12:56:37.664542+00	FcUBLfa003IP
abc@abc.abc	f	2025-09-25 12:56:39.925149+00	e03vOE36blRJ
abc@abc.abc	f	2025-09-25 12:57:35.81761+00	aU2ld6bqDjPy
abc@abc.abc	f	2025-09-25 12:57:37.296291+00	CHpJDWccrOtM
abc@abc.abc	f	2025-09-25 12:57:57.193509+00	2IMmhqZF9DXr
abc@abc.abc	f	2025-09-25 12:57:59.870706+00	SKLoBnXcgIRn
abc@abc.abc	f	2025-09-25 12:58:55.47536+00	TiC22bOGAsI2
abc@abc.abc	f	2025-09-25 12:59:18.116178+00	kSMz2dst4gUk
abc@abc.abc	f	2025-09-25 12:59:19.727309+00	ZhPKBFAFeiZu
abc@abc.abc	f	2025-09-25 13:00:20.047117+00	sHdkRbRSmiWh
abc@abc.abc	f	2025-09-25 13:00:32.583834+00	pMbCWvmbgvHA
abc@abc.abc	f	2025-09-25 13:00:33.175628+00	YDyyFGvDYyEr
abc@abc.abc	f	2025-09-25 13:01:01.72607+00	7PCoLBy8UC98
abc@abc.abc	f	2025-09-25 13:01:04.785666+00	5w7mFc5lYVI4
abc@abc.abc	f	2025-09-25 13:01:44.191332+00	VOzCqLYuwxgJ
abc@abc.abc	f	2025-09-25 13:02:21.457143+00	8kgxCQwso2VI
abc@abc.abc	f	2025-09-25 13:02:29.635875+00	SAXBWNkHYZAi
abc@abc.abc	f	2025-09-25 13:02:44.007278+00	NqUsL0j62S7n
abc@abc.abc	f	2025-09-25 13:02:45.972501+00	sjRKFdheQ4Ty
abc@abc.abc	f	2025-09-25 13:03:07.581515+00	MMjrvxWhZUvE
abc@abc.abc	f	2025-09-25 13:03:08.703784+00	xIIyjhBv9tPt
abc@abc.abc	f	2025-09-25 13:03:25.385576+00	eRzONh3Bc9YU
abc@abc.abc	f	2025-09-25 13:03:25.615894+00	llTjBIBSq6wG
abc@abc.abc	f	2025-09-25 13:03:50.727806+00	oBz526e4H8Y3
abc@abc.abc	f	2025-09-25 13:03:52.561189+00	Jem81PDrLE3A
abc@abc.abc	f	2025-09-25 13:09:21.316617+00	ezQTZrUm1PIm
abc@abc.abc	f	2025-09-25 13:09:37.744438+00	uAfLQg3npkkm
abc@abc.abc	f	2025-09-25 13:09:50.743515+00	2OUsn30oDe0o
prasath@htic.iitm.ac.in	f	2025-09-26 05:09:05.097285+00	RP7eyJ9G5zi3
prasath@htic.iitm.ac.in	f	2025-09-26 05:09:05.127466+00	N9tka2jf6H50
prasath@htic.iitm.ac.in	f	2025-09-26 05:09:32.131261+00	tkFa96mpg0x1
prasath@htic.iitm.ac.in	f	2025-09-26 05:09:32.349018+00	GnEPF73Y0XGj
abc@abc.abc	f	2025-09-26 05:15:23.350139+00	1tAwC6w1Jfbg
prasath@htic.iitm.ac.in	f	2025-09-26 05:16:29.620708+00	HTn2p3FOnlQl
prasath@htic.iitm.ac.in	f	2025-09-26 05:16:29.643401+00	IDkL82C2OtwL
prasath@htic.iitm.ac.in	f	2025-09-26 05:16:33.92861+00	l5Pcvg4YPvEl
prasath@htic.iitm.ac.in	f	2025-09-26 05:16:33.951971+00	5mcjQzt0IEVq
abc@abc.abc	f	2025-09-26 05:25:10.890178+00	0XenlurDYzZV
abc@abc.abc	f	2025-09-26 05:31:32.89541+00	4rzUJ7vGHJTo
prasath@htic.iitm.ac.in	f	2025-09-26 05:32:05.739949+00	SI1N6GsOdKaf
prasath@htic.iitm.ac.in	f	2025-09-26 05:32:05.761254+00	MgyEsmcFSSGU
prasath@htic.iitm.ac.in	f	2025-09-26 05:32:45.722674+00	mRmiANk55tv4
prasath@htic.iitm.ac.in	f	2025-09-26 05:32:45.760013+00	rILrx3npMQkk
abc@abc.abc	f	2025-09-26 05:36:29.825504+00	d9xTQvC11MZx
abc@abc.abc	f	2025-09-26 05:37:38.614317+00	13yKcqwAqWAc
prasath@htic.iitm.ac.in	f	2025-09-26 05:40:17.598823+00	EouppJxJySbR
prasath@htic.iitm.ac.in	f	2025-09-26 05:40:17.629215+00	HKzxA6VjVOsg
prasath@htic.iitm.ac.in	f	2025-09-26 05:40:24.077321+00	vtnpLHzoB20t
prasath@htic.iitm.ac.in	f	2025-09-26 05:40:24.104126+00	LvE98qvPehtl
abc@abc.abc	f	2025-09-26 05:42:56.569215+00	oBzW4e2XVz4s
prasath@htic.iitm.ac.in	f	2025-09-26 05:46:36.299824+00	Sxi4cBVUWA0F
prasath@htic.iitm.ac.in	f	2025-09-26 05:46:36.32787+00	mzbgc5ZL0K77
abc@abc.abc	f	2025-09-26 05:46:41.296395+00	UbIgQtoksDzD
abc@abc.abc	f	2025-09-26 05:48:14.497035+00	IO6OZC0n8WXj
abc@abc.abc	f	2025-09-26 05:49:09.41765+00	zE8vPMupKteK
abc@abc.abc	f	2025-09-26 05:51:57.61716+00	kIfncW5SZWrq
abc@abc.abc	f	2025-09-26 05:52:42.090613+00	LnmrkwOtSgxm
prasath@htic.iitm.ac.in	f	2025-09-26 05:52:56.947717+00	Eew7BPlBpDip
prasath@htic.iitm.ac.in	f	2025-09-26 05:52:57.1067+00	uAlGX8mhRt3t
prasath@htic.iitm.ac.in	f	2025-09-26 05:53:02.318277+00	lp92As8EGPgw
prasath@htic.iitm.ac.in	f	2025-09-26 05:53:02.349449+00	6a0FawREBYxa
prasath@htic.iitm.ac.in	f	2025-09-26 05:53:14.399658+00	SeOB4h2vjxRw
prasath@htic.iitm.ac.in	f	2025-09-26 05:53:14.43389+00	eMmNV77OZx8B
prasath@htic.iitm.ac.in	f	2025-09-26 05:54:44.963404+00	UJD1ZsyWl9z8
prasath@htic.iitm.ac.in	f	2025-09-26 05:54:44.994439+00	C1ovy25p4Qvy
prasath@htic.iitm.ac.in	f	2025-09-26 05:55:02.23033+00	9ZqTkHhIt1iq
prasath@htic.iitm.ac.in	f	2025-09-26 05:55:02.452799+00	C4VaNTDyDgqe
prasath@htic.iitm.ac.in	f	2025-09-26 05:55:08.969285+00	HlqZaH6VoWlR
prasath@htic.iitm.ac.in	f	2025-09-26 05:55:09.001939+00	AzjMHN8BYaRv
prasath@htic.iitm.ac.in	f	2025-09-26 05:55:13.08202+00	mEnDd1wGPodM
prasath@htic.iitm.ac.in	f	2025-09-26 05:55:13.113893+00	NyJ5LP5d2HGH
prasath@htic.iitm.ac.in	f	2025-09-26 06:05:00.105661+00	TgbNopHxweXZ
prasath@htic.iitm.ac.in	f	2025-09-26 06:05:00.136946+00	wOzaR6PkPLtB
abc@abc.abc	f	2025-09-26 06:15:19.290653+00	GqafhdYBw6eG
abc@abc.abc	f	2025-09-26 06:15:56.783316+00	aw4MHPcjRF3D
abc@abc.abc	f	2025-09-26 06:16:55.352348+00	FReAibCYafue
abc@abc.abc	f	2025-09-26 06:18:52.939783+00	W7HYvcgAn6U7
abc@abc.abc	f	2025-09-26 06:19:01.789477+00	mwkbHu4TP4lU
abc@abc.abc	f	2025-09-26 06:19:17.195505+00	Wg1BftdakqWB
abc@abc.abc	f	2025-09-26 06:19:24.316184+00	Xza3ucxEvFNA
abc@abc.abc	f	2025-09-26 06:20:29.315615+00	OazWawY04GQm
abc@abc.abc	f	2025-09-26 06:20:48.170595+00	yotL35jBOaiU
prasath@htic.iitm.ac.in	f	2025-09-26 06:22:17.55603+00	KKqC2s9zJKoe
prasath@htic.iitm.ac.in	f	2025-09-26 06:22:17.577121+00	SLdwEOFNOKfa
prasath@htic.iitm.ac.in	f	2025-09-26 06:22:19.995741+00	ciwIufLCQwz2
prasath@htic.iitm.ac.in	f	2025-09-26 06:22:20.044234+00	xeU7heJg2CwL
prasath@htic.iitm.ac.in	f	2025-09-26 06:24:28.197993+00	CKhdz68lu9dq
prasath@htic.iitm.ac.in	f	2025-09-26 06:24:28.22026+00	Lsf6NrUWy5Xj
prasath@htic.iitm.ac.in	f	2025-09-26 06:25:03.685342+00	4xEPbZ8MAZ5t
prasath@htic.iitm.ac.in	f	2025-09-26 06:25:03.707511+00	wHiqdlZIUuca
prasath@htic.iitm.ac.in	f	2025-09-26 06:25:31.227982+00	tkxoCR7lbNgG
prasath@htic.iitm.ac.in	f	2025-09-26 06:25:31.249675+00	w9HIeb3hrNQx
abc@abc.abc	f	2025-09-26 06:56:21.423804+00	Rvvky3Yffk5u
abc@abc.abc	f	2025-09-26 06:56:55.171166+00	U5ZbK3RuKTWw
abc@abc.abc	f	2025-09-26 07:05:27.898581+00	KOO5aepJYiG6
prasath@htic.iitm.ac.in	f	2025-09-26 07:14:12.653235+00	igrozAqR3UZj
prasath@htic.iitm.ac.in	f	2025-09-26 07:14:12.676326+00	vCKkw7vXCtMs
prasath@htic.iitm.ac.in	f	2025-09-26 07:14:14.989906+00	TzesnAjIXcnr
prasath@htic.iitm.ac.in	f	2025-09-26 07:14:15.014514+00	E5XwmofOrdmk
prasath@htic.iitm.ac.in	f	2025-09-26 07:15:13.759845+00	jdxttryiITAM
prasath@htic.iitm.ac.in	f	2025-09-26 07:15:13.78288+00	QpFfYdPF0YDk
prasath@htic.iitm.ac.in	f	2025-09-26 07:15:16.867158+00	tK54odpvkufj
prasath@htic.iitm.ac.in	f	2025-09-26 07:15:16.888993+00	VozvKrNhv67z
prasath@htic.iitm.ac.in	f	2025-09-26 07:15:20.62363+00	njL8b2GrG2PR
prasath@htic.iitm.ac.in	f	2025-09-26 07:15:20.645104+00	sSueY3fuFmdo
prasath@htic.iitm.ac.in	f	2025-09-26 07:15:24.984333+00	muOozRXJiZ6k
prasath@htic.iitm.ac.in	f	2025-09-26 07:15:25.007763+00	ZhFAwqF3FCKR
prasath@htic.iitm.ac.in	f	2025-09-26 07:15:30.651799+00	ZQptMxgEe11u
prasath@htic.iitm.ac.in	f	2025-09-26 07:15:30.673474+00	uRBLAxku93cI
prasath@htic.iitm.ac.in	f	2025-09-26 07:15:36.190735+00	IIU8Ng3K3O3g
prasath@htic.iitm.ac.in	f	2025-09-26 07:15:36.212973+00	cO1V5ZpM8tSm
prasath@htic.iitm.ac.in	f	2025-09-26 07:15:39.73205+00	LJDk73Rlh2tI
prasath@htic.iitm.ac.in	f	2025-09-26 07:15:39.765109+00	qrnNVW01xaCl
prasath@htic.iitm.ac.in	f	2025-09-26 07:15:43.912221+00	4x1KgqQ0aLaW
prasath@htic.iitm.ac.in	f	2025-09-26 07:15:43.933714+00	u7a37KBZaZpv
prasath@htic.iitm.ac.in	f	2025-09-26 07:15:59.075811+00	S5hBFi7LEnAU
prasath@htic.iitm.ac.in	f	2025-09-26 07:15:59.099153+00	Oo3sbLPjTl0r
prasath@htic.iitm.ac.in	f	2025-09-26 07:16:16.26307+00	upLaWP22KBAR
prasath@htic.iitm.ac.in	f	2025-09-26 07:16:16.285307+00	54Bcep9Oqs38
abc@abc.abc	f	2025-09-26 07:24:13.178025+00	p72CULWWRJTH
abc@abc.abc	f	2025-09-26 07:33:44.448734+00	egaqzrtO0ZXx
abc@abc.abc	f	2025-10-08 08:35:29.718433+00	P9rtyj9U2lIm
prasath@htic.iitm.ac.in	f	2025-09-26 07:49:57.723982+00	XS10hrXYJiyL
prasath@htic.iitm.ac.in	f	2025-09-26 07:49:57.747061+00	7mSHYyY5jCcU
abc@abc.abc	f	2025-09-26 07:51:17.112305+00	B4wTfsru41Wz
prasath@htic.iitm.ac.in	f	2025-09-26 07:51:51.571898+00	TRmSQRLJLxLY
prasath@htic.iitm.ac.in	f	2025-09-26 07:51:51.617715+00	xW8D3oaGrJKq
prasath@htic.iitm.ac.in	f	2025-09-26 07:51:54.650255+00	O4kFoezPwbe3
prasath@htic.iitm.ac.in	f	2025-09-26 07:51:54.671976+00	AEA4qVcOqnOK
prasath@htic.iitm.ac.in	f	2025-09-26 07:52:14.344058+00	NiOXjX5ypYwY
prasath@htic.iitm.ac.in	f	2025-09-26 07:52:14.365185+00	Zg5YI2eWxbDf
prasath@htic.iitm.ac.in	f	2025-09-26 07:52:16.962342+00	Pqx4f3uMKYRS
prasath@htic.iitm.ac.in	f	2025-09-26 07:52:16.994144+00	qBRelaEtPyzx
prasath@htic.iitm.ac.in	f	2025-09-26 07:52:52.327812+00	NkfuISYew7SD
prasath@htic.iitm.ac.in	f	2025-09-26 07:52:52.349983+00	q5sL6UMH5atq
prasath@htic.iitm.ac.in	f	2025-09-26 07:52:54.120209+00	cofndUKayEUT
prasath@htic.iitm.ac.in	f	2025-09-26 07:52:54.197664+00	lTQWrHiLcbc9
abc@abc.abc	f	2025-09-26 07:53:01.639865+00	UzuR2N1m52Sc
abc@abc.abc	f	2025-09-26 07:53:11.761728+00	SpLXu2kkDCbS
prasath@htic.iitm.ac.in	f	2025-09-26 07:54:37.843335+00	hKkpn4wNgvXC
prasath@htic.iitm.ac.in	f	2025-09-26 07:54:37.864584+00	ttpktq0aml07
prasath@htic.iitm.ac.in	f	2025-09-26 07:54:51.007183+00	66rI8JwjepK2
prasath@htic.iitm.ac.in	f	2025-09-26 07:54:51.045932+00	qMTdrcjYklDU
prasath@htic.iitm.ac.in	f	2025-09-26 07:55:15.493816+00	aAvqA0q3IUOJ
prasath@htic.iitm.ac.in	f	2025-09-26 07:55:15.520574+00	qbzsiNKUlE04
prasath@htic.iitm.ac.in	f	2025-09-26 07:57:59.222248+00	VPbxIpxjkF2A
prasath@htic.iitm.ac.in	f	2025-09-26 07:57:59.253386+00	NH1cNf1NSfFp
prasath@htic.iitm.ac.in	f	2025-09-27 03:58:39.014612+00	MOB0H2TJep2q
prasath@htic.iitm.ac.in	f	2025-09-27 03:58:39.046037+00	dPfUDlAro7Yc
prasath@htic.iitm.ac.in	f	2025-09-27 03:58:41.210838+00	djlaYRlDOMhx
prasath@htic.iitm.ac.in	f	2025-09-27 03:58:41.266846+00	HUWtNdS4pCeF
prasath@htic.iitm.ac.in	f	2025-09-29 09:01:31.137041+00	sJq2DlyNc622
prasath@htic.iitm.ac.in	f	2025-09-29 09:01:31.178706+00	OMNVNDWTPwW7
prasath@htic.iitm.ac.in	f	2025-09-29 11:12:40.085816+00	c1zZVYVDmYrU
prasath@htic.iitm.ac.in	f	2025-09-29 11:12:40.123171+00	19F5Fiuocrnh
prasath@htic.iitm.ac.in	f	2025-09-29 11:32:19.893525+00	LUkHidlQiBqL
prasath@htic.iitm.ac.in	f	2025-09-29 11:32:19.945795+00	G4BZpTyzC33G
prasath@htic.iitm.ac.in	f	2025-09-30 09:11:54.744896+00	Cvptb7K27mSd
prasath@htic.iitm.ac.in	f	2025-09-30 09:11:54.791536+00	fqdlC7xhSWcB
prasath@htic.iitm.ac.in	f	2025-09-30 10:08:20.832984+00	ogKRxcq7YsQJ
prasath@htic.iitm.ac.in	f	2025-09-30 10:08:20.870692+00	v20S1kr5pthm
prasath@htic.iitm.ac.in	f	2025-09-30 11:34:04.972899+00	4zMQZxPhEBo2
prasath@htic.iitm.ac.in	f	2025-09-30 11:34:05.010492+00	eZGK2CXVqmTW
prasath@htic.iitm.ac.in	f	2025-10-01 05:33:32.081738+00	LtYuA8G8qa3Q
prasath@htic.iitm.ac.in	f	2025-10-01 05:33:32.146901+00	6Fi2HOJCVDer
prasath@htic.iitm.ac.in	f	2025-10-01 06:36:00.972462+00	WtcJKNraJa85
prasath@htic.iitm.ac.in	f	2025-10-01 06:36:01.040544+00	DuxCrPSQU4mJ
prasath@htic.iitm.ac.in	f	2025-10-03 05:14:10.223366+00	wxlRIFmttXsF
prasath@htic.iitm.ac.in	f	2025-10-03 05:14:10.25989+00	EQh9rr2wafz9
prasath@htic.iitm.ac.in	f	2025-10-03 08:59:52.765184+00	OAVyHCzfMRgo
prasath@htic.iitm.ac.in	f	2025-10-03 08:59:52.806277+00	ibv4inPYY0Ug
prasath@htic.iitm.ac.in	f	2025-10-03 08:59:55.479703+00	gH8f7zgFZSBn
prasath@htic.iitm.ac.in	f	2025-10-03 08:59:55.51152+00	YXfBEmysfpg6
prasath@htic.iitm.ac.in	f	2025-10-03 09:04:13.015655+00	XiGPakVpWfPE
prasath@htic.iitm.ac.in	f	2025-10-03 09:04:13.047038+00	eq7WpGuzUzAT
prasath@htic.iitm.ac.in	f	2025-10-03 17:15:19.067939+00	Ow2EX9D4LXvK
prasath@htic.iitm.ac.in	f	2025-10-03 17:15:19.165693+00	GCfA0GgEJ9Gl
prasath@htic.iitm.ac.in	f	2025-10-04 06:07:16.730689+00	brMhEGJ3s7um
prasath@htic.iitm.ac.in	f	2025-10-04 06:07:16.763583+00	OIadj36K7Lob
prasath@htic.iitm.ac.in	f	2025-10-04 10:01:01.706171+00	IRqgDecrLa6h
prasath@htic.iitm.ac.in	f	2025-10-04 10:01:01.770479+00	O694uB23Jl9n
prasath@htic.iitm.ac.in	f	2025-10-04 10:10:00.525097+00	3kW7vRzz9n8k
prasath@htic.iitm.ac.in	f	2025-10-04 10:10:00.630351+00	DxoksZLR280u
prasath@htic.iitm.ac.in	f	2025-10-04 10:30:49.789526+00	xla0KWQskm2i
prasath@htic.iitm.ac.in	f	2025-10-04 10:30:49.877594+00	tCWlaN5yr6jZ
prasath@htic.iitm.ac.in	f	2025-10-05 10:15:34.306793+00	L5N9Bzc4vMuH
prasath@htic.iitm.ac.in	f	2025-10-05 10:15:34.340973+00	Lv6JXGryXec7
prasath@htic.iitm.ac.in	f	2025-10-05 11:58:22.610915+00	9kh1heOok54d
prasath@htic.iitm.ac.in	f	2025-10-05 11:58:22.63622+00	hPdXVuFEMze1
prasath@htic.iitm.ac.in	f	2025-10-06 14:00:28.264137+00	MxkYQrG30gnb
prasath@htic.iitm.ac.in	f	2025-10-06 14:00:28.588248+00	2hZVfnktB55E
prasath@htic.iitm.ac.in	f	2025-10-06 14:00:31.419027+00	71NfUTv3GTSl
prasath@htic.iitm.ac.in	f	2025-10-06 14:00:31.442811+00	m0Qgu0MrHTvT
prasath@htic.iitm.ac.in	f	2025-10-07 04:43:50.142887+00	lxBHUEZqhR6w
prasath@htic.iitm.ac.in	f	2025-10-07 04:43:50.194248+00	ivPqMqD5Hvep
prasath@htic.iitm.ac.in	f	2025-10-07 06:16:20.829885+00	g6vYBAMaHWsQ
prasath@htic.iitm.ac.in	f	2025-10-07 06:16:20.855781+00	Efxjv5E183HX
prasath@htic.iitm.ac.in	f	2025-10-07 09:38:39.258716+00	jxrBSg4V8KqQ
prasath@htic.iitm.ac.in	f	2025-10-07 09:38:39.316239+00	i7JIfqYqyIJw
prasath@htic.iitm.ac.in	f	2025-10-07 09:40:59.767964+00	vhUwKgYLkzj4
prasath@htic.iitm.ac.in	f	2025-10-07 09:40:59.819694+00	2kamfc35bWyf
abc@abc.abc	f	2025-10-08 06:04:12.887326+00	iFuE60iBgdHn
abc@abc.abc	f	2025-10-08 06:09:41.945548+00	6TcSYmik86FW
abc@abc.abc	f	2025-10-08 06:14:40.294441+00	m0DlU2nq8gNB
abc@abc.abc	f	2025-10-08 06:24:44.743838+00	kNFRqzQp2vvH
abc@abc.abc	f	2025-10-08 06:37:05.749004+00	GoIJst4ZHQZI
abc@abc.abc	f	2025-10-08 07:19:43.260726+00	hyIaLFS2Wwn4
abc@abc.abc	f	2025-10-08 07:23:35.499712+00	GFrrPZzyYZ6S
abc@abc.abc	f	2025-10-08 07:26:06.082576+00	aaDiIZSryCWD
abc@abc.abc	f	2025-10-08 07:28:26.890792+00	wcaLxelPZmWN
abc@abc.abc	f	2025-10-08 07:30:00.425265+00	KHLigcJl2xiu
abc@abc.abc	f	2025-10-08 07:53:36.249901+00	jZPthDgVcMXu
abc@abc.abc	f	2025-10-08 07:58:00.098263+00	9wfy7F4v465X
abc@abc.abc	f	2025-10-08 07:58:56.157715+00	3579XwSg1a4j
abc@abc.abc	f	2025-10-08 08:03:52.578215+00	WZN3RWBKa7mG
abc@abc.abc	f	2025-10-08 08:04:51.809623+00	48MOWreDaSTk
abc@abc.abc	f	2025-10-08 08:14:47.135723+00	PYv7I1GE6IIP
abc@abc.abc	f	2025-10-08 08:14:47.677308+00	6jTLfaAtZM1A
abc@abc.abc	f	2025-10-08 08:29:26.07034+00	XxNbxqpmFziu
abc@abc.abc	f	2025-10-08 08:29:26.317467+00	r3GLlfdU0fdg
abc@abc.abc	f	2025-10-08 08:31:26.501267+00	A45s1X01Bz0Y
abc@abc.abc	f	2025-10-08 08:31:26.727029+00	FZKWtaOD8NHx
abc@abc.abc	f	2025-10-08 08:32:03.714895+00	lmFVQT9PDA4V
abc@abc.abc	f	2025-10-08 08:32:04.164107+00	EwAfgiBNlzh0
abc@abc.abc	f	2025-10-08 08:35:29.943405+00	rNXGs6cQkyjC
abc@abc.abc	f	2025-10-08 11:07:52.315816+00	ayI1Q2ATI4p7
abc@abc.abc	f	2025-10-08 11:07:52.560788+00	sqtWUU1mClVI
abc@abc.abc	f	2025-10-08 11:18:16.171746+00	xm1a0DQiJ2af
abc@abc.abc	f	2025-10-08 11:29:32.268546+00	myqmQd81UXoO
abc@abc.abc	f	2025-10-08 11:29:32.490212+00	nGkowDilUjX2
abc@abc.abc	f	2025-10-08 11:30:08.754986+00	JgqOC4CMym2f
abc@abc.abc	f	2025-10-08 11:30:09.178548+00	CW7TqIM0neZh
abc@abc.abc	f	2025-10-08 11:40:18.209122+00	AZkCESdMlmWY
abc@abc.abc	f	2025-10-08 11:41:11.051019+00	YLsu4XXz8zZ3
abc@abc.abc	f	2025-10-08 11:42:15.556229+00	zotl9gImi9nz
abc@abc.abc	f	2025-10-08 11:42:58.199041+00	ip5zvEM9MS8a
abc@abc.abc	f	2025-10-08 11:48:44.058788+00	G0yt5T8d5YWu
abc@abc.abc	f	2025-10-08 11:52:29.936+00	5jEjuvQvmcRL
abc@abc.abc	f	2025-10-08 12:07:09.878537+00	PzCHusu1dZhq
abc@abc.abc	f	2025-10-08 12:11:36.30677+00	HZHexJG9jJu0
abc@abc.abc	f	2025-10-08 12:12:34.935874+00	VFaLKYkDaG9B
abc@abc.abc	f	2025-10-08 12:19:47.763726+00	o6xMjOg8dfv8
abc@abc.abc	f	2025-10-08 12:20:54.469684+00	O0hv3ora2NgP
abc@abc.abc	f	2025-10-08 12:21:46.707764+00	fWuj6aoZjX47
abc@abc.abc	f	2025-10-08 12:24:27.777074+00	HwcP7DFc9Oxz
abc@abc.abc	f	2025-10-08 12:28:26.975346+00	moGIwKD7WUnC
abc@abc.abc	f	2025-10-08 12:28:27.19747+00	Sh8QYSCzRwyZ
abc@abc.abc	f	2025-10-08 12:36:18.447484+00	ljBDP4DuO1fh
abc@abc.abc	f	2025-10-08 12:36:19.252591+00	JbvdYkX91z4X
abc@abc.abc	f	2025-10-08 12:37:28.20314+00	JqskjfQ1UO5l
abc@abc.abc	f	2025-10-08 12:37:28.691642+00	ex5vVGyBcmmc
abc@abc.abc	f	2025-10-08 12:47:36.735964+00	Cot5CInRCBWM
abc@abc.abc	f	2025-10-08 12:51:37.630518+00	3ESCNwqENNGV
abc@abc.abc	f	2025-10-08 12:51:37.852091+00	CQ9wlQB8RKw2
abc@abc.abc	f	2025-10-09 06:36:02.612635+00	bBg2zoJ2YkXX
abc@abc.abc	f	2025-10-09 06:36:02.977056+00	blLHYInBAKrF
prasath@htic.iitm.ac.in	f	2025-10-09 06:40:56.725159+00	R7l3inTnNLdo
prasath@htic.iitm.ac.in	f	2025-10-09 06:40:56.753635+00	YVdc69PiwyLU
prasath@htic.iitm.ac.in	f	2025-10-09 06:41:00.428773+00	HvhoRHCEJe91
prasath@htic.iitm.ac.in	f	2025-10-09 06:41:00.454872+00	AGeiCzgVa2X1
prasath@htic.iitm.ac.in	f	2025-10-09 06:41:47.826735+00	5n6pObLjPtrS
prasath@htic.iitm.ac.in	f	2025-10-09 06:41:47.851224+00	yUywyohHWW8H
prasath@htic.iitm.ac.in	f	2025-10-09 06:41:49.517785+00	P2uNG77fpEt5
prasath@htic.iitm.ac.in	f	2025-10-09 06:41:49.541043+00	Gjr81HdEOK38
prasath@htic.iitm.ac.in	f	2025-10-09 06:42:32.530122+00	GokCZFopPvas
prasath@htic.iitm.ac.in	f	2025-10-09 06:42:32.581583+00	VaS0rUk0oOnM
prasath@htic.iitm.ac.in	f	2025-10-09 06:43:05.716019+00	lTRzrPPpoVLV
prasath@htic.iitm.ac.in	f	2025-10-09 06:43:11.691955+00	5j3tgTBXjr5U
prasath@htic.iitm.ac.in	f	2025-10-09 06:43:18.013047+00	VWIKrwYEgdXx
prasath@htic.iitm.ac.in	f	2025-10-09 06:43:18.03869+00	QB6h4UZX7TaE
prasath@htic.iitm.ac.in	f	2025-10-09 06:43:19.547946+00	6nOuWZl5AzGh
prasath@htic.iitm.ac.in	f	2025-10-09 06:43:19.569685+00	hhrNPedeMCn4
prasath@htic.iitm.ac.in	f	2025-10-09 06:43:28.185852+00	0jrz2BfHRa6z
prasath@htic.iitm.ac.in	f	2025-10-09 06:43:28.221462+00	mm7ePS26yv14
prasath@htic.iitm.ac.in	f	2025-10-09 06:43:30.21244+00	egNeZl0Cw9B3
prasath@htic.iitm.ac.in	f	2025-10-09 06:43:30.2447+00	H12uHufANP3t
prasath@htic.iitm.ac.in	f	2025-10-09 06:44:29.913683+00	FhnKgAMCouUM
prasath@htic.iitm.ac.in	f	2025-10-09 06:44:30.083633+00	aKJvUtHphGzF
prasath@htic.iitm.ac.in	f	2025-10-09 06:45:02.51744+00	OiZnomaWH4Pe
prasath@htic.iitm.ac.in	f	2025-10-09 06:45:02.549249+00	TXo9110wqHCq
prasath@htic.iitm.ac.in	f	2025-10-09 06:45:46.545094+00	Ug3soLGZ963n
prasath@htic.iitm.ac.in	f	2025-10-09 06:45:46.570484+00	VY4WB3o8yZqv
prasath@htic.iitm.ac.in	f	2025-10-09 06:45:50.031829+00	0CHy8sfQWzT2
prasath@htic.iitm.ac.in	f	2025-10-09 06:45:50.054318+00	zOOzXhPZb5UU
abc@abc.abc	f	2025-10-09 06:46:07.821864+00	Wpw4EerQ0VoF
prasath@htic.iitm.ac.in	f	2025-10-09 06:46:10.222648+00	Cwk9rxMtvlm1
prasath@htic.iitm.ac.in	f	2025-10-09 06:46:10.253027+00	nI9cNKt98LpO
prasath@htic.iitm.ac.in	f	2025-10-09 06:46:12.102956+00	bBDoSX6ah5Uf
prasath@htic.iitm.ac.in	f	2025-10-09 06:46:12.136077+00	KFXWiQYwF3J4
prasath@htic.iitm.ac.in	f	2025-10-09 06:46:43.637545+00	W2eU8FIVXfKD
prasath@htic.iitm.ac.in	f	2025-10-09 06:46:43.659456+00	OVamYDJohkAR
prasath@htic.iitm.ac.in	f	2025-10-09 06:46:45.303543+00	dMGa2WrLhJNm
prasath@htic.iitm.ac.in	f	2025-10-09 06:46:45.328331+00	Urzh5oAySYfZ
abc@abc.abc	f	2025-10-09 06:51:05.628907+00	BfOP0OgvZy2V
abc@abc.abc	f	2025-10-09 06:51:05.849875+00	p5Yd39lkoYEO
prasath@htic.iitm.ac.in	f	2025-10-09 06:52:54.219373+00	itHCGmg5ExcE
prasath@htic.iitm.ac.in	f	2025-10-09 06:52:54.245327+00	AqcjnY4TaUhy
prasath@htic.iitm.ac.in	f	2025-10-09 06:52:55.979756+00	4KTJVe4QOgsi
prasath@htic.iitm.ac.in	f	2025-10-09 06:52:56.017066+00	I64HKYjPOqNl
prasath@htic.iitm.ac.in	f	2025-10-09 06:55:25.686637+00	IO552t8o3kxx
prasath@htic.iitm.ac.in	f	2025-10-09 06:55:25.713319+00	Pn5ARv0RySqT
abc@abc.abc	f	2025-10-09 07:01:15.300548+00	WKjuffmmVJVa
prasath@htic.iitm.ac.in	f	2025-10-09 07:02:25.756013+00	eu7rc1lLPgyN
prasath@htic.iitm.ac.in	f	2025-10-09 07:02:25.780835+00	Railve9FOlpE
prasath@htic.iitm.ac.in	f	2025-10-09 07:02:25.804597+00	Am431Q2hoOlz
prasath@htic.iitm.ac.in	f	2025-10-09 07:02:34.322448+00	Qixc9AUZpUnH
prasath@htic.iitm.ac.in	f	2025-10-09 07:02:34.368353+00	6CgyngyzOizk
prasath@htic.iitm.ac.in	f	2025-10-09 07:02:36.558861+00	yWzvrBW9zC8b
prasath@htic.iitm.ac.in	f	2025-10-09 07:02:36.585403+00	Ui2rwxHsCnG6
prasath@htic.iitm.ac.in	f	2025-10-09 07:02:52.218521+00	WA5XHmKIwzLH
prasath@htic.iitm.ac.in	f	2025-10-09 07:02:52.711986+00	TyMDPzsyH0cF
prasath@htic.iitm.ac.in	f	2025-10-09 07:02:52.755345+00	nV0senqOb8c5
abc@abc.abc	f	2025-10-09 07:03:26.702455+00	8TMHQW0CSfZW
abc@abc.abc	f	2025-10-09 07:03:27.310521+00	LWshkZCaLzgM
abc@abc.abc	f	2025-10-09 07:04:27.29385+00	WnIOcll82J8p
abc@abc.abc	f	2025-10-09 07:04:27.517529+00	Oyz3RZs0deho
prasath@htic.iitm.ac.in	f	2025-10-09 07:06:53.773996+00	nW2lOYynDSI7
prasath@htic.iitm.ac.in	f	2025-10-09 07:06:53.795791+00	RfVLEJbRcfUf
prasath@htic.iitm.ac.in	f	2025-10-09 07:07:02.300441+00	cPFQjasnLj46
prasath@htic.iitm.ac.in	f	2025-10-09 07:07:02.378393+00	nDXHjpMh1fIR
abc@abc.abc	f	2025-10-09 07:07:33.08953+00	esQwAJfzwt5i
abc@abc.abc	f	2025-10-09 07:07:33.728965+00	Ocxr0Kgzx6Iz
abc@abc.abc	f	2025-10-09 07:07:54.742176+00	NmKpZEwtgQEw
abc@abc.abc	f	2025-10-09 07:07:54.966049+00	eoYpG74U3yvg
abc@abc.abc	f	2025-10-09 07:08:35.668871+00	xBq4gmXWi81A
abc@abc.abc	f	2025-10-09 07:08:35.894197+00	D1uFPhQ7nCqT
prasath@htic.iitm.ac.in	f	2025-10-09 07:08:40.769343+00	qbk5cJ5TSUXq
prasath@htic.iitm.ac.in	f	2025-10-09 07:08:40.792047+00	7zeIHFKX44uX
prasath@htic.iitm.ac.in	f	2025-10-09 07:10:51.551818+00	ct97wN1X3EGc
prasath@htic.iitm.ac.in	f	2025-10-09 07:10:51.578922+00	XeHrGo7N3bFk
abc@abc.abc	f	2025-10-09 07:18:40.223201+00	nkULUPvVapSt
abc@abc.abc	f	2025-10-09 07:18:40.662678+00	pS8DGfZBHDjg
abc@abc.abc	f	2025-10-09 07:28:47.880448+00	YjFfvzUNkSVf
abc@abc.abc	f	2025-10-09 07:28:48.317159+00	1ZVVoaLyajvo
prasath@htic.iitm.ac.in	f	2025-10-09 07:30:37.266827+00	mC5JM3ilngO2
prasath@htic.iitm.ac.in	f	2025-10-09 07:30:37.295403+00	ykDTEzs9Dm4V
prasath@htic.iitm.ac.in	f	2025-10-09 07:30:40.714667+00	xut392lGo8BX
prasath@htic.iitm.ac.in	f	2025-10-09 07:30:40.745886+00	hPdNlSeBx7Fh
abc@abc.abc	f	2025-10-09 07:38:57.446928+00	vM4PQ2i6BliI
abc@abc.abc	f	2025-10-09 07:38:58.099149+00	KnYpBvla56LX
prasath@htic.iitm.ac.in	f	2025-10-09 07:44:31.012712+00	15PZrIt1RIT3
prasath@htic.iitm.ac.in	f	2025-10-09 07:44:31.037555+00	jNMKlB0JIxV4
prasath@htic.iitm.ac.in	f	2025-10-09 07:46:53.558412+00	MobFvoLEVRqG
prasath@htic.iitm.ac.in	f	2025-10-09 07:46:53.583672+00	SSWKn5XqYQcL
abc@abc.abc	f	2025-10-09 07:48:49.944892+00	u9uNVfUfrS8x
abc@abc.abc	f	2025-10-09 07:48:50.167064+00	j8oaSma5gztP
prasath@htic.iitm.ac.in	f	2025-10-09 07:49:32.905827+00	AtBb8Zoeosqi
prasath@htic.iitm.ac.in	f	2025-10-09 07:49:32.931716+00	rKNbeBgq1QaH
prasath@htic.iitm.ac.in	f	2025-10-09 07:49:35.288466+00	EFvk3DQHILVX
prasath@htic.iitm.ac.in	f	2025-10-09 07:49:35.328928+00	JALe7dqYbWt9
prasath@htic.iitm.ac.in	f	2025-10-09 07:49:45.995839+00	mXzRLAd1phiQ
prasath@htic.iitm.ac.in	f	2025-10-09 07:49:46.034834+00	jKQqN4N52Ugn
prasath@htic.iitm.ac.in	f	2025-10-09 07:52:38.354781+00	OgnqAg3rrMx4
prasath@htic.iitm.ac.in	f	2025-10-09 07:52:38.382626+00	HmYBF37EalNe
prasath@htic.iitm.ac.in	f	2025-10-09 07:55:29.728174+00	QptY9HKiygIP
prasath@htic.iitm.ac.in	f	2025-10-09 07:55:29.758978+00	UH875Xv7qOr6
prasath@htic.iitm.ac.in	f	2025-10-09 07:55:31.260036+00	MM6ZOlcQSI83
prasath@htic.iitm.ac.in	f	2025-10-09 07:55:31.286194+00	UAIF5lSDvKOg
abc@abc.abc	f	2025-10-09 07:58:52.051714+00	Af4ewFeubwpV
abc@abc.abc	f	2025-10-09 07:58:52.27303+00	oasjSTyeEale
abc@abc.abc	f	2025-10-09 08:08:54.027403+00	sKiloPzGTIlm
abc@abc.abc	f	2025-10-09 08:08:54.281561+00	tDSuDmi67QZ0
abc@abc.abc	f	2025-10-09 08:18:55.606499+00	Wcrg4blDkyS4
abc@abc.abc	f	2025-10-09 08:18:55.857068+00	jmgrAc4YSyPo
abc@abc.abc	f	2025-10-09 08:28:57.164382+00	MWSBLx2zs5zb
abc@abc.abc	f	2025-10-09 08:28:57.396168+00	5RwwGn1LYjHO
abc@abc.abc	f	2025-10-09 08:38:59.146763+00	j0VjakBUOt1f
abc@abc.abc	f	2025-10-09 08:38:59.369721+00	ozpoFgPztNil
abc@abc.abc	f	2025-10-09 08:49:00.2669+00	ManwFU26n9RN
abc@abc.abc	f	2025-10-09 08:49:00.921394+00	oBwfSMfRJ7ho
abc@abc.abc	f	2025-10-09 08:59:01.868064+00	rkFenVJ42k9N
abc@abc.abc	f	2025-10-09 08:59:02.464852+00	xP7tw9MOxE6g
abc@abc.abc	f	2025-10-09 09:09:03.54462+00	NbASxNjHl7FS
abc@abc.abc	f	2025-10-09 09:09:04.091569+00	J8WaUvELDv5Y
abc@abc.abc	f	2025-10-09 09:19:02.966386+00	97eCOkzxElKI
abc@abc.abc	f	2025-10-09 09:19:03.388571+00	yQtDFWmaTMHh
abc@abc.abc	f	2025-10-09 09:19:41.99308+00	iV7MT5seIuj8
abc@abc.abc	f	2025-10-09 09:19:42.231811+00	0skyAt3Jmyon
abc@abc.abc	f	2025-10-09 09:20:18.133587+00	ddf7rtxw3xDb
abc@abc.abc	f	2025-10-09 09:20:18.557667+00	YFrI6bTK3LUq
abc@abc.abc	f	2025-10-09 09:26:31.062043+00	wn9ZLK2dVWYg
abc@abc.abc	f	2025-10-09 09:26:31.301394+00	NMcAx1WnHwMf
prasath@htic.iitm.ac.in	f	2025-10-09 09:26:41.665641+00	jKgFI25py1Pa
prasath@htic.iitm.ac.in	f	2025-10-09 09:26:41.692055+00	B81ZmSzYjkRE
prasath@htic.iitm.ac.in	f	2025-10-09 09:26:44.170094+00	DaaN2irVwfWd
prasath@htic.iitm.ac.in	f	2025-10-09 09:26:44.203618+00	uzvYGWEQrcPc
abc@abc.abc	f	2025-10-09 09:27:32.108835+00	tpHOSNPRyCXL
abc@abc.abc	f	2025-10-09 09:27:33.100205+00	Psmdp2ZgHSX4
prasath@htic.iitm.ac.in	f	2025-10-09 09:28:21.531028+00	zKhVLJQQ3PzS
prasath@htic.iitm.ac.in	f	2025-10-09 09:28:21.566684+00	HeRpHxaqlfRK
abc@abc.abc	f	2025-10-09 10:36:21.215761+00	csqhTFUGRWAU
abc@abc.abc	f	2025-10-09 10:46:31.344834+00	Bxdh7m2a5qKK
abc@abc.abc	f	2025-10-09 10:56:33.026989+00	XmHaeKpXZHQR
abc@abc.abc	f	2025-10-09 11:06:34.644488+00	Cn3I1xkW1DLc
abc@abc.abc	f	2025-10-09 11:16:36.809202+00	h9doxXTN9SCi
abc@abc.abc	f	2025-10-09 12:31:11.036284+00	b5Hnd49iMjmC
abc@abc.abc	f	2025-10-09 12:31:30.930668+00	ogvO4elQc8vI
abc@abc.abc	f	2025-10-09 12:32:05.583217+00	VpakanIX8cZq
abc@abc.abc	f	2025-10-09 12:39:13.576846+00	ywCj1SOWuCIl
abc@abc.abc	f	2025-10-09 12:43:54.258702+00	ITAmYkPPIGDO
abc@abc.abc	f	2025-10-09 12:50:27.226973+00	zVBmeWvksNvb
abc@abc.abc	f	2025-10-09 12:51:25.851685+00	EpOQuwmhH3SN
abc@abc.abc	f	2025-10-09 12:59:51.840713+00	cCAJ70f9WaAh
abc@abc.abc	f	2025-10-09 13:04:03.206976+00	qcWLquTgaV5h
abc@abc.abc	f	2025-10-09 13:05:21.118448+00	tY4g8o0ORBwv
abc@abc.abc	f	2025-10-09 13:09:06.007674+00	S8WYcSXWyQtw
abc@abc.abc	f	2025-10-09 13:09:48.719506+00	UpqrB8DISLCI
prasath@htic.iitm.ac.in	f	2025-10-10 05:23:49.808796+00	XJtm2V6ezL3p
prasath@htic.iitm.ac.in	f	2025-10-10 05:23:49.844673+00	aLE0S1kEimdl
prasath@htic.iitm.ac.in	f	2025-10-10 14:46:29.005967+00	erqhLNfLmYDG
prasath@htic.iitm.ac.in	f	2025-10-10 14:46:29.045179+00	wXXNrDPjgmIE
prasath@htic.iitm.ac.in	f	2025-10-10 14:58:32.616922+00	Kwn0YR2q6Sgt
prasath@htic.iitm.ac.in	f	2025-10-10 14:58:32.645673+00	ZKgO1GV5zuya
prasath@htic.iitm.ac.in	f	2025-10-10 15:29:13.730104+00	G1b1WvuzXyBU
prasath@htic.iitm.ac.in	f	2025-10-10 15:29:13.850104+00	LcPgBbveHnJH
prasath@htic.iitm.ac.in	f	2025-10-10 15:43:14.998717+00	P97DfUvE2vqE
prasath@htic.iitm.ac.in	f	2025-10-10 15:43:15.063984+00	qGXnSr50qx2n
prasath@htic.iitm.ac.in	f	2025-10-10 15:43:33.546951+00	ZEaQ6UTHH15S
prasath@htic.iitm.ac.in	f	2025-10-10 15:43:33.570738+00	WymAQRz1XAeu
prasath@htic.iitm.ac.in	f	2025-10-10 15:43:35.642458+00	ahCm4WvFgpKt
prasath@htic.iitm.ac.in	f	2025-10-10 15:43:35.666217+00	OtFgVEZJw1kg
prasath@htic.iitm.ac.in	f	2025-10-12 06:18:02.755595+00	Bti7lQip4Esm
prasath@htic.iitm.ac.in	f	2025-10-12 06:18:02.792634+00	ZeVXrNOacLZE
abc@abc.abc	f	2025-10-13 07:01:48.042262+00	PIVSQkt7PkDn
prasath@htic.iitm.ac.in	f	2025-10-13 07:02:31.103279+00	8Zjqke1kcROg
prasath@htic.iitm.ac.in	f	2025-10-13 07:02:31.127793+00	rCLkmU5VO1ub
prasath@htic.iitm.ac.in	f	2025-10-13 07:02:32.643175+00	eJmZWnazMSnN
prasath@htic.iitm.ac.in	f	2025-10-13 07:02:32.68837+00	5ihwOSMLMJuq
prasath@htic.iitm.ac.in	f	2025-10-13 07:03:28.695286+00	I7StqU9wcw0S
prasath@htic.iitm.ac.in	f	2025-10-13 07:03:28.721363+00	B5V83a82rjNN
prasath@htic.iitm.ac.in	f	2025-10-13 07:03:31.478639+00	NYW66SqN4oLM
prasath@htic.iitm.ac.in	f	2025-10-13 07:03:31.536368+00	r21p4VCtyoS9
prasath@htic.iitm.ac.in	f	2025-10-13 07:04:10.280066+00	aAUVO9npjkFR
prasath@htic.iitm.ac.in	f	2025-10-13 07:04:10.302779+00	XyavXLd3Quu9
abc@abc.abc	f	2025-10-13 07:06:07.220313+00	3229CfWDRD7S
prasath@htic.iitm.ac.in	f	2025-10-13 09:05:11.617247+00	7k0dk7alr6uD
prasath@htic.iitm.ac.in	f	2025-10-13 09:05:11.660613+00	TemDGlDnAcUd
abc@abc.abc	f	2025-10-13 09:51:42.27096+00	8YSLYOhzHFRH
abc@abc.abc	f	2025-10-13 09:58:26.986107+00	1ROJYq0Lt5Zo
abc@abc.abc	f	2025-10-13 09:58:27.209279+00	YPIT4j0ZRYjx
abc@abc.abc	f	2025-10-13 09:59:50.606697+00	HrIL9uTmO1ZR
abc@abc.abc	f	2025-10-13 09:59:50.828443+00	2tfSqmaY6Iye
abc@abc.abc	f	2025-10-13 10:00:55.816983+00	m57Fe0eIp3op
abc@abc.abc	f	2025-10-13 10:04:19.084238+00	tD2YDFDqwqVw
prasath@htic.iitm.ac.in	f	2025-10-13 10:08:02.072131+00	v0q8eX74SeCg
prasath@htic.iitm.ac.in	f	2025-10-13 10:08:02.109826+00	k8Gm8w5StsAA
prasath@htic.iitm.ac.in	f	2025-10-13 10:09:19.402856+00	NkZ8FPq6GB45
prasath@htic.iitm.ac.in	f	2025-10-13 10:09:19.432816+00	6Oj7pr5whi6t
prasath@htic.iitm.ac.in	f	2025-10-13 10:10:24.857724+00	BeO69rv7qP0b
prasath@htic.iitm.ac.in	f	2025-10-13 10:10:24.892045+00	BWdyYsijUGlY
prasath@htic.iitm.ac.in	f	2025-10-13 10:13:42.369481+00	oyReOLCkbGth
prasath@htic.iitm.ac.in	f	2025-10-13 10:13:42.402412+00	7eF0RJM1FPHe
prasath@htic.iitm.ac.in	f	2025-10-13 10:13:52.316401+00	54lxRra5BiBG
prasath@htic.iitm.ac.in	f	2025-10-13 10:13:52.352566+00	cka7iabJjJIk
abc@abc.abc	f	2025-10-13 10:14:29.213909+00	2QDvHDvUjSyb
prasath@htic.iitm.ac.in	f	2025-10-13 10:14:31.315274+00	eVUwyLrWZZ1z
prasath@htic.iitm.ac.in	f	2025-10-13 10:14:31.348191+00	6FP8c4Dx5cn5
prasath@htic.iitm.ac.in	f	2025-10-13 10:15:57.001369+00	IFAxJQmjQnmG
prasath@htic.iitm.ac.in	f	2025-10-13 10:15:58.174707+00	De2pGHsAW1uP
prasath@htic.iitm.ac.in	f	2025-10-13 10:15:58.204498+00	Wr1IfOYl6DXW
prasath@htic.iitm.ac.in	f	2025-10-13 10:16:06.586939+00	K4uh2fc1crdm
prasath@htic.iitm.ac.in	f	2025-10-13 10:16:06.616184+00	qzRgCTIyD2Jz
prasath@htic.iitm.ac.in	f	2025-10-13 10:16:13.122565+00	od3MiJNUtgTw
prasath@htic.iitm.ac.in	f	2025-10-13 10:16:13.164429+00	gwsbbJxqFoJc
prasath@htic.iitm.ac.in	f	2025-10-13 10:16:23.758741+00	FyYqrycYqUen
prasath@htic.iitm.ac.in	f	2025-10-13 10:16:23.787764+00	vkWFyFF0KIKp
prasath@htic.iitm.ac.in	f	2025-10-13 10:16:27.160266+00	uuxaipQxSlZG
prasath@htic.iitm.ac.in	f	2025-10-13 10:16:27.20099+00	fQ9OX8nusGt9
prasath@htic.iitm.ac.in	f	2025-10-13 10:16:28.691886+00	IgEQ2gudulkb
prasath@htic.iitm.ac.in	f	2025-10-13 10:16:28.721583+00	7SDH3qMyqOeW
prasath@htic.iitm.ac.in	f	2025-10-13 10:17:30.737262+00	AiaqATbcCspr
prasath@htic.iitm.ac.in	f	2025-10-13 10:17:30.763839+00	aqniGpHVlExI
prasath@htic.iitm.ac.in	f	2025-10-13 10:17:30.79219+00	PrhlG4LWAnry
prasath@htic.iitm.ac.in	f	2025-10-13 10:17:30.821268+00	z1xRH0agtoh7
prasath@htic.iitm.ac.in	f	2025-10-13 10:17:40.410564+00	Kfd5XAMKikqs
prasath@htic.iitm.ac.in	f	2025-10-13 10:17:40.438604+00	Te62cta5cVrY
prasath@htic.iitm.ac.in	f	2025-10-13 10:18:03.045413+00	im1AhyccXuCz
prasath@htic.iitm.ac.in	f	2025-10-13 10:18:03.075129+00	5CrNQzVbtVWh
prasath@htic.iitm.ac.in	f	2025-10-13 10:18:09.636447+00	9UO5GmGMx2r4
prasath@htic.iitm.ac.in	f	2025-10-13 10:18:09.664388+00	uCzPuQbbfUSw
prasath@htic.iitm.ac.in	f	2025-10-13 10:18:23.824265+00	8W5ldMfyxhDz
prasath@htic.iitm.ac.in	f	2025-10-13 10:18:23.854775+00	WkwbLv3wEvmu
prasath@htic.iitm.ac.in	f	2025-10-13 10:18:29.141016+00	q4qJ7Z91iyGH
prasath@htic.iitm.ac.in	f	2025-10-13 10:18:29.171889+00	b49g0iLi3WMR
prasath@htic.iitm.ac.in	f	2025-10-13 10:18:40.411864+00	Jx0YU9YtjwCv
prasath@htic.iitm.ac.in	f	2025-10-13 10:18:40.440723+00	2H2p6BcSpzMu
prasath@htic.iitm.ac.in	f	2025-10-13 10:20:52.427231+00	nHoJnoWuKmw1
prasath@htic.iitm.ac.in	f	2025-10-13 10:20:52.461756+00	ME9Zb1gYd2gk
prasath@htic.iitm.ac.in	f	2025-10-13 10:20:54.516296+00	tHfNF63qorz5
prasath@htic.iitm.ac.in	f	2025-10-13 10:20:54.552821+00	30QSkAvalOIh
prasath@htic.iitm.ac.in	f	2025-10-13 10:21:08.607585+00	ixD7K4ziNynu
prasath@htic.iitm.ac.in	f	2025-10-13 10:21:08.637731+00	QK1wub7zX7yz
prasath@htic.iitm.ac.in	f	2025-10-13 10:21:44.191064+00	Mn5aMKfKL85U
prasath@htic.iitm.ac.in	f	2025-10-13 10:21:44.225511+00	cnmf44IbWT3l
prasath@htic.iitm.ac.in	f	2025-10-13 10:21:45.872753+00	ZpcXhKJLLY7p
prasath@htic.iitm.ac.in	f	2025-10-13 10:21:45.917494+00	1O1nWfcEx4L8
prasath@htic.iitm.ac.in	f	2025-10-13 10:22:06.13436+00	XT89GPNEGLtd
prasath@htic.iitm.ac.in	f	2025-10-13 10:22:06.168095+00	K5T50RkODBnc
prasath@htic.iitm.ac.in	f	2025-10-13 10:22:40.682133+00	M9pJwbmNE9aS
prasath@htic.iitm.ac.in	f	2025-10-13 10:22:41.075473+00	33jdnZtFxauu
prasath@htic.iitm.ac.in	f	2025-10-13 10:22:41.295683+00	MQmzN61afOtJ
prasath@htic.iitm.ac.in	f	2025-10-13 10:22:41.517686+00	ytPmiKRE2hZQ
prasath@htic.iitm.ac.in	f	2025-10-13 10:22:41.737814+00	AiTozGAegaGp
prasath@htic.iitm.ac.in	f	2025-10-13 10:23:30.238956+00	QI4rhx3KlXDB
prasath@htic.iitm.ac.in	f	2025-10-13 10:23:30.459549+00	cU8PMFGnBYAJ
abc@abc.abc	f	2025-10-13 10:24:36.212182+00	n3rGUQ9luPWi
prasath@htic.iitm.ac.in	f	2025-10-13 10:25:39.359497+00	hpreu0ExEy2l
prasath@htic.iitm.ac.in	f	2025-10-13 10:25:39.931356+00	cDN5lFc6CyI5
prasath@htic.iitm.ac.in	f	2025-10-13 10:25:40.154072+00	qaC0VoMMg66N
prasath@htic.iitm.ac.in	f	2025-10-13 10:25:53.112468+00	pK6NHVXfVRg2
prasath@htic.iitm.ac.in	f	2025-10-13 10:25:53.33287+00	wGezvQ5gKE12
prasath@htic.iitm.ac.in	f	2025-10-13 10:26:06.023145+00	exbJGX5E1x27
prasath@htic.iitm.ac.in	f	2025-10-13 10:26:06.243459+00	XzaUn3FxHTNG
prasath@htic.iitm.ac.in	f	2025-10-13 10:26:27.633822+00	t6aZEcmTREHg
prasath@htic.iitm.ac.in	f	2025-10-13 10:27:59.122639+00	u4HeD8sBu21B
prasath@htic.iitm.ac.in	f	2025-10-13 10:28:08.080097+00	Bdy9Im1lqYLO
prasath@htic.iitm.ac.in	f	2025-10-13 10:28:45.241456+00	lbv5i019oNSD
prasath@htic.iitm.ac.in	f	2025-10-13 10:28:45.305909+00	Kvdp4LR6rh4D
prasath@htic.iitm.ac.in	f	2025-10-13 10:28:49.735951+00	6oqCDpO7oqOW
prasath@htic.iitm.ac.in	f	2025-10-13 10:28:49.76674+00	xIqKtpSUIl9e
prasath@htic.iitm.ac.in	f	2025-10-13 10:28:51.709342+00	55Sj2h2V6K33
prasath@htic.iitm.ac.in	f	2025-10-13 10:28:51.744972+00	6fFjXDxUtNIg
prasath@htic.iitm.ac.in	f	2025-10-13 10:29:20.24509+00	O6wOXhJjf1q4
prasath@htic.iitm.ac.in	f	2025-10-13 10:29:20.27202+00	Fbk7rRhDsnfJ
prasath@htic.iitm.ac.in	f	2025-10-13 10:29:47.6745+00	0zCqjXrvTt52
prasath@htic.iitm.ac.in	f	2025-10-13 10:29:47.704713+00	3pL2WBbwafyI
prasath@htic.iitm.ac.in	f	2025-10-13 10:29:50.170172+00	FXURTRvPk5cg
prasath@htic.iitm.ac.in	f	2025-10-13 10:29:50.200047+00	swImK1poWWKd
prasath@htic.iitm.ac.in	f	2025-10-13 10:31:22.758139+00	e4z3NHbAs3RE
prasath@htic.iitm.ac.in	f	2025-10-13 10:31:22.786696+00	OZoPrPa6QRyj
prasath@htic.iitm.ac.in	f	2025-10-13 10:31:27.41976+00	WfTthOjikv0w
prasath@htic.iitm.ac.in	f	2025-10-13 10:31:27.449089+00	iJBPl6I5i1wj
prasath@htic.iitm.ac.in	f	2025-10-13 10:31:32.336103+00	sWTXxfK3d7Fc
prasath@htic.iitm.ac.in	f	2025-10-13 10:31:32.36516+00	IP3ld01leWfA
abc@abc.abc	f	2025-10-13 10:32:13.376478+00	KNzJng4w7r9P
prasath@htic.iitm.ac.in	f	2025-10-13 10:33:23.654532+00	iuzyXCaOgEFq
prasath@htic.iitm.ac.in	f	2025-10-13 10:33:23.68601+00	82LFQD1KvEX4
abc@abc.abc	f	2025-10-13 10:33:56.413239+00	sIj7E9CgWSkf
abc@abc.abc	f	2025-10-13 10:34:25.552658+00	MUsjNu7Xgl9P
prasath@htic.iitm.ac.in	f	2025-10-13 10:35:06.741103+00	n4mbKfuyoElH
prasath@htic.iitm.ac.in	f	2025-10-13 10:35:06.774084+00	Tj7IaHLxOCzH
prasath@htic.iitm.ac.in	f	2025-10-13 10:35:08.573965+00	jPuqupaaFEaK
prasath@htic.iitm.ac.in	f	2025-10-13 10:35:08.609234+00	pXiYhiJNWWIv
abc@abc.abc	f	2025-10-13 10:44:52.999763+00	TMSPaUXEmYJD
abc@abc.abc	f	2025-10-13 10:54:48.767469+00	ci8DPqLm7xbJ
abc@abc.abc	f	2025-10-13 10:55:14.208127+00	aysVp8Gq7ya4
abc@abc.abc	f	2025-10-13 11:03:14.305117+00	F6WmlwwBF8js
abc@abc.abc	f	2025-10-13 11:04:01.688501+00	qT7BNyiRYYb8
abc@abc.abc	f	2025-10-13 11:06:14.694864+00	9PdffBjVt3Mx
abc@abc.abc	f	2025-10-13 11:07:11.116712+00	l8vE3jpmmzzv
abc@abc.abc	f	2025-10-13 11:07:20.853431+00	WtanjAz7vYnh
abc@abc.abc	f	2025-10-13 11:26:02.578203+00	o7dWdVTn5GRt
abc@abc.abc	f	2025-10-13 11:27:23.049869+00	lfKgCni7PqSL
abc@abc.abc	f	2025-10-13 11:27:53.138535+00	ByEnIOAbmjtQ
abc@abc.abc	f	2025-10-13 11:41:30.08061+00	F89iIEF5uttF
abc@abc.abc	f	2025-10-13 11:41:51.37625+00	rXTerFyzuWWF
abc@abc.abc	f	2025-10-14 05:17:16.464662+00	DnR7LiLbuh1H
abc@abc.abc	f	2025-10-14 05:27:19.540552+00	WfqdkSx5uak8
abc@abc.abc	f	2025-10-14 05:37:21.674503+00	idoJZuoxtZuN
abc@abc.abc	f	2025-10-14 05:41:22.813598+00	wQAZiHynUlw5
abc@abc.abc	f	2025-10-14 05:42:07.610821+00	9zlEDX31ppoU
prasath@htic.iitm.ac.in	f	2025-10-14 05:44:13.079448+00	Wvt8W6hj9Z83
prasath@htic.iitm.ac.in	f	2025-10-14 05:44:13.118601+00	9dsvEtKtqn6J
abc@abc.abc	f	2025-10-14 05:44:42.566308+00	c6G2q7SX0e5q
abc@abc.abc	f	2025-10-14 05:53:31.195661+00	GPnHEIIWc57O
abc@abc.abc	f	2025-10-14 05:54:20.167034+00	kkJnp8RrkIcw
abc@abc.abc	f	2025-10-14 06:02:49.666392+00	WoBuhMMVcHyH
prasath@htic.iitm.ac.in	f	2025-10-14 06:04:04.716959+00	PTVV8rVOp4uT
prasath@htic.iitm.ac.in	f	2025-10-14 06:04:04.75534+00	Ce8VIUZXYH6p
prasath@htic.iitm.ac.in	f	2025-10-14 06:04:06.795919+00	WbiVvrpythc7
prasath@htic.iitm.ac.in	f	2025-10-14 06:04:06.835225+00	rvrMx43fYqqj
prasath@htic.iitm.ac.in	f	2025-10-14 06:04:25.942891+00	4makAGXf7C7v
prasath@htic.iitm.ac.in	f	2025-10-14 06:04:25.994924+00	44dwm9ODqFKd
prasath@htic.iitm.ac.in	f	2025-10-14 06:07:20.407321+00	aVrjjNgnedCH
prasath@htic.iitm.ac.in	f	2025-10-14 06:07:20.448219+00	mUJpuK0WF8Mx
prasath@htic.iitm.ac.in	f	2025-10-14 06:07:54.360471+00	wHwbu39ZxrL7
prasath@htic.iitm.ac.in	f	2025-10-14 06:09:40.381993+00	jzQDXJe6LQPP
prasath@htic.iitm.ac.in	f	2025-10-14 06:09:40.426869+00	r0lMDiDbjFcw
prasath@htic.iitm.ac.in	f	2025-10-14 06:09:42.58046+00	tsH5CtvwFBYy
prasath@htic.iitm.ac.in	f	2025-10-14 06:09:42.619547+00	ewZSUx4nerwp
prasath@htic.iitm.ac.in	f	2025-10-14 06:10:03.456265+00	0uA0ctDWlW41
prasath@htic.iitm.ac.in	f	2025-10-14 06:10:03.50169+00	gJxEOZJOzaTh
abc@abc.abc	f	2025-10-14 06:12:52.958118+00	TJbjVjxANe7z
prasath@htic.iitm.ac.in	f	2025-10-14 06:43:44.197272+00	Z0jujvhDeiw7
prasath@htic.iitm.ac.in	f	2025-10-14 06:43:44.259449+00	1P7eMXInJIqV
prasath@htic.iitm.ac.in	f	2025-10-14 06:54:02.819618+00	CUySZfYstI7m
prasath@htic.iitm.ac.in	f	2025-10-14 06:54:02.85536+00	3KDF7CqS2Zui
abc@abc.abc	f	2025-10-14 06:56:51.430531+00	rjsMN5gtgU3P
abc@abc.abc	f	2025-10-14 06:57:52.559692+00	pQ6gmWhpQilp
abc@abc.abc	f	2025-10-14 07:01:05.105485+00	jTfvuGj0uRRu
abc@abc.abc	f	2025-10-14 07:02:48.456196+00	QqZLQ99ci4w8
abc@abc.abc	f	2025-10-14 07:10:30.768432+00	k3WLWGmnVrRu
abc@abc.abc	f	2025-10-14 07:13:44.839913+00	7f3gSSGASwnP
prasath@htic.iitm.ac.in	f	2025-10-14 08:57:45.119309+00	70uCT6lEyVDv
prasath@htic.iitm.ac.in	f	2025-10-14 08:57:45.168452+00	6v6R0GnIGoVL
prasath@htic.iitm.ac.in	f	2025-10-14 08:59:47.375649+00	VE8rChLJz3Sc
prasath@htic.iitm.ac.in	f	2025-10-14 08:59:47.410121+00	9OyoYOnvFZI3
prasath@htic.iitm.ac.in	f	2025-10-15 09:32:57.394144+00	vzV5z5GGg3TF
prasath@htic.iitm.ac.in	f	2025-10-15 09:32:57.525421+00	H2xzqtTyAzwW
prasath@htic.iitm.ac.in	f	2025-10-15 09:33:58.81578+00	iXxIKLXhh5kY
prasath@htic.iitm.ac.in	f	2025-10-15 09:33:58.888333+00	1oCVIvScUlrU
prasath@htic.iitm.ac.in	f	2025-10-15 10:14:38.471612+00	duMGqfVkg2Pf
prasath@htic.iitm.ac.in	f	2025-10-15 10:14:38.692547+00	Locj60LHGEce
prasath@htic.iitm.ac.in	f	2025-10-15 11:18:54.506155+00	IEMcWilwcA7B
prasath@htic.iitm.ac.in	f	2025-10-15 11:18:54.549789+00	dc1ScI7sDSYZ
prasath@htic.iitm.ac.in	f	2025-10-15 11:19:29.0476+00	aTzpo0w2diov
prasath@htic.iitm.ac.in	f	2025-10-15 11:19:29.091898+00	L5lA2x3T0n3w
prasath@htic.iitm.ac.in	f	2025-10-15 11:19:31.509618+00	jSear6zQzvd5
prasath@htic.iitm.ac.in	f	2025-10-15 11:19:31.540545+00	BpOvBUrGtgYa
prasath@htic.iitm.ac.in	f	2025-10-15 12:21:17.34477+00	vkoycsfFbidz
prasath@htic.iitm.ac.in	f	2025-10-15 12:21:17.387839+00	o3wHlRz1TD12
prasath@htic.iitm.ac.in	f	2025-10-15 12:25:02.159839+00	hSyg9f2EKhSe
prasath@htic.iitm.ac.in	f	2025-10-15 12:25:02.193644+00	bZh0ZJNpzkg2
prasath@htic.iitm.ac.in	f	2025-10-15 12:25:03.880341+00	AjbnslYIKyxi
prasath@htic.iitm.ac.in	f	2025-10-15 12:25:03.913736+00	MFA63bVqBXnA
prasath@htic.iitm.ac.in	f	2025-10-15 12:25:50.82485+00	sqZddNwTcUwQ
prasath@htic.iitm.ac.in	f	2025-10-15 12:25:50.856803+00	qUIaTlGB4Qe0
prasath@htic.iitm.ac.in	f	2025-10-15 16:55:43.831783+00	x5jQcqdqOqJW
prasath@htic.iitm.ac.in	f	2025-10-15 16:55:43.877918+00	sPEl3zBcFtjH
prasath@htic.iitm.ac.in	f	2025-10-15 17:00:17.237211+00	TDYndC5o91OV
prasath@htic.iitm.ac.in	f	2025-10-15 17:00:17.258079+00	S3dfarji4cmD
prasath@htic.iitm.ac.in	f	2025-10-16 14:31:22.118455+00	wspRWyreiO4P
prasath@htic.iitm.ac.in	f	2025-10-16 14:31:22.181628+00	I4leg7xduh3q
prasath@htic.iitm.ac.in	f	2025-10-17 10:54:42.459138+00	Nuc2KrSyjitW
prasath@htic.iitm.ac.in	f	2025-10-17 10:54:42.627069+00	7Cqq7R0O2WNV
prasath@htic.iitm.ac.in	f	2025-10-17 12:01:56.741205+00	wL8XZJyIaYkb
prasath@htic.iitm.ac.in	f	2025-10-17 12:01:56.784953+00	Z00Y3ej1o8Dv
prasath@htic.iitm.ac.in	f	2025-10-21 05:42:31.021542+00	STfOs447ACKd
prasath@htic.iitm.ac.in	f	2025-10-21 05:42:31.100385+00	Rv8pgL7OGvSK
prasath@htic.iitm.ac.in	f	2025-10-21 05:46:19.272862+00	KWoh5Ok5GtmV
prasath@htic.iitm.ac.in	f	2025-10-21 05:46:19.329879+00	JMPLxLOtFpKB
prasath@htic.iitm.ac.in	f	2025-10-21 06:03:58.801022+00	f6mQdvfZDT9Y
prasath@htic.iitm.ac.in	f	2025-10-21 06:03:58.864048+00	msicPSpBepeq
prasath@htic.iitm.ac.in	f	2025-10-21 06:56:57.511857+00	ieBvDamafYim
prasath@htic.iitm.ac.in	f	2025-10-21 06:56:57.578748+00	8BDTzNrZXrjo
prasath@htic.iitm.ac.in	f	2025-10-21 08:08:49.101404+00	EAMAVx69TWkg
prasath@htic.iitm.ac.in	f	2025-10-21 08:08:49.158589+00	7DZfuLBq4qVu
prasath@htic.iitm.ac.in	f	2025-10-21 09:57:07.121264+00	U0hFB7eQNBGk
prasath@htic.iitm.ac.in	f	2025-10-21 09:57:07.160838+00	s5TPsMZyY2rk
prasath@htic.iitm.ac.in	f	2025-10-21 10:52:54.333914+00	cAoiuGxHobpk
prasath@htic.iitm.ac.in	f	2025-10-21 10:52:54.376223+00	RuQkVC6N1t8f
prasath@htic.iitm.ac.in	f	2025-10-21 11:04:25.475402+00	9gFT5CuglqwB
prasath@htic.iitm.ac.in	f	2025-10-21 11:04:25.528766+00	TUQQnOqK37my
prasath@htic.iitm.ac.in	f	2025-10-21 11:08:29.897003+00	NxbQYvlLmpqE
prasath@htic.iitm.ac.in	f	2025-10-21 11:08:29.93295+00	03iGfgRNoC4V
prasath@htic.iitm.ac.in	f	2025-10-21 11:10:20.567951+00	jKgwta3r0UJY
prasath@htic.iitm.ac.in	f	2025-10-21 11:10:20.601964+00	3JOgfOK3NSJg
prasath@htic.iitm.ac.in	f	2025-10-21 11:17:27.497933+00	msEC2XzrEsLe
prasath@htic.iitm.ac.in	f	2025-10-21 11:17:27.54161+00	hrYe0gF5UoIZ
prasath@htic.iitm.ac.in	f	2025-10-22 06:51:54.538325+00	FyZ0IEV3VYAz
prasath@htic.iitm.ac.in	f	2025-10-22 06:51:54.601488+00	n5jj0tjJ7c8C
prasath@htic.iitm.ac.in	f	2025-10-22 06:59:21.215421+00	0NEHnVcziTd6
prasath@htic.iitm.ac.in	f	2025-10-22 06:59:21.237877+00	xJ40wTHGGs0Z
prasath@htic.iitm.ac.in	f	2025-10-22 07:00:16.722412+00	9DDljYvDp7RS
prasath@htic.iitm.ac.in	f	2025-10-22 07:00:16.785971+00	xh2iQInLI2Kx
prasath@htic.iitm.ac.in	f	2025-10-22 07:41:20.120298+00	0FQrI9HAcJO7
prasath@htic.iitm.ac.in	f	2025-10-22 07:41:20.348682+00	tZLUkKIVi1gl
prasath@htic.iitm.ac.in	f	2025-10-22 09:39:21.946844+00	TL3hcMizXzTK
prasath@htic.iitm.ac.in	f	2025-10-22 09:39:21.974031+00	VhGLVDumtARh
prasath@htic.iitm.ac.in	f	2025-10-22 10:46:31.263688+00	brRv9qsTYbRq
prasath@htic.iitm.ac.in	f	2025-10-22 10:46:31.423194+00	fyfjjskFjcoO
prasath@htic.iitm.ac.in	f	2025-10-23 06:51:15.723553+00	4xgb35TSmhNi
prasath@htic.iitm.ac.in	f	2025-10-23 06:51:15.773344+00	tHllZsIwk3wz
prasath@htic.iitm.ac.in	f	2025-10-23 06:59:38.70712+00	Bzay4BknwGnL
prasath@htic.iitm.ac.in	f	2025-10-23 06:59:38.733347+00	sa61jpfLGVeY
prasath@htic.iitm.ac.in	f	2025-10-23 10:12:34.170643+00	fIujggo7whpQ
prasath@htic.iitm.ac.in	f	2025-10-23 10:12:34.208073+00	HeRzg8Rl1juT
prasath@htic.iitm.ac.in	f	2025-10-23 10:22:32.51426+00	q66eHwUyqPMW
prasath@htic.iitm.ac.in	f	2025-10-23 10:22:32.55134+00	HSf2AsSzxEZA
prasath@htic.iitm.ac.in	f	2025-10-23 10:22:50.675954+00	DHCwH8C2n1o7
prasath@htic.iitm.ac.in	f	2025-10-23 10:22:50.708611+00	U0bQiQT3Nazo
prasath@htic.iitm.ac.in	f	2025-10-23 10:55:21.612184+00	v02BNiuGOrQl
prasath@htic.iitm.ac.in	f	2025-10-23 10:55:21.650888+00	xx9rzQr1Smk9
prasath@htic.iitm.ac.in	f	2025-10-23 11:12:39.308845+00	lvDvZfsQ6O93
prasath@htic.iitm.ac.in	f	2025-10-23 11:12:39.351125+00	NAuxQ3fSAy14
prasath@htic.iitm.ac.in	f	2025-10-23 11:15:46.654661+00	8dieUW0Tl8mL
prasath@htic.iitm.ac.in	f	2025-10-23 11:15:46.739015+00	UR5TbvkMZmEy
prasath@htic.iitm.ac.in	f	2025-10-24 05:37:16.20607+00	lFPtmUmctUQR
prasath@htic.iitm.ac.in	f	2025-10-24 05:39:28.252211+00	jBWthT5YlTyY
prasath@htic.iitm.ac.in	f	2025-10-24 05:39:35.823147+00	9tgfISwkrUNb
prasath@htic.iitm.ac.in	f	2025-10-24 07:44:21.551942+00	AsFRTG8xabpS
prasath@htic.iitm.ac.in	f	2025-10-24 07:44:21.592084+00	9IVREHXb6SVD
prasath@htic.iitm.ac.in	f	2025-10-24 07:50:07.470094+00	4dpK52JuPb67
prasath@htic.iitm.ac.in	f	2025-10-24 07:50:07.499559+00	WY8TWsmmu2D8
prasath@htic.iitm.ac.in	f	2025-10-24 08:01:57.151149+00	wCJ2AQPCPiaY
prasath@htic.iitm.ac.in	f	2025-10-24 08:01:57.185563+00	iwpyMnEAPWjQ
prasath@htic.iitm.ac.in	f	2025-10-26 07:42:25.053004+00	K44bjV6kEYFc
prasath@htic.iitm.ac.in	f	2025-10-26 11:32:05.450527+00	PyRXMHF7fmb5
prasath@htic.iitm.ac.in	f	2025-10-26 11:32:05.51479+00	EYgnnF9D4gBd
prasath@htic.iitm.ac.in	f	2025-10-26 17:18:40.670759+00	k6zF1ryCfcSa
prasath@htic.iitm.ac.in	f	2025-10-26 17:23:09.720255+00	Ho7OXHBR6yec
prasath@htic.iitm.ac.in	f	2025-10-26 17:41:38.717112+00	7wnoJWzq5K9v
prasath@htic.iitm.ac.in	f	2025-10-26 17:41:38.973994+00	qXZbkthlwTRq
prasath@htic.iitm.ac.in	f	2025-10-27 06:57:16.214926+00	KKFyaKiECuSf
prasath@htic.iitm.ac.in	f	2025-10-27 06:57:16.278826+00	nEflDKtVEcVg
\.


--
-- Data for Name: submod_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.submod_data (module_id, submod_id, created_at, submod_name) FROM stdin;
\.


--
-- Data for Name: targeted_learning; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.targeted_learning (target_learning_id, tar_name, curiculum_id, chapter_id, modules_id, resources_id, created_at, start_date, end_date, course_id, trainee_id) FROM stdin;
76c29438-9783-4295-b8a2-a728634af593	dfghjk	5860cba0-c994-4ebb-bf2f-5f3141d6e752	0de1cf27-5fb8-4168-968b-d415f1f46cb1	{9e8828a9-d9c4-4f9c-895e-93e954012d80}	{92f817e5-643d-4fe0-8071-cc963b65a688,be882026-70f8-4fd7-b97b-1be181736eb1}	2025-10-10 12:31:44.534677+00	2025-10-21T18:30:00.000Z	2025-10-28T18:30:00.000Z	c081843a-d258-4223-8306-15cede84375f	{vish@htic.iitm.ac.in}
b9c9d471-8641-418a-9ecf-5cf69b43d114	Number 2	5860cba0-c994-4ebb-bf2f-5f3141d6e752	0de1cf27-5fb8-4168-968b-d415f1f46cb1	{40fdfae3-7884-4e5e-8c68-c206b2183c5b,9e8828a9-d9c4-4f9c-895e-93e954012d80}	{f2ffd1a5-dedc-4d3f-8e25-e619fc76fe10,92f817e5-643d-4fe0-8071-cc963b65a688,aa661d7b-e521-4b2b-acf7-373cabba6530}	2025-10-10 15:20:06.18616+00	2025-10-28T18:30:00.000Z	2025-10-29T18:30:00.000Z	c081843a-d258-4223-8306-15cede84375f	{test@test.cin,tr1@gmail.com,person@test.co.in}
20281bb6-3ee0-42d5-8143-66d877185678	Custom Training 1	5860cba0-c994-4ebb-bf2f-5f3141d6e752	fbf5152c-aa14-4414-a2db-22b12d058711	{e04ab260-4d2d-41be-9c07-fdef1607b1c8}	{3d265721-0066-48f9-ae09-dbb26a7377eb}	2025-10-26 08:40:55.496595+00	2025-10-26T18:30:00.000Z	2025-10-30T18:30:00.000Z	c081843a-d258-4223-8306-15cede84375f	{kavin@gmail.com,rohinth@gmail.com,shah@gmail.com}
8886a1c2-b617-4f0c-98cc-0471da65c89a	Custom Training 1	5860cba0-c994-4ebb-bf2f-5f3141d6e752	0de1cf27-5fb8-4168-968b-d415f1f46cb1	{9e8828a9-d9c4-4f9c-895e-93e954012d80}	{92f817e5-643d-4fe0-8071-cc963b65a688,e39f6609-0a09-42bb-8195-2b22a1c44eab}	2025-10-26 08:43:32.402772+00	2025-10-27T18:30:00.000Z	2025-10-29T18:30:00.000Z	c081843a-d258-4223-8306-15cede84375f	{abiya@gmail.com,dharani@gmail.com,kamal@gmail.com}
\.


--
-- Data for Name: user_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_data (user_profile_photo, user_name, user_email, user_contact_num, user_dob, user_gender, user_password, user_role, created_at, status, description, people_id) FROM stdin;
trainee_images/Dharani.jpg	Dharani	dharani@gmail.com	7851496325	2025-10-28	female	$2b$10$SwLj5qgVL258RrGO2j3XCuxEEpZNsOnDcV5uNsWcMRACR9wedARz2	103	2025-10-22 09:34:43.976402	active		43921b1f-1cca-4df5-853d-6491b9317ecc
trainee_images/Rokesh Maran.jpeg	Rokesh	rokesh@gmail.com	6235874915	2025-10-29	male	$2b$10$zDH3o28EfoNv4ai.qZSXJukGkihGQIDBcbqsjAR4A2FeKk5knuceC	103	2025-10-22 09:35:36.348946	active		4571bd39-80b8-476d-80b2-47d12c79980d
trainee_images/rohinth.png	Rohinth	rohinth@gmail.com	5632874196	2025-10-30	male	$2b$10$E1Zr2VFb0yJbXd15Mot3PO/XIwdwAaR9BAWZYyvTq6d6dtFwJQ5ee	103	2025-10-22 09:37:51.70404	active		b6baabec-3423-4131-8e6f-f59494f397c2
trainee_images/Abiya.jpg	Abiya	abiya@gmail.com	6238954173	2025-10-31	female	$2b$10$xS/3N4Xeq9Uw7GDOT3PzDube6irG8cFbt/bUZlkWJIrPdO02/dtz6	103	2025-10-22 09:38:44.416962	active		ffe5c81a-aff5-409b-b5b8-2c9f0f3b2fdc
-	Prasath Narayanan	prasath@htic.iitm.ac.in	9962383309	2001-03-28	male	$2b$10$aH7WDNUDHOib0IbYbpbs.evz4hSXkH1B.ni8quKVWzDhdTi8xwG7C	101	2025-07-22 23:44:16	active	Admin	8ec2c5e8-0302-411f-baa8-89fdd591022e
\N	Narayanan	nara@gmail.com	8015849524	2025-08-02	male	$2b$10$aH7WDNUDHOib0IbYbpbs.evz4hSXkH1B.ni8quKVWzDhdTi8xwG7C	99	2025-08-02 07:30:09.929835	active		5ecdd635-f61c-43cb-9d3d-fabf5d225024
trainee_images/Aparna.jpeg	Aparna	aparna@gmail.com	8529637415	2025-10-22	female	$2b$10$.03Ct3V/imLHG/oEmrTQye0sokmCGf/PyZtGPq5hAkGeXThy6HvRK	102	2025-10-22 09:11:44.295639	active		e565d93c-8e59-4c5d-8d26-524a0762b0af
trainee_images/AkilSenthil.jpg	Akil	akil@gmail.com	7418529635	2025-10-23	male	$2b$10$ZWs8szpEg0wAgumR3mxQ1uJYUwLa6W2jnDlz8OcWQhsvRmo4zabsu	102	2025-10-22 09:12:47.383905	active		f5784767-2b75-44b6-bc58-a0a67e3ccc28
trainee_images/vasu.png	Vasudevan	vasu@gmail.com	9638527415	2025-10-24	male	$2b$10$dmfjVsqV89nH0tq5.llEpe8fvaWkUdKqroJ2IGxy4JuRXs9B0MngC	103	2025-10-22 09:16:16.89714	active		74c8a43d-e80f-4b7f-ba49-c81f91b813bb
trainee_images/Kavin Vignesh B.jpeg	Kavin	kavin@gmail.com	8974563156	2025-10-25	male	$2b$10$WadTsOimeVMwSn0VWU/gTehAjHyfjFvOIj1LGG0jNzdJEFLXsbtri	103	2025-10-22 09:17:05.632131	active		4ef474a4-3dd3-4d35-bfdf-40039b8a5be9
trainee_images/Kamalesh.jpg	Kamalesh	kamal@gmail.com	6543218569	2025-10-26	male	$2b$10$6K2.0vMT/WB7tdbiEVSx0.5EOyU2WnRKfUpRDGHX6XgJKDCfakVsy	103	2025-10-22 09:32:47.855158	active		ad7b31b6-4bd6-48dd-bc50-b8598208ff51
trainee_images/shahinshabinnasir.jpg	Shahinsha	shah@gmail.com	8495162375	2025-10-27	male	$2b$10$RsbSnVoEgDUNTALzZlLC6ukzvWR5vb/hjzgZzvHEHs.UALcQVfIIi	103	2025-10-22 09:33:44.544938	active		545fc661-f45d-4c60-bb6c-e8f61cb398ae
\.


--
-- Data for Name: messages_2025_10_23; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2025_10_23 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2025_10_24; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2025_10_24 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2025_10_25; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2025_10_25 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2025_10_26; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2025_10_26 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2025_10_27; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2025_10_27 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2025_10_28; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2025_10_28 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2025_10_29; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2025_10_29 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2025_10_30; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2025_10_30 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-07-11 06:22:53
20211116045059	2025-07-11 06:22:54
20211116050929	2025-07-11 06:22:55
20211116051442	2025-07-11 06:22:56
20211116212300	2025-07-11 06:22:56
20211116213355	2025-07-11 06:22:57
20211116213934	2025-07-11 06:22:58
20211116214523	2025-07-11 06:22:58
20211122062447	2025-07-11 06:22:59
20211124070109	2025-07-11 06:23:00
20211202204204	2025-07-11 06:23:00
20211202204605	2025-07-11 06:23:01
20211210212804	2025-07-11 06:23:03
20211228014915	2025-07-11 06:23:04
20220107221237	2025-07-11 06:23:04
20220228202821	2025-07-11 06:23:05
20220312004840	2025-07-11 06:23:05
20220603231003	2025-07-11 06:23:06
20220603232444	2025-07-11 06:23:07
20220615214548	2025-07-11 06:23:08
20220712093339	2025-07-11 06:23:08
20220908172859	2025-07-11 06:23:09
20220916233421	2025-07-11 06:23:10
20230119133233	2025-07-11 06:23:10
20230128025114	2025-07-11 06:23:11
20230128025212	2025-07-11 06:23:12
20230227211149	2025-07-11 06:23:12
20230228184745	2025-07-11 06:23:13
20230308225145	2025-07-11 06:23:14
20230328144023	2025-07-11 06:23:14
20231018144023	2025-07-11 06:23:15
20231204144023	2025-07-11 06:23:16
20231204144024	2025-07-11 06:23:17
20231204144025	2025-07-11 06:23:17
20240108234812	2025-07-11 06:23:18
20240109165339	2025-07-11 06:23:19
20240227174441	2025-07-11 06:23:20
20240311171622	2025-07-11 06:23:21
20240321100241	2025-07-11 06:23:22
20240401105812	2025-07-11 06:23:24
20240418121054	2025-07-11 06:23:25
20240523004032	2025-07-11 06:23:27
20240618124746	2025-07-11 06:23:27
20240801235015	2025-07-11 06:23:28
20240805133720	2025-07-11 06:23:29
20240827160934	2025-07-11 06:23:29
20240919163303	2025-07-11 06:23:30
20240919163305	2025-07-11 06:23:31
20241019105805	2025-07-11 06:23:31
20241030150047	2025-07-11 06:23:34
20241108114728	2025-07-11 06:23:35
20241121104152	2025-07-11 06:23:35
20241130184212	2025-07-11 06:23:36
20241220035512	2025-07-11 06:23:37
20241220123912	2025-07-11 06:23:37
20241224161212	2025-07-11 06:23:38
20250107150512	2025-07-11 06:23:39
20250110162412	2025-07-11 06:23:39
20250123174212	2025-07-11 06:23:40
20250128220012	2025-07-11 06:23:40
20250506224012	2025-07-11 06:23:41
20250523164012	2025-07-11 06:23:42
20250714121412	2025-07-18 12:11:49
20250905041441	2025-09-25 07:41:53
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
projectanu	projectanu	\N	2025-07-14 10:28:45.659725+00	2025-07-14 10:28:45.659725+00	t	f	\N	\N	\N	STANDARD
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (id, type, format, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-07-11 06:22:53.102087
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-07-11 06:22:53.137838
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-07-11 06:22:53.151478
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-07-11 06:22:53.183021
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-07-11 06:22:53.200929
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-07-11 06:22:53.228261
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-07-11 06:22:53.242207
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-07-11 06:22:53.250546
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-07-11 06:22:53.279932
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-07-11 06:22:53.288827
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-07-11 06:22:53.297796
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-07-11 06:22:53.306298
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-07-11 06:22:53.31715
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-07-11 06:22:53.325513
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-07-11 06:22:53.338068
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-07-11 06:22:53.376131
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-07-11 06:22:53.39511
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-07-11 06:22:53.40643
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-07-11 06:22:53.416463
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-07-11 06:22:53.431379
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-07-11 06:22:53.455206
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-07-11 06:22:53.464773
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-07-11 06:22:53.481283
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-07-11 06:22:53.496692
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-07-11 06:22:53.517984
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-07-11 06:22:53.529583
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2025-08-26 18:03:06.87232
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2025-08-26 18:03:07.972752
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2025-08-26 18:03:08.971442
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2025-08-26 18:03:09.171377
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2025-08-26 18:03:09.274765
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2025-08-26 18:03:09.364734
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2025-08-26 18:03:09.380752
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2025-08-26 18:03:09.570179
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2025-08-26 18:03:09.664706
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2025-08-26 18:03:09.875418
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2025-08-26 18:03:10.06738
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-08-26 18:03:10.273113
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2025-08-26 18:03:10.573861
39	add-search-v2-sort-support	39cf7d1e6bf515f4b02e41237aba845a7b492853	2025-09-25 10:04:09.581157
40	fix-prefix-race-conditions-optimized	fd02297e1c67df25a9fc110bf8c8a9af7fb06d1f	2025-09-25 10:04:09.602454
41	add-object-level-update-trigger	44c22478bf01744b2129efc480cd2edc9a7d60e9	2025-09-25 10:04:09.62013
42	rollback-prefix-triggers	f2ab4f526ab7f979541082992593938c05ee4b47	2025-09-25 10:04:09.62651
43	fix-object-level	ab837ad8f1c7d00cc0b7310e989a23388ff29fc6	2025-09-25 10:04:09.63197
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) FROM stdin;
e78afb84-b5a7-4d7b-9b00-754619165662	projectanu	trainee_images/download.png	\N	2025-09-20 09:28:36.638257+00	2025-09-20 10:05:16.02688+00	2025-09-20 09:28:36.638257+00	{"eTag": "\\"5c3eb340fd85409a8f2c03cbcf4a8d76\\"", "size": 941398, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-20T10:05:16.000Z", "contentLength": 941398, "httpStatusCode": 200}	863d4f54-1e25-49d1-84b1-86ec53cdf3d9	\N	{}	2
2e90cfbd-f8f1-4178-b418-66ac4174bb16	projectanu	trainee_images/vasu.png	\N	2025-10-22 09:16:16.381875+00	2025-10-22 09:16:16.381875+00	2025-10-22 09:16:16.381875+00	{"eTag": "\\"669624249189d9c656babf10722b7174\\"", "size": 24937, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-10-22T09:16:17.000Z", "contentLength": 24937, "httpStatusCode": 200}	a761dc44-bf2d-4f08-a99b-9cce23d1d6d1	\N	{}	2
8647bf7d-79a6-4a2c-bf91-095ed918f8f4	projectanu	trainee_images/Kavin Vignesh B.jpeg	\N	2025-10-22 09:17:05.477898+00	2025-10-22 09:17:05.477898+00	2025-10-22 09:17:05.477898+00	{"eTag": "\\"40db432ce4c4f22a724f42ad4311912d\\"", "size": 783086, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-10-22T09:17:06.000Z", "contentLength": 783086, "httpStatusCode": 200}	81e1658a-bfe6-4144-9cc4-42db2ae63458	\N	{}	2
9fecded9-ced6-498f-b17d-cf39b8e2f88e	projectanu	trainee_images/ins 1.png	\N	2025-10-04 05:57:08.004037+00	2025-10-04 05:58:20.317002+00	2025-10-04 05:57:08.004037+00	{"eTag": "\\"62a916bb7fea47d2981a2c091b3bb30a\\"", "size": 27848, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-10-04T05:58:21.000Z", "contentLength": 27848, "httpStatusCode": 200}	2ceef352-7435-43c8-ad67-ccc7fdb3d2a9	\N	{}	2
375b2c76-d7c2-463f-b500-2ea455cdbf47	projectanu	trainee_images/ins 2.png	\N	2025-10-04 06:00:21.617522+00	2025-10-04 06:00:21.617522+00	2025-10-04 06:00:21.617522+00	{"eTag": "\\"a2d55d066c08fdb8525a20948ce17d39\\"", "size": 24499, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-10-04T06:00:22.000Z", "contentLength": 24499, "httpStatusCode": 200}	803e25af-ca87-4e20-9cf9-ff9625ca8364	\N	{}	2
f89e045e-a47d-472c-9da9-5cd3813fea40	projectanu	trainee_images/Prasath_Narayanan_Photo.jpg	\N	2025-10-07 04:12:25.049992+00	2025-10-07 04:12:25.049992+00	2025-10-07 04:12:25.049992+00	{"eTag": "\\"eb7c4ac28f93184644f32203df858fdb\\"", "size": 24267, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-10-07T04:12:26.000Z", "contentLength": 24267, "httpStatusCode": 200}	1a7105f4-69bc-4f2c-88d0-e05e0c42553f	\N	{}	2
9dc6e052-b988-4a32-83c2-ecb0849d64c3	projectanu	trainee_images/Dharani.jpg	\N	2025-10-22 09:34:43.849229+00	2025-10-22 09:34:43.849229+00	2025-10-22 09:34:43.849229+00	{"eTag": "\\"af381d0b0d913f4357d0e46fa9fd3e22\\"", "size": 280222, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-10-22T09:34:44.000Z", "contentLength": 280222, "httpStatusCode": 200}	00778b18-829f-43d0-b7cc-ae8bb8276682	\N	{}	2
243b7b80-f247-4559-875f-71135630a479	projectanu	trainee_images/Rokesh Maran.jpeg	\N	2025-10-22 09:35:36.235163+00	2025-10-22 09:35:36.235163+00	2025-10-22 09:35:36.235163+00	{"eTag": "\\"63b10e872dff604b0a3c9d9d0c65f88b\\"", "size": 357735, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-10-22T09:35:37.000Z", "contentLength": 357735, "httpStatusCode": 200}	fd424d59-a9c8-4b0d-86d4-da5e8c906f95	\N	{}	2
3049fd0a-9d7d-474d-82b7-76881a4719c4	projectanu	trainee_images/rohinth.png	\N	2025-10-22 09:37:51.586192+00	2025-10-22 09:37:51.586192+00	2025-10-22 09:37:51.586192+00	{"eTag": "\\"d2a1e37ffbc379ff73f2064088829058\\"", "size": 385458, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-10-22T09:37:52.000Z", "contentLength": 385458, "httpStatusCode": 200}	c87926db-81ad-4314-aaaa-8cdf24b9dd8c	\N	{}	2
ac046fef-f549-4467-873c-c3112b3182e5	projectanu	trainee_images/Abiya.jpg	\N	2025-10-22 09:38:44.306961+00	2025-10-22 09:38:44.306961+00	2025-10-22 09:38:44.306961+00	{"eTag": "\\"7a62f8d22b8b3a6650e823bec21344f9\\"", "size": 286203, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-10-22T09:38:45.000Z", "contentLength": 286203, "httpStatusCode": 200}	15908737-8b9d-41de-a5ae-0f1012d54667	\N	{}	2
a33b917a-9e7f-4a88-8388-c129a677a35a	projectanu	trainee_images/.emptyFolderPlaceholder	\N	2025-07-21 10:28:49.919234+00	2025-08-26 18:03:09.177132+00	2025-07-21 10:28:49.919234+00	{"eTag": "\\"d41d8cd98f00b204e9800998ecf8427e\\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2025-07-21T10:28:50.000Z", "contentLength": 0, "httpStatusCode": 200}	58394670-5509-4e64-8f56-a98ef3ae4e1d	\N	{}	2
a7ed9f3c-24eb-42ae-bcca-0bf3cea7d65b	projectanu	trainee_images/Aparna_img.jpeg	\N	2025-07-24 12:20:59.598018+00	2025-08-26 18:03:09.177132+00	2025-07-24 12:20:59.598018+00	{"eTag": "\\"a010d52b407b48acfe320ff2b918cee2\\"", "size": 327278, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-07-24T12:21:00.000Z", "contentLength": 327278, "httpStatusCode": 200}	f482979e-5d56-4c00-a739-4b023c26dbfa	\N	{}	2
feefcfc9-77f0-47f4-a6f8-64dbb9f64b20	projectanu	trainee_images/Screenshot 2025-07-04 115801.png	\N	2025-07-24 11:40:30.50401+00	2025-08-26 18:03:09.177132+00	2025-07-24 11:40:30.50401+00	{"eTag": "\\"408b2974c61444af61a5734ead1b166c\\"", "size": 83380, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-07-24T11:43:30.000Z", "contentLength": 83380, "httpStatusCode": 200}	5355f33d-5a5c-4989-a6ce-6318c62bb01f	\N	{}	2
3d0c899b-6276-4bf5-94d6-59c0091c6df8	projectanu	trainee_images/Screenshot 2025-07-17 225339.png	\N	2025-07-24 11:47:16.068277+00	2025-08-26 18:03:09.177132+00	2025-07-24 11:47:16.068277+00	{"eTag": "\\"7b1d869a27f903bfbe05fbb72fb167c3\\"", "size": 59575, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-07-24T11:47:16.000Z", "contentLength": 59575, "httpStatusCode": 200}	9af8abec-dbf2-44cd-8775-6206391e2d3e	\N	{}	2
831d23de-472d-458e-9ab2-8d369be251e3	projectanu	trainee_images/Screenshot 2025-07-17 211626.png	\N	2025-07-23 12:24:14.875982+00	2025-08-26 18:03:09.177132+00	2025-07-23 12:24:14.875982+00	{"eTag": "\\"da2f1930110849005e8a79436483774a\\"", "size": 65294, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-08-11T12:44:36.000Z", "contentLength": 65294, "httpStatusCode": 200}	4a4a563c-38b1-423e-9c17-12e100d55e51	\N	{}	2
bf4bf316-4f1a-4099-bd2a-e74bfcdbff14	projectanu	trainee_images/36012182.jpg	\N	2025-07-24 12:24:53.13316+00	2025-08-26 18:03:09.177132+00	2025-07-24 12:24:53.13316+00	{"eTag": "\\"0a83c476af3af2baf888a5eada799b17\\"", "size": 185117, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-07-24T12:24:54.000Z", "contentLength": 185117, "httpStatusCode": 200}	865d8c28-979c-4d75-a901-d10023e52eed	\N	{}	2
feda1ec4-9b2e-488f-b95a-2d9c3de68477	projectanu	trainee_images/srk.jpg	\N	2025-07-24 12:04:09.299489+00	2025-08-26 18:03:09.177132+00	2025-07-24 12:04:09.299489+00	{"eTag": "\\"b5f33a99eb412eec979d3a9d76a66d9f\\"", "size": 148411, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-07-24T12:05:04.000Z", "contentLength": 148411, "httpStatusCode": 200}	c37757e6-8dda-45fc-b0d9-ee7ee4612671	\N	{}	2
613a07d9-f314-4a36-9772-9ce94b076910	projectanu	trainee_images/Screenshot 2025-07-25 002145.png	\N	2025-08-05 10:00:24.870572+00	2025-08-26 18:03:09.177132+00	2025-08-05 10:00:24.870572+00	{"eTag": "\\"dd4e4f6eaae269a2a1e4ef00f839fef5\\"", "size": 56293, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-08-11T10:38:16.000Z", "contentLength": 56293, "httpStatusCode": 200}	46a83fbd-9f0c-47c4-8c18-9ae459de08ec	\N	{}	2
cb988d53-f860-498c-af52-c02bd32df44a	projectanu	trainee_images/image (3).png	\N	2025-07-31 07:55:16.363815+00	2025-08-26 18:03:09.177132+00	2025-07-31 07:55:16.363815+00	{"eTag": "\\"23e10c85263b926c06c4339e62bc2d76\\"", "size": 89955, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-08-01T11:09:55.000Z", "contentLength": 89955, "httpStatusCode": 200}	f0bec32a-ee81-41eb-ae80-a8df591f5cbb	\N	{}	2
464e1f2b-3fad-444d-92b2-3629e8ef8365	projectanu	trainee_images/WhatsApp Image 2025-07-25 at 11.29.10 PM.jpeg	\N	2025-08-02 09:55:18.12624+00	2025-08-26 18:03:09.177132+00	2025-08-02 09:55:18.12624+00	{"eTag": "\\"16788568035934af727b76cc23796fbf\\"", "size": 144471, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-02T09:55:19.000Z", "contentLength": 144471, "httpStatusCode": 200}	774a8013-c919-4452-87be-3dcd4b488dad	\N	{}	2
de9c6625-99a3-4e20-a8cb-4eae9f0cb4f3	projectanu	trainee_images/Screenshot 2025-07-24 114716.png	\N	2025-07-24 11:55:24.925022+00	2025-08-26 18:03:09.177132+00	2025-07-24 11:55:24.925022+00	{"eTag": "\\"48c12aac2713ea7ceb59750f2f4a242a\\"", "size": 48040, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-08-11T12:45:37.000Z", "contentLength": 48040, "httpStatusCode": 200}	0705f5e1-0b9a-4d26-92ba-7fc882e44dac	\N	{}	2
d58d610f-7a7d-4f6b-9694-7c7055269294	projectanu	trainee_images/Screenshot 2025-06-27 142644.png	\N	2025-07-23 11:39:23.295128+00	2025-09-02 06:01:51.906814+00	2025-07-23 11:39:23.295128+00	{"eTag": "\\"49e796274fc74d6adfd118320772c888\\"", "size": 168427, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-02T06:01:52.000Z", "contentLength": 168427, "httpStatusCode": 200}	3f3e560b-38e5-4ae0-957a-a11046836889	\N	{}	2
bfe7c120-07a1-4c5a-b2a9-782a0ad42bfc	projectanu	trainee_images/Screenshot 2025-06-26 111401.png	\N	2025-09-01 05:41:36.783753+00	2025-09-01 05:41:36.783753+00	2025-09-01 05:41:36.783753+00	{"eTag": "\\"f82c6c4470105697ac51812cb15f4b16\\"", "size": 469501, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-01T05:41:37.000Z", "contentLength": 469501, "httpStatusCode": 200}	426079e9-bada-46c8-a75a-592e0e668a49	\N	{}	2
bd7d10a8-4cea-4df4-b789-f5d010322b33	projectanu	trainee_images/Screenshot 2025-09-02 121144.png	\N	2025-10-03 09:45:49.483259+00	2025-10-03 09:45:49.483259+00	2025-10-03 09:45:49.483259+00	{"eTag": "\\"ec851c24702d2fec64be19334656a9c3\\"", "size": 59211, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-10-03T09:45:50.000Z", "contentLength": 59211, "httpStatusCode": 200}	d3755f39-f27b-4e2e-8264-ba2601e2e7c6	\N	{}	2
5569f44c-d859-4e6f-b90d-e260c18aa646	projectanu	trainee_images/AkilSenthil.jpg	\N	2025-10-22 09:12:46.274096+00	2025-10-22 09:12:46.274096+00	2025-10-22 09:12:46.274096+00	{"eTag": "\\"4590d6fbe5158e7bc283728841341856\\"", "size": 846170, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-10-22T09:12:47.000Z", "contentLength": 846170, "httpStatusCode": 200}	254c9722-7811-401c-b3f6-2d1f6a7ba33a	\N	{}	2
fd93423a-7ed4-43ec-bb72-bf7d03330440	projectanu	trainee_images/trainee 1.png	\N	2025-10-04 06:02:41.963544+00	2025-10-04 06:02:41.963544+00	2025-10-04 06:02:41.963544+00	{"eTag": "\\"2df60e3c68b471712663f5952814a438\\"", "size": 22046, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-10-04T06:02:42.000Z", "contentLength": 22046, "httpStatusCode": 200}	4f040cc2-d867-477f-8cc3-0417735e6ea8	\N	{}	2
709b207b-8f2a-4f17-a60d-fde4face3ab7	projectanu	trainee_images/Aparna.jpeg	\N	2025-10-22 09:11:43.585737+00	2025-10-22 09:11:43.585737+00	2025-10-22 09:11:43.585737+00	{"eTag": "\\"1387d8f5cd400c4cfcb35a85c40c6c70\\"", "size": 127258, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-10-22T09:11:44.000Z", "contentLength": 127258, "httpStatusCode": 200}	871ca707-79b5-4ce9-b277-3578e3c9e4f7	\N	{}	2
5a8ffb3d-9b5e-4db2-8af8-f8e6c67c7f00	projectanu	trainee_images/Kamalesh.jpg	\N	2025-10-22 09:32:47.743202+00	2025-10-22 09:32:47.743202+00	2025-10-22 09:32:47.743202+00	{"eTag": "\\"729388813da5a782278a29cd9f2a4f00\\"", "size": 65629, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-10-22T09:32:48.000Z", "contentLength": 65629, "httpStatusCode": 200}	83af447f-5568-4e21-bcf9-781baa7b3581	\N	{}	2
25f2b0e0-343c-48ff-850d-dedc9d41775a	projectanu	trainee_images/shahinshabinnasir.jpg	\N	2025-10-22 09:33:44.403666+00	2025-10-22 09:33:44.403666+00	2025-10-22 09:33:44.403666+00	{"eTag": "\\"c196f016728df6f0ed9ef0095190f7b7\\"", "size": 2607272, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-10-22T09:33:45.000Z", "contentLength": 2607272, "httpStatusCode": 200}	4f65b2fe-2aad-4dc3-8cd6-8fa70948afca	\N	{}	2
\.


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.prefixes (bucket_id, name, created_at, updated_at) FROM stdin;
projectanu	trainee_images	2025-08-26 18:03:09.067478+00	2025-08-26 18:03:09.067478+00
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

COPY supabase_functions.hooks (id, hook_table_id, hook_name, created_at, request_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

COPY supabase_functions.migrations (version, inserted_at) FROM stdin;
initial	2025-08-01 08:08:18.365497+00
20210809183423_update_grants	2025-08-01 08:08:18.365497+00
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: batch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.batch_id_seq', 44, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 3, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 16460, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('supabase_functions.hooks_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: access_course_data access_course_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_course_data
    ADD CONSTRAINT access_course_data_pkey PRIMARY KEY (course_id);


--
-- Name: access_course_data access_course_data_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_course_data
    ADD CONSTRAINT access_course_data_user_id_key UNIQUE (user_id);


--
-- Name: batch_data batch_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.batch_data
    ADD CONSTRAINT batch_data_pkey PRIMARY KEY (batch_id);


--
-- Name: batch_people_data batch_people_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.batch_people_data
    ADD CONSTRAINT batch_people_data_pkey PRIMARY KEY (user_id);


--
-- Name: chapter_data chapter_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapter_data
    ADD CONSTRAINT chapter_data_pkey PRIMARY KEY (chapter_id);


--
-- Name: course_availability course_availability_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_availability
    ADD CONSTRAINT course_availability_pkey PRIMARY KEY (course_id);


--
-- Name: course_data course_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_data
    ADD CONSTRAINT course_data_pkey PRIMARY KEY (course_id);


--
-- Name: curiculum_data curiculum_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curiculum_data
    ADD CONSTRAINT curiculum_data_pkey PRIMARY KEY (curiculum_id);


--
-- Name: module_data module_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_data
    ADD CONSTRAINT module_data_pkey PRIMARY KEY (module_id, chapter_id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: resource_data resource_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_data
    ADD CONSTRAINT resource_data_pkey PRIMARY KEY (resource_id, module_id);


--
-- Name: streaming_data streaming_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.streaming_data
    ADD CONSTRAINT streaming_data_pkey PRIMARY KEY (user_id, participant_id);


--
-- Name: submod_data submod_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submod_data
    ADD CONSTRAINT submod_data_pkey PRIMARY KEY (submod_id);


--
-- Name: targeted_learning targeted_learning_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.targeted_learning
    ADD CONSTRAINT targeted_learning_pkey PRIMARY KEY (target_learning_id);


--
-- Name: user_data user_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_data
    ADD CONSTRAINT user_data_pkey PRIMARY KEY (user_email);


--
-- Name: user_data user_table_user_contact_num_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_data
    ADD CONSTRAINT user_table_user_contact_num_key UNIQUE (user_contact_num);


--
-- Name: user_data user_table_user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_data
    ADD CONSTRAINT user_table_user_email_key UNIQUE (user_email);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_10_23 messages_2025_10_23_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_10_23
    ADD CONSTRAINT messages_2025_10_23_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_10_24 messages_2025_10_24_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_10_24
    ADD CONSTRAINT messages_2025_10_24_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_10_25 messages_2025_10_25_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_10_25
    ADD CONSTRAINT messages_2025_10_25_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_10_26 messages_2025_10_26_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_10_26
    ADD CONSTRAINT messages_2025_10_26_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_10_27 messages_2025_10_27_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_10_27
    ADD CONSTRAINT messages_2025_10_27_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_10_28 messages_2025_10_28_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_10_28
    ADD CONSTRAINT messages_2025_10_28_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_10_29 messages_2025_10_29_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_10_29
    ADD CONSTRAINT messages_2025_10_29_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_10_30 messages_2025_10_30_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_10_30
    ADD CONSTRAINT messages_2025_10_30_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: hooks hooks_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER TABLE ONLY supabase_functions.hooks
    ADD CONSTRAINT hooks_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER TABLE ONLY supabase_functions.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (version);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_10_23_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_10_23_inserted_at_topic_idx ON realtime.messages_2025_10_23 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_10_24_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_10_24_inserted_at_topic_idx ON realtime.messages_2025_10_24 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_10_25_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_10_25_inserted_at_topic_idx ON realtime.messages_2025_10_25 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_10_26_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_10_26_inserted_at_topic_idx ON realtime.messages_2025_10_26 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_10_27_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_10_27_inserted_at_topic_idx ON realtime.messages_2025_10_27 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_10_28_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_10_28_inserted_at_topic_idx ON realtime.messages_2025_10_28 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_10_29_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_10_29_inserted_at_topic_idx ON realtime.messages_2025_10_29 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_10_30_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_10_30_inserted_at_topic_idx ON realtime.messages_2025_10_30 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- Name: supabase_functions_hooks_h_table_id_h_name_idx; Type: INDEX; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE INDEX supabase_functions_hooks_h_table_id_h_name_idx ON supabase_functions.hooks USING btree (hook_table_id, hook_name);


--
-- Name: supabase_functions_hooks_request_id_idx; Type: INDEX; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE INDEX supabase_functions_hooks_request_id_idx ON supabase_functions.hooks USING btree (request_id);


--
-- Name: messages_2025_10_23_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_10_23_inserted_at_topic_idx;


--
-- Name: messages_2025_10_23_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_10_23_pkey;


--
-- Name: messages_2025_10_24_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_10_24_inserted_at_topic_idx;


--
-- Name: messages_2025_10_24_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_10_24_pkey;


--
-- Name: messages_2025_10_25_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_10_25_inserted_at_topic_idx;


--
-- Name: messages_2025_10_25_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_10_25_pkey;


--
-- Name: messages_2025_10_26_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_10_26_inserted_at_topic_idx;


--
-- Name: messages_2025_10_26_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_10_26_pkey;


--
-- Name: messages_2025_10_27_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_10_27_inserted_at_topic_idx;


--
-- Name: messages_2025_10_27_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_10_27_pkey;


--
-- Name: messages_2025_10_28_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_10_28_inserted_at_topic_idx;


--
-- Name: messages_2025_10_28_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_10_28_pkey;


--
-- Name: messages_2025_10_29_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_10_29_inserted_at_topic_idx;


--
-- Name: messages_2025_10_29_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_10_29_pkey;


--
-- Name: messages_2025_10_30_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_10_30_inserted_at_topic_idx;


--
-- Name: messages_2025_10_30_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_10_30_pkey;


--
-- Name: batch_data batch_id_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER batch_id_trigger BEFORE INSERT ON public.batch_data FOR EACH ROW EXECUTE FUNCTION public.generate_batch_id();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: course_availability course_availability_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_availability
    ADD CONSTRAINT course_availability_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course_availability(course_id);


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: access_course_data; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.access_course_data ENABLE ROW LEVEL SECURITY;

--
-- Name: batch_people_data; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.batch_people_data ENABLE ROW LEVEL SECURITY;

--
-- Name: chapter_data; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.chapter_data ENABLE ROW LEVEL SECURITY;

--
-- Name: curiculum_data; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.curiculum_data ENABLE ROW LEVEL SECURITY;

--
-- Name: module_data; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.module_data ENABLE ROW LEVEL SECURITY;

--
-- Name: progress_data; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.progress_data ENABLE ROW LEVEL SECURITY;

--
-- Name: resource_data; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.resource_data ENABLE ROW LEVEL SECURITY;

--
-- Name: streaming_data; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.streaming_data ENABLE ROW LEVEL SECURITY;

--
-- Name: submod_data; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.submod_data ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: supabase_realtime_messages_publication; Type: PUBLICATION; Schema: -; Owner: supabase_admin
--

CREATE PUBLICATION supabase_realtime_messages_publication WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime_messages_publication OWNER TO supabase_admin;

--
-- Name: supabase_realtime course_availability; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.course_availability;


--
-- Name: supabase_realtime_messages_publication messages; Type: PUBLICATION TABLE; Schema: realtime; Owner: supabase_admin
--

ALTER PUBLICATION supabase_realtime_messages_publication ADD TABLE ONLY realtime.messages;


--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA net; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA net TO supabase_functions_admin;
GRANT USAGE ON SCHEMA net TO postgres;
GRANT USAGE ON SCHEMA net TO anon;
GRANT USAGE ON SCHEMA net TO authenticated;
GRANT USAGE ON SCHEMA net TO service_role;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA supabase_functions; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA supabase_functions TO postgres;
GRANT USAGE ON SCHEMA supabase_functions TO anon;
GRANT USAGE ON SCHEMA supabase_functions TO authenticated;
GRANT USAGE ON SCHEMA supabase_functions TO service_role;
GRANT ALL ON SCHEMA supabase_functions TO supabase_functions_admin;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO postgres;


--
-- Name: FUNCTION generate_batch_id(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.generate_batch_id() TO anon;
GRANT ALL ON FUNCTION public.generate_batch_id() TO authenticated;
GRANT ALL ON FUNCTION public.generate_batch_id() TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION http_request(); Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

REVOKE ALL ON FUNCTION supabase_functions.http_request() FROM PUBLIC;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO postgres;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO anon;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO authenticated;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO service_role;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE access_course_data; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.access_course_data TO anon;
GRANT ALL ON TABLE public.access_course_data TO authenticated;
GRANT ALL ON TABLE public.access_course_data TO service_role;


--
-- Name: TABLE batch_data; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.batch_data TO anon;
GRANT ALL ON TABLE public.batch_data TO authenticated;
GRANT ALL ON TABLE public.batch_data TO service_role;


--
-- Name: SEQUENCE batch_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.batch_id_seq TO anon;
GRANT ALL ON SEQUENCE public.batch_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.batch_id_seq TO service_role;


--
-- Name: TABLE batch_people_data; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.batch_people_data TO anon;
GRANT ALL ON TABLE public.batch_people_data TO authenticated;
GRANT ALL ON TABLE public.batch_people_data TO service_role;


--
-- Name: TABLE chapter_data; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.chapter_data TO anon;
GRANT ALL ON TABLE public.chapter_data TO authenticated;
GRANT ALL ON TABLE public.chapter_data TO service_role;


--
-- Name: TABLE course_availability; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.course_availability TO anon;
GRANT ALL ON TABLE public.course_availability TO authenticated;
GRANT ALL ON TABLE public.course_availability TO service_role;


--
-- Name: TABLE course_data; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.course_data TO anon;
GRANT ALL ON TABLE public.course_data TO authenticated;
GRANT ALL ON TABLE public.course_data TO service_role;


--
-- Name: TABLE curiculum_data; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.curiculum_data TO anon;
GRANT ALL ON TABLE public.curiculum_data TO authenticated;
GRANT ALL ON TABLE public.curiculum_data TO service_role;


--
-- Name: TABLE forgot_password_request_activity; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.forgot_password_request_activity TO anon;
GRANT ALL ON TABLE public.forgot_password_request_activity TO authenticated;
GRANT ALL ON TABLE public.forgot_password_request_activity TO service_role;


--
-- Name: TABLE module_data; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.module_data TO anon;
GRANT ALL ON TABLE public.module_data TO authenticated;
GRANT ALL ON TABLE public.module_data TO service_role;


--
-- Name: TABLE notifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notifications TO anon;
GRANT ALL ON TABLE public.notifications TO authenticated;
GRANT ALL ON TABLE public.notifications TO service_role;


--
-- Name: SEQUENCE notifications_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.notifications_id_seq TO anon;
GRANT ALL ON SEQUENCE public.notifications_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.notifications_id_seq TO service_role;


--
-- Name: TABLE progress_data; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.progress_data TO anon;
GRANT ALL ON TABLE public.progress_data TO authenticated;
GRANT ALL ON TABLE public.progress_data TO service_role;


--
-- Name: TABLE resource_data; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.resource_data TO anon;
GRANT ALL ON TABLE public.resource_data TO authenticated;
GRANT ALL ON TABLE public.resource_data TO service_role;


--
-- Name: TABLE streaming_data; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.streaming_data TO anon;
GRANT ALL ON TABLE public.streaming_data TO authenticated;
GRANT ALL ON TABLE public.streaming_data TO service_role;


--
-- Name: TABLE submod_data; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.submod_data TO anon;
GRANT ALL ON TABLE public.submod_data TO authenticated;
GRANT ALL ON TABLE public.submod_data TO service_role;


--
-- Name: TABLE targeted_learning; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.targeted_learning TO anon;
GRANT ALL ON TABLE public.targeted_learning TO authenticated;
GRANT ALL ON TABLE public.targeted_learning TO service_role;


--
-- Name: TABLE user_data; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_data TO anon;
GRANT ALL ON TABLE public.user_data TO authenticated;
GRANT ALL ON TABLE public.user_data TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE messages_2025_10_23; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_10_23 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_10_23 TO dashboard_user;


--
-- Name: TABLE messages_2025_10_24; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_10_24 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_10_24 TO dashboard_user;


--
-- Name: TABLE messages_2025_10_25; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_10_25 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_10_25 TO dashboard_user;


--
-- Name: TABLE messages_2025_10_26; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_10_26 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_10_26 TO dashboard_user;


--
-- Name: TABLE messages_2025_10_27; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_10_27 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_10_27 TO dashboard_user;


--
-- Name: TABLE messages_2025_10_28; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_10_28 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_10_28 TO dashboard_user;


--
-- Name: TABLE messages_2025_10_29; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_10_29 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_10_29 TO dashboard_user;


--
-- Name: TABLE messages_2025_10_30; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_10_30 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_10_30 TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE prefixes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.prefixes TO service_role;
GRANT ALL ON TABLE storage.prefixes TO authenticated;
GRANT ALL ON TABLE storage.prefixes TO anon;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE hooks; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

GRANT ALL ON TABLE supabase_functions.hooks TO postgres;
GRANT ALL ON TABLE supabase_functions.hooks TO anon;
GRANT ALL ON TABLE supabase_functions.hooks TO authenticated;
GRANT ALL ON TABLE supabase_functions.hooks TO service_role;


--
-- Name: SEQUENCE hooks_id_seq; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO postgres;
GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO anon;
GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO authenticated;
GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO service_role;


--
-- Name: TABLE migrations; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

GRANT ALL ON TABLE supabase_functions.migrations TO postgres;
GRANT ALL ON TABLE supabase_functions.migrations TO anon;
GRANT ALL ON TABLE supabase_functions.migrations TO authenticated;
GRANT ALL ON TABLE supabase_functions.migrations TO service_role;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: supabase_functions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: supabase_functions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: supabase_functions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

