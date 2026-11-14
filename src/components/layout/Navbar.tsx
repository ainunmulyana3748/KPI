"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  ShieldAlert,
  UserCheck,
  Briefcase,
  RotateCcw,
  ChevronDown,
  Building2,
  Check,
} from "lucide-react";
import { Role } from "@/types/kpi";

export function Navbar() {
  const {
    currentUser,
    switchRole,
    resetAllDataToDefault,
    userList,
    karyawanList,
    setCurrentUser,
    setActiveTabWithTransition,
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case "hrd":
        return {
          label: "HRD / Admin",
          class: "bg-purple-100 text-purple-700 border-purple-200",
        };
      case "manager":
        return {
          label: "Manager Penilai",
          class: "bg-indigo-100 text-indigo-700 border-indigo-200",
        };
      case "karyawan":
        return {
          label: "Karyawan",
          class: "bg-emerald-100 text-emerald-700 border-emerald-200",
        };
    }
  };

  const badgeInfo = getRoleBadge(currentUser.role);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-500/20">
            KPI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Sistem Penilaian Kinerja
              </h1>
              <span className="hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                v1.0 Ready for Supabase
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Evaluasi Quartal Karyawan & Key Performance Indicators
            </p>
          </div>
        </div>

        {/* Right: Role Switcher & User Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Role Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-xs font-medium text-slate-700 transition"
              title="Ganti Peran / Pengguna Simulasi"
            >
              <span className="text-slate-400 hidden md:inline">Peran:</span>
              <span
                className={`px-2 py-0.5 rounded-md font-semibold text-[11px] border ${badgeInfo.class}`}
              >
                {badgeInfo.label}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Dropdown Menu */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-semibold text-slate-800">
                    Pilih Peran & Pengguna
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Uji coba navigasi dari berbagai sudut pandang pengguna
                  </p>
                </div>

                <div className="space-y-1">
                  {/* Option 1: HRD */}
                  <button
                    type="button"
                    onClick={() => {
                      switchRole("hrd");
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                      currentUser.role === "hrd"
                        ? "bg-purple-50 text-purple-900 font-semibold"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold">HRD / Administrator</p>
                        <p className="text-[10px] text-slate-500">
                          Siti Rahmawati (Semua Menu Master & Laporan)
                        </p>
                      </div>
                    </div>
                    {currentUser.role === "hrd" && (
                      <Check className="w-4 h-4 text-purple-600" />
                    )}
                  </button>

                  {/* Option 2: Manager */}
                  <div className="pt-1 pb-1">
                    <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Manager Penilai:
                    </p>
                  </div>

                  {userList
                    .filter((u) => u.role === "manager")
                    .map((mUser) => {
                      const emp = karyawanList.find(
                        (k) => k.id === mUser.karyawanId
                      );
                      const isSelected = currentUser.id === mUser.id;
                      return (
                        <button
                          key={mUser.id}
                          type="button"
                          onClick={() => {
                            setCurrentUser(mUser);
                            setActiveTabWithTransition("manager-dashboard");
                            setShowRoleDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                            isSelected
                              ? "bg-indigo-50 text-indigo-900 font-semibold"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                              <Briefcase className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-semibold">{mUser.karyawanNama}</p>
                              <p className="text-[10px] text-slate-500">
                                {emp?.jabatanNama} ({emp?.divisiNama})
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-indigo-600" />
                          )}
                        </button>
                      );
                    })}

                  {/* Option 3: Karyawan */}
                  <div className="pt-1 pb-1">
                    <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Karyawan Ternilai:
                    </p>
                  </div>

                  {userList
                    .filter((u) => u.role === "karyawan")
                    .map((kUser) => {
                      const emp = karyawanList.find(
                        (k) => k.id === kUser.karyawanId
                      );
                      const isSelected = currentUser.id === kUser.id;
                      return (
                        <button
                          key={kUser.id}
                          type="button"
                          onClick={() => {
                            setCurrentUser(kUser);
                            setActiveTabWithTransition("karyawan-dashboard");
                            setShowRoleDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                            isSelected
                              ? "bg-emerald-50 text-emerald-900 font-semibold"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                              <UserCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-semibold">{kUser.karyawanNama}</p>
                              <p className="text-[10px] text-slate-500">
                                {emp?.jabatanNama} ({emp?.divisiNama})
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-emerald-600" />
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* User Info Avatar */}
          <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden ring-2 ring-indigo-500/20">
              {currentUser.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentUser.avatar}
                  alt={currentUser.karyawanNama}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-slate-600">
                  {currentUser.karyawanNama.slice(0, 1)}
                </div>
              )}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser.karyawanNama.split(",")[0]}
              </p>
              <p className="text-[10px] text-slate-500">{currentUser.email}</p>
            </div>
          </div>

          {/* Reset Dummy Data Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Reset ke Data Bawaan (15 Karyawan, 5 Divisi, Nilai Q1)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Reset confirmation modal */}
            {showResetConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-2">
                    Reset Semua Data Dummy?
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    Data divisi, jabatan, 15 karyawan, indikator KPI, periode,
                    dan riwayat penilaian akan dikembalikan ke kondisi awal.
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        resetAllDataToDefault();
                        setShowResetConfirm(false);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
                    >
                      Ya, Reset Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
