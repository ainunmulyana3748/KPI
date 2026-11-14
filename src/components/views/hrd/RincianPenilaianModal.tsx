"use client";

import React from "react";
import { PenilaianKinerja, getScoreCategoryBadgeClass } from "@/types/kpi";
import {
  X,
  Award,
  Calendar,
  User,
  MessageSquare,
  CheckCircle2,
  Briefcase,
  Building2,
  FileText,
} from "lucide-react";

interface RincianPenilaianModalProps {
  penilaian: PenilaianKinerja | null;
  onClose: () => void;
}

export function RincianPenilaianModal({
  penilaian,
  onClose,
}: RincianPenilaianModalProps) {
  if (!penilaian) return null;

  const badgeClass = getScoreCategoryBadgeClass(penilaian.kategori);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              Rincian Evaluasi Kinerja Karyawan
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              {penilaian.karyawanNama}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                NIK: {penilaian.karyawanNik}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {penilaian.divisiNama}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {penilaian.jabatanNama}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-6 mt-6">
          {/* Top Score Banner: Periode, Nilai Akhir, Kategori Score */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
                <Calendar className="w-4 h-4" />
                <span>Periode Penilaian: {penilaian.periodeNama}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Dinilai oleh:{" "}
                <span className="font-semibold text-white">
                  {penilaian.penilaiNama}
                </span>{" "}
                {penilaian.tanggalPenilaian &&
                  `pada ${penilaian.tanggalPenilaian}`}
              </p>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-auto">
              <div className="text-right">
                <p className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                  Nilai Akhir
                </p>
                <div className="text-3xl font-extrabold text-white">
                  {penilaian.nilaiAkhir}
                  <span className="text-xs text-indigo-300 font-normal">
                    /100
                  </span>
                </div>
              </div>
              <div className="h-10 w-[1px] bg-white/20" />
              <div>
                <span
                  className={`inline-block px-3 py-1.5 rounded-xl text-xs font-bold border shadow-xs ${badgeClass}`}
                >
                  {penilaian.kategori}
                </span>
              </div>
            </div>
          </div>

          {/* Skor Pilar & Umum Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Nilai KPI Umum
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-800">
                  {penilaian.nilaiKpiUmum}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Meliputi Disiplin Kehadiran & Kerjasama Tim
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <span className="text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                Nilai KPI Pilar
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-indigo-700">
                  {penilaian.nilaiKpiPilar}
                </span>
                <span className="text-xs text-indigo-400">/ 100</span>
              </div>
              <p className="text-[11px] text-indigo-600/80 mt-1">
                Kualitas Output, SLA Target, & Problem Solving
              </p>
            </div>
          </div>

          {/* Ringkasan Penilaian */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Ringkasan Penilaian
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {penilaian.ringkasanPenilaian ||
                "Penilaian kinerja karyawan telah dihitung berdasarkan akumulasi seluruh indikator standar KPI."}
            </p>
          </div>

          {/* Breakdown Setiap Indikator KPI */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Rincian Skor Per Indikator KPI
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Indikator</th>
                    <th className="py-2.5 px-3">Tipe</th>
                    <th className="py-2.5 px-3 text-center">Bobot</th>
                    <th className="py-2.5 px-3 text-center">Penilaian</th>
                    <th className="py-2.5 px-3 text-right">Poin Skor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {penilaian.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {item.indikatorNama}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          {item.tipe}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold text-slate-600">
                        {item.bobot}%
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700">
                          Skor {item.score} / 5
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        {item.calculatedScore.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Persyaratan: Menampilkan 1 Komentar yang diberikan oleh penilai/atasan */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <div className="flex items-center gap-2 mb-2 text-amber-900">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Catatan & Komentar Atasan Penilai
              </h4>
            </div>
            <p className="text-xs text-amber-950 font-medium italic leading-relaxed pl-6 border-l-2 border-amber-400">
              &quot;{penilaian.komentarAtasan || "Karyawan telah menunjukkan dedikasi kerja yang konsisten dan patuh terhadap SOP operasional perusahaan."}&quot;
            </p>
            <div className="mt-2 text-right">
              <span className="text-[11px] font-semibold text-amber-800">
                — {penilaian.penilaiNama}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            Tutup Rincian
          </button>
        </div>
      </div>
    </div>
  );
}
