"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Save,
  MessageSquare,
  User,
  Building2,
  Briefcase,
  Calendar,
  Sparkles,
  Info,
} from "lucide-react";
import {
  PenilaianItem,
  PenilaianKinerja,
  getKategoriByScore,
  getScoreCategoryBadgeClass,
} from "@/types/kpi";
import confetti from "canvas-confetti";

export function FormNilaiKaryawan() {
  const {
    currentUser,
    selectedNilaiInputTarget,
    karyawanList,
    periodeList,
    indikatorList,
    penilaianList,
    savePenilaian,
    setActiveTabWithTransition,
  } = useApp();

  const target = selectedNilaiInputTarget;
  const karyawan = karyawanList.find((k) => k.id === target?.karyawanId);
  const periode = periodeList.find((p) => p.id === target?.periodeId);

  // Existing evaluation if any
  const existingEval = penilaianList.find(
    (p) => p.karyawanId === target?.karyawanId && p.periodeId === target?.periodeId
  );

  // Score state for each indicator: map of [indikatorId]: number (1 to 5)
  const [scores, setScores] = useState<Record<string, number>>({});
  const [komentar, setKomentar] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const initialScores: Record<string, number> = {};
    if (existingEval && existingEval.items?.length > 0) {
      existingEval.items.forEach((item) => {
        initialScores[item.indikatorId] = item.score || 4;
      });
      setKomentar(existingEval.komentarAtasan || "");
    } else {
      indikatorList.forEach((ind) => {
        initialScores[ind.id] = 4; // default Baik (4)
      });
    }
    setScores(initialScores);
  }, [existingEval, indikatorList]);

  if (!karyawan || !periode) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
        <p className="text-xs text-slate-500 mb-4">
          Data target karyawan atau periode tidak valid.
        </p>
        <button
          type="button"
          onClick={() => setActiveTabWithTransition("manager-penilaian")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Kembali ke Daftar Penilaian
        </button>
      </div>
    );
  }

  // Live Score Calculations
  const activeIndicators = indikatorList.filter((i) => i.status === "Aktif");
  const scoreLabels = [
    "",
    "Sangat Kurang (1)",
    "Kurang (2)",
    "Cukup (3)",
    "Baik (4)",
    "Sangat Baik (5)",
  ];

  const calculatedItems: PenilaianItem[] = activeIndicators.map((ind) => {
    const s = scores[ind.id] || 4;
    const calc = (s / 5) * ind.bobot;
    return {
      indikatorId: ind.id,
      indikatorNama: ind.nama,
      tipe: ind.tipe,
      bobot: ind.bobot,
      score: s,
      scoreLabel: scoreLabels[s] || "Baik (4)",
      calculatedScore: calc,
    };
  });

  const umumItems = calculatedItems.filter((i) => i.tipe === "KPI Umum");
  const pilarItems = calculatedItems.filter((i) => i.tipe === "KPI Pilar");

  const totalUmumBobot = umumItems.reduce((acc, it) => acc + it.bobot, 0);
  const sumUmumCalc = umumItems.reduce((acc, it) => acc + it.calculatedScore, 0);
  const nilaiKpiUmum =
    totalUmumBobot > 0 ? (sumUmumCalc / totalUmumBobot) * 100 : 0;

  const totalPilarBobot = pilarItems.reduce((acc, it) => acc + it.bobot, 0);
  const sumPilarCalc = pilarItems.reduce((acc, it) => acc + it.calculatedScore, 0);
  const nilaiKpiPilar =
    totalPilarBobot > 0 ? (sumPilarCalc / totalPilarBobot) * 100 : 0;

  const totalNilaiAkhir = calculatedItems.reduce(
    (acc, it) => acc + it.calculatedScore,
    0
  );
  const roundedNilaiAkhir = Math.round(totalNilaiAkhir * 10) / 10;
  const liveKategori = getKategoriByScore(roundedNilaiAkhir);
  const categoryBadgeClass = getScoreCategoryBadgeClass(liveKategori);

  const handleScoreChange = (indikatorId: string, scoreVal: number) => {
    setScores((prev) => ({
      ...prev,
      [indikatorId]: scoreVal,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPenilaian: PenilaianKinerja = {
      id: existingEval?.id || `eval-${Date.now()}`,
      karyawanId: karyawan.id,
      karyawanNama: karyawan.nama,
      karyawanNik: karyawan.nik,
      divisiNama: karyawan.divisiNama,
      jabatanNama: karyawan.jabatanNama,
      periodeId: periode.id,
      periodeNama: periode.namaPeriode,
      penilaiId: currentUser.karyawanId,
      penilaiNama: currentUser.karyawanNama,
      tanggalPenilaian: new Date().toISOString().split("T")[0],
      items: calculatedItems,
      nilaiKpiUmum: Math.round(nilaiKpiUmum * 10) / 10,
      nilaiKpiPilar: Math.round(nilaiKpiPilar * 10) / 10,
      nilaiAkhir: roundedNilaiAkhir,
      kategori: liveKategori,
      ringkasanPenilaian: `Hasil asesmen kinerja karyawan ${karyawan.nama} pada periode ${periode.quartalLabel} menghasilkan capaian skor akhir ${roundedNilaiAkhir}% (${liveKategori}).`,
      komentarAtasan:
        komentar.trim() ||
        "Karyawan telah menunjukkan pencapaian dan kinerja yang baik sepanjang periode evaluasi ini.",
      status: "Sudah Dinilai",
    };

    savePenilaian(newPenilaian);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // Fallback
    }

    setSuccessMsg("Penilaian kinerja berhasil disimpan!");
    setTimeout(() => {
      setActiveTabWithTransition("manager-penilaian");
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => setActiveTabWithTransition("manager-penilaian")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Tabel Penilaian
        </button>
      </div>

      {/* Profile & Target Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 overflow-hidden ring-2 ring-indigo-500/10 shrink-0">
            {karyawan.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={karyawan.avatar}
                alt={karyawan.nama}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-lg text-indigo-700">
                {karyawan.nama.slice(0, 1)}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-white">
                {karyawan.nik}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {karyawan.divisiNama}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              {karyawan.nama}
            </h2>
            <p className="text-xs text-slate-600">{karyawan.jabatanNama}</p>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-right self-end sm:self-auto">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Periode Penilaian
          </span>
          <span className="text-xs font-bold text-indigo-700">
            {periode.namaPeriode}
          </span>
          <span className="text-[11px] text-slate-500 block">
            {periode.quartalLabel}
          </span>
        </div>
      </div>

      {/* Live Calculated Score Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-indigo-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Live Preview Perhitungan Skor Akhir
          </span>
          <p className="text-xs text-slate-300 mt-1">
            Skor otomatis dikalkulasikan berdasarkan bobot resmi masing-masing
            indikator KPI.
          </p>
        </div>

        <div className="flex items-center gap-4 self-end sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Nilai Akhir
            </span>
            <div className="text-3xl font-black text-white">
              {roundedNilaiAkhir}
              <span className="text-xs text-indigo-300 font-normal">/100</span>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-white/20" />
          <div>
            <span
              className={`inline-block px-3 py-1.5 rounded-xl text-xs font-bold border ${categoryBadgeClass}`}
            >
              {liveKategori}
            </span>
          </div>
        </div>
      </div>

      {/* Form Input Nilai Indikator */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Indicators List */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Pengisian Skor Indikator KPI ({activeIndicators.length} Indikator)
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Skala: 1 (Sangat Kurang) s/d 5 (Sangat Baik)
            </span>
          </div>

          <div className="space-y-6">
            {activeIndicators.map((ind, idx) => {
              const currentVal = scores[ind.id] || 4;
              const calcScore = ((currentVal / 5) * ind.bobot).toFixed(1);

              return (
                <div
                  key={ind.id}
                  className="p-5 rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-xs transition bg-slate-50/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {ind.nama}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {ind.tipe}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Bobot: {ind.bobot}%
                      </span>
                      <span className="text-xs font-bold text-slate-800 ml-1">
                        Poin: {calcScore}%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 pl-8 leading-relaxed">
                    Target: {ind.targetKinerja}
                  </p>

                  {/* 5 Rating Buttons: Sangat Baik (5), Baik (4), Cukup (3), Kurang (2), Sangat Kurang (1) */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pl-0 sm:pl-8">
                    {[
                      {
                        val: 1,
                        label: "Sangat Kurang",
                        activeClass:
                          "bg-rose-50 border-rose-300 text-rose-700 ring-2 ring-rose-500/20",
                      },
                      {
                        val: 2,
                        label: "Kurang",
                        activeClass:
                          "bg-orange-50 border-orange-300 text-orange-700 ring-2 ring-orange-500/20",
                      },
                      {
                        val: 3,
                        label: "Cukup",
                        activeClass:
                          "bg-amber-50 border-amber-300 text-amber-700 ring-2 ring-amber-500/20",
                      },
                      {
                        val: 4,
                        label: "Baik",
                        activeClass:
                          "bg-blue-50 border-blue-300 text-blue-700 ring-2 ring-blue-500/20",
                      },
                      {
                        val: 5,
                        label: "Sangat Baik",
                        activeClass:
                          "bg-emerald-50 border-emerald-300 text-emerald-700 ring-2 ring-emerald-500/20",
                      },
                    ].map((opt) => {
                      const isSelected = currentVal === opt.val;

                      return (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => handleScoreChange(ind.id, opt.val)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition ${
                            isSelected
                              ? `${opt.activeClass} font-bold shadow-xs`
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <span className="text-sm font-black">{opt.val}</span>
                          <span className="text-[10px] text-center">
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Persyaratan: Catatan tambahan untuk manager memberikan pesan kepada si ternilai */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-slate-900">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Catatan Tambahan & Umpan Balik (Feedback) Atasan
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Berikan masukan, apresiasi, atau rekomendasi perbaikan untuk karyawan
            pada quartal ini. Pesan ini akan ditampilkan pada rincian evaluasi
            karyawan.
          </p>
          <textarea
            rows={4}
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
            placeholder="Tuliskan pesan apresiasi atas pencapaian atau saran peningkatan mutu kerja..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        {/* Buttons: Submit & Back */}
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTabWithTransition("manager-penilaian")}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Submit Penilaian Kinerja
          </button>
        </div>
      </form>
    </div>
  );
}
