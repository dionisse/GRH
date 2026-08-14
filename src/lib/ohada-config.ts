// Configuration OHADA - Bénin
// Conforme au Code du Travail Béninois et aux normes OHADA

export const OHADA_CONFIG = {
  country: {
    code: "BJ",
    name: "Bénin",
    currency: "XOF",
    currencySymbol: "FCFA",
    currencyLocale: "fr-BJ",
    phoneCode: "+229",
    timezone: "Africa/Porto-Novo",
    language: "fr",
  },

  // Jours fériés légaux au Bénin (2024)
  holidays: [
    { date: "01-01", name: "Jour de l'An", type: "fixed" },
    { date: "01-10", name: "Fête du Vodoun", type: "fixed" },
    { date: "05-01", name: "Fête du Travail", type: "fixed" },
    { date: "08-01", name: "Fête Nationale", type: "fixed" },
    { date: "08-15", name: "Assomption", type: "fixed" },
    { date: "11-01", name: "Toussaint", type: "fixed" },
    { date: "12-25", name: "Noël", type: "fixed" },
    // Fêtes mobiles (à calculer chaque année)
    { date: "variable", name: "Lundi de Pâques", type: "mobile" },
    { date: "variable", name: "Ascension", type: "mobile" },
    { date: "variable", name: "Lundi de Pentecôte", type: "mobile" },
    { date: "variable", name: "Tabaski (Eid al-Adha)", type: "mobile" },
    { date: "variable", name: "Maouloud (Mawlid)", type: "mobile" },
    { date: "variable", name: "Ramadan (Eid al-Fitr)", type: "mobile" },
  ],

  // Types de contrats selon le Code du Travail Béninois
  contractTypes: [
    { value: "cdi", label: "CDI - Contrat à Durée Indéterminée", description: "Contrat sans terme fixé" },
    { value: "cdd", label: "CDD - Contrat à Durée Déterminée", description: "Durée max 2 ans, renouvelable 1 fois" },
    { value: "cdd_remplacement", label: "CDD de Remplacement", description: "Remplacement d'un salarié absent" },
    { value: "saisonnier", label: "Contrat Saisonnier", description: "Travaux saisonniers" },
    { value: "journalier", label: "Contrat Journalier", description: "Engagement à la journée" },
    { value: "apprentissage", label: "Contrat d'Apprentissage", description: "Formation professionnelle, 1-3 ans" },
    { value: "stage", label: "Convention de Stage", description: "Stage de formation" },
    { value: "professionnalisation", label: "Contrat de Professionnalisation", description: "Insertion professionnelle" },
  ],

  // Catégories professionnelles selon la convention collective
  professionalCategories: [
    { code: "M1", label: "Manœuvre ordinaire", minSalary: 52000 },
    { code: "M2", label: "Manœuvre spécialisé", minSalary: 54000 },
    { code: "OS1", label: "Ouvrier spécialisé 1er échelon", minSalary: 58000 },
    { code: "OS2", label: "Ouvrier spécialisé 2ème échelon", minSalary: 62000 },
    { code: "OP1", label: "Ouvrier professionnel 1er échelon", minSalary: 68000 },
    { code: "OP2", label: "Ouvrier professionnel 2ème échelon", minSalary: 75000 },
    { code: "OHQ", label: "Ouvrier hautement qualifié", minSalary: 85000 },
    { code: "E1", label: "Employé 1er échelon", minSalary: 60000 },
    { code: "E2", label: "Employé 2ème échelon", minSalary: 68000 },
    { code: "E3", label: "Employé 3ème échelon", minSalary: 78000 },
    { code: "AM1", label: "Agent de maîtrise 1er échelon", minSalary: 95000 },
    { code: "AM2", label: "Agent de maîtrise 2ème échelon", minSalary: 115000 },
    { code: "AM3", label: "Agent de maîtrise principal", minSalary: 140000 },
    { code: "C1", label: "Cadre débutant", minSalary: 180000 },
    { code: "C2", label: "Cadre confirmé", minSalary: 250000 },
    { code: "C3", label: "Cadre supérieur", minSalary: 350000 },
    { code: "C4", label: "Cadre dirigeant", minSalary: 500000 },
  ],

  // SMIG (Salaire Minimum Interprofessionnel Garanti) - Bénin 2024
  smig: {
    monthly: 52000, // FCFA
    hourly: 302, // FCFA (52000 / 173.33 heures)
    effectiveDate: "2024-01-01",
  },

  // Durée légale du travail
  workTime: {
    weeklyHours: 40,
    dailyHours: 8,
    maxOvertimeWeekly: 20,
    overtimeRates: {
      normal: 1.15, // 15% de majoration (heures supp normales)
      night: 1.50, // 50% de majoration (heures de nuit 21h-5h)
      sunday: 1.50, // 50% de majoration (dimanche)
      holiday: 2.00, // 100% de majoration (jour férié)
      nightSunday: 2.00, // 100% (nuit + dimanche)
    },
  },

  // Congés légaux selon le Code du Travail Béninois
  leaves: {
    // Congés payés annuels
    annual: {
      daysPerMonth: 2, // 2 jours ouvrables par mois
      daysPerYear: 24, // 24 jours ouvrables par an
      seniorityBonus: [
        { years: 5, extraDays: 1 },
        { years: 10, extraDays: 2 },
        { years: 15, extraDays: 3 },
        { years: 20, extraDays: 4 },
        { years: 25, extraDays: 6 },
      ],
      motherBonus: 2, // 2 jours supplémentaires par enfant de moins de 15 ans
    },

    // Congés de maternité
    maternity: {
      prenatal: 6, // 6 semaines avant accouchement
      postnatal: 8, // 8 semaines après accouchement
      total: 14, // 14 semaines au total
      paid: true,
      paidBy: "cnss", // CNSS prend en charge
    },

    // Congés de paternité
    paternity: {
      days: 3,
      paid: true,
      paidBy: "employer",
    },

    // Congés pour événements familiaux (jours ouvrables)
    familyEvents: [
      { event: "mariage_salarie", days: 3, label: "Mariage du salarié" },
      { event: "mariage_enfant", days: 2, label: "Mariage d'un enfant" },
      { event: "naissance", days: 3, label: "Naissance d'un enfant" },
      { event: "deces_conjoint", days: 5, label: "Décès du conjoint" },
      { event: "deces_enfant", days: 5, label: "Décès d'un enfant" },
      { event: "deces_parent", days: 3, label: "Décès père/mère" },
      { event: "deces_beauparent", days: 2, label: "Décès beau-père/belle-mère" },
      { event: "deces_frere", days: 2, label: "Décès frère/sœur" },
      { event: "demenagement", days: 1, label: "Déménagement" },
      { event: "bapteme", days: 1, label: "Baptême d'un enfant" },
      { event: "communion", days: 1, label: "Première communion" },
    ],

    // Congé maladie
    sickLeave: {
      maxDaysPerYear: 180,
      waitingPeriod: 3, // Jours de carence
      employerPayment: {
        period1: { months: 3, rate: 1.0 }, // 100% pendant 3 mois
        period2: { months: 3, rate: 0.5 }, // 50% pendant 3 mois suivants
      },
    },
  },

  // Cotisations sociales CNSS (Caisse Nationale de Sécurité Sociale)
  socialContributions: {
    cnss: {
      // Cotisations CNSS
      employee: {
        pension: 0.036, // 3.6% - Vieillesse
        total: 0.036,
      },
      employer: {
        pension: 0.064, // 6.4% - Vieillesse
        familyAllowance: 0.09, // 9% - Prestations familiales
        workAccident: 0.02, // 2% - Accidents du travail (taux variable selon secteur)
        total: 0.174, // 17.4% total employeur
      },
      ceiling: 600000, // Plafond mensuel CNSS en FCFA
    },
  },

  // ITS (Impôt sur Traitements et Salaires) - Barème progressif Bénin
  its: {
    // Tranches d'imposition
    brackets: [
      { min: 0, max: 60000, rate: 0 }, // Exonéré
      { min: 60001, max: 150000, rate: 0.10 }, // 10%
      { min: 150001, max: 250000, rate: 0.15 }, // 15%
      { min: 250001, max: 500000, rate: 0.19 }, // 19%
      { min: 500001, max: 1000000, rate: 0.24 }, // 24%
      { min: 1000001, max: Infinity, rate: 0.30 }, // 30%
    ],
    // Abattement forfaitaire
    standardDeduction: 0.20, // 20% d'abattement forfaitaire
    maxDeduction: 900000, // Plafond d'abattement annuel
  },

  // Allocations familiales
  familyAllowances: {
    perChild: 2500, // FCFA par enfant par mois
    maxChildren: 6, // Maximum 6 enfants
    maxAge: 21, // Jusqu'à 21 ans (ou 25 si étudiant)
  },

  // Indemnités légales
  allowances: {
    transport: {
      min: 10000, // Indemnité transport minimum
      taxExempt: 25000, // Exonération fiscale max
    },
    housing: {
      taxExemptRate: 0.15, // 15% du salaire brut exonéré
    },
    seniority: {
      // Prime d'ancienneté obligatoire
      rates: [
        { years: 2, rate: 0.02 }, // 2% après 2 ans
        { years: 5, rate: 0.03 }, // 3% après 5 ans
        { years: 10, rate: 0.05 }, // 5% après 10 ans
        { years: 15, rate: 0.07 }, // 7% après 15 ans
        { years: 20, rate: 0.10 }, // 10% après 20 ans
        { years: 25, rate: 0.15 }, // 15% après 25 ans
      ],
    },
  },

  // Préavis de licenciement/démission selon ancienneté
  noticePeriod: {
    workers: [
      { maxYears: 1, days: 15 },
      { maxYears: 5, months: 1 },
      { maxYears: Infinity, months: 2 },
    ],
    employees: [
      { maxYears: 1, months: 1 },
      { maxYears: 5, months: 2 },
      { maxYears: Infinity, months: 3 },
    ],
    supervisors: [
      { maxYears: 1, months: 1 },
      { maxYears: 5, months: 3 },
      { maxYears: Infinity, months: 4 },
    ],
    managers: [
      { maxYears: Infinity, months: 3 },
    ],
  },

  // Indemnités de licenciement
  severancePay: {
    perYearOfService: 0.30, // 30% du salaire mensuel par année de service
    minimum: 1, // Minimum 1 an d'ancienneté requis
  },

  // Documents légaux requis
  legalDocuments: [
    { code: "registre_employeur", name: "Registre de l'employeur", mandatory: true },
    { code: "declaration_embauche", name: "Déclaration d'embauche CNSS", mandatory: true },
    { code: "contrat_travail", name: "Contrat de travail", mandatory: true },
    { code: "bulletin_paie", name: "Bulletin de paie", mandatory: true },
    { code: "certificat_travail", name: "Certificat de travail", mandatory: true },
    { code: "attestation_conges", name: "Attestation de congés", mandatory: false },
    { code: "attestation_cnss", name: "Attestation CNSS", mandatory: true },
    { code: "carte_professionnelle", name: "Carte professionnelle", mandatory: false },
  ],

  // Départements/Régions du Bénin
  departments: [
    { code: "AL", name: "Alibori", capital: "Kandi" },
    { code: "AK", name: "Atacora", capital: "Natitingou" },
    { code: "AQ", name: "Atlantique", capital: "Ouidah" },
    { code: "BO", name: "Borgou", capital: "Parakou" },
    { code: "CO", name: "Collines", capital: "Dassa-Zoumé" },
    { code: "DO", name: "Donga", capital: "Djougou" },
    { code: "KO", name: "Kouffo", capital: "Aplahoué" },
    { code: "LI", name: "Littoral", capital: "Cotonou" },
    { code: "MO", name: "Mono", capital: "Lokossa" },
    { code: "OU", name: "Ouémé", capital: "Porto-Novo" },
    { code: "PL", name: "Plateau", capital: "Sakété" },
    { code: "ZO", name: "Zou", capital: "Abomey" },
  ],
};

