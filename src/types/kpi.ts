export type Role = "hrd" | "manager" | "karyawan";

export type KategoriNilai =
  | "Sangat Baik"
  | "Baik"
  | "Cukup"
  | "Kurang"
  | "Sangat Kurang";

export type PeriodeStatus = "Waiting" | "Aktif" | "Complete";

export type QuartalType = "Q1" | "Q2" | "Q3" | "Q4";

export interface Divisi {
  id: string;
  nama: string;
  deskripsi: string;
  created_at?: string;
}

export interface Jabatan {
  id: string;
  nama: string;
  divisiId: string;
  divisiNama: string;
  deskripsi: string;
  created_at?: string;
}

export interface Karyawan {
  id: string;
  nik: string;
  nama: string;
  divisiId: string;
  divisiNama: string;
  jabatanId: string;
  jabatanNama: string;
  email: string;
  phone: string;
  alamat: string;
  tanggalBergabung: string;
  status: "Aktif" | "Non Aktif";
  role: Role;
  avatar?: string;
}

export interface IndikatorKpi {
  id: string;
  nama: string;
  tipe: "KPI Umum" | "KPI Pilar";
  bobot: number; // in percentage e.g. 20
  targetKinerja: string;
  status: "Aktif" | "Non Aktif";
}

export interface PeriodePenilaian {
  id: string;
  namaPeriode: string;
  quartal: QuartalType;
  quartalLabel: string; // e.g. "Januari - Maret 2026"
  tahun: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: PeriodeStatus;
}

export interface PenilaianItem {
  indikatorId: string;
  indikatorNama: string;
  tipe: "KPI Umum" | "KPI Pilar";
  bobot: number;
  score: number; // 1 to 5
  scoreLabel: string; // "Sangat Baik(5)", etc.
  calculatedScore: number; // (score / 5) * bobot
}

export interface PenilaianKinerja {
  id: string;
  karyawanId: string;
  karyawanNama: string;
  karyawanNik: string;
  divisiNama: string;
  jabatanNama: string;
  periodeId: string;
  periodeNama: string;
  penilaiId: string;
  penilaiNama: string;
  tanggalPenilaian: string;
  items: PenilaianItem[];
  nilaiKpiUmum: number; // e.g. 84.5
  nilaiKpiPilar: number; // e.g. 88.0
  nilaiAkhir: number; // e.g. 86.8
  kategori: KategoriNilai;
  ringkasanPenilaian: string;
  komentarAtasan: string;
  status: "Belum Dinilai" | "Sudah Dinilai";
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  role: Role;
  karyawanId: string;
  karyawanNik: string;
  karyawanNama: string;
  avatar?: string;
}

// Helpers
export function getKategoriByScore(score: number): KategoriNilai {
  if (score >= 85) return "Sangat Baik";
  if (score >= 75) return "Baik";
  if (score >= 65) return "Cukup";
  if (score >= 50) return "Kurang";
  return "Sangat Kurang";
}

export function getScoreCategoryBadgeClass(kategori: KategoriNilai): string {
  switch (kategori) {
    case "Sangat Baik":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20";
    case "Baik":
      return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20";
    case "Cukup":
      return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20";
    case "Kurang":
      return "bg-orange-50 text-orange-700 border-orange-200 ring-orange-600/20";
    case "Sangat Kurang":
      return "bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}
