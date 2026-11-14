import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-800">
      <div className="text-center">
        <h2 className="text-2xl font-bold">404 - Halaman Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 mt-2">
          Halaman yang Anda cari tidak tersedia dalam sistem.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
