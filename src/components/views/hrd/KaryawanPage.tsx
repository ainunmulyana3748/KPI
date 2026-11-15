"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Building2,
  Briefcase,
  Mail,
  CheckCircle2,
  XCircle,
  X,
  Check,
  AlertCircle,
  Filter,
} from "lucide-react";
import { Karyawan, Role } from "@/types/kpi";

export function KaryawanPage() {
  const {
    karyawanList,
    divisiList,
    jabatanList,
    addKaryawan,
    updateKaryawan,
    deleteKaryawan,
    setActiveTabWithTransition,
    setSelectedKaryawanDetailId,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivisi, setSelectedDivisi] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKaryawan, setEditingKaryawan] = useState<Karyawan | null>(null);

  // Form states
  const [nik, setNik] = useState("");
  const [nama, setNama] = useState("");
  const [divisiId, setDivisiId] = useState("");
  const [jabatanId, setJabatanId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [alamat, setAlamat] = useState("");
  const [tanggalBergabung, setTanggalBergabung] = useState("");
  const [status, setStatus] = useState<"Aktif" | "Non Aktif">("Aktif");
  const [role, setRole] = useState<Role>("karyawan");
  const [errorMsg, setErrorMsg] = useState("");

  // Delete confirm modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filtered employees
  const filteredKaryawan = karyawanList.filter((k) => {
    const matchesSearch =
      k.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.jabatanNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.divisiNama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivisi =
      selectedDivisi === "all" || k.divisiId === selectedDivisi;
    const matchesStatus =
      selectedStatus === "all" || k.status === selectedStatus;

    return matchesSearch && matchesDivisi && matchesStatus;
  });

  // Jabatan options filtered by selected divisi in modal
  const filteredJabatanOptions = jabatanList.filter(
    (j) => !divisiId || j.divisiId === divisiId
  );

  const handleOpenAdd = () => {
    const defaultDiv = divisiList[0]?.id || "";
    const defaultJab =
      jabatanList.find((j) => j.divisiId === defaultDiv)?.id ||
      jabatanList[0]?.id ||
      "";

    setEditingKaryawan(null);
    setNik(`EMP-2024-${karyawanList.length + 101}`);
    setNama("");
    setDivisiId(defaultDiv);
    setJabatanId(defaultJab);
    setEmail("");
    setPhone("");
    setAlamat("");
    setTanggalBergabung(new Date().toISOString().split("T")[0]);
    setStatus("Aktif");
    setRole("karyawan");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (k: Karyawan) => {
    setEditingKaryawan(k);
    setNik(k.nik);
    setNama(k.nama);
    setDivisiId(k.divisiId);
    setJabatanId(k.jabatanId);
    setEmail(k.email);
    setPhone(k.phone);
    setAlamat(k.alamat);
    setTanggalBergabung(k.tanggalBergabung);
    setStatus(k.status);
    setRole(k.role);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleDivisiChangeInModal = (newDivId: string) => {
    setDivisiId(newDivId);
    const firstJab = jabatanList.find((j) => j.divisiId === newDivId);
    if (firstJab) {
      setJabatanId(firstJab.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nik.trim() || !nama.trim() || !email.trim()) {
      setErrorMsg("NIK, Nama Lengkap, dan Email wajib diisi!");
      return;
    }
    if (!divisiId || !jabatanId) {
      setErrorMsg("Pilih Divisi dan Jabatan karyawan!");
      return;
    }

    const div = divisiList.find((d) => d.id === divisiId);
    const jab = jabatanList.find((j) => j.id === jabatanId);

    if (editingKaryawan) {
      updateKaryawan(editingKaryawan.id, {
        nik: nik.trim(),
        nama: nama.trim(),
        divisiId,
        divisiNama: div ? div.nama : "",
        jabatanId,
        jabatanNama: jab ? jab.nama : "",
        email: email.trim(),
        phone: phone.trim(),
        alamat: alamat.trim(),
        tanggalBergabung,
        status,
        role,
      });
    } else {
      addKaryawan({
        nik: nik.trim(),
        nama: nama.trim(),
        divisiId,
        divisiNama: div ? div.nama : "",
        jabatanId,
        jabatanNama: jab ? jab.nama : "",
        email: email.trim(),
        phone: phone.trim(),
        alamat: alamat.trim(),
        tanggalBergabung,
        status,
        role,
      });
    }
    setIsModalOpen(false);
  };

  const handleGoToDetail = (kId: string) => {
    setSelectedKaryawanDetailId(kId);
    setActiveTabWithTransition("karyawan-detail");
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Daftar Seluruh Karyawan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Menampilkan data 15 karyawan (3 orang per 5 divisi), profil
            lengkap, dan riwayat evaluasi.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm hover:shadow transition"
        >
          <Plus className="w-4 h-4" />
          Tambah Karyawan
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari berdasarkan NIK, nama, email, divisi, jabatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                aria-label="Filter berdasarkan Divisi"
                value={selectedDivisi}
                onChange={(e) => setSelectedDivisi(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Semua Divisi</option>
                {divisiList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nama}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter berdasarkan Status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Non Aktif">Non Aktif</option>
              </select>
            </div>
          </div>

          <span className="text-xs text-slate-500 font-medium self-end lg:self-auto">
            Menampilkan {filteredKaryawan.length} dari {karyawanList.length} karyawan
          </span>
        </div>

        {/* Karyawan Table: Nomor, NIK, Nama Lengkap, Divisi, Jabatan, Email, Status (Aktif/Non Aktif), Action (Detail, Edit, Delete) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-14 text-center">Nomor</th>
                <th className="py-3 px-4 w-28">NIK</th>
                <th className="py-3 px-4 min-w-[220px]">Nama Lengkap</th>
                <th className="py-3 px-4 min-w-[170px]">Divisi</th>
                <th className="py-3 px-4 min-w-[180px]">Jabatan</th>
                <th className="py-3 px-4 min-w-[200px]">Email</th>
                <th className="py-3 px-4 w-28 text-center">Status</th>
                <th className="py-3 px-4 w-32 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredKaryawan.length > 0 ? (
                filteredKaryawan.map((k, idx) => (
                  <tr
                    key={k.id}
                    className="hover:bg-slate-50/80 transition group"
                  >
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                      {k.nik}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ring-1 ring-slate-300 shrink-0">
                          {k.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={k.avatar}
                              alt={k.nama}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 text-xs">
                              {k.nama.slice(0, 1)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                            {k.nama}
                          </p>
                          <span className="text-[10px] text-slate-400 capitalize">
                            Role: {k.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        {k.divisiNama}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {k.jabatanNama}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {k.email}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          k.status === "Aktif"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {k.status === "Aktif" ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-rose-600" />
                        )}
                        {k.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleGoToDetail(k.id)}
                          className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition"
                          title="Detail Karyawan & Riwayat Evaluasi"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(k)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="Edit Karyawan"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(k.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Hapus Karyawan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-slate-400 text-xs"
                  >
                    Tidak ada karyawan yang sesuai dengan kriteria pencarian
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit Karyawan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingKaryawan
                  ? "Edit Data Karyawan"
                  : "Tambah Karyawan Baru"}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Induk Karyawan (NIK) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="Contoh: EMP-2024-001"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Budi Santoso, S.Kom."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Divisi Penempatan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={divisiId}
                    onChange={(e) => handleDivisiChangeInModal(e.target.value)}
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
                    Jabatan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={jabatanId}
                    onChange={(e) => setJabatanId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    {filteredJabatanOptions.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Perusahaan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@kinerja.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Telepon / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Bergabung
                  </label>
                  <input
                    type="date"
                    value={tanggalBergabung}
                    onChange={(e) => setTanggalBergabung(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Karyawan
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Peran Sistem (Role)
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="karyawan">Karyawan</option>
                    <option value="manager">Manager</option>
                    <option value="hrd">HRD / Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Domisili
                </label>
                <textarea
                  rows={2}
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Alamat tempat tinggal lengkap karyawan..."
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
                  {editingKaryawan ? "Simpan Perubahan" : "Simpan Karyawan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Karyawan */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-2">
              Hapus Karyawan Ini?
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Menghapus karyawan ini juga akan menghapus akun login dan riwayat
              evaluasi kinerja yang terkait.
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
                  deleteKaryawan(deleteId);
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
