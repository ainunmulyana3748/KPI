"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Divisi,
  Jabatan,
  Karyawan,
  IndikatorKpi,
  PeriodePenilaian,
  PenilaianKinerja,
  UserAccount,
  KategoriNilai,
  getKategoriByScore,
} from "@/types/kpi";
import { createClient } from "@/lib/supabase/client";
import {
  INITIAL_DIVISI,
  INITIAL_JABATAN,
  INITIAL_KARYAWAN,
  INITIAL_INDIKATOR,
  INITIAL_PERIODE,
  INITIAL_USERS,
  INITIAL_PENILAIAN,
} from "@/lib/initial-data";

interface QuarterStats {
  periodeNama: string;
  quartalLabel: string;
  totalEvaluasi: number;
  avgScore: number;
  highest: { score: number; karyawanNama: string; divisiNama: string } | null;
  lowest: { score: number; karyawanNama: string; divisiNama: string } | null;
  distribusi: {
    sangatBaik: number;
    baik: number;
    cukup: number;
    kurang: number;
    sangatKurang: number;
  };
}

interface AppContextType {
  // Current session
  currentUser: UserAccount;
  authStatus: "loading" | "signed-in" | "signed-out" | "unlinked";
  signOut: () => Promise<void>;

  // Navigation & Page loading
  activeTab: string;
  setActiveTabWithTransition: (newTab: string) => void;
  isLoadingPage: boolean;
  selectedKaryawanDetailId: string | null;
  setSelectedKaryawanDetailId: (id: string | null) => void;
  selectedPenilaianDetailId: string | null;
  setSelectedPenilaianDetailId: (id: string | null) => void;
  selectedNilaiInputTarget: { karyawanId: string; periodeId: string } | null;
  setSelectedNilaiInputTarget: (
    target: { karyawanId: string; periodeId: string } | null
  ) => void;

  // Indicator weight reminder modal
  showIndicatorReminderModal: boolean;
  pendingTabTarget: string | null;
  confirmNavigateAwayFromIndicators: () => void;
  cancelNavigateAwayFromIndicators: () => void;

  // Data states
  divisiList: Divisi[];
  jabatanList: Jabatan[];
  karyawanList: Karyawan[];
  indikatorList: IndikatorKpi[];
  periodeList: PeriodePenilaian[];
  userList: UserAccount[];
  penilaianList: PenilaianKinerja[];

  // Computed
  totalBobotIndikator: number;
  isBobot100: boolean;
  activePeriode: PeriodePenilaian | undefined;
  previousCompletedPeriode: PeriodePenilaian | undefined;
  getQuarterStats: (periodeId?: string) => QuarterStats;

  // CRUD Divisi
  addDivisi: (data: Omit<Divisi, "id">) => void;
  updateDivisi: (id: string, data: Partial<Divisi>) => void;
  deleteDivisi: (id: string) => void;

  // CRUD Jabatan
  addJabatan: (data: Omit<Jabatan, "id">) => void;
  updateJabatan: (id: string, data: Partial<Jabatan>) => void;
  deleteJabatan: (id: string) => void;

  // CRUD Karyawan
  addKaryawan: (data: Omit<Karyawan, "id">) => void;
  updateKaryawan: (id: string, data: Partial<Karyawan>) => void;
  deleteKaryawan: (id: string) => void;

  // CRUD Indikator
  addIndikator: (data: Omit<IndikatorKpi, "id">) => { success: boolean; message?: string };
  updateIndikator: (id: string, data: Partial<IndikatorKpi>) => { success: boolean; message?: string };
  deleteIndikator: (id: string) => void;

  // CRUD Periode
  addPeriode: (data: Omit<PeriodePenilaian, "id">) => { success: boolean; message?: string };
  updatePeriode: (id: string, data: Partial<PeriodePenilaian>) => void;
  deletePeriode: (id: string) => void;

  // CRUD Akun Pengguna
  addUser: (data: Omit<UserAccount, "id"> & { id?: string }) => void;
  updateUser: (id: string, data: Partial<UserAccount>) => void;
  deleteUser: (id: string) => void;

