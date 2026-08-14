import { pgTable, text, timestamp, integer, boolean, decimal, date, uuid, pgEnum } from 'drizzle-orm/pg-core';

// Enums adaptés au système OHADA - Bénin
export const employeeStatusEnum = pgEnum('employee_status', ['active', 'inactive', 'on_leave', 'suspended', 'terminated']);
export const contractTypeEnum = pgEnum('contract_type', ['cdi', 'cdd', 'cdd_remplacement', 'saisonnier', 'journalier', 'apprentissage', 'stage', 'professionnalisation']);
export const leaveStatusEnum = pgEnum('leave_status', ['pending', 'approved', 'rejected', 'cancelled']);
export const leaveTypeEnum = pgEnum('leave_type', ['annual', 'sick', 'maternity', 'paternity', 'family_event', 'unpaid', 'recovery', 'other']);
export const evaluationStatusEnum = pgEnum('evaluation_status', ['draft', 'in_progress', 'completed']);
export const skillLevelEnum = pgEnum('skill_level', ['debutant', 'intermediaire', 'avance', 'expert']);
export const trainingStatusEnum = pgEnum('training_status', ['planned', 'in_progress', 'completed', 'cancelled']);
export const recruitmentStatusEnum = pgEnum('recruitment_status', ['open', 'in_progress', 'closed', 'on_hold']);
export const candidateStatusEnum = pgEnum('candidate_status', ['new', 'screening', 'interview', 'offer', 'hired', 'rejected']);
export const professionalCategoryEnum = pgEnum('professional_category', ['M1', 'M2', 'OS1', 'OS2', 'OP1', 'OP2', 'OHQ', 'E1', 'E2', 'E3', 'AM1', 'AM2', 'AM3', 'C1', 'C2', 'C3', 'C4']);
export const familyEventEnum = pgEnum('family_event', ['mariage_salarie', 'mariage_enfant', 'naissance', 'deces_conjoint', 'deces_enfant', 'deces_parent', 'deces_beauparent', 'deces_frere', 'demenagement', 'bapteme', 'communion']);

