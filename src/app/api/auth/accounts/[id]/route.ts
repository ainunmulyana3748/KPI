import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/types/kpi";

const allowedRoles: Role[] = ["hrd", "manager", "karyawan"];
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sesi login diperlukan." }, { status: 401 });
  }

  const { data: requester } = await supabase
    .from("user_accounts")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (requester?.role !== "hrd") {
    return NextResponse.json({ error: "Hanya HRD yang dapat mengubah akun pengguna." }, { status: 403 });
  }

  const { id } = await params;
  if (!id || id.length > 128) {
    return NextResponse.json({ error: "ID akun pengguna tidak valid." }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data akun tidak valid." }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const role = body.role;
  const karyawanId = typeof body.karyawanId === "string" ? body.karyawanId.trim() : "";
  const karyawanNik = typeof body.karyawanNik === "string" ? body.karyawanNik.trim() : "";
  const karyawanNama = typeof body.karyawanNama === "string" ? body.karyawanNama.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (
    username.length < 2 || username.length > 64 ||
    typeof role !== "string" || !allowedRoles.includes(role as Role) ||
    !karyawanId || karyawanId.length > 128 ||
    !karyawanNik || karyawanNik.length > 64 ||
    !karyawanNama || karyawanNama.length > 160
  ) {
    return NextResponse.json({ error: "Lengkapi username, role, dan pemilik akun dengan benar." }, { status: 400 });
  }

  if (password && (password.length < 6 || password.length > 1024)) {
    return NextResponse.json({ error: "Password baru minimal 6 karakter." }, { status: 400 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json({ error: "Layanan akun belum dikonfigurasi. Pastikan SUPABASE_SERVICE_ROLE_KEY tersedia." }, { status: 503 });
  }

  const cleanSupabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "");
  const admin = createSupabaseAdmin(cleanSupabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Jika password diisi, update password user di Supabase Auth
  if (password && uuidPattern.test(id)) {
    const { error: pwdError } = await admin.auth.admin.updateUserById(id, {
      password,
    });
    if (pwdError) {
      return NextResponse.json({ error: "Gagal memperbarui password: " + pwdError.message }, { status: 400 });
    }
  }

  const { data: account, error } = await admin
    .from("user_accounts")
    .update({
      username,
      role,
      karyawan_id: karyawanId,
      karyawan_nik: karyawanNik,
      karyawan_nama: karyawanNama,
    })
    .eq("id", id)
    .select("id, username, email, role, karyawan_id, karyawan_nik, karyawan_nama, avatar")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Perubahan akun tidak dapat disimpan: " + error.message }, { status: 500 });
  }
  if (!account) {
    return NextResponse.json({ error: "Akun pengguna tidak ditemukan di database." }, { status: 404 });
  }

  return NextResponse.json({
    account: {
      id: account.id,
      username: account.username,
      email: account.email,
      role: account.role as Role,
      karyawanId: account.karyawan_id,
      karyawanNik: account.karyawan_nik,
      karyawanNama: account.karyawan_nama,
      avatar: account.avatar || undefined,
    },
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sesi login diperlukan." }, { status: 401 });
  }

  const { data: requester } = await supabase
    .from("user_accounts")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (requester?.role !== "hrd") {
    return NextResponse.json({ error: "Hanya HRD yang dapat menghapus akun pengguna." }, { status: 403 });
  }

  const { id } = await params;
  if (!id || id.length > 128) {
    return NextResponse.json({ error: "ID akun pengguna tidak valid." }, { status: 400 });
  }

  if (id === user.id) {
    return NextResponse.json({ error: "Anda tidak dapat menghapus akun Anda sendiri." }, { status: 400 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json({ error: "Layanan akun belum dikonfigurasi. Pastikan SUPABASE_SERVICE_ROLE_KEY tersedia." }, { status: 503 });
  }

  const cleanSupabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "");
  const admin = createSupabaseAdmin(cleanSupabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error: dbError } = await admin
    .from("user_accounts")
    .delete()
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: "Gagal menghapus data akun dari database: " + dbError.message }, { status: 500 });
  }

  if (uuidPattern.test(id)) {
    await admin.auth.admin.deleteUser(id);
  }

  return NextResponse.json({ success: true });
}
