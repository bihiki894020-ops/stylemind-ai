import React from "react";
import { motion } from "motion/react";
import { StyleDNA } from "../types";
import { TRANSLATIONS, Language } from "../lib/translations";
import { Sparkles, Award, Tag, ScanFace, Check, Flame, Pocket, Scale } from "lucide-react";

interface StyleDNAViewerProps {
  lang: Language;
  dna: StyleDNA;
}

export default function StyleDNAViewer({ lang, dna }: StyleDNAViewerProps) {
  const t = TRANSLATIONS[lang];

  // Helpers to render circular parameters
  const renderCircleScore = (label: string, score: number) => {
    const radius = 34;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="flex flex-col items-center bg-white/[0.01] p-4 rounded-3xl border border-white/5 shadow-inner">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="rgba(255, 255, 255, 0.02)"
              strokeWidth="4"
              fill="transparent"
            />
            {/* Foreground progress indicator */}
            <motion.circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#5B7FFF"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-base font-bold text-white">{score}%</span>
          </div>
        </div>
        <span className="font-display text-[10px] uppercase tracking-widest text-gray-500 mt-3.5 font-bold">
          {label}
        </span>
      </div>
    );
  };

  // Safe localized colors helper
  const getLocalizedColorName = (colName: string) => {
    if (lang === "ko") {
      if (colName.includes("Warm Off-White")) return "따뜻한 오프화이트";
      if (colName.includes("Ink Black")) return "치밀한 잉크 블랙";
      if (colName.includes("Accent Indigo")) return "액센트 인디고 블루";
      if (colName.includes("Obsidian")) return "흑요석 딥 블랙";
      if (colName.includes("Slate Gray")) return "슬레이트 매트 그레이";
    }
    return colName;
  };

  return (
    <motion.div
      id="styledna-viewer-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Editorial Title Banner */}
      <div className="relative overflow-hidden rounded-4xl bg-neutral-950 border border-white/5 p-8 md:p-10">
        {/* Animated glowing violet backdrop blob */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-accent-blue/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-[#5B7FFF] font-mono text-[10px] tracking-widest font-bold uppercase">
              <Award className="w-4 h-4 animate-pulse shrink-0" />
              {t.dna_unlocked}
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight">
              {dna.profileName}
            </h1>
            <p className="text-gray-300 text-sm max-w-xl leading-relaxed">
              &ldquo;{dna.vibe}&rdquo;
            </p>
          </div>

          <div className="col-span-1 flex flex-col items-center md:items-end justify-center">
            <span className="text-gray-500 font-mono text-[9px] tracking-widest uppercase mb-1">{t.dna_styling_index}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-6.5xl font-display font-black text-white">{dna.overallScore}</span>
              <span className="text-gray-500 text-xs font-mono font-bold">/ 100</span>
            </div>
            <span className="text-[10px] text-white bg-[#5B7FFF] px-3.5 py-1.5 rounded-full uppercase font-mono tracking-wider mt-3 font-semibold shadow-lg shadow-[#5B7FFF]/15">
              {t.dna_tastemaker}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-4">
        {/* DNA Scores Panel */}
        <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-4xl border border-white/5 space-y-8 bg-white/[0.01]">
          <div>
            <h3 className="font-display font-bold text-lg text-white">{t.dna_dimensions}</h3>
            <p className="text-xs text-gray-500">{t.dna_dimensions_desc}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {renderCircleScore(t.dna_dim_versatility, dna.score.versatility)}
            {renderCircleScore(t.dna_dim_uniqueness, dna.score.uniqueness)}
            {renderCircleScore(t.dna_dim_cohesiveness, dna.score.cohesiveness)}
            {renderCircleScore(t.dna_dim_trend, dna.score.trendFactor)}
          </div>

          {/* Facial structure metrics dashboard row as requested */}
          <div className="pt-6 border-t border-white/5 space-y-4">
            <div className="flex items-center gap-2">
              <ScanFace className="w-4 h-4 text-[#5B7FFF]" />
              <h4 className="font-display font-bold text-sm text-white">{t.facial_diag_title}</h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-neutral-900 border border-white/5 p-3.5 rounded-2xl">
                <span className="text-[9px] text-gray-500 font-mono block font-bold leading-tight truncate">{t.facial_metric_ovalness}</span>
                <span className="text-lg font-mono font-bold text-white block mt-1">94.2%</span>
                <span className="text-[8px] text-green-400 font-mono mt-0.5 block">Perfect Symmetry</span>
              </div>
              <div className="bg-neutral-900 border border-white/5 p-3.5 rounded-2xl">
                <span className="text-[9px] text-gray-500 font-mono block font-bold leading-tight truncate">{t.facial_metric_jawline}</span>
                <span className="text-lg font-mono font-bold text-white block mt-1">1:1.32</span>
                <span className="text-[8px] text-gray-500 font-mono mt-0.5 block">Sharp Angle Contour</span>
              </div>
              <div className="bg-neutral-900 border border-white/5 p-3.5 rounded-2xl">
                <span className="text-[9px] text-gray-500 font-mono block font-bold leading-tight truncate">{t.facial_metric_cheekbone}</span>
                <span className="text-lg font-mono font-bold text-white block mt-1">88.5%</span>
                <span className="text-[8px] text-[#5B7FFF] font-mono mt-0.5 block">High Cheek Contour</span>
              </div>
              <div className="bg-neutral-900 border border-white/5 p-3.5 rounded-2xl">
                <span className="text-[9px] text-gray-500 font-mono block font-bold leading-tight truncate">{t.facial_metric_contrast}</span>
                <span className="text-lg font-mono font-bold text-white block mt-1">Symmetrical</span>
                <span className="text-[8px] text-gray-400 font-mono mt-0.5 block">Classic Contrast</span>
              </div>
            </div>
          </div>

          {/* Guidelines info */}
          <div className="pt-6 border-t border-white/5 bg-white/[0.01] -mx-6 -mb-6 md:-mx-8 md:-mb-8 p-6 rounded-b-4xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#5B7FFF]/10 rounded-2xl border border-[#5B7FFF]/10 shrink-0 mt-1">
                <Sparkles className="w-5 h-5 text-[#5B7FFF]" />
              </div>
              <div>
                <span className="font-mono text-[9px] tracking-widest text-[#5B7FFF] font-bold uppercase block mb-1">{t.dna_director_comment}</span>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  {dna.styleCoachTip}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Styling DNA Proportions Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Colors Card */}
          <div className="glass-panel p-6 rounded-4xl border border-white/5 space-y-4 bg-white/[0.01]">
            <div>
              <h4 className="font-display font-bold text-sm text-white">{t.dna_hue_scale}</h4>
              <p className="text-[10px] text-gray-500">{t.dna_hue_desc}</p>
            </div>

            <div className="space-y-3 pt-1">
              {dna.colors.map((color, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/[0.01] p-3 rounded-2xl border border-white/5">
                  <div
                    className="w-10 h-10 rounded-xl shadow-inner shrink-0 border border-white/10"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-white block truncate">{getLocalizedColorName(color.name)}</span>
                    <span className="font-mono text-[9px] text-gray-500 mt-0.5 block">{color.hex}</span>
                  </div>
                  <span className="font-mono text-xs text-white font-semibold">{color.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Garments & Fit Profile */}
          <div className="glass-panel p-6 rounded-4xl border border-white/5 space-y-4 bg-white/[0.01]">
            <div>
              <h4 className="font-display font-bold text-sm text-white">{t.dna_garments}</h4>
              <p className="text-[10px] text-gray-500">{t.dna_garments_desc}</p>
            </div>

            <div className="space-y-4 pt-1">
              {/* Fits */}
              <div className="space-y-2.5">
                <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest block font-bold">{t.dna_fit_ratio}</span>
                <div className="flex flex-wrap gap-1.5">
                  {dna.preferredFit.map((fit, idx) => (
                    <span key={idx} className="text-[11px] bg-white/[0.02] text-gray-200 border border-white/5 px-3 py-1.5 rounded-xl font-semibold">
                      {lang === "ko" && fit.includes("Fluid") ? "플루이드 루즈핏" : lang === "ko" && fit.includes("Structured") ? "구조적 박시핏" : lang === "ko" && fit.includes("Clean") ? "스트레이트핏" : fit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2.5 pt-1.5">
                <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest block font-bold">{t.dna_clothing_sector}</span>
                <div className="flex flex-wrap gap-1.5">
                  {dna.preferredCategories.map((cat, idx) => (
                    <span key={idx} className="text-[11px] bg-[#5B7FFF]/5 text-[#5B7FFF] border border-[#5B7FFF]/10 px-3 py-1.5 rounded-xl font-mono font-bold flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 shrink-0" />
                      {lang === "ko" && cat.includes("Knitwear") ? "프리미엄 니트웨어" : lang === "ko" && cat.includes("Trousers") ? "핀턱 트라우저" : lang === "ko" && cat.includes("Blazers") ? "미니멀 블레이저" : cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
