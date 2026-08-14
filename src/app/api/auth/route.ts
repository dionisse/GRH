import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, action } = body;

    if (action === "register") {
      const { firstName, lastName, organizationName } = body;

      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .limit(1);

      if (existing && existing.length > 0) {
        return NextResponse.json(
          { error: "Un compte avec cet email existe déjà" },
          { status: 400 }
        );
      }

      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert({
          name: organizationName || `${firstName} ${lastName} Org`,
        })
        .select()
        .single();

      if (orgError) throw new Error(orgError.message);

      const passwordHash = await bcrypt.hash(password, 10);

      const { data: user, error: userError } = await supabase
        .from("users")
        .insert({
          organization_id: org.id,
          email,
          password_hash: passwordHash,
          first_name: firstName,
          last_name: lastName,
          role: "admin",
        })
        .select()
        .single();

      if (userError) throw new Error(userError.message);

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          organizationId: user.organization_id,
        },
      });
    } else {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .limit(1)
        .single();

      if (error || !user) {
        return NextResponse.json(
          { error: "Email ou mot de passe incorrect" },
          { status: 401 }
        );
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return NextResponse.json(
          { error: "Email ou mot de passe incorrect" },
          { status: 401 }
        );
      }

      await supabase
        .from("users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", user.id);

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          organizationId: user.organization_id,
        },
      });
    }
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
