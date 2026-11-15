import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/types/kpi";

const allowedRoles: Role[] = ["hrd", "manager", "karyawan"];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sesi login diperlukan." }, { status: 401 });

  const { data: requester } = await supabase
    .from("user_accounts")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (requester?.role !== "hrd") {
    return NextResponse.json({ error: "Hanya HRD yang dapat mengundang pengguna." }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data undangan tidak valid." }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const role = body.role;
  const karyawanId = typeof body.karyawanId === "string" ? body.karyawanId.trim() : "";
  const karyawanNik = typeof body.karyawanNik === "string" ? body.karyawanNik.trim() : "";
  const karyawanNama = typeof body.karyawanNama === "string" ? body.karyawanNama.trim() : "";
  const avatar = typeof body.avatar === "string" ? body.avatar : null;

  if (
    username.length < 2 || username.length > 64 ||
    !/^[^\s@]+@kinerja\.com$/.test(email) || email.length > 254 ||
    typeof role !== "string" || !allowedRoles.includes(role as Role) ||
    !karyawanId || !karyawanNik || !karyawanNama || karyawanNama.length > 160
  ) {
    return NextResponse.json({ error: "Lengkapi profil dan gunakan email @kinerja.com." }, { status: 400 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json({ error: "Layanan undangan belum dikonfigurasi." }, { status: 503 });
  }

  const admin = createSupabaseAdmin(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const redirectTo = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || new URL("/auth/callback", request.nextUrl.origin).toString();
  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { display_name: karyawanNama },
    redirectTo,
  });

  if (inviteError || !invited.user) {
    return NextResponse.json({ error: "Undangan tidak dapat dikirim. Pastikan email belum terdaftar dan SMTP Supabase siap." }, { status: 400 });
  }

  const { error: insertError } = await admin.from("user_accounts").insert({
    id: invited.user.id,
    username,
    email,
    role,
    karyawan_id: karyawanId,
    karyawan_nik: karyawanNik,
    karyawan_nama: karyawanNama,
    avatar,
  });

  if (insertError) {
    await admin.auth.admin.deleteUser(invited.user.id);
    return NextResponse.json({ error: "Profil akun tidak dapat disimpan. Undangan dibatalkan." }, { status: 500 });
  }

  return NextResponse.json({
    account: {
      id: invited.user.id,
      username,
      email,
      role,
      karyawanId,
      karyawanNik,
      karyawanNama,
      avatar: avatar || undefined,
    },
  }, { status: 201 });
}
