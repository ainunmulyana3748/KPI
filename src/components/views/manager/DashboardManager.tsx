"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  ArrowRight,
  ClipboardCheck,
  Building2,
  Briefcase,
  Trophy,
  Sparkles,
} from "lucide-react";
import { getScoreCategoryBadgeClass } from "@/types/kpi";

export function DashboardManager() {
  const {
    currentUser,
    karyawanList,
    periodeList,
    penilaianList,
    activePeriode,
    setActiveTabWithTransition,
    setSelectedNilaiInputTarget,
  } = useApp();

  // Find manager employee record
  const managerEmp = karyawanList.find((k) => k.id === currentUser.karyawanId);

  // Quarter selection (defaults to active quarter Q2 or Q1)
  const currentQ = activePeriode || periodeList[1] || periodeList[0];
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string>(
    currentQ.id
  );

  // Subordinates under this manager (same divisi, excluding manager himself)
  const subordinates = karyawanList.filter(
    (k) =>
      managerEmp &&
      k.divisiId === managerEmp.divisiId &&
      k.id !== managerEmp.id
  );

  // Penilaian status for these subordinates in the selected quarter
  const subEvals = subordinates.map((sub) => {
    const ev = penilaianList.find(
      (p) =>
        p.karyawanId === sub.id &&
        p.periodeId === selectedPeriodeId &&
        p.status === "Sudah Dinilai"
    );
    return {
      karyawan: sub,
      penilaian: ev || null,
      sudahDinilai: !!ev,
      nilaiAkhir: ev ? ev.nilaiAkhir : null,
      kategori: ev ? ev.kategori : null,
    };
  });

  const totalKaryawanTim = subordinates.length;
  const sudahDinilaiCount = subEvals.filter((s) => s.sudahDinilai).length;
  const belumDinilaiCount = totalKaryawanTim - sudahDinilaiCount;
  const progressPercent =
    totalKaryawanTim > 0
      ? Math.round((sudahDinilaiCount / totalKaryawanTim) * 100)
      : 0;

  // Leaderboard ranking of evaluated subordinates
  const rankedSubordinates = [...subEvals]
    .filter((s) => s.sudahDinilai && s.nilaiAkhir !== null)
    .sort((a, b) => (b.nilaiAkhir || 0) - (a.nilaiAkhir || 0));

  const handleStartNilai = (kId: string) => {
    setSelectedNilaiInputTarget({
      karyawanId: kId,
      periodeId: selectedPeriodeId,
    });
    setActiveTabWithTransition("manager-form-nilai");
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            Divisi {managerEmp?.divisiNama || "Operasional"}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard Penilaian Kinerja Tim
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Selamat datang, <strong>{currentUser.karyawanNama}</strong>. Pantau
            progres pengisian evaluasi KPI bawahan Anda dan tinjau peringkat
            kinerja mereka secara transparan.
          </p>
        </div>
      </div>

      {/* Quarter Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <span>Periode Penilaian yang Ditinjau:</span>
          <select
            value={selectedPeriodeId}
            onChange={(e) => setSelectedPeriodeId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {periodeList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.namaPeriode} ({p.status})
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => setActiveTabWithTransition("manager-penilaian")}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
        >
          <ClipboardCheck className="w-4 h-4" />
          Buka Tabel Input Nilai
        </button>
      </div>

      {/* 4 Core Summary Cards (Persyaratan Manager: Jumlah Karyawan, Sudah Dinilai, Belum Dinilai, Progress) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Jumlah Karyawan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Jumlah Anggota Tim
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {totalKaryawanTim}
            </span>
            <span className="text-xs text-slate-500 font-medium">Karyawan</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Di bawah penilaian langsung Anda
          </p>
        </div>

        {/* 2. Sudah Dinilai */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sudah Dinilai
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-700">
              {sudahDinilaiCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">Orang</span>
          </div>
          <p className="mt-2 text-[11px] text-emerald-600 font-medium">
            Evaluasi telah disubmit
          </p>
        </div>

        {/* 3. Belum Dinilai */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Belum Dinilai
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-700">
              {belumDinilaiCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">Orang</span>
          </div>
          <p className="mt-2 text-[11px] text-amber-600 font-medium">
            Menunggu input skor
          </p>
        </div>

        {/* 4. Progress Pengisian KPI Pada Quartal Tersebut */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Progress Pengisian KPI
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-2xl font-black text-slate-900">
                {progressPercent}%
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {sudahDinilaiCount}/{totalKaryawanTim} Selesai
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Papan Peringkat Kinerja Tim (Leaderboard Tim Manager) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Papan Peringkat Kinerja Tim ({managerEmp?.divisiNama})
            </h3>
            <p className="text-xs text-slate-500">
              Peringkat skor hasil evaluasi anggota tim Anda pada periode ini.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-16 text-center">Rank</th>
                <th className="py-3 px-4 min-w-[200px]">Karyawan</th>
                <th className="py-3 px-4 min-w-[180px]">Jabatan</th>
                <th className="py-3 px-4 w-32 text-center">Nilai Akhir</th>
                <th className="py-3 px-4 w-32 text-center">Kategori</th>
                <th className="py-3 px-4 w-32 text-center">Status</th>
                <th className="py-3 px-4 w-32 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subEvals.map((sub, idx) => {
                const badgeClass = sub.kategori
                  ? getScoreCategoryBadgeClass(sub.kategori)
                  : "";

                return (
                  <tr
                    key={sub.karyawan.id}
                    className="hover:bg-slate-50/80 transition"
                  >
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                      {sub.sudahDinilai ? `#${idx + 1}` : "-"}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {sub.karyawan.nama}
                      <span className="block font-mono text-[10px] text-slate-400 font-normal">
                        {sub.karyawan.nik}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {sub.karyawan.jabatanNama}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {sub.nilaiAkhir !== null ? (
                        <span className="text-sm font-extrabold text-slate-900">
                          {sub.nilaiAkhir}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {sub.kategori ? (
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeClass}`}
                        >
                          {sub.kategori}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          sub.sudahDinilai
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {sub.sudahDinilai ? "Sudah Dinilai" : "Belum Dinilai"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleStartNilai(sub.karyawan.id)}
                        className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition ${
                          sub.sudahDinilai
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                        }`}
                      >
                        {sub.sudahDinilai ? "Edit Nilai" : "Input Nilai"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
