import {
  Divisi,
  Jabatan,
  Karyawan,
  IndikatorKpi,
  PeriodePenilaian,
  PenilaianKinerja,
  UserAccount,
  getKategoriByScore,
} from "@/types/kpi";

export const INITIAL_DIVISI: Divisi[] = [
  {
    id: "div-1",
    nama: "Teknologi Informasi",
    deskripsi:
      "Pengembangan sistem aplikasi, pengelolaan infrastruktur cloud, keamanan informasi, dan dukungan teknis perusahaan.",
    created_at: "2026-01-01",
  },
  {
    id: "div-2",
    nama: "Sumber Daya Manusia",
    deskripsi:
      "Pengelolaan manajemen talenta, rekrutmen, pelatihan, evaluasi kinerja, kompensasi, dan hubungan industrial karyawan.",
    created_at: "2026-01-01",
  },
  {
    id: "div-3",
    nama: "Keuangan & Akuntansi",
    deskripsi:
      "Pengelolaan arus kas, perencanaan anggaran operasional, perpajakan, audit keuangan, dan pelaporan berkala perusahaan.",
    created_at: "2026-01-01",
  },
  {
    id: "div-4",
    nama: "Pemasaran & Penjualan",
    deskripsi:
      "Penyusunan strategi promosi, pemasaran digital, penetrasi pasar baru, hubungan pelanggan, dan target pendapatan.",
    created_at: "2026-01-01",
  },
  {
    id: "div-5",
    nama: "Operasional & Logistik",
    deskripsi:
      "Manajemen rantai pasok (supply chain), pergudangan, distribusi logistik produk, dan pemeliharaan fasilitas perusahaan.",
    created_at: "2026-01-01",
  },
];

export const INITIAL_JABATAN: Jabatan[] = [
  // IT
  {
    id: "jab-1",
    nama: "IT Manager",
    divisiId: "div-1",
    divisiNama: "Teknologi Informasi",
    deskripsi: "Memimpin divisi teknologi informasi dan arsitektur sistem.",
  },
  {
    id: "jab-2",
    nama: "Senior Software Engineer",
    divisiId: "div-1",
    divisiNama: "Teknologi Informasi",
    deskripsi: "Mengembangkan fitur aplikasi backend dan frontend enterprise.",
  },
  {
    id: "jab-3",
    nama: "System Administrator",
    divisiId: "div-1",
    divisiNama: "Teknologi Informasi",
    deskripsi: "Mengelola server, jaringan, backup data, dan keamanan TI.",
  },

  // HRD
  {
    id: "jab-4",
    nama: "HR Manager",
    divisiId: "div-2",
    divisiNama: "Sumber Daya Manusia",
    deskripsi: "Memimpin strategi SDM, retensi talenta, dan kebijakan kerja.",
  },
  {
    id: "jab-5",
    nama: "Talent Acquisition Specialist",
    divisiId: "div-2",
    divisiNama: "Sumber Daya Manusia",
    deskripsi: "Menangani proses rekrutmen, employer branding, dan onboarding.",
  },
  {
    id: "jab-6",
    nama: "People Operations Officer",
    divisiId: "div-2",
    divisiNama: "Sumber Daya Manusia",
    deskripsi: "Mengelola administrasi karyawan, kehadiran, dan benefit.",
  },

  // Finance
  {
    id: "jab-7",
    nama: "Finance Manager",
    divisiId: "div-3",
    divisiNama: "Keuangan & Akuntansi",
    deskripsi: "Mengawasi kesehatan finansial, anggaran modal, dan pajak.",
  },
  {
    id: "jab-8",
    nama: "Senior Accountant",
    divisiId: "div-3",
    divisiNama: "Keuangan & Akuntansi",
    deskripsi: "Menyusun pembukuan, rekonsiliasi bank, dan laporan laba rugi.",
  },
  {
    id: "jab-9",
    nama: "Financial Analyst",
    divisiId: "div-3",
    divisiNama: "Keuangan & Akuntansi",
    deskripsi: "Menganalisis tren biaya, perkiraan pendapatan, dan efisiensi.",
  },

  // Marketing
  {
    id: "jab-10",
    nama: "Marketing Manager",
    divisiId: "div-4",
    divisiNama: "Pemasaran & Penjualan",
    deskripsi: "Menentukan arah strategi kampanye pemasaran dan penjualan.",
  },
  {
    id: "jab-11",
    nama: "Digital Marketing Specialist",
    divisiId: "div-4",
    divisiNama: "Pemasaran & Penjualan",
    deskripsi: "Mengoptimasi kanal iklan digital, SEO, SEM, dan media sosial.",
  },
  {
    id: "jab-12",
    nama: "Sales Executive",
    divisiId: "div-4",
    divisiNama: "Pemasaran & Penjualan",
    deskripsi: "Menjalin relasi B2B, negosiasi kontrak, dan closing penjualan.",
  },

  // Operations
  {
    id: "jab-13",
    nama: "Operations Manager",
    divisiId: "div-5",
    divisiNama: "Operasional & Logistik",
    deskripsi: "Mengkoordinasikan kelancaran distribusi logistik dan operasional harian.",
  },
  {
    id: "jab-14",
    nama: "Supply Chain Specialist",
    divisiId: "div-5",
    divisiNama: "Operasional & Logistik",
    deskripsi: "Mengawasi pengadaan material, vendor, dan jadwal pengiriman.",
  },
  {
    id: "jab-15",
    nama: "Quality Assurance Lead",
    divisiId: "div-5",
    divisiNama: "Operasional & Logistik",
    deskripsi: "Memastikan standar mutu proses operasional dan kepatuhan SOP.",
  },
];

