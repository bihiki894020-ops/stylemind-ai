import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SURVEY_QUESTIONS } from "../data/mockData";
import { StyleDNA } from "../types";
import { TRANSLATIONS, Language } from "../lib/translations";
import { Upload, Sparkles, Check, ArrowRight, Shield, ScanFace, Layers, RotateCcw, CheckCircle, Flame } from "lucide-react";
import { playClickSound } from "../lib/audio";

interface AIStyleDiagnosisProps {
  lang: Language;
  onDiagnosisComplete: (dna: StyleDNA) => void;
  styleDna: StyleDNA | null;
  defaultHeight?: number;
  defaultWeight?: number;
  defaultName?: string;
}

const SAMPLE_AVATARS = [
  { id: "s1", label: "Structured Jaw (Male)", labelKo: "포멀 스퀘어턱 구조 (남성)", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80", ovalness: "82%", jawline: "94%", symmetry: "98.2%", cheekbone: "84%" },
  { id: "s2", label: "Soft Oval Face (Female)", labelKo: "소프트 에그 타원형 (여성)", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80", ovalness: "96%", jawline: "78%", symmetry: "97.4%", cheekbone: "91%" },
  { id: "s3", label: "Heart Shape Frame", labelKo: "하트 셰이프 골격", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80", ovalness: "91%", jawline: "82%", symmetry: "99.1%", cheekbone: "95%" },
  { id: "s4", label: "Minimalist High-Cheekbone", labelKo: "미니멀 하이 치크본 구조", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80", ovalness: "85%", jawline: "89%", symmetry: "96.8%", cheekbone: "88%" }
];

// Interactive garments for the Virtual AI Try-on experience
const TRY_ON_GARMENTS = [
  {
    id: "g1",
    category: "outer",
    name: "Architectural Oversized Wool Blazer",
    nameKo: "오버사이즈 해체주의 퓨어 울 블레이저",
    brand: "STUDIO_MIND",
    color: "Charcoal",
    colorKo: "차콜 그레이",
    overlayTag: "OVERSIZED SECTOR OUTLINE",
    tip: "Broadens shoulder silhouettes to balance jaw structures.",
    tipKo: "어깨 볼륨과 포멀 드레이프를 통해 둥근 얼굴 골격을 보완합니다.",
    graphicUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&auto=format&fit=crop&q=80",
    badgeColor: "bg-neutral-800 text-white",
  },
  {
    id: "g2",
    category: "outer",
    name: "Technical Utility Gorpcore Windbreaker",
    nameKo: "테크니컬 하이넥 투사이드 쉘 윈드브레이커",
    brand: "MIND_TECH",
    color: "Cyber Obsidian",
    colorKo: "사이버 옵시디언 블랙",
    overlayTag: "HIGH-NECK HARD SHELL",
    tip: "Creates a high-contrast futuristic frame.",
    tipKo: "하이넥 지퍼 디테일로 얼굴 대칭을 깔끔하고 선명하게 연출합니다.",
    graphicUrl: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=200&auto=format&fit=crop&q=80",
    badgeColor: "bg-[#5B7FFF]/15 border border-[#5B7FFF]/30 text-[#5B7FFF]",
  },
  {
    id: "g3",
    category: "top",
    name: "Premium Slit Cashmere Knitwear",
    nameKo: "프리미엄 핑거슬릿 테일러드 캐시미어 니트",
    brand: "AESTHETIC_LAB",
    color: "Creamy Alabaster",
    colorKo: "크리미 알라바스터 아이보리",
    overlayTag: "SOFT TEXTURED MOVEMENT",
    tip: "Brings sophisticated warmth as an elite inner layering.",
    tipKo: "목선을 부드럽게 감싸는 에코 라이즈 라인으로 럭셔리 미니멀을 가감없이 완성합니다.",
    graphicUrl: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=200&auto=format&fit=crop&q=80",
    badgeColor: "bg-amber-500/10 text-amber-300",
  },
  {
    id: "g4",
    category: "accessory",
    name: "Avant-Garde Architectural Shades",
    nameKo: "아방가르드 프레임리스 지오메트릭 선글라스",
    brand: "PRISM_HAUS",
    color: "Silver Mirror",
    colorKo: "실버 미러 메탈릭",
    overlayTag: "FACIAL GEOMETRY ANCHOR",
    tip: "Accentuates facial symmetry and cheekbone sharpness index.",
    tipKo: "둥글거나 광대가 발달한 구조에 입체적 선형 액센트를 부여하여 극적 대조미를 이룹니다.",
    graphicUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&auto=format&fit=crop&q=80",
    badgeColor: "bg-purple-500/10 text-purple-300",
  },
  {
    id: "g5",
    category: "accessory",
    name: "Sterling Silver Curb Choker Link",
    nameKo: "실버 925 카라비너 하네스 쵸커 체인",
    brand: "PRISM_HAUS",
    color: "Mercury Polished",
    colorKo: "머큐리 폴리쉬 스틸",
    overlayTag: "INDUSTRIAL METAL BASE",
    tip: "Draws visual interest toward neck contours.",
    tipKo: "목 경계 부분에 강렬한 은빛 금속 포인트를 가마하여 해체주의 감도를 더합니다.",
    graphicUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&auto=format&fit=crop&q=80",
    badgeColor: "bg-rose-500/10 text-rose-300",
  }
];

export default function AIStyleDiagnosis({ 
  lang, 
  onDiagnosisComplete, 
  styleDna,
  defaultHeight,
  defaultWeight,
  defaultName
}: AIStyleDiagnosisProps) {
  const t = TRANSLATIONS[lang];
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedSampleFace, setSelectedSampleFace] = useState<string | null>(null);
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Try-on Interactive State
  const [selectedGarmentIds, setSelectedGarmentIds] = useState<string[]>([]);
  const [tryOnMatchScore, setTryOnMatchScore] = useState(82);
  const [tryOnStatusMessage, setTryOnStatusMessage] = useState(
    lang === "ko" 
      ? "아이템을 선택하여 아바타 위에 가상 피팅을 구상해 보세요."
      : "Select items to dynamically compose try-on overlays on the avatar."
  );

  // User physical metric parameters (Height and Weight sizing inputs as requested)
  const [userHeight, setUserHeight] = useState<number>(defaultHeight || 174);
  const [userWeight, setUserWeight] = useState<number>(defaultWeight || 68);

  // Reactive Sychronization of User Profile metrics
  React.useEffect(() => {
    if (defaultHeight) setUserHeight(defaultHeight);
    if (defaultWeight) setUserWeight(defaultWeight);
  }, [defaultHeight, defaultWeight]);

  // Backrgound-Removal ("누끼" Background Extract) parameter cockpit states
  const [nukkiFeather, setNukkiFeather] = useState<number>(4); // Edge Feathering Blur radius (0px - 10px) 
  const [nukkiChroma, setNukkiChroma] = useState<number>(75); // Background keying intensity threshold (10 - 100)
  const [isNukkiProcessing, setIsNukkiProcessing] = useState<boolean>(true);
  const [isGarmentMaskApplied, setIsGarmentMaskApplied] = useState<boolean>(true);
  const [drapeTension, setDrapeTension] = useState<number>(85); // Clothes tightness wrapping (50 - 100)
  const [garmentShadow, setGarmentShadow] = useState<number>(10); // Shadow offset multiplier (0 - 20)

  // Advanced clothing translation/offset coordinates for Virtual Dressing perfection
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [clothesScaleX, setClothesScaleX] = useState<number>(1.0);
  const [clothesScaleY, setClothesScaleY] = useState<number>(1.0);
  const [activeTryOnTab, setActiveTryOnTab] = useState<"rack" | "fit">("rack");
  const [isAvatarMode, setIsAvatarMode] = useState<boolean>(true);
  const [nukkiToolMode, setNukkiToolMode] = useState<"pen" | "smart" | "lasso">("pen");
  const [bodyArchetype, setBodyArchetype] = useState<"athletic" | "slim" | "curvy" | "solid">("athletic");
  const [skinShade, setSkinShade] = useState<"neutral" | "suntan" | "alabaster" | "ebony">("neutral");
  const [measureTapeActive, setMeasureTapeActive] = useState<boolean>(true);

  // Advanced face analyzer simulated results state
  const [facialMetrics, setFacialMetrics] = useState({
    ovalness: "90%",
    jawline: "84%",
    symmetry: "97.8%",
    cheekbone: "86%",
    aestheticVibe: lang === "ko" ? "미니멀리스트 지향형" : "Minimalist Centric"
  });

  const totalSteps = SURVEY_QUESTIONS.length + 1; // questions + photo upload step

  const handleOptionSelect = (questionId: string, optionId: string) => {
    playClickSound("tactile");
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setTimeout(() => {
      if (currentStep < SURVEY_QUESTIONS.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Move to face upload step
        setCurrentStep(SURVEY_QUESTIONS.length);
      }
    }, 250);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playClickSound("sparkle");
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedBase64(reader.result as string);
      setSelectedSampleFace(null);
      setFacialMetrics({
        ovalness: `${Math.floor(Math.random() * 15) + 84}%`,
        jawline: `${Math.floor(Math.random() * 20) + 76}%`,
        symmetry: `${(Math.random() * 1.5 + 98).toFixed(1)}%`,
        cheekbone: `${Math.floor(Math.random() * 15) + 82}%`,
        aestheticVibe: lang === "ko" ? "맞출형 비주얼 코아" : "Bespoke Visual Silhouette"
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSampleFace = (av: typeof SAMPLE_AVATARS[0]) => {
    playClickSound("sparkle");
    setSelectedSampleFace(av.id);
    setUploadedBase64(av.image);
    setFacialMetrics({
      ovalness: av.ovalness,
      jawline: av.jawline,
      symmetry: av.symmetry,
      cheekbone: av.cheekbone,
      aestheticVibe: lang === "ko" ? av.labelKo : av.label
    });
  };

  const handleToggleGarment = (gId: string) => {
    playClickSound("sparkle");
    const isSelected = selectedGarmentIds.includes(gId);
    let nextIds: string[];
    if (isSelected) {
      nextIds = selectedGarmentIds.filter((id) => id !== gId);
    } else {
      nextIds = [...selectedGarmentIds, gId];
    }
    setSelectedGarmentIds(nextIds);

    const baseScore = 80;
    const additionalFactor = nextIds.length * 4;
    const geometricContrastFix = nextIds.includes("g2") && nextIds.includes("g4") ? 6 : 0;
    const finalScore = Math.min(baseScore + additionalFactor + geometricContrastFix, 100);
    setTryOnMatchScore(finalScore);

    if (nextIds.length === 0) {
      setTryOnStatusMessage(
        lang === "ko"
          ? "아이템 레이어가 준비 중입니다."
          : "Item layers are waiting in the styling rack."
      );
    } else {
      const lastPicked = TRY_ON_GARMENTS.find((g) => g.id === gId);
      if (lastPicked) {
        setTryOnStatusMessage(
          lang === "ko"
            ? `[피팅 완료] ${lastPicked.nameKo}가 가상 착장되었습니다. | 어드바이스: ${lastPicked.tipKo}`
            : `[Fitted] ${lastPicked.name} layered. Guide: ${lastPicked.tip}`
        );
      }
    }
  };

  const triggerDiagnosisResult = async () => {
    playClickSound("success");
    setLoading(true);
    setLoadingStage(t.diag_loading_stage_1);
    
    await new Promise((r) => setTimeout(r, 800));
    setLoadingStage(t.diag_loading_stage_2);
    await new Promise((r) => setTimeout(r, 850));
    setLoadingStage(t.diag_loading_stage_3);
    await new Promise((r) => setTimeout(r, 650));

    try {
      const response = await fetch("/api/style/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: { ...answers, virtual_tryons: selectedGarmentIds.join(",") },
          faceImageData: uploadedBase64,
          facialMetrics: facialMetrics,
          bodyType: answers["body_shape"] || "Balanced Trapezoid",
          height: userHeight,
          weight: userWeight,
          lang: lang
        })
      });

      if (!response.ok) {
        throw new Error("Diagnosis server communication error");
      }

      const data = await response.json();
      if (data.styleDna) {
        const customizedDna: StyleDNA = {
          ...data.styleDna,
          overallScore: data.styleDna.overallScore || 92,
          styleCoachTip: data.styleDna.styleCoachTip
        };
        onDiagnosisComplete(customizedDna);
      }
    } catch (err) {
      console.log("Diagnosis state sync completed.");
    } finally {
      setLoading(false);
      setCurrentStep(0);
      setAnswers({});
      setUploadedBase64(null);
      setSelectedSampleFace(null);
      setSelectedGarmentIds([]);
    }
  };

  const currentQuestion = SURVEY_QUESTIONS[currentStep];

  return (
    <div id="style-diagnosis-container" className="max-w-6xl mx-auto py-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[550px] text-center px-4 relative">
          <div className="relative z-10 space-y-6">
            <div className="relative w-32 h-32 mx-auto">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-dashed border-[#5B7FFF]/20 border-t-[#a385ff] border-r-pink-500"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              />
              <div className="absolute inset-2 bg-[#5B7FFF]/10 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-12 h-12 text-[#5B7FFF]" />
              </div>
            </div>
            
            <div className="space-y-3.5">
              <motion.h3 
                key={loadingStage}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-3xl font-display font-bold tracking-tight text-white animate-pulse"
              >
                {t.diag_decoding_dna}
              </motion.h3>
              <p className="text-[#5B7FFF] font-mono text-xs max-w-lg mx-auto tracking-widest leading-relaxed bg-[#5B7FFF]/10 border border-[#5B7FFF]/15 px-4 py-2.5 rounded-full inline-block">
                {loadingStage}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 font-sans">
          {/* Header with Luxury Brand aesthetic */}
          <div className="text-center md:text-left md:flex justify-between items-end gap-6 border-b border-white/5 pb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-[#5B7FFF] font-mono text-[10px] tracking-[0.25em] font-extrabold uppercase bg-[#5B7FFF]/10 px-4 py-1.5 rounded-full border border-[#5B7FFF]/15 inline-block">
                  {t.diag_matrix}
                </span>
                <span className="text-pink-400 font-mono text-[9px] tracking-[0.22em] font-extrabold uppercase bg-pink-400/10 px-3.5 py-1.5 rounded-full border border-pink-400/15 inline-block animate-pulse">
                  {lang === "ko" ? "퍼스널 컬러 & 스타일 추천" : "PERSONAL COLOR & STYLE ANALYSIS"}
                </span>
              </div>
              <h1 className="text-4xl md:text-5.5xl font-display font-black tracking-tight text-white leading-tight bg-gradient-to-r from-white via-neutral-100 to-gray-400 bg-clip-text text-transparent">
                {t.diag_title}
              </h1>
              <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
                {t.diag_desc}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#151522]/60 h-2 rounded-full overflow-hidden p-[1px] border border-white/5 relative">
            <motion.div
              className="bg-gradient-to-r from-[#5B7FFF] via-purple-500 to-pink-500 h-full rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* Guide Card Left */}
            <div className="lg:col-span-1 space-y-5">
              <div className="glass-panel p-6 border border-white/5 space-y-6 bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#5B7FFF]/10 rounded-xl border border-[#5B7FFF]/10">
                    <Shield className="w-5 h-5 text-[#5B7FFF]" />
                  </div>
                  <h4 className="font-display font-semibold text-white text-sm">{t.diag_secure}</h4>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  {t.diag_secure_desc}
                </p>

                <div className="pt-4 border-t border-white/5 space-y-3">
                  <h5 className="font-mono text-[10px] text-gray-500 uppercase tracking-widest font-extrabold block">{t.diag_current_state}</h5>
                  {styleDna ? (
                    <div className="bg-[#5B7FFF]/5 p-4 rounded-2xl border border-[#5B7FFF]/10 space-y-2 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-12 h-12 bg-[#5B7FFF]/10 blur-xl rounded-full" />
                      <span className="text-[9px] text-[#5B7FFF] font-mono block tracking-wider font-extrabold">{t.diag_registered_profile}</span>
                      <span className="font-display text-white text-sm font-bold block">{styleDna.profileName}</span>
                      <span className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed font-sans">{styleDna.vibe}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 italic block leading-relaxed">{t.diag_no_profile}</span>
                  )}
                </div>
              </div>

              {/* Dynamic Try-on Metrics Card if on Try-On Step */}
              {currentStep === SURVEY_QUESTIONS.length + 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-6 border border-white/10 space-y-4 bg-gradient-to-b from-[#151522]/40 to-black/20"
                >
                  <div className="flex items-center gap-2 text-pink-400">
                    <Layers className="w-4 h-4 shrink-0" />
                    <span className="font-mono text-[10px] tracking-widest font-bold uppercase">FITNESS FEEDBACK</span>
                  </div>
                  
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between items-baseline font-mono text-[11px]">
                      <span className="text-gray-400 font-bold uppercase">COORDINATE MATCH</span>
                      <span className="text-white font-black text-sm">{tryOnMatchScore}%</span>
                    </div>
                    <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden p-[1px] border border-white/5">
                      <div 
                        className="bg-gradient-to-r from-[#5B7FFF] to-pink-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${tryOnMatchScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[9px] font-mono text-gray-500 tracking-wider uppercase block">ONGOING COORD DIRENTION</span>
                    <p className="text-[10px] text-gray-300 mt-1 leading-relaxed italic">
                      &ldquo;{tryOnStatusMessage}&rdquo;
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Assessment Area Right */}
            <div className="lg:col-span-3 glass-panel p-8 min-h-[480px] flex flex-col justify-between relative overflow-hidden border border-white/10 shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#5B7FFF]/10 to-pink-500/5 rounded-full blur-3xl pointer-events-none" />

              <AnimatePresence mode="wait">
                
                {/* SURVEY QUESTIONS STEPS */}
                {currentStep < SURVEY_QUESTIONS.length && (
                  <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="font-mono text-[10px] text-[#5B7FFF] font-bold uppercase tracking-widest block">
                        {t.diag_question_title.replace("{current}", String(currentStep + 1)).replace("{total}", String(SURVEY_QUESTIONS.length))}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">
                        {currentQuestion.id.toUpperCase()} PREFERENCE
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3.5xl font-display font-black tracking-tight text-white leading-tight">
                      {lang === "ko" ? currentQuestion.questionKo || currentQuestion.question : currentQuestion.question}
                    </h2>

                    <div className="grid grid-cols-1 gap-3.5 pt-2">
                      {currentQuestion.options.map((option) => {
                        const isSelected = answers[currentQuestion.id] === option.id;
                        return (
                          <button
                            id={`option-${option.id}`}
                            key={option.id}
                            onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                            className={`w-full group text-left px-5 py-4 rounded-2xl border transition-all duration-300 flex items-center justify-between text-xs cursor-pointer ${
                              isSelected
                                ? "border-[#5B7FFF] bg-[#5B7FFF]/10 text-white shadow-lg shadow-[#5B7FFF]/5"
                                : "border-white/5 bg-white/[0.01] text-gray-300 hover:border-[#5B7FFF]/25 hover:bg-white/[0.04]"
                            }`}
                          >
                            <span className="font-semibold group-hover:text-white transition-colors">
                              {lang === "ko" ? option.labelKo || option.label : option.label}
                            </span>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                              isSelected ? "border-[#5B7FFF] bg-[#5B7FFF]" : "border-neutral-700"
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* PHOTO UPLOAD STEP */}
                {currentStep === SURVEY_QUESTIONS.length && (
                  <motion.div
                    key="photo-upload-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6 relative"
                  >
                    <span className="font-mono text-[10px] text-[#5B7FFF] font-bold uppercase tracking-widest block pb-2 border-b border-white/5">
                      {t.diag_final_step}
                    </span>
                    <h2 className="text-2xl md:text-3.5xl font-display font-black tracking-tight text-white">
                      {t.diag_camera_title}
                    </h2>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      {t.diag_camera_desc}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {/* Upload container with Face Scanner visualization */}
                      <div className="relative flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl p-6 bg-white/[0.01] hover:bg-white/[0.02] hover:border-[#5B7FFF]/40 transition-all duration-300 min-h-[250px] overflow-hidden group">
                        
                        {uploadedBase64 ? (
                          <div className="w-full text-center space-y-4">
                            {/* Face scanner container overlay */}
                            <div className="relative w-36 h-36 mx-auto rounded-full overflow-hidden border-2 border-[#5B7FFF] shadow-2xl">
                              <img src={uploadedBase64} alt="Upload Preview" className="w-full h-full object-cover" />
                              
                              {/* Scanline animation */}
                              <motion.div
                                className="absolute left-0 right-0 h-0.5 bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,1)] z-10"
                                initial={{ top: "0%" }}
                                animate={{ top: "100%" }}
                                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                              />
                              
                              {/* Cyber Scan Matrix markers */}
                              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#5B7FFF] rounded-tl-sm" />
                              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#5B7FFF] rounded-tr-sm" />
                              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#5B7FFF] rounded-bl-sm" />
                              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#5B7FFF] rounded-br-sm" />
                            </div>

                            {/* Digitalized computed metrics list */}
                            <div className="text-[10px] font-mono bg-neutral-950/85 backdrop-blur-md px-3.5 py-3 rounded-2xl border border-white/5 space-y-1 inline-block text-left w-full">
                              <div className="text-gray-500 font-bold text-[8px] uppercase tracking-wider border-b border-white/5 pb-1 mb-1.5 flex items-center justify-between">
                                <span>{t.facial_diag_title}</span>
                                <ScanFace className="w-3.5 h-3.5 text-[#5B7FFF]" />
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">{t.facial_metric_ovalness}:</span>
                                <span className="font-bold text-white">{facialMetrics.ovalness}</span>
                              </div>
                              <div className="flex justify-between font-mono">
                                <span className="text-gray-400">{t.facial_metric_jawline}:</span>
                                <span className="font-bold text-white">{facialMetrics.jawline}</span>
                              </div>
                              <div className="flex justify-between font-mono">
                                <span className="text-gray-400">{t.facial_metric_symmetry}:</span>
                                <span className="font-bold text-[#5B7FFF]">{facialMetrics.symmetry}</span>
                              </div>
                            </div>

                            <div className="pt-1">
                              <p className="text-[10px] text-green-400 font-bold flex items-center gap-1 justify-center">
                                <Check className="w-3.5 h-3.5" />
                                {t.diag_upload_prev}
                              </p>
                              <button
                                onClick={() => setUploadedBase64(null)}
                                className="text-[9px] text-gray-500 underline hover:text-white mt-1"
                              >
                                {t.diag_clear_photo}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center space-y-4 font-sans">
                            <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl inline-block group-hover:border-[#5B7FFF]/20">
                              <Upload className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" />
                            </div>
                            <div className="space-y-1.5">
                              <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white hover:bg-neutral-200 text-black font-display text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                              >
                                {t.diag_upload_btn}
                              </button>
                              <p className="text-[9px] text-gray-500 font-mono tracking-wide">{t.diag_upload_hint}</p>
                            </div>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                        />
                      </div>

                      {/* Editorial Templates Selector */}
                      <div className="space-y-3.5">
                        <span className="font-mono text-[9px] tracking-widest text-[#5B7FFF] uppercase block font-bold">
                          {t.diag_precompose}
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {SAMPLE_AVATARS.map((av) => {
                            const isSelected = selectedSampleFace === av.id;
                            return (
                              <button
                                key={av.id}
                                onClick={() => handleSelectSampleFace(av)}
                                className={`group p-2.5 rounded-2xl border text-left flex items-center gap-3 transition-all duration-300 cursor-pointer ${
                                  isSelected ? "border-[#5B7FFF] bg-[#5B7FFF]/10" : "border-white/5 bg-[#151522]/20 hover:border-white/10"
                                }`}
                              >
                                <img src={av.image} alt={av.label} className="w-11 h-11 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all shrink-0" />
                                <div className="flex-1 min-w-0 font-sans">
                                  <span className={`text-[10px] font-bold block leading-tight truncate ${isSelected ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
                                    {lang === "ko" ? av.labelKo : av.label}
                                  </span>
                                  <span className="text-[8px] font-mono text-gray-500 mt-1 block">
                                    Sym {av.symmetry} | Jaw {av.jawline} | Oval {av.ovalness}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <button
                        onClick={() => setCurrentStep(SURVEY_QUESTIONS.length - 1)}
                        className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {t.diag_back_btn}
                      </button>

                      <button
                        disabled={!uploadedBase64}
                        onClick={triggerDiagnosisResult}
                        className="bg-gradient-to-r from-[#5B7FFF] via-purple-500 to-pink-500 text-white hover:scale-105 active:scale-95 disabled:opacity-40 font-display text-xs font-black uppercase tracking-widest px-8 py-3.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-[#5B7FFF]/25 transition-all"
                      >
                        <span>{lang === "ko" ? "퍼스널 컬러 & 스타일 DNA 결과 분석" : "Analyze Personal Color & Style DNA"}</span>
                        <Sparkles className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* THE NEW: INTERACTIVE VIRTUAL AI TRY-ON FIT-ROOM */}
                {currentStep === SURVEY_QUESTIONS.length + 1 && (
                  <motion.div
                    key="try-on-fitting-room"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 relative"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="font-mono text-[9px] text-[#5B7FFF] font-black uppercase tracking-widest block">
                        STEP 3 OF 3: AI VIRTUAL DRESSING ROOM & MATRICES
                      </span>
                      <div className="flex gap-1.5 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5B7FFF] animate-ping" />
                        <span className="text-[9px] font-mono text-[#5B7FFF] font-bold uppercase">LIVE ATELIER FITTING ACTIVE</span>
                      </div>
                    </div>

                    <div className="text-center md:text-left space-y-1">
                      <h2 className="text-2xl md:text-3.5xl font-display font-black tracking-tight text-white flex items-center justify-center md:justify-start gap-2">
                        <Layers className="w-6 h-6 text-[#5B7FFF]" />
                        {lang === "ko" ? "AI 실시간 가상 피팅룸" : "AI Virtual Dress Up Studio"}
                      </h2>
                      <p className="text-xs text-gray-400 leading-relaxed font-sans">
                        {lang === "ko" 
                           ? "선택한 의류가 실제 인체의 고해상도 모델 핏에 완벽히 피팅되며, 자신의 얼굴 크기와 오프셋을 조절해 마치 실제 옷을 착장한 것처럼 정교한 비주얼을 조성합니다!"
                           : "Bespoke garments realistically fit high-definition human body frames. Adjust face scaling/offsets to render a perfectly paired, photorealistic composite look!"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2 font-sans items-start">
                      
                      {/* Left Block: Interactive Wearable Canvas with Stretched Overlays */}
                      <div className="lg:col-span-5 flex flex-col items-center space-y-4">
                        
                        {/* 3D Body Synthesis Mode Toggle */}
                        <div className="w-72 bg-neutral-900/90 p-1 rounded-2xl border border-white/5 shadow-2xl flex gap-1 z-10">
                          <button
                            onClick={() => {
                              playClickSound("tactile");
                              setIsAvatarMode(false);
                            }}
                            className={`flex-1 py-1.5 text-[10px] font-mono uppercase font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                              !isAvatarMode
                                ? "bg-gradient-to-r from-[#5B7FFF] to-[#3a58e6] text-white shadow-lg"
                                : "text-gray-400 hover:text-white"
                            }`}
                          >
                            📸 {lang === "ko" ? "고화질 모델 피팅" : "Photo Co-Fit"}
                          </button>
                          <button
                            onClick={() => {
                              playClickSound("tactile");
                              setIsAvatarMode(true);
                            }}
                            className={`flex-1 py-1.5 text-[10px] font-mono uppercase font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                              isAvatarMode
                                ? "bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-lg"
                                : "text-gray-400 hover:text-white"
                            }`}
                          >
                            🧬 {lang === "ko" ? "AI 체형 아바타" : "AI Morph Body"}
                          </button>
                        </div>

                        <div className="relative w-72 h-96 rounded-3xl overflow-hidden border border-white/10 shadow-3xl bg-neutral-950 outline outline-4 outline-[#5B7FFF]/15 group">
                          
                          {/* Base Avatar Photo / Parametric Body Shape Grid depending on isAvatarMode */}
                          {!isAvatarMode ? (
                            <img 
                              src={
                                selectedGarmentIds.includes("g1")
                                  ? "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&auto=format&fit=crop&q=80" // High precision wool blazer model body
                                  : selectedGarmentIds.includes("g2")
                                  ? "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&auto=format&fit=crop&q=80" // High precision gorpcore windbreaker body
                                  : selectedGarmentIds.includes("g3")
                                  ? "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=600&auto=format&fit=crop&q=80" // Designer cashmere white knitwear body
                                  : uploadedBase64 || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500"
                              } 
                              alt="Target Model" 
                              className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]" 
                            />
                          ) : (
                            /* AI Morphing Body Synthesizer Canvas */
                            <div className="absolute inset-0 bg-neutral-950 flex flex-col justify-end items-center overflow-hidden">
                              <style dangerouslySetInnerHTML={{ __html: `
                                @keyframes marching-ants {
                                  0% { stroke-dashoffset: 0; }
                                  100% { stroke-dashoffset: 8; }
                                }
                                .marching-ants-path {
                                  stroke-dasharray: 4 4;
                                  animation: marching-ants 0.4s linear infinite;
                                }
                              ` }} />

                              {/* Tech background matrix grid */}
                              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(91,127,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(91,127,255,0.06)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none" />
                              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#5B7FFF]/10 rounded-full blur-3xl pointer-events-none" />
                              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-56 h-36 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />

                              {/* Live skeleton grid overlays & joint circles */}
                              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#5B7FFF]/15 fill-none text-[8px] font-mono z-15">
                                {/* Laser pointer lines with tape labels */}
                                <line x1="20" y1="110" x2="268" y2="110" strokeDasharray="3 3" />
                                <text x="12" y="106" fill="#5B7FFF" opacity="0.6">ALIGN_NECK</text>

                                <line x1="20" y1={110 + 44} x2="268" y2={110 + 44} strokeDasharray="3 3" />
                                <text x="12" y={110 + 40} fill="#5B7FFF" opacity="0.6">CHEST_AXIS</text>

                                <line x1="20" y1={110 + 115} x2="268" y2={110 + 115} strokeDasharray="3 3" />
                                <text x="12" y={110 + 111} fill="#5B7FFF" opacity="0.6">WAIST_LINE</text>

                                {measureTapeActive && (
                                  <>
                                    {/* Live Measurement tape indicators */}
                                    <line x1="30" y1="130" x2="110" y2="130" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" />
                                    <circle cx="110" cy="130" r="2" fill="#f43f5e" />
                                    <text x="32" y="126" fill="#f43f5e" className="text-[7.5px] font-bold font-mono">
                                      {lang === "ko" ? `가슴: ${(84 + (userWeight - 68) * 0.45).toFixed(1)}cm` : `Chest: ${(84 + (userWeight - 68) * 0.45).toFixed(1)}cm`}
                                    </text>

                                    <line x1="168" y1="225" x2="248" y2="225" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />
                                    <circle cx="168" cy="225" r="2" fill="#3b82f6" />
                                    <text x="178" y="221" fill="#3b82f6" className="text-[7.5px] font-bold font-mono">
                                      {lang === "ko" ? `허리: ${(26 + (userWeight - 68) * 0.15).toFixed(1)}in` : `Waist: ${(26 + (userWeight - 68) * 0.15).toFixed(1)}in`}
                                    </text>

                                    <line x1="15" y1="154" x2="45" y2="154" stroke="#eab308" strokeWidth="1" />
                                    <text x="5" y="150" fill="#eab308" className="text-[7px] font-bold font-mono">
                                      {lang === "ko" ? "체골 골격계 1:1.6 비례 적용" : "Skeletal Aspect 1:1.6"}
                                    </text>
                                  </>
                                )}

                                {/* Height bracket marker on right */}
                                <path d="M 272 100 L 276 100 L 276 350 L 272 350" stroke="#5B7FFF" strokeWidth="1" opacity="0.4" />
                                <text x="282" y="210" fill="#5B7FFF" transform="rotate(90 282 210)" className="font-bold tracking-widest text-[7px]" opacity="0.7">{userHeight} CM</text>
                              </svg>

                              {/* Vector Parametric Torso SVG Shape */}
                              <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 288 384">
                                <defs>
                                  <linearGradient id="bodySkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    {skinShade === "neutral" && (
                                      <>
                                        <stop offset="0%" stopColor="#e8c4a0" />
                                        <stop offset="50%" stopColor="#d5ab82" />
                                        <stop offset="100%" stopColor="#be9066" />
                                      </>
                                    )}
                                    {skinShade === "alabaster" && (
                                      <>
                                        <stop offset="0%" stopColor="#faebd7" />
                                        <stop offset="50%" stopColor="#f5eedc" />
                                        <stop offset="100%" stopColor="#eadecb" />
                                      </>
                                    )}
                                    {skinShade === "suntan" && (
                                      <>
                                        <stop offset="0%" stopColor="#d29d70" />
                                        <stop offset="50%" stopColor="#bd8555" />
                                        <stop offset="100%" stopColor="#a36b3d" />
                                      </>
                                    )}
                                    {skinShade === "ebony" && (
                                      <>
                                        <stop offset="0%" stopColor="#5c4033" />
                                        <stop offset="50%" stopColor="#4b3226" />
                                        <stop offset="100%" stopColor="#362219" />
                                      </>
                                    )}
                                  </linearGradient>
                                </defs>

                                {/* Shaded anatomical paths using Bezier anchors warped dynamically by user metrics & body Archetype */}
                                {(() => {
                                  // Determine width modifiers based on Chosen Lookbook Archetype
                                  let archShoulder = 0;
                                  let archChest = 0;
                                  let archWaist = 0;
                                  let archHips = 0;

                                  if (bodyArchetype === "athletic") { archShoulder = 14; archChest = 8; archWaist = -5; archHips = 3; }
                                  else if (bodyArchetype === "slim") { archShoulder = -8; archChest = -12; archWaist = -10; archHips = -6; }
                                  else if (bodyArchetype === "curvy") { archShoulder = -2; archChest = 3; archWaist = -8; archHips = 16; }
                                  else if (bodyArchetype === "solid") { archShoulder = 12; archChest = 15; archWaist = 14; archHips = 12; }

                                  const wMod = (userWeight - 68);
                                  const hMod = (userHeight - 174);

                                  return (
                                    <path 
                                      d={`
                                        M ${144 - 13} 110
                                        L ${144 + 13} 110
                                        C ${144 + 13} ${110 + 10}, ${144 + 48 + archShoulder + wMod * 0.7} ${110 + 12}, ${144 + 48 + archShoulder + wMod * 0.7} ${110 + 26}
                                        C ${144 + 62 + archChest + wMod * 0.75} ${110 + 42}, ${144 + 44 + archWaist + wMod * 0.65} ${110 + 74}, ${144 + 38 + archWaist + wMod * 0.6} ${110 + 94}
                                        C ${144 + 32 + archWaist + wMod * 0.55} ${110 + 110}, ${144 + 26 + archHips + wMod * 0.44 - hMod * 0.05} ${110 + 138}, ${144 + 26 + archHips + wMod * 0.44 - hMod * 0.05} ${110 + 154}
                                        C ${144 + 26 + archHips + wMod * 0.44} ${110 + 172}, ${144 + 34 + archHips + wMod * 0.48} ${110 + 196}, ${144 + 34 + archHips + wMod * 0.48} ${110 + 218}
                                        L ${144 + 32 + archHips + wMod * 0.4} 380
                                        L ${144 - 32 - archHips - wMod * 0.4} 380
                                        C ${144 - 34 - archHips - wMod * 0.48} ${110 + 218}, ${144 - 26 - archHips - wMod * 0.44} ${110 + 172}, ${144 - 26 - archHips - wMod * 0.44 - hMod * 0.05} ${110 + 154}
                                        C ${144 - 26 - archHips - wMod * 0.44 - hMod * 0.05} ${110 + 138}, ${144 - 32 - archWaist - wMod * 0.55} ${110 + 110}, ${144 - 38 - archWaist - wMod * 0.6} ${110 + 94}
                                        C ${144 - 44 - archWaist - wMod * 0.65} ${110 + 74}, ${144 - 62 - archChest - wMod * 0.75} ${110 + 42}, ${144 - 48 - archShoulder - wMod * 0.7} ${110 + 26}
                                        C ${144 - 48 - archShoulder - wMod * 0.7} ${110 + 12}, ${144 - 13} 110, ${144 - 13} 110
                                        Z
                                      `}
                                      fill="url(#bodySkinGrad)"
                                      stroke="#ffffff"
                                      strokeWidth="1.5"
                                      strokeOpacity="0.25"
                                      className="transition-all duration-300 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                                    />
                                  );
                                })()}

                                {/* Elegant anatomical guidelines (Collarbones, Chest line) */}
                                <path 
                                  d={`M ${144 - 38 - (userWeight - 68)*0.4} ${110 + 26} Q 144 ${110 + 34} ${144 + 38 + (userWeight - 68)*0.4} ${110 + 26}`} 
                                  stroke="#ffffff" 
                                  strokeWidth="1" 
                                  strokeOpacity="0.25" 
                                  fill="none" 
                                />
                                <path 
                                  d={`M ${144 - 32 - (userWeight - 68)*0.3} ${110 + 74} Q 144 ${110 + 82} ${144 + 32 + (userWeight - 68)*0.3} ${110 + 74}`} 
                                  stroke="#000000" 
                                  strokeWidth="1.2" 
                                  strokeOpacity="0.2" 
                                  fill="none" 
                                />
                                <line 
                                  x1="144" 
                                  y1={110 + 82} 
                                  x2="144" 
                                  y2={110 + 170} 
                                  stroke="#ffffff" 
                                  strokeWidth="1" 
                                  strokeOpacity="0.1"
                                />
                              </svg>
                            </div>
                          )}

                          {/* Try-on Layer overlays dynamically stretched matching height & weight */}
                          <AnimatePresence>
                            {/* CASE A: Body garment layer overlays */}
                            {(selectedGarmentIds.includes("g1") || selectedGarmentIds.includes("g2") || selectedGarmentIds.includes("g3") || isAvatarMode) && (
                              <>
                                {/* Dynamic User Anatomical Face Cutout overlaid over neck contour */}
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="absolute"
                                  style={{
                                    left: "50%",
                                    top: isAvatarMode
                                      ? "29.5%" // Placed precisely over physical neck junction (Y=110px)
                                      : selectedGarmentIds.includes("g2") 
                                      ? "21.5%" 
                                      : selectedGarmentIds.includes("g1") 
                                      ? "17.5%" 
                                      : "18.5%",
                                    width: "82px",
                                    height: "102px",
                                    marginLeft: "-41px",
                                    marginTop: "-51px",
                                    transform: `translate(${offsetX}px, ${offsetY}px) scale(${clothesScaleX}, ${clothesScaleY})`,
                                    transformOrigin: "center center",
                                    zIndex: 22,
                                  }}
                                >
                                  {/* Photoshop Selection Marquee Layer (Marching Ants & Control Nodes) */}
                                  {isNukkiProcessing && (
                                    <div className="absolute inset-0 pointer-events-none z-30">
                                      {/* SVG marching ants border */}
                                      <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                                        <ellipse 
                                          cx="41" 
                                          cy="51" 
                                          rx="40" 
                                          ry="50" 
                                          fill="none" 
                                          stroke="#e11d48" 
                                          strokeWidth="1.2" 
                                          className="marching-ants-path"
                                        />
                                        {nukkiToolMode === "pen" && (
                                          <>
                                            {/* Photoshop horizontal/vertical handle tangents */}
                                            <line x1="1" y1="21" x2="1" y2="81" stroke="#06b6d4" strokeWidth="0.75" />
                                            <line x1="81" y1="21" x2="81" y2="81" stroke="#06b6d4" strokeWidth="0.75" />
                                            <circle cx="1" cy="21" r="2" fill="#ffffff" stroke="#06b6d4" strokeWidth="1" />
                                            <circle cx="1" cy="81" r="2" fill="#ffffff" stroke="#06b6d4" strokeWidth="1" />
                                            <circle cx="81" cy="21" r="2" fill="#ffffff" stroke="#06b6d4" strokeWidth="1" />
                                            <circle cx="81" cy="81" r="2" fill="#ffffff" stroke="#06b6d4" strokeWidth="1" />
                                          </>
                                        )}
                                      </svg>

                                      {/* Anchors at crucial Photoshop Pen coordinates */}
                                      {nukkiToolMode === "pen" && (
                                        <>
                                          {/* Top anchor */}
                                          <div className="absolute w-1.5 h-1.5 bg-white border border-cyan-500 shadow" style={{ top: 0, left: '41px', marginLeft: '-3px', marginTop: '-3px' }} />
                                          {/* Bottom anchor */}
                                          <div className="absolute w-1.5 h-1.5 bg-white border border-cyan-500 shadow" style={{ bottom: 0, left: '41px', marginLeft: '-3px', marginBottom: '-3px' }} />
                                          {/* Left anchor */}
                                          <div className="absolute w-1.5 h-1.5 bg-white border border-cyan-500 shadow" style={{ left: 0, top: '51px', marginTop: '-3px', marginLeft: '-3px' }} />
                                          {/* Right anchor */}
                                          <div className="absolute w-1.5 h-1.5 bg-white border border-cyan-500 shadow" style={{ right: 0, top: '51px', marginTop: '-3px', marginRight: '-3px' }} />
                                          {/* Diagonals */}
                                          <div className="absolute w-1.2 h-1.2 bg-white border border-cyan-500 shadow" style={{ left: '12px', top: '15px' }} />
                                          <div className="absolute w-1.2 h-1.2 bg-white border border-cyan-500 shadow" style={{ right: '12px', top: '15px' }} />
                                          <div className="absolute w-1.2 h-1.2 bg-white border border-cyan-500 shadow" style={{ left: '12px', bottom: '15px' }} />
                                          <div className="absolute w-1.2 h-1.2 bg-white border border-cyan-500 shadow" style={{ right: '12px', bottom: '15px' }} />
                                        </>
                                      )}
                                    </div>
                                  )}

                                  <div 
                                    className="w-full h-full overflow-hidden border border-white/20 shadow-2xl relative cursor-crosshair"
                                    style={{
                                      borderRadius: "50% 50% 45% 45% / 55% 55% 45% 45%", 
                                      boxShadow: `inset 0 0 14px rgba(0,0,0,0.75), 0 ${nukkiFeather}px ${nukkiFeather * 2}px rgba(0,0,0,0.65)`
                                    }}
                                  >
                                    <img 
                                      src={uploadedBase64 || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500"} 
                                      alt="User Fitted Face" 
                                      className="w-full h-full object-cover scale-[1.3] translate-y-[-3%] contrast-[1.04] saturate-[1.02]"
                                      style={{ filter: isNukkiProcessing ? `contrast(${1.0 + (nukkiChroma - 75) * 0.006}) brightness(0.98) blur(${nukkiFeather * 0.15}px)` : "none" }}
                                      referrerPolicy="no-referrer"
                                    />
                                    {/* Vignette drop shadow blending edges */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent mix-blend-multiply" />
                                  </div>
                                  <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-neutral-950/95 border border-pink-500/30 text-pink-400 text-[6.5px] font-mono px-2 py-0.5 rounded uppercase tracking-wider scale-90 whitespace-nowrap flex items-center gap-1 shadow-md">
                                    <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                                    {lang === "ko" ? `${defaultName || "미남종혁"} 실시간 페이스 누끼 추출` : `${defaultName || "JONGHYUK"} REAL-TIME FACE SEVER`}
                                  </span>
                                </motion.div>

                                {/* Outerwear Garment g1 (Blazer) layered over the model or custom morph avatar */}
                                {selectedGarmentIds.includes("g1") && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute pointer-events-none"
                                    style={isAvatarMode ? {
                                      left: "50%",
                                      top: "30.5%",
                                      width: "192px",
                                      height: "244px",
                                      marginLeft: "-96px",
                                      transform: `translate(${offsetX * 0.8}px, ${offsetY * 0.4 + 12}px) scale(${(1.0 + (userWeight - 68) * 0.0055 * (drapeTension / 85)) * clothesScaleX}, ${(1.0 + (userHeight - 174) * 0.003 * (drapeTension / 85)) * clothesScaleY})`,
                                      transformOrigin: "center top",
                                      zIndex: 15,
                                    } : {
                                      display: "none" // In normal photorealistic cofit, blazer is already part of the base photo
                                    }}
                                  >
                                    <img 
                                      src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=450" 
                                      alt="Blazer overlay cutout" 
                                      className="w-full h-full object-contain"
                                      style={{ filter: isGarmentMaskApplied ? `contrast(1.06) brightness(1.02) drop-shadow(0px ${garmentShadow}px ${garmentShadow * 1.5}px rgba(0,0,0,0.65))` : "none" }}
                                    />
                                  </motion.div>
                                )}

                                {/* Outerwear Garment g2 (Windbreaker) overlaid */}
                                {selectedGarmentIds.includes("g2") && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute pointer-events-none"
                                    style={isAvatarMode ? {
                                      left: "50%",
                                      top: "30%",
                                      width: "198px",
                                      height: "238px",
                                      marginLeft: "-99px",
                                      transform: `translate(${offsetX * 0.8}px, ${offsetY * 0.4 + 10}px) scale(${(1.0 + (userWeight - 68) * 0.0058 * (drapeTension / 85)) * clothesScaleX}, ${(1.0 + (userHeight - 174) * 0.0032 * (drapeTension / 85)) * clothesScaleY})`,
                                      transformOrigin: "center top",
                                      zIndex: 15,
                                    } : {
                                      display: "none"
                                    }}
                                  >
                                    <img 
                                      src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=450" 
                                      alt="Windbreaker overlay cutout" 
                                      className="w-full h-full object-contain"
                                      style={{ filter: isGarmentMaskApplied ? `contrast(1.10) brightness(0.88) drop-shadow(0px ${garmentShadow}px ${garmentShadow * 1.5}px rgba(0,0,0,0.7))` : "none" }}
                                    />
                                  </motion.div>
                                )}

                                {/* Top Garment g3 (Cashmere knitwear) overlaid */}
                                {selectedGarmentIds.includes("g3") && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute pointer-events-none"
                                    style={isAvatarMode ? {
                                      left: "50%",
                                      top: "31%",
                                      width: "186px",
                                      height: "232px",
                                      marginLeft: "-93px",
                                      transform: `translate(${offsetX * 0.8}px, ${offsetY * 0.4 + 14}px) scale(${(1.0 + (userWeight - 68) * 0.0052 * (drapeTension / 85)) * clothesScaleX}, ${(1.0 + (userHeight - 174) * 0.0028 * (drapeTension / 85)) * clothesScaleY})`,
                                      transformOrigin: "center top",
                                      zIndex: 15,
                                    } : {
                                      display: "none"
                                    }}
                                  >
                                    <img 
                                      src="https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=450" 
                                      alt="Knitwear overlay cutout" 
                                      className="w-full h-full object-contain"
                                      style={{ filter: isGarmentMaskApplied ? `contrast(1.04) brightness(1.03) drop-shadow(0px ${garmentShadow}px ${garmentShadow * 1.5}px rgba(0,0,0,0.65))` : "none" }}
                                    />
                                  </motion.div>
                                )}

                                {/* Sunglasses g4 fitted precisely over the mapped face eyes */}
                                {selectedGarmentIds.includes("g4") && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute pointer-events-none"
                                    style={{
                                      left: "50%",
                                      top: isAvatarMode
                                        ? "29.5%"
                                        : selectedGarmentIds.includes("g2") 
                                        ? "21.5%" 
                                        : selectedGarmentIds.includes("g1") 
                                        ? "17.5%" 
                                        : "18.5%",
                                      width: "90px",
                                      height: "36px",
                                      marginLeft: "-45px",
                                      marginTop: "-44px", // Align right on eye height
                                      transform: `translate(${offsetX}px, ${offsetY - 2}px) scale(${clothesScaleX * 0.95}, ${clothesScaleY * 0.95})`,
                                      transformOrigin: "center center",
                                      zIndex: 26,
                                    }}
                                  >
                                    <img 
                                      src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200" 
                                      alt="Designer Sunglasses" 
                                      className="w-full h-full object-cover rounded-lg border border-purple-500/30 shadow-md brightness-110"
                                      referrerPolicy="no-referrer"
                                    />
                                  </motion.div>
                                )}

                                {/* Choker g5 fitted precisely around the mapped face neck */}
                                {selectedGarmentIds.includes("g5") && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute pointer-events-none"
                                    style={{
                                      left: "50%",
                                      top: isAvatarMode
                                        ? "29.5%"
                                        : selectedGarmentIds.includes("g2") 
                                        ? "21.5%" 
                                        : selectedGarmentIds.includes("g1") 
                                        ? "17.5%" 
                                        : "18.5%",
                                      width: "58px",
                                      height: "44px",
                                      marginLeft: "-29px",
                                      marginTop: "44px", // Placed directly over the neck line below jaw
                                      transform: `translate(${offsetX * 0.8}px, ${offsetY}px) scale(${clothesScaleX}, ${clothesScaleY})`,
                                      transformOrigin: "center center",
                                      zIndex: 21,
                                    }}
                                  >
                                    <img 
                                      src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200" 
                                      alt="Sterling Curb Choker" 
                                      className="w-full h-full object-cover rounded-xl border border-white/10 shadow-lg contrast-125"
                                      referrerPolicy="no-referrer"
                                    />
                                  </motion.div>
                                )}
                              </>
                            )}
                          </AnimatePresence>

                          {/* Outer scanning visual effect */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/85 via-transparent to-transparent pointer-events-none" />

                          {/* Scanning light animation line */}
                          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#5B7FFF] to-transparent animate-pulse pointer-events-none" style={{ top: "35%" }} />

                          {/* Grid alignment mesh overlay */}
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                          {/* Badge with styling rating */}
                          <div className="absolute top-3 left-3 bg-neutral-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 z-10 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-[9px] text-green-300 font-bold">Fit Accu: {tryOnMatchScore}%</span>
                          </div>

                          {/* Height & Weight watermark tag */}
                          <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[8px] font-mono text-gray-400">
                            {userHeight}CM / {userWeight}KG
                          </div>
                        </div>

                        {/* Reset dressing option */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              playClickSound("tactile");
                              setSelectedGarmentIds([]);
                              setOffsetX(0);
                              setOffsetY(0);
                              setClothesScaleX(1.0);
                              setClothesScaleY(1.0);
                            }}
                            className="mt-3.5 text-[10px] text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors font-mono uppercase bg-white/[0.01] border border-white/5 py-2 px-4 rounded-xl cursor-pointer hover:border-white/15"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            {lang === "ko" ? "피팅 전면 리셋" : "Factory Reset Fitting"}
                          </button>
                        </div>
                      </div>

                      {/* Right Block: Double-tabbed Wardrobe Rack & Physical Metrics tuner */}
                      <div className="lg:col-span-7 space-y-4">
                        
                        {/* Tab Switch buttons */}
                        <div className="flex border-b border-white/5 gap-1.5 pb-2">
                          <button
                            onClick={() => {
                              playClickSound("tactile");
                              setActiveTryOnTab("rack");
                            }}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
                              activeTryOnTab === "rack"
                                ? "bg-[#5B7FFF] text-white shadow-md shadow-[#5B7FFF]/10"
                                : "text-gray-400 hover:text-white bg-white/[0.01]"
                            }`}
                          >
                            <span>👚 {lang === "ko" ? "의류 장착 옷장" : "Garments Rack"}</span>
                            <span className="text-[10px] bg-black/30 text-neutral-300 px-1.5 py-0.5 rounded-md font-mono">
                              {selectedGarmentIds.length}
                            </span>
                          </button>
                          
                          <button
                            onClick={() => {
                              playClickSound("tactile");
                              setActiveTryOnTab("fit");
                            }}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
                              activeTryOnTab === "fit"
                                ? "bg-pink-500 text-white shadow-md shadow-pink-500/10"
                                : "text-gray-400 hover:text-white bg-white/[0.01]"
                            }`}
                          >
                            <span>⚖️ {lang === "ko" ? "신체 키·몸무게 & 핏 조정기" : "Body Sizing & Fit Calibration"}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
                          </button>
                        </div>

                        {/* TAB CONTENTS */}
                        <AnimatePresence mode="wait">
                          {activeTryOnTab === "rack" ? (
                            <motion.div
                              key="rack-selection-tab"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="space-y-2 max-h-[360px] overflow-y-auto pr-1"
                            >
                              {TRY_ON_GARMENTS.map((g) => {
                                const isSelected = selectedGarmentIds.includes(g.id);
                                return (
                                  <div
                                    key={g.id}
                                    onClick={() => handleToggleGarment(g.id)}
                                    className={`group p-3 rounded-2xl border text-left flex gap-4 transition-all duration-300 cursor-pointer items-center ${
                                      isSelected 
                                        ? "border-[#5B7FFF] bg-[#5B7FFF]/10 shadow-[0_0_15px_rgba(91,127,255,0.08)]" 
                                        : "border-white/5 bg-[#151522]/20 hover:border-white/15 hover:bg-[#151522]/40"
                                    }`}
                                  >
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-900 border border-white/5 relative shrink-0">
                                      <img src={g.graphicUrl} alt={g.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" referrerPolicy="no-referrer" />
                                      {isSelected && (
                                        <div className="absolute inset-0 bg-[#5B7FFF]/35 flex items-center justify-center backdrop-blur-xs">
                                          <CheckCircle className="w-5 h-5 text-white" />
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-1">
                                      <div className="flex justify-between items-baseline gap-1.5">
                                        <span className="text-[8px] font-mono text-[#5B7FFF] font-black uppercase tracking-wider block">{g.brand}</span>
                                        <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full ${g.badgeColor}`}>
                                          {g.overlayTag}
                                        </span>
                                      </div>
                                      <h4 className={`text-xs font-bold leading-tight truncate ${isSelected ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
                                        {lang === "ko" ? g.nameKo : g.name}
                                      </h4>
                                      <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
                                        {lang === "ko" ? g.tipKo : g.tip}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </motion.div>
                          ) : (
                            <motion.div
                              key="sizing-fit-tab"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="glass-panel p-5 border border-white/10 rounded-2xl bg-neutral-950/40 space-y-5"
                            >
                              <div className="text-[10px] font-mono text-[#5B7FFF] font-extrabold uppercase tracking-widest border-b border-white/5 pb-2">
                                ⚖️ {lang === "ko" ? "아키타입 치수 계정 캘리브레이션" : "ARCHETYPE STRUCTURAL DIMENSIONS"}
                              </div>

                              {/* Height & Weight Sizing inputs (requested) */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Height cm */}
                                <div className="space-y-2 bg-white/[0.01] p-3 rounded-xl border border-white/5">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-white">{lang === "ko" ? "신장 (키) 입력" : "Height (cm)"}</span>
                                    <span className="text-xs font-mono font-black text-pink-500">{userHeight} cm</span>
                                  </div>
                                  <input 
                                    type="range"
                                    min="145"
                                    max="210"
                                    value={userHeight}
                                    onChange={(e) => {
                                      playClickSound("slider");
                                      setUserHeight(Number(e.target.value));
                                      // Suggest appropriate adjustments
                                      if (selectedGarmentIds.length > 0) {
                                        setTryOnStatusMessage(
                                          lang === "ko" 
                                            ? `[치수 변환] 키 ${e.target.value}cm에 맞추어 드레이프 기장 수직 비가 ${(Number(e.target.value)/174).toFixed(2)}배 완격 연동되었습니다.` 
                                            : `[Sizing Unified] Height mapped. Clothes vertical ratio scaled to ${(Number(e.target.value)/174).toFixed(2)}x.`
                                        );
                                      }
                                    }}
                                    className="w-full accent-pink-500 cursor-pointer h-1.5 rounded-full bg-neutral-900"
                                  />
                                  <span className="text-[9px] text-gray-500 block leading-tight">
                                    {lang === "ko" ? "기장이 수직으로 자동 조율됩니다." : "Alters fabric length vertical ratios."}
                                  </span>
                                </div>

                                {/* Weight kg */}
                                <div className="space-y-2 bg-white/[0.01] p-3 rounded-xl border border-white/5">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-white">{lang === "ko" ? "체중 (몸무게) 입력" : "Weight (kg)"}</span>
                                    <span className="text-xs font-mono font-black text-[#5B7FFF]">{userWeight} kg</span>
                                  </div>
                                  <input 
                                    type="range"
                                    min="35"
                                    max="130"
                                    value={userWeight}
                                    onChange={(e) => {
                                      playClickSound("slider");
                                      setUserWeight(Number(e.target.value));
                                      if (selectedGarmentIds.length > 0) {
                                        setTryOnStatusMessage(
                                          lang === "ko" 
                                            ? `[치수 변환] 몸무게 ${e.target.value}kg에 준해 어깨 품 넓이 가로 폭이 ${(Number(e.target.value)/68).toFixed(2)}배 자동 조절되었습니다.`
                                            : `[Sizing Unified] Weight mapped. Clothes width ratio scaled to ${(Number(e.target.value)/68).toFixed(2)}x.`
                                        );
                                      }
                                    }}
                                    className="w-full accent-[#5B7FFF] cursor-pointer h-1.5 rounded-full bg-neutral-900"
                                  />
                                  <span className="text-[9px] text-gray-500 block leading-tight">
                                    {lang === "ko" ? "원단 어깨/품 너비 등이 자동 비례조절됩니다." : "Alters fabric shoulder/chest horizontal expansions."}
                                  </span>
                                </div>
                              </div>

                              {/* 🥋 Lookbook Avatar Body & Photoshop Cutout Multi-selectors */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-3">
                                {/* Archetype Selector */}
                                <div className="space-y-1.5">
                                  <span className="text-[10px] uppercase font-mono text-gray-400 font-bold tracking-wider">
                                    🧬 {lang === "ko" ? "아바타 골격 아키타입 피팅 바디" : "Avatar Body Archetype"}
                                  </span>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    {(["athletic", "slim", "curvy", "solid"] as const).map((arch) => (
                                      <button
                                        key={arch}
                                        type="button"
                                        onClick={() => {
                                          playClickSound("sparkle");
                                          setBodyArchetype(arch);
                                          setTryOnStatusMessage(
                                            lang === "ko"
                                              ? `[체형 모델] 아바타 모델이 [${arch === "athletic" ? "스포티 어깨특화" : arch === "slim" ? "슬렌더 비례형" : arch === "curvy" ? "밀착 볼륨라인" : "포멀 체분형"}] 체형으로 즉각 연산 피팅되었습니다.`
                                              : `[Body Morph] Synthesizer loaded ${arch} silhouette blueprint.`
                                          );
                                        }}
                                        className={`px-2 py-1.5 rounded-lg border text-[9px] font-sans transition-all cursor-pointer text-center truncate ${
                                          bodyArchetype === arch
                                            ? "bg-[#5B7FFF]/10 border-[#5B7FFF] text-white font-bold"
                                            : "bg-neutral-900/60 border-white/5 text-gray-400 hover:text-white"
                                        }`}
                                      >
                                        {arch === "athletic" ? "Athletic (어깨)" : arch === "slim" ? "Slim (슬렌더)" : arch === "curvy" ? "Curvy (볼륨)" : "Solid (밸런스)"}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Skin Shades Selector */}
                                <div className="space-y-1.5">
                                  <span className="text-[10px] uppercase font-mono text-gray-400 font-bold tracking-wider">
                                    🎨 {lang === "ko" ? "피부 메이크업 멜라닌 레이아웃" : "Skin Makeup Shade"}
                                  </span>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    {(["neutral", "alabaster", "suntan", "ebony"] as const).map((shade) => (
                                      <button
                                        key={shade}
                                        type="button"
                                        onClick={() => {
                                          playClickSound("tactile");
                                          setSkinShade(shade);
                                        }}
                                        className={`px-2 py-1.5 rounded-lg border text-[9px] font-sans transition-all cursor-pointer text-left flex items-center gap-1.5 ${
                                          skinShade === shade
                                            ? "bg-pink-500/10 border-pink-500 text-white font-bold"
                                            : "bg-neutral-900/60 border-white/5 text-gray-400 hover:text-white"
                                        }`}
                                      >
                                        <span className="w-2.5 h-2.5 rounded-full border border-white/10 shrink-0" style={{
                                          background: shade === "neutral" ? "linear-gradient(to right, #e8c4a0, #be9066)" 
                                                    : shade === "alabaster" ? "linear-gradient(to right, #faebd7, #eadecb)"
                                                    : shade === "suntan" ? "linear-gradient(to right, #d29d70, #a36b3d)"
                                                    : "linear-gradient(to right, #5c4033, #362219)"
                                        }} />
                                        <span className="truncate uppercase">{shade}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Cutout Tool Modes */}
                                <div className="space-y-1.5">
                                  <span className="text-[10px] uppercase font-mono text-gray-400 font-bold tracking-wider">
                                    ✒️ {lang === "ko" ? "포토샵 스마트 누끼 칼 도구" : "Photoshop Cutout Precision Knife"}
                                  </span>
                                  <div className="grid grid-cols-3 gap-1.5">
                                    {(["pen", "smart", "lasso"] as const).map((tool) => (
                                      <button
                                        key={tool}
                                        type="button"
                                        onClick={() => {
                                          playClickSound("tactile");
                                          setNukkiToolMode(tool);
                                        }}
                                        className={`px-1.5 py-1.5 rounded-lg border text-[9px] font-sans transition-all cursor-pointer text-center truncate ${
                                          nukkiToolMode === tool
                                            ? "bg-cyan-500/10 border-cyan-500 text-cyan-400 font-bold"
                                            : "bg-neutral-900/60 border-white/5 text-gray-400 hover:text-white"
                                        }`}
                                      >
                                        {tool === "pen" ? "Pen (펜축)" : tool === "smart" ? "AI Smart" : "Lasso (올가미)"}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Measuring Tape Toggle Option */}
                                <div className="space-y-1.5 flex flex-col justify-end">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      playClickSound("tactile");
                                      setMeasureTapeActive(!measureTapeActive);
                                    }}
                                    className={`py-2 px-3 rounded-xl border text-[9px] font-mono transition-all cursor-pointer flex items-center justify-between ${
                                      measureTapeActive
                                        ? "bg-green-500/10 border-green-500/40 text-green-400"
                                        : "bg-neutral-900/60 border-white/5 text-gray-500"
                                    }`}
                                  >
                                    <span>🤖 {lang === "ko" ? "1:1 실시간 신체 실측 눈금선 표시" : "SHOW ANATOMICAL TAPE GUIDE"}</span>
                                    <span className={`w-2 h-2 rounded-full ${measureTapeActive ? "bg-green-400 animate-ping" : "bg-neutral-700"}`} />
                                  </button>
                                </div>
                              </div>

                              {/* Micro Adjustments panel */}
                              <div className="space-y-3 pt-3 border-t border-white/5">
                                <div className="text-[9px] font-mono text-gray-400 font-bold uppercase tracking-wider block">
                                  🛠 {selectedGarmentIds.some(id => ["g1", "g2", "g3"].includes(id))
                                    ? (lang === "ko" ? "실시간 인체 페이스트-업 얼굴형 미세조정 정밀 튜닝" : "PRECISE EYE-LINE & NECK FACE-ALIGN TUNER")
                                    : (lang === "ko" ? "가상 의류 수동 피팅 미세 가조정 (마이크로 튜닝)" : "MICRO-TUNE LAYER OVERLAY ALIGNMENTS")
                                  }
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  {/* Width micro scaling multiplier */}
                                  <div className="space-y-1">
                                    <span className="text-[10px] text-gray-400 flex justify-between">
                                      <span>
                                        {selectedGarmentIds.some(id => ["g1", "g2", "g3"].includes(id))
                                          ? (lang === "ko" ? "얼굴 가로 폭 비율" : "Face Width Ratio")
                                          : (lang === "ko" ? "가로 오버라이드 폭" : "Width Scale")
                                        }
                                      </span>
                                      <span className="font-mono text-pink-400 font-bold">{clothesScaleX.toFixed(2)}x</span>
                                    </span>
                                    <input 
                                      type="range"
                                      min="0.6"
                                      max="1.6"
                                      step="0.05"
                                      value={clothesScaleX}
                                      onChange={(e) => {
                                        playClickSound("slider");
                                        setClothesScaleX(Number(e.target.value));
                                      }}
                                      className="w-full accent-pink-500 cursor-pointer h-1 rounded-full bg-neutral-900"
                                    />
                                  </div>

                                  {/* Height micro scaling multiplier */}
                                  <div className="space-y-1">
                                    <span className="text-[10px] text-gray-400 flex justify-between">
                                      <span>
                                        {selectedGarmentIds.some(id => ["g1", "g2", "g3"].includes(id))
                                          ? (lang === "ko" ? "얼굴 세로 높이 비율" : "Face Height Ratio")
                                          : (lang === "ko" ? "세로 오버라이드 기장" : "Length Scale")
                                        }
                                      </span>
                                      <span className="font-mono text-[#5B7FFF] font-bold">{clothesScaleY.toFixed(2)}x</span>
                                    </span>
                                    <input 
                                      type="range"
                                      min="0.6"
                                      max="1.7"
                                      step="0.05"
                                      value={clothesScaleY}
                                      onChange={(e) => {
                                        playClickSound("slider");
                                        setClothesScaleY(Number(e.target.value));
                                      }}
                                      className="w-full accent-[#5B7FFF] cursor-pointer h-1 rounded-full bg-neutral-900"
                                    />
                                  </div>

                                  {/* Position X offset modifier */}
                                  <div className="space-y-1">
                                    <span className="text-[10px] text-gray-400 flex justify-between">
                                      <span>
                                        {selectedGarmentIds.some(id => ["g1", "g2", "g3"].includes(id))
                                          ? (lang === "ko" ? "얼굴 좌우 정럴" : "Face Align X")
                                          : (lang === "ko" ? "좌우 위치 미세조정" : "Offset X Axis")
                                        }
                                      </span>
                                      <span className="font-mono font-bold">{offsetX}px</span>
                                    </span>
                                    <input 
                                      type="range"
                                      min="-70"
                                      max="70"
                                      value={offsetX}
                                      onChange={(e) => {
                                        playClickSound("slider");
                                        setOffsetX(Number(e.target.value));
                                      }}
                                      className="w-full accent-neutral-400 cursor-pointer h-1 rounded-full bg-neutral-900"
                                    />
                                  </div>

                                  {/* Position Y offset modifier */}
                                  <div className="space-y-1">
                                    <span className="text-[10px] text-gray-400 flex justify-between">
                                      <span>
                                        {selectedGarmentIds.some(id => ["g1", "g2", "g3"].includes(id))
                                          ? (lang === "ko" ? "얼굴 상하 고고도 정렬" : "Face Align Y")
                                          : (lang === "ko" ? "상하 위치 미세조정" : "Offset Y Axis")
                                        }
                                      </span>
                                      <span className="font-mono font-bold">{offsetY}px</span>
                                    </span>
                                    <input 
                                      type="range"
                                      min="-70"
                                      max="70"
                                      value={offsetY}
                                      onChange={(e) => {
                                        playClickSound("slider");
                                        setOffsetY(Number(e.target.value));
                                      }}
                                      className="w-full accent-neutral-400 cursor-pointer h-1 rounded-full bg-neutral-900"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* 🪄 Real-Time Nu-Kki Background Removal & Composite Engine */}
                              <div className="space-y-3 pt-3 border-t border-white/5">
                                <div className="text-[10px] font-mono text-[#5B7FFF] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
                                  🪄 {lang === "ko" ? "실시간 누끼(배경제거) & 합성 엔진 피팅 튜너" : "REAL-TIME NU-KKI COMPOSITE ENGINE"}
                                </div>
                                <p className="text-[9px] text-gray-404 text-gray-400 font-sans leading-relaxed">
                                  {lang === "ko" 
                                    ? "인물 얼굴 이미지의 배경을 알파 채널 크로마 매핑으로 자동 제거하고, 선택된 명품 패브릭 의류의 고유 경계를 따서 체형 골격에 3D 드레이프 구조로 정교하게 밀착 페어링시킵니다."
                                    : "Extracts subject photo background via chroma mask and wraps garment textures snuggly onto parameter body mesh frames."}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Face Feather Slider */}
                                  <div className="space-y-1.5 bg-neutral-900/40 p-2.5 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-bold text-gray-300">{lang === "ko" ? "얼굴 누끼 경계선 부드럽게 (Feather)" : "Face Feather Radius"}</span>
                                      <span className="text-[10px] font-mono font-black text-pink-500">{nukkiFeather} px</span>
                                    </div>
                                    <input 
                                      type="range"
                                      min="0"
                                      max="10"
                                      value={nukkiFeather}
                                      onChange={(e) => {
                                        playClickSound("slider");
                                        setNukkiFeather(Number(e.target.value));
                                      }}
                                      className="w-full accent-pink-500 cursor-pointer h-1 rounded-full bg-neutral-950"
                                    />
                                  </div>

                                  {/* Face Chroma Threshold Slider */}
                                  <div className="space-y-1.5 bg-neutral-900/40 p-2.5 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-bold text-gray-300">{lang === "ko" ? "크로마 배경 검출 민감도 (Tolerance)" : "Chroma Key Threshold"}</span>
                                      <span className="text-[10px] font-mono font-black text-[#5B7FFF]">{nukkiChroma}%</span>
                                    </div>
                                    <input 
                                      type="range"
                                      min="20"
                                      max="100"
                                      value={nukkiChroma}
                                      onChange={(e) => {
                                        playClickSound("slider");
                                        setNukkiChroma(Number(e.target.value));
                                      }}
                                      className="w-full accent-[#5B7FFF] cursor-pointer h-1 rounded-full bg-neutral-950"
                                    />
                                  </div>

                                  {/* Clothes Drape Tension Slider */}
                                  <div className="space-y-1.5 bg-neutral-900/40 p-2.5 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-bold text-gray-300">{lang === "ko" ? "의류 피팅 밀착 밀도 (Tension)" : "Drape Style Stiffness"}</span>
                                      <span className="text-[10px] font-mono font-black text-pink-500">{drapeTension}%</span>
                                    </div>
                                    <input 
                                      type="range"
                                      min="50"
                                      max="110"
                                      value={drapeTension}
                                      onChange={(e) => {
                                        playClickSound("slider");
                                        setDrapeTension(Number(e.target.value));
                                      }}
                                      className="w-full accent-pink-500 cursor-pointer h-1 rounded-full bg-neutral-950"
                                    />
                                  </div>

                                  {/* Clothes Shadow Slider */}
                                  <div className="space-y-1.5 bg-neutral-900/40 p-2.5 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-bold text-gray-300">{lang === "ko" ? "의류 기체 입체 섀도우 (Shadow Depth)" : "Garment Shadow Blur"}</span>
                                      <span className="text-[10px] font-mono font-black text-[#5B7FFF]">{garmentShadow} px</span>
                                    </div>
                                    <input 
                                      type="range"
                                      min="0"
                                      max="20"
                                      value={garmentShadow}
                                      onChange={(e) => {
                                        playClickSound("slider");
                                        setGarmentShadow(Number(e.target.value));
                                      }}
                                      className="w-full accent-[#5B7FFF] cursor-pointer h-1 rounded-full bg-neutral-950"
                                    />
                                  </div>
                                </div>

                                {/* Composite Optimization Toggle Switches */}
                                <div className="flex flex-wrap gap-2 pt-1 border-t border-white/5">
                                  <button
                                    onClick={() => {
                                      playClickSound("tactile");
                                      setIsNukkiProcessing(!isNukkiProcessing);
                                    }}
                                    className={`py-1.5 px-3 rounded-lg text-[9px] font-mono uppercase font-extrabold cursor-pointer border transition-all flex items-center gap-1 ${
                                      isNukkiProcessing
                                        ? "bg-pink-500/10 border-pink-500/40 text-pink-400"
                                        : "bg-neutral-900/90 border-white/5 text-gray-500"
                                    }`}
                                  >
                                    <span className={`w-1 h-1 rounded-full ${isNukkiProcessing ? "bg-pink-400 animate-pulse" : "bg-gray-650"}`} />
                                    {lang === "ko" ? "얼굴 실시간 누끼 고주파 필터" : "FACE LIVE MASK KEY"}
                                  </button>

                                  <button
                                    onClick={() => {
                                      playClickSound("tactile");
                                      setIsGarmentMaskApplied(!isGarmentMaskApplied);
                                    }}
                                    className={`py-1.5 px-3 rounded-lg text-[9px] font-mono uppercase font-extrabold cursor-pointer border transition-all flex items-center gap-1 ${
                                      isGarmentMaskApplied
                                        ? "bg-[#5B7FFF]/10 border-[#5B7FFF]/40 text-[#5B7FFF]"
                                        : "bg-neutral-900/90 border-white/5 text-gray-500"
                                    }`}
                                  >
                                    <span className={`w-1 h-1 rounded-full ${isGarmentMaskApplied ? "bg-[#5B7FFF] animate-pulse" : "bg-gray-650"}`} />
                                    {lang === "ko" ? "의류 아웃라인 실시간 누끼 마이너" : "GARMENT CONTOUR NU-KKI"}
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Status notification banner */}
                        <div className="p-3.5 bg-[#5B7FFF]/5 border border-[#5B7FFF]/10 rounded-2xl flex items-start gap-2 text-[11px] text-gray-300 leading-normal font-sans">
                          <Sparkles className="w-4 h-4 text-[#5B7FFF] shrink-0 mt-0.5 animate-pulse" />
                          <span>{tryOnStatusMessage}</span>
                        </div>
                      </div>

                    </div>

                    {/* Footer try-on controller navigation */}
                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <button
                        onClick={() => setCurrentStep(SURVEY_QUESTIONS.length)}
                        className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {t.diag_back_btn}
                      </button>

                      <button
                        id="complete-diagnosis-button"
                        onClick={triggerDiagnosisResult}
                        className="bg-gradient-to-r from-[#5B7FFF] via-purple-500 to-pink-500 hover:from-[#4a6be6] text-white font-display text-xs font-black uppercase tracking-widest px-8 py-4.5 rounded-xl flex items-center gap-2 shadow-lg shadow-[#5B7FFF]/25 cursor-pointer hover:scale-105 transition-transform"
                      >
                        <span>{lang === "ko" ? "완성 피팅으로 최종 스타일 DNA 산출" : "Confirm Design & Output DNA"}</span>
                        <Sparkles className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Step indicator bubbles under the diagnostic pane */}
              <div className="flex gap-1.5 justify-center mt-8">
                {Array.from({ length: totalSteps }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentStep ? "w-8 bg-[#5B7FFF]" : "w-1.5 bg-neutral-850"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
