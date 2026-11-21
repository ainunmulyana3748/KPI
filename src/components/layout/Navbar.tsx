"use client";

import { LogOut } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function Navbar() {
  const { currentUser, signOut } = useApp();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 shadow-xs backdrop-blur-md print:hidden">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-lg font-bold text-white shadow-md shadow-indigo-500/20">
            K
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-slate-900 sm:text-lg">
              Kinerja
            </h1>
            <p className="text-xs text-slate-500">
              Evaluasi kinerja &amp; indikator utama
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 border-l border-slate-200 pl-4">
          <div
            aria-hidden="true"
            className="hidden size-9 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-700 ring-2 ring-indigo-500/20 sm:flex"
          >
            {currentUser.karyawanNama.slice(0, 1)}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold leading-tight text-slate-800">
              {currentUser.karyawanNama.split(",")[0]}
            </p>
            <p className="text-[10px] text-slate-500">{currentUser.email}</p>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Keluar dari Kinerja"
          >
            <LogOut className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
