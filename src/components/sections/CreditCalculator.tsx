"use client";

import { useState } from "react";

interface CreditCalculatorProps {
  carPrice: number;
}

export default function CreditCalculator({ carPrice }: CreditCalculatorProps) {
  // State input
  const [dpPercentage, setDpPercentage] = useState<number>(20); // Default DP 20%
  const [tenorYears, setTenorYears] = useState<number>(3); // Default 3 Tahun (36 Bulan)
  const interestRate = 0.06; // Bunga estimasi 6% per tahun

  // Kalkulasi
  const dpAmount = (carPrice * dpPercentage) / 100;
  const loanPrincipal = carPrice - dpAmount;
  const totalMonths = tenorYears * 12;
  const totalInterest = loanPrincipal * interestRate * tenorYears;
  const monthlyInstallment = Math.round((loanPrincipal + totalInterest) / totalMonths);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-neutral-900">Simulasi Kredit</h3>
      <p className="text-xs text-neutral-500 mt-1">Hitung estimasi angsuran bulanan sesuai perencanaan keuangan Anda.</p>

      <div className="mt-6 space-y-4">
        {/* Input Persentase DP */}
        <div>
          <div className="flex justify-between text-xs font-medium text-neutral-700 mb-1">
            <span>Uang Muka (DP): {dpPercentage}%</span>
            <span className="font-bold text-neutral-900">{formatRupiah(dpAmount)}</span>
          </div>
          <input
            type="range"
            min="10"
            max="50"
            step="5"
            value={dpPercentage}
            onChange={(e) => setDpPercentage(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
          />
        </div>

        {/* Pilihan Tenor */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-2">Jangka Waktu (Tenor)</label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4, 5].map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setTenorYears(year)}
                className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                  tenorYears === year
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                {year} Thn ({year * 12}x)
              </button>
            ))}
          </div>
        </div>

        {/* Hasil Estimasi */}
        <div className="mt-6 rounded-xl bg-neutral-50 p-4 border border-neutral-100 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-medium text-neutral-500">Estimasi Cicilan per Bulan</span>
          <span className="mt-1 text-2xl font-extrabold text-neutral-900">{formatRupiah(monthlyInstallment)}</span>
          <span className="mt-1 text-[10px] text-neutral-400">*Bunga estimasi flat {interestRate * 100}%/tahun. Belum termasuk asuransi.</span>
        </div>
      </div>
    </div>
  );
}