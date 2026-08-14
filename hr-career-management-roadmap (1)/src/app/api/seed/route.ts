import { NextResponse } from "next/server";
import { db } from "@/db";
import { organizations, users, departments, positions, employees, skills, trainings, leaveBalances } from "@/db/schema";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    // Check if already seeded
    const existingOrgs = await db.select().from(organizations).limit(1);
    if (existingOrgs.length > 0) {
      return NextResponse.json({ message: "Database already seeded" });
    }

    // Create organization - Entreprise béninoise
    const [org] = await db
      .insert(organizations)
      .values({
        name: "SOBEMAP SARL",
        tradeName: "SOBEMAP",
        legalForm: "SARL",
        industry: "Technologies de l'Information",
        rccm: "RB/COT/24-A-12345",
        ifu: "3202412345678",
        cnssNumber: "1234567-A",
        address: "Lot 456, Quartier Gbèdjromèdé",
        city: "Cotonou",
        department: "Littoral",
        postalBox: "BP 1234 Cotonou",
        phone: "+229 21 30 00 00",
        email: "contact@sobemap.bj",
        website: "https://sobemap.bj",
        collectiveAgreement: "Convention Collective Interprofessionnelle",
      })
      .returning();

    // Create admin user
    const passwordHash = await bcrypt.hash("admin123", 10);
    const [adminUser] = await db
      .insert(users)
      .values({
        organizationId: org.id,
        email: "admin@sobemap.bj",
        passwordHash,
        firstName: "Administrateur",
        lastName: "RH",
        role: "admin",
      })
      .returning();

    // Create departments
    const [techDept] = await db
      .insert(departments)
      .values({
        organizationId: org.id,
        name: "Direction Technique",
        description: "Développement et infrastructure informatique",
      })
      .returning();

    const [rhDept] = await db
      .insert(departments)
      .values({
        organizationId: org.id,
        name: "Direction des Ressources Humaines",
        description: "Gestion du personnel et administration",
        managerId: adminUser.id,
      })
      .returning();

    const [commercialDept] = await db
      .insert(departments)
      .values({
        organizationId: org.id,
        name: "Direction Commerciale",
        description: "Ventes et relations clients",
      })
      .returning();

    const [financeDept] = await db
      .insert(departments)
      .values({
        organizationId: org.id,
        name: "Direction Administrative et Financière",
        description: "Comptabilité et finances",
      })
      .returning();

    // Create positions with professional categories
    const [devPosition] = await db
      .insert(positions)
      .values({
        organizationId: org.id,
        title: "Développeur Full Stack",
        description: "Développement d'applications web et mobile",
        category: "C1",
        coefficient: 300,
        minSalary: "180000",
        maxSalary: "350000",
        departmentId: techDept.id,
      })
      .returning();

    const [leadPosition] = await db
      .insert(positions)
      .values({
        organizationId: org.id,
        title: "Chef de Projet Technique",
        description: "Gestion de projets et lead technique",
        category: "C2",
        coefficient: 400,
        minSalary: "250000",
        maxSalary: "500000",
        departmentId: techDept.id,
      })
      .returning();

    const [hrPosition] = await db
      .insert(positions)
      .values({
        organizationId: org.id,
        title: "Responsable RH",
        description: "Gestion des ressources humaines",
        category: "C2",
        coefficient: 400,
        minSalary: "250000",
        maxSalary: "450000",
        departmentId: rhDept.id,
      })
      .returning();

    const [assistantPosition] = await db
      .insert(positions)
      .values({
        organizationId: org.id,
        title: "Assistant(e) Administratif(ve)",
        description: "Support administratif",
        category: "E2",
        coefficient: 150,
        minSalary: "68000",
        maxSalary: "120000",
        departmentId: rhDept.id,
      })
      .returning();

    // Create employee users with Beninese names
    const employeesData = [
      { firstName: "Akouavi", lastName: "DOSSOU", email: "akouavi.dossou@sobemap.bj", deptId: techDept.id, posId: devPosition.id, salary: "220000", category: "C1" as const, gender: "F" },
      { firstName: "Koffi", lastName: "AGBODJAN", email: "koffi.agbodjan@sobemap.bj", deptId: techDept.id, posId: leadPosition.id, salary: "380000", category: "C2" as const, gender: "M" },
      { firstName: "Afiwa", lastName: "HOUNGBO", email: "afiwa.houngbo@sobemap.bj", deptId: commercialDept.id, posId: null, salary: "150000", category: "AM2" as const, gender: "F" },
      { firstName: "Codjo", lastName: "TOKPANOU", email: "codjo.tokpanou@sobemap.bj", deptId: financeDept.id, posId: null, salary: "200000", category: "C1" as const, gender: "M" },
      { firstName: "Fifamè", lastName: "ASSOGBA", email: "fifame.assogba@sobemap.bj", deptId: rhDept.id, posId: hrPosition.id, salary: "280000", category: "C2" as const, gender: "F" },
    ];

    for (let i = 0; i < employeesData.length; i++) {
      const emp = employeesData[i];
      const hash = await bcrypt.hash("bienvenue123", 10);
      
      const [user] = await db
        .insert(users)
        .values({
          organizationId: org.id,
          email: emp.email,
          passwordHash: hash,
          firstName: emp.firstName,
          lastName: emp.lastName,
          role: "employee",
        })
        .returning();

      const hireDate = new Date("2023-01-15");
      const probationEnd = new Date(hireDate);
      probationEnd.setMonth(probationEnd.getMonth() + 3);

      const [employee] = await db
        .insert(employees)
        .values({
          userId: user.id,
          organizationId: org.id,
          matricule: `MAT${String(i + 1).padStart(5, "0")}`,
          departmentId: emp.deptId,
          positionId: emp.posId,
          status: "active",
          contractType: "cdi",
          professionalCategory: emp.category,
          hireDate: "2023-01-15",
          contractStartDate: "2023-01-15",
          probationEndDate: probationEnd.toISOString().split("T")[0],
          baseSalary: emp.salary,
          transportAllowance: "25000",
          nationality: "Béninoise",
          gender: emp.gender,
          city: "Cotonou",
          department: "Littoral",
        })
        .returning();

      // Add leave balance for each employee (24 days annual leave)
      await db.insert(leaveBalances).values({
        employeeId: employee.id,
        year: 2024,
        type: "annual",
        entitled: "24",
        carried: "0",
        taken: "5",
        pending: "0",
        remaining: "19",
      });
    }

    // Create skills
    const skillsData = [
      { name: "JavaScript", category: "Développement" },
      { name: "Python", category: "Développement" },
      { name: "React/Next.js", category: "Développement" },
      { name: "Node.js", category: "Développement" },
      { name: "PostgreSQL", category: "Base de données" },
      { name: "Gestion de projet", category: "Management" },
      { name: "Communication", category: "Soft Skills" },
      { name: "Leadership", category: "Management" },
      { name: "Comptabilité OHADA", category: "Finance" },
      { name: "Droit du travail OHADA", category: "Juridique" },
    ];

    for (const skill of skillsData) {
      await db.insert(skills).values({
        organizationId: org.id,
        name: skill.name,
        category: skill.category,
      });
    }

    // Create trainings
    const trainingsData = [
      { title: "Formation React Avancé", description: "Maîtrise des hooks et patterns avancés React", duration: 24, cost: "450000", category: "Développement", location: "Cotonou" },
      { title: "Leadership et Management", description: "Développer ses compétences managériales", duration: 32, cost: "750000", category: "Management", location: "Cotonou" },
      { title: "Droit du travail OHADA", description: "Maîtriser le cadre juridique OHADA", duration: 16, cost: "350000", category: "Juridique", location: "Cotonou" },
      { title: "Comptabilité SYSCOHADA", description: "Pratique du plan comptable OHADA", duration: 40, cost: "500000", category: "Finance", location: "Cotonou" },
    ];

    for (const training of trainingsData) {
      await db.insert(trainings).values({
        organizationId: org.id,
        title: training.title,
        description: training.description,
        duration: training.duration,
        cost: training.cost,
        category: training.category,
        location: training.location,
        isExternal: false,
        isCertifying: true,
      });
    }

    return NextResponse.json({ 
      message: "Base de données initialisée avec succès",
      organizationId: org.id,
      adminEmail: "admin@sobemap.bj",
      adminPassword: "admin123",
      country: "Bénin",
      currency: "FCFA"
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