export const INITIAL_KARYAWAN: Karyawan[] = [
  // 1. IT (3 employees)
  {
    id: "emp-101",
    nik: "EMP-2024-101",
    nama: "Ahmad Fauzi, S.Kom.",
    divisiId: "div-1",
    divisiNama: "Teknologi Informasi",
    jabatanId: "jab-1",
    jabatanNama: "IT Manager",
    email: "ahmad.fauzi@kpicorp.co.id",
    phone: "0812-3456-7801",
    alamat: "Jl. Sudirman No. 45, Jakarta Pusat",
    tanggalBergabung: "2021-03-15",
    status: "Aktif",
    role: "manager",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "emp-102",
    nik: "EMP-2024-102",
    nama: "Rizky Pratama, M.Cs.",
    divisiId: "div-1",
    divisiNama: "Teknologi Informasi",
    jabatanId: "jab-2",
    jabatanNama: "Senior Software Engineer",
    email: "rizky.pratama@kpicorp.co.id",
    phone: "0812-3456-7802",
    alamat: "Jl. Margonda Raya No. 12, Depok",
    tanggalBergabung: "2022-07-01",
    status: "Aktif",
    role: "karyawan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "emp-103",
    nik: "EMP-2024-103",
    nama: "Nurul Hidayah, S.Kom.",
    divisiId: "div-1",
    divisiNama: "Teknologi Informasi",
    jabatanId: "jab-3",
    jabatanNama: "System Administrator",
    email: "nurul.hidayah@kpicorp.co.id",
    phone: "0812-3456-7803",
    alamat: "Jl. Tebet Barat Dalam No. 88, Jakarta Selatan",
    tanggalBergabung: "2023-01-10",
    status: "Aktif",
    role: "karyawan",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },

  // 2. HRD (3 employees)
  {
    id: "emp-201",
    nik: "EMP-2024-201",
    nama: "Siti Rahmawati, S.Psi.",
    divisiId: "div-2",
    divisiNama: "Sumber Daya Manusia",
    jabatanId: "jab-4",
    jabatanNama: "HR Manager",
    email: "siti.rahmawati@kpicorp.co.id",
    phone: "0812-3456-7804",
    alamat: "Jl. Kemang Raya No. 19, Jakarta Selatan",
    tanggalBergabung: "2020-05-18",
    status: "Aktif",
    role: "hrd",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "emp-202",
    nik: "EMP-2024-202",
    nama: "Budi Santoso, S.Psi.",
    divisiId: "div-2",
    divisiNama: "Sumber Daya Manusia",
    jabatanId: "jab-5",
    jabatanNama: "Talent Acquisition Specialist",
    email: "budi.santoso@kpicorp.co.id",
    phone: "0812-3456-7805",
    alamat: "Jl. Cempaka Putih No. 102, Jakarta Pusat",
    tanggalBergabung: "2022-09-01",
    status: "Aktif",
    role: "hrd",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "emp-203",
    nik: "EMP-2024-203",
    nama: "Dewi Lestari, S.M.",
    divisiId: "div-2",
    divisiNama: "Sumber Daya Manusia",
    jabatanId: "jab-6",
    jabatanNama: "People Operations Officer",
    email: "dewi.lestari@kpicorp.co.id",
    phone: "0812-3456-7806",
    alamat: "Jl. Bintaro Utama Sektor 3A, Tangerang Selatan",
    tanggalBergabung: "2023-04-12",
    status: "Aktif",
    role: "karyawan",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  },

  // 3. Finance (3 employees)
  {
    id: "emp-301",
    nik: "EMP-2024-301",
    nama: "Hendra Wijaya, S.E., Ak.",
    divisiId: "div-3",
    divisiNama: "Keuangan & Akuntansi",
    jabatanId: "jab-7",
    jabatanNama: "Finance Manager",
    email: "hendra.wijaya@kpicorp.co.id",
    phone: "0812-3456-7807",
    alamat: "Jl. Boulevard Kelapa Gading No. 15, Jakarta Utara",
    tanggalBergabung: "2021-01-05",
    status: "Aktif",
    role: "manager",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "emp-302",
    nik: "EMP-2024-302",
    nama: "Dian Permatasari, S.Ak.",
    divisiId: "div-3",
    divisiNama: "Keuangan & Akuntansi",
    jabatanId: "jab-8",
    jabatanNama: "Senior Accountant",
    email: "dian.permatasari@kpicorp.co.id",
    phone: "0812-3456-7808",
    alamat: "Jl. Radio Dalam No. 34, Jakarta Selatan",
    tanggalBergabung: "2022-11-20",
    status: "Aktif",
    role: "karyawan",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "emp-303",
    nik: "EMP-2024-303",
    nama: "Fajar Ramadhan, S.E.",
    divisiId: "div-3",
    divisiNama: "Keuangan & Akuntansi",
    jabatanId: "jab-9",
    jabatanNama: "Financial Analyst",
    email: "fajar.ramadhan@kpicorp.co.id",
    phone: "0812-3456-7809",
    alamat: "Jl. Rawamangun Muka No. 7, Jakarta Timur",
    tanggalBergabung: "2023-08-15",
    status: "Aktif",
    role: "karyawan",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
  },

  // 4. Marketing (3 employees)
  {
    id: "emp-401",
    nik: "EMP-2024-401",
    nama: "Maya Anggraini, S.I.Kom.",
    divisiId: "div-4",
    divisiNama: "Pemasaran & Penjualan",
    jabatanId: "jab-10",
    jabatanNama: "Marketing Manager",
    email: "maya.anggraini@kpicorp.co.id",
    phone: "0812-3456-7810",
    alamat: "Jl. Senopati No. 22, Jakarta Selatan",
    tanggalBergabung: "2021-09-10",
    status: "Aktif",
    role: "manager",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "emp-402",
    nik: "EMP-2024-402",
    nama: "Dimas Arya Kusuma, S.Ds.",
    divisiId: "div-4",
    divisiNama: "Pemasaran & Penjualan",
    jabatanId: "jab-11",
    jabatanNama: "Digital Marketing Specialist",
    email: "dimas.arya@kpicorp.co.id",
    phone: "0812-3456-7811",
    alamat: "Jl. Kebon Jeruk Raya No. 51, Jakarta Barat",
    tanggalBergabung: "2023-02-01",
    status: "Aktif",
    role: "karyawan",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "emp-403",
    nik: "EMP-2024-403",
    nama: "Intan Kusuma, S.E.",
    divisiId: "div-4",
    divisiNama: "Pemasaran & Penjualan",
    jabatanId: "jab-12",
    jabatanNama: "Sales Executive",
    email: "intan.kusuma@kpicorp.co.id",
    phone: "0812-3456-7812",
    alamat: "Jl. Galaxy Raya Blok H No. 4, Bekasi Selatan",
    tanggalBergabung: "2023-06-18",
    status: "Aktif",
    role: "karyawan",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },

  // 5. Operations (3 employees)
  {
    id: "emp-501",
    nik: "EMP-2024-501",
    nama: "Eko Prasetyo, S.T.",
    divisiId: "div-5",
    divisiNama: "Operasional & Logistik",
    jabatanId: "jab-13",
    jabatanNama: "Operations Manager",
    email: "eko.prasetyo@kpicorp.co.id",
    phone: "0812-3456-7813",
    alamat: "Jl. Sunter Podomoro No. 89, Jakarta Utara",
    tanggalBergabung: "2020-10-15",
    status: "Aktif",
    role: "manager",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "emp-502",
    nik: "EMP-2024-502",
    nama: "Gita Gutawa Putri, S.Log.",
    divisiId: "div-5",
    divisiNama: "Operasional & Logistik",
    jabatanId: "jab-14",
    jabatanNama: "Supply Chain Specialist",
    email: "gita.gutawa@kpicorp.co.id",
    phone: "0812-3456-7814",
    alamat: "Jl. Daan Mogot KM 14, Jakarta Barat",
    tanggalBergabung: "2022-04-05",
    status: "Aktif",
    role: "karyawan",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "emp-503",
    nik: "EMP-2024-503",
    nama: "Arif Maulana, S.T.",
    divisiId: "div-5",
    divisiNama: "Operasional & Logistik",
    jabatanId: "jab-15",
    jabatanNama: "Quality Assurance Lead",
    email: "arif.maulana@kpicorp.co.id",
    phone: "0812-3456-7815",
    alamat: "Jl. Raya Pasar Minggu No. 17, Jakarta Selatan",
    tanggalBergabung: "2023-10-01",
    status: "Aktif",
    role: "karyawan",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  },
];

