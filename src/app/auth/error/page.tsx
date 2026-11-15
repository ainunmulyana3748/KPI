import Link from "next/link";
import { LockKeyhole } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-slate-100">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 grid size-12 place-items-center rounded-2xl bg-amber-400/10 text-amber-300">
          <LockKeyhole className="size-5" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold">Tautan tidak dapat digunakan</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Tautan mungkin sudah kedaluwarsa atau pernah digunakan. Minta HRD mengirimkan undangan baru.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400">
          Kembali ke halaman masuk
        </Link>
      </section>
    </main>
  );
}