// Fonctions utilitaires

/**
 * Formate un montant en FCFA
 */
export function formatCFA(amount: number): string {
  return new Intl.NumberFormat("fr-BJ", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " FCFA";
}

/**
 * Calcule le nombre de jours de congés annuels selon l'ancienneté
 */
export function calculateAnnualLeave(
  yearsOfService: number,
  numberOfChildren: number = 0,
  isMother: boolean = false
): number {
  let days = OHADA_CONFIG.leaves.annual.daysPerYear;

  // Bonus d'ancienneté
  for (const bonus of OHADA_CONFIG.leaves.annual.seniorityBonus) {
    if (yearsOfService >= bonus.years) {
      days += bonus.extraDays;
    }
  }

  // Bonus pour mères de famille
  if (isMother && numberOfChildren > 0) {
    days += Math.min(numberOfChildren, 4) * OHADA_CONFIG.leaves.annual.motherBonus;
  }

  return days;
}

/**
 * Calcule la prime d'ancienneté
 */
export function calculateSeniorityBonus(baseSalary: number, yearsOfService: number): number {
  let rate = 0;
  for (const level of OHADA_CONFIG.allowances.seniority.rates) {
    if (yearsOfService >= level.years) {
      rate = level.rate;
    }
  }
  return baseSalary * rate;
}

/**
 * Calcule les cotisations CNSS
 */
export function calculateCNSS(grossSalary: number): {
  employeeContribution: number;
  employerContribution: number;
  total: number;
} {
  const ceiling = OHADA_CONFIG.socialContributions.cnss.ceiling;
  const taxableAmount = Math.min(grossSalary, ceiling);

  const employeeContribution = taxableAmount * OHADA_CONFIG.socialContributions.cnss.employee.total;
  const employerContribution = taxableAmount * OHADA_CONFIG.socialContributions.cnss.employer.total;

  return {
    employeeContribution: Math.round(employeeContribution),
    employerContribution: Math.round(employerContribution),
    total: Math.round(employeeContribution + employerContribution),
  };
}

/**
 * Calcule l'ITS (Impôt sur Traitements et Salaires)
 */
export function calculateITS(grossSalary: number): number {
  // Appliquer l'abattement forfaitaire de 20%
  const deduction = Math.min(
    grossSalary * OHADA_CONFIG.its.standardDeduction,
    OHADA_CONFIG.its.maxDeduction / 12
  );
  const taxableIncome = grossSalary - deduction;

  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of OHADA_CONFIG.its.brackets) {
    if (remainingIncome <= 0) break;

    const taxableInBracket = Math.min(
      remainingIncome,
      bracket.max - bracket.min + 1
    );
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }

  return Math.round(tax);
}

