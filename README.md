# Sistem Manajemen & Penilaian Kinerja Karyawan (KPI Website)

Aplikasi Web Manajemen Key Performance Indicator (KPI) dan Evaluasi Kinerja Karyawan berbasis Quartal (4 Periode per Tahun). Dibangun dengan arsitektur modern menggunakan **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, dan siap dihubungkan langsung ke **Supabase** & **v0**.

---

## 🌟 Fitur Utama Sistem

### 1. Dashboard HRD / Administrator
- **Dashboard Ringkasan Eksekutif**:
  - Total Karyawan (15 orang dummy)
  - Total Divisi (5 divisi kerja)
  - Total Jabatan (15 posisi)
  - Periode Penilaian (4 Quartal: Q1, Q2, Q3, Q4)
  - Evaluasi Quartal Sebelumnya: Skor rata-rata, skor tertinggi, dan skor terendah
  - Distribusi Skor KPI (*Sangat Baik*, *Baik*, *Cukup*, *Kurang*, *Sangat Kurang*) dengan visualisasi grafik persentase
- **Halaman Divisi**:
  - Tabel: Nomor, Nama Divisi, Deskripsi Divisi, Jumlah Karyawan, Aksi (Edit & Delete)
  - Modal Form Tambah Divisi Baru
  - Fitur Pencarian Realtime Divisi
- **Halaman Jabatan**:
  - Tabel: Nomor, Nama Jabatan, Divisi Penempatan, Deskripsi, Jumlah Karyawan, Aksi (Edit & Delete)
  - Modal Form Tambah Jabatan Baru
  - Fitur Pencarian & Filter Divisi
- **Halaman Karyawan**:
  - Tabel: Nomor, NIK, Nama Lengkap, Divisi, Jabatan, Email, Status (Aktif/Non Aktif), Aksi (Detail, Edit, Delete)
  - Modal Form Tambah Karyawan Lengkap (NIK, Nama, Divisi, Jabatan, Email, No HP, Alamat, Tanggal Bergabung, Status, Role)
  - **Halaman Detail Karyawan**:
    - Profil lengkap karyawan
    - Riwayat evaluasi kinerja per individu di seluruh periode
    - Tabel penilaian: Nilai KPI Umum, Nilai KPI Pilar, Nilai Akhir, Kategori Skor, dan tombol Rincian
  - **Modal Rincian Penilaian**:
    - Nama Karyawan, Periode Penilaian, Nilai Akhir, Ringkasan Penilaian, Kategori Skor
    - Menampilkan 1 komentar resmi dari penilai/atasan
    - Breakdown skor untuk setiap indikator KPI
- **Halaman Indikator KPI (Setting KPI)**:
  - Tabel: Nomor, Nama Indikator, Kategori Tipe (KPI Umum / KPI Pilar), Bobot (%), Target Kinerja (deskripsi), Status, Aksi (Edit & Delete)
  - **Aturan Pembobotan Kumulatif 100%**:
    - Maksimal seluruh bobot adalah 100%
    - Jika sudah 100%, tombol "Tambah Indikator" otomatis dinonaktifkan (disabled)
    - Jika belum 100%, ketika pengguna berpindah ke halaman lain, sistem akan memunculkan **Dialog Pengingat (Reminder Dialog)** bahwa bobot belum 100% (pilihan: Lanjutkan atau Kembali melengkapi)
- **Halaman Periode Penilaian**:
  - Tabel: Nomor, Nama Periode, Quartal (Jan-Mar 2026, Apr-Jun 2026, dst.), Tanggal Aktif Pengisian (Start & End Date), Status (Waiting / Aktif / Complete), Aksi (Edit & Delete)
  - Tombol edit & delete otomatis dinonaktifkan untuk periode yang sudah berstatus **Complete**
  - Form Tambah Periode: Dropdown Quartal (Q1 - Q4) otomatis mengisi rentang tanggal quartal; tanggal mulai dan akhir pengisian hanya menerima tanggal ke depan (future date); status otomatis dihitung (Waiting, Aktif, Complete)
- **Halaman Akun Pengguna**:
  - Tabel: Username (untuk login), Email, Role (HRD, Manager, Karyawan), Pemilik (Nama Karyawan & NIK), Aksi (Edit & Hapus)
  - Modal Tambah & Edit Akun Pengguna terhubung ke data master karyawan
- **Halaman Laporan Kinerja**:
  - Filter: Periode Penilaian, Divisi, dan Jabatan
  - Papan Peringkat Kinerja (Leaderboard) dengan Highlight Podium Top 3
  - Tabel: Ranking, Karyawan (Nama & NIK), Divisi, Jabatan, Nilai Akhir, Kategori, Aksi Detail

