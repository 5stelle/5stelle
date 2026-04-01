--
-- PostgreSQL database dump
--

\restrict CgPWlv0DkRRSXw8xUCleWA4lbPLX4G9cm4Bdabuhp2ekfR65ReyRFhxN3LgnLXy

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.3

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: answers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.answers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    submission_id uuid NOT NULL,
    question_id uuid NOT NULL,
    value jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.answers OWNER TO postgres;

--
-- Name: forms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    restaurant_id uuid NOT NULL,
    name text NOT NULL,
    is_active boolean DEFAULT true,
    reward_text text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.forms OWNER TO postgres;

--
-- Name: questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    form_id uuid NOT NULL,
    type text NOT NULL,
    label text NOT NULL,
    description text,
    is_required boolean DEFAULT true,
    options jsonb,
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT questions_type_check CHECK ((type = ANY (ARRAY['sentiment'::text, 'star_rating'::text, 'open_text'::text, 'multiple_choice'::text, 'single_choice'::text])))
);


ALTER TABLE public.questions OWNER TO postgres;

--
-- Name: restaurants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restaurants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_id uuid NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    logo_url text,
    stripe_customer_id text,
    stripe_subscription_id text,
    subscription_status text DEFAULT 'trialing'::text,
    trial_ends_at timestamp with time zone DEFAULT (now() + '7 days'::interval),
    created_at timestamp with time zone DEFAULT now(),
    social_links jsonb DEFAULT '{}'::jsonb,
    primary_platform text
);


ALTER TABLE public.restaurants OWNER TO postgres;

--
-- Name: submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    form_id uuid NOT NULL,
    table_identifier text,
    overall_sentiment text,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT submissions_overall_sentiment_check CHECK ((overall_sentiment = ANY (ARRAY['bad'::text, 'ok'::text, 'great'::text])))
);


ALTER TABLE public.submissions OWNER TO postgres;

--
-- Name: tables; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tables (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    restaurant_id uuid NOT NULL,
    name text NOT NULL,
    identifier text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.tables OWNER TO postgres;

--
-- Name: answers answers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY (id);


--
-- Name: answers answers_submission_question_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_submission_question_unique UNIQUE (submission_id, question_id);


--
-- Name: forms forms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT forms_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: restaurants restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_pkey PRIMARY KEY (id);


--
-- Name: restaurants restaurants_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_slug_key UNIQUE (slug);


--
-- Name: submissions submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);


--
-- Name: tables tables_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_pkey PRIMARY KEY (id);


--
-- Name: tables tables_restaurant_id_identifier_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_restaurant_id_identifier_key UNIQUE (restaurant_id, identifier);


--
-- Name: idx_answers_submission_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_answers_submission_id ON public.answers USING btree (submission_id);


--
-- Name: idx_forms_restaurant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_forms_restaurant_id ON public.forms USING btree (restaurant_id);


--
-- Name: idx_questions_form_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_questions_form_id ON public.questions USING btree (form_id);


--
-- Name: idx_questions_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_questions_order ON public.questions USING btree (form_id, order_index);


--
-- Name: idx_restaurants_owner_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_restaurants_owner_id ON public.restaurants USING btree (owner_id);


--
-- Name: idx_restaurants_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_restaurants_slug ON public.restaurants USING btree (slug);


--
-- Name: idx_submissions_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_submissions_created_at ON public.submissions USING btree (created_at DESC);


--
-- Name: idx_submissions_form_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_submissions_form_id ON public.submissions USING btree (form_id);


--
-- Name: answers answers_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- Name: answers answers_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON DELETE CASCADE;


--
-- Name: forms forms_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT forms_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE;


--
-- Name: questions questions_form_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_form_id_fkey FOREIGN KEY (form_id) REFERENCES public.forms(id) ON DELETE CASCADE;


--
-- Name: restaurants restaurants_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id);


--
-- Name: submissions submissions_form_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_form_id_fkey FOREIGN KEY (form_id) REFERENCES public.forms(id) ON DELETE CASCADE;


--
-- Name: tables tables_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE;


--
-- Name: answers Public can insert answers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can insert answers" ON public.answers FOR INSERT WITH CHECK (true);


--
-- Name: submissions Public can insert submissions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can insert submissions" ON public.submissions FOR INSERT WITH CHECK (true);


--
-- Name: answers Public can select own submission answers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can select own submission answers" ON public.answers FOR SELECT USING (true);


--
-- Name: answers Public can update answers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can update answers" ON public.answers FOR UPDATE USING (true) WITH CHECK (true);


--
-- Name: submissions Public can update own submissions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can update own submissions" ON public.submissions FOR UPDATE USING (true) WITH CHECK (true);


--
-- Name: forms Public can view active forms; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view active forms" ON public.forms FOR SELECT USING ((is_active = true));


--
-- Name: questions Public can view questions for active forms; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view questions for active forms" ON public.questions FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.forms
  WHERE ((forms.id = questions.form_id) AND (forms.is_active = true)))));


--
-- Name: restaurants Public can view restaurants by slug; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view restaurants by slug" ON public.restaurants FOR SELECT USING (true);


--
-- Name: tables Public can view table status; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view table status" ON public.tables FOR SELECT USING (true);


--
-- Name: forms Users can delete own forms; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own forms" ON public.forms FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.restaurants
  WHERE ((restaurants.id = forms.restaurant_id) AND (restaurants.owner_id = auth.uid())))));


