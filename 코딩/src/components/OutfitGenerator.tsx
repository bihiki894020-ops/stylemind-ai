import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StyleDNA, OutfitRecommendation } from "../types";
import { TRANSLATIONS, Language } from "../lib/translations";
import { CloudRain, Sun, Snowflake, Wind, Sparkles, ShoppingBag, Plus, BookmarkCheck, RefreshCcw, Landmark, Compass, Flame, ShieldAlert, Cpu, HeartHandshake, Eye } from "lucide-react";

interface OutfitGeneratorProps {
  lang: Language;
  dna: StyleDNA | null;
  onSaveOutfit: (outfit: OutfitRecommendation) => void;
  savedOutfitIds: string[];
}

const SITUATIONS = [
  {
    id: "rave",
    label: "Midnight Underground Technoparty (All Obsidian Leather)",
    labelKo: "지하 인더스트리얼 레이브 파티 (시커먼 올블랙 가죽 / 테크 시크)",
    vibeNote: "Rebel avant-garde streetwear featuring asymmetric leather and chrome metal detailing.",
    vibeNoteKo: "비대칭 오버 실루엣과 볼드 메탈 라인에 락시크 하이 바이브를 결합하여 압도적인 어둠 속 존재감을 발산합니다."
  },
  {
    id: "coffee",
    label: "Quiet Luxury Gallery Coffee Meet (Fine Art & Cashmere)",
    labelKo: "미니멀 갤러리 카페 미팅 (고급 캐시미어 에센셜 / 정갈한 핀턱 선)",
    vibeNote: "Graceful tailored minimalism prioritizing fine materials, clean shoulders, and soft neutral drapes.",
    vibeNoteKo: "정제된 실루엣과 고급 천연 섬유가 주는 은은한 윤기로 차분하면서도 지적인 기품을 자연스럽게 전달합니다."
  },
  {
    id: "gallery",
    label: "Avant-Garde Exhibition Launch (Sartorial Asymmetries)",
    labelKo: "아방가르드 미술전 오픈 프리뷰 (비대칭 실루엣 재킷 / 주름 포인트)",
    vibeNote: "Sculptural draping and high contrast structures that balance creative curiosity with premium tailorings.",
    vibeNoteKo: "패턴 해체와 사선 트임, 구조화된 주름 포인트를 통해 평범함을 거부하는 아티스틱 패션 디렉터 분위기를 표현합니다."
  },
  {
    id: "streetwear",
    label: "Cyberpunk Rain-Slicked Highstreet Outing (Nylon Parachutes)",
    labelKo: "빗속 밤거리 사이버펑크 젠지 스트릿 (리플렉티브 쉘 / 와이드 파라슈트 팬츠)",
    vibeNote: "Tech-wear utility focused on water-repellent hard shells, drawstring parachute cords, and tech sneakers.",
    vibeNoteKo: "고기능성 코팅 고프코어 쉘과 리플렉티브 디테일, 끈조절 셔링을 극대화하여 트렌디한 거리의 전사 포스를 뽐냅니다."
  },
  {
    id: "vintage",
    label: "Sartorial Retro Record LP Shop Digging (Washed Aviator)",
    labelKo: "사토리아 올드스쿨 LP 레코드 숍 디깅 (에이징된 가죽 봄버 / 생지 데님)",
    vibeNote: "Aged vintage textures, heavy selvedge rigid denim, and premium washed flight bombers.",
    vibeNoteKo: "단단하게 길들여지지 않은 생지 카고 데님과 세월이 묻은 크랙 가죽 봄버로 아날로그한 깊이를 연출합니다."
  }
];

