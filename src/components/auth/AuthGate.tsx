"use client";

import { FormEvent, ReactNode, useSyncExternalStore, useState } from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function AuthGate({ children }: { children: ReactNode }) {
  const { authStatus, signOut } = useApp();
  const hasMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  if (!hasMounted || authStatus === "loading") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-slate-100">
        <div className="flex items-center gap-3 text-sm text-slate-300" role="status">
          <span className="size-4 animate-spin rounded-full border-2 border-slate-600 border-t-indigo-400" />
          Memeriksa sesi Kinerja…
        </div>
      </main>
    );
  }

  if (authStatus === "unlinked") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-slate-100">
        <section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 text-center shadow-2xl">
          <div className="mx-auto mb-5 grid size-12 place-items-center rounded-2xl bg-amber-400/10 text-amber-300">
            <LockKeyhole className="size-5" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-semibold">Akun belum terhubung</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Sesi berhasil dibuat, tetapi profil karyawan dan role belum terdaftar. Hubungi HRD untuk mengaitkan akun Kinerja Anda.
          </p>
          <button onClick={() => void signOut()} className="mt-6 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/5">
            Keluar
          </button>
        </section>
      </main>
    );
  }

  if (authStatus === "signed-out") return <LoginScreen />;
  return children;
}

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const result = await response.json();
      if (response.ok) {
        window.location.replace("/");
        return;
      }
      setError(result.error || "Login belum dapat diproses. Coba lagi atau hubungi administrator.");
    } catch {
      setError("Koneksi ke layanan login gagal. Periksa jaringan lalu coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_15%,rgba(99,102,241,0.2),transparent_38%),radial-gradient(ellipse_at_90%_85%,rgba(14,165,233,0.12),transparent_35%)]" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 shadow-2xl shadow-black/30 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden flex-col justify-between bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 p-10 lg:flex xl:p-14">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl border border-white/20 bg-white/10 text-lg font-bold">K</div>
            <span className="text-lg font-semibold tracking-tight">Kinerja</span>
          </div>
          <div className="max-w-md">
            <div className="mb-5 grid size-12 place-items-center rounded-2xl border border-white/15 bg-white/10">
              <BriefcaseBusiness className="size-5" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-indigo-100">Satu ruang untuk berkembang</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">Kinerja yang terukur, tim yang lebih kuat.</h1>
            <p className="mt-5 text-sm leading-7 text-indigo-100/80">
              Pantau sasaran, jalankan evaluasi, dan lihat perkembangan tim dalam satu sistem yang terhubung.
            </p>
          </div>
          <p className="text-xs text-indigo-100/60">Akses aman untuk tim dan organisasi Anda.</p>
        </section>

        <section className="flex items-center p-6 sm:p-10 lg:p-12 xl:p-14">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="grid size-11 place-items-center rounded-2xl bg-indigo-500 text-lg font-bold">K</div>
              <span className="text-lg font-semibold tracking-tight">Kinerja</span>
            </div>
            <p className="text-sm font-medium text-indigo-300">Selamat datang kembali</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Masuk ke akun</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Gunakan email Kinerja dan kata sandi yang sudah terdaftar.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-slate-200">Email</label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nama@kinerja.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
                />
              </div>
              <div>
                <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-slate-200">Kata sandi</label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
                  />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"} className="absolute inset-y-0 right-0 grid w-12 place-items-center text-slate-400 transition hover:text-white">
                    {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2.5 text-sm text-rose-200">{error}</p>}

              <button type="submit" disabled={submitting} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60">
                {submitting ? "Memproses…" : "Masuk"}
                {!submitting && <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />}
              </button>
            </form>

            <p className="mt-7 text-center text-xs leading-5 text-slate-500">Belum memiliki akun? Hubungi HRD untuk menerima undangan akses.</p>
            <Link href="/bootstrap" className="mt-5 block text-center text-xs text-slate-500 underline decoration-slate-700 underline-offset-4 transition hover:text-slate-300">Aktivasi HRD pertama</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
