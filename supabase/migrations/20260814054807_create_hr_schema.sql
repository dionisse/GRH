/*
# Create HR360 Schema (single-tenant, no auth)

This migration creates all tables for the RH360 HR management application.
The app has no sign-in screen — it uses the anon key for all operations.
All policies use `TO anon, authenticated` so the anon-key frontend can read/write.

1. New Tables:
- organizations — company info (OHADA/Benin)
- users — app users (admin, hr_manager, employee)
- departments — company departments
- positions — job titles with OHADA professional categories
- employees — employee records with personal/professional/banking info
- career_history — promotions and position changes
- skills — organization skill catalog
- employee_skills — skills per employee with level
- leave_requests — leave requests (annual, sick, maternity, etc.)
- leave_balances — yearly leave balances per employee
- evaluations — performance evaluations
- objectives — goals per employee/evaluation
- trainings — training catalog
- employee_trainings — training assignments per employee
- documents — employee/company documents
- job_postings — recruitment job postings
- candidates — job candidates
- payslips — payroll slips with CNSS/ITS calculations
- notifications — user notifications
- sync_queue — PWA offline sync queue

2. Security:
- RLS enabled on every table
- All tables allow anon + authenticated CRUD (single-tenant, no sign-in)
*/

-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  trade_name text,
  logo text,
  legal_form text,
  industry text,
  rccm text,
  ifu text,
  cnss_number text,
  address text,
  city text,
  department text,
  postal_box text,
  phone text,
  email text,
  website text,
  collective_agreement text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_organizations" ON organizations;
CREATE POLICY "anon_crud_organizations" ON organizations FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL DEFAULT 'employee',
  avatar text,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_users" ON users;
CREATE POLICY "anon_crud_users" ON users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  name text NOT NULL,
  description text,
  manager_id uuid REFERENCES users(id),
  parent_id uuid,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_departments" ON departments;
CREATE POLICY "anon_crud_departments" ON departments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Positions
CREATE TABLE IF NOT EXISTS positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  title text NOT NULL,
  description text,
  category text,
  coefficient integer,
  min_salary numeric(12,0),
  max_salary numeric(12,0),
  department_id uuid REFERENCES departments(id),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_positions" ON positions;
CREATE POLICY "anon_crud_positions" ON positions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Employees
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  matricule text NOT NULL,
  department_id uuid REFERENCES departments(id),
  position_id uuid REFERENCES positions(id),
  manager_id uuid,
  status text NOT NULL DEFAULT 'active',
  contract_type text NOT NULL,
  professional_category text,
  hire_date date NOT NULL,
  contract_start_date date,
  contract_end_date date,
  termination_date date,
  probation_end_date date,
  birth_date date,
  birth_place text,
  nationality text DEFAULT 'Béninoise',
  gender text,
  marital_status text,
  number_of_children integer DEFAULT 0,
  address text,
  city text,
  department text,
  phone text,
  personal_email text,
  cni_number text,
  cni_expiry date,
  passport_number text,
  passport_expiry date,
  emergency_contact text,
  emergency_phone text,
  emergency_relation text,
  cnss_number text,
  bank_name text,
  bank_account_number text,
  bank_account_name text,
  base_salary numeric(12,0),
  transport_allowance numeric(12,0) DEFAULT '0',
  housing_allowance numeric(12,0) DEFAULT '0',
  other_allowances numeric(12,0) DEFAULT '0',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_employees" ON employees;
CREATE POLICY "anon_crud_employees" ON employees FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Career History
CREATE TABLE IF NOT EXISTS career_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) NOT NULL,
  position_id uuid REFERENCES positions(id),
  department_id uuid REFERENCES departments(id),
  category text,
  base_salary numeric(12,0),
  start_date date NOT NULL,
  end_date date,
  change_type text,
  reason text,
  decision_reference text,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE career_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_career_history" ON career_history;
CREATE POLICY "anon_crud_career_history" ON career_history FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  name text NOT NULL,
  category text,
  description text,
  created_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_skills" ON skills;
CREATE POLICY "anon_crud_skills" ON skills FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Employee Skills
CREATE TABLE IF NOT EXISTS employee_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) NOT NULL,
  skill_id uuid REFERENCES skills(id) NOT NULL,
  level text NOT NULL,
  certified_date date,
  expiry_date date,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE employee_skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_employee_skills" ON employee_skills;
CREATE POLICY "anon_crud_employee_skills" ON employee_skills FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Leave Requests
CREATE TABLE IF NOT EXISTS leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) NOT NULL,
  type text NOT NULL,
  family_event text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  days numeric(4,1) NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'pending',
  approved_by uuid REFERENCES users(id),
  approved_at timestamptz,
  rejection_reason text,
  medical_certificate boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_leave_requests" ON leave_requests;
CREATE POLICY "anon_crud_leave_requests" ON leave_requests FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Leave Balances
CREATE TABLE IF NOT EXISTS leave_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) NOT NULL,
  year integer NOT NULL,
  type text NOT NULL,
  entitled numeric(5,1) NOT NULL,
  carried numeric(5,1) DEFAULT '0',
  taken numeric(5,1) DEFAULT '0' NOT NULL,
  pending numeric(5,1) DEFAULT '0' NOT NULL,
  remaining numeric(5,1) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_leave_balances" ON leave_balances;
