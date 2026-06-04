import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TRANSLATIONS, Language } from "../lib/translations";
import { Sparkles, ArrowRight, Shield, Mail, Lock, CheckCircle, Globe, Sun, Moon } from "lucide-react";

interface LandingPageProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onLogin: (profile?: { name: string; email: string; height: number; weight: number; bodyType: string; styleVibe: string }) => void;
  themeMode: "light" | "dark";
  setThemeMode: (mode: "light" | "dark") => void;
}

export default function LandingPage({ lang, setLang, onLogin, themeMode, setThemeMode }: LandingPageProps) {
  // Login states
  const [email, setEmail] = useState("tester@stylemind.ai");
  const [password, setPassword] = useState("••••••••");
  
  // Custom Join Membership (회원가입) states
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signUpName, setSignUpName] = useState("미남종혁");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpHeight, setSignUpHeight] = useState<number>(174);
  const [signUpWeight, setSignUpWeight] = useState<number>(68);
  const [signUpBodyType, setSignUpBodyType] = useState<string>("athletic"); // slim | athletic | curvy | solid
  const [signUpStyleVibe, setSignUpStyleVibe] = useState<string>("minimal"); // minimal | street | oldmoney | gorpcore

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const sloganKo = "“옷이 날개다.”";
  const sloganEn = "“Clothes make a man.”";
  
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate high-fidelity security checking
    setTimeout(() => {
      setIsSubmitting(false);
      setShowWelcome(true);
      setTimeout(() => {
        // Log in with default or edited admin values
        onLogin({
          name: email === "test.guest@stylemind.ai" ? "게스트에디터" : "미남종혁",
          email: email,
          height: 174,
          weight: 68,
          bodyType: "athletic",
          styleVibe: "minimal"
        });
      }, 1200);
    }, 1500);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate detailed biometric registration 
    setTimeout(() => {
      setIsSubmitting(false);
      setShowWelcome(true);
      setTimeout(() => {
        onLogin({
          name: signUpName || "미남종혁",
          email: signUpEmail || "member@stylemind.ai",
          height: Number(signUpHeight),
          weight: Number(signUpWeight),
          bodyType: signUpBodyType,
          styleVibe: signUpStyleVibe
        });
      }, 1200);
    }, 1800);
  };

  const backgroundImages = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80"
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 font-sans ${themeMode === "dark" ? "bg-[#080809] text-gray-100" : "bg-[#FAF9F6] text-neutral-900"}`}>
      
      {/* Light mode style overrides injected cleanly */}
      {themeMode === "light" && (
        <style dangerouslySetInnerHTML={{__html: `
          .glass-panel {
            background: rgba(255, 255, 255, 0.75) !important;
            backdrop-filter: blur(24px) !important;
            border: 1px solid rgba(0, 0, 0, 0.08) !important;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04) !important;
          }
        `}} />
      )}

      {/* 1. TOP HEADER & BAR */}
      <header className="absolute top-0 left-0 w-full z-50 bg-transparent py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-display text-2xl font-black tracking-tighter text-[#5B7FFF] block uppercase">
              StyleMind<span>.AI</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Bilingual language switcher */}
            <div className="flex bg-neutral-950/40 backdrop-blur-md border border-white/5 p-1 rounded-xl items-center gap-0.5">
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all ${
                  lang === "en"
                    ? "bg-[#5B7FFF] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("ko")}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all ${
                  lang === "ko"
                    ? "bg-[#5B7FFF] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                KO
              </button>
            </div>

            {/* Dark/Light mode theme button */}
            <button
              onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl border border-white/5 bg-neutral-950/40 hover:border-white/10 transition-all cursor-pointer text-accent-blue"
            >
              {themeMode === "dark" ? (
                <Sun className="w-4 h-4 text-[#5B7FFF]" />
              ) : (
                <Moon className="w-4 h-4 text-[#5B7FFF]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN LAYOUT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-24 pb-12 relative z-10">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] rounded-full bg-[#5B7FFF]/10 blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" />
        
        {/* Left Side: Editorial Lookbook Slogans & Grid */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left z-10 selection:bg-[#5B7FFF]/20">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-[#5B7FFF]/10 border border-[#5B7FFF]/15 px-4.5 py-2 rounded-full"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5B7FFF] animate-pulse" />
              <span className="font-mono text-[10px] text-[#5B7FFF] tracking-[0.2em] font-extrabold uppercase">
                {lang === "ko" ? "차세대 글로벌 패션 오디세이" : "NEXT-GEN GLOBAL ATELIER INTELLIGENCE"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tighter leading-tight bg-gradient-to-r from-white via-neutral-100 to-gray-500 bg-clip-text text-transparent"
              style={{ color: themeMode === "light" ? "#111" : undefined }}
            >
              {lang === "ko" ? (
                <>
                  스마트 스타일 매칭 <br />
                  <span className="text-[#5B7FFF] bg-gradient-to-r from-[#5B7FFF] to-purple-400 bg-clip-text text-transparent">StyleMind.AI</span>
                </>
              ) : (
                <>
                  Architectural <br />
                  <span className="text-[#5B7FFF] bg-gradient-to-r from-[#5B7FFF] to-purple-400 bg-clip-text text-transparent">Style Intelligence</span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-serif italic font-medium text-2xl sm:text-3.5xl text-[#5B7FFF] tracking-wide pt-2"
            >
              {lang === "ko" ? sloganKo : sloganEn}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-sm text-gray-400 max-w-xl leading-relaxed mx-auto lg:mx-0 pt-1"
            >
              {lang === "ko" ? (
                "귀하의 얼굴 윤곽, 체격 비율, 신장(키) 및 체중을 완밀하게 연동하여 최적의 패션 수치를 수립합니다. 실시간 가상 피팅 스튜디오를 아울러 세계적 트렌드를 선점해 보세요."
              ) : (
                "Synchronize your unique facial contours, skeletal frames, dynamic height and weight to form an ultra-precise digital Style DNA. Seamlessly preview real clothing overlays directly on your persona images."
              )}
            </motion.p>
          </div>

          {/* Decorative collage grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden sm:grid grid-cols-3 gap-3.5 pt-4 max-w-lg mx-auto lg:mx-0"
          >
            {backgroundImages.map((src, index) => (
              <div key={index} className="relative h-44 rounded-2xl overflow-hidden border border-white/5 shadow-lg group">
                <img src={src} alt="Atelier Look" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Side: Elegant Premium Login & Signup Portal */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto z-10 relative">
          
          <AnimatePresence mode="wait">
            {!showWelcome ? (
              <motion.div
                key="login-signup-card"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="glass-panel border border-white/10 p-7 rounded-4xl bg-[#0c0c0f]/80 backdrop-blur-2xl shadow-3xl space-y-5"
              >
                {/* 1. High Tech Tab Toggle between Login and Signup */}
                <div className="grid grid-cols-2 bg-neutral-900/90 p-1 rounded-2xl border border-white/5 shadow-inner">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUpMode(false);
                    }}
                    className={`py-2 text-[10px] font-mono uppercase font-black rounded-xl transition-all cursor-pointer text-center ${
                      !isSignUpMode
                        ? "bg-gradient-to-r from-[#5B7FFF] to-[#3a58e6] text-white shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    🔐 {lang === "ko" ? "아틀리에 로그인" : "ATELIER LOGIN"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUpMode(true);
                    }}
                    className={`py-2 text-[10px] font-mono uppercase font-black rounded-xl transition-all cursor-pointer text-center ${
                      isSignUpMode
                        ? "bg-gradient-to-r from-[#5B7FFF] to-[#3a58e6] text-white shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    ✨ {lang === "ko" ? "일반 회원가입" : "VIP SIGN UP"}
                  </button>
                </div>

                {/* 2. Form Headers */}
                <div className="space-y-1 text-center">
                  <span className="font-mono text-[9px] text-[#5B7FFF] font-black tracking-widest uppercase bg-[#5B7FFF]/10 px-3 py-1 rounded-full border border-[#5B7FFF]/10 inline-block">
                    {isSignUpMode
                      ? (lang === "ko" ? "고객 맞춤형 프리미엄 회원 구좌 개설" : "BESPOKE SIZING ACCOUNT REGISTRATION")
                      : (lang === "ko" ? "아틀리에 회원 인증 전용 입구" : "ATELIER AUTHENTICATION GATE")
                    }
                  </span>
                  <h3 className="font-display font-black text-xl text-white tracking-tight">
                    {isSignUpMode 
                      ? (lang === "ko" ? "StyleMind VIP 가입" : "Bespoke VIP Registration")
                      : "StyleMind AI Workspace"
                    }
                  </h3>
                  <p className="text-xs text-gray-400">
                    {isSignUpMode
                      ? (lang === "ko" ? "가상 피팅에 시뮬레이션할 본인의 키, 체중 및 지향 아바타 수치를 입력해 비밀번호와 함께 구성하세요." : "Set your height, weight & avatar metrics with your secret password.")
                      : (lang === "ko" ? "가상 세트 옷장에 접근하려면 자격 증명을 완료해 주세요." : "Provide your credentials to access your dynamic style desk.")
                    }
                  </p>
                </div>

                {/* LOGIN FORM VIEW */}
                {!isSignUpMode ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-500 font-extrabold uppercase block tracking-wider">
                        {lang === "ko" ? "이메일 로그인 아이디" : "EMAIL IDENTIFIER"}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          id="login-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="fashion.maker@studio.com"
                          className="w-full bg-neutral-900 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-[#5B7FFF] transition-all text-white placeholder-gray-600"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <label className="text-[10px] font-mono text-gray-500 font-extrabold uppercase block tracking-wider">
                          {lang === "ko" ? "패스워드 암호" : "PASSWORD KEYWORD"}
                        </label>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          id="login-password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-neutral-900 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-[#5B7FFF] transition-all text-white placeholder-gray-600"
                        />
                      </div>
                    </div>

                    {/* Quick autofill suggestion pill */}
                    <div 
                      onClick={() => {
                        setEmail("test.guest@stylemind.ai");
                        setPassword("guestPass123");
                      }}
                      className="p-2.5 rounded-xl bg-neutral-950/60 border border-white/5 text-[10px] text-gray-400 hover:text-white cursor-pointer hover:border-white/10 transition-all flex items-center justify-between"
                    >
                      <span>{lang === "ko" ? "🔐 체험 계정(미남종혁) 자동완성 채우기" : "🔐 Quick Autofill Guest Member Highlights"}</span>
                      <span className="font-mono text-[#5B7FFF] font-extrabold text-[8px] uppercase border border-[#5B7FFF]/20 px-1.5 py-0.5 rounded">GUEST</span>
                    </div>

                    {/* Submission Core button */}
                    <button
                      id="submit-login-button"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#5B7FFF] hover:bg-opacity-95 text-white font-display text-xs font-black tracking-widest uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#5B7FFF]/10 cursor-pointer disabled:opacity-50 transition-all mt-2"
                    >
                      {isSubmitting ? (
                        <span className="inline-block animate-pulse font-mono tracking-widest">
                          {lang === "ko" ? "회원 확인 중..." : "VALIDATING ATELIER ID..."}
                        </span>
                      ) : (
                        <>
                          {lang === "ko" ? "인증 통과 & 입장하기" : "AUTHENTICATE & ENTER"}
                          <ArrowRight className="w-4 h-4 text-white ml-0.5" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* SIGN UP (회원가입) CORE VIEW */
                  <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                    {/* Name Customization input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-500 font-extrabold uppercase block tracking-wider">
                        👤 {lang === "ko" ? "가입자 실제 성명" : "YOUR REGISTERED NAME"}
                      </label>
                      <input
                        type="text"
                        required
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder={lang === "ko" ? "실명을 적으세요 (예: 홍길동)" : "e.g. David J"}
                        className="w-full bg-neutral-900 border border-white/5 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-[#5B7FFF] transition-all text-white"
                      />
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-500 font-extrabold uppercase block tracking-wider">
                        ✉️ {lang === "ko" ? "가인 이메일 계정" : "EMAIL DESK ID"}
                      </label>
                      <input
                        type="email"
                        required
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="vip.curator@stylemind.ai"
                        className="w-full bg-neutral-900 border border-white/5 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-[#5B7FFF] transition-all text-white placeholder-gray-700"
                      />
                    </div>

                    {/* Sizing Grid: Height and Weight as requested to make fits precise */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gray-400 font-bold block">
                          📏 {lang === "ko" ? "신장 비율 (키)" : "HEIGHT (cm)"}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            min="140"
                            max="210"
                            value={signUpHeight}
                            onChange={(e) => setSignUpHeight(Number(e.target.value))}
                            className="w-full bg-neutral-900 border border-white/5 rounded-xl py-2.5 px-3.5 text-xs font-bold text-center text-white"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-gray-600 font-extrabold">CM</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gray-400 font-bold block">
                          ⚖️ {lang === "ko" ? "실제 체중 (무게)" : "WEIGHT (kg)"}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            min="35"
                            max="130"
                            value={signUpWeight}
                            onChange={(e) => setSignUpWeight(Number(e.target.value))}
                            className="w-full bg-neutral-900 border border-white/5 rounded-xl py-2.5 px-3.5 text-xs font-bold text-center text-white"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-gray-600 font-extrabold">KG</span>
                        </div>
                      </div>
                    </div>

                    {/* Shape Parameter Toggler */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-500 font-extrabold uppercase block tracking-wider">
                        🧬 {lang === "ko" ? "시뮬레이터 체형 유형" : "MORPH BODY SYST-TYPE"}
                      </label>
                      <div className="grid grid-cols-4 gap-1 bg-neutral-950 p-1 rounded-xl border border-white/5">
                        {[
                          { id: "athletic", label: "Athletic", labelKo: "머슬형" },
                          { id: "slim", label: "Slim", labelKo: "슬림형" },
                          { id: "curvy", label: "Curvy", labelKo: "볼륨형" },
                          { id: "solid", label: "Solid", labelKo: "듬직형" }
                        ].map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSignUpBodyType(b.id)}
                            className={`py-1 rounded-lg text-[9px] font-bold uppercase transition-all cursor-pointer ${
                              signUpBodyType === b.id
                                ? "bg-pink-600/20 text-pink-400 border border-pink-500/30"
                                : "text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent"
                            }`}
                          >
                            {lang === "ko" ? b.labelKo : b.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preferred Style Category */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-500 font-extrabold uppercase block tracking-wider">
                        🧥 {lang === "ko" ? "지향하는 스타일 분위기" : "PREFERRED ESTHETIC VIBE"}
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                        {[
                          { id: "minimal", label: "고감도 미니멀", badge: "MINIMAL" },
                          { id: "street", label: "아방가르드 스트릿", badge: "STREET" },
                          { id: "oldmoney", label: "클래식 올드머니", badge: "CLASSIC" },
                          { id: "gorpcore", label: "고프코어 테크", badge: "GORPCORE" }
                        ].map((v) => (
                          <div
                            key={v.id}
                            onClick={() => setSignUpStyleVibe(v.id)}
                            className={`p-1.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                              signUpStyleVibe === v.id
                                ? "bg-[#5B7FFF]/10 border-[#5B7FFF]/40 text-[#5B7FFF]"
                                : "bg-neutral-900 border-transparent text-gray-500 hover:text-gray-300"
                            }`}
                          >
                            <span className="text-[9px] font-semibold">{v.label}</span>
                            <span className="text-[7px] font-mono border border-current px-1 rounded-sm opacity-80">{v.badge}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Create Account Action */}
                    <button
                      id="submit-signup-button"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:bg-opacity-95 text-white font-display text-xs font-black tracking-widest uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-600/10 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      {isSubmitting ? (
                        <span className="inline-block animate-pulse font-mono tracking-widest">
                          {lang === "ko" ? "정밀 체형 분석 등록 중..." : "INJECTING SENSORS MATRIX..."}
                        </span>
                      ) : (
                        <>
                          {lang === "ko" ? "회원가입 완료 & 피팅 시작" : "REGISTER PROFILE & ENTER FIT ROOM"}
                          <Sparkles className="w-4 h-4 text-white" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Security tips section */}
                <div className="flex items-start gap-2 pt-1 text-[9px] text-gray-500 leading-normal">
                  <Shield className="w-3.5 h-3.5 text-[#5B7FFF] shrink-0 mt-0.5" />
                  <span>
                    {lang === "ko" ? (
                      "본 정보는 비스포크 알고리즘 연산에만 휘발성 처리되며, 구글 AI 스튜디오 및 클라우드 보안 규정에 의해 안전하게 보호됩니다."
                    ) : (
                      "Your metric inputs remain local for active wardrobe generation and are secured under system confidentiality rules."
                    )}
                  </span>
                </div>

                <div className="text-center pt-2 border-t border-white/5 font-mono text-[9px] text-gray-500 font-bold tracking-widest uppercase">
                  © 2026 STYLEMIND COORDS INC.
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="welcome-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel border border-white/10 p-10 rounded-4xl bg-[#0c0c0f]/80 backdrop-blur-2xl shadow-3xl text-center space-y-6 flex flex-col items-center justify-center min-h-[420px]"
              >
                <div className="w-16 h-16 bg-[#5B7FFF]/10 border border-[#5B7FFF]/25 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="w-8 h-8 text-[#5B7FFF] animate-bounce" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-display font-black text-2xl text-white">
                    {lang === "ko" ? "환영합니다, 크리에이터!" : "Welcome, Style Tastemaker!"}
                  </h3>
                  <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                    {lang === "ko" ? (
                      "계정이 확인되었습니다. 본인의 고유 스타일 DNA 워크스페이스 대시보드로 이동합니다."
                    ) : (
                      "Your digital identity verified successfully. Navigating to the creative atelier board now."
                    )}
                  </p>
                </div>

                <div className="w-full max-w-[150px] bg-neutral-900 border border-white/5 rounded-full p-[1px] overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.1, ease: "easeInOut" }}
                    className="h-1 bg-gradient-to-r from-[#5B7FFF] to-pink-500 rounded-full"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