// 5 Indikator KPI (Cumulative Bobot: 15 + 15 + 25 + 25 + 20 = 100%)
export const INITIAL_INDIKATOR: IndikatorKpi[] = [
  {
    id: "ind-1",
    nama: "Disiplin & Kehadiran",
    tipe: "KPI Umum",
    bobot: 15,
    targetKinerja:
      "Tingkat ketepatan waktu jam kerja minimal 98%, kepatuhan pengisian presensi, dan kedisiplinan jam kerja.",
    status: "Aktif",
  },
  {
    id: "ind-2",
    nama: "Kerjasama Tim & Komunikasi",
    tipe: "KPI Umum",
    bobot: 15,
    targetKinerja:
      "Kolaborasi aktif antar anggota tim dan lintas divisi, responsif dalam pertukaran informasi, dan saling mendukung tugas bersama.",
    status: "Aktif",
  },
  {
    id: "ind-3",
    nama: "Kualitas Output & Akurasi Kerja",
    tipe: "KPI Pilar",
    bobot: 25,
    targetKinerja:
      "Hasil deliverable pekerjaan memiliki akurasi tinggi, rapi, patuh SOP, dan tingkat revisi di bawah batas maksimal 5%.",
    status: "Aktif",
  },
  {
    id: "ind-4",
    nama: "Ketepatan Waktu Target (SLA)",
    tipe: "KPI Pilar",
    bobot: 25,
    targetKinerja:
      "Menyelesaikan target milestone penugasan tepat waktu sebelum batas akhir Service Level Agreement (SLA) proyek.",
    status: "Aktif",
  },
  {
    id: "ind-5",
    nama: "Inisiatif & Problem Solving",
    tipe: "KPI Pilar",
    bobot: 20,
    targetKinerja:
      "Menunjukkan proaktivitas dalam memberi rekomendasi solusi konkret atas kendala operasional serta menciptakan efisiensi.",
    status: "Aktif",
  },
];