CREATE POLICY "anon_crud_leave_balances" ON leave_balances FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Evaluations
CREATE TABLE IF NOT EXISTS evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) NOT NULL,
  evaluator_id uuid REFERENCES users(id) NOT NULL,
  period text NOT NULL,
  type text DEFAULT 'annual',
  status text NOT NULL DEFAULT 'draft',
  overall_rating numeric(3,1),
  strengths text,
  improvements text,
  goals text,
  training_needs text,
  employee_comments text,
  evaluator_comments text,
  promotion_recommendation boolean DEFAULT false,
  salary_increase_recommendation numeric(5,2),
  scheduled_date date,
  completed_date date,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_evaluations" ON evaluations;
CREATE POLICY "anon_crud_evaluations" ON evaluations FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Objectives
CREATE TABLE IF NOT EXISTS objectives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) NOT NULL,
  evaluation_id uuid REFERENCES evaluations(id),
  title text NOT NULL,
  description text,
  target_date date,
  progress integer DEFAULT 0,
  weight integer DEFAULT 100,
  status text DEFAULT 'in_progress',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE objectives ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_objectives" ON objectives;
CREATE POLICY "anon_crud_objectives" ON objectives FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Trainings
CREATE TABLE IF NOT EXISTS trainings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  title text NOT NULL,
  description text,
  provider text,
  location text,
  duration integer,
  cost numeric(12,0),
  category text,
  is_external boolean DEFAULT false,
  is_certifying boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_trainings" ON trainings;
CREATE POLICY "anon_crud_trainings" ON trainings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Employee Trainings
CREATE TABLE IF NOT EXISTS employee_trainings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) NOT NULL,
  training_id uuid REFERENCES trainings(id) NOT NULL,
  status text NOT NULL DEFAULT 'planned',
  start_date date,
  end_date date,
  score numeric(5,2),
  certificate text,
  certificate_date date,
  feedback text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE employee_trainings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_employee_trainings" ON employee_trainings;
CREATE POLICY "anon_crud_employee_trainings" ON employee_trainings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id),
  organization_id uuid REFERENCES organizations(id),
  name text NOT NULL,
  type text NOT NULL,
  document_code text,
  reference text,
  url text,
  issue_date date,
  expiry_date date,
  is_confidential boolean DEFAULT false,
  uploaded_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_documents" ON documents;
CREATE POLICY "anon_crud_documents" ON documents FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Job Postings
CREATE TABLE IF NOT EXISTS job_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  position_id uuid REFERENCES positions(id),
  title text NOT NULL,
  description text,
  requirements text,
  qualifications text,
  experience text,
  benefits text,
  location text,
  department text,
  category text,
  salary_min numeric(12,0),
  salary_max numeric(12,0),
  contract_type text,
  status text NOT NULL DEFAULT 'open',
  published_at timestamptz,
  closing_date date,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_job_postings" ON job_postings;
CREATE POLICY "anon_crud_job_postings" ON job_postings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Candidates
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_posting_id uuid REFERENCES job_postings(id) NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  city text,
  resume_url text,
  cover_letter text,
  status text NOT NULL DEFAULT 'new',
  rating integer,
  notes text,
  source text,
  interview_date timestamptz,
  applied_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_candidates" ON candidates;
CREATE POLICY "anon_crud_candidates" ON candidates FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Payslips
CREATE TABLE IF NOT EXISTS payslips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) NOT NULL,
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  period text NOT NULL,
  year integer NOT NULL,
  month integer NOT NULL,
  base_salary numeric(12,0) NOT NULL,
  seniority_bonus numeric(12,0) DEFAULT '0',
  transport_allowance numeric(12,0) DEFAULT '0',
  housing_allowance numeric(12,0) DEFAULT '0',
  family_allowance numeric(12,0) DEFAULT '0',
  other_allowances numeric(12,0) DEFAULT '0',
  overtime numeric(12,0) DEFAULT '0',
  bonus numeric(12,0) DEFAULT '0',
  gross_salary numeric(12,0) NOT NULL,
  cnss_employee numeric(12,0) NOT NULL,
  cnss_employer numeric(12,0) NOT NULL,
  its numeric(12,0) NOT NULL,
  other_deductions numeric(12,0) DEFAULT '0',
  total_deductions numeric(12,0) NOT NULL,
  net_salary numeric(12,0) NOT NULL,
  total_employer_cost numeric(12,0) NOT NULL,
  cumul_gross numeric(12,0),
  cumul_net numeric(12,0),
  cumul_cnss numeric(12,0),
  cumul_its numeric(12,0),
  status text DEFAULT 'draft',
  validated_by uuid REFERENCES users(id),
  validated_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_payslips" ON payslips;
CREATE POLICY "anon_crud_payslips" ON payslips FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  is_read boolean DEFAULT false,
  link text,
  created_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_notifications" ON notifications;
CREATE POLICY "anon_crud_notifications" ON notifications FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Sync Queue
CREATE TABLE IF NOT EXISTS sync_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id text,
  data text,
  is_synced boolean DEFAULT false,
  synced_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE sync_queue ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_sync_queue" ON sync_queue;
CREATE POLICY "anon_crud_sync_queue" ON sync_queue FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