  // Penilaian Operations
  savePenilaian: (penilaian: PenilaianKinerja) => void;
  getPenilaianByKaryawan: (karyawanId: string) => PenilaianKinerja[];
  getPenilaianForManager: (managerKaryawanId: string, periodeId: string) => {
    karyawan: Karyawan;
    penilaian: PenilaianKinerja | null;
    status: "Sudah Dinilai" | "Belum Dinilai";
    nilaiAkhir: number | null;
  }[];

}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [authStatus, setAuthStatus] = useState<AppContextType["authStatus"]>("loading");

  // States
  const [currentUser, setCurrentUser] = useState<UserAccount>(INITIAL_USERS[0]);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [selectedKaryawanDetailId, setSelectedKaryawanDetailId] = useState<string | null>(null);
  const [selectedPenilaianDetailId, setSelectedPenilaianDetailId] = useState<string | null>(null);
  const [selectedNilaiInputTarget, setSelectedNilaiInputTarget] = useState<{
    karyawanId: string;
    periodeId: string;
  } | null>(null);

  // Reminder modal state
  const [showIndicatorReminderModal, setShowIndicatorReminderModal] = useState(false);
  const [pendingTabTarget, setPendingTabTarget] = useState<string | null>(null);

  // Core Data
  const [divisiList, setDivisiList] = useState<Divisi[]>(INITIAL_DIVISI);
  const [jabatanList, setJabatanList] = useState<Jabatan[]>(INITIAL_JABATAN);
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>(INITIAL_KARYAWAN);
  const [indikatorList, setIndikatorList] = useState<IndikatorKpi[]>(INITIAL_INDIKATOR);
  const [periodeList, setPeriodeList] = useState<PeriodePenilaian[]>(INITIAL_PERIODE);
  const [userList, setUserList] = useState<UserAccount[]>(INITIAL_USERS);
  const [penilaianList, setPenilaianList] = useState<PenilaianKinerja[]>(INITIAL_PENILAIAN);

  // LocalStorage loading & persistence
  useEffect(() => {
    setIsClient(true);
    try {
      const savedDivisi = localStorage.getItem("kpi_divisi");
      if (savedDivisi) setDivisiList(JSON.parse(savedDivisi));

      const savedJabatan = localStorage.getItem("kpi_jabatan");
      if (savedJabatan) setJabatanList(JSON.parse(savedJabatan));

      const savedKaryawan = localStorage.getItem("kpi_karyawan");
      if (savedKaryawan) setKaryawanList(JSON.parse(savedKaryawan));

      const savedIndikator = localStorage.getItem("kpi_indikator");
      if (savedIndikator) setIndikatorList(JSON.parse(savedIndikator));

      const savedPeriode = localStorage.getItem("kpi_periode");
      if (savedPeriode) setPeriodeList(JSON.parse(savedPeriode));

      const savedUsers = localStorage.getItem("kpi_users");
      if (savedUsers) setUserList(JSON.parse(savedUsers));

      const savedPenilaian = localStorage.getItem("kpi_penilaian");
      if (savedPenilaian) setPenilaianList(JSON.parse(savedPenilaian));

    } catch {
      // Fallback
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem("kpi_divisi", JSON.stringify(divisiList));
      localStorage.setItem("kpi_jabatan", JSON.stringify(jabatanList));
      localStorage.setItem("kpi_karyawan", JSON.stringify(karyawanList));
      localStorage.setItem("kpi_indikator", JSON.stringify(indikatorList));
      localStorage.setItem("kpi_periode", JSON.stringify(periodeList));
      localStorage.setItem("kpi_users", JSON.stringify(userList));
      localStorage.setItem("kpi_penilaian", JSON.stringify(penilaianList));
    } catch {
      // LocalStorage error ignore
    }
  }, [
    isClient,
    divisiList,
    jabatanList,
    karyawanList,
    indikatorList,
    periodeList,
    userList,
    penilaianList,
  ]);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const loadAccount = async (authUser: { id: string; email?: string }) => {
      const { data, error } = await supabase
        .from("user_accounts")
        .select("id, username, email, role, karyawan_id, karyawan_nik, karyawan_nama, avatar")
        .eq("id", authUser.id)
        .maybeSingle();

      if (!active) return;
      if (error || !data || !["hrd", "manager", "karyawan"].includes(data.role)) {
        setAuthStatus("unlinked");
        return;
      }

      const account: UserAccount = {
        id: data.id,
        username: data.username,
        email: data.email || authUser.email || "",
        role: data.role as UserAccount["role"],
        karyawanId: data.karyawan_id,
        karyawanNik: data.karyawan_nik,
        karyawanNama: data.karyawan_nama,
        avatar: data.avatar || undefined,
      };

      setCurrentUser(account);
      setActiveTab(
        account.role === "hrd"
          ? "dashboard"
          : account.role === "manager"
            ? "manager-dashboard"
            : "karyawan-dashboard",
      );
      setAuthStatus("signed-in");

      if (account.role === "hrd") {
        const { data: accounts } = await supabase
          .from("user_accounts")
          .select("id, username, email, role, karyawan_id, karyawan_nik, karyawan_nama, avatar");
        if (active && accounts) {
          setUserList(accounts.map((row) => ({
            id: row.id,
            username: row.username,
            email: row.email,
            role: row.role as UserAccount["role"],
            karyawanId: row.karyawan_id,
            karyawanNik: row.karyawan_nik,
            karyawanNama: row.karyawan_nama,
            avatar: row.avatar || undefined,
          })));
        }
      } else {
        setUserList([account]);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setAuthStatus("signed-out");
        setUserList(INITIAL_USERS);
        return;
      }
      setAuthStatus("loading");
      window.setTimeout(() => void loadAccount(session.user), 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await createClient().auth.signOut();
    setAuthStatus("signed-out");
    setCurrentUser(INITIAL_USERS[0]);
    setUserList(INITIAL_USERS);
    setActiveTab("dashboard");
  };

  // Total Indicator Weight
  const totalBobotIndikator = indikatorList.reduce((acc, curr) => acc + (Number(curr.bobot) || 0), 0);
  const isBobot100 = totalBobotIndikator === 100;

  // Active & Completed Period
  const activePeriode = periodeList.find((p) => p.status === "Aktif");
  const previousCompletedPeriode =
    periodeList.find((p) => p.status === "Complete" && p.quartal === "Q1") ||
    periodeList.find((p) => p.status === "Complete") ||
    periodeList[0];

  // Navigation with loading transition & weight check
  const setActiveTabWithTransition = (newTab: string) => {
    if (activeTab === newTab) return;

    // Check if moving away from indikator and bobot != 100
    if (activeTab === "indikator" && newTab !== "indikator" && !isBobot100) {
      setPendingTabTarget(newTab);
      setShowIndicatorReminderModal(true);
      return;
    }

    setIsLoadingPage(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setIsLoadingPage(false);
    }, 280); // Smooth Indonesian page transition
  };

  const confirmNavigateAwayFromIndicators = () => {
    setShowIndicatorReminderModal(false);
    if (pendingTabTarget) {
      setIsLoadingPage(true);
      setTimeout(() => {
        setActiveTab(pendingTabTarget);
        setPendingTabTarget(null);
        setIsLoadingPage(false);
      }, 280);
    }
  };

  const cancelNavigateAwayFromIndicators = () => {
    setShowIndicatorReminderModal(false);
    setPendingTabTarget(null);
  };

  // Quarter evaluation stats for Dashboard
  const getQuarterStats = (periodeId?: string): QuarterStats => {
    const targetPeriod =
      (periodeId ? periodeList.find((p) => p.id === periodeId) : null) ||
      previousCompletedPeriode ||
      periodeList[0];

    const evals = penilaianList.filter(
      (p) => p.periodeId === targetPeriod.id && p.status === "Sudah Dinilai"
    );

    if (evals.length === 0) {
      return {
        periodeNama: targetPeriod.namaPeriode,
        quartalLabel: targetPeriod.quartalLabel,
        totalEvaluasi: 0,
        avgScore: 0,
        highest: null,
        lowest: null,
        distribusi: { sangatBaik: 0, baik: 0, cukup: 0, kurang: 0, sangatKurang: 0 },
      };
    }

    const totalScore = evals.reduce((sum, e) => sum + e.nilaiAkhir, 0);
    const avgScore = Math.round((totalScore / evals.length) * 10) / 10;

    const sorted = [...evals].sort((a, b) => b.nilaiAkhir - a.nilaiAkhir);
    const highestEval = sorted[0];
    const lowestEval = sorted[sorted.length - 1];

    const distribusi = {
      sangatBaik: evals.filter((e) => e.kategori === "Sangat Baik").length,
      baik: evals.filter((e) => e.kategori === "Baik").length,
      cukup: evals.filter((e) => e.kategori === "Cukup").length,
      kurang: evals.filter((e) => e.kategori === "Kurang").length,
      sangatKurang: evals.filter((e) => e.kategori === "Sangat Kurang").length,
    };

    return {
      periodeNama: targetPeriod.namaPeriode,
      quartalLabel: targetPeriod.quartalLabel,
      totalEvaluasi: evals.length,
      avgScore,
      highest: highestEval
        ? {
            score: highestEval.nilaiAkhir,
            karyawanNama: highestEval.karyawanNama,
            divisiNama: highestEval.divisiNama,
          }
        : null,
      lowest: lowestEval
        ? {
            score: lowestEval.nilaiAkhir,
            karyawanNama: lowestEval.karyawanNama,
            divisiNama: lowestEval.divisiNama,
          }
        : null,
      distribusi,
    };
  };

  // Divisi CRUD
  const addDivisi = (data: Omit<Divisi, "id">) => {
    const newDiv: Divisi = {
      ...data,
      id: `div-${Date.now()}`,
      created_at: new Date().toISOString().split("T")[0],
    };
    setDivisiList((prev) => [newDiv, ...prev]);
  };

  const updateDivisi = (id: string, data: Partial<Divisi>) => {
    setDivisiList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...data } : d))
    );
    // Also update related jabatan & karyawan if name changed
    if (data.nama) {
      setJabatanList((prev) =>
        prev.map((j) => (j.divisiId === id ? { ...j, divisiNama: data.nama! } : j))
      );
      setKaryawanList((prev) =>
        prev.map((k) => (k.divisiId === id ? { ...k, divisiNama: data.nama! } : k))
      );
    }
  };

  const deleteDivisi = (id: string) => {
    setDivisiList((prev) => prev.filter((d) => d.id !== id));
  };

  // Jabatan CRUD
  const addJabatan = (data: Omit<Jabatan, "id">) => {
    const div = divisiList.find((d) => d.id === data.divisiId);
    const newJab: Jabatan = {
      ...data,
      id: `jab-${Date.now()}`,
      divisiNama: div ? div.nama : data.divisiNama || "",
      created_at: new Date().toISOString().split("T")[0],
    };
    setJabatanList((prev) => [newJab, ...prev]);
  };

  const updateJabatan = (id: string, data: Partial<Jabatan>) => {
    setJabatanList((prev) =>
      prev.map((j) => {
        if (j.id === id) {
          const div = data.divisiId
            ? divisiList.find((d) => d.id === data.divisiId)
            : null;
          return {
            ...j,
            ...data,
            divisiNama: div ? div.nama : j.divisiNama,
          };
        }
        return j;
      })
    );
    if (data.nama) {
      setKaryawanList((prev) =>
        prev.map((k) => (k.jabatanId === id ? { ...k, jabatanNama: data.nama! } : k))
      );
    }
  };

  const deleteJabatan = (id: string) => {
    setJabatanList((prev) => prev.filter((j) => j.id !== id));
  };

  // Karyawan CRUD
  const addKaryawan = (data: Omit<Karyawan, "id">) => {
    const div = divisiList.find((d) => d.id === data.divisiId);
    const jab = jabatanList.find((j) => j.id === data.jabatanId);
    const newKaryawan: Karyawan = {
      ...data,
      id: `emp-${Date.now()}`,
      divisiNama: div ? div.nama : data.divisiNama,
      jabatanNama: jab ? jab.nama : data.jabatanNama,
      avatar:
        data.avatar ||
        `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
    };
    setKaryawanList((prev) => [newKaryawan, ...prev]);
  };

  const updateKaryawan = (id: string, data: Partial<Karyawan>) => {
    setKaryawanList((prev) =>
      prev.map((k) => {
        if (k.id === id) {
          const div = data.divisiId ? divisiList.find((d) => d.id === data.divisiId) : null;
          const jab = data.jabatanId ? jabatanList.find((j) => j.id === data.jabatanId) : null;
          return {
            ...k,
            ...data,
            divisiNama: div ? div.nama : k.divisiNama,
            jabatanNama: jab ? jab.nama : k.jabatanNama,
          };
        }
        return k;
      })
    );
  };

  const deleteKaryawan = (id: string) => {
    setKaryawanList((prev) => prev.filter((k) => k.id !== id));
    setUserList((prev) => prev.filter((u) => u.karyawanId !== id));
    setPenilaianList((prev) => prev.filter((p) => p.karyawanId !== id));
  };

  // Indikator KPI CRUD
  const addIndikator = (data: Omit<IndikatorKpi, "id">) => {
    const newBobot = Number(data.bobot) || 0;
    if (totalBobotIndikator + newBobot > 100) {
      return {
        success: false,
        message: `Total bobot tidak boleh melebihi 100%. Sisa kuota bobot: ${100 - totalBobotIndikator}%.`,
      };
    }
    const newIndikator: IndikatorKpi = {
      ...data,
      id: `ind-${Date.now()}`,
      bobot: newBobot,
    };
    setIndikatorList((prev) => [...prev, newIndikator]);
    return { success: true };
  };

  const updateIndikator = (id: string, data: Partial<IndikatorKpi>) => {
    const existing = indikatorList.find((i) => i.id === id);
    if (!existing) return { success: false, message: "Indikator tidak ditemukan" };

    if (data.bobot !== undefined) {
      const otherTotal = indikatorList
        .filter((i) => i.id !== id)
        .reduce((sum, i) => sum + (Number(i.bobot) || 0), 0);
      const newBobot = Number(data.bobot) || 0;
      if (otherTotal + newBobot > 100) {
        return {
          success: false,
          message: `Total bobot tidak boleh melebihi 100%. Maksimal untuk indikator ini: ${100 - otherTotal}%.`,
        };
      }
    }

    setIndikatorList((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...data, bobot: data.bobot !== undefined ? Number(data.bobot) : i.bobot } : i))
    );
    return { success: true };
  };

  const deleteIndikator = (id: string) => {
    setIndikatorList((prev) => prev.filter((i) => i.id !== id));
  };

  // Periode CRUD
  const addPeriode = (data: Omit<PeriodePenilaian, "id">) => {
    // Validate future dates requirement:
    const today = new Date().toISOString().split("T")[0];
    if (data.startDate < today) {
      return {
        success: false,
        message: "Tanggal mulai pengisian hanya bisa diisi dengan tanggal hari ini atau masa depan.",
      };
    }
    if (data.endDate <= data.startDate) {
      return {
        success: false,
        message: "Tanggal akhir pengisian harus lebih besar dari tanggal mulai pengisian.",
      };
    }

    // Determine status automatically
    let status: PeriodePenilaian["status"] = "Waiting";
    if (today >= data.startDate && today <= data.endDate) {
      status = "Aktif";
    } else if (today > data.endDate) {
      status = "Complete";
    }

    const newPeriode: PeriodePenilaian = {
      ...data,
      id: `per-${Date.now()}`,
      status: data.status || status,
    };

    setPeriodeList((prev) => [newPeriode, ...prev]);
    return { success: true };
  };

  const updatePeriode = (id: string, data: Partial<PeriodePenilaian>) => {
    const existing = periodeList.find((p) => p.id === id);
    if ("status" in data && currentUser.role !== "hrd") return;
    if (
      data.status && !["Waiting", "Aktif", "Complete"].includes(data.status)
    ) return;
    if (
      existing?.status === "Complete" &&
      Object.keys(data).some((key) => key !== "status")
    ) return;

    setPeriodeList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
  };

  const deletePeriode = (id: string) => {
    const existing = periodeList.find((p) => p.id === id);
    if (existing?.status === "Complete") {
      return; // Complete cannot be deleted
    }
    setPeriodeList((prev) => prev.filter((p) => p.id !== id));
  };

  // User Accounts CRUD
  const addUser = (data: Omit<UserAccount, "id"> & { id?: string }) => {
    const emp = karyawanList.find((k) => k.id === data.karyawanId);
    const newUser: UserAccount = {
      ...data,
      id: data.id || `usr-${Date.now()}`,
      karyawanNama: emp ? emp.nama : data.karyawanNama,
      karyawanNik: emp ? emp.nik : data.karyawanNik,
      avatar: emp?.avatar,
    };
    setUserList((prev) => [newUser, ...prev]);
  };

  const updateUser = (id: string, data: Partial<UserAccount>) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const emp = data.karyawanId ? karyawanList.find((k) => k.id === data.karyawanId) : null;
          return {
            ...u,
            ...data,
            karyawanNama: emp ? emp.nama : u.karyawanNama,
            karyawanNik: emp ? emp.nik : u.karyawanNik,
          };
        }
        return u;
      })
    );
  };

  const deleteUser = (id: string) => {
    setUserList((prev) => prev.filter((u) => u.id !== id));
  };

  // Penilaian Operations
  const savePenilaian = (penilaian: PenilaianKinerja) => {
    setPenilaianList((prev) => {
      const idx = prev.findIndex(
        (p) => p.karyawanId === penilaian.karyawanId && p.periodeId === penilaian.periodeId
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = penilaian;
        return copy;
      }
      return [penilaian, ...prev];
    });
  };

  const getPenilaianByKaryawan = (karyawanId: string) => {
    return penilaianList.filter((p) => p.karyawanId === karyawanId);
  };

  const getPenilaianForManager = (managerKaryawanId: string, periodeId: string) => {
    // Find manager's divisi
    const manager = karyawanList.find((k) => k.id === managerKaryawanId);
    if (!manager) return [];

    // Subordinates in the same divisi (excluding manager themself or including all divisi members)
    const subordinates = karyawanList.filter(
      (k) => k.divisiId === manager.divisiId && k.id !== managerKaryawanId
    );

    return subordinates.map((emp) => {
      const p = penilaianList.find(
        (evalItem) => evalItem.karyawanId === emp.id && evalItem.periodeId === periodeId
      );
      return {
        karyawan: emp,
        penilaian: p || null,
        status: p && p.status === "Sudah Dinilai" ? ("Sudah Dinilai" as const) : ("Belum Dinilai" as const),
        nilaiAkhir: p ? p.nilaiAkhir : null,
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        authStatus,
        signOut,
        activeTab,
        setActiveTabWithTransition,
        isLoadingPage,
        selectedKaryawanDetailId,
        setSelectedKaryawanDetailId,
        selectedPenilaianDetailId,
        setSelectedPenilaianDetailId,
        selectedNilaiInputTarget,
        setSelectedNilaiInputTarget,
        showIndicatorReminderModal,
        pendingTabTarget,
        confirmNavigateAwayFromIndicators,
        cancelNavigateAwayFromIndicators,
        divisiList,
        jabatanList,
        karyawanList,
        indikatorList,
        periodeList,
        userList,
        penilaianList,
        totalBobotIndikator,
        isBobot100,
        activePeriode,
        previousCompletedPeriode,
        getQuarterStats,
        addDivisi,
        updateDivisi,
        deleteDivisi,
        addJabatan,
        updateJabatan,
        deleteJabatan,
        addKaryawan,
        updateKaryawan,
        deleteKaryawan,
        addIndikator,
        updateIndikator,
        deleteIndikator,
        addPeriode,
        updatePeriode,
        deletePeriode,
        addUser,
        updateUser,
        deleteUser,
        savePenilaian,
        getPenilaianByKaryawan,
        getPenilaianForManager,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
