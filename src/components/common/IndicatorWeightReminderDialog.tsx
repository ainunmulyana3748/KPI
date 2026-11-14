"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { AlertTriangle, ArrowRight, CornerDownLeft } from "lucide-react";

export function IndicatorWeightReminderDialog() {
  const {
    showIndicatorReminderModal,
    totalBobotIndikator,
    confirmNavigateAwayFromIndicators,
    cancelNavigateAwayFromIndicators,
  } = useApp();

  if (!showIndicatorReminderModal) return null;

  const kekurangan = 100 - totalBobotIndikator;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 transform transition-all scale-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Pengingat Bobot Indikator
            </h3>
            <p className="text-xs text-slate-500">
              Sistem Manajemen Pengaturan KPI
            </p>
          </div>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 mb-5 text-sm text-amber-900">
          <p className="mb-2">
            Akumulasi bobot indikator KPI saat ini baru mencapai{" "}
            <span className="font-bold text-amber-700">
              {totalBobotIndikator}%
            </span>
            . Belum mencapai target kuota maksimal{" "}
            <span className="font-bold text-slate-900">100%</span> (kurang{" "}
            <span className="font-bold text-amber-700">{kekurangan}%</span>).
          </p>
          <p className="text-xs text-amber-800/90">
            Penilaian kinerja akan lebih akurat bila seluruh indikator telah
            ditetapkan dengan total persentase tepat 100%.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={cancelNavigateAwayFromIndicators}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-2"
          >
            <CornerDownLeft className="w-4 h-4" />
            Kembali & Lengkapi
          </button>
          <button
            type="button"
            onClick={confirmNavigateAwayFromIndicators}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm hover:shadow flex items-center gap-2"
          >
            Lanjutkan Pindah
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