// Periode Penilaian (4 Quartal)
export const INITIAL_PERIODE: PeriodePenilaian[] = [
  {
    id: "per-1",
    namaPeriode: "Penilaian Kinerja Q1 2026",
    quartal: "Q1",
    quartalLabel: "Januari - Maret 2026",
    tahun: 2026,
    startDate: "2026-04-01",
    endDate: "2026-04-10",
    status: "Complete",
  },
  {
    id: "per-2",
    namaPeriode: "Penilaian Kinerja Q2 2026",
    quartal: "Q2",
    quartalLabel: "April - Juni 2026",
    tahun: 2026,
    startDate: "2026-07-01",
    endDate: "2026-07-15",
    status: "Aktif",
  },
  {
    id: "per-3",
    namaPeriode: "Penilaian Kinerja Q3 2026",
    quartal: "Q3",
    quartalLabel: "Juli - September 2026",
    tahun: 2026,
    startDate: "2026-10-01",
    endDate: "2026-10-15",
    status: "Waiting",
  },
  {
    id: "per-4",
    namaPeriode: "Penilaian Kinerja Q4 2026",
    quartal: "Q4",
    quartalLabel: "Oktober - Desember 2026",
    tahun: 2026,
    startDate: "2027-01-02",
    endDate: "2027-01-15",
    status: "Waiting",
  },
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: "usr-1",
    username: "admin.hrd",
    email: "siti.rahmawati@kpicorp.co.id",
    role: "hrd",
    karyawanId: "emp-201",
    karyawanNik: "EMP-2024-201",
    karyawanNama: "Siti Rahmawati, S.Psi.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-2",
    username: "manager.it",
    email: "ahmad.fauzi@kpicorp.co.id",
    role: "manager",
    karyawanId: "emp-101",
    karyawanNik: "EMP-2024-101",
    karyawanNama: "Ahmad Fauzi, S.Kom.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-3",
    username: "manager.fin",
    email: "hendra.wijaya@kpicorp.co.id",
    role: "manager",
    karyawanId: "emp-301",
    karyawanNik: "EMP-2024-301",
    karyawanNama: "Hendra Wijaya, S.E., Ak.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-4",
    username: "manager.mkt",
    email: "maya.anggraini@kpicorp.co.id",
    role: "manager",
    karyawanId: "emp-401",
    karyawanNik: "EMP-2024-401",
    karyawanNama: "Maya Anggraini, S.I.Kom.",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-5",
    username: "manager.ops",
    email: "eko.prasetyo@kpicorp.co.id",
    role: "manager",
    karyawanId: "emp-501",
    karyawanNik: "EMP-2024-501",
    karyawanNama: "Eko Prasetyo, S.T.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-6",
    username: "karyawan.rizky",
    email: "rizky.pratama@kpicorp.co.id",
    role: "karyawan",
    karyawanId: "emp-102",
    karyawanNik: "EMP-2024-102",
    karyawanNama: "Rizky Pratama, M.Cs.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-7",
    username: "karyawan.dewi",
    email: "dewi.lestari@kpicorp.co.id",
    role: "karyawan",
    karyawanId: "emp-203",
    karyawanNik: "EMP-2024-203",
    karyawanNama: "Dewi Lestari, S.M.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  },
];

