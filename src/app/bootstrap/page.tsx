"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";

export default function BootstrapPage() {
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

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
      setSuccess(response.ok);
      setMessage(result.message || result.error || "Permintaan tidak dapat diproses.");
      if (response.ok) setToken("");
    } catch {
      setSuccess(false);
      setMessage("Koneksi ke layanan bootstrap gagal. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_15%,rgba(99,102,241,0.2),transparent_38%),radial-gradient(ellipse_at_90%_85%,rgba(14,165,233,0.12),transparent_35%)]" />
      <section className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/95 p-7 shadow-2xl sm:p-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft className="size-4" aria-hidden="true" /> Kembali ke login
        </Link>
        <div className="mt-8 grid size-12 place-items-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-300">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">Aktivasi HRD pertama</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Proses ini hanya dapat digunakan sekali dan memerlukan token bootstrap rahasia dari administrator proyek. Undangan dikirim ke email HRD yang sudah ditentukan.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
          <label htmlFor="bootstrap-token" className="text-sm font-medium text-slate-200">Token bootstrap</label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              id="bootstrap-token"
              type="password"
              autoComplete="off"
              required
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
            />
          </div>
          {message && <p role={success ? "status" : "alert"} className={`rounded-xl border px-3 py-2.5 text-sm ${success ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200" : "border-rose-400/20 bg-rose-400/10 text-rose-200"}`}>{message}</p>}
          <button type="submit" disabled={submitting} className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? "Mengirim undangan…" : "Kirim undangan HRD"}
            {!submitting && <ArrowLeft className="size-4 rotate-180" aria-hidden="true" />}
          </button>
        </form>
        <p className="mt-5 text-xs leading-5 text-slate-500">Token hanya dikirim ke endpoint server melalui header dan tidak disimpan oleh browser.</p>
      </section>
    </main>
  );
}
