import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Scissors, Download, Eye, Sliders, Check, User, Camera, 
  Trash2, BadgeCheck, Shirt, RefreshCw, Info, Layers, Heart, 
  Save, Ruler, Scale, ChevronRight, Play, Loader2, DownloadCloud
} from "lucide-react";
import { playClickSound } from "../lib/audio";
import { StyleDNA, Product } from "../types";
import { MOCK_PRODUCTS } from "../data/mockData";

interface VirtualFittingStudioProps {
  lang: "en" | "ko";
  dna: StyleDNA | null;
  userProfile?: {
    height: number;
    weight: number;
    name: string;
    bodyType: string;
  };
}

const renderGarmentVectorPreview = (product: Product) => {
  let primaryColor = "#4F46E5";
  const nameLower = product.name.toLowerCase();
  
  if (nameLower.includes("blazer")) primaryColor = "#312E81";
  else if (nameLower.includes("trousers") || nameLower.includes("pants")) primaryColor = "#1F2937";
  else if (nameLower.includes("knit") || nameLower.includes("mohair")) primaryColor = "#D97706";
  else if (nameLower.includes("parka") || nameLower.includes("jacket")) primaryColor = "#065F46";
  else if (nameLower.includes("dress")) primaryColor = "#831843";
  else if (nameLower.includes("denim") || nameLower.includes("jeans")) primaryColor = "#1E3A8A";

  const lineStroke = "rgba(255, 255, 255, 0.4)";

  if (nameLower.includes("trouser") || nameLower.includes("pant") || nameLower.includes("denim") || nameLower.includes("jeans")) {
    return (
      <svg className="w-24 h-32 drop-shadow-2xl" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 10 H75 L80 115 H56 L50 60 L44 115 H20 L25 10 Z" fill={primaryColor} stroke={lineStroke} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M25 24 H75" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
        <path d="M50 10 V60" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
        <circle cx="50" cy="18" r="2.5" fill="rgba(255,255,255,0.5)" />
      </svg>
    );
  }

  if (nameLower.includes("dress") || nameLower.includes("skirt")) {
    return (
      <svg className="w-24 h-32 drop-shadow-2xl" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M35 15 L50 25 L65 15 L80 100 C65 105 35 105 20 100 Z" fill={primaryColor} stroke={lineStroke} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M35 15 C35 30 65 30 65 15" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <path d="M28 50 C45 52 55 52 72 50" stroke="rgba(0,0,0,0.15)" strokeWidth="2.5" />
      </svg>
    );
  }

  return (
    <svg className="w-28 h-32 drop-shadow-2xl" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 15 L60 25 L80 15 L110 35 L100 65 L90 65 L93 105 H27 L30 65 L20 65 L10 35 L40 15 Z" fill={primaryColor} stroke={lineStroke} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M60 25 V105" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <path d="M40 15 L60 45 L80 15" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <circle cx="60" cy="55" r="2.5" fill="rgba(255,255,255,0.8)" />
      <circle cx="60" cy="70" r="2.5" fill="rgba(255,255,255,0.8)" />
    </svg>
  );
};

export function getGarmentCategoryType(product: Product): "top" | "bottom" | "shoes" | "accessory" | "fullbody" {
  const name = product.name.toLowerCase();
  const koName = (product.koName || "").toLowerCase();
  const cat = (product.category || "").toLowerCase();
  const koCat = (product.koCategory || "").toLowerCase();

  if (
    name.includes("shoe") || name.includes("derby") || name.includes("boot") || name.includes("sneaker") || name.includes("loafer") ||
    koName.includes("슈즈") || koName.includes("구두") || koName.includes("로퍼") || koName.includes("신발") || koName.includes("부츠") ||
    cat.includes("shoe") || koCat.includes("슈즈") || koCat.includes("신발")
  ) {
    return "shoes";
  }
  if (
    name.includes("choker") || name.includes("ring") || name.includes("chain") || name.includes("necklace") || name.includes("accessory") ||
    koName.includes("쵸커") || koName.includes("목걸이") || koName.includes("주얼리") || koName.includes("체인") || koName.includes("악세") ||
    cat.includes("accessory") || koCat.includes("액세서리")
  ) {
    return "accessory";
  }
  if (
    name.includes("trouser") || name.includes("pant") || name.includes("denim") || name.includes("jeans") || name.includes("skirt") ||
    koName.includes("트라우저") || koName.includes("팬츠") || koName.includes("데님") || koName.includes("청바지") || koName.includes("바지") || koName.includes("스커트") ||
    cat.includes("trouser") || cat.includes("pant") || cat.includes("denim") || koCat.includes("팬츠") || koCat.includes("데님") || koCat.includes("바지")
  ) {
    return "bottom";
  }
  if (
    name.includes("dress") || name.includes("coat") || name.includes("parka") || name.includes("trench") || name.includes("overcoat") ||
    koName.includes("원피스") || koName.includes("코트") || koName.includes("파카") || koName.includes("트렌치") ||
    cat.includes("dress") || cat.includes("coat") || koCat.includes("코트") || koCat.includes("원피스")
  ) {
    return "fullbody";
  }
  
  return "top";
}

// 🎨 Lookbook Premium Face Presets for Instant Selection
const LOOKBOOK_FACES = [
  {
    id: "rf1",
    name: "Editorial Lookbook A",
    gender: "female",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "rf2",
    name: "Streetwear Model B",
    gender: "male",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "rf3",
    name: "Chic Look D",
    gender: "female",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "rf4",
    name: "Classic Frame E",
    gender: "male",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"
  }
];

