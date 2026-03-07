-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.appointments (
  appointmentId uuid NOT NULL DEFAULT gen_random_uuid(),
  careTeamId uuid NOT NULL,
  caregiverId uuid NOT NULL,
  patientId uuid NOT NULL,
  scheduledAt timestamp with time zone NOT NULL,
  description text,
  completedTime timestamp with time zone,
  CONSTRAINT appointments_pkey PRIMARY KEY (appointmentId),
  CONSTRAINT appointments_careTeamId_fkey FOREIGN KEY (careTeamId) REFERENCES public.careTeams(careTeamId),
  CONSTRAINT appointments_caregiverId_fkey FOREIGN KEY (caregiverId) REFERENCES public.caregivers(caregiverId),
  CONSTRAINT appointments_patientId_fkey FOREIGN KEY (patientId) REFERENCES public.patients(patientId)
);
CREATE TABLE public.careTeamMembers (
  membershipId uuid NOT NULL DEFAULT gen_random_uuid(),
  careTeamId uuid NOT NULL,
  caregiverId uuid,
  patientId uuid,
  role character varying,
  dateAssigned date DEFAULT CURRENT_DATE,
  CONSTRAINT careTeamMembers_pkey PRIMARY KEY (membershipId),
  CONSTRAINT careteammembers_careteamid_fkey FOREIGN KEY (careTeamId) REFERENCES public.careTeams(careTeamId),
  CONSTRAINT careteammembers_caregiverid_fkey FOREIGN KEY (caregiverId) REFERENCES public.caregivers(caregiverId),
  CONSTRAINT careteammembers_patientid_fkey FOREIGN KEY (patientId) REFERENCES public.patients(patientId)
);
CREATE TABLE public.careTeams (
  careTeamId uuid NOT NULL DEFAULT gen_random_uuid(),
  teamName text,
  joinCode character varying UNIQUE,
  CONSTRAINT careTeams_pkey PRIMARY KEY (careTeamId)
);
CREATE TABLE public.caregivers (
  caregiverId uuid NOT NULL DEFAULT gen_random_uuid(),
  firstName character varying,
  lastName character varying,
  email character varying NOT NULL UNIQUE,
  phoneNumber character varying,
  jobTitle character varying,
  CONSTRAINT caregivers_pkey PRIMARY KEY (caregiverId),
  CONSTRAINT caregivers_caregiverId_fkey FOREIGN KEY (caregiverId) REFERENCES auth.users(id)
);
CREATE TABLE public.categories (
  categoryId uuid NOT NULL DEFAULT gen_random_uuid(),
  careTeamId uuid NOT NULL,
  name character varying NOT NULL,
  CONSTRAINT categories_pkey PRIMARY KEY (categoryId),
  CONSTRAINT categories_careTeamId_fkey FOREIGN KEY (careTeamId) REFERENCES public.careTeams(careTeamId)
);
CREATE TABLE public.medicationLogs (
  medicationLogId uuid NOT NULL DEFAULT gen_random_uuid(),
  prescriptionId uuid,
  caregiverId uuid,
  takenAt timestamp with time zone,
  isCompleted boolean NOT NULL DEFAULT false,
  CONSTRAINT medicationLogs_pkey PRIMARY KEY (medicationLogId),
  CONSTRAINT medicationLogs_caregiverId_fkey FOREIGN KEY (caregiverId) REFERENCES public.caregivers(caregiverId),
  CONSTRAINT medicationLogs_prescriptionId_fkey FOREIGN KEY (prescriptionId) REFERENCES public.prescriptions(prescriptionId)
);
CREATE TABLE public.notes (
  noteId uuid NOT NULL DEFAULT gen_random_uuid(),
  careTeamId uuid NOT NULL,
  caregiverId uuid NOT NULL,
  patientId uuid NOT NULL,
  categoryId uuid NOT NULL,
  title character varying,
  description text,
  createdAt timestamp with time zone,
  updatedAt timestamp with time zone,
  CONSTRAINT notes_pkey PRIMARY KEY (noteId),
  CONSTRAINT notes_careTeamId_fkey FOREIGN KEY (careTeamId) REFERENCES public.careTeams(careTeamId),
  CONSTRAINT notes_caregiverId_fkey FOREIGN KEY (caregiverId) REFERENCES public.caregivers(caregiverId),
  CONSTRAINT notes_categoryId_fkey FOREIGN KEY (categoryId) REFERENCES public.categories(categoryId),
  CONSTRAINT notes_patientId_fkey FOREIGN KEY (patientId) REFERENCES public.patients(patientId)
);
CREATE TABLE public.patients (
  patientId uuid NOT NULL DEFAULT gen_random_uuid(),
  firstName character varying NOT NULL,
  lastName character varying NOT NULL,
  dob date NOT NULL,
  address text,
  phoneNumber character varying,
  CONSTRAINT patients_pkey PRIMARY KEY (patientId)
);
CREATE TABLE public.prescriptions (
  prescriptionId uuid NOT NULL DEFAULT gen_random_uuid(),
  careTeamId uuid NOT NULL,
  patientId uuid NOT NULL,
  name character varying NOT NULL,
  dosage character varying NOT NULL,
  frequency character varying,
  scheduledAt timestamp with time zone,
  isActive boolean NOT NULL DEFAULT false,
  CONSTRAINT prescriptions_pkey PRIMARY KEY (prescriptionId),
  CONSTRAINT prescriptions_careTeamId_fkey FOREIGN KEY (careTeamId) REFERENCES public.careTeams(careTeamId),
  CONSTRAINT prescriptions_patientId_fkey FOREIGN KEY (patientId) REFERENCES public.patients(patientId)
);
CREATE TABLE public.taskLogs (
  taskLogId uuid NOT NULL DEFAULT gen_random_uuid(),
  taskId uuid,
  caregiverId uuid,
  completedAt timestamp with time zone,
  isCompleted boolean NOT NULL DEFAULT false,
  CONSTRAINT taskLogs_pkey PRIMARY KEY (taskLogId),
  CONSTRAINT taskLogs_caregiverId_fkey FOREIGN KEY (caregiverId) REFERENCES public.caregivers(caregiverId),
  CONSTRAINT taskLogs_taskId_fkey FOREIGN KEY (taskId) REFERENCES public.tasks(taskId)
);
CREATE TABLE public.tasks (
  taskId uuid NOT NULL DEFAULT gen_random_uuid(),
  careTeamId uuid NOT NULL,
  categoryId uuid,
  title character varying,
  description text,
  scheduledAt timestamp with time zone,
  patientId uuid NOT NULL,
  CONSTRAINT tasks_pkey PRIMARY KEY (taskId),
  CONSTRAINT tasks_careTeamId_fkey FOREIGN KEY (careTeamId) REFERENCES public.careTeams(careTeamId),
  CONSTRAINT tasks_categoryId_fkey FOREIGN KEY (categoryId) REFERENCES public.categories(categoryId),
  CONSTRAINT tasks_patientId_fkey FOREIGN KEY (patientId) REFERENCES public.patients(patientId)
);