/*
  # Pharmacovigilance Follow-Up Data Collection Platform Schema

  ## Overview
  This migration creates the complete database schema for a global Pharmacovigilance (PV) 
  Follow-Up Data Collection Platform that tracks adverse events, patient follow-ups, and 
  regulatory compliance.

  ## New Tables

  ### 1. `cases`
  Main table tracking adverse event cases
  - `id` (uuid, primary key) - Unique case identifier
  - `case_number` (text) - Human-readable case number (e.g., "PV-2024-001")
  - `patient_name` (text) - Patient name
  - `patient_age` (integer) - Patient age
  - `patient_gender` (text) - Patient gender
  - `event_description` (text) - Description of adverse event
  - `drug_name` (text) - Name of drug involved
  - `event_date` (date) - Date when adverse event occurred
  - `severity` (text) - Severity level (Mild, Moderate, Severe, Life-threatening)
  - `outcome` (text) - Current outcome status
  - `risk_level` (text) - AI-calculated risk level (LOW, MEDIUM, HIGH, CRITICAL)
  - `risk_confidence` (numeric) - AI confidence score (0-100)
  - `risk_reason` (text) - Explanation for risk level
  - `completeness_score` (numeric) - Case completeness percentage (0-100)
  - `follow_up_status` (text) - Status of follow-up (Pending, Sent, Responded, Complete)
  - `follow_up_due_date` (date) - Regulatory deadline for follow-up
  - `reporter_type` (text) - Who reported (Patient, HCP, Pharmacist)
  - `country` (text) - Country of origin
  - `created_at` (timestamptz) - Case creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `follow_ups`
  Tracks follow-up requests sent to patients/HCPs
  - `id` (uuid, primary key)
  - `case_id` (uuid, foreign key) - Reference to cases table
  - `recipient_type` (text) - Patient or HCP
  - `status` (text) - Sent, Viewed, Responded, Expired
  - `sent_at` (timestamptz)
  - `responded_at` (timestamptz)
  - `questions_sent` (jsonb) - Array of questions sent
  - `questions_removed_by_ai` (integer) - Number of questions AI removed
  - `access_token` (text) - Secure token for accessing follow-up

  ### 3. `follow_up_responses`
  Stores responses to follow-up questions
  - `id` (uuid, primary key)
  - `follow_up_id` (uuid, foreign key)
  - `question_id` (text)
  - `question_text` (text)
  - `response` (text)
  - `created_at` (timestamptz)

  ### 4. `audit_logs`
  Compliance audit trail
  - `id` (uuid, primary key)
  - `case_id` (uuid, foreign key)
  - `action` (text) - Action performed
  - `user_role` (text) - Role of user (System, Patient, HCP, PV Team)
  - `user_id` (text) - User identifier
  - `details` (jsonb) - Additional details
  - `ip_address` (text) - IP address (mocked)
  - `created_at` (timestamptz)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Public read access for demo purposes (in production, this would be restricted)
  - Audit logs are read-only for compliance
*/

-- Create cases table
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number text UNIQUE NOT NULL,
  patient_name text NOT NULL,
  patient_age integer,
  patient_gender text,
  event_description text NOT NULL,
  drug_name text NOT NULL,
  event_date date NOT NULL,
  severity text NOT NULL DEFAULT 'Moderate',
  outcome text,
  risk_level text NOT NULL DEFAULT 'MEDIUM',
  risk_confidence numeric DEFAULT 0,
  risk_reason text,
  completeness_score numeric DEFAULT 50,
  follow_up_status text NOT NULL DEFAULT 'Pending',
  follow_up_due_date date,
  reporter_type text NOT NULL DEFAULT 'Patient',
  country text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create follow_ups table
CREATE TABLE IF NOT EXISTS follow_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  recipient_type text NOT NULL,
  status text NOT NULL DEFAULT 'Sent',
  sent_at timestamptz DEFAULT now(),
  responded_at timestamptz,
  questions_sent jsonb,
  questions_removed_by_ai integer DEFAULT 0,
  access_token text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create follow_up_responses table
CREATE TABLE IF NOT EXISTS follow_up_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follow_up_id uuid NOT NULL REFERENCES follow_ups(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  question_text text NOT NULL,
  response text,
  created_at timestamptz DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE SET NULL,
  action text NOT NULL,
  user_role text NOT NULL,
  user_id text,
  details jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public demo access
-- In production, these would be much more restrictive

CREATE POLICY "Public read access to cases"
  ON cases FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public insert access to cases"
  ON cases FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public update access to cases"
  ON cases FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Public read access to follow_ups"
  ON follow_ups FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public insert access to follow_ups"
  ON follow_ups FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public update access to follow_ups"
  ON follow_ups FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Public read access to follow_up_responses"
  ON follow_up_responses FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public insert access to follow_up_responses"
  ON follow_up_responses FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public read access to audit_logs"
  ON audit_logs FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public insert access to audit_logs"
  ON audit_logs FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cases_risk_level ON cases(risk_level);
CREATE INDEX IF NOT EXISTS idx_cases_follow_up_status ON cases(follow_up_status);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_follow_ups_case_id ON follow_ups(case_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_access_token ON follow_ups(access_token);
CREATE INDEX IF NOT EXISTS idx_audit_logs_case_id ON audit_logs(case_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);