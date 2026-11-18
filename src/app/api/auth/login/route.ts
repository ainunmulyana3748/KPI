import { NextRequest, NextResponse } from "next/server";
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
    return NextResponse.json({ error: "Konfirmasi email Anda sebelum masuk ke Kinerja." }, { status: 403 });
  }
  if (error.status === 429) {
    return NextResponse.json({ error: "Terlalu banyak percobaan masuk. Coba lagi beberapa saat lagi." }, { status: 429 });
  }
  if (error.code === "invalid_credentials") {
    return NextResponse.json({ error: "Email atau kata sandi tidak valid." }, { status: 401 });
  }

  return NextResponse.json({ error: "Layanan login belum dapat memproses permintaan. Coba lagi nanti." }, { status: 503 });
}