const WEATHER_TEMPLATES = [
  {
    id: "hot_humid",
    label: "Sultry Summer Humidity (28°C+)",
    labelKo: "무덥고 다습한 한여름 기온 (28°C+)",
    icon: Sun,
    thermalIndex: "12% (Aeration Focus)",
    thermalIndexKo: "12% (극대화된 수분 배출)",
    fabricRecommendation: "Pure Linen, Breathable Slit Knit, Open Weave Cotton",
    fabricRecommendationKo: "천연 린넨, 슬릿 통풍 드라이 피트, 오픈 위브 하프 니트웨어",
    protectionLevel: "Reflective UV Block & Breathability Guard",
    protectionLevelKo: "자외선 극대방어 및 습기 배출 특화",
    colorSpectrum: "Creamy Alabaster, Bone White, Soft Indigo Bleach",
    colorSpectrumKo: "크리미 알라바스터, 본 화이트, 청량 블루 익스클루시브"
  },
  {
    id: "brisk_wind",
    label: "Brisk Autumn Whisper (11°C)",
    labelKo: "선선히 부는 가을 벌판 칼바람 (11°C)",
    icon: Wind,
    thermalIndex: "68% (Modular Insulation)",
    thermalIndexKo: "68% (체온 홀딩 패브릭 레이어)",
    fabricRecommendation: "Carded Wool, High-density Cashmere, Heavyweight Sweatshirts",
    fabricRecommendationKo: "울 블렌드 카디건, 두툼한 파인 캐시미어, 중량감 있는 프렌치테리 코튼",
    protectionLevel: "Windbreaker Shielding & Collar Seal",
    protectionLevelKo: "일교차 극복형 아우터 하모니",
    colorSpectrum: "Espresso, Warm Charcoal, Sand Ecru, Muted Sage",
    colorSpectrumKo: "에스프레소, 무드 딥 챠콜, 샌드 에크루, 차분한 세이지"
  },
  {
    id: "rainy_monsoon",
    label: "Monsoon Rain & Humid Chill (17°C)",
    labelKo: "추적추적 비 내리는 장마철 무드 (17°C)",
    icon: CloudRain,
    thermalIndex: "45% (Hydrophobic Barrier)",
    thermalIndexKo: "45% (방수막 가동 및 건조 특화)",
    fabricRecommendation: "Waxed Canvas, 3-Layer Tech Nylon Ripstop, Liquid Shell Fabric",
    fabricRecommendationKo: "라미네이트 왁스 스킨, 고밀도 테크 립스톱 나일론, 방오 처리된 발수 원단",
    protectionLevel: "Waterproof Grade 4 & Seam Sealed Pockets",
    protectionLevelKo: "방수 지표 등급 4 및 심실링 테이핑 프로텍트",
    colorSpectrum: "Cyber Obsidian Black, Dark Asphalt Gray, Metallic Chrome",
    colorSpectrumKo: "옵시디언 블랙, 비안개 자욱한 헤이즈 차콜, 머큐리 스틸"
  },
  {
    id: "snowy_winter",
    label: "Sub-Zero Snowy Winter Wind (-4°C)",
    labelKo: "눈 내리고 살얼음 깔린 영하의 혹한 (-4°C)",
    icon: Snowflake,
    thermalIndex: "98% (Absolute Thermal Cover)",
    thermalIndexKo: "98% (극강 인슐레이션 쉴드)",
    fabricRecommendation: "Double-face heavy wool, Premium goose down, Brushed angora blend",
    fabricRecommendationKo: "더블페이스 퓨어 로 울, 프리미엄 구스다운, 브러쉬드 고밀도 앙고라 울",
    protectionLevel: "Sub-zero Wind Defending Soft Shell Layer",
    protectionLevelKo: "영하 기단 격파 및 목/어깨 부위 옴팩트 방탄보온",
    colorSpectrum: "Midnight Charcoal, Matte Black Solid, Rich Camel, Deep Wine",
    colorSpectrumKo: "미드나잇 솔리드 블랙, 로얄 헤비 카멜 브라운, 버건디 와인"
  }
];

