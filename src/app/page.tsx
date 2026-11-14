"use client";

import React, { Suspense } from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { LoadingBar } from "@/components/ui/LoadingBar";
import { IndicatorWeightReminderDialog } from "@/components/common/IndicatorWeightReminderDialog";

// HRD Views
import { DashboardHrd } from "@/components/views/hrd/DashboardHrd";
import { DivisiPage } from "@/components/views/hrd/DivisiPage";
import { JabatanPage } from "@/components/views/hrd/JabatanPage";
import { KaryawanPage } from "@/components/views/hrd/KaryawanPage";
import { KaryawanDetailPage } from "@/components/views/hrd/KaryawanDetailPage";
import { IndikatorKpiPage } from "@/components/views/hrd/IndikatorKpiPage";
import { PeriodePenilaianPage } from "@/components/views/hrd/PeriodePenilaianPage";
import { AkunPenggunaPage } from "@/components/views/hrd/AkunPenggunaPage";
import { LaporanKinerjaPage } from "@/components/views/hrd/LaporanKinerjaPage";

// Manager Views
import { DashboardManager } from "@/components/views/manager/DashboardManager";
import { InputPenilaianPage } from "@/components/views/manager/InputPenilaianPage";
import { FormNilaiKaryawan } from "@/components/views/manager/FormNilaiKaryawan";

// Karyawan Views
import { DashboardKaryawan } from "@/components/views/karyawan/DashboardKaryawan";

function MainDashboardContent() {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      // HRD & Admin Views
      case "dashboard":
        return <DashboardHrd />;
      case "divisi":
        return <DivisiPage />;
      case "jabatan":
        return <JabatanPage />;
      case "karyawan":
        return <KaryawanPage />;
      case "karyawan-detail":
        return <KaryawanDetailPage />;
      case "indikator":
        return <IndikatorKpiPage />;
      case "periode":
        return <PeriodePenilaianPage />;
      case "pengguna":
        return <AkunPenggunaPage />;
      case "laporan":
        return <LaporanKinerjaPage />;

      // Manager Views
      case "manager-dashboard":
        return <DashboardManager />;
      case "manager-penilaian":
        return <InputPenilaianPage />;
      case "manager-form-nilai":
        return <FormNilaiKaryawan />;

      // Karyawan Views
      case "karyawan-dashboard":
        return <DashboardKaryawan />;

      default:
        return <DashboardHrd />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Loading feedback on page transitions */}
      <LoadingBar />

      {/* Reminder dialog when indicator weight is not 100% and user navigates away */}
      <IndicatorWeightReminderDialog />

      {/* Top Navbar with Role Switcher */}
      <Navbar />

      {/* Body: Sidebar + Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
          {renderActiveView()}
        </main>
      </div>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 Sistem Evaluasi & Manajemen KPI
            Terintegrasi. Hak Cipta Dilindungi.
          </span>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Next.js & Tailwind CSS</span>
            <span>•</span>
            <span>Siap Sinkronisasi Supabase</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm font-semibold text-slate-500">Memuat Aplikasi KPI...</div>}>
        <MainDashboardContent />
      </Suspense>
    </AppProvider>
  );
}
