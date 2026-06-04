import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StyleDNA, OutfitRecommendation } from "../types";
import StyleDNAViewer from "./StyleDNAViewer";
import { TRANSLATIONS, Language } from "../lib/translations";
import { Bookmark, ClipboardList, Flame, Award, Trash2, X, Sparkles, FolderHeart } from "lucide-react";

interface MyPageProps {
  lang: Language;
  dna: StyleDNA | null;
  savedOutfits: OutfitRecommendation[];
  onRemoveOutfit: (id: string) => void;
  joinedChallengeTitles: string[];
}

export default function MyPage({ lang, dna, savedOutfits, onRemoveOutfit, joinedChallengeTitles }: MyPageProps) {
  const t = TRANSLATIONS[lang];
  const [selectedOutfitDetail, setSelectedOutfitDetail] = useState<OutfitRecommendation | null>(null);

  const getLocalizedChallengeTitle = (title: string) => {
    if (lang === "ko") {
      if (title.includes("Brutalist")) return "브루탈리스트 단선 모노크롬 챌린지";
      if (title.includes("Oversized Contrast")) return "오버사이즈 오버코트 극비율 대비 배색";
      if (title.includes("Urban Utility")) return "도심 속기능 유틸리티 스포티 하이브리드";
    }
    return title;
  };

  return (
    <div id="mypage-dashboard-container" className="space-y-12">
      
      {/* 1. STATE INDICATOR DOCK */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase block font-bold">{t.mypage_indicator_streak}</span>
            <span className="font-display text-2xl font-bold text-white">{t.mypage_streak_val}</span>
          </div>
          <div className="p-3 bg-orange-500/10 rounded-xl">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase block font-bold">{t.mypage_indicator_points}</span>
            <span className="font-display text-2xl font-bold text-white">1,500 XP</span>
          </div>
          <div className="p-3 bg-[#5B7FFF]/10 rounded-xl font-bold">
            <Award className="w-5 h-5 text-[#5B7FFF]" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase block font-bold">{t.mypage_indicator_designs}</span>
            <span className="font-display text-2xl font-bold text-white">
              {t.mypage_designs_val.replace("{count}", String(savedOutfits.length))}
            </span>
          </div>
          <div className="p-3 bg-red-500/10 rounded-xl">
            <FolderHeart className="w-5 h-5 text-red-400" />
          </div>
        </div>
      </section>

      {/* 2. Style DNA Dashboard */}
      <section className="space-y-4">
        <div className="pb-3 border-b border-white/5">
          <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">{t.mypage_dna_title}</h2>
        </div>

        {dna ? (
          <StyleDNAViewer lang={lang} dna={dna} />
        ) : (
          <div className="glass-panel p-10 rounded-3xl border border-white/5 text-center bg-white/[0.01]">
            <span className="text-gray-400 italic block text-xs leading-relaxed">{t.mypage_dna_empty}</span>
          </div>
        )}
      </section>

      {/* 3. Saved bespoke outfits & history */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Saved Bespoke Outfits list */}
        <section className="lg:col-span-2 space-y-4">
          <div className="pb-3 border-b border-white/5">
            <h3 className="text-lg md:text-xl font-display font-medium text-white">{t.mypage_saved_title}</h3>
          </div>

          {savedOutfits.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedOutfits.map((out) => (
                <div
                  key={out.id}
                  onClick={() => setSelectedOutfitDetail(out)}
                  className="glass-panel p-5 rounded-2.5xl border border-white/10 hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between group bg-white/[0.01]"
                >
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-start gap-1 pb-2 border-b border-white/5">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-[#5B7FFF] uppercase tracking-wider block">BESPOKE</span>
                        <h4 className="font-display font-semibold text-white text-xs mt-1 leading-normal group-hover:text-[#5B7FFF] transition-colors">{out.title}</h4>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-white bg-white/[0.03] px-2 py-1 rounded-lg">
                        {out.matchScore}%
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                      {out.description}
                    </p>

                    <div className="flex gap-2">
                      <span className="text-[9px] bg-white/[0.02] border border-white/5 text-gray-400 px-2 py-0.5 rounded-md">🌤 {out.weather}</span>
                      <span className="text-[9px] bg-white/[0.02] border border-white/5 text-gray-400 px-2 py-0.5 rounded-md">🔑 {out.situation.split(" ")[0]}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/5 text-[9px] font-mono">
                    <span className="text-gray-500">Includes {out.items.length} garments</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveOutfit(out.id);
                      }}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-3xl border border-white/5 text-center bg-white/[0.01]">
              <span className="text-xs text-gray-500 italic leading-relaxed">{t.mypage_saved_empty}</span>
            </div>
          )}
        </section>

        {/* Challenge activity stats right sidebar */}
        <section className="col-span-1 space-y-6">
          {/* Active Challenges */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4 bg-white/[0.01]">
            <h4 className="font-display font-semibold text-sm text-white">{t.mypage_joined_contests}</h4>
            
            {joinedChallengeTitles.length > 0 ? (
              <div className="space-y-2.5">
                {joinedChallengeTitles.map((title, idx) => (
                  <div key={idx} className="bg-[#5B7FFF]/5 border border-[#5B7FFF]/10 p-3.5 rounded-xl flex items-center justify-between">
                    <div className="min-w-0 flex-1 pr-2">
                      <span className="font-display text-white text-xs font-semibold block leading-tight truncate">{getLocalizedChallengeTitle(title)}</span>
                      <span className="text-[9px] text-[#5B7FFF] font-mono mt-0.5 block">STATUS: IN_COMPILATION</span>
                    </div>
                    <span className="text-[10px] bg-[#5B7FFF]/10 px-2 py-1 rounded-md text-[#5B7FFF] font-mono uppercase font-bold shrink-0">{t.community_status_joined}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-[11px] text-gray-500 italic block leading-relaxed">{t.mypage_joined_empty}</span>
            )}
          </div>

          {/* Atomic order tracking mock */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4 bg-white/[0.01]">
            <h4 className="font-display font-semibold text-sm text-white">{t.mypage_orders_queue}</h4>
            <div className="space-y-2.5 font-mono text-[10px]">
              <div className="p-3.5 bg-white/[0.01] rounded-2xl border border-white/5 flex justify-between items-center">
                <div>
                  <span className="text-white font-bold block uppercase pb-1 border-b border-white/5 truncate max-w-[140px]">{lang === "ko" ? "퓨어 울 더블 오버사이즈 블레이저" : "OVS Double-Breasted Blazer"}</span>
                  <span className="text-gray-500 mt-1 block">SIZE: M • STATUS: PACKING</span>
                </div>
                <span className="text-[#5B7FFF] font-bold shrink-0">{t.mypage_order_active}</span>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Outfit focus details lookbook popup modal */}
      <AnimatePresence>
        {selectedOutfitDetail && (
          <motion.div
            key="lookbook-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOutfitDetail(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              key="lookbook-modal-panel"
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               onClick={(e) => e.stopPropagation()}
               className="w-full max-w-2xl bg-neutral-950 border border-white/10 rounded-4xl p-6 md:p-8 space-y-6 relative overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedOutfitDetail(null)}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="border-b border-white/5 pb-4">
                <span className="text-[9px] font-mono tracking-widest text-[#5B7FFF] font-bold block uppercase">SAVED BESPOKE ARCHIVE</span>
                <h3 className="font-display font-bold text-white text-xl md:text-2xl mt-1">{selectedOutfitDetail.title}</h3>
              </div>

              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                {selectedOutfitDetail.description}
              </p>

              {/* Items strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedOutfitDetail.items.map((it, idx) => (
                  <div key={idx} className="flex gap-3 bg-white/[0.01] border border-white/5 p-3 rounded-2xl items-center">
                    <img src={it.image} alt="It" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <span className="font-mono text-[9px] text-gray-500 font-bold block uppercase">{it.brand}</span>
                      <span className="font-display text-white text-xs font-semibold block leading-tight truncate max-w-[120px]">{it.name}</span>
                      <span className="font-mono text-[9px] text-gray-400 mt-0.5 block">${it.price} • {it.color}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5">
                <span className="font-mono text-[10px] text-[#5B7FFF] font-semibold uppercase tracking-wider block mb-2">COORD LOOK DIRECTIVE</span>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">{selectedOutfitDetail.styleTip}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
