-- ==============================================================================
-- SKEMA BASIS DATA SUPABASE / POSTGRESQL UNTUK SISTEM KPI TERINTEGRASI
-- Skripsi / Tugas Akhir: Sistem Manajemen & Penilaian Kinerja Karyawan
-- ==============================================================================

-- 1. Tabel Divisi
CREATE TABLE IF NOT EXISTS divisi (
    id TEXT PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Jabatan
CREATE TABLE IF NOT EXISTS jabatan (
    id TEXT PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    divisi_id TEXT REFERENCES divisi(id) ON DELETE CASCADE,
    deskripsi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabel Karyawan (15 Karyawan Dummy)
CREATE TABLE IF NOT EXISTS karyawan (
    id TEXT PRIMARY KEY,
    nik VARCHAR(50) UNIQUE NOT NULL,
    nama VARCHAR(200) NOT NULL,
    divisi_id TEXT REFERENCES divisi(id) ON DELETE SET NULL,
    jabatan_id TEXT REFERENCES jabatan(id) ON DELETE SET NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(50),
    alamat TEXT,
    tanggal_bergabung DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Non Aktif')),
    role VARCHAR(20) DEFAULT 'karyawan' CHECK (role IN ('hrd', 'manager', 'karyawan')),
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabel Indikator KPI (Cumulative Bobot Maksimal 100%)
CREATE TABLE IF NOT EXISTS indikator_kpi (
    id TEXT PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    tipe VARCHAR(50) DEFAULT 'KPI Pilar' CHECK (tipe IN ('KPI Umum', 'KPI Pilar')),
    bobot NUMERIC(5,2) NOT NULL CHECK (bobot > 0 AND bobot <= 100),
    target_kinerja TEXT,
    status VARCHAR(20) DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Non Aktif')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabel Periode Penilaian (4 Quartal, 1 Periode = 3 Bulan)
CREATE TABLE IF NOT EXISTS periode_penilaian (
    id TEXT PRIMARY KEY,
    nama_periode VARCHAR(150) NOT NULL,
    quartal VARCHAR(10) NOT NULL CHECK (quartal IN ('Q1', 'Q2', 'Q3', 'Q4')),
    quartal_label VARCHAR(100) NOT NULL,
    tahun INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Waiting' CHECK (status IN ('Waiting', 'Aktif', 'Complete')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabel Akun Pengguna (Auth / Profile Mapping)
CREATE TABLE IF NOT EXISTS user_accounts (
    id TEXT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('hrd', 'manager', 'karyawan')),
    karyawan_id TEXT REFERENCES karyawan(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabel Penilaian Kinerja Karyawan
CREATE TABLE IF NOT EXISTS penilaian_kinerja (
    id TEXT PRIMARY KEY,
    karyawan_id TEXT REFERENCES karyawan(id) ON DELETE CASCADE,
    periode_id TEXT REFERENCES periode_penilaian(id) ON DELETE CASCADE,
    penilai_id TEXT REFERENCES karyawan(id) ON DELETE SET NULL,
    tanggal_penilaian DATE,
    nilai_kpi_umum NUMERIC(5,2) DEFAULT 0,
    nilai_kpi_pilar NUMERIC(5,2) DEFAULT 0,
    nilai_akhir NUMERIC(5,2) DEFAULT 0,
    kategori VARCHAR(50) CHECK (kategori IN ('Sangat Baik', 'Baik', 'Cukup', 'Kurang', 'Sangat Kurang')),
    ringkasan_penilaian TEXT,
    komentar_atasan TEXT,
    status VARCHAR(30) DEFAULT 'Belum Dinilai' CHECK (status IN ('Belum Dinilai', 'Sudah Dinilai')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Tabel Rincian Skor per Indikator
CREATE TABLE IF NOT EXISTS penilaian_item (
    id BIGSERIAL PRIMARY KEY,
    penilaian_id TEXT REFERENCES penilaian_kinerja(id) ON DELETE CASCADE,
    indikator_id TEXT REFERENCES indikator_kpi(id) ON DELETE CASCADE,
    bobot NUMERIC(5,2) NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
    score_label VARCHAR(50),
    calculated_score NUMERIC(5,2) NOT NULL
);

-- ==============================================================================
-- INITIAL SEED DATA (5 Divisi, 15 Karyawan, 5 Indikator, 4 Periode)
-- ==============================================================================

-- Seed 5 Divisi
INSERT INTO divisi (id, nama, deskripsi) VALUES
('div-1', 'Teknologi Informasi', 'Pengembangan sistem aplikasi, pengelolaan infrastruktur cloud, dan keamanan data.'),
('div-2', 'Sumber Daya Manusia', 'Pengelolaan talenta, rekrutmen, pelatihan, evaluasi kinerja, dan hubungan kerja.'),
('div-3', 'Keuangan & Akuntansi', 'Pengelolaan arus kas, perencanaan anggaran operasional, perpajakan, dan audit.'),
('div-4', 'Pemasaran & Penjualan', 'Strategi promosi, pemasaran digital, penetrasi pasar baru, dan pendapatan.'),
('div-5', 'Operasional & Logistik', 'Manajemen rantai pasok, pergudangan, distribusi produk, dan fasilitas.')
ON CONFLICT (id) DO NOTHING;

-- Seed Indikator (Total 100%)
INSERT INTO indikator_kpi (id, nama, tipe, bobot, target_kinerja, status) VALUES
('ind-1', 'Disiplin & Kehadiran', 'KPI Umum', 15.00, 'Tingkat ketepatan waktu kerja minimal 98% dan kepatuhan absensi.', 'Aktif'),
('ind-2', 'Kerjasama Tim & Komunikasi', 'KPI Umum', 15.00, 'Kolaborasi aktif antar tim dan koordinasi proaktif.', 'Aktif'),
('ind-3', 'Kualitas Output & Akurasi Kerja', 'KPI Pilar', 25.00, 'Hasil kerja berakurasi tinggi, patuh SOP, dan minim revisi.', 'Aktif'),
('ind-4', 'Ketepatan Waktu Target (SLA)', 'KPI Pilar', 25.00, 'Menyelesaikan milestone sebelum batas akhir SLA proyek.', 'Aktif'),
('ind-5', 'Inisiatif & Problem Solving', 'KPI Pilar', 20.00, 'Proaktif memberikan solusi konkret atas kendala operasional.', 'Aktif')
ON CONFLICT (id) DO NOTHING;

-- Seed 4 Periode (4 Quartal)
INSERT INTO periode_penilaian (id, nama_periode, quartal, quartal_label, tahun, start_date, end_date, status) VALUES
('per-1', 'Penilaian Kinerja Q1 2026', 'Q1', 'Januari - Maret 2026', 2026, '2026-04-01', '2026-04-10', 'Complete'),
('per-2', 'Penilaian Kinerja Q2 2026', 'Q2', 'April - Juni 2026', 2026, '2026-07-01', '2026-07-15', 'Aktif'),
('per-3', 'Penilaian Kinerja Q3 2026', 'Q3', 'Juli - September 2026', 2026, '2026-10-01', '2026-10-15', 'Waiting'),
('per-4', 'Penilaian Kinerja Q4 2026', 'Q4', 'Oktober - Desember 2026', 2026, '2027-01-02', '2027-01-15', 'Waiting')
ON CONFLICT (id) DO NOTHING;
