import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/types/kpi";

const allowedRoles: Role[] = ["hrd", "manager", "karyawan"];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sesi login diperlukan." }, { status: 401 });
  }

  const { data: requester } = await supabase
    .from("user_accounts")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (requester?.role !== "hrd") {
    return NextResponse.json(
      { error: "Hanya HRD yang dapat membuat akun pengguna." },
      { status: 403 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data akun tidak valid." }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const role = body.role;
  const karyawanId = typeof body.karyawanId === "string" ? body.karyawanId.trim() : "";
  const karyawanNik = typeof body.karyawanNik === "string" ? body.karyawanNik.trim() : "";
  const karyawanNama = typeof body.karyawanNama === "string" ? body.karyawanNama.trim() : "";
  const avatar = typeof body.avatar === "string" ? body.avatar : null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (
    username.length < 2 ||
    username.length > 64 ||
    !emailRegex.test(email) ||
    email.length > 254 ||
    typeof role !== "string" ||
    !allowedRoles.includes(role as Role) ||
    !karyawanId ||
    !karyawanNik ||
    !karyawanNama ||
    karyawanNama.length > 160
  ) {
    return NextResponse.json(
      { error: "Lengkapi data profil akun pengguna dengan benar." },
      { status: 400 }
    );
  }

  if (!password || password.length < 6 || password.length > 1024) {
    return NextResponse.json(
      { error: "Password wajib diisi minimal 6 karakter." },
      { status: 400 }
    );
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json(
      {
        error:
          "Layanan akun belum dikonfigurasi. Pastikan SUPABASE_SERVICE_ROLE_KEY tersedia di server/.env.local.",
      },
      { status: 503 }
    );
  }

  const cleanSupabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "");
  const admin = createSupabaseAdmin(cleanSupabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Cek apakah username sudah ada
  const { data: existingUser } = await admin
    .from("user_accounts")
    .select("username")
    .eq("username", username)
    .maybeSingle();

  if (existingUser) {
    return NextResponse.json(
      { error: "Username sudah digunakan oleh akun lain. Gunakan username berbeda." },
      { status: 400 }
    );
  }

  // Buat user langsung di Supabase Auth dengan email_confirm: true agar langsung aktif tanpa email konfirmasi
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: karyawanNama },
  });

  if (createError || !created.user) {
    const errorMsg = createError?.message?.toLowerCase().includes("already")
      ? "Email sudah terdaftar di sistem. Gunakan email lain."
      : createError?.message || "Akun tidak dapat dibuat.";
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }

  // Simpan data akun ke tabel user_accounts
  const { error: insertError } = await admin.from("user_accounts").insert({
    id: created.user.id,
    username,
    email,
    role,
    karyawan_id: karyawanId,
    karyawan_nik: karyawanNik,
    karyawan_nama: karyawanNama,
    avatar,
  });

  if (insertError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json(
      { error: "Profil akun tidak dapat disimpan: " + insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      account: {
        id: created.user.id,
        username,
        email,
        role,
        karyawanId,
        karyawanNik,
        karyawanNama,
        avatar: avatar || undefined,
      },
    },
    { status: 201 }
  );
}