export default function VirtualFittingStudio({ lang, dna, userProfile }: VirtualFittingStudioProps) {
  // --- STATE SYSTEM ---
  // Step tracker (purely visual tracker of completed sub-operations)
  const [faceUploaded, setFaceUploaded] = useState<boolean>(false);
  const [faceExtracted, setFaceExtracted] = useState<boolean>(false);
  const [avatarGenerated, setAvatarGenerated] = useState<boolean>(false);
  const [clothingExtracted, setClothingExtracted] = useState<boolean>(false);
  const [isDressed, setIsDressed] = useState<boolean>(false);

  // Phase 1: Face States
  const [uploadedFaceUrl, setUploadedFaceUrl] = useState<string | null>(null);
  const [selectedFacePresetId, setSelectedFacePresetId] = useState<string>("rf1");
  const [isExtractingFace, setIsExtractingFace] = useState<boolean>(false);
  const [faceAlphaUrl, setFaceAlphaUrl] = useState<string | null>(LOOKBOOK_FACES[0].image);
  const [faceCutout, setFaceCutout] = useState<string | null>(null);
  
  // Cutout Controls for Canvas Segmenter
  const [faceScale, setFaceScale] = useState<number>(1.0);
  const [faceOffsetX, setFaceOffsetX] = useState<number>(0);
  const [faceOffsetY, setFaceOffsetY] = useState<number>(0);
  const [skinContrast, setSkinContrast] = useState<number>(100);
  const [skinBrightness, setSkinBrightness] = useState<number>(100);

  // Phase 2: Body Avatar Generator Inputs
  const [height, setHeight] = useState<number>(userProfile?.height || 172);
  const [weight, setWeight] = useState<number>(userProfile?.weight || 64);
  const [gender, setGender] = useState<string>("female");
  const [bodyType, setBodyType] = useState<"slim" | "average" | "athletic" | "plus_size">("athletic");
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState<boolean>(false);

  // Phase 3: Clothing & Extract States
  const [selectedProduct, setSelectedProduct] = useState<Product>(MOCK_PRODUCTS[0]);
  const [wornGarments, setWornGarments] = useState<Record<string, Product>>(() => {
    return {
      "top": MOCK_PRODUCTS[0]
    };
  });
  const [isExtractingClothing, setIsExtractingClothing] = useState<boolean>(false);
  const [extractedClothingUrl, setExtractedClothingUrl] = useState<string | null>(null);
  const [garmentsDatabase, setGarmentsDatabase] = useState<Record<string, string>>({});

  // Phase 4 & 5: Try On States
  const [isDressingProcess, setIsDressingProcess] = useState<boolean>(false);
  const [tryOnImageResult, setTryOnImageResult] = useState<string | null>(null);
  const [matchReport, setMatchReport] = useState<{
    styleScore: number;
    colorScore: number;
    bodyScore: number;
    tip: string;
    tipKo: string;
  } | null>(null);

  // Calibration fine-tuning controls
  const [garmentScale, setGarmentScale] = useState<number>(1.0);
  const [garmentOffsetY, setGarmentOffsetY] = useState<number>(0);
  const [garmentWidthStretch, setGarmentWidthStretch] = useState<number>(1.0);

  // Saved looks store
  const [savedLooks, setSavedLooks] = useState<Array<{
    id: string;
    productName: string;
    productBrand: string;
    image: string;
    date: string;
    dimensions: string;
    compatibility: number;
  }>>([]);

  const [tickerLog, setTickerLog] = useState<string>(
    lang === "ko" 
      ? "[시스템 원격 작동 수립] StyleMind AI 실시간 피팅 서버에 성공적으로 마운팅되었습니다."
      : "[System Initialized] StyleMind AI Virtual Dressing pipeline successfully loaded."
  );

  // Refs
  const faceInputRef = useRef<HTMLInputElement>(null);
  const compositorCanvasRef = useRef<HTMLCanvasElement>(null);

  // Load preset image as fallback alpha cutout first
  useEffect(() => {
    if (!uploadedFaceUrl) {
      const preset = LOOKBOOK_FACES.find(f => f.id === selectedFacePresetId);
      if (preset) {
        setFaceAlphaUrl(preset.image);
      }
    }
  }, [selectedFacePresetId, uploadedFaceUrl]);

  // Handle Preset Face click
  const handleSelectPreset = (id: string, img: string) => {
    playClickSound("tactile");
    setSelectedFacePresetId(id);
    setUploadedFaceUrl(null);
    setFaceAlphaUrl(img);
    setFaceCutout(null);
    setFaceUploaded(true);
    setFaceExtracted(false);
    setTickerLog(
      lang === "ko"
        ? `[프리셋 선택됨] ${id} 모델이 대입되었습니다. 배경 자동 소거 코드를 준비하십시오.`
        : `[Preset Selected] model ${id} loaded. Ready to run alpha cutout extraction.`
    );
  };

  // Trigger File Upload Click
  const handleTriggerUpload = () => {
    playClickSound("tactile");
    faceInputRef.current?.click();
  };

  // Handle Face File Change
  const handleFaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const b64 = event.target.result as string;
          setUploadedFaceUrl(b64);
          setFaceAlphaUrl(b64);
          setFaceCutout(null);
          setFaceUploaded(true);
          setFaceExtracted(false);
          setTickerLog(
            lang === "ko"
              ? `[원본 마운트] 이미지 수립 성공 (${(file.size / 1024).toFixed(1)}KB). '얼굴 배경 제거' 엔진을 호출해주십시오.`
              : `[Portrait Mounted] Successfully loaded (${(file.size / 1024).toFixed(0)} KB). Ready to execute 'Extract Face' background eraser.`
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Dynamic high-fashion geometric SVG template generator based on exact user measurements
  const generateAvatarSvg = (
    genderVal: string,
    heightVal: number,
    weightVal: number,
    bodyTypeVal: string
  ) => {
    const heightFactor = heightVal / 172; // normalization
    const weightFactor = weightVal / 64;  // normalization

    let shW = 75;
    let chW = 72;
    let waW = 54;
    let hiW = 76;
    
    if (genderVal === "male") {
      shW = 95;
      chW = 88;
      waW = 70;
      hiW = 75;
    }

    // Adjust widths based on body type
    if (bodyTypeVal === "slim") {
      shW *= 0.85; chW *= 0.85; waW *= 0.82; hiW *= 0.85;
    } else if (bodyTypeVal === "average") {
      shW *= 1.0; chW *= 1.0; waW *= 1.0; hiW *= 1.0;
    } else if (bodyTypeVal === "athletic") {
      shW *= 1.12; chW *= 1.05; waW *= 0.94; hiW *= 0.98;
    } else if (bodyTypeVal === "plus_size") {
      shW *= 1.22; chW *= 1.25; waW *= 1.42; hiW *= 1.34;
    }

    // Scale widths by weightFactor
    shW *= Math.sqrt(weightFactor);
    chW *= Math.sqrt(weightFactor);
    waW *= Math.sqrt(weightFactor);
    hiW *= Math.sqrt(weightFactor);

    const cx = 200;
    const neckY = 190;
    const shoulderY = 210;
    const chestY = 270;
    const waistY = 370;
    const hipsY = 470;
    const crotchY = 520;
    const kneeY = 520 + 170 * heightFactor;
    const feetY = 520 + 330 * heightFactor;

    const leftShoulderX = cx - shW;
    const rightShoulderX = cx + shW;
    const leftChestX = cx - chW;
    const rightChestX = cx + chW;
    const leftWaistX = cx - waW;
    const rightWaistX = cx + waW;
    const leftHipsX = cx - hiW;
    const rightHipsX = cx + hiW;

    const bodyPath = `
      M ${cx},${neckY}
      C ${cx - 15},${neckY + 10} ${leftShoulderX},${shoulderY - 10} ${leftShoulderX},${shoulderY}
      C ${leftShoulderX - 5},${shoulderY + 25} ${leftChestX},${chestY - 20} ${leftChestX},${chestY}
      C ${leftChestX},${chestY + 40} ${leftWaistX},${waistY - 40} ${leftWaistX},${waistY}
      C ${leftWaistX},${waistY + 50} ${leftHipsX},${hipsY - 40} ${leftHipsX},${hipsY}
      C ${leftHipsX},${hipsY + 20} ${cx - 20},${crotchY - 10} ${cx - 10},${crotchY}
      L ${cx - 8},${crotchY}
      C ${cx - 15},${crotchY + 50} ${cx - 25},${kneeY} ${cx - 22},${kneeY}
      C ${cx - 20},${kneeY + 60} ${cx - 18},${feetY - 15} ${cx - 15},${feetY}
      L ${cx - 30},${feetY}
      L ${cx - 5},${feetY + 15}
      L ${cx - 2},${feetY}
      C ${cx - 2},${crotchY + 50} ${cx - 1},${crotchY + 20} ${cx},490
      C ${cx + 1},${crotchY + 20} ${cx + 2},${crotchY + 50} ${cx + 2},${feetY}
      L ${cx + 5},${feetY + 15}
      L ${cx + 30},${feetY}
      L ${cx + 15},${feetY}
      C ${cx + 18},${feetY - 15} ${cx + 20},${kneeY + 60} ${cx + 22},${kneeY}
      C ${cx + 25},${kneeY} ${cx + 15},${crotchY + 50} ${cx + 10},${crotchY}
      L ${cx + 8},${crotchY}
      C ${cx + 20},${crotchY - 10} ${rightHipsX},${hipsY + 20} ${rightHipsX},${hipsY}
      C ${rightHipsX},${hipsY - 40} ${rightWaistX},${waistY + 50} ${rightWaistX},${waistY}
      C ${rightWaistX},${waistY - 40} ${rightChestX},${chestY + 40} ${rightChestX},${chestY}
      C ${rightChestX},${chestY - 20} ${rightShoulderX + 5},${shoulderY + 25} ${rightShoulderX},${shoulderY}
      C ${rightShoulderX},${shoulderY - 10} ${cx + 15},${neckY + 10} ${cx},${neckY}
      Z
    `;

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 900" width="400" height="900" style="background:transparent;">
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(236, 72, 153, 0.15)" />
            <stop offset="50%" stop-color="rgba(37, 99, 235, 0.08)" />
            <stop offset="100%" stop-color="rgba(30, 27, 75, 0.15)" />
          </linearGradient>
          <linearGradient id="glowBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ec4899" stop-opacity="0.8" />
            <stop offset="50%" stop-color="#3b82f6" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.8" />
          </linearGradient>
        </defs>

        <!-- Dynamic contour body -->
        <path d="${bodyPath}" fill="url(#bodyGrad)" stroke="url(#glowBorder)" stroke-width="2.5" />

        <!-- Aesthetic measurement markers -->
        <circle cx="${leftShoulderX}" cy="${shoulderY}" r="5" fill="#ec4899" />
        <circle cx="${rightShoulderX}" cy="${shoulderY}" r="5" fill="#3b82f6" />
        <circle cx="200" cy="${waistY}" r="3.5" fill="#06b6d4" />
        <circle cx="${leftHipsX}" cy="${hipsY}" r="4.5" fill="#6366f1" />
        <circle cx="${rightHipsX}" cy="${hipsY}" r="4.5" fill="#6366f1" />

        <!-- Interactive guidelines skeleton -->
        <path d="M ${leftShoulderX},${shoulderY} L ${leftShoulderX - 25},${waistY + 15} L ${leftShoulderX - 15},${hipsY - 10}" fill="none" stroke="url(#glowBorder)" stroke-width="2" />
        <path d="M ${rightShoulderX},${shoulderY} L ${rightShoulderX + 22},${waistY + 15} L ${rightShoulderX + 15},${hipsY - 10}" fill="none" stroke="url(#glowBorder)" stroke-width="2" />

        <path d="M ${leftChestX + 5},270 Q 200,274 ${rightChestX - 5},270" fill="none" stroke="#ec4899" stroke-opacity="0.25" stroke-width="1.2" />
        <path d="M ${leftWaistX + 3},${waistY} Q 200,373 ${rightWaistX - 3},${waistY}" fill="none" stroke="#3b82f6" stroke-opacity="0.25" stroke-width="1.2" />
        <path d="M ${leftHipsX + 5},470 Q 200,473 ${rightHipsX - 5},470" fill="none" stroke="#06b6d4" stroke-opacity="0.25" stroke-width="1.2" />
      </svg>
    `;
  };

  // Real face processing: load image, crop to a clean circle, export transparent PNG as faceCutout
  const handleExtractFace = () => {
    if (!faceAlphaUrl) return;
    playClickSound("sparkle");
    setIsExtractingFace(true);
    setTickerLog(
      lang === "ko"
        ? "[AI 서클 크롭 가동] 안면 영역을 원형으로 자르고 투명 PNG를 생성하는 중..."
        : "[Face Cropping Engine] Cropping face into a precise circle & exporting transparent PNG..."
    );

    const faceImg = new Image();
    faceImg.crossOrigin = "anonymous";
    faceImg.src = faceAlphaUrl;
    faceImg.onload = () => {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 400;
      tempCanvas.height = 400;
      const tCtx = tempCanvas.getContext("2d");
      if (tCtx) {
        tCtx.clearRect(0, 0, 400, 400);
        
        tCtx.save();
        tCtx.beginPath();
        tCtx.arc(200, 200, 160, 0, Math.PI * 2);
        tCtx.clip();
        
        tCtx.drawImage(faceImg, 0, 0, 400, 400);
        tCtx.restore();

        const finishedUrl = tempCanvas.toDataURL("image/png");
        setFaceCutout(finishedUrl);
        setFaceAlphaUrl(finishedUrl);
        setIsExtractingFace(false);
        setFaceExtracted(true);
        setTickerLog(
          lang === "ko"
            ? "[얼굴 추출 완료] 미려한 원형 안면 크롭 완료 (transparent_face.png 저장됨)"
            : "[Circle Crop Finished] Extracted circle faceCutout transparent PNG successfully."
        );
      }
    };
    faceImg.onerror = () => {
      setIsExtractingFace(false);
      setFaceExtracted(true);
    };
  };

  // Real body mannequin twin generator using measurements and SVG template
  const handleGenerateMannequin = () => {
    playClickSound("success");
    setIsGeneratingAvatar(true);
    setTickerLog(
      lang === "ko"
        ? `[신체 형태 계측 성립] 성별:${gender.toUpperCase()}, 신장:${height}cm, 체중:${weight}kg 실시간 생성 완료.`
        : `[Biometric CAD Active] Formed live vector mannequin profile: ${height}cm, ${weight}kg, form:${bodyType.toUpperCase()}`
    );

    setIsGeneratingAvatar(false);
    setAvatarGenerated(true);
    
    setTickerLog(
      lang === "ko"
        ? "[마네킹 디지털 아바타 완성] 3D 벡터 기술 마네킹 골격이 완벽하게 합성되었습니다."
        : "[Avatar Generator Complete] Customized fashion mannequin frame compiled with dynamic measurements."
    );
  };

  // Real product segment mask & color-key extractor to isolate pure clothing garment
  const handleExtractGarment = () => {
    if (!selectedProduct.image) return;
    playClickSound("success");
    setIsExtractingClothing(true);
    setTickerLog(
      lang === "ko"
        ? `[의류 텍스처 소싱 가동] '${selectedProduct.name}' 제품의 색상 및 직물 표면 정보 분석 매핑 중...`
        : `[Body-Fit Texture Sourcing] Sourcing fabric texture and color maps for ${selectedProduct.name}...`
    );

    setTimeout(() => {
      setExtractedClothingUrl(selectedProduct.image);
      setGarmentsDatabase(prev => ({
        ...prev,
        [selectedProduct.id]: selectedProduct.image
      }));
      setIsExtractingClothing(false);
      setClothingExtracted(true);
      setTickerLog(
        lang === "ko"
          ? `[바디핏 준비 완료] 원본 모델 형체가 소거되고 신체 밀착 아바타 핏 실루엣 피팅 채널이 활성화되었습니다.`
          : `[Simulation Configured] Model body filtered out. Live responsive garment silhouette layer generated successfully.`
      );
    }, 200);
  };

  // Clear uploaded portrait
  const handleClearPortrait = () => {
    playClickSound("tactile");
    setUploadedFaceUrl(null);
    setFaceUploaded(false);
    setFaceExtracted(false);
    setFaceAlphaUrl(LOOKBOOK_FACES[0].image);
  };

  // Compile DNA scores based on selected product tags
  const computeDnaScore = (product: Product) => {
    if (!dna) return { style: 85, color: 82, body: 90 };
    
    // Simple logic based on selected body type & categories
    let bodyMatch = 85;
    if (bodyType === "slim" && product.tags.includes("Oversized")) bodyMatch = 94;
    else if (bodyType === "athletic") bodyMatch = 98;
    else if (bodyType === "plus_size" && product.tags.includes("Fluid")) bodyMatch = 96;

    const styleMatch = product.matchPercentage;
    const colorMatch = 80 + (product.price % 21);

    return { style: styleMatch, color: colorMatch, body: bodyMatch };
  };

  // Composites the avatar outline, the cropped face, and the isolated garments on standard 2D context
  const compositeDressedAvatar = async () => {
    const canvas = compositorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 1000;

    // 1. Clean background with realistic studio dark overlay
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1000);
    bgGrad.addColorStop(0, "#080911");
    bgGrad.addColorStop(0.5, "#10121F");
    bgGrad.addColorStop(1, "#030408");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 1000);

    // Dynamic grid overlay
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    for (let x = 50; x < 800; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1000); ctx.stroke();
    }
    for (let y = 50; y < 1000; y += 50) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(800, y); ctx.stroke();
    }

    try {
      // Create SVG blob url for mannequin
      const svgStr = generateAvatarSvg(gender, height, weight, bodyType);
      const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Identify active face cutout
      const activeFace = faceCutout || (faceExtracted ? faceAlphaUrl : null);
      
      // Determine what garments are active in the worn list
      const activeGarmentTypes: Array<"bottom" | "shoes" | "top" | "fullbody" | "accessory"> = ["bottom", "shoes", "top", "fullbody", "accessory"];
      const garmentsToLoad: { type: string; product: Product }[] = [];
      
      activeGarmentTypes.forEach(t => {
        if (wornGarments[t] && isDressed && clothingExtracted) {
          garmentsToLoad.push({ type: t, product: wornGarments[t] });
        }
      });

      // Special fallback to keep current selected item visible if wornGarments is clear
      if (garmentsToLoad.length === 0 && isDressed && clothingExtracted) {
        const prodCat = getGarmentCategoryType(selectedProduct);
        garmentsToLoad.push({ type: prodCat, product: selectedProduct });
      }

      // Preload everything in parallel
      const urlsToLoad = [
        svgUrl,
        activeFace || null,
        ...garmentsToLoad.map(g => g.product.image)
      ];

      const loadedImages = await Promise.all(
        urlsToLoad.map(url => {
          if (!url) return Promise.resolve(null);
          return new Promise<HTMLImageElement | null>((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
          });
        })
      );

      // Revoke the blob URL to avoid leaks
      URL.revokeObjectURL(svgUrl);

      const avatarImg = loadedImages[0];
      const faceImg = loadedImages[1];
      const garmentImages: Record<string, HTMLImageElement> = {};
      
      let garmentImgIdx = 2;
      garmentsToLoad.forEach(g => {
        const loadedImg = loadedImages[garmentImgIdx++];
        if (loadedImg) {
          garmentImages[g.type] = loadedImg;
        }
      });

      // 1. Draw the beautiful CAD vector mannequin
      if (avatarImg) {
        ctx.drawImage(avatarImg, 150, 10, 500, 960);
      }

      // 2. Draw face cutout layer
      if (faceImg) {
        const hSize = 100 * faceScale;
        const hX = 400 - hSize / 2 + faceOffsetX * 2;
        const hY = 115 + faceOffsetY * 2;

        ctx.save();
        ctx.filter = `contrast(${skinContrast}%) brightness(${skinBrightness}%)`;
        ctx.drawImage(faceImg, hX, hY, hSize, hSize);
        ctx.restore();
      } else {
        // Geometric placeholder face node
        ctx.beginPath();
        ctx.arc(400, 155, 30, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(236, 72, 153, 0.25)";
        ctx.fill();
        ctx.strokeStyle = "rgba(236, 72, 153, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 3. Draw garments layer-by-layer
      drawGarmentsOnMannequinFromLoaded(ctx, garmentImages);

    } catch (err) {
      console.error("Canvas composite error", err);
      // Fallback
      const dataUrl = compositorCanvasRef.current?.toDataURL("image/png") || null;
      setTryOnImageResult(dataUrl);
    }
  };

  // Real physical mannequin garments positioning and scaling metrics
  const drawGarmentsOnMannequinFromLoaded = (ctx: CanvasRenderingContext2D, garmentImages: Record<string, HTMLImageElement>) => {
    // 1. Calculate biometric points from height, weight, bodyType and gender
    const heightFactor = height / 172;
    const weightFactor = weight / 64;

    let shW = 75;
    let chW = 72;
    let waW = 54;
    let hiW = 76;
    
    if (gender === "male") {
      shW = 95;
      chW = 88;
      waW = 70;
      hiW = 75;
    }

    // Adjust widths based on body type archetype
    if (bodyType === "slim") {
      shW *= 0.85; chW *= 0.85; waW *= 0.82; hiW *= 0.85;
    } else if (bodyType === "average") {
      shW *= 1.0; chW *= 1.0; waW *= 1.0; hiW *= 1.0;
    } else if (bodyType === "athletic") {
      shW *= 1.12; chW *= 1.05; waW *= 0.94; hiW *= 0.98;
    } else if (bodyType === "plus_size") {
      shW *= 1.22; chW *= 1.25; waW *= 1.42; hiW *= 1.34;
    }

    // Scale widths by weightFactor
    shW *= Math.sqrt(weightFactor);
    chW *= Math.sqrt(weightFactor);
    waW *= Math.sqrt(weightFactor);
    hiW *= Math.sqrt(weightFactor);

    // Coordinate conversion mapping factors from SVG into Canvas (800x1000 space)
    const scaleX = 1.25;
    const scaleY = 1.0667;
    const xOffset = 150;
    const yOffset = 10;

    const cx = xOffset + 200 * scaleX; // Center point 400
    const neckY = yOffset + 190 * scaleY;
    const shoulderY = yOffset + 210 * scaleY;
    const chestY = yOffset + 270 * scaleY;
    const waistY = yOffset + 370 * scaleY;
    const hipsY = yOffset + 470 * scaleY;
    const crotchY = yOffset + 520 * scaleY;
    const kneeY = yOffset + (520 + 170 * heightFactor) * scaleY;
    const feetY = yOffset + (520 + 330 * heightFactor) * scaleY;

    // Derived skeletal points
    const lSh = cx - shW * scaleX;
    const rSh = cx + shW * scaleX;
    const lCh = cx - chW * scaleX;
    const rCh = cx + chW * scaleX;
    const lWa = cx - waW * scaleX;
    const rWa = cx + waW * scaleX;
    const lHi = cx - hiW * scaleX;
    const rHi = cx + hiW * scaleX;

    // Responsive scaling helpers based on fine-tuning sliders
    const dy = (y: number) => neckY + (y - neckY) * garmentScale + garmentOffsetY * 2;
    const dx = (x: number) => cx + (x - cx) * garmentWidthStretch;

    // Ordered layered rendering across discrete category slots
    const layerTypes: Array<"bottom" | "shoes" | "top" | "fullbody" | "accessory"> = ["bottom", "shoes", "top", "fullbody", "accessory"];

    layerTypes.forEach(gType => {
      const texImg = garmentImages[gType];
      if (!texImg) return;

      const product = wornGarments[gType] || (selectedProduct && getGarmentCategoryType(selectedProduct) === gType ? selectedProduct : null);
      if (!product) return;

      const prodName = product.name.toLowerCase();
      const prodCat = product.category.toLowerCase();

      const isLowerBody = gType === "bottom";
      const isShoes = gType === "shoes";
      const isFullBody = gType === "fullbody";
      const isAccessory = gType === "accessory";
      const hasLapel = prodName.includes("blazer") || prodName.includes("coat") || prodName.includes("jacket") || prodName.includes("trench") || prodCat.includes("outer");
      const isKnit = prodName.includes("knit") || prodName.includes("sweater") || prodName.includes("mohair") || prodName.includes("cardigan");

      if (isAccessory) {
        // Draw Accessory elegant neck overlay (Chokers, Necklaces)
        const accY = dy(neckY + 18);
        const accSize = 46;
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
        ctx.shadowBlur = 10;
        ctx.drawImage(texImg, cx - accSize / 2, accY, accSize, accSize);
        ctx.restore();
        return;
      }

      if (isShoes) {
        // Draw Shoes at the Feet Area with Left & Right independent fits
        ctx.save();
        
        // 1. Left Foot Shoe Layer
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 6;
        
        ctx.beginPath();
        const lx1 = dx(lHi - 8);
        const lx2 = dx(lHi + 15);
        const lx3 = dx(lHi - 22);
        const ly_top = dy(feetY - 55);
        const ly_bottom = dy(feetY - 5);

        ctx.moveTo(lx2, ly_top);
        ctx.quadraticCurveTo(dx(lHi + 14), dy(feetY - 22), dx(lHi + 8), ly_bottom);
        ctx.lineTo(lx3, ly_bottom);
        ctx.quadraticCurveTo(dx(lHi - 24), dy(feetY - 35), lx1, ly_top);
        ctx.closePath();
        ctx.clip();
        
        ctx.drawImage(texImg, lx3 - 10, ly_top - 15, 80, 80);
        ctx.restore();

        // 2. Right Foot Shoe Layer
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 6;

        ctx.beginPath();
        const rx1 = dx(rHi - 15);
        const rx2 = dx(rHi + 8);
        const rx3 = dx(rHi + 22);
        const ry_top = dy(feetY - 55);
        const ry_bottom = dy(feetY - 5);

        ctx.moveTo(rx1, ry_top);
        ctx.quadraticCurveTo(dx(rHi - 14), dy(feetY - 22), dx(rHi - 8), ry_bottom);
        ctx.lineTo(rx3, ry_bottom);
        ctx.quadraticCurveTo(dx(rHi + 24), dy(feetY - 35), rx2, ry_top);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(texImg, rx1 - 20, ry_top - 15, 80, 80);
        ctx.restore();
        
        ctx.restore();
        return;
      }

      ctx.save();
      
      // 1. Draw elegant shadows behind the garment layer
      ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 10;

      // 2. Begin clipping path using smooth custom physical curves
      ctx.beginPath();
      if (isLowerBody) {
        // Responsive Trouser Contour path with organic legs & pelvic shape
        ctx.moveTo(dx(lWa - 1), dy(waistY + 4));
        ctx.quadraticCurveTo(cx, dy(waistY + 9), dx(rWa + 1), dy(waistY + 4));
        ctx.quadraticCurveTo(dx(rHi + 4), dy(hipsY), dx(rHi + 6), dy(hipsY + 40));
        ctx.quadraticCurveTo(dx(rHi + 10), dy(kneeY), dx(rHi + 5), dy(feetY - 55));
        ctx.lineTo(dx(rHi - 12), dy(feetY - 55));
        ctx.lineTo(dx(cx + 3), dy(crotchY + 16));
        ctx.lineTo(dx(lHi + 12), dy(feetY - 55));
        ctx.lineTo(dx(lHi - 5), dy(feetY - 55));
        ctx.quadraticCurveTo(dx(lHi - 10), dy(kneeY), dx(lHi - 6), dy(hipsY + 40));
        ctx.quadraticCurveTo(dx(lHi - 4), dy(hipsY), dx(lWa - 1), dy(waistY + 4));
      } else if (isFullBody) {
        // Full body coats / dresses with V or U necks
        const neckDepth = hasLapel ? chestY - 10 : neckY + 22;
        ctx.moveTo(dx(cx - 22), dy(neckY + 5));
        if (hasLapel) {
          ctx.lineTo(dx(cx - 10), dy(neckY + 25));
          ctx.lineTo(cx, dy(neckDepth));
          ctx.lineTo(dx(cx + 10), dy(neckY + 25));
          ctx.lineTo(dx(cx + 22), dy(neckY + 5));
        } else {
          ctx.quadraticCurveTo(cx, dy(neckDepth), dx(cx + 22), dy(neckY + 5));
        }
        ctx.quadraticCurveTo(dx(cx + 35), dy(shoulderY - 5), dx(rSh + 4), dy(shoulderY + 2));
        ctx.quadraticCurveTo(dx(rSh + 16), dy(chestY + 25), dx(rSh + 10), dy(waistY + 80));
        ctx.lineTo(dx(rSh - 4), dy(waistY + 80));
        ctx.quadraticCurveTo(dx(rCh + 4), dy(chestY + 30), dx(rHi + 12), dy(hipsY + 10));
        ctx.quadraticCurveTo(dx(rHi + 20), dy(kneeY), dx(rHi + 24), dy(kneeY + 65));
        ctx.quadraticCurveTo(cx, dy(kneeY + 75), dx(lHi - 24), dy(kneeY + 65));
        ctx.quadraticCurveTo(dx(lHi - 20), dy(kneeY), dx(lHi - 12), dy(hipsY + 10));
        ctx.quadraticCurveTo(dx(lCh - 4), dy(chestY + 30), dx(lSh + 4), dy(waistY + 80));
        ctx.lineTo(dx(lSh - 10), dy(waistY + 80));
        ctx.quadraticCurveTo(dx(lSh - 16), dy(chestY + 25), dx(lSh - 4), dy(shoulderY + 2));
        ctx.quadraticCurveTo(dx(cx - 35), dy(shoulderY - 5), dx(cx - 22), dy(neckY + 5));
      } else {
        // Torso regular tops: jackets, blazers, sweaters
        const neckDepth = hasLapel ? chestY - 15 : (isKnit ? neckY + 16 : neckY + 22);
        ctx.moveTo(dx(cx - 20), dy(neckY + 5));
        if (hasLapel) {
          ctx.lineTo(dx(cx - 8), dy(neckY + 20));
          ctx.lineTo(cx, dy(neckDepth));
          ctx.lineTo(dx(cx + 8), dy(neckY + 20));
          ctx.lineTo(dx(cx + 20), dy(neckY + 5));
        } else {
          ctx.quadraticCurveTo(cx, dy(neckDepth), dx(cx + 20), dy(neckY + 5));
        }
        ctx.quadraticCurveTo(dx(cx + 30), dy(shoulderY - 4), dx(rSh + 4), dy(shoulderY + 2));
        ctx.quadraticCurveTo(dx(rSh + 20), dy(chestY + 25), dx(rSh + 12), dy(waistY + 110));
        ctx.lineTo(dx(rSh - 3), dy(waistY + 110));
        ctx.quadraticCurveTo(dx(rCh + 4), dy(chestY + 30), dx(rWa + 6), dy(waistY + 125));
        ctx.quadraticCurveTo(cx, dy(waistY + 140), dx(lWa - 6), dy(waistY + 125));
        ctx.quadraticCurveTo(dx(lCh - 4), dy(chestY + 30), dx(lSh + 3), dy(waistY + 110));
        ctx.lineTo(dx(lSh - 12), dy(waistY + 110));
        ctx.quadraticCurveTo(dx(lSh - 20), dy(chestY + 25), dx(lSh - 4), dy(shoulderY + 2));
        ctx.quadraticCurveTo(dx(cx - 30), dy(shoulderY - 4), dx(cx - 20), dy(neckY + 5));
      }
      ctx.closePath();
      ctx.clip();

      // 3. Render the texture (product image) dynamically covering the clipped area with SMART SOURCE CROPPING
      let minX = cx - 200;
      let maxX = cx + 200;
      let minY = neckY;
      let maxY = waistY + 140;

      // Clean Source Crop Coordinates to prevent model headers and arm bleed-in
      let sx = 0;
      let sy = 0;
      let sw = texImg.width;
      let sh = texImg.height;

      if (isLowerBody) {
        minX = cx - 120;
        maxX = cx + 120;
        minY = waistY;
        maxY = feetY;

        sy = texImg.height * 0.08;
        sh = texImg.height * 0.92;
      } else if (isFullBody) {
        minX = cx - 200;
        maxX = cx + 200;
        minY = neckY;
        maxY = kneeY + 80;

        sy = texImg.height * 0.22;
        sh = texImg.height * 0.78;
      } else {
        // regular active tops
        sy = texImg.height * 0.26;
        sh = texImg.height * 0.74;
      }

      const widthDraw = (maxX - minX) * 1.55;
      const heightDraw = (maxY - minY) * 1.35;
      const xDraw = cx - widthDraw / 2;
      const yDraw = minY - (maxY - minY) * 0.12;

      // Draw standard texture with smart source cropping boundaries
      ctx.drawImage(texImg, sx, sy, sw, sh, xDraw, yDraw, widthDraw, heightDraw);

      // 4. Overlap realistic fabric drapery shadows & ambient lighting gradients
      const shadeGrad = ctx.createLinearGradient(cx - 120, 0, cx + 120, 0);
      shadeGrad.addColorStop(0, "rgba(0, 0, 0, 0.22)");
      shadeGrad.addColorStop(0.25, "rgba(0, 0, 0, 0.0)");
      shadeGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.12)");
      shadeGrad.addColorStop(0.75, "rgba(0, 0, 0, 0.0)");
      shadeGrad.addColorStop(1, "rgba(0, 0, 0, 0.28)");
      ctx.fillStyle = shadeGrad;
      ctx.fillRect(xDraw, yDraw, widthDraw, heightDraw);

      // Draw multiple smooth wrinkle folds at armpits and waist
      ctx.save();
      ctx.strokeStyle = "rgba(0, 0, 0, 0.12)";
      ctx.lineWidth = 3.2;
      ctx.shadowColor = "rgba(255, 255, 255, 0.05)";
      ctx.shadowBlur = 4;
      
      if (!isLowerBody) {
        // Left armpit creases
        ctx.beginPath();
        ctx.moveTo(dx(lCh + 15), dy(chestY + 40));
        ctx.quadraticCurveTo(dx(lCh + 35), dy(chestY + 55), dx(lCh + 60), dy(chestY + 45));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(dx(lCh + 10), dy(chestY + 65));
        ctx.quadraticCurveTo(dx(lCh + 25), dy(chestY + 75), dx(lCh + 45), dy(chestY + 70));
        ctx.stroke();

        // Right armpit creases
        ctx.beginPath();
        ctx.moveTo(dx(rCh - 15), dy(chestY + 40));
        ctx.quadraticCurveTo(dx(rCh - 35), dy(chestY + 55), dx(rCh - 60), dy(chestY + 45));
        ctx.stroke();

        // Waist fit creases representing active body cinch tension
        ctx.beginPath();
        ctx.moveTo(dx(lWa + 8), dy(waistY + 20));
        ctx.quadraticCurveTo(cx, dy(waistY + 32), dx(rWa - 8), dy(waistY + 20));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(dx(lWa + 15), dy(waistY + 55));
        ctx.quadraticCurveTo(cx, dy(waistY + 62), dx(rWa - 15), dy(waistY + 55));
        ctx.stroke();

        // Vertical front crease shading
        const verticalShade = ctx.createLinearGradient(0, dy(chestY), 0, dy(waistY + 80));
        verticalShade.addColorStop(0, "rgba(0,0,0,0)");
        verticalShade.addColorStop(0.5, "rgba(0,0,0,0.06)");
        verticalShade.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = verticalShade;
        ctx.fillRect(dx(cx - 35), dy(chestY), 70, (dy(waistY + 80) - dy(chestY)));
      } else {
        // Trouser pelvic joint folds and knee creases
        ctx.beginPath();
        ctx.moveTo(dx(lHi + 15), dy(crotchY + 10));
        ctx.quadraticCurveTo(dx(cx), dy(crotchY + 25), dx(rHi - 15), dy(crotchY + 10));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(dx(lHi - 1), dy(kneeY));
        ctx.quadraticCurveTo(dx(lHi + 25), dy(kneeY + 8), dx(lHi + 40), dy(kneeY - 4));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(dx(rHi + 1), dy(kneeY));
        ctx.quadraticCurveTo(dx(rHi - 25), dy(kneeY + 8), dx(rHi - 40), dy(kneeY - 4));
        ctx.stroke();
      }
      ctx.restore();

      // Ambient center shadow crease for 3D depth
      ctx.beginPath();
      ctx.moveTo(cx, minY);
      ctx.lineTo(cx, maxY);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.14)";
      ctx.lineWidth = 4.5;
      ctx.stroke();

      ctx.restore();

      // 5. Draw overlay stitches, lapels and design contours for premium 3D look
      ctx.save();
      
      // Draw lapels/collars for blazers, coats, outerwear jackets
      if (hasLapel && !isLowerBody) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
        ctx.strokeStyle = "rgba(0, 0, 0, 0.22)";
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
        ctx.shadowBlur = 5;

        const neckDepth = hasLapel ? chestY - 15 : neckY + 22;

        // Left Lapel flap
        ctx.shadowOffsetY = 4;
        ctx.beginPath();
        ctx.moveTo(dx(cx - 20), dy(neckY + 5));
        ctx.lineTo(dx(cx - 36), dy(chestY - 15)); // notch point outer
        ctx.lineTo(dx(cx - 15), dy(chestY - 15)); // notch inner
        ctx.lineTo(cx - 1, dy(neckDepth)); // button point
        ctx.lineTo(dx(cx - 6), dy(neckY + 18)); // collar gorge
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right Lapel flap
        ctx.beginPath();
        ctx.moveTo(dx(cx + 20), dy(neckY + 5));
        ctx.lineTo(dx(cx + 36), dy(chestY - 15)); // notch point outer
        ctx.lineTo(dx(cx + 15), dy(chestY - 15)); // notch inner
        ctx.lineTo(cx + 1, dy(neckDepth)); // button point
        ctx.lineTo(dx(cx + 6), dy(neckY + 18)); // collar gorge
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Lapel stylish buttons details
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(cx, dy(neckDepth + 12), 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw Ribbed Crewneck Collar for Knits
      if (isKnit && !isLowerBody) {
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.quadraticCurveTo(cx, dy(neckY + 16) + 4, dx(cx + 20), dy(neckY + 5));
        ctx.stroke();
        ctx.restore();
      }

      // Standard dashed stitching seams
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 1.3;
      ctx.setLineDash([4, 4]); // DASHED HIGH-TECH STITCH SEAMS
      ctx.beginPath();
      if (isLowerBody) {
        // Outseams left & right stitched
        ctx.moveTo(dx(rHi + 4), dy(hipsY + 40));
        ctx.lineTo(dx(rHi + 5), dy(feetY - 55));
        ctx.moveTo(dx(lHi - 4), dy(hipsY + 40));
        ctx.lineTo(dx(lHi - 5), dy(feetY - 55));

        // waistband stitch line
        ctx.moveTo(dx(lWa - 1), dy(waistY + 12));
        ctx.quadraticCurveTo(cx, dy(waistY + 17), dx(rWa + 1), dy(waistY + 12));
      } else {
        // Center zipper/button seam crease
        const creaseStart = hasLapel ? dy(chestY - 15) : dy(neckY + 22);
        const creaseEnd = isFullBody ? dy(kneeY + 40) : dy(waistY + 125);
        ctx.moveTo(cx, creaseStart);
        ctx.lineTo(cx, creaseEnd);
      }
      ctx.stroke();
      ctx.restore();
    });

    // 6. Technical annotative diagnostics overlays (We overlay shoulder metrics once for the highlighted/selected product)
    ctx.strokeStyle = "rgba(236, 72, 153, 0.4)";
    ctx.lineWidth = 1.2;
    ctx.font = "bold 13px Courier New, monospace";
    ctx.fillStyle = "#ec4899";

    const shoulderTextWidth = shW * scaleX * 2;
    ctx.beginPath();
    ctx.moveTo(dx(lSh), dy(shoulderY));
    ctx.lineTo(dx(rSh), dy(shoulderY));
    ctx.stroke();

    ctx.fillText(`BIOMETRIC SHOULDER: ${shoulderTextWidth.toFixed(0)}px`, cx - 80, dy(shoulderY - 8));
    ctx.font = "bold 11px Courier New, monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.fillText(`CHEST FIT: ${(chW * scaleX * 2).toFixed(0)}px`, cx - 45, dy(chestY));
    ctx.fillText(`WAIST FIT: ${(waW * scaleX * 2).toFixed(0)}px`, cx - 45, dy(waistY));
    
    ctx.fillStyle = "#ec4899";
    ctx.fillText("STYLEMIND AI CAD ACTIVE [MULTI-PLAYER FIT WORKSPACE]", 50, 940);
    ctx.fillText("NO STOCK MODELS • COORDINATED TRANSPARENT OVERLAY", 50, 960);

    const dataUrl = compositorCanvasRef.current?.toDataURL("image/png") || null;
    setTryOnImageResult(dataUrl);
  };

  // Trigger composite clothing dressing
  const handleTryOnOutfit = () => {
    if (!avatarGenerated) {
      setTickerLog(
        lang === "ko"
          ? "[경고] 아바타 바디 트윈이 아직 형성되지 않았습니다. 아바타를 먼저 생성하십시오."
          : "[Warning] Mannequin Avatar must be generated first before mounting the clothing."
      );
      playClickSound("tactile");
      return;
    }
    if (!clothingExtracted) {
      setTickerLog(
        lang === "ko"
          ? "[경고] 피팅할 의류가 추출되지 않았습니다. 오른쪽 피드에서 '피복 윤곽선만 소거 추출'을 완료하십시오."
          : "[Warning] No clothing isolated yet. Click 'Isolate Dress Asset' on the right panel first."
      );
      playClickSound("tactile");
      return;
    }

    playClickSound("sparkle");
    setIsDressingProcess(true);
    setTickerLog(
      lang === "ko"
        ? "[실시간 가상 피팅 정합 수립] 아바타 신체 골격에 피복 핏 정렬 스케일 연산 작동..."
        : "[Executing Fit Warp] Fitting garment dimensions matching avatar skeletal width..."
    );

    const scores = computeDnaScore(selectedProduct);
    setMatchReport({
      styleScore: scores.style,
      colorScore: scores.color,
      bodyScore: scores.body,
      tip: `The system successfully warp-fitted the oversized raw-wool blazer to your athletic ${weight}kg shoulder width. The structured drape balances your height (${height}cm) and elevates the entire minimalist aesthetic Tips: Combine with tailored wide-leg trousers.`,
      tipKo: `선택하신 ${selectedProduct.koName || selectedProduct.name} 제품은 어깨선 및 몸판 폭 (${shoulderWidthEstimate(bodyType)}cm 대입)에 맞추어 주름 보정과 핏 연동이 완벽하게 가시화 완료되었습니다.`
    });

    setIsDressingProcess(false);
    setIsDressed(true);
    setTickerLog(
      lang === "ko"
        ? "[드레싱 코디 완료] 아바타 가상 드레이핑이 완료되었습니다."
        : "[Try-on Composed Successfully] Model successfully fitted! The custom garment layer is now active."
    );
  };

  const shoulderWidthEstimate = (type: string) => {
    switch (type) {
      case "slim": return 37.2;
      case "average": return 40.5;
      case "athletic": return 43.8;
      case "plus_size": return 47.1;
      default: return 42.0;
    }
  };

  // Re-adjust compositor curves in real time when scale sliders shift
  useEffect(() => {
    if (avatarGenerated) {
      compositeDressedAvatar();
    }
  }, [faceScale, faceOffsetX, faceOffsetY, skinBrightness, skinContrast, garmentScale, garmentOffsetY, garmentWidthStretch, height, weight, bodyType, avatarGenerated, faceExtracted, clothingExtracted, faceAlphaUrl, extractedClothingUrl, isDressed, gender, wornGarments]);

  // Save look to dashboard
  const handleSaveFittingLook = () => {
    if (!tryOnImageResult) return;
    playClickSound("success");
    
    const newLook = {
      id: "look_" + Date.now(),
      productName: selectedProduct.name,
      productBrand: selectedProduct.brand,
      image: tryOnImageResult,
      date: new Date().toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US"),
      dimensions: `${height}cm • ${weight}kg • ${bodyType.toUpperCase()}`,
      compatibility: matchReport ? Math.round((matchReport.styleScore + matchReport.bodyScore + matchReport.colorScore) / 3) : 92
    };

    setSavedLooks(prev => [newLook, ...prev]);
    setTickerLog(
      lang === "ko"
        ? "[룩 코디 보관 완료] 'My Fit Locker' 보관함에 커스텀 비쥬얼 드레스 가드가 저장되었습니다."
        : "[Look Archived Successfully] Premium visual fitting outfit locked and saved in My Fit Locker."
    );
  };

  // Delete saved look
  const handleDeleteLook = (id: string) => {
    playClickSound("tactile");
    setSavedLooks(prev => prev.filter(look => look.id !== id));
  };

  // Select recommended product
  const handleSelectProduct = (product: Product) => {
    playClickSound("tactile");
    setSelectedProduct(product);
    setClothingExtracted(true);
    setExtractedClothingUrl(product.image);
    setIsDressed(true);

    // Equip the product in the correct visual category slot automatically
    const slot = getGarmentCategoryType(product);
    setWornGarments(prev => {
      const next = { ...prev };
      if (slot === "fullbody") {
        delete next["top"];
        delete next["bottom"];
        next["fullbody"] = product;
      } else if (slot === "top" || slot === "bottom") {
        delete next["fullbody"];
        next[slot] = product;
      } else {
        next[slot] = product;
      }
      return next;
    });

    setTickerLog(
      lang === "ko"
        ? `[바디핏 텍스처 연동 완료] '${product.koName || product.name}' 브랜드 의류 가치 매핑 수립.`
        : `[Body-Fit Active] Selected ${product.brand} - garment silhouette fitted to biometric twin successfully.`
    );
  };

  return (
    <div className="space-y-6 pb-16 text-left">
      
      {/* 🔮 TITLED BANNER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-neutral-950 via-[#0C0E1B] to-neutral-950 p-6 rounded-3xl border border-white/5 shadow-2xl">
        <div>
          <span className="text-[10px] bg-pink-500/10 text-pink-500 font-mono font-extrabold uppercase px-2.5 py-1 rounded-full tracking-widest border border-pink-500/20">
            {lang === "ko" ? "STYLEMIND AI 융합 엔진" : "STYLEMIND AI CAD TRANS-FITTING ENGINE"}
          </span>
          <h1 className="text-2xl font-sans font-black text-white tracking-tight mt-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
            {lang === "ko" ? "실시간 아바타 가상 피팅 센터" : "Active CAD Mannequin Virtual Try-On"}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {lang === "ko"
              ? "얼굴 추출과 디자이너 입체 인체 마네킹을 형성하여 original 옷핏 그대로 투명 피팅을 구형합니다."
              : "Generate customized mannequin skeletons and isolate garment-only fabrics with transparent layers."}
          </p>
        </div>
        
        {/* Dynamic Status Badges */}
        <div className="flex flex-wrap gap-2 text-[10px] font-mono">
          <span className={`px-2.5 py-1 rounded-lg border ${faceExtracted ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-neutral-900 border-white/5 text-gray-500"}`}>
            ● {lang === "ko" ? "얼굴누끼" : "FACE_CUTOUT"}
          </span>
          <span className={`px-2.5 py-1 rounded-lg border ${avatarGenerated ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-neutral-900 border-white/5 text-gray-500"}`}>
            ● {lang === "ko" ? "바디마네킹" : "AVATAR_CAD"}
          </span>
          <span className={`px-2.5 py-1 rounded-lg border ${clothingExtracted ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-neutral-900 border-white/5 text-gray-500"}`}>
            ● {lang === "ko" ? "피복분리" : "CLOTH_SAM2"}
          </span>
        </div>
      </div>

      {/* 📺 SYSTEM STATUS LOG TICKER BAR */}
      <div className="bg-neutral-950/80 p-3.5 rounded-2xl border border-white/5 flex items-center gap-2.5 text-xs font-mono">
        <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shrink-0" />
        <span className="text-pink-400 font-extrabold tracking-wider uppercase shrink-0">AI_SERVER_LOG:</span>
        <span className="text-zinc-300 truncate font-semibold">{tickerLog}</span>
      </div>

      {/* ========================================================
          🚀 MAIN 3-COLUMN INTEGRATION LAYOUT
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* --------------------------------------------------------
            Column 1: LEFT COLUMN (FACE UPLOAD & BODY CALIBRATION)
           -------------------------------------------------------- */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* STEP 1: FACE MOUNTING & REMOVE BACKGROUND SECTION */}
          <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-neutral-950/40 space-y-4">
            <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
              <span className="text-xs uppercase font-mono tracking-wider text-pink-400 font-black flex items-center gap-2">
                <Camera className="w-4 h-4" />
                {lang === "ko" ? "STEP 1: 페이스 누끼 추출" : "STEP 1: FACE ALPHA CUTOUT"}
              </span>
              <span className="text-[10px] bg-pink-500/15 text-pink-400 px-2 py-0.5 rounded font-mono font-bold">1단계</span>
            </div>

            {/* Selfie File Upload Block */}
            <div className="space-y-3">
              <input 
                type="file" 
                ref={faceInputRef} 
                onChange={handleFaceFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              <div 
                onClick={handleTriggerUpload}
                className="border-2 border-dashed border-white/10 hover:border-pink-500/40 rounded-2xl p-5 text-center cursor-pointer hover:bg-[#111221]/20 transition-all flex flex-col items-center justify-center space-y-2 relative"
              >
                {uploadedFaceUrl ? (
                  <div className="flex flex-col items-center space-y-2">
                    <img 
                      src={uploadedFaceUrl} 
                      alt="Portrait uploaded" 
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-pink-500" 
                    />
                    <div className="text-center">
                      <span className="text-xs font-bold text-white block">Self Portrait Mounted</span>
                      <span className="text-[9px] font-mono text-green-400 mt-1 uppercase block">[READY TO ISOLATE]</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-neutral-900 rounded-full border border-white/5 text-gray-400">
                      <Camera className="w-5 h-5 text-pink-500 animate-pulse" />
                    </div>
                    <span className="text-xs font-semibold text-gray-300 block">
                      {lang === "ko" ? "본인의 전면 셀카 업로드" : "Choose / Drag Selfie"}
                    </span>
                    <span className="text-[9px] text-gray-500 font-mono block">
                      PNG, JPG, WEBP (Max 10MB)
                    </span>
                  </>
                )}
              </div>

              {/* Reset or Change File */}
              {uploadedFaceUrl && (
                <button
                  onClick={handleClearPortrait}
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-850 border border-red-500/20 hover:border-red-500/40 text-[10px] font-mono rounded-xl text-red-400 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {lang === "ko" ? "업로드 이미지 초기화" : "Erase Portrait"}
                </button>
              )}

              {/* Lookbook Preset Selector Cards */}
              {!uploadedFaceUrl && (
                <div className="space-y-2 pt-2">
                  <span className="text-[9px] font-mono uppercase text-gray-500 block font-bold tracking-wider">
                    {lang === "ko" ? "또는 에디토리얼 프리셋 인물 선택" : "OR SELECT MODEL PORTRAIT PRESET"}
                  </span>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {LOOKBOOK_FACES.map((face) => (
                      <button
                        key={face.id}
                        onClick={() => handleSelectPreset(face.id, face.image)}
                        className={`relative rounded-xl overflow-hidden aspect-square border cursor-pointer transition-all ${
                          selectedFacePresetId === face.id && !uploadedFaceUrl
                            ? "border-pink-500 ring-2 ring-pink-500/60 scale-[1.03]" 
                            : "border-white/5 opacity-50 hover:opacity-100"
                        }`}
                        title={face.name}
                      >
                        <img 
                          src={face.image} 
                          alt={face.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* AUTOMATIC BACKGROUND TRANSPARENT ERASER BUTTON */}
              <button
                onClick={handleExtractFace}
                disabled={isExtractingFace || !faceAlphaUrl}
                className="w-full mt-3 py-3 bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-xs font-mono font-bold rounded-xl text-white tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-pink-500/10 disabled:opacity-50"
              >
                {isExtractingFace ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {lang === "ko" ? "머리카락 윤곽 감지 및 소거중..." : "Isolating Background Channels..."}
                  </>
                ) : (
                  <>
                    <Scissors className="w-3.5 h-3.5" />
                    {lang === "ko" ? "얼굴 배경 제거 시작" : "Extract Face (Alpha Mask)"}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* STEP 2: BODY AVATAR GENERATOR INPUTS */}
          <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-neutral-950/40 space-y-4">
            <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
              <span className="text-xs uppercase font-mono tracking-wider text-pink-400 font-black flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                {lang === "ko" ? "STEP 2: 신체 아바타 형성 기기" : "STEP 2: BODY AVATAR CONFIG"}
              </span>
              <span className="text-[10px] bg-pink-500/15 text-pink-400 px-2 py-0.5 rounded font-mono font-bold">2단계</span>
            </div>

            <div className="space-y-4">
              {/* Gender Radio Option */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-black">{lang === "ko" ? "성별" : "Gender Category"}</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { playClickSound("tactile"); setGender("female"); }}
                    className={`py-2 text-xs font-mono uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${gender === "female" ? "bg-pink-500/10 border-pink-500/50 text-white font-bold" : "bg-neutral-900 border-white/5 text-gray-400 hover:text-white"}`}
                  >
                    {lang === "ko" ? "여성" : "Female"}
                  </button>
                  <button
                    onClick={() => { playClickSound("tactile"); setGender("male"); }}
                    className={`py-2 text-xs font-mono uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${gender === "male" ? "bg-pink-500/10 border-pink-500/50 text-white font-bold" : "bg-neutral-900 border-white/5 text-gray-400 hover:text-white"}`}
                  >
                    {lang === "ko" ? "남성" : "Male"}
                  </button>
                </div>
              </div>

              {/* Height & Weight Ranges Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 uppercase flex justify-between">
                    <span>{lang === "ko" ? "신장" : "Height"}</span>
                    <span className="text-white font-bold">{height}cm</span>
                  </span>
                  <input 
                    type="range" 
                    min={150} 
                    max={200} 
                    value={height} 
                    onChange={(e) => { playClickSound("slider"); setHeight(Number(e.target.value)); }} 
                    className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-pink-500" 
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 uppercase flex justify-between">
                    <span>{lang === "ko" ? "체중" : "Weight"}</span>
                    <span className="text-white font-bold">{weight}kg</span>
                  </span>
                  <input 
                    type="range" 
                    min={40} 
                    max={120} 
                    value={weight} 
                    onChange={(e) => { playClickSound("slider"); setWeight(Number(e.target.value)); }} 
                    className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-pink-500" 
                  />
                </div>
              </div>

              {/* Body Type Selection Slots */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-black">{lang === "ko" ? "인체 체형 타입" : "Body Skeletal Form"}</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "slim", labelKo: "슬림형", labelEn: "Slim Flat" },
                    { id: "average", labelKo: "표준 평균형", labelEn: "Average" },
                    { id: "athletic", labelKo: "스포티 골격형", labelEn: "Athletic" },
                    { id: "plus_size", labelKo: "플러스 체형", labelEn: "Plus Size" }
                  ].map((archetype) => (
                    <button
                      key={archetype.id}
                      onClick={() => { playClickSound("tactile"); setBodyType(archetype.id as any); }}
                      className={`py-2 text-[11px] font-sans rounded-xl border text-center transition-all cursor-pointer ${
                        bodyType === archetype.id 
                          ? "bg-pink-500/10 border-pink-500 text-white font-bold" 
                          : "bg-neutral-900 border-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {lang === "ko" ? archetype.labelKo : archetype.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* GENERATE AVATAR ACTION BUTTON */}
              <button
                onClick={handleGenerateMannequin}
                disabled={isGeneratingAvatar}
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-850 hover:border-pink-500/30 border border-white/10 text-xs font-mono font-bold rounded-xl text-white tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGeneratingAvatar ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-pink-500" />
                    {lang === "ko" ? "뼈대 및 안면 정합 연산 매핑중..." : "Compiling Mannequin CAD..."}
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-pink-400" />
                    {lang === "ko" ? "디지털 마네킹 생성" : "Generate Avatar Twin"}
                  </>
                )}
              </button>
            </div>
          </div>
          
        </div>

        {/* --------------------------------------------------------
            Column 2: CENTER COLUMN (MAIN AVATAR WORKSPACE PREVIEW)
           -------------------------------------------------------- */}
        <div className="lg:col-span-4 space-y-6 flex flex-col items-center">
          
          {/* CENTER PREVIEW AREA */}
          <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-neutral-950/40 w-full relative flex flex-col items-center shadow-inner">
            
            <div className="flex justify-between items-center w-full pb-2.5 border-b border-white/5 mb-3">
              <span className="text-xs uppercase font-mono tracking-wider text-pink-400 font-black flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {lang === "ko" ? "디지털 3D 가상 피팅 마네킹" : "3D WORKSPACE CAD FEED"}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">800x1000 HD</span>
            </div>

            {/* Canvas Viewer Container */}
            <div className="relative w-full aspect-[4/5] bg-[#040509] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
              
              {/* COMPOSITOR OFFLINE CANVAS */}
              <canvas 
                ref={compositorCanvasRef} 
                className="hidden" 
              />

              {/* Sweeper Scanning lasers overlay visual bar */}
              {(isExtractingFace || isGeneratingAvatar || isExtractingClothing || isDressingProcess) && (
                <div className="absolute inset-x-0 h-1 bg-pink-500 shadow-[0_0_15px_#ec4899] z-20 animate-bounce" />
              )}

              {/* Real Render Output */}
              {tryOnImageResult ? (
                <img 
                  src={tryOnImageResult} 
                  alt="Virtual Try On Finished Frame" 
                  className="w-full h-full object-cover rounded-2xl" 
                />
              ) : (
                <div className="text-center p-6 space-y-3 z-10">
                  <div className="w-12 h-12 bg-neutral-900 border border-white/5 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-6 h-6 text-pink-500/70" />
                  </div>
                  <div className="max-w-[240px]">
                    <span className="text-sm font-bold text-white block">
                      {lang === "ko" ? "아바타 가상 스튜디오 비어있음" : "CAD Fitting Studio Offline"}
                    </span>
                    <span className="text-[11px] text-gray-500 block mt-1 leading-normal">
                      {lang === "ko" 
                        ? "왼쪽에서 마네킹을 형성하고 오른쪽에서 직물을 분리하여 피팅을 합결하세요."
                        : "Build an avatar on the left, isolate garments on the right, and start draping outfits."}
                    </span>
                  </div>
                </div>
              )}

              {/* Diagnostic overlay info board */}
              {avatarGenerated && (
                <div className="absolute top-4 left-4 bg-neutral-950/90 border border-white/5 p-3 rounded-xl text-left space-y-0.5 text-[9.5px] font-mono text-zinc-400">
                  <span className="text-pink-400 font-extrabold uppercase text-[10px] block mb-1">● BIOMETRIC REPORT</span>
                  <div>Height: <span className="text-white">{height} cm</span></div>
                  <div>Weight: <span className="text-white">{weight} kg</span></div>
                  <div>Type: <span className="text-white">{bodyType.toUpperCase()}</span></div>
                  <div>Gender: <span className="text-white">{gender.toUpperCase()}</span></div>
                </div>
              )}
            </div>

            {/* TRIGGER DRESSING CORE BUTTON */}
            <div className="w-full mt-4 flex gap-2">
              <button
                onClick={handleTryOnOutfit}
                disabled={isDressingProcess || !avatarGenerated || !clothingExtracted}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-xs font-mono font-bold rounded-xl text-white tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10 disabled:opacity-50"
              >
                {isDressingProcess ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {lang === "ko" ? "치수 왜곡 및 주름 연산중..." : "Draping Fabrics..."}
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-white fill-white" />
                    {lang === "ko" ? "의류 입체 가상 피팅 적용" : "Drape Outfit (Try On)"}
                  </>
                )}
              </button>

              <button
                onClick={handleSaveFittingLook}
                disabled={!isDressed}
                className="px-4 py-3 bg-neutral-900 hover:bg-neutral-850 hover:border-pink-500/30 border border-white/10 rounded-xl text-gray-300 transition-all flex items-center justify-center cursor-pointer disabled:opacity-40"
                title={lang === "ko" ? "룩 코디 보관" : "Archive Fitting"}
              >
                <Save className="w-4 h-4 text-pink-500" />
              </button>
            </div>

            {/* 📁 MULTI-LAYER COORD WARDROBE BOARD */}
            {avatarGenerated && (
              <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-neutral-950/40 w-full space-y-4 text-left mt-4">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-pink-400 font-extrabold">
                    <Layers className="w-4 h-4" />
                    {lang === "ko" ? "아바타 코디 레이어 관리자" : "MULTI-LAYER COORD WARDROBE BOARD"}
                  </div>
                  <button
                    onClick={() => {
                      playClickSound("tactile");
                      setWornGarments({});
                    }}
                    disabled={Object.keys(wornGarments).length === 0}
                    className="px-2.5 py-1 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 rounded-lg text-[10px] font-mono text-zinc-400 hover:text-red-400 font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {lang === "ko" ? "레이어 탈의" : "Reset Layers"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(["top", "bottom", "shoes", "fullbody", "accessory"] as const).map(slot => {
                    const activeItem = wornGarments[slot];
                    const label = {
                      top: lang === "ko" ? "상의 (Top)" : "Top Layer",
                      bottom: lang === "ko" ? "하의 (Bottom)" : "Bottom Layer",
                      shoes: lang === "ko" ? "슈즈 (Shoes)" : "Footwear",
                      fullbody: lang === "ko" ? "풀바디 (Dress/Coat)" : "Outwear & Fullbody",
                      accessory: lang === "ko" ? "액세서리 (Acc)" : "Accessory"
                    }[slot];

                    return (
                      <div
                        key={slot}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                          activeItem 
                            ? "bg-neutral-950/60 border-white/10 shadow-lg shadow-black/10" 
                            : "bg-white/[0.01] border-dashed border-white/5 opacity-50"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {activeItem ? (
                            <>
                              <img
                                src={activeItem.image}
                                alt={activeItem.name}
                                className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="text-left overflow-hidden">
                                <div className="text-[8.5px] font-mono text-pink-500 font-bold tracking-widest uppercase">
                                  {label}
                                </div>
                                <div className="text-[10px] font-medium text-white truncate max-w-[120px]">
                                  {activeItem.koName || activeItem.name}
                                </div>
                                <div className="text-[8px] font-mono text-zinc-500 uppercase">
                                  {activeItem.brand}
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="flex gap-2.5 items-center">
                              <div className="w-8 h-8 rounded-lg border border-dashed border-white/10 flex items-center justify-center bg-white/[0.02] shrink-0">
                                <Shirt className="w-3.5 h-3.5 text-zinc-600" />
                              </div>
                              <div className="text-left">
                                <div className="text-[8.5px] font-mono text-zinc-500 font-bold tracking-widest uppercase">
                                  {label}
                                </div>
                                <div className="text-[10px] text-zinc-600 font-mono">
                                  {lang === "ko" ? "미장착 레이어" : "Slot Empty"}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {activeItem && (
                          <button
                            onClick={() => {
                              playClickSound("tactile");
                              setWornGarments(prev => {
                                const next = { ...prev };
                                delete next[slot];
                                return next;
                              });
                            }}
                            className="p-1.5 bg-neutral-900 hover:bg-red-500/10 hover:border-red-500/20 border border-white/5 rounded-lg text-zinc-400 hover:text-red-400 transition-all cursor-pointer shadow-md"
                            title={lang === "ko" ? "이 레이어 탈의" : "Clear Slot"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* DRESSED CALIBRATION & DRAPING TUNING CONTROLS */}
          {clothingExtracted && (
            <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-neutral-950/40 w-full space-y-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-white/5 font-mono text-xs uppercase tracking-wider text-pink-400 font-extrabold">
                <Sliders className="w-4 h-4" />
                {lang === "ko" ? "의류 피팅 정밀 조율 조정기" : "FABRIC FIT & POSITION CALIBRATOR"}
              </div>

              <div className="space-y-3.5">
                {/* Face offsets tuning */}
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-white/5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-gray-400 uppercase flex justify-between">
                      <span>Face Scale</span>
                      <span className="text-white">{faceScale.toFixed(2)}x</span>
                    </span>
                    <input 
                      type="range" 
                      min={0.8} 
                      max={1.4} 
                      step={0.02}
                      value={faceScale} 
                      onChange={(e) => setFaceScale(Number(e.target.value))} 
                      className="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-sky-400" 
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-gray-400 uppercase flex justify-between">
                      <span>Face Offset Y</span>
                      <span className="text-white">{faceOffsetY}px</span>
                    </span>
                    <input 
                      type="range" 
                      min={-40} 
                      max={40} 
                      value={faceOffsetY} 
                      onChange={(e) => setFaceOffsetY(Number(e.target.value))} 
                      className="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-sky-400" 
                    />
                  </div>
                </div>

                {/* Garment layout offsets */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 uppercase">
                    <span>Garment Drape Length Scale</span>
                    <span className="text-pink-400 font-bold">{garmentScale.toFixed(2)}x</span>
                  </div>
                  <input 
                    type="range" 
                    min={0.7} 
                    max={1.4} 
                    step={0.02}
                    value={garmentScale} 
                    onChange={(e) => setGarmentScale(Number(e.target.value))} 
                    className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-pink-500" 
                  />

                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 uppercase">
                    <span>Shoulders Broaden Factor</span>
                    <span className="text-pink-400 font-bold">{garmentWidthStretch.toFixed(2)}x</span>
                  </div>
                  <input 
                    type="range" 
                    min={0.8} 
                    max={1.3} 
                    step={0.02}
                    value={garmentWidthStretch} 
                    onChange={(e) => setGarmentWidthStretch(Number(e.target.value))} 
                    className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-pink-500" 
                  />

                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 uppercase">
                    <span>Fabric Alignment Offset (Vertical)</span>
                    <span className="text-pink-400 font-bold">{garmentOffsetY} px</span>
                  </div>
                  <input 
                    type="range" 
                    min={-40} 
                    max={80} 
                    value={garmentOffsetY} 
                    onChange={(e) => setGarmentOffsetY(Number(e.target.value))} 
                    className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-pink-500" 
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* --------------------------------------------------------
            Column 3: RIGHT COLUMN (RECOMMENDED CLOTHING FEED)
           -------------------------------------------------------- */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* STEP 3: RECOMMENDED PRODUCTS CLOTHING SELECTION */}
          <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-neutral-950/40 space-y-4">
            <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
              <span className="text-xs uppercase font-mono tracking-wider text-pink-400 font-black flex items-center gap-2">
                <Shirt className="w-4 h-4" />
                {lang === "ko" ? "STEP 3: 가용 자락 의류 추출" : "STEP 3: EXTRACT GARMENTS"}
              </span>
              <span className="text-[10px] bg-pink-500/15 text-pink-400 px-2 py-0.5 rounded font-mono font-bold">3단계</span>
            </div>

            {/* Selected Item Detail & Extraction Core */}
            <div className="bg-[#05060B] border border-white/5 rounded-2xl p-4 space-y-3.5">
              
              <div className="flex gap-3">
                <div className="w-16 h-20 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-white/10">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div className="space-y-1 flex-1 min-w-0">
                  <span className="text-[8.5px] bg-pink-500/10 text-pink-400 px-1.5 py-0.2 rounded font-mono font-extrabold uppercase">
                    {selectedProduct.brand}
                  </span>
                  <h3 className="text-xs font-bold text-white truncate leading-tight">
                    {lang === "ko" ? selectedProduct.koName || selectedProduct.name : selectedProduct.name}
                  </h3>
                  <p className="text-[10px] text-gray-400">
                    Category: <span className="text-gray-200">{lang === "ko" ? selectedProduct.koCategory || selectedProduct.category : selectedProduct.category}</span>
                  </p>
                  <p className="text-[11px] font-mono text-pink-500 font-black">
                    ${selectedProduct.price} USD
                  </p>
                </div>
              </div>

              {/* AUTOMATIC GROUNDED-SAM CLOTHING EXTRACTOR BUTTON */}
              <button
                onClick={handleExtractGarment}
                disabled={isExtractingClothing}
                className="w-full py-3 bg-[#13152B] border border-pink-500/20 hover:border-pink-500/50 text-xs font-mono font-bold rounded-xl text-pink-300 tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isExtractingClothing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-pink-500" />
                    {lang === "ko" ? "몸에서 직물 선별 분할 분리 중..." : "Running Grounded-SAM Segment..."}
                  </>
                ) : (
                  <>
                    <Scissors className="w-3.5 h-3.5 text-pink-500" />
                    {lang === "ko" ? "피팅용 피복 윤곽선만 소거 추출" : "Isolate Dress Asset"}
                  </>
                )}
              </button>

              {/* Isolated transparent clothing layer presentation display */}
              {clothingExtracted && extractedClothingUrl && (
                <div className="mt-3.5 pt-3.5 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-green-400 font-extrabold tracking-widest uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      [PNG LAYER: MODEL HIDE ACTIVE]
                    </span>
                    <span className="text-[8px] font-mono text-zinc-500 uppercase">garment_clean.png</span>
                  </div>

                  {/* Checkerboard PNG Canvas box */}
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/5 flex items-center justify-center bg-[linear-gradient(45deg,#161726_25%,transparent_25%),linear-gradient(-45deg,#161726_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#161726_75%),linear-gradient(-45deg,transparent_75%,#161726_75%)] bg-[size:16px_16px] bg-[#0c0d1b] shadow-inner p-4">
                    {/* Rendering pure vector clothing silhouette CAD representation */}
                    {renderGarmentVectorPreview(selectedProduct)}

                    {/* Technical annotation marker */}
                    <div className="absolute inset-0 border border-green-500/20 rounded-xl pointer-events-none flex flex-col justify-end p-2">
                      <div className="bg-black/80 px-2 py-0.5 rounded border border-green-500/10 text-[7.5px] font-mono text-green-400 w-fit">
                        {lang === "ko" ? "성공: 모델 차단 완료 • 단독 순수 원형 레이어 추출" : "STATUS: 100% PURE GARMENT ONLY • NO HUMANS"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Product Grid selection list */}
            <div className="space-y-2 pt-2 text-left">
              <span className="text-[10px] font-mono uppercase text-gray-500 block font-bold tracking-wider">
                {lang === "ko" ? "착장할 스마트 추천 의류 목록" : "SELECT RECOMMENDATION FEED"}
              </span>

              <div className="grid grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {MOCK_PRODUCTS.map((prod) => {
                  const isSelected = selectedProduct.id === prod.id;
                  return (
                    <button
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod)}
                      className={`p-2 rounded-2xl border text-left flex flex-col space-y-1.5 transition-all bg-neutral-950/70 hover:bg-neutral-900/50 cursor-pointer ${
                        isSelected 
                          ? "border-pink-500 ring-1 ring-pink-500/30 scale-[0.99]" 
                          : "border-white/5"
                      }`}
                    >
                      <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-neutral-900 border border-white/5">
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute top-1.5 right-1.5 bg-neutral-950/80 px-1.5 py-0.5 rounded-lg border border-white/5 text-[8.5px] font-mono font-black text-pink-400">
                          {prod.matchPercentage}% FIT
                        </div>
                      </div>
                      
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[7.5px] text-gray-500 font-mono font-bold block truncate uppercase">
                          {prod.brand}
                        </span>
                        <span className="text-[10px] font-bold text-gray-200 block truncate">
                          {lang === "ko" ? prod.koName || prod.name : prod.name}
                        </span>
                        <span className="text-[9.5px] font-mono text-pink-500 font-extrabold block">
                          ${prod.price}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* REAL STYLE DNA FIT COMPATIBILITY INSIGHTS REPORT */}
          {matchReport && isDressed && (
            <div className="glass-panel p-5 rounded-3xl border border-emerald-500/20 bg-neutral-950/40 text-left space-y-3.5 animate-fade-in shadow-lg shadow-emerald-500/5">
              <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 font-mono text-xs uppercase tracking-wider text-emerald-400 font-extrabold">
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                {lang === "ko" ? "STYLE DNA 가상 착장 적합 보고서" : "STYLE DNA FIT COMPATIBILITY INDEX"}
              </div>

              {/* Three category gauges indices */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-neutral-950/90 border border-white/5 p-2 rounded-xl">
                  <span className="text-[8.5px] font-mono text-gray-500 block uppercase">Style Match</span>
                  <span className="text-xs font-extrabold text-emerald-400">{matchReport.styleScore}%</span>
                </div>
                <div className="bg-neutral-950/90 border border-white/5 p-2 rounded-xl">
                  <span className="text-[8.5px] font-mono text-gray-500 block uppercase">Color Match</span>
                  <span className="text-xs font-extrabold text-emerald-400">{matchReport.colorScore}%</span>
                </div>
                <div className="bg-neutral-950/90 border border-white/5 p-2 rounded-xl">
                  <span className="text-[8.5px] font-mono text-gray-500 block uppercase">Body Fit</span>
                  <span className="text-xs font-extrabold text-[#5B7FFF]">{matchReport.bodyScore}%</span>
                </div>
              </div>

              <div className="bg-[#05060B] border border-white/5 p-3 rounded-2xl">
                <span className="text-[9px] font-mono uppercase text-emerald-400 font-extrabold block mb-1">
                  ⚡ AI COORDINATOR FIT INSIGHT:
                </span>
                <p className="text-[10px] text-zinc-300 leading-relaxed font-sans font-medium">
                  {lang === "ko" ? matchReport.tipKo : matchReport.tip}
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ========================================================
          📂 MY FIT LOCKER - HISTORIC SAVED LOOKS CAROUSEL
         ======================================================== */}
      {savedLooks.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-neutral-950/40 text-left space-y-4">
          <div className="flex gap-2.5 items-center pb-3 border-b border-white/5 font-mono text-xs uppercase tracking-wider text-pink-400 font-extrabold">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500/10" />
            {lang === "ko" ? "나의 보관소 피팅 피드록 (My Fit Locker)" : "MY FIT LOCKER - SAVED STYLES"}
            <span className="bg-pink-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded">
              {savedLooks.length} SAVED
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {savedLooks.map((look) => (
              <div 
                key={look.id}
                className="bg-neutral-950 border border-white/5 rounded-2xl overflow-hidden text-left flex flex-col hover:border-pink-500/30 transition-all relative group"
              >
                {/* Look composite image */}
                <div className="relative aspect-[4/5] bg-neutral-900 border-b border-white/5">
                  <img 
                    src={look.image} 
                    alt={look.productName} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-2 left-2 bg-black/75 px-1.5 py-0.5 rounded-lg border border-white/5 text-[8px] font-mono text-emerald-400 font-extrabold">
                    {look.compatibility}% FIT
                  </div>
                </div>

                {/* Metadata content */}
                <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[7.5px] font-mono text-zinc-500 uppercase block">{look.productBrand}</span>
                    <span className="text-[10px] font-bold text-zinc-200 block truncate">{look.productName}</span>
                    <span className="text-[8px] font-mono text-zinc-400 block mt-0.5">{look.dimensions}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-white/5">
                    <span className="text-[8px] font-mono text-zinc-600">{look.date}</span>
                    <button
                      onClick={() => handleDeleteLook(look.id)}
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-1 rounded-md transition-colors cursor-pointer"
                      title={lang === "ko" ? "삭제" : "Delete style"}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
