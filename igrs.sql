--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

-- Started on 2025-07-11 18:06:37

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

--
-- TOC entry 842 (class 1247 OID 16563)
-- Name: gender_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.gender_enum AS ENUM (
    'male',
    'female',
    'prefer_not_to_say'
);


ALTER TYPE public.gender_enum OWNER TO postgres;

--
-- TOC entry 845 (class 1247 OID 16570)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    '99',
    '101',
    '102',
    '103'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16579)
-- Name: course_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_data (
    course_id character varying(20) NOT NULL,
    course_name character varying(30),
    created_at date
);


ALTER TABLE public.course_data OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16582)
-- Name: forgot_password_request_activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forgot_password_request_activity (
    user_mail character varying(35),
    ip_address character varying(35),
    activity_timestamp timestamp without time zone DEFAULT now()
);


ALTER TABLE public.forgot_password_request_activity OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16586)
-- Name: user_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_data (
    user_anu_id character varying(20) NOT NULL,
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
    CONSTRAINT status_check CHECK (((status)::text = ANY (ARRAY[('active'::character varying)::text, ('inactive'::character varying)::text, ('suspended'::character varying)::text])))
);


ALTER TABLE public.user_data OWNER TO postgres;

--
-- TOC entry 4904 (class 0 OID 16579)
-- Dependencies: 215
-- Data for Name: course_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_data (course_id, course_name, created_at) FROM stdin;
\.


--
-- TOC entry 4905 (class 0 OID 16582)
-- Dependencies: 216
-- Data for Name: forgot_password_request_activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.forgot_password_request_activity (user_mail, ip_address, activity_timestamp) FROM stdin;
test@example.com	172.16.101.112	2025-06-30 17:27:18.642749
test@example.com	172.16.101.112	2025-07-01 12:25:23.726862
\.


--
-- TOC entry 4906 (class 0 OID 16586)
-- Dependencies: 217
-- Data for Name: user_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_data (user_anu_id, user_profile_photo, user_name, user_email, user_contact_num, user_dob, user_gender, user_password, user_role, created_at, status, description) FROM stdin;
U1010001	profile101.jpg	Ravi Kumar	ravi.kumar@example.com	9876543211	1992-03-15	male	$2b$10$aH7WDNUDHOib0IbYbpbs.evz4hSXkH1B.ni8quKVWzDhdTi8xwG7C	101	2025-06-27 12:50:57.750575	active	
U1011123	profile101.jpg	Ravi Kumar	test@example.com	9876543220	1992-03-15	male	$2b$10$aH7WDNUDHOib0IbYbpbs.evz4hSXkH1B.ni8quKVWzDhdTi8xwG7C	102	2025-06-27 13:07:37.557049	active	
ANU2232134	f4e2464f-c225-4b8b-a8a0-4ceaaccd24cb	Rokesh Maran	rokesh@htic.iitm.ac.in	89879799721	2002-01-02	male	$2b$10$iWsuYpmNrVaqpgUxFWZ7z.CbINrKM0RWegCnu0WRmP6R6JG88UA8S	103	2025-07-04 13:48:47.593438	inactive	-
u_0012asgfhd	https://s3.amazonaws.com/bucket/user1.png	Prasath	prasath@example.com	9876543210	2000-01-01	male	$2b$10$ZNkOMieY2GCvhNXQBFmwves4bVj5z6Wk.2dajDgJSjHmUAaO9OxLe	103	2025-06-25 17:08:07.74383	inactive	
0022a6cb-9ddb	f4e2464f-c225-	28c965cc-c446-499	sa@gmail.com	9987654324	2020-11-11	male	$2b$10$TRfPKQGGPrGv5eumGVhR4O5cQ47h6hN3LDvP6pRQv6rN/RbDqDPiK	103	2025-07-08 17:19:42.024143	active	17dcdeba-bb
\.


--
-- TOC entry 4754 (class 2606 OID 16596)
-- Name: course_data course_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_data
    ADD CONSTRAINT course_data_pkey PRIMARY KEY (course_id);


--
-- TOC entry 4756 (class 2606 OID 16598)
-- Name: user_data user_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_data
    ADD CONSTRAINT user_table_pkey PRIMARY KEY (user_anu_id);


--
-- TOC entry 4758 (class 2606 OID 16600)
-- Name: user_data user_table_user_contact_num_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_data
    ADD CONSTRAINT user_table_user_contact_num_key UNIQUE (user_contact_num);


--
-- TOC entry 4760 (class 2606 OID 16602)
-- Name: user_data user_table_user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_data
    ADD CONSTRAINT user_table_user_email_key UNIQUE (user_email);


-- Completed on 2025-07-11 18:06:39

--
-- PostgreSQL database dump complete
--

