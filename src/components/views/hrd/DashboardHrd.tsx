"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Users,
  Building2,
  Briefcase,
  CalendarDays,
  TrendingUp,
  Award,
  AlertCircle,
  BarChart2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";
import { getScoreCategoryBadgeClass } from "@/types/kpi";

export function DashboardHrd() {
  const {
    karyawanList,
    divisiList,
    jabatanList,
    periodeList,
    getQuarterStats,
    setActiveTabWithTransition,
    setSelectedKaryawanDetailId,
  } = useApp();

  // Find previous completed quarter (defaults to Q1 if completed)
  const completedQuarter =
    periodeList.find((p) => p.status === "Complete") || periodeList[0];
  const [selectedQuarterId, setSelectedQuarterId] = useState<string>(
    completedQuarter?.id || "per-1"
  );

  const stats = getQuarterStats(selectedQuarterId);
  const targetPeriod =
    periodeList.find((p) => p.id === selectedQuarterId) || completedQuarter;

  const totalDist =
    stats.distribusi.sangatBaik +
      stats.distribusi.baik +
      stats.distribusi.cukup +
      stats.distribusi.kurang +
      stats.distribusi.sangatKurang || 1;

  const distItems = [
    {
      label: "Sangat Baik",
      scoreRange: "85 - 100",
      count: stats.distribusi.sangatBaik,
      percent: Math.round((stats.distribusi.sangatBaik / totalDist) * 100),
      color: "bg-emerald-500",
      textColor: "text-emerald-700",
      badgeColor: "bg-emerald-50 border-emerald-200 text-emerald-700",
    },
    {
      label: "Baik",
      scoreRange: "75 - 84.9",
      count: stats.distribusi.baik,
      percent: Math.round((stats.distribusi.baik / totalDist) * 100),
      color: "bg-blue-500",
      textColor: "text-blue-700",
      badgeColor: "bg-blue-50 border-blue-200 text-blue-700",
    },
    {
      label: "Cukup",
      scoreRange: "65 - 74.9",
      count: stats.distribusi.cukup,
      percent: Math.round((stats.distribusi.cukup / totalDist) * 100),
      color: "bg-amber-500",
      textColor: "text-amber-700",
      badgeColor: "bg-amber-50 border-amber-200 text-amber-700",
    },
    {
      label: "Kurang",
      scoreRange: "50 - 64.9",
      count: stats.distribusi.kurang,
      percent: Math.round((stats.distribusi.kurang / totalDist) * 100),
      color: "bg-orange-500",
      textColor: "text-orange-700",
      badgeColor: "bg-orange-50 border-orange-200 text-orange-700",
    },
    {
      label: "Sangat Kurang",
      scoreRange: "< 50",
      count: stats.distribusi.sangatKurang,
      percent: Math.round((stats.distribusi.sangatKurang / totalDist) * 100),
      color: "bg-rose-500",
      textColor: "text-rose-700",
      badgeColor: "bg-rose-50 border-rose-200 text-rose-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            Portal Manajemen Kinerja SDM Terintegrasi
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard Utama HRD & Administrator
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Pantau ringkasan master data organisasi, status siklus 4 periode
            evaluasi quartal, dan hasil distribusi skor KPI karyawan secara
            real-time.
          </p>
        </div>
      </div>

      {/* 4 Core Summary Cards (Persyaratan 1, 2, 3, 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Karyawan */}
        <div
          onClick={() => setActiveTabWithTransition("karyawan")}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Karyawan
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {karyawanList.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">Orang</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-indigo-600 font-medium">
            <span>Lihat seluruh karyawan</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* 2. Total Divisi */}
        <div
          onClick={() => setActiveTabWithTransition("divisi")}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-sky-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Divisi
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {divisiList.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">Divisi</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-sky-600 font-medium">
            <span>Kelola struktur divisi</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* 3. Total Jabatan */}
        <div
          onClick={() => setActiveTabWithTransition("jabatan")}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Jabatan
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {jabatanList.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">Posisi</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-purple-600 font-medium">
            <span>Kelola list jabatan</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* 4. Periode Penilaian (4 Quartal) */}
        <div
          onClick={() => setActiveTabWithTransition("periode")}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Periode Penilaian
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {periodeList.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Quartal (1 Thn)
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-emerald-600 font-medium">
            <span>Siklus Q1 - Q4 aktif</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* Persyaratan 4 Detail: 4 Quartal Overview */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-indigo-600" />
              Siklus Periode Penilaian (4 Quartal, 1 Periode = 3 Bulan)
            </h3>
            <p className="text-xs text-slate-500">
              Setiap tahun penilaian terbagi menjadi 4 quartal dengan jadwal
              pengisian masing-masing
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTabWithTransition("periode")}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
          >
            Pengaturan Periode
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {periodeList.map((p) => {
            let statusBadge = "bg-slate-100 text-slate-600 border-slate-200";
            if (p.status === "Aktif") {
              statusBadge =
                "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold animate-pulse";
            } else if (p.status === "Complete") {
              statusBadge = "bg-blue-50 text-blue-700 border-blue-200";
            }

            return (
              <div
                key={p.id}
                className={`p-3.5 rounded-xl border transition ${
                  p.status === "Aktif"
                    ? "border-emerald-300 bg-emerald-50/20 ring-2 ring-emerald-500/10"
                    : "border-slate-200 bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-slate-900 text-white">
                    {p.quartal}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] border font-medium ${statusBadge}`}
                  >
                    {p.status === "Complete"
                      ? "Selesai"
                      : p.status === "Aktif"
                      ? "Sedang Aktif"
                      : "Menunggu"}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800">{p.namaPeriode}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {p.quartalLabel}
                </p>
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-600">
                  <span>Waktu Pengisian:</span>
                  <span className="font-semibold text-slate-800">
                    {p.startDate.slice(5)} s/d {p.endDate.slice(5)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 5 & 6: Evaluasi Quartal Sebelumnya & Distribusi Skor KPI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Persyaratan 5: Evaluasi Quartal (Rata-rata, Tertinggi, Terendah) */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  Hasil Evaluasi Kinerja
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Evaluasi Quartal Sebelumnya
                </h3>
              </div>
              {/* Select Quarter */}
              <select
                aria-label="Pilih Quartal Evaluasi"
                value={selectedQuarterId}
                onChange={(e) => setSelectedQuarterId(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {periodeList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.quartal} ({p.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl mb-4 text-xs text-slate-600 flex items-center justify-between">
              <span className="font-medium">{targetPeriod?.namaPeriode}</span>
              <span className="text-[11px] font-semibold text-slate-500">
                {stats.totalEvaluasi} Dinilai
              </span>
            </div>

            {/* Metrics cards */}
            <div className="space-y-3">
              {/* Rata-rata Skor */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-indigo-900/80">
                    Rata-Rata Skor KPI
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kategori: {stats.avgScore >= 85 ? "Sangat Baik" : stats.avgScore >= 75 ? "Baik" : "Cukup"}
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-indigo-700">
                    {stats.avgScore}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    /100
                  </span>
                </div>
              </div>

              {/* Skor Tertinggi */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <p className="text-xs font-semibold text-emerald-900">
                      Skor Tertinggi
                    </p>
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {stats.highest?.karyawanNama || "-"}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {stats.highest?.divisiNama || ""}
                  </p>
                </div>
                <span className="text-2xl font-extrabold text-emerald-700">
                  {stats.highest?.score || 0}
                </span>
              </div>

              {/* Skor Terendah */}
              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <p className="text-xs font-semibold text-rose-900">
                      Skor Terendah
                    </p>
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {stats.lowest?.karyawanNama || "-"}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {stats.lowest?.divisiNama || ""}
                  </p>
                </div>
                <span className="text-2xl font-extrabold text-rose-700">
                  {stats.lowest?.score || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTabWithTransition("laporan")}
              className="w-full py-2 px-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/60 rounded-xl transition flex items-center justify-center gap-1"
            >
              Buka Laporan Kinerja Lengkap
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Persyaratan 6: Distribusi Skor KPI */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  Distribusi Kategori
                </span>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-indigo-600" />
                  Distribusi Skor Penilaian Kinerja Karyawan
                </h3>
              </div>
              <span className="text-xs font-medium text-slate-500">
                Total Sampel: {stats.totalEvaluasi} Karyawan
              </span>
            </div>

            {/* Distribution Visual Bar */}
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex mb-6 p-0.5">
              {distItems.map((item, idx) => {
                if (item.count === 0) return null;
                return (
                  <div
                    key={idx}
                    style={{ width: `${item.percent}%` }}
                    className={`h-full ${item.color} first:rounded-l-full last:rounded-r-full transition-all duration-500 relative group`}
                    title={`${item.label}: ${item.count} (${item.percent}%)`}
                  />
                );
              })}
            </div>

            {/* Breakdown List */}
            <div className="space-y-3">
              {distItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3.5 h-3.5 rounded-md ${item.color} shrink-0`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          {item.label}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${item.badgeColor}`}
                        >
                          Skor {item.scoreRange}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-24 sm:w-36 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <div className="text-right min-w-[70px]">
                      <span className="text-xs font-bold text-slate-900">
                        {item.count} Org
                      </span>
                      <span className="text-[11px] text-slate-400 ml-1">
                        ({item.percent}%)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Sistem penilaian menggunakan pembobotan 100% KPI Umum & KPI Pilar
            </span>
            <button
              type="button"
              onClick={() => setActiveTabWithTransition("indikator")}
              className="font-semibold text-indigo-600 hover:underline"
            >
              Lihat Bobot Indikator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