// Generate Initial Evaluation Data for Q1 (Quartal Sebelumnya) and Q2 (Quartal Berjalan)
function createDummyPenilaian(
  id: string,
  karyawan: Karyawan,
  periode: PeriodePenilaian,
  penilai: { id: string; nama: string },
  scores: [number, number, number, number, number], // 1 to 5 for ind-1 to ind-5
  komentar: string,
  isDraft: boolean = false
): PenilaianKinerja {
  const scoreLabels = [
    "",
    "Sangat Kurang (1)",
    "Kurang (2)",
    "Cukup (3)",
    "Baik (4)",
    "Sangat Baik (5)",
  ];

  const items = INITIAL_INDIKATOR.map((ind, idx) => {
    const s = scores[idx] || 4;
    const calculated = (s / 5) * ind.bobot;
    return {
      indikatorId: ind.id,
      indikatorNama: ind.nama,
      tipe: ind.tipe,
      bobot: ind.bobot,
      score: s,
      scoreLabel: scoreLabels[s] || "Baik (4)",
      calculatedScore: calculated,
    };
  });

  const umumItems = items.filter((it) => it.tipe === "KPI Umum");
  const pilarItems = items.filter((it) => it.tipe === "KPI Pilar");

  const totalUmumBobot = umumItems.reduce((acc, it) => acc + it.bobot, 0);
  const sumUmumCalc = umumItems.reduce((acc, it) => acc + it.calculatedScore, 0);
  const nilaiKpiUmum = totalUmumBobot > 0 ? (sumUmumCalc / totalUmumBobot) * 100 : 0;

  const totalPilarBobot = pilarItems.reduce((acc, it) => acc + it.bobot, 0);
  const sumPilarCalc = pilarItems.reduce((acc, it) => acc + it.calculatedScore, 0);
  const nilaiKpiPilar = totalPilarBobot > 0 ? (sumPilarCalc / totalPilarBobot) * 100 : 0;

  const totalAkhir = items.reduce((acc, it) => acc + it.calculatedScore, 0);
  const nilaiAkhir = Math.round(totalAkhir * 10) / 10;
  const kategori = getKategoriByScore(nilaiAkhir);

  return {
    id,
    karyawanId: karyawan.id,
    karyawanNama: karyawan.nama,
    karyawanNik: karyawan.nik,
    divisiNama: karyawan.divisiNama,
    jabatanNama: karyawan.jabatanNama,
    periodeId: periode.id,
    periodeNama: periode.namaPeriode,
    penilaiId: penilai.id,
    penilaiNama: penilai.nama,
    tanggalPenilaian: isDraft ? "" : periode.endDate,
    items,
    nilaiKpiUmum: Math.round(nilaiKpiUmum * 10) / 10,
    nilaiKpiPilar: Math.round(nilaiKpiPilar * 10) / 10,
    nilaiAkhir,
    kategori,
    ringkasanPenilaian: `Pencapaian kinerja karyawan pada ${periode.quartalLabel} tergolong dalam kategori ${kategori} dengan skor keseluruhan ${nilaiAkhir}%.`,
    komentarAtasan: komentar,
    status: isDraft ? "Belum Dinilai" : "Sudah Dinilai",
  };
}

