import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin) {
    let originHost = "";
    try {
      const parsedOrigin = new URL(origin);
      if (parsedOrigin.protocol !== "http:" && parsedOrigin.protocol !== "https:") {
        throw new Error("Unsupported origin protocol");
      }
      originHost = parsedOrigin.host.toLowerCase();
    } catch {
      return NextResponse.json({ error: "Permintaan tidak diizinkan." }, { status: 403 });
    }

    const requestHosts = [
      request.headers.get("host"),
      request.headers.get("x-forwarded-host"),
      request.nextUrl.host,
    ]
      .flatMap((host) => host?.split(",") ?? [])
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean);
    const sameOriginBrowserRequest = request.headers.get("sec-fetch-site") === "same-origin";

    if (!requestHosts.includes(originHost) && !sameOriginBrowserRequest) {
      return NextResponse.json({ error: "Permintaan tidak diizinkan." }, { status: 403 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data login tidak valid." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || email.length > 254 || !password || password.length > 1024) {
    return NextResponse.json({ error: "Email atau kata sandi tidak valid." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (!error) return NextResponse.json({ success: true });

  if (error.code === "email_not_confirmed") {
    // Otomatis verifikasi email pengguna jika belum terverifikasi, lalu coba login ulang
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (serviceRoleKey && supabaseUrl) {
      try {
        const cleanSupabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "");
        const admin = createSupabaseAdmin(cleanSupabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });
        const { data: userList } = await admin.auth.admin.listUsers();
        const targetUser = userList?.users.find((u) => u.email?.toLowerCase() === email);
        if (targetUser) {
          await admin.auth.admin.updateUserById(targetUser.id, { email_confirm: true });
          const { error: retryError } = await supabase.auth.signInWithPassword({ email, password });
          if (!retryError) return NextResponse.json({ success: true });
        }
      } catch {
        // Fallback ke respons error jika terjadi kendala admin
      }
    }
    return NextResponse.json({ error: "Email akun belum aktif. Silakan coba masuk kembali." }, { status: 403 });
  }
  if (error.status === 429) {
    return NextResponse.json({ error: "Terlalu banyak percobaan masuk. Coba lagi beberapa saat lagi." }, { status: 429 });
  }
  if (error.code === "invalid_credentials") {
    return NextResponse.json({ error: "Email atau kata sandi tidak valid." }, { status: 401 });
  }

  return NextResponse.json({ error: "Layanan login belum dapat memproses permintaan. Coba lagi nanti." }, { status: 503 });
}