---

### 2. Dashboard Karyawan
- Melihat ringkasan performa individu: skor terakhir, kategori kinerja, dan jumlah quartal terselesaikan
- Tabel riwayat seluruh penilaian di semua periode (Q1 - Q4)
- Tombol **Lihat Rincian** untuk membuka modal rincian nilai indikator dan pesan/komentar evaluasi atasan

---

### 3. Dashboard Manager
- **Statistik Penilaian Tim**:
  - Jumlah Karyawan (di divisi di bawah penilaian manager)
  - Sudah Dinilai (jumlah & persentase)
  - Belum Dinilai
  - Progress Pengisian KPI pada quartal berjalan (%)
  - Papan Peringkat Kinerja tim internal divisi
- **Halaman Input Penilaian**:
  - Tabel karyawan yang harus dinilai: Nomor, NIK, Nama, Divisi, Jabatan, Nilai Akhir, Status Penilaian (*Sudah Dinilai* / *Belum Dinilai*), Aksi (*Input Nilai* / *Edit Nilai*)
- **Formulir Input Nilai Indikator KPI**:
  - Menampilkan setiap indikator KPI yang telah diinput HRD/Admin
  - 5 Skala Penilaian: **Sangat Baik (5)**, **Baik (4)**, **Cukup (3)**, **Kurang (2)**, **Sangat Kurang (1)**
  - Kalkulasi nilai dinamis real-time (Nilai KPI Umum, Nilai KPI Pilar, dan Nilai Akhir)
  - Catatan tambahan untuk memberikan feedback/pesan langsung kepada karyawan
  - Tombol Submit & Kembali

---

## 👥 Data Awal Dummy (15 Karyawan dalam 5 Divisi)

1. **Teknologi Informasi (IT)**:
   - Ahmad Fauzi, S.Kom. (IT Manager - Manager)
   - Rizky Pratama, M.Cs. (Senior Software Engineer - Karyawan)
   - Nurul Hidayah, S.Kom. (System Administrator - Karyawan)
2. **Sumber Daya Manusia (HRD)**:
   - Siti Rahmawati, S.Psi. (HR Manager - HRD)
   - Budi Santoso, S.Psi. (Talent Acquisition Specialist - HRD)
   - Dewi Lestari, S.M. (People Operations Officer - Karyawan)
3. **Keuangan & Akuntansi (Finance)**:
   - Hendra Wijaya, S.E., Ak. (Finance Manager - Manager)
   - Dian Permatasari, S.Ak. (Senior Accountant - Karyawan)
   - Fajar Ramadhan, S.E. (Financial Analyst - Karyawan)
4. **Pemasaran & Penjualan (Marketing)**:
   - Maya Anggraini, S.I.Kom. (Marketing Manager - Manager)
   - Dimas Arya Kusuma, S.Ds. (Digital Marketing Specialist - Karyawan)
   - Intan Kusuma, S.E. (Sales Executive - Karyawan)
5. **Operasional & Logistik (Operations)**:
   - Eko Prasetyo, S.T. (Operations Manager - Manager)
   - Gita Gutawa Putri, S.Log. (Supply Chain Specialist - Karyawan)
   - Arif Maulana, S.T. (Quality Assurance Lead - Karyawan)

---

## 🚀 Cara Menjalankan Proyek

1. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
2. Buka browser pada alamat: [http://localhost:3000](http://localhost:3000)
3. Gunakan dropdown **"Peran"** di pojok kanan atas navbar untuk berganti akun/peran secara instan antara:
   - **HRD / Administrator**
   - **Manager** (misal: Ahmad Fauzi, Hendra Wijaya, Maya Anggraini, Eko Prasetyo)
   - **Karyawan** (misal: Rizky Pratama, Dewi Lestari, dll.)

---

## 🗄️ Koneksi ke Supabase & v0

Skema database PostgreSQL yang lengkap dan siap pakai telah disediakan di:
`supabase/schema.sql`

Untuk menghubungkan ke Supabase:
1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka menu **SQL Editor** pada dashboard Supabase Anda.
3. Salin dan jalankan seluruh query dari file `supabase/schema.sql`.
4. Tabel `divisi`, `jabatan`, `karyawan`, `indikator_kpi`, `periode_penilaian`, `penilaian_kinerja`, dan `user_accounts` beserta seed datanya akan otomatis terbuat 100%!
