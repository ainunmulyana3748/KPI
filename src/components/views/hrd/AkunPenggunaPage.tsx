"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Key,
  AlertCircle,
  X,
  Check,
} from "lucide-react";
import { UserAccount, Role } from "@/types/kpi";

export function AkunPenggunaPage() {
  const {
    userList,
    karyawanList,
    addUser,
    updateUser,
    deleteUser,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("karyawan");
  const [karyawanId, setKaryawanId] = useState(karyawanList[0]?.id || "");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    const firstEmp = karyawanList[0];
    setEditingUser(null);
    setUsername("");
    setEmail(firstEmp ? firstEmp.email : "");
    setRole(firstEmp ? firstEmp.role : "karyawan");
    setKaryawanId(firstEmp ? firstEmp.id : "");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: UserAccount) => {
    setEditingUser(u);
    setUsername(u.username);
    setEmail(u.email);
    setRole(u.role);
    setKaryawanId(u.karyawanId);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleKaryawanSelect = (empId: string) => {
    setKaryawanId(empId);
    const emp = karyawanList.find((k) => k.id === empId);
    if (emp) {
      setEmail(emp.email);
      setRole(emp.role);
      if (!username) {
        setUsername(emp.email.split("@")[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!username.trim() || !email.trim()) {
      setErrorMsg("Username dan email wajib diisi.");
      return;
    }

    const emp = karyawanList.find((k) => k.id === karyawanId);
    if (!emp) {
      setErrorMsg("Pilih karyawan pemilik akun.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingUser) {
        const response = await fetch(`/api/auth/accounts/${encodeURIComponent(editingUser.id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username.trim(),
            role,
            karyawanId: emp.id,
            karyawanNik: emp.id === editingUser.karyawanId ? editingUser.karyawanNik : emp.nik,
            karyawanNama: emp.id === editingUser.karyawanId ? editingUser.karyawanNama : emp.nama,
          }),
        });
        const result = await response.json();
        if (!response.ok) {
          setErrorMsg(result.error || "Perubahan akun tidak dapat disimpan.");
          return;
        }
        updateUser(editingUser.id, result.account as Partial<UserAccount>);
      } else {
        const response = await fetch("/api/auth/invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim(),
            role,
            karyawanId: emp.id,
            karyawanNik: emp.nik,
            karyawanNama: emp.nama,
            avatar: emp.avatar || null,
          }),
        });
        const result = await response.json();
        if (!response.ok) {
          setErrorMsg(result.error || "Undangan tidak dapat dikirim.");
          return;
        }
        addUser(result.account as UserAccount);
      }
      setIsModalOpen(false);
    } catch {
      setErrorMsg("Koneksi terputus. Periksa jaringan lalu coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            Manajemen Akun Pengguna Sistem
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kelola hak akses pengguna, username otentikasi login, peran (Role
            HRD, Manager, Karyawan), dan pemetaan ke data karyawan.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm hover:shadow transition"
        >
          <Plus className="w-4 h-4" />
          Tambah Pengguna
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Daftar Akun Pengguna ({userList.length} Akun)
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Tersinkronisasi dengan Role Auth
          </span>
        </div>

        {/* Table: username, email, role(hrd, manager, karyawan), pemilik (berisi nama karyawan dan nik karyawan), action (edit dan hapus) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-14 text-center">Nomor</th>
                <th className="py-3 px-4 min-w-[160px]">Username</th>
                <th className="py-3 px-4 min-w-[200px]">Email</th>
                <th className="py-3 px-4 w-32 text-center">Role Akses</th>
                <th className="py-3 px-4 min-w-[240px]">
                  Pemilik (Nama & NIK Karyawan)
                </th>
                <th className="py-3 px-4 w-28 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {userList.map((usr, idx) => {
                let roleBadge = "bg-slate-100 text-slate-700 border-slate-200";
                if (usr.role === "hrd") {
                  roleBadge =
                    "bg-purple-50 text-purple-700 border-purple-200 font-bold";
                } else if (usr.role === "manager") {
                  roleBadge =
                    "bg-indigo-50 text-indigo-700 border-indigo-200 font-bold";
                } else if (usr.role === "karyawan") {
                  roleBadge =
                    "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold";
                }

                return (
                  <tr
                    key={usr.id}
                    className="hover:bg-slate-50/80 transition group"
                  >
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Key className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono font-bold text-slate-900">
                          {usr.username}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {usr.email}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] border uppercase ${roleBadge}`}
                      >
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        {usr.karyawanNama}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        NIK: {usr.karyawanNik}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(usr)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="Edit Akun"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(usr.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Hapus Akun"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit Pengguna */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingUser ? "Edit Akun Pengguna" : "Tambah Akun Pengguna"}
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
                  Karyawan Pemilik Akun <span className="text-rose-500">*</span>
                </label>
                <select
                  value={karyawanId}
                  onChange={(e) => handleKaryawanSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  {karyawanList.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama} ({k.nik}) - {k.divisiNama}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500">
                  Jika pemilik tetap sama, nama dan NIK profil akun dipertahankan. Mengganti pemilik akan mengikuti data karyawan yang dipilih.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username (Untuk Login) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: ahmad.fauzi"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Akun <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="email@kinerja.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={Boolean(editingUser)}
                  aria-describedby={editingUser ? "account-email-help" : undefined}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 read-only:cursor-not-allowed read-only:bg-slate-100 read-only:text-slate-500"
                  required
                />
                {editingUser && (
                  <p id="account-email-help" className="mt-1 text-[11px] text-slate-500">
                    Email login tidak dapat diubah dari form edit ini.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role Akses Sistem <span className="text-rose-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  required
                >
                  <option value="karyawan">Karyawan (Melihat hasil kinerja pribadi)</option>
                  <option value="manager">Manager (Input & evaluasi nilai subordinat)</option>
                  <option value="hrd">HRD / Admin (Akses penuh master & laporan)</option>
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
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Check className="w-4 h-4" />
                  {isSubmitting
                    ? editingUser ? "Menyimpan perubahan…" : "Mengirim undangan…"
                    : editingUser ? "Simpan Perubahan" : "Kirim Undangan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Hapus Akun */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-2">
              Hapus Akun Pengguna?
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Akun ini tidak akan bisa login lagi ke sistem.
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
                  deleteUser(deleteId);
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
