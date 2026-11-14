"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Target,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Check,
  AlertCircle,
  Percent,
} from "lucide-react";
import { IndikatorKpi } from "@/types/kpi";

export function IndikatorKpiPage() {
  const {
    indikatorList,
    totalBobotIndikator,
    isBobot100,
    addIndikator,
    updateIndikator,
    deleteIndikator,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndikator, setEditingIndikator] = useState<IndikatorKpi | null>(
    null
  );

  // Form states
  const [nama, setNama] = useState("");
  const [tipe, setTipe] = useState<"KPI Umum" | "KPI Pilar">("KPI Pilar");
  const [bobot, setBobot] = useState<number>(20);
  const [targetKinerja, setTargetKinerja] = useState("");
  const [status, setStatus] = useState<"Aktif" | "Non Aktif">("Aktif");
  const [errorMsg, setErrorMsg] = useState("");

  // Delete modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sisaKuota = Math.max(0, 100 - totalBobotIndikator);

  const handleOpenAdd = () => {
    if (isBobot100) return;
    setEditingIndikator(null);
    setNama("");
    setTipe("KPI Pilar");
    setBobot(Math.min(20, sisaKuota));
    setTargetKinerja("");
    setStatus("Aktif");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ind: IndikatorKpi) => {
    setEditingIndikator(ind);
    setNama(ind.nama);
    setTipe(ind.tipe);
    setBobot(ind.bobot);
    setTargetKinerja(ind.targetKinerja);
    setStatus(ind.status);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setErrorMsg("Nama indikator wajib diisi!");
      return;
    }
    if (bobot <= 0) {
      setErrorMsg("Bobot harus lebih besar dari 0%!");
      return;
    }

    if (editingIndikator) {
      const res = updateIndikator(editingIndikator.id, {
        nama: nama.trim(),
        tipe,
        bobot: Number(bobot),
        targetKinerja: targetKinerja.trim(),
        status,
      });
      if (!res.success) {
        setErrorMsg(res.message || "Gagal memperbarui indikator");
        return;
      }
    } else {
      const res = addIndikator({
        nama: nama.trim(),
        tipe,
        bobot: Number(bobot),
        targetKinerja: targetKinerja.trim(),
        status,
      });
      if (!res.success) {
        setErrorMsg(res.message || "Gagal menambahkan indikator");
        return;
      }
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Bobot Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Pengaturan Indikator KPI & Pembobotan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Setting indikator kinerja standar (KPI Umum & KPI Pilar) dengan
            total kumulatif persentase 100%.
          </p>
        </div>

        {/* Tombol Tambah Indikator (Disable jika sudah 100%) */}
        <div className="relative">
          <button
            type="button"
            onClick={handleOpenAdd}
            disabled={isBobot100}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition ${
              isBobot100
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow"
            }`}
            title={
              isBobot100
                ? "Total bobot sudah 100%. Tombol tambah otomatis di-nonaktifkan."
                : "Tambah Indikator KPI baru"
            }
          >
            <Plus className="w-4 h-4" />
            Tambah Indikator KPI
          </button>
        </div>
      </div>

      {/* Cumulative Weight Meter Banner */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          isBobot100
            ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
            : "bg-amber-50/70 border-amber-200 text-amber-950"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            {isBobot100 ? (
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {isBobot100
                  ? "Kumulatif Bobot KPI Sempurna (100%)"
                  : `Kumulatif Bobot Belum Mencapai 100% (Saat Ini: ${totalBobotIndikator}%)`}
              </h3>
              <p className="text-[11px] opacity-80">
                {isBobot100
                  ? "Seluruh bobot indikator telah memenuhi syarat 100%. Tombol tambah indikator dinonaktifkan."
                  : `Sisa kuota bobot yang dapat dialokasikan: ${sisaKuota}%. Anda akan diingatkan jika berpindah halaman.`}
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-1 self-end sm:self-auto">
            <span
              className={`text-2xl font-black ${
                isBobot100 ? "text-emerald-700" : "text-amber-700"
              }`}
            >
              {totalBobotIndikator}%
            </span>
            <span className="text-xs font-semibold opacity-60">/ 100%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200/80 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isBobot100 ? "bg-emerald-600" : "bg-amber-500"
            }`}
            style={{ width: `${Math.min(100, totalBobotIndikator)}%` }}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Daftar Indikator Penilaian Aktif ({indikatorList.length} Indikator)
          </h3>
          <span className="text-xs text-slate-500">
            Total Bobot:{" "}
            <strong className="text-indigo-600">{totalBobotIndikator}%</strong>
          </span>
        </div>

        {/* Table: nomor, nama indikator, bobot, target kinerja (deskripsi), status dan aksi (edit dan delete) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-14 text-center">Nomor</th>
                <th className="py-3 px-4 min-w-[220px]">Nama Indikator</th>
                <th className="py-3 px-4 w-28">Kategori Tipe</th>
                <th className="py-3 px-4 w-28 text-center">Bobot</th>
                <th className="py-3 px-4 min-w-[320px]">
                  Target Kinerja (Deskripsi)
                </th>
                <th className="py-3 px-4 w-24 text-center">Status</th>
                <th className="py-3 px-4 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {indikatorList.map((ind, idx) => (
                <tr
                  key={ind.id}
                  className="hover:bg-slate-50/80 transition group"
                >
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                      {ind.nama}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        ind.tipe === "KPI Pilar"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {ind.tipe}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-md text-xs font-black bg-slate-100 text-slate-800">
                      {ind.bobot}
                      <Percent className="w-3 h-3 text-slate-400" />
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 leading-relaxed">
                    {ind.targetKinerja}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        ind.status === "Aktif"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {ind.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(ind)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="Edit Indikator"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(ind.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Hapus Indikator"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit Indikator */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingIndikator
                  ? "Edit Indikator KPI"
                  : "Tambah Indikator KPI"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Indikator KPI <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kualitas Output & Ketepatan SOP"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori / Tipe
                  </label>
                  <select
                    value={tipe}
                    onChange={(e) =>
                      setTipe(e.target.value as "KPI Umum" | "KPI Pilar")
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="KPI Pilar">KPI Pilar</option>
                    <option value="KPI Umum">KPI Umum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bobot (%) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={bobot}
                    onChange={(e) => setBobot(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Kinerja (Deskripsi)
                </label>
                <textarea
                  rows={3}
                  placeholder="Uraikan target kinerja yang diharapkan untuk indikator ini..."
                  value={targetKinerja}
                  onChange={(e) => setTargetKinerja(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Indikator
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "Aktif" | "Non Aktif")
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Non Aktif">Non Aktif</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {editingIndikator ? "Simpan Perubahan" : "Simpan Indikator"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Indikator */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-2">
              Hapus Indikator Ini?
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Menghapus indikator akan mengurangi total bobot kumulatif.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteIndikator(deleteId);
                  setDeleteId(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
