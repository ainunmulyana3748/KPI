"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, LockKeyhole } from "lucide-react";

export default function BootstrapPage() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/bootstrap", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      setIsError(!response.ok);
      setMessage(result.message || result.error || "Permintaan tidak dapat diproses.");
      if (response.ok) setToken("");
    } catch {
      setIsError(true);
      setMessage("Koneksi terputus. Periksa jaringan lalu coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4 py-10 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-7 shadow-2xl sm:p-9">
        <div className="mb-6 grid size-12 place-items-center rounded-2xl bg-indigo-500/15 text-indigo-300">
          <LockKeyhole className="size-5" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-indigo-300">Penyiapan satu kali</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Undang HRD pertama</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Kirim undangan administrator awal ke profil Siti Rahmawati. Halaman ini hanya aktif saat belum ada akun dan memerlukan token bootstrap dari pengelola proyek.
        </p>
        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
          <label htmlFor="bootstrap-token" className="text-sm font-medium text-slate-200">Token bootstrap</label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              id="bootstrap-token"
              type="password"
              autoComplete="off"
              required
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
            />
          </div>
          {message && <p role={isError ? "alert" : "status"} className={`rounded-xl border px-3 py-2.5 text-sm ${isError ? "border-rose-400/20 bg-rose-400/10 text-rose-200" : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"}`}>{message}</p>}
          <button type="submit" disabled={submitting} className="rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? "Mengirim undangan…" : "Kirim undangan HRD"}
          </button>
        </form>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white">
          <ArrowLeft className="size-4" aria-hidden="true" /> Kembali ke login
        </Link>
      </section>
    </main>
  );
}