// Organizations / Companies (multi-tenant) - Adapté OHADA
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  tradeName: text('trade_name'), // Nom commercial
  logo: text('logo'),
  legalForm: text('legal_form'), // SARL, SA, SAS, etc. selon OHADA
  industry: text('industry'),
  rccm: text('rccm'), // Registre du Commerce et du Crédit Mobilier
  ifu: text('ifu'), // Identifiant Fiscal Unique (Bénin)
  cnssNumber: text('cnss_number'), // Numéro CNSS employeur
  address: text('address'),
  city: text('city'),
  department: text('department'), // Département du Bénin
  postalBox: text('postal_box'), // Boîte Postale
  phone: text('phone'),
  email: text('email'),
  website: text('website'),
  collectiveAgreement: text('collective_agreement'), // Convention collective applicable
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Users (for authentication)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: text('role').notNull().default('employee'), // admin, hr_manager, manager, employee
  avatar: text('avatar'),
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Departments
export const departments = pgTable('departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  managerId: uuid('manager_id').references(() => users.id),
  parentId: uuid('parent_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Positions / Job Titles - Adapté catégories professionnelles OHADA
export const positions = pgTable('positions', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  category: professionalCategoryEnum('category'), // Catégorie professionnelle
  coefficient: integer('coefficient'), // Coefficient hiérarchique
  minSalary: decimal('min_salary', { precision: 12, scale: 0 }), // En FCFA
  maxSalary: decimal('max_salary', { precision: 12, scale: 0 }),
  departmentId: uuid('department_id').references(() => departments.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Employees - Adapté au système béninois
export const employees = pgTable('employees', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  matricule: text('matricule').notNull(), // Matricule employé
  departmentId: uuid('department_id').references(() => departments.id),
  positionId: uuid('position_id').references(() => positions.id),
  managerId: uuid('manager_id'), // Self-reference
  status: employeeStatusEnum('status').default('active').notNull(),
  contractType: contractTypeEnum('contract_type').notNull(),
  professionalCategory: professionalCategoryEnum('professional_category'),
  hireDate: date('hire_date').notNull(),
  contractStartDate: date('contract_start_date'),
  contractEndDate: date('contract_end_date'), // Pour CDD
  terminationDate: date('termination_date'),
  probationEndDate: date('probation_end_date'), // Fin période d'essai
  
  // Informations personnelles
  birthDate: date('birth_date'),
  birthPlace: text('birth_place'),
  nationality: text('nationality').default('Béninoise'),
  gender: text('gender'), // M, F
  maritalStatus: text('marital_status'), // celibataire, marie, divorce, veuf
  numberOfChildren: integer('number_of_children').default(0),
  
  // Coordonnées
  address: text('address'),
  city: text('city'),
  department: text('department'), // Département du Bénin
  phone: text('phone'),
  personalEmail: text('personal_email'),
  
  // Documents d'identité
  cniNumber: text('cni_number'), // Carte Nationale d'Identité
  cniExpiry: date('cni_expiry'),
  passportNumber: text('passport_number'),
  passportExpiry: date('passport_expiry'),
  
  // Contact d'urgence
  emergencyContact: text('emergency_contact'),
  emergencyPhone: text('emergency_phone'),
  emergencyRelation: text('emergency_relation'),
  
  // Informations bancaires et sociales
  cnssNumber: text('cnss_number'), // Numéro CNSS
  bankName: text('bank_name'),
  bankAccountNumber: text('bank_account_number'),
  bankAccountName: text('bank_account_name'),
  
  // Rémunération (en FCFA)
  baseSalary: decimal('base_salary', { precision: 12, scale: 0 }),
  transportAllowance: decimal('transport_allowance', { precision: 12, scale: 0 }).default('0'),
  housingAllowance: decimal('housing_allowance', { precision: 12, scale: 0 }).default('0'),
  otherAllowances: decimal('other_allowances', { precision: 12, scale: 0 }).default('0'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Career History (promotions, position changes)
export const careerHistory = pgTable('career_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  employeeId: uuid('employee_id').references(() => employees.id).notNull(),
  positionId: uuid('position_id').references(() => positions.id),
  departmentId: uuid('department_id').references(() => departments.id),
  category: professionalCategoryEnum('category'),
  baseSalary: decimal('base_salary', { precision: 12, scale: 0 }),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  changeType: text('change_type'), // promotion, mutation, reclassement
  reason: text('reason'),
  decisionReference: text('decision_reference'), // Référence de la décision
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Skills
export const skills = pgTable('skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  name: text('name').notNull(),
  category: text('category'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Employee Skills
export const employeeSkills = pgTable('employee_skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  employeeId: uuid('employee_id').references(() => employees.id).notNull(),
  skillId: uuid('skill_id').references(() => skills.id).notNull(),
  level: skillLevelEnum('level').notNull(),
  certifiedDate: date('certified_date'),
  expiryDate: date('expiry_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Leave Requests - Adapté au Code du Travail Béninois
export const leaveRequests = pgTable('leave_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  employeeId: uuid('employee_id').references(() => employees.id).notNull(),
  type: leaveTypeEnum('type').notNull(),
  familyEvent: familyEventEnum('family_event'), // Si type = family_event
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  days: decimal('days', { precision: 4, scale: 1 }).notNull(),
  reason: text('reason'),
  status: leaveStatusEnum('status').default('pending').notNull(),
  approvedBy: uuid('approved_by').references(() => users.id),
  approvedAt: timestamp('approved_at'),
  rejectionReason: text('rejection_reason'),
  medicalCertificate: boolean('medical_certificate').default(false), // Pour congé maladie
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Leave Balances - Adapté aux droits béninois
export const leaveBalances = pgTable('leave_balances', {
  id: uuid('id').primaryKey().defaultRandom(),
  employeeId: uuid('employee_id').references(() => employees.id).notNull(),
  year: integer('year').notNull(),
  type: leaveTypeEnum('type').notNull(),
  entitled: decimal('entitled', { precision: 5, scale: 1 }).notNull(), // Droit acquis
  carried: decimal('carried', { precision: 5, scale: 1 }).default('0'), // Report année précédente
  taken: decimal('taken', { precision: 5, scale: 1 }).default('0').notNull(),
  pending: decimal('pending', { precision: 5, scale: 1 }).default('0').notNull(),
  remaining: decimal('remaining', { precision: 5, scale: 1 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Performance Evaluations
export const evaluations = pgTable('evaluations', {
  id: uuid('id').primaryKey().defaultRandom(),
  employeeId: uuid('employee_id').references(() => employees.id).notNull(),
  evaluatorId: uuid('evaluator_id').references(() => users.id).notNull(),
  period: text('period').notNull(),
  type: text('type').default('annual'), // annual, probation, promotion
  status: evaluationStatusEnum('status').default('draft').notNull(),
  overallRating: decimal('overall_rating', { precision: 3, scale: 1 }),
  strengths: text('strengths'),
  improvements: text('improvements'),
  goals: text('goals'),
  trainingNeeds: text('training_needs'),
  employeeComments: text('employee_comments'),
  evaluatorComments: text('evaluator_comments'),
  promotionRecommendation: boolean('promotion_recommendation').default(false),
  salaryIncreaseRecommendation: decimal('salary_increase_recommendation', { precision: 5, scale: 2 }),
  scheduledDate: date('scheduled_date'),
  completedDate: date('completed_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Objectives / Goals
export const objectives = pgTable('objectives', {
  id: uuid('id').primaryKey().defaultRandom(),
  employeeId: uuid('employee_id').references(() => employees.id).notNull(),
  evaluationId: uuid('evaluation_id').references(() => evaluations.id),
  title: text('title').notNull(),
  description: text('description'),
  targetDate: date('target_date'),
  progress: integer('progress').default(0),
  weight: integer('weight').default(100),
  status: text('status').default('in_progress'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Trainings
export const trainings = pgTable('trainings', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  provider: text('provider'),
  location: text('location'),
  duration: integer('duration'), // in hours
  cost: decimal('cost', { precision: 12, scale: 0 }), // En FCFA
  category: text('category'),
  isExternal: boolean('is_external').default(false),
  isCertifying: boolean('is_certifying').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Employee Trainings
export const employeeTrainings = pgTable('employee_trainings', {
  id: uuid('id').primaryKey().defaultRandom(),
  employeeId: uuid('employee_id').references(() => employees.id).notNull(),
  trainingId: uuid('training_id').references(() => trainings.id).notNull(),
  status: trainingStatusEnum('status').default('planned').notNull(),
  startDate: date('start_date'),
  endDate: date('end_date'),
  score: decimal('score', { precision: 5, scale: 2 }),
  certificate: text('certificate'),
  certificateDate: date('certificate_date'),
  feedback: text('feedback'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Documents - Adapté aux documents légaux OHADA
export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  employeeId: uuid('employee_id').references(() => employees.id),
  organizationId: uuid('organization_id').references(() => organizations.id),
  name: text('name').notNull(),
  type: text('type').notNull(), // contrat, avenant, cni, cnss, bulletin_paie, certificat, attestation
  documentCode: text('document_code'), // Code du type de document légal
  reference: text('reference'), // Référence du document
  url: text('url'),
  issueDate: date('issue_date'),
  expiryDate: date('expiry_date'),
  isConfidential: boolean('is_confidential').default(false),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Job Postings (Recruitment)
export const jobPostings = pgTable('job_postings', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  positionId: uuid('position_id').references(() => positions.id),
  title: text('title').notNull(),
  description: text('description'),
  requirements: text('requirements'),
  qualifications: text('qualifications'),
  experience: text('experience'),
  benefits: text('benefits'),
  location: text('location'),
  department: text('department'),
  category: professionalCategoryEnum('category'),
  salaryMin: decimal('salary_min', { precision: 12, scale: 0 }),
  salaryMax: decimal('salary_max', { precision: 12, scale: 0 }),
  contractType: contractTypeEnum('contract_type'),
  status: recruitmentStatusEnum('status').default('open').notNull(),
  publishedAt: timestamp('published_at'),
  closingDate: date('closing_date'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Candidates
export const candidates = pgTable('candidates', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobPostingId: uuid('job_posting_id').references(() => jobPostings.id).notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  city: text('city'),
  resumeUrl: text('resume_url'),
  coverLetter: text('cover_letter'),
  status: candidateStatusEnum('status').default('new').notNull(),
  rating: integer('rating'),
  notes: text('notes'),
  source: text('source'),
  interviewDate: timestamp('interview_date'),
  appliedAt: timestamp('applied_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Payroll - Bulletins de paie
export const payslips = pgTable('payslips', {
  id: uuid('id').primaryKey().defaultRandom(),
  employeeId: uuid('employee_id').references(() => employees.id).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  period: text('period').notNull(), // Format: 2024-01
  year: integer('year').notNull(),
  month: integer('month').notNull(),
  
  // Éléments de rémunération (FCFA)
  baseSalary: decimal('base_salary', { precision: 12, scale: 0 }).notNull(),
  seniorityBonus: decimal('seniority_bonus', { precision: 12, scale: 0 }).default('0'),
  transportAllowance: decimal('transport_allowance', { precision: 12, scale: 0 }).default('0'),
  housingAllowance: decimal('housing_allowance', { precision: 12, scale: 0 }).default('0'),
  familyAllowance: decimal('family_allowance', { precision: 12, scale: 0 }).default('0'),
  otherAllowances: decimal('other_allowances', { precision: 12, scale: 0 }).default('0'),
  overtime: decimal('overtime', { precision: 12, scale: 0 }).default('0'),
  bonus: decimal('bonus', { precision: 12, scale: 0 }).default('0'),
  grossSalary: decimal('gross_salary', { precision: 12, scale: 0 }).notNull(),
  
  // Cotisations et retenues
  cnssEmployee: decimal('cnss_employee', { precision: 12, scale: 0 }).notNull(), // Cotisation CNSS salarié
  cnssEmployer: decimal('cnss_employer', { precision: 12, scale: 0 }).notNull(), // Cotisation CNSS employeur
  its: decimal('its', { precision: 12, scale: 0 }).notNull(), // Impôt sur Traitements et Salaires
  otherDeductions: decimal('other_deductions', { precision: 12, scale: 0 }).default('0'),
  totalDeductions: decimal('total_deductions', { precision: 12, scale: 0 }).notNull(),
  
  netSalary: decimal('net_salary', { precision: 12, scale: 0 }).notNull(),
  totalEmployerCost: decimal('total_employer_cost', { precision: 12, scale: 0 }).notNull(),
  
  // Cumuls
  cumulGross: decimal('cumul_gross', { precision: 12, scale: 0 }),
  cumulNet: decimal('cumul_net', { precision: 12, scale: 0 }),
  cumulCnss: decimal('cumul_cnss', { precision: 12, scale: 0 }),
  cumulIts: decimal('cumul_its', { precision: 12, scale: 0 }),
  
  status: text('status').default('draft'), // draft, validated, paid
  validatedBy: uuid('validated_by').references(() => users.id),
  validatedAt: timestamp('validated_at'),
  paidAt: timestamp('paid_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(),
  isRead: boolean('is_read').default(false),
  link: text('link'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Offline Sync Queue (for PWA offline support)
export const syncQueue = pgTable('sync_queue', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  action: text('action').notNull(),
  tableName: text('table_name').notNull(),
  recordId: text('record_id'),
  data: text('data'),
  isSynced: boolean('is_synced').default(false),
  syncedAt: timestamp('synced_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Types
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Department = typeof departments.$inferSelect;
export type Position = typeof positions.$inferSelect;
export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
export type CareerHistory = typeof careerHistory.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type EmployeeSkill = typeof employeeSkills.$inferSelect;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type LeaveBalance = typeof leaveBalances.$inferSelect;
export type Evaluation = typeof evaluations.$inferSelect;
export type Objective = typeof objectives.$inferSelect;
export type Training = typeof trainings.$inferSelect;
export type EmployeeTraining = typeof employeeTrainings.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type JobPosting = typeof jobPostings.$inferSelect;
export type Candidate = typeof candidates.$inferSelect;
export type Payslip = typeof payslips.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