--
-- Name: questions Users can delete own questions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own questions" ON public.questions FOR DELETE USING ((EXISTS ( SELECT 1
   FROM (public.forms
     JOIN public.restaurants ON ((restaurants.id = forms.restaurant_id)))
  WHERE ((forms.id = questions.form_id) AND (restaurants.owner_id = auth.uid())))));


--
-- Name: tables Users can delete own tables; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own tables" ON public.tables FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.restaurants
  WHERE ((restaurants.id = tables.restaurant_id) AND (restaurants.owner_id = auth.uid())))));


--
-- Name: forms Users can insert own forms; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own forms" ON public.forms FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.restaurants
  WHERE ((restaurants.id = forms.restaurant_id) AND (restaurants.owner_id = auth.uid())))));


--
-- Name: questions Users can insert own questions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own questions" ON public.questions FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM (public.forms
     JOIN public.restaurants ON ((restaurants.id = forms.restaurant_id)))
  WHERE ((forms.id = questions.form_id) AND (restaurants.owner_id = auth.uid())))));


--
-- Name: restaurants Users can insert own restaurant; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own restaurant" ON public.restaurants FOR INSERT WITH CHECK ((auth.uid() = owner_id));


--
-- Name: tables Users can insert own tables; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own tables" ON public.tables FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.restaurants
  WHERE ((restaurants.id = tables.restaurant_id) AND (restaurants.owner_id = auth.uid())))));


--
-- Name: forms Users can update own forms; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own forms" ON public.forms FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.restaurants
  WHERE ((restaurants.id = forms.restaurant_id) AND (restaurants.owner_id = auth.uid())))));


--
-- Name: questions Users can update own questions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own questions" ON public.questions FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM (public.forms
     JOIN public.restaurants ON ((restaurants.id = forms.restaurant_id)))
  WHERE ((forms.id = questions.form_id) AND (restaurants.owner_id = auth.uid())))));


--
-- Name: restaurants Users can update own restaurant; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own restaurant" ON public.restaurants FOR UPDATE USING ((auth.uid() = owner_id));


--
-- Name: tables Users can update own tables; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own tables" ON public.tables FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.restaurants
  WHERE ((restaurants.id = tables.restaurant_id) AND (restaurants.owner_id = auth.uid())))));


--
-- Name: answers Users can view own answers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own answers" ON public.answers FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ((public.submissions
     JOIN public.forms ON ((forms.id = submissions.form_id)))
     JOIN public.restaurants ON ((restaurants.id = forms.restaurant_id)))
  WHERE ((submissions.id = answers.submission_id) AND (restaurants.owner_id = auth.uid())))));


--
-- Name: forms Users can view own forms; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own forms" ON public.forms FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.restaurants
  WHERE ((restaurants.id = forms.restaurant_id) AND (restaurants.owner_id = auth.uid())))));


--
-- Name: questions Users can view own questions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own questions" ON public.questions FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (public.forms
     JOIN public.restaurants ON ((restaurants.id = forms.restaurant_id)))
  WHERE ((forms.id = questions.form_id) AND (restaurants.owner_id = auth.uid())))));


--
-- Name: restaurants Users can view own restaurant; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own restaurant" ON public.restaurants FOR SELECT USING ((auth.uid() = owner_id));


--
-- Name: submissions Users can view own submissions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own submissions" ON public.submissions FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (public.forms
     JOIN public.restaurants ON ((restaurants.id = forms.restaurant_id)))
  WHERE ((forms.id = submissions.form_id) AND (restaurants.owner_id = auth.uid())))));


--
-- Name: tables Users can view own tables; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own tables" ON public.tables FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.restaurants
  WHERE ((restaurants.id = tables.restaurant_id) AND (restaurants.owner_id = auth.uid())))));


--
-- Name: answers; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

--
-- Name: forms; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

--
-- Name: questions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

--
-- Name: restaurants; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

--
-- Name: submissions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

--
-- Name: tables; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: TABLE answers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.answers TO anon;
GRANT ALL ON TABLE public.answers TO authenticated;
GRANT ALL ON TABLE public.answers TO service_role;


--
-- Name: TABLE forms; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.forms TO anon;
GRANT ALL ON TABLE public.forms TO authenticated;
GRANT ALL ON TABLE public.forms TO service_role;


--
-- Name: TABLE questions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.questions TO anon;
GRANT ALL ON TABLE public.questions TO authenticated;
GRANT ALL ON TABLE public.questions TO service_role;


--
-- Name: TABLE restaurants; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.restaurants TO anon;
GRANT ALL ON TABLE public.restaurants TO authenticated;
GRANT ALL ON TABLE public.restaurants TO service_role;


--
-- Name: TABLE submissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.submissions TO anon;
GRANT ALL ON TABLE public.submissions TO authenticated;
GRANT ALL ON TABLE public.submissions TO service_role;


--
-- Name: TABLE tables; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tables TO anon;
GRANT ALL ON TABLE public.tables TO authenticated;
GRANT ALL ON TABLE public.tables TO service_role;


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
-- PostgreSQL database dump complete
--

\unrestrict CgPWlv0DkRRSXw8xUCleWA4lbPLX4G9cm4Bdabuhp2ekfR65ReyRFhxN3LgnLXy

