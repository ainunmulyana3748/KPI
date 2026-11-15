import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

const initialHrd = {
  id: "emp-201",
  nik: "EMP-2024-201",
  name: "Siti Rahmawati, S.Psi.",
  email: "siti.rahmawati@kinerja.com",
  username: "admin.hrd",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
};

export async function POST(request: NextRequest) {
  const expectedToken = process.env.INITIAL_HRD_BOOTSTRAP_TOKEN;
  const suppliedToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!expectedToken || !suppliedToken) {
    return NextResponse.json({ error: "Bootstrap tidak diizinkan." }, { status: 401 });
  }

  const expected = Buffer.from(expectedToken);
  const supplied = Buffer.from(suppliedToken);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
    return NextResponse.json({ error: "Bootstrap tidak diizinkan." }, { status: 401 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json({ error: "Layanan undangan belum dikonfigurasi." }, { status: 503 });
  }

  const admin = createSupabaseAdmin(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { count, error: countError } = await admin
    .from("user_accounts")
    .select("id", { count: "exact", head: true });

  if (countError) {
    return NextResponse.json({ error: "Status akun awal tidak dapat diperiksa." }, { status: 500 });
  }
  if (count !== 0) {
    return NextResponse.json({ error: "Akun awal sudah dibuat. Gunakan login Kinerja." }, { status: 409 });
  }

  const redirectTo = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || new URL("/auth/callback", request.nextUrl.origin).toString();
  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(initialHrd.email, {
    data: { display_name: initialHrd.name },
    redirectTo,
  });
  if (inviteError || !invited.user) {
    return NextResponse.json({ error: "Undangan awal tidak dapat dikirim. Pastikan email belum terdaftar di Supabase Auth." }, { status: 400 });
  }

  const { error: insertError } = await admin.from("user_accounts").insert({
    id: invited.user.id,
    username: initialHrd.username,
    email: initialHrd.email,
    role: "hrd",
    karyawan_id: initialHrd.id,
    karyawan_nik: initialHrd.nik,
    karyawan_nama: initialHrd.name,
    avatar: initialHrd.avatar,
  });
  if (insertError) {
    await admin.auth.admin.deleteUser(invited.user.id);
    return NextResponse.json({ error: "Profil akun awal tidak dapat disimpan." }, { status: 500 });
  }

  return NextResponse.json({ message: `Undangan HRD telah dikirim ke ${initialHrd.email}.` }, { status: 201 });
}
