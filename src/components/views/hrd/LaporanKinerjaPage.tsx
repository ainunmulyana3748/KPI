"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  BarChart3,
  Filter,
  Trophy,
  Medal,
  Award,
  Eye,
  Building2,
  Briefcase,
  Calendar,
  Printer,
  Download,
  Users,
} from "lucide-react";
import { PenilaianKinerja, getScoreCategoryBadgeClass } from "@/types/kpi";
import { RincianPenilaianModal } from "./RincianPenilaianModal";

export function LaporanKinerjaPage() {
  const {
    periodeList,
    divisiList,
    jabatanList,
    penilaianList,
    karyawanList,
    previousCompletedPeriode,
  } = useApp();

  // Filters
  const [selectedPeriode, setSelectedPeriode] = useState<string>(
    previousCompletedPeriode?.id || periodeList[0]?.id || "per-1"
  );
  const [selectedDivisi, setSelectedDivisi] = useState<string>("all");
  const [selectedJabatan, setSelectedJabatan] = useState<string>("all");

  const [activeModalPenilaian, setActiveModalPenilaian] =
    useState<PenilaianKinerja | null>(null);

  // Filtered Jabatan dropdown based on selected divisi
  const availableJabatan = jabatanList.filter(
    (j) => selectedDivisi === "all" || j.divisiId === selectedDivisi
  );

  // Evaluations matching filters
  const filteredEvaluations = penilaianList
    .filter((p) => {
      const matchesPeriod = p.periodeId === selectedPeriode;
      const emp = karyawanList.find((k) => k.id === p.karyawanId);

      const matchesDivisi =
        selectedDivisi === "all" || (emp && emp.divisiId === selectedDivisi);
      const matchesJabatan =
        selectedJabatan === "all" || (emp && emp.jabatanId === selectedJabatan);

      return matchesPeriod && matchesDivisi && matchesJabatan && p.status === "Sudah Dinilai";
    })
    .sort((a, b) => b.nilaiAkhir - a.nilaiAkhir); // Sort by highest score for Ranking

  const currentPeriodObj = periodeList.find((p) => p.id === selectedPeriode);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <section className="mb-8 hidden border-b-2 border-indigo-900 pb-5 print:block">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-indigo-700">Laporan resmi · Evaluasi kinerja</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Peringkat Kinerja Karyawan</h1>
        <div className="mt-3 flex flex-wrap gap-x-8 gap-y-1 text-sm text-slate-600">
          <span>Periode: <strong className="text-slate-900">{currentPeriodObj?.namaPeriode}</strong></span>
          <span>Divisi: <strong className="text-slate-900">{selectedDivisi === "all" ? "Semua divisi" : divisiList.find((divisi) => divisi.id === selectedDivisi)?.nama}</strong></span>
          <span>Dicetak: <strong className="text-slate-900">{new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}</strong></span>
        </div>
      </section>

      {/* Header & Export Actions */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Laporan & Papan Peringkat Kinerja Karyawan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Lihat peringkat evaluasi hasil penilaian kinerja karyawan dengan
            filter periode quartal, divisi, dan jabatan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Laporan
          </button>
        </div>
      </div>

      {/* Filter Bar: Periode Penilaian, Divisi, Jabatan */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs print:hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          <Filter className="w-4 h-4 text-indigo-600" />
          Filter Kriteria Laporan
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. Filter Periode Penilaian */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Periode Penilaian
            </label>
            <select
              value={selectedPeriode}
              onChange={(e) => setSelectedPeriode(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
            >
              {periodeList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.namaPeriode} ({p.quartalLabel})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Filter Divisi */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Divisi
            </label>
            <select
              value={selectedDivisi}
              onChange={(e) => {
                setSelectedDivisi(e.target.value);
                setSelectedJabatan("all"); // reset jabatan
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Semua Divisi (5 Divisi)</option>
              {divisiList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Filter Jabatan */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Jabatan
            </label>
            <select
              value={selectedJabatan}
              onChange={(e) => setSelectedJabatan(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Semua Jabatan</option>
              {availableJabatan.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nama} ({j.divisiNama})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Highlights (Jika ada minimal 3 hasil) */}
      {filteredEvaluations.length >= 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Juara 2 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5 order-2 sm:order-1">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 font-black text-sm flex items-center justify-center border border-slate-200 shrink-0">
              #2
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Peringkat 2
              </span>
              <p className="text-xs font-bold text-slate-900 truncate">
                {filteredEvaluations[1].karyawanNama}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {filteredEvaluations[1].divisiNama}
              </p>
            </div>
            <span className="text-lg font-black text-slate-800">
              {filteredEvaluations[1].nilaiAkhir}
            </span>
          </div>

          {/* Juara 1 */}
          <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50/50 p-4 rounded-2xl border border-amber-200 shadow-xs flex items-center gap-3.5 order-1 sm:order-2 ring-2 ring-amber-400/20">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-amber-950 font-black text-base flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-700 flex items-center gap-1">
                <Medal className="w-3 h-3 text-amber-600" />
                Peringkat 1 (Terbaik)
              </span>
              <p className="text-sm font-bold text-slate-900 truncate">
                {filteredEvaluations[0].karyawanNama}
              </p>
              <p className="text-[11px] text-slate-600 truncate">
                {filteredEvaluations[0].divisiNama}
              </p>
            </div>
            <span className="text-2xl font-black text-amber-700">
              {filteredEvaluations[0].nilaiAkhir}
            </span>
          </div>

          {/* Juara 3 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5 order-3 sm:order-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100/60 text-amber-800 font-black text-sm flex items-center justify-center border border-amber-200 shrink-0">
              #3
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Peringkat 3
              </span>
              <p className="text-xs font-bold text-slate-900 truncate">
                {filteredEvaluations[2].karyawanNama}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {filteredEvaluations[2].divisiNama}
              </p>
            </div>
            <span className="text-lg font-black text-slate-800">
              {filteredEvaluations[2].nilaiAkhir}
            </span>
          </div>
        </div>
      )}

      {/* Table Leaderboard: ranking, karyawan, divisi, nilai akhir, kategori, aksi(untuk melihat detail) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Peringkat Kinerja ({filteredEvaluations.length} Karyawan)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Periode: <strong>{currentPeriodObj?.namaPeriode}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-20 text-center">Ranking</th>
                <th className="py-3 px-4 min-w-[240px]">Karyawan</th>
                <th className="py-3 px-4 min-w-[180px]">Divisi</th>
                <th className="py-3 px-4 min-w-[180px]">Jabatan</th>
                <th className="py-3 px-4 w-32 text-center">Nilai Akhir</th>
                <th className="py-3 px-4 w-32 text-center">Kategori</th>
                <th className="py-3 px-4 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredEvaluations.length > 0 ? (
                filteredEvaluations.map((ev, idx) => {
                  const rank = idx + 1;
                  const badgeClass = getScoreCategoryBadgeClass(ev.kategori);

                  let rankBadge = "bg-slate-100 text-slate-600";
                  if (rank === 1)
                    rankBadge =
                      "bg-amber-100 text-amber-800 border border-amber-300 font-extrabold";
                  else if (rank === 2)
                    rankBadge =
                      "bg-slate-200 text-slate-800 border border-slate-300 font-extrabold";
                  else if (rank === 3)
                    rankBadge =
                      "bg-orange-100 text-orange-800 border border-orange-300 font-extrabold";

                  return (
                    <tr
                      key={ev.id}
                      className="hover:bg-slate-50/80 transition group"
                    >
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${rankBadge}`}
                        >
                          #{rank}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                          {ev.karyawanNama}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {ev.karyawanNik}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {ev.divisiNama}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {ev.jabatanNama}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-base font-extrabold text-slate-900">
                          {ev.nilaiAkhir}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          / 100
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${badgeClass}`}
                        >
                          {ev.kategori}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setActiveModalPenilaian(ev)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition"
                          title="Lihat Detail / Rincian Penilaian"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-slate-400 text-xs"
                  >
                    Tidak ada hasil penilaian kinerja pada kriteria filter yang
                    dipilih
                  </td>
                </tr>
              )}
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
