"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  ArrowLeft,
  User,
  Building2,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Award,
  Eye,
  FileText,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { formatDateIndo } from "@/lib/utils";
import { PenilaianKinerja, getScoreCategoryBadgeClass } from "@/types/kpi";
import { RincianPenilaianModal } from "./RincianPenilaianModal";

export function KaryawanDetailPage() {
  const {
    selectedKaryawanDetailId,
    karyawanList,
    setActiveTabWithTransition,
    getPenilaianByKaryawan,
  } = useApp();

  const [activeModalPenilaian, setActiveModalPenilaian] =
    useState<PenilaianKinerja | null>(null);

  const karyawan = karyawanList.find((k) => k.id === selectedKaryawanDetailId);

  if (!karyawan) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
        <p className="text-sm text-slate-500 mb-4">
          Data karyawan tidak ditemukan.
        </p>
        <button
          type="button"
          onClick={() => setActiveTabWithTransition("karyawan")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Kembali ke Daftar Karyawan
        </button>
      </div>
    );
  }

  const evaluations = getPenilaianByKaryawan(karyawan.id);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => setActiveTabWithTransition("karyawan")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Karyawan
        </button>
      </div>

      {/* Main Profile Card (Seluruh Informasi Karyawan) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-indigo-50 border-2 border-indigo-200 overflow-hidden ring-4 ring-indigo-50 shadow-md shrink-0">
            {karyawan.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={karyawan.avatar}
                alt={karyawan.nama}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-indigo-700">
                {karyawan.nama.slice(0, 1)}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-900 text-white">
                {karyawan.nik}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                  karyawan.status === "Aktif"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                Status: {karyawan.status}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                Peran: {karyawan.role}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {karyawan.nama}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                {karyawan.jabatanNama}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Building2 className="w-4 h-4 text-sky-600" />
                {karyawan.divisiNama}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Email Perusahaan
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 break-all">
              <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{karyawan.email}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Nomor Telepon / WhatsApp
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{karyawan.phone || "-"}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Tanggal Bergabung
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{formatDateIndo(karyawan.tanggalBergabung)}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Alamat Domisili
            </span>
            <div className="flex items-start gap-2 text-xs font-medium text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{karyawan.alamat || "-"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Persyaratan: Riwayat Evaluasi Kinerja Karyawan (Penilaian Karyawan Per Individu) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Riwayat Evaluasi Kinerja Karyawan
            </h3>
            <p className="text-xs text-slate-500">
              Hasil penilaian per periode quartal mencakup Nilai KPI Umum, KPI
              Pilar, Nilai Akhir, Kategori, dan Rincian Penilaian.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {evaluations.length} Catatan Penilaian
          </span>
        </div>

        {/* Tabel Penilaian */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Periode Penilaian</th>
                <th className="py-3 px-4 text-center">Nilai KPI Umum</th>
                <th className="py-3 px-4 text-center">Nilai KPI Pilar</th>
                <th className="py-3 px-4 text-center">Nilai Akhir</th>
                <th className="py-3 px-4 text-center">Kategori</th>
                <th className="py-3 px-4 min-w-[200px]">Komentar Atasan</th>
                <th className="py-3 px-4 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {evaluations.length > 0 ? (
                evaluations.map((ev) => {
                  const badgeClass = getScoreCategoryBadgeClass(ev.kategori);

                  return (
                    <tr key={ev.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">
                          {ev.periodeNama}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Penilai: {ev.penilaiNama}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                          {ev.nilaiKpiUmum}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                          {ev.nilaiKpiPilar}
                        </span>
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
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${badgeClass}`}
                        >
                          {ev.kategori}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 italic text-[11px] leading-relaxed">
                        &quot;{ev.komentarAtasan || "-"}&quot;
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setActiveModalPenilaian(ev)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Rincian
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-slate-400 text-xs"
                  >
                    Belum ada riwayat penilaian kinerja untuk karyawan ini.
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
