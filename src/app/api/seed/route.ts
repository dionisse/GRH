import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    const { data: existing } = await supabase
      .from("organizations")
      .select("id")
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ message: "Database already seeded" });
    }

    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name: "SOBEMAP SARL",
        trade_name: "SOBEMAP",
        legal_form: "SARL",
        industry: "Technologies de l'Information",
        rccm: "RB/COT/24-A-12345",
        ifu: "3202412345678",
        cnss_number: "1234567-A",
        address: "Lot 456, Quartier Gbèdjromèdé",
        city: "Cotonou",
        department: "Littoral",
        postal_box: "BP 1234 Cotonou",
        phone: "+229 21 30 00 00",
        email: "contact@sobemap.bj",
        website: "https://sobemap.bj",
        collective_agreement: "Convention Collective Interprofessionnelle",
      })
      .select()
      .single();

    if (orgError) throw new Error(orgError.message);

    const passwordHash = await bcrypt.hash("admin123", 10);

    const { data: adminUser } = await supabase
      .from("users")
      .insert({
        organization_id: org.id,
        email: "admin@sobemap.bj",
        password_hash: passwordHash,
        first_name: "Administrateur",
        last_name: "RH",
        role: "admin",
      })
      .select()
      .single();

    const { data: techDept } = await supabase
      .from("departments")
      .insert({ organization_id: org.id, name: "Direction Technique", description: "Développement et infrastructure informatique" })
      .select().single();

    const { data: rhDept } = await supabase
      .from("departments")
      .insert({ organization_id: org.id, name: "Direction des Ressources Humaines", description: "Gestion du personnel et administration", manager_id: adminUser?.id })
      .select().single();

    const { data: commDept } = await supabase
      .from("departments")
      .insert({ organization_id: org.id, name: "Direction Commerciale", description: "Ventes et relations clients" })
      .select().single();

    const { data: finDept } = await supabase
      .from("departments")
      .insert({ organization_id: org.id, name: "Direction Administrative et Financière", description: "Comptabilité et finances" })
      .select().single();

    const { data: devPos } = await supabase
      .from("positions")
      .insert({ organization_id: org.id, title: "Développeur Full Stack", description: "Développement d'applications web et mobile", category: "C1", coefficient: 300, min_salary: 180000, max_salary: 350000, department_id: techDept?.id })
      .select().single();

    const { data: leadPos } = await supabase
      .from("positions")
      .insert({ organization_id: org.id, title: "Chef de Projet Technique", description: "Gestion de projets et lead technique", category: "C2", coefficient: 400, min_salary: 250000, max_salary: 500000, department_id: techDept?.id })
      .select().single();

    const { data: hrPos } = await supabase
      .from("positions")
      .insert({ organization_id: org.id, title: "Responsable RH", description: "Gestion des ressources humaines", category: "C2", coefficient: 400, min_salary: 250000, max_salary: 450000, department_id: rhDept?.id })
      .select().single();

    const employeesData = [
      { firstName: "Akouavi", lastName: "DOSSOU", email: "akouavi.dossou@sobemap.bj", deptId: techDept?.id, posId: devPos?.id, salary: 220000, category: "C1", gender: "F" },
      { firstName: "Koffi", lastName: "AGBODJAN", email: "koffi.agbodjan@sobemap.bj", deptId: techDept?.id, posId: leadPos?.id, salary: 380000, category: "C2", gender: "M" },
      { firstName: "Afiwa", lastName: "HOUNGBO", email: "afiwa.houngbo@sobemap.bj", deptId: commDept?.id, posId: null, salary: 150000, category: "AM2", gender: "F" },
      { firstName: "Codjo", lastName: "TOKPANOU", email: "codjo.tokpanou@sobemap.bj", deptId: finDept?.id, posId: null, salary: 200000, category: "C1", gender: "M" },
      { firstName: "Fifamè", lastName: "ASSOGBA", email: "fifame.assogba@sobemap.bj", deptId: rhDept?.id, posId: hrPos?.id, salary: 280000, category: "C2", gender: "F" },
    ];

    for (let i = 0; i < employeesData.length; i++) {
      const emp = employeesData[i];
      const hash = await bcrypt.hash("bienvenue123", 10);

      const { data: user } = await supabase
        .from("users")
        .insert({ organization_id: org.id, email: emp.email, password_hash: hash, first_name: emp.firstName, last_name: emp.lastName, role: "employee" })
        .select().single();

      const hireDate = "2023-01-15";
      const probationEnd = new Date("2023-01-15");
      probationEnd.setMonth(probationEnd.getMonth() + 3);

      const { data: employee } = await supabase
        .from("employees")
        .insert({
          user_id: user?.id,
          organization_id: org.id,
          matricule: `MAT${String(i + 1).padStart(5, "0")}`,
          department_id: emp.deptId,
          position_id: emp.posId,
          status: "active",
          contract_type: "cdi",
          professional_category: emp.category,
          hire_date: hireDate,
          contract_start_date: hireDate,
          probation_end_date: probationEnd.toISOString().split("T")[0],
          base_salary: emp.salary,
          transport_allowance: 25000,
          nationality: "Béninoise",
          gender: emp.gender,
          city: "Cotonou",
          department: "Littoral",
        })
        .select().single();

      if (employee) {
        await supabase.from("leave_balances").insert({
          employee_id: employee.id,
          year: 2024,
          type: "annual",
          entitled: 24,
          carried: 0,
          taken: 5,
          pending: 0,
          remaining: 19,
        });
      }
    }

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
      await supabase.from("skills").insert({ organization_id: org.id, name: skill.name, category: skill.category });
    }

    const trainingsData = [
      { title: "Formation React Avancé", description: "Maîtrise des hooks et patterns avancés React", duration: 24, cost: 450000, category: "Développement", location: "Cotonou" },
      { title: "Leadership et Management", description: "Développer ses compétences managériales", duration: 32, cost: 750000, category: "Management", location: "Cotonou" },
      { title: "Droit du travail OHADA", description: "Maîtriser le cadre juridique OHADA", duration: 16, cost: 350000, category: "Juridique", location: "Cotonou" },
      { title: "Comptabilité SYSCOHADA", description: "Pratique du plan comptable OHADA", duration: 40, cost: 500000, category: "Finance", location: "Cotonou" },
    ];

    for (const training of trainingsData) {
      await supabase.from("trainings").insert({
        organization_id: org.id,
        title: training.title,
        description: training.description,
        duration: training.duration,
        cost: training.cost,
        category: training.category,
        location: training.location,
        is_external: false,
        is_certifying: true,
      });
    }

    return NextResponse.json({
      message: "Base de données initialisée avec succès",
      organizationId: org.id,
      adminEmail: "admin@sobemap.bj",
      adminPassword: "admin123",
      country: "Bénin",
      currency: "FCFA",
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
