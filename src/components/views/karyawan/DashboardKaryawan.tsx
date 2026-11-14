"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  UserCheck,
  Award,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Briefcase,
  Building2,
  User,
} from "lucide-react";
import { PenilaianKinerja, getScoreCategoryBadgeClass } from "@/types/kpi";
import { RincianPenilaianModal } from "../hrd/RincianPenilaianModal";

export function DashboardKaryawan() {
  const {
    currentUser,
    karyawanList,
    periodeList,
    penilaianList,
  } = useApp();

  const [activeModalPenilaian, setActiveModalPenilaian] =
    useState<PenilaianKinerja | null>(null);

  const currentEmp = karyawanList.find((k) => k.id === currentUser.karyawanId);

  // All evaluations for this employee across all periods
  const myEvals = penilaianList.filter(
    (p) => p.karyawanId === currentUser.karyawanId
  );

  // Latest evaluation
  const latestEval = myEvals[0] || null;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Portal Penilaian Kinerja Karyawan
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {currentUser.karyawanNama}
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Tinjau seluruh riwayat evaluasi kinerja Key Performance Indicators
            (KPI) Anda di seluruh periode quartal secara transparan.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-4 pt-4 border-t border-white/10">
            <span className="flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              NIK: {currentEmp?.nik}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              {currentEmp?.divisiNama}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Briefcase className="w-3.5 h-3.5 text-purple-400" />
              {currentEmp?.jabatanNama}
            </span>
          </div>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Latest Score Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Skor Terakhir
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-700">
              {latestEval ? latestEval.nilaiAkhir : "-"}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 100</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {latestEval ? latestEval.periodeNama : "Belum ada evaluasi"}
          </p>
        </div>

        {/* Kategori Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Kategori Kinerja
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {latestEval ? (
              <span
                className={`inline-block px-3 py-1 rounded-xl text-xs font-bold border ${getScoreCategoryBadgeClass(
                  latestEval.kategori
                )}`}
              >
                {latestEval.kategori}
              </span>
            ) : (
              <span className="text-sm font-semibold text-slate-400">-</span>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Tingkat performa standar penilaian
          </p>
        </div>

        {/* Total Evaluated Periods */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Periode Terselesaikan
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {myEvals.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">Quartal</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Dari total {periodeList.length} quartal tahun berjalan
          </p>
        </div>
      </div>

      {/* Persyaratan Karyawan: Tabel Melihat Seluruh Penilaian Dalam Seluruh Periode & Masuk ke Rincian Penilaian */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              Riwayat Seluruh Penilaian Kinerja dalam Seluruh Periode
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik tombol &quot;Lihat Rincian&quot; pada baris periode untuk melihat ulasan
              lengkap dan komentar atasan.
            </p>
          </div>
        </div>

        {/* Tabel Periode Penilaian Karyawan */}
        <div className="overflow-x-auto mt-4 border border-slate-200 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 min-w-[200px]">Periode Penilaian</th>
                <th className="py-3 px-4 min-w-[160px]">Quartal</th>
                <th className="py-3 px-4 w-32 text-center">Nilai KPI Umum</th>
                <th className="py-3 px-4 w-32 text-center">Nilai KPI Pilar</th>
                <th className="py-3 px-4 w-28 text-center">Nilai Akhir</th>
                <th className="py-3 px-4 w-32 text-center">Kategori</th>
                <th className="py-3 px-4 w-32 text-center">Status</th>
                <th className="py-3 px-4 w-32 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {periodeList.map((periode) => {
                const evalData = myEvals.find(
                  (e) => e.periodeId === periode.id
                );
                const isEvaluated = !!evalData;
                const badgeClass = evalData
                  ? getScoreCategoryBadgeClass(evalData.kategori)
                  : "";

                return (
                  <tr
                    key={periode.id}
                    className="hover:bg-slate-50/80 transition"
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">
                        {periode.namaPeriode}
                      </p>
                      {evalData && (
                        <p className="text-[10px] text-slate-500">
                          Dinilai oleh: {evalData.penilaiNama}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white mr-2">
                        {periode.quartal}
                      </span>
                      <span className="text-slate-600 font-medium">
                        {periode.quartalLabel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {isEvaluated ? (
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {evalData.nilaiKpiUmum}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {isEvaluated ? (
                        <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {evalData.nilaiKpiPilar}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {isEvaluated ? (
                        <span className="text-sm font-extrabold text-slate-900">
                          {evalData.nilaiAkhir}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {isEvaluated ? (
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeClass}`}
                        >
                          {evalData.kategori}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isEvaluated
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {isEvaluated ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Selesai Dinilai
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" />
                            Dalam Proses
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {isEvaluated ? (
                        <button
                          type="button"
                          onClick={() => setActiveModalPenilaian(evalData)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Lihat Rincian
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          Belum Ada Rincian
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rincian Modal */}
      <RincianPenilaianModal
        penilaian={activeModalPenilaian}
        onClose={() => setActiveModalPenilaian(null)}
      />
    </div>
  );
}