/**
 * Calcule le salaire net
 */
export function calculateNetSalary(
  grossSalary: number,
  transportAllowance: number = 0,
  housingAllowance: number = 0
): {
  grossSalary: number;
  cnssEmployee: number;
  its: number;
  netSalary: number;
  cnssEmployer: number;
  totalCost: number;
} {
  const cnss = calculateCNSS(grossSalary);
  const its = calculateITS(grossSalary - cnss.employeeContribution);
  
  const netSalary = grossSalary - cnss.employeeContribution - its + transportAllowance + housingAllowance;

  return {
    grossSalary,
    cnssEmployee: cnss.employeeContribution,
    its,
    netSalary: Math.round(netSalary),
    cnssEmployer: cnss.employerContribution,
    totalCost: Math.round(grossSalary + cnss.employerContribution),
  };
}

/**
 * Calcule la durée du préavis
 */
export function calculateNoticePeriod(
  category: "workers" | "employees" | "supervisors" | "managers",
  yearsOfService: number
): string {
  const periods = OHADA_CONFIG.noticePeriod[category];
  for (const period of periods) {
    if (yearsOfService <= period.maxYears) {
      if ("days" in period) {
        return `${period.days} jours`;
      } else {
        return `${period.months} mois`;
      }
    }
  }
  return "3 mois";
}

/**
 * Calcule l'indemnité de licenciement
 */
export function calculateSeverancePay(monthlySalary: number, yearsOfService: number): number {
  if (yearsOfService < OHADA_CONFIG.severancePay.minimum) {
    return 0;
  }
  return Math.round(monthlySalary * OHADA_CONFIG.severancePay.perYearOfService * yearsOfService);
}
