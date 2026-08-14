import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("employees")
      .select(`
        *,
        users!inner(id, email, first_name, last_name, avatar),
        departments(id, name),
        positions(id, title, category)
      `)
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const formatted = (data || []).map((row: any) => ({
      ...row,
      user: row.users,
      department: row.departments,
      position: row.positions,
      users: undefined,
      departments: undefined,
      positions: undefined,
    }));

    return NextResponse.json({ employees: formatted });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      organizationId,
      email,
      firstName,
      lastName,
      departmentId,
      positionId,
      contractType,
      professionalCategory,
      hireDate,
      baseSalary,
      transportAllowance,
      phone,
      address,
      city,
      birthDate,
      birthPlace,
      gender,
      maritalStatus,
      numberOfChildren,
      cnssNumber,
      cniNumber,
    } = body;

    const { count: empCount } = await supabase
      .from("employees")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId);

    const matricule = `MAT${String((empCount || 0) + 1).padStart(5, "0")}`;

    const passwordHash = await bcrypt.hash("Bienvenue123!", 10);

    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        organization_id: organizationId,
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        role: "employee",
      })
      .select()
      .single();

    if (userError) throw new Error(userError.message);

    const hireDateObj = new Date(hireDate);
    const probationMonths = professionalCategory?.startsWith("C") ? 6 : 3;
    const probationEndDate = new Date(hireDateObj);
    probationEndDate.setMonth(probationEndDate.getMonth() + probationMonths);

    const { data: employee, error: empError } = await supabase
      .from("employees")
      .insert({
        user_id: user.id,
        organization_id: organizationId,
        matricule,
        department_id: departmentId || null,
        position_id: positionId || null,
        contract_type: contractType,
        professional_category: professionalCategory || null,
        hire_date: hireDate,
        contract_start_date: hireDate,
        probation_end_date: probationEndDate.toISOString().split("T")[0],
        base_salary: baseSalary || null,
        transport_allowance: transportAllowance || "0",
        phone,
        address,
        city,
        birth_date: birthDate,
        birth_place: birthPlace,
        gender,
        marital_status: maritalStatus,
        number_of_children: numberOfChildren || 0,
        cnss_number: cnssNumber,
        cni_number: cniNumber,
        status: "active",
        nationality: "Béninoise",
      })
      .select()
      .single();

    if (empError) throw new Error(empError.message);

    return NextResponse.json({ employee, user });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}
