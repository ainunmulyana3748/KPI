"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  CalendarClock,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  X,
  Check,
  Lock,
} from "lucide-react";
import { PeriodePenilaian, PeriodeStatus, QuartalType } from "@/types/kpi";

export function PeriodePenilaianPage() {
  const {
    currentUser,
    periodeList,
    addPeriode,
    updatePeriode,
    deletePeriode,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriode, setEditingPeriode] = useState<PeriodePenilaian | null>(
    null
  );

  // Form states
  const [quartal, setQuartal] = useState<QuartalType>("Q2");
  const currentYear = new Date().getFullYear();
  const years = [...new Set([...periodeList.map((periode) => periode.tahun), currentYear])].sort((a, b) => b - a);
  const [selectedYear, setSelectedYear] = useState<number>(years[0] ?? currentYear);
  const [tahun, setTahun] = useState<number>(currentYear);
  const [namaPeriode, setNamaPeriode] = useState("");
  const [quartalLabel, setQuartalLabel] = useState("April - Juni 2026");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Delete confirm modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getQuartalDefault = (q: QuartalType, yr: number) => {
    switch (q) {
      case "Q1":
        return {
          nama: `Penilaian Kinerja Q1 ${yr}`,
          label: `Januari - Maret ${yr}`,
          defaultStart: `${yr}-04-01`,
          defaultEnd: `${yr}-04-10`,
        };
      case "Q2":
        return {
          nama: `Penilaian Kinerja Q2 ${yr}`,
          label: `April - Juni ${yr}`,
          defaultStart: `${yr}-07-01`,
          defaultEnd: `${yr}-07-15`,
        };
      case "Q3":
        return {
          nama: `Penilaian Kinerja Q3 ${yr}`,
          label: `Juli - September ${yr}`,
          defaultStart: `${yr}-10-01`,
          defaultEnd: `${yr}-10-15`,
        };
      case "Q4":
        return {
          nama: `Penilaian Kinerja Q4 ${yr}`,
          label: `Oktober - Desember ${yr}`,
          defaultStart: `${yr + 1}-01-02`,
          defaultEnd: `${yr + 1}-01-15`,
        };
    }
  };

  const handleQuartalChange = (q: QuartalType, yr: number = tahun) => {
    setQuartal(q);
    const def = getQuartalDefault(q, yr);
    setNamaPeriode(def.nama);
    setQuartalLabel(def.label);
    setStartDate(def.defaultStart);
    setEndDate(def.defaultEnd);
  };

  const handleOpenAdd = () => {
    setEditingPeriode(null);
    const def = getQuartalDefault("Q2", currentYear);
    setQuartal("Q2");
    setTahun(currentYear);
    setNamaPeriode(def.nama);
    setQuartalLabel(def.label);
    setStartDate(def.defaultStart);
    setEndDate(def.defaultEnd);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: PeriodePenilaian) => {
    if (p.status === "Complete") return; // Disabled for complete
    setEditingPeriode(p);
    setQuartal(p.quartal);
    setTahun(p.tahun);
    setNamaPeriode(p.namaPeriode);
    setQuartalLabel(p.quartalLabel);
    setStartDate(p.startDate);
    setEndDate(p.endDate);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPeriode.trim() || !startDate || !endDate) {
      setErrorMsg("Semua kolom tanggal dan nama periode wajib diisi!");
      return;
    }
    if (endDate <= startDate) {
      setErrorMsg("Tanggal akhir pengisian harus lebih besar dari tanggal mulai!");
      return;
    }

    if (editingPeriode) {
      updatePeriode(editingPeriode.id, {
        namaPeriode: namaPeriode.trim(),
        quartal,
        quartalLabel,
        tahun,
        startDate,
        endDate,
      });
    } else {
      const res = addPeriode({
        namaPeriode: namaPeriode.trim(),
        quartal,
        quartalLabel,
        tahun,
        startDate,
        endDate,
        status: "Waiting",
      });
      if (!res.success) {
        setErrorMsg(res.message || "Gagal menyimpan periode");
        return;
      }
    }
    setIsModalOpen(false);
  };

  const [todayStr] = useState(() => new Date().toISOString().split("T")[0]);

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-indigo-600" />
            Manajemen Periode Penilaian Quartal
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Penilaian dilakukan setiap 3 bulan (4 Quartal per tahun). HRD mengatur status periode secara manual.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm hover:shadow transition"
        >
          <Plus className="w-4 h-4" />
          Tambah Periode Penilaian
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Periode evaluasi {selectedYear}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {periodeList.filter((periode) => periode.tahun === selectedYear).length} periode penilaian
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="periode-year" className="text-xs font-medium text-slate-500">
              Tahun
            </label>
            <select
              id="periode-year"
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
            <span className="hidden text-xs font-medium text-slate-500 sm:inline">
              Hari ini: <strong>{todayStr}</strong>
            </span>
          </div>
        </div>

        {/* Table: nomor, nama periode, Quartal, tanggal aktif (start & end), Status(waiting/aktif/complete), aksi (delete/edit disabled jika complete) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-14 text-center">Nomor</th>
                <th className="py-3 px-4 min-w-[220px]">Nama Periode</th>
                <th className="py-3 px-4 min-w-[180px]">Quartal Penilaian</th>
                <th className="py-3 px-4 min-w-[240px]">
                  Tanggal Aktif Pengisian (Start & End)
                </th>
                <th className="py-3 px-4 w-32 text-center">Status</th>
                <th className="py-3 px-4 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {periodeList
                .filter((periode) => periode.tahun === selectedYear)
                .sort((a, b) => a.quartal.localeCompare(b.quartal))
                .map((p, idx) => {
                const isComplete = p.status === "Complete";
                const isAktif = p.status === "Aktif";

                let statusBadge =
                  "bg-slate-100 text-slate-600 border-slate-200";
                if (isAktif) {
                  statusBadge =
                    "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold animate-pulse";
                } else if (isComplete) {
                  statusBadge =
                    "bg-blue-50 text-blue-700 border-blue-200 font-semibold";
                }

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/80 transition group"
                  >
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {p.namaPeriode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-900 text-white">
                          {p.quartal}
                        </span>
                        <span className="text-slate-600 font-medium">
                          {p.quartalLabel}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="font-semibold text-slate-800">
                          {p.startDate}
                        </span>
                        <span className="text-slate-400">s/d</span>
                        <span className="font-semibold text-slate-800">
                          {p.endDate}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {currentUser.role === "hrd" ? (
                        <select
                          aria-label={`Ubah status ${p.namaPeriode}`}
                          value={p.status}
                          onChange={(event) => updatePeriode(p.id, { status: event.target.value as PeriodeStatus })}
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500 ${statusBadge}`}
                        >
                          <option value="Waiting">Waiting</option>
                          <option value="Aktif">Aktif</option>
                          <option value="Complete">Complete</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${statusBadge}`}>
                          {p.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {isComplete ? (
                        <div
                          className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-lg"
                          title="Periode yang sudah Complete tidak dapat diedit atau dihapus"
                        >
                          <Lock className="w-3 h-3" />
                          Terkunci
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                            title="Edit Periode"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(p.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Hapus Periode"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit Periode */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingPeriode
                  ? "Edit Periode Penilaian"
                  : "Tambah Periode Penilaian Baru"}
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

              {/* Dropdown Quartal (Q1 - Q4) yang otomatis mengisi tanggal periode penilaian */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pilihan Quartal <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={quartal}
                    onChange={(e) =>
                      handleQuartalChange(e.target.value as QuartalType)
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  >
                    <option value="Q1">Quartal 1 (Jan - Mar)</option>
                    <option value="Q2">Quartal 2 (Apr - Jun)</option>
                    <option value="Q3">Quartal 3 (Jul - Sep)</option>
                    <option value="Q4">Quartal 4 (Okt - Des)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tahun Evaluasi
                  </label>
                  <input
                    type="number"
                    value={tahun}
                    onChange={(e) => {
                      const yr = Number(e.target.value);
                      setTahun(yr);
                      handleQuartalChange(quartal, yr);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Periode Penilaian <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={namaPeriode}
                  onChange={(e) => setNamaPeriode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rentang Waktu Quartal (Otomatis Terisi)
                </label>
                <input
                  type="text"
                  value={quartalLabel}
                  readOnly
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 cursor-not-allowed font-medium"
                />
              </div>

              {/* Tanggal Aktif Start & End (Hanya ke tanggal masa depan) */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-indigo-50/40 rounded-xl border border-indigo-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Mulai Pengisian
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Akhir Pengisian
                  </label>
                  <input
                    type="date"
                    min={startDate || todayStr}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <p className="col-span-2 text-[10px] text-slate-500 leading-tight">
                  Status awal <strong>Waiting</strong>. HRD dapat mengubahnya
                  menjadi <strong>Aktif</strong> saat periode dibuka, lalu
                  <strong> Complete</strong> setelah periode ditutup.
                </p>
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
                  {editingPeriode ? "Simpan Perubahan" : "Simpan Periode"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Hapus Periode */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-2">
              Hapus Periode Ini?
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Periode yang dihapus tidak dapat dipulihkan.
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
                  deletePeriode(deleteId);
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
