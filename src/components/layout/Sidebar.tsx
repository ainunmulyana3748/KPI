"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  Target,
  CalendarClock,
  ShieldCheck,
  BarChart3,
  ClipboardCheck,
  UserCheck,
  Layers,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export function Sidebar() {
  const {
    activeTab,
    setActiveTabWithTransition,
    currentUser,
    totalBobotIndikator,
    isBobot100,
  } = useApp();

  const hrdNavItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Ringkasan metrik & evaluasi",
    },
    {
      id: "divisi",
      label: "Divisi",
      icon: Building2,
      description: "Manajemen 5 divisi kerja",
    },
    {
      id: "jabatan",
      label: "Jabatan",
      icon: Briefcase,
      description: "Kelola jabatan per divisi",
    },
    {
      id: "karyawan",
      label: "Karyawan",
      icon: Users,
      description: "Data 15 karyawan & detail",
    },
    {
      id: "indikator",
      label: "Indikator KPI",
      icon: Target,
      description: "Setting indikator & bobot",
      badge: isBobot100 ? "100%" : `${totalBobotIndikator}%`,
      badgeWarn: !isBobot100,
    },
    {
      id: "periode",
      label: "Periode Penilaian",
      icon: CalendarClock,
      description: "Quartal 1 - 4 & timeline",
    },
    {
      id: "pengguna",
      label: "Akun Pengguna",
      icon: ShieldCheck,
      description: "Hak akses role & user",
    },
    {
      id: "laporan",
      label: "Laporan Kinerja",
      icon: BarChart3,
      description: "Peringkat & filter kinerja",
    },
  ];

  const managerNavItems = [
    {
      id: "manager-dashboard",
      label: "Dashboard Manager",
      icon: LayoutDashboard,
      description: "Progres penilaian divisi",
    },
    {
      id: "manager-penilaian",
      label: "Input Penilaian",
      icon: ClipboardCheck,
      description: "Beri nilai indikator karyawan",
    },
  ];

  const karyawanNavItems = [
    {
      id: "karyawan-dashboard",
      label: "Dashboard Kinerja",
      icon: UserCheck,
      description: "Hasil penilaian tiap quartal",
    },
  ];

  let currentItems = hrdNavItems;
  if (currentUser.role === "manager") currentItems = managerNavItems;
  if (currentUser.role === "karyawan") currentItems = karyawanNavItems;

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200/90 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Role Banner / Context */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          <span>Navigasi {currentUser.role.toUpperCase()}</span>
        </div>
        <p className="text-xs text-slate-600 font-medium truncate">
          {currentUser.karyawanNama}
        </p>
      </div>

      {/* Navigation List */}
      <nav className="p-3 space-y-1.5 flex-1">
        {currentItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === "karyawan" && activeTab === "karyawan-detail") ||
            (item.id === "manager-penilaian" &&
              activeTab === "manager-form-nilai");

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTabWithTransition(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-medium transition group ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/25 font-semibold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-indigo-600"
                  }`}
                />
                <div className="truncate">
                  <span className="block leading-tight">{item.label}</span>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-md font-bold uppercase transition flex items-center gap-1 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : item.badgeWarn
                      ? "bg-amber-100 text-amber-700 border border-amber-300"
                      : "bg-emerald-100 text-emerald-700 border border-emerald-300"
                  }`}
                >
                  {item.badgeWarn ? (
                    <AlertCircle className="w-2.5 h-2.5" />
                  ) : (
                    <CheckCircle2 className="w-2.5 h-2.5" />
                  )}
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info in Sidebar */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30">
        <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-[11px] text-slate-500 shadow-2xs">
          <p className="font-semibold text-slate-700 mb-0.5">
            Format Skala Nilai:
          </p>
          <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 mt-1">
            <span>5 : Sangat Baik</span>
            <span>4 : Baik</span>
            <span>3 : Cukup</span>
            <span>2 : Kurang</span>
            <span className="col-span-2">1 : Sangat Kurang</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
