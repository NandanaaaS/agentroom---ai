"use client";

import { useEffect, useState } from "react";

const BADGE_COLORS = [
  "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30",
  "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30",
  "from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30",
  "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
];

const BADGE_COLORS_LIGHT = [
  "from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200",
  "from-blue-50 to-cyan-50 text-blue-700 border-blue-200",
  "from-violet-50 to-purple-50 text-violet-700 border-violet-200",
  "from-rose-50 to-pink-50 text-rose-700 border-rose-200",
  "from-amber-50 to-orange-50 text-amber-700 border-amber-200",
];

interface FactSheetProps {
  data?: {
    product_name: string;
    features: string[];
    price: string;
    target_audience: string;
  };
  loading: boolean;
}

function SkeletonPulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-800/60 dark:bg-gray-800/60 ${className}`} />;
}

export default function FactSheetSection({ data, loading }: FactSheetProps) {
  const [isDark, setIsDark] = useState(false);

 useEffect(() => {
  if (typeof window !== "undefined") {
    setIsDark(document.documentElement.classList.contains("dark"));
  }
}, []);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div>
          <SkeletonPulse className="h-8 w-48 mb-2" />
          <SkeletonPulse className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0,1,2].map(i => <SkeletonPulse key={i} className="h-28 w-full" />)}
        </div>
        <SkeletonPulse className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold dark:text-white text-slate-900 tracking-tight">
          {data.product_name}
        </h2>
        <p className="text-sm dark:text-gray-500 text-slate-400 mt-1 tracking-wide uppercase font-medium">
          Product Fact Sheet
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="group relative rounded-2xl dark:bg-gray-900 bg-white border dark:border-gray-800 border-slate-200 p-5">
          <p className="text-[11px] uppercase tracking-[0.15em] font-semibold mb-3 dark:text-gray-400 text-gray-500">
            Price
          </p>
          <p className="text-3xl font-bold text-amber-500">
            {data.price || "N/A"}
          </p>
        </div>

        <div className="group relative rounded-2xl dark:bg-gray-900 bg-white border dark:border-gray-800 border-slate-200 p-5">
          <p className="text-[11px] uppercase tracking-[0.15em] font-semibold mb-3 dark:text-gray-400 text-gray-500">
            Target Audience
          </p>
          <p className="text-base font-semibold text-blue-500 capitalize">
            {data.target_audience}
          </p>
        </div>

        <div className="group relative rounded-2xl dark:bg-gray-900 bg-white border dark:border-gray-800 border-slate-200 p-5">
          <p className="text-[11px] uppercase tracking-[0.15em] font-semibold mb-3 text-gray-500 dark:text-gray-400">
            Key Features
          </p>
          <p className="text-3xl font-bold text-emerald-500">
            {data.features.length}
          </p>
        </div>
      </div>

      <div className="rounded-2xl dark:bg-gray-900 bg-white border dark:border-gray-800 border-slate-200 p-6">
        <p className="text-[11px] uppercase tracking-[0.15em] font-semibold mb-5 dark:text-gray-400 text-gray-500">
          Feature Highlights
        </p>
        <div className="flex flex-wrap gap-3">
          {data.features.map((feature, i) => (
            <span
              key={i}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
                isDark
                  ? BADGE_COLORS[i % BADGE_COLORS.length]
                  : BADGE_COLORS_LIGHT[i % BADGE_COLORS_LIGHT.length]
              }`}
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}