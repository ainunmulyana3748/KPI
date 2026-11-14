"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Briefcase,
  Plus,
  Search,
  Edit2,
  Trash2,
  Building2,
  Users,
  AlertCircle,
  X,
  Check,
} from "lucide-react";
import { Jabatan } from "@/types/kpi";

export function JabatanPage() {
  const {
    jabatanList,
    divisiList,
    addJabatan,
    updateJabatan,
    deleteJabatan,
    karyawanList,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivisiFilter, setSelectedDivisiFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJabatan, setEditingJabatan] = useState<Jabatan | null>(null);

  // Form states
  const [nama, setNama] = useState("");
  const [divisiId, setDivisiId] = useState(divisiList[0]?.id || "");
  const [deskripsi, setDeskripsi] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Delete confirm modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredJabatan = jabatanList.filter((jab) => {
    const matchesSearch =
      jab.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jab.divisiNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jab.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivisi =
      selectedDivisiFilter === "all" || jab.divisiId === selectedDivisiFilter;
    return matchesSearch && matchesDivisi;
  });

  const handleOpenAdd = () => {
    setEditingJabatan(null);
    setNama("");
    setDivisiId(divisiList[0]?.id || "");
    setDeskripsi("");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (jab: Jabatan) => {
    setEditingJabatan(jab);
    setNama(jab.nama);
    setDivisiId(jab.divisiId);
    setDeskripsi(jab.deskripsi);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setErrorMsg("Nama jabatan wajib diisi!");
      return;
    }
    if (!divisiId) {
      setErrorMsg("Pilih divisi untuk jabatan ini!");
      return;
    }

    const div = divisiList.find((d) => d.id === divisiId);

    if (editingJabatan) {
      updateJabatan(editingJabatan.id, {
        nama: nama.trim(),
        divisiId,
        divisiNama: div ? div.nama : "",
        deskripsi: deskripsi.trim(),
      });
    } else {
      addJabatan({
        nama: nama.trim(),
        divisiId,
        divisiNama: div ? div.nama : "",
        deskripsi: deskripsi.trim(),
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Daftar Jabatan & Posisi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kelola seluruh posisi jabatan, divisi penempatan, dan deskripsi
            pekerjaan.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm hover:shadow transition"
        >
          <Plus className="w-4 h-4" />
          Tambah Jabatan
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 max-w-lg">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari jabatan atau divisi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>
            <select
              aria-label="Filter berdasarkan Divisi"
              value={selectedDivisiFilter}
              onChange={(e) => setSelectedDivisiFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Semua Divisi</option>
              {divisiList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs text-slate-500 font-medium self-end sm:self-auto">
            Menampilkan {filteredJabatan.length} dari {jabatanList.length} posisi
          </span>
        </div>

        {/* Jabatan Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-16 text-center">Nomor</th>
                <th className="py-3 px-4 min-w-[200px]">Nama Jabatan</th>
                <th className="py-3 px-4 min-w-[180px]">Divisi</th>
                <th className="py-3 px-4 min-w-[300px]">Deskripsi Jabatan</th>
                <th className="py-3 px-4 w-28 text-center">Karyawan</th>
                <th className="py-3 px-4 w-28 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredJabatan.length > 0 ? (
                filteredJabatan.map((jab, idx) => {
                  const empCount = karyawanList.filter(
                    (k) => k.jabatanId === jab.id
                  ).length;

                  return (
                    <tr
                      key={jab.id}
                      className="hover:bg-slate-50/80 transition"
                    >
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-slate-800">
                            {jab.nama}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {jab.divisiNama}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 leading-relaxed">
                        {jab.deskripsi || "-"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          <Users className="w-3 h-3 text-slate-400" />
                          {empCount}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(jab)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                            title="Edit Jabatan"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(jab.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Hapus Jabatan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-slate-400 text-xs"
                  >
                    Tidak ada jabatan yang sesuai dengan kriteria pencarian
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit Jabatan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingJabatan ? "Edit Data Jabatan" : "Tambah Jabatan Baru"}
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
                  Nama Jabatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Senior Software Engineer"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Divisi <span className="text-rose-500">*</span>
                </label>
                <select
                  value={divisiId}
                  onChange={(e) => setDivisiId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  {divisiList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi Jabatan
                </label>
                <textarea
                  rows={3}
                  placeholder="Deskripsikan tanggung jawab utama posisi ini..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
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
                  {editingJabatan ? "Simpan Perubahan" : "Simpan Jabatan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Jabatan */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-2">
              Hapus Jabatan Ini?
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Tindakan ini akan menghapus data jabatan dari sistem.
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
                  deleteJabatan(deleteId);
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