export default function OutfitGenerator({ lang, dna, onSaveOutfit, savedOutfitIds }: OutfitGeneratorProps) {
  const t = TRANSLATIONS[lang];
  const [selectedSituationId, setSelectedSituationId] = useState("coffee");
  const [selectedWeatherId, setSelectedWeatherId] = useState("brisk_wind");
  const [outfit, setOutfit] = useState<OutfitRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const activeSituation = SITUATIONS.find((s) => s.id === selectedSituationId) || SITUATIONS[1];
  const activeWeather = WEATHER_TEMPLATES.find((w) => w.id === selectedWeatherId) || WEATHER_TEMPLATES[1];

  const fetchLayoutRecommendation = async () => {
    setLoading(true);
    setSaveSuccess(null);

    const situationText = lang === "ko" ? activeSituation.labelKo : activeSituation.label;
    const weatherText = lang === "ko" ? activeWeather.labelKo : activeWeather.label;

    try {
      const response = await fetch("/api/style/outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: situationText,
          weather: weatherText,
          dna: dna,
          lang: lang
        })
      });

      if (!response.ok) {
        throw new Error("Failed to receive lookbook suggestions.");
      }

      const data = await response.json();
      if (data.outfit) {
        data.outfit.id = `outfit_${Date.now()}`;
        setOutfit(data.outfit);
      }
    } catch (err) {
      console.log("Outfit generation state sync completed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (item: OutfitRecommendation) => {
    onSaveOutfit(item);
    setSaveSuccess(item.id);
    setTimeout(() => {
      setSaveSuccess(null);
    }, 2500);
  };

  return (
    <div id="outfit-generator-container" className="max-w-6xl mx-auto py-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Parameters Selectors Left */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 border border-white/10 space-y-6 bg-white/[0.01]">
            <div>
              <div className="flex items-center gap-2 text-[#5B7FFF] mb-1.5">
                <Cpu className="w-4 h-4" />
                <span className="font-mono text-[9px] tracking-[0.2em] font-extrabold uppercase">COGNITIVE ENGINE</span>
              </div>
              <h3 className="font-display font-black text-2xl text-white tracking-tight">{t.outfit_gen_title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">{t.outfit_gen_desc}</p>
            </div>

            {/* Situation Select */}
            <div className="space-y-3.5">
              <span className="font-mono text-[10px] tracking-widest text-pink-400 font-extrabold block uppercase">1. {t.outfit_situ}</span>
              <div className="space-y-1.5">
                {SITUATIONS.map((sit) => {
                  const isSelected = selectedSituationId === sit.id;
                  return (
                    <button
                      key={sit.id}
                      onClick={() => setSelectedSituationId(sit.id)}
                      className={`w-full text-left px-4 py-3 rounded-2xl border text-xs font-semibold transition-all duration-300 cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "border-[#5B7FFF] bg-[#5B7FFF]/10 text-white shadow-lg shadow-[#5B7FFF]/5"
                          : "border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/15 hover:bg-white/[0.03]"
                      }`}
                    >
                      <span className="truncate pr-2 font-display">
                        {lang === "ko" ? sit.labelKo.split(" (")[0] : sit.label.split(" (")[0]}
                      </span>
                      {isSelected ? (
                        <div className="w-2 h-2 bg-[#5B7FFF] rounded-full shrink-0 animate-ping" />
                      ) : (
                        <div className="w-1.5 h-1.5 bg-neutral-800 rounded-full shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weather Selection */}
            <div className="space-y-3.5">
              <span className="font-mono text-[10px] tracking-widest text-[#5B7FFF] font-extrabold block uppercase">2. {t.outfit_weather}</span>
              <div className="grid grid-cols-2 gap-2">
                {WEATHER_TEMPLATES.map((w) => {
                  const IconComp = w.icon;
                  const isSelected = selectedWeatherId === w.id;
                  return (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWeatherId(w.id)}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2.5 text-center transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "border-pink-500 bg-pink-500/10 text-white shadow-lg shadow-pink-500/5"
                          : "border-white/5 bg-white/[0.01] text-gray-500 hover:border-white/15"
                      }`}
                    >
                      <IconComp className={`w-5 h-5 ${isSelected ? "text-pink-400 animate-pulse" : "text-gray-500 group-hover:text-white"}`} />
                      <span className="text-[9px] font-bold leading-tight block truncate w-full font-mono">
                        {lang === "ko" ? w.labelKo.split(" (")[0] : w.label.split(" (")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Run Generator CTA */}
            <button
              id="generate-lookbook-btn"
              onClick={fetchLayoutRecommendation}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#5B7FFF] via-purple-500 to-pink-500 hover:opacity-90 text-white font-display text-xs font-black tracking-widest uppercase py-4 rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-[#5B7FFF]/10 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin" />
                  {t.outfit_btn_generating}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {t.outfit_btn_generate}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Realtime Outfit Output Right */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-outfit-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-panel p-12 rounded-4xl border border-white/10 flex flex-col items-center justify-center text-center min-h-[500px] bg-white/[0.01]"
              >
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#5B7FFF]/20 border-t-[#5B7FFF] animate-spin" />
                  <div className="absolute inset-3 bg-[#5B7FFF]/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#5B7FFF]" />
                  </div>
                </div>
                <h4 className="font-display font-bold text-xl text-white mb-2">{t.outfit_simulating}</h4>
                <p className="text-xs text-gray-400 max-w-sm leading-relaxed font-sans">
                  {t.outfit_sim_desc}
                </p>
                {/* Visual live scan ticks */}
                <div className="mt-8 flex gap-2 font-mono text-[9px] text-gray-600">
                  <span className="animate-pulse">STYLING SECTORS OK</span>
                  <span>|</span>
                  <span className="animate-pulse delay-75">WEATHER CALIBRATION ACTIVE</span>
                  <span>|</span>
                  <span className="animate-pulse delay-150">AFFILIATE MAPPING DONE</span>
                </div>
              </motion.div>
            ) : outfit ? (
              <motion.div
                key={outfit.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Lookbook main header card */}
                <div className="relative overflow-hidden rounded-3xl bg-[#09090E] border border-white/10 p-8 shadow-2xl relative">
                  {/* Neon light stripe corner */}
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#5B7FFF] to-pink-500" />
                  <div className="absolute right-0 bottom-0 w-80 h-80 bg-gradient-to-t from-[#5B7FFF]/5 to-pink-500/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-5 mb-5 relative pl-2">
                    <div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-[9px] font-mono font-black text-[#5B7FFF] tracking-widest uppercase bg-[#5B7FFF]/10 px-3.5 py-1.5 rounded-full border border-[#5B7FFF]/10 inline-block">
                          {t.outfit_matching_lookbook}
                        </span>
                        <span className="text-[9px] font-mono font-black text-pink-400 tracking-widest uppercase bg-pink-400/10 px-3.5 py-1.5 rounded-full border border-pink-400/10 inline-block">
                          GEN-Z PREMIUM SPEC
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3.5xl font-display font-black text-white tracking-tight mt-3">{outfit.title}</h2>
                    </div>

                    <div className="flex items-baseline gap-2 bg-white/[0.02] border border-white/10 px-4 py-2.5 rounded-2xl shrink-0">
                      <span className="text-[9px] text-gray-500 font-mono font-bold uppercase">{t.outfit_style_alignment}:</span>
                      <span className="text-xl font-mono font-black text-pink-500">{outfit.matchScore}%</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed font-sans relative pl-2">
                    {outfit.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2 pl-2">
                    <span className="text-[10px] bg-white/[0.02] border border-white/5 text-gray-300 font-semibold px-3.5 py-1.5 rounded-xl font-mono">
                      🕹 MOOD: {lang === "ko" ? activeSituation.labelKo : activeSituation.label}
                    </span>
                    <span className="text-[10px] bg-white/[0.02] border border-white/5 text-pink-400 font-semibold px-3.5 py-1.5 rounded-xl font-mono">
                      🌤 CLIMATE: {lang === "ko" ? activeWeather.labelKo : activeWeather.label}
                    </span>
                  </div>
                </div>

                {/* ADVANCED HARMONY PRESCRIPTION PANEL (WEATHER-SPECIFIC STYLING MATRIX) */}
                <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#151522]/40 to-black/20 p-6 space-y-5 shadow-xl relative overflow-hidden font-sans">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#5B7FFF]/10 blur-xl rounded-full" />
                  
                  <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                    <div className="p-2 bg-pink-500/10 rounded-lg border border-pink-500/20">
                      <Eye className="w-4 h-4 text-pink-400" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-white uppercase tracking-tight">Atelier Weather & Mood Harmony Assessment</h4>
                      <p className="text-[10px] text-gray-400 font-mono">기상 변화와 감각 무드 조합에 특화된 실시간 패션 처방적 분석 요강</p>
                    </div>
                  </div>

                  {/* Matrix Attributes Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1 text-xs">
                    
                    <div className="bg-white/[0.01] p-3.5 rounded-2xl border border-white/5">
                      <span className="text-[9px] font-mono text-gray-500 uppercase font-black block mb-1">Thermal Cover Index</span>
                      <span className="text-white font-bold block text-sm">{lang === "ko" ? activeWeather.thermalIndexKo : activeWeather.thermalIndex}</span>
                      <span className="text-[8px] text-gray-400 block mt-0.5 leading-tight">체온 보호 및 투습력 통합계수</span>
                    </div>

                    <div className="bg-white/[0.01] p-3.5 rounded-2xl border border-white/5">
                      <span className="text-[9px] font-mono text-gray-500 uppercase font-black block mb-1">Atmospheric Protection</span>
                      <span className="text-white font-bold block text-sm">{lang === "ko" ? activeWeather.protectionLevelKo : activeWeather.protectionLevel}</span>
                      <span className="text-[8px] text-gray-400 block mt-0.5 leading-tight">대기 오염 및 우천 자외선 대비책</span>
                    </div>

                    <div className="bg-white/[0.01] p-3.5 rounded-2xl border border-white/5">
                      <span className="text-[9px] font-mono text-gray-500 uppercase font-black block mb-1">Recommended Fabrics</span>
                      <span className="text-[10px] text-gray-300 font-medium block leading-snug">{lang === "ko" ? activeWeather.fabricRecommendationKo : activeWeather.fabricRecommendation}</span>
                    </div>

                    <div className="bg-white/[0.01] p-3.5 rounded-2xl border border-white/5">
                      <span className="text-[9px] font-mono text-gray-500 uppercase font-black block mb-1">Spectrum Chemistry</span>
                      <span className="text-pink-400 font-bold block text-[10px] leading-snug">{lang === "ko" ? activeWeather.colorSpectrumKo : activeWeather.colorSpectrum}</span>
                      <span className="text-[8px] text-gray-500 block mt-0.5">날씨 조화를 위한 추천 팔레트</span>
                    </div>

                  </div>

                  {/* Creative Director's Narrative */}
                  <div className="p-4 rounded-2xl bg-neutral-900 border border-white/5 space-y-1">
                    <span className="text-[8px] font-mono text-pink-400 uppercase font-black tracking-widest block">CREATIVE DIRECTOR'S CHIC FORMULA</span>
                    <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                      {lang === "ko" ? activeSituation.vibeNoteKo : activeSituation.vibeNote}
                    </p>
                  </div>
                </div>

                {/* Outfit Items layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {outfit.items.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="glass-panel rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between hover:border-white/15 hover:-translate-y-0.5 transition-all duration-300 bg-white/[0.01]">
                      
                      <div className="relative h-56 overflow-hidden bg-neutral-900 group">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105" referrerPolicy="no-referrer" />
                        <div className="absolute top-3 right-3 bg-neutral-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#5B7FFF]/10 font-mono text-[9px] font-bold text-[#5B7FFF] uppercase">
                          MATCH RATE: {item.matchPercentage || 92}%
                        </div>
                      </div>

                      <div className="p-5 space-y-3 font-sans">
                        <div className="flex justify-between items-baseline gap-1.5">
                          <span className="text-[8px] font-mono text-[#5B7FFF] font-black uppercase tracking-wider">{item.brand}</span>
                          <span className="text-[8px] font-mono bg-white/[0.04] border border-white/5 text-gray-400 px-2.5 py-0.5 rounded-md uppercase font-bold">
                            {lang === "ko" && item.category.toLowerCase().includes("knit") ? "니트웨어" : lang === "ko" && item.category.toLowerCase().includes("pants") ? "의복팬츠" : lang === "ko" && item.category.toLowerCase().includes("blazer") ? "재킷아우터" : item.category}
                          </span>
                        </div>
                        <h4 className="font-display font-medium text-white text-xs leading-snug tracking-tight truncate-two-lines min-h-[32px]">{item.name}</h4>
                        <div className="flex justify-between items-center pt-3 border-t border-white/5 font-mono text-[10px]">
                          <span className="text-gray-500 uppercase">{t.outfit_palette}: <span className="text-gray-300 font-sans font-bold">{item.color}</span></span>
                          <span className="font-extrabold text-white text-xs">${item.price}</span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

                {/* Style advice container with Designer badge */}
                <div className="glass-panel p-6 border border-white/10 space-y-3.5 bg-gradient-to-r from-[#151522]/40 to-black/30">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#5B7FFF]" />
                    <h4 className="font-display font-bold text-white text-xs tracking-wider uppercase font-mono">{t.outfit_tip}</h4>
                  </div>
                  <p className="text-xs text-gray-300 font-sans leading-relaxed">
                    {outfit.styleTip}
                  </p>

                  <div className="pt-4 border-t border-white/5 flex gap-3">
                    <button
                      onClick={() => handleSave(outfit)}
                      disabled={savedOutfitIds.includes(outfit.id)}
                      className={`flex-1 font-display text-xs font-extrabold tracking-wider uppercase py-3.5 rounded-xl flex items-center justify-center gap-2.5 cursor-pointer border transition-colors ${
                        savedOutfitIds.includes(outfit.id) || saveSuccess === outfit.id
                          ? "bg-transparent border-green-500/20 text-green-400"
                          : "bg-white text-black border-transparent hover:bg-neutral-200"
                      }`}
                    >
                      {savedOutfitIds.includes(outfit.id) || saveSuccess === outfit.id ? (
                        <>
                          <BookmarkCheck className="w-4.5 h-4.5 text-green-400 animate-bounce" />
                          {t.outfit_saved}
                        </>
                      ) : (
                        <>
                          <Plus className="w-4.5 h-4.5" />
                          {t.outfit_save}
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </motion.div>
            ) : (
              <div className="glass-panel p-12 rounded-4xl border border-white/10 flex flex-col items-center justify-center text-center min-h-[500px] bg-white/[0.01]">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-full mb-6">
                  <ShoppingBag className="w-8 h-8 text-neutral-600" />
                </div>
                <h4 className="font-display font-black text-white text-xl">{t.outfit_no_look}</h4>
                <p className="text-xs text-gray-500 max-w-sm leading-relaxed mt-2.5 font-sans">
                  {t.outfit_no_look_desc}
                </p>
                <button
                  onClick={fetchLayoutRecommendation}
                  className="bg-white hover:bg-neutral-200 text-black font-display text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-xl mt-6 cursor-pointer shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  {t.outfit_gen_first}
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
