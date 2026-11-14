"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export function LoadingBar() {
  const { isLoadingPage } = useApp();

  if (!isLoadingPage) return null;

  return (
    <>
      {/* Top slim animated loading bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-100 overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-600 animate-loading-bar" />
      </div>

      {/* Gentle backdrop spinner with Indonesian text */}
      <div className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-[1px] flex items-center justify-center transition-opacity">
        <div className="bg-white/95 px-5 py-3 rounded-2xl shadow-xl border border-slate-200/80 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-700">
            Memuat data...
          </span>
        </div>
      </div>
    </>
  );
}