// Generate Realistic Evaluations for all 15 Employees in Q1 2026 (Quartal Sebelumnya)
export const INITIAL_PENILAIAN: PenilaianKinerja[] = [
  // IT Team (Penilai: Ahmad Fauzi)
  createDummyPenilaian(
    "eval-q1-101",
    INITIAL_KARYAWAN[0], // Ahmad Fauzi
    INITIAL_PERIODE[0],
    { id: "emp-201", nama: "Siti Rahmawati, S.Psi." },
    [5, 5, 5, 4, 5], // 96.0
    "Kepemimpinan teknis sangat solid, berhasil mengawal migrasi cloud tepat waktu tanpa downtime."
  ),
  createDummyPenilaian(
    "eval-q1-102",
    INITIAL_KARYAWAN[1], // Rizky Pratama
    INITIAL_PERIODE[0],
    { id: "emp-101", nama: "Ahmad Fauzi, S.Kom." },
    [5, 5, 5, 5, 4], // 98.0
    "Kualitas kode sangat baik, refactoring arsitektur microservices berjalan sukses dan minim bug."
  ),
  createDummyPenilaian(
    "eval-q1-103",
    INITIAL_KARYAWAN[2], // Nurul Hidayah
    INITIAL_PERIODE[0],
    { id: "emp-101", nama: "Ahmad Fauzi, S.Kom." },
    [4, 4, 4, 4, 4], // 80.0
    "Pemeliharaan server dan backup rutin sangat disiplin. Perlu ditingkatkan inisiatif otomasi script."
  ),

  // HRD Team (Penilai: Siti Rahmawati)
  createDummyPenilaian(
    "eval-q1-201",
    INITIAL_KARYAWAN[3], // Siti Rahmawati
    INITIAL_PERIODE[0],
    { id: "emp-101", nama: "Ahmad Fauzi, S.Kom." },
    [5, 4, 5, 4, 5], // 92.0
    "Strategi pengelolaan talenta dan pelaksanaan asesmen KPI quartal terkoordinasi dengan sangat baik."
  ),
  createDummyPenilaian(
    "eval-q1-202",
    INITIAL_KARYAWAN[4], // Budi Santoso
    INITIAL_PERIODE[0],
    { id: "emp-201", nama: "Siti Rahmawati, S.Psi." },
    [4, 4, 4, 5, 4], // 82.0
    "Target rekrutmen terpenuhi sesuai timeline. Disarankan memperluas jaringan talent pool LinkedIn."
  ),
  createDummyPenilaian(
    "eval-q1-203",
    INITIAL_KARYAWAN[5], // Dewi Lestari
    INITIAL_PERIODE[0],
    { id: "emp-201", nama: "Siti Rahmawati, S.Psi." },
    [5, 4, 4, 4, 3], // 78.0
    "Administrasi BPJS dan presensi rapi. Tingkatkan problem solving saat menangani kendala klaim asuransi."
  ),

  // Finance Team (Penilai: Hendra Wijaya)
  createDummyPenilaian(
    "eval-q1-301",
    INITIAL_KARYAWAN[6], // Hendra Wijaya
    INITIAL_PERIODE[0],
    { id: "emp-201", nama: "Siti Rahmawati, S.Psi." },
    [5, 4, 5, 4, 4], // 88.0
    "Pengendalian anggaran departemen berjalan optimal dan pelaporan audit internal nihil temuan."
  ),
  createDummyPenilaian(
    "eval-q1-302",
    INITIAL_KARYAWAN[7], // Dian Permatasari
    INITIAL_PERIODE[0],
    { id: "emp-301", nama: "Hendra Wijaya, S.E., Ak." },
    [4, 5, 4, 4, 4], // 82.0
    "Rekonsiliasi perbankan bulanan selalu diselesaikan tepat tanggal 3 tanpa kesalahan input."
  ),
  createDummyPenilaian(
    "eval-q1-303",
    INITIAL_KARYAWAN[8], // Fajar Ramadhan
    INITIAL_PERIODE[0],
    { id: "emp-301", nama: "Hendra Wijaya, S.E., Ak." },
    [4, 3, 4, 3, 3], // 70.0
    "Kinerja cukup baik. Analisis varian biaya perlu ditambahkan rekomendasi tindakan pencegahan lebih detil."
  ),

  // Marketing Team (Penilai: Maya Anggraini)
  createDummyPenilaian(
    "eval-q1-401",
    INITIAL_KARYAWAN[9], // Maya Anggraini
    INITIAL_PERIODE[0],
    { id: "emp-201", nama: "Siti Rahmawati, S.Psi." },
    [5, 5, 4, 5, 4], // 90.0
    "Kampanye promosi Q1 melampaui target lead sebesar 120%, branding produk makin dikenal publik."
  ),
  createDummyPenilaian(
    "eval-q1-402",
    INITIAL_KARYAWAN[10], // Dimas Arya Kusuma
    INITIAL_PERIODE[0],
    { id: "emp-401", nama: "Maya Anggraini, S.I.Kom." },
    [4, 4, 5, 4, 4], // 84.0
    "ROAS digital ads naik signifikan. Konten media sosial mendapatkan engagement rate sangat tinggi."
  ),
  createDummyPenilaian(
    "eval-q1-403",
    INITIAL_KARYAWAN[11], // Intan Kusuma
    INITIAL_PERIODE[0],
    { id: "emp-401", nama: "Maya Anggraini, S.I.Kom." },
    [4, 4, 4, 4, 4], // 80.0
    "Pencapaian target penjualan stabil. Tingkatkan follow-up terhadap prospek corporate berpotensi besar."
  ),

  // Operations Team (Penilai: Eko Prasetyo)
  createDummyPenilaian(
    "eval-q1-501",
    INITIAL_KARYAWAN[12], // Eko Prasetyo
    INITIAL_PERIODE[0],
    { id: "emp-201", nama: "Siti Rahmawati, S.Psi." },
    [4, 4, 4, 4, 4], // 80.0
    "Distribusi gudang terkendali baik, perlu pengawasan lebih ketat terhadap efisiensi bahan bakar armada."
  ),
  createDummyPenilaian(
    "eval-q1-502",
    INITIAL_KARYAWAN[13], // Gita Gutawa Putri
    INITIAL_PERIODE[0],
    { id: "emp-501", nama: "Eko Prasetyo, S.T." },
    [4, 4, 4, 3, 3], // 72.0
    "Koordinasi pengadaan barang berjalan lancar, kendati sempat ada keterlambatan dari salah satu supplier lokal."
  ),
  createDummyPenilaian(
    "eval-q1-503",
    INITIAL_KARYAWAN[14], // Arif Maulana
    INITIAL_PERIODE[0],
    { id: "emp-501", nama: "Eko Prasetyo, S.T." },
    [3, 3, 4, 3, 3], // 64.0
    "Pemeriksaan mutu masih perlu ditingkatkan ketelitiannya untuk meminimalkan komplain return kemasan dari pelanggan."
  ),

  // Q2 2026 Evaluations (Quartal Berjalan - Beberapa sudah dinilai, sebagian belum dinilai)
  createDummyPenilaian(
    "eval-q2-102",
    INITIAL_KARYAWAN[1], // Rizky Pratama
    INITIAL_PERIODE[1],
    { id: "emp-101", nama: "Ahmad Fauzi, S.Kom." },
    [5, 5, 5, 5, 5], // 100.0
    "Sangat luar biasa! Rizky berhasil menyelesaikan modul pembayaran otomatis sebelum batas akhir quartal."
  ),
  createDummyPenilaian(
    "eval-q2-402",
    INITIAL_KARYAWAN[10], // Dimas Arya
    INITIAL_PERIODE[1],
    { id: "emp-401", nama: "Maya Anggraini, S.I.Kom." },
    [4, 5, 4, 4, 5], // 86.0
    "Eksperimen kampanye A/B testing menghasilkan konversi penjualan yang memuaskan."
  ),
];
