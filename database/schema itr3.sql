-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.allergies (
  allergy_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  patient_id uuid NOT NULL,
  allergy_name text NOT NULL,
  CONSTRAINT allergies_pkey PRIMARY KEY (allergy_id),
  CONSTRAINT allergies_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(patient_id)
);
CREATE TABLE public.appointments (
  appointment_id uuid NOT NULL DEFAULT gen_random_uuid(),
  caregiver_id uuid NOT NULL,
  team_id uuid NOT NULL,
  patient_id uuid NOT NULL,
  title text,
  description text,
  location text,
  scheduled_at timestamp with time zone,
  created_at timestamp with time zone,
  completed_at timestamp with time zone,
  is_completed boolean,
  CONSTRAINT appointments_pkey PRIMARY KEY (appointment_id),
  CONSTRAINT appointments_caregiver_id_fkey FOREIGN KEY (caregiver_id) REFERENCES public.caregivers(caregiver_id),
  CONSTRAINT appointments_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(team_id),
  CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(patient_id)
);
CREATE TABLE public.caregivers (
  caregiver_id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone_number text,
  job_title text,
  CONSTRAINT caregivers_pkey PRIMARY KEY (caregiver_id)
);
CREATE TABLE public.categories (
  category_id uuid NOT NULL DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL,
  name text NOT NULL,
  color text NOT NULL,
  CONSTRAINT categories_pkey PRIMARY KEY (category_id),
  CONSTRAINT categories_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(team_id)
);
CREATE TABLE public.emergency_contacts (
  contact_id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone_number text,
  relationship text,
  CONSTRAINT emergency_contacts_pkey PRIMARY KEY (contact_id),
  CONSTRAINT emergency_contacts_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(patient_id)
);
CREATE TABLE public.medication_logs (
  medication_log_id uuid NOT NULL DEFAULT gen_random_uuid(),
  medication_id uuid NOT NULL,
  caregiver_id uuid NOT NULL,
  taken_at timestamp with time zone,
  is_completed boolean,
  CONSTRAINT medication_logs_pkey PRIMARY KEY (medication_log_id),
  CONSTRAINT medication_logs_medication_id_fkey FOREIGN KEY (medication_id) REFERENCES public.medications(medication_id),
  CONSTRAINT medication_logs_caregiver_id_fkey FOREIGN KEY (caregiver_id) REFERENCES public.caregivers(caregiver_id)
);
CREATE TABLE public.medication_schedule (
  schedule_id uuid NOT NULL DEFAULT gen_random_uuid(),
  medication_id uuid NOT NULL,
  scheduled_at timestamp with time zone,
  CONSTRAINT medication_schedule_pkey PRIMARY KEY (schedule_id),
  CONSTRAINT medication_schedule_medication_id_fkey FOREIGN KEY (medication_id) REFERENCES public.medications(medication_id)
);
CREATE TABLE public.medications (
  medication_id uuid NOT NULL DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL,
  patient_id uuid NOT NULL,
  name text,
  dosage text,
  frequency text,
  purpose text,
  instructions text,
  is_active boolean,
  prescribed_by text,
  warnings text,
  CONSTRAINT medications_pkey PRIMARY KEY (medication_id),
  CONSTRAINT medications_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(team_id),
  CONSTRAINT medications_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(patient_id)
);
CREATE TABLE public.notes (
  note_id uuid NOT NULL DEFAULT gen_random_uuid(),
  caregiver_id uuid NOT NULL,
  team_id uuid NOT NULL,
  patient_id uuid NOT NULL,
  category_id uuid NOT NULL,
  title text,
  description text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  is_urgent boolean DEFAULT false,
  CONSTRAINT notes_pkey PRIMARY KEY (note_id),
  CONSTRAINT notes_caregiver_id_fkey FOREIGN KEY (caregiver_id) REFERENCES public.caregivers(caregiver_id),
  CONSTRAINT notes_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(team_id),
  CONSTRAINT notes_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(patient_id),
  CONSTRAINT notes_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id)
);
CREATE TABLE public.patient_conditions (
  condition_id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  condition_name text NOT NULL,
  is_active boolean,
  CONSTRAINT patient_conditions_pkey PRIMARY KEY (condition_id),
  CONSTRAINT patient_conditions_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(patient_id)
);
CREATE TABLE public.patients (
  patient_id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  dob date NOT NULL,
  gender character varying NOT NULL,
  address text,
  email text,
  phone_number text,
  blood_type character varying,
  weight character varying,
  height character varying,
  dietary_requirements text,
  insurance_provider text,
  policy_number text,
  group_number text,
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT patients_pkey PRIMARY KEY (patient_id)
);
CREATE TABLE public.task_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL,
  caregiver_id uuid NOT NULL,
  completed_at timestamp with time zone,
  is_completed boolean,
  CONSTRAINT task_logs_pkey PRIMARY KEY (id),
  CONSTRAINT task_logs_caregiver_id_fkey FOREIGN KEY (caregiver_id) REFERENCES public.caregivers(caregiver_id),
  CONSTRAINT task_logs_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(task_id)
);
CREATE TABLE public.tasks (
  task_id uuid NOT NULL DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL,
  patient_id uuid NOT NULL,
  category_id uuid NOT NULL,
  title text,
  description text,
  scheduled_at timestamp without time zone,
  CONSTRAINT tasks_pkey PRIMARY KEY (task_id),
  CONSTRAINT tasks_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(team_id),
  CONSTRAINT tasks_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(patient_id),
  CONSTRAINT tasks_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id)
);
CREATE TABLE public.team_members (
  member_id uuid NOT NULL DEFAULT gen_random_uuid(),
  team_id uuid,
  patient_id uuid,
  caregiver_id uuid,
  role character varying,
  date_assigned timestamp with time zone,
  CONSTRAINT team_members_pkey PRIMARY KEY (member_id),
  CONSTRAINT team_members_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(team_id),
  CONSTRAINT team_members_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(patient_id),
  CONSTRAINT team_members_caregiver_id_fkey FOREIGN KEY (caregiver_id) REFERENCES public.caregivers(caregiver_id)
);
CREATE TABLE public.teams (
  team_id uuid NOT NULL DEFAULT gen_random_uuid(),
  team_name text NOT NULL,
  join_code character varying NOT NULL,
  CONSTRAINT teams_pkey PRIMARY KEY (team_id)
);