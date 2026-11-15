"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  ClipboardCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Edit3,
  Calendar,
  Building2,
  Briefcase,
} from "lucide-react";
import { getScoreCategoryBadgeClass } from "@/types/kpi";

export function InputPenilaianPage() {
  const {
    currentUser,
    karyawanList,
    periodeList,
    penilaianList,
    activePeriode,
    setActiveTabWithTransition,
    setSelectedNilaiInputTarget,
  } = useApp();

  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string>(
    activePeriode?.id || ""
  );
  const selectedPeriode = periodeList.find((periode) => periode.id === selectedPeriodeId);
  const isEvaluationOpen = selectedPeriode?.status === "Aktif";
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const managerEmp = karyawanList.find((k) => k.id === currentUser.karyawanId);

  // Subordinates under this manager
  const subordinates = karyawanList.filter(
    (k) =>
      managerEmp &&
      k.divisiId === managerEmp.divisiId &&
      k.id !== managerEmp.id
  );

  const subItems = subordinates.map((emp) => {
    const p = penilaianList.find(
      (item) =>
        item.karyawanId === emp.id &&
        item.periodeId === selectedPeriodeId &&
        item.status === "Sudah Dinilai"
    );
    const sudahDinilai = !!p;
    return {
      karyawan: emp,
      penilaian: p || null,
      sudahDinilai,
      nilaiAkhir: p ? p.nilaiAkhir : null,
      kategori: p ? p.kategori : null,
    };
  });

  const filteredItems = subItems.filter((it) => {
    const matchesSearch =
      it.karyawan.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      it.karyawan.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      it.karyawan.jabatanNama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "sudah" && it.sudahDinilai) ||
      (statusFilter === "belum" && !it.sudahDinilai);

    return matchesSearch && matchesStatus;
  });

  const handleOpenForm = (karyawanId: string) => {
    if (!isEvaluationOpen) return;
    setSelectedNilaiInputTarget({
      karyawanId,
      periodeId: selectedPeriodeId,
    });
    setActiveTabWithTransition("manager-form-nilai");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-indigo-600" />
            Daftar Penilaian Kinerja Karyawan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pilih karyawan bawahan Anda di divisi{" "}
            <strong>{managerEmp?.divisiNama}</strong> untuk memberikan input
            skor indikator KPI.
          </p>
        </div>

        {/* Periode Selector */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
          <select
            value={selectedPeriodeId}
            onChange={(e) => setSelectedPeriodeId(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
          >
            {!activePeriode && <option value="">Tidak ada periode aktif</option>}
            {periodeList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.namaPeriode} ({p.quartalLabel}) — {p.status}
              </option>
            ))}
          </select>
        </div>
      </div>

        {!isEvaluationOpen && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status">
            Penilaian hanya dapat diinput pada periode berstatus Aktif. Minta HRD membuka periode terlebih dahulu.
          </p>
        )}

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">

        {/* Search & Filter */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama karyawan atau jabatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Semua Status</option>
              <option value="sudah">Sudah Dinilai</option>
              <option value="belum">Belum Dinilai</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Total {filteredItems.length} Karyawan Bawahan
          </span>
        </div>

        {/* Persyaratan: Table nama karyawan yg harus dinilai, ada nomor, nik, nama, divisi, jabatan, nilai akhir, status penilaian, action(input nilai) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-14 text-center">Nomor</th>
                <th className="py-3 px-4 w-28">NIK</th>
                <th className="py-3 px-4 min-w-[220px]">Nama Karyawan</th>
                <th className="py-3 px-4 min-w-[170px]">Divisi</th>
                <th className="py-3 px-4 min-w-[180px]">Jabatan</th>
                <th className="py-3 px-4 w-28 text-center">Nilai Akhir</th>
                <th className="py-3 px-4 w-32 text-center">Status Penilaian</th>
                <th className="py-3 px-4 w-32 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => {
                  const badgeClass = item.kategori
                    ? getScoreCategoryBadgeClass(item.kategori)
                    : "";

                  return (
                    <tr
                      key={item.karyawan.id}
                      className="hover:bg-slate-50/80 transition"
                    >
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                        {item.karyawan.nik}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden ring-1 ring-slate-300 shrink-0">
                            {item.karyawan.avatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.karyawan.avatar}
                                alt={item.karyawan.nama}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 text-xs">
                                {item.karyawan.nama.slice(0, 1)}
                              </div>
                            )}
                          </div>
                          <span className="font-bold text-slate-900">
                            {item.karyawan.nama}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {item.karyawan.divisiNama}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {item.karyawan.jabatanNama}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {item.nilaiAkhir !== null ? (
                          <div>
                            <span className="text-sm font-extrabold text-slate-900">
                              {item.nilaiAkhir}
                            </span>
                            {item.kategori && (
                              <span
                                className={`block text-[10px] font-bold mt-0.5 px-1.5 py-0.2 rounded border ${badgeClass}`}
                              >
                                {item.kategori}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            item.sudahDinilai
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {item.sudahDinilai ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Sudah Dinilai
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-amber-600" />
                              Belum Dinilai
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          disabled={!isEvaluationOpen}
                          onClick={() => handleOpenForm(item.karyawan.id)}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            item.sudahDinilai
                              ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              : "bg-indigo-600 text-white shadow-xs hover:bg-indigo-700"
                          }`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          {item.sudahDinilai ? "Edit Nilai" : "Input Nilai"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-slate-400 text-xs"
                  >
                    Tidak ada data bawahan pada divisi ini
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
