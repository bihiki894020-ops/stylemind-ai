import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  INITIAL_STYLE_DNA,
  MOCK_COMMUNITY_POSTS,
  MOCK_CHALLENGES,
  MOCK_PRODUCTS
} from "./data/mockData";
import { StyleDNA, OutfitRecommendation, CommunityPost, CommunityChallenge } from "./types";
import LandingPage from "./components/LandingPage";
import AIStyleDiagnosis from "./components/AIStyleDiagnosis";
import StyleDNAViewer from "./components/StyleDNAViewer";
import OutfitGenerator from "./components/OutfitGenerator";
import AICoach from "./components/AICoach";
import Community from "./components/Community";
import Shopping from "./components/Shopping";
import MyPage from "./components/MyPage";
import VirtualFittingStudio from "./components/VirtualFittingStudio";
import { TRANSLATIONS, Language } from "./lib/translations";
import { Sparkles, Compass, HelpCircle, ShoppingBag, Folder, Award, Heart, Moon, Sun, Menu, X, Globe, Shirt } from "lucide-react";

export default function App() {
  const [lang, setLang] = useState<Language>("ko"); // Defaulting to Korean as requested
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeTab, setActiveTab ] = useState<"diagnosis" | "dna" | "outfit" | "fitting" | "coach" | "community" | "shopping" | "mypage">("diagnosis");
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [styleDna, setStyleDna] = useState<StyleDNA | null>(INITIAL_STYLE_DNA);
  
  // Custom user profile state populated by signup or loaded by login
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    height: number;
    weight: number;
    bodyType: string;
    styleVibe: string;
  }>({
    name: "미남종혁",
    email: "tester@stylemind.ai",
    height: 174,
    weight: 68,
    bodyType: "athletic",
    styleVibe: "minimal"
  });
  
  // Global synchronization states
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [challenges, setChallenges] = useState<CommunityChallenge[]>(MOCK_CHALLENGES);
  const [savedOutfits, setSavedOutfits] = useState<OutfitRecommendation[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = TRANSLATIONS[lang];

  const handleDiagnosisComplete = (newDna: StyleDNA) => {
    // Inject custom name into the computed DNA result
    setStyleDna({
      ...newDna,
      profileName: userProfile.name + " (" + (lang === "ko" ? "맞춤" : "Custom") + ")"
    });
    setActiveTab("dna"); // Direct redirect to dashboard
  };

  const handleSaveOutfit = (outfit: OutfitRecommendation) => {
    if (!savedOutfits.some((o) => o.id === outfit.id)) {
      setSavedOutfits((prev) => [outfit, ...prev]);
    }
  };

  const handleRemoveOutfit = (id: string) => {
    setSavedOutfits((prev) => prev.filter((o) => o.id !== id));
  };

  const joinedChallengeTitles = challenges.filter((c) => c.joined).map((c) => c.title);
  const savedOutfitIds = savedOutfits.map((o) => o.id);

  if (!isLoggedIn) {
    return (
      <LandingPage
        lang={lang}
        setLang={setLang}
        onLogin={(profile) => {
          if (profile) {
            setUserProfile(profile);
          }
          setIsLoggedIn(true);
        }}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
      />
    );
  }

  // Dynamic light/dark styling wrappers
  const themeClass = themeMode === "dark" 
    ? "bg-[#080809] text-gray-100 selection:bg-accent-blue/30" 
    : "bg-[#FAF9F6] text-[#111111] selection:bg-accent-blue/20";

  const navTabs = [
    { id: "diagnosis", label: t.nav_diagnosis, icon: Sparkles },
    { id: "dna", label: t.nav_dna, icon: Award },
    { id: "outfit", label: t.nav_outfit, icon: Compass },
    { id: "fitting", label: t.nav_fitting, icon: Shirt },
    { id: "coach", label: t.nav_coach, icon: HelpCircle },
    { id: "community", label: t.nav_community, icon: Heart },
    { id: "shopping", label: t.nav_shopping, icon: ShoppingBag },
    { id: "mypage", label: t.nav_mypage, icon: Folder }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${themeClass} ${themeMode === "light" ? "text-neutral-900" : ""}`}>
      
      {/* Light mode style overrides injected cleanly */}
      {themeMode === "light" && (
        <style dangerouslySetInnerHTML={{__html: `
          .glass-panel {
            background: rgba(255, 255, 255, 0.7) !important;
            backdrop-filter: blur(24px) !important;
            -webkit-backdrop-filter: blur(24px) !important;
            border: 1px solid rgba(0, 0, 0, 0.06) !important;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.02) !important;
          }
          h1, h2, h3, h4, h5, h6, strong, .text-white {
            color: #111111 !important;
          }
          p, span, li, blockquote, .text-gray-300, .text-gray-400 {
            color: #4A4A4F !important;
          }
          .text-gray-500, .text-gray-600 {
            color: #72727A !important;
          }
          .border-white\\/5, .border-white\\/10, .border-white\\/15, .border-white\\/20, .border-white\\/12 {
            border-color: rgba(0, 0, 0, 0.08) !important;
          }
          .bg-white\\/\\[0\\.01\\] , .bg-white\\/\\[0\\.02\\] , .bg-white\\/\\[0\\.03\\] , .bg-white\\/\\[0\\.04\\] {
            background-color: rgba(0, 0, 0, 0.024) !important;
          }
          .bg-neutral-950, .bg-neutral-900 {
            background-color: rgba(0, 0, 0, 0.035) !important;
          }
          input {
            color: #111111 !important;
          }
        `}} />
      )}

      {/* 1. FIXED TOP PLATFORM NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 w-full bg-[#080809]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Sleek brand typography */}
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => setActiveTab("diagnosis")}>
            <span className="font-display text-xl font-black tracking-tighter text-accent-blue block uppercase">
              StyleMind<span className={themeMode === "light" ? "text-black" : "text-white"}>.AI</span>
            </span>
          </div>

          {/* Desktop Nav Actions */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navTabs.map((tab) => {
              const IconComp = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  id={`nav-tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-[#5B7FFF] text-white shadow-lg shadow-accent-blue/15"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header parameters (Search, Profile, Language Selector, Theme Switch) */}
          <div className="flex items-center gap-3">
            {/* Bilingual Switcher pill - Styled elegantly for fashion */}
            <div className="flex bg-neutral-900 border border-white/5 p-1 rounded-xl items-center gap-0.5">
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all ${
                  lang === "en"
                    ? "bg-[#5B7FFF] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("ko")}
                className={`px-2 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all ${
                  lang === "ko"
                    ? "bg-[#5B7FFF] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                KO
              </button>
            </div>

            {/* Profile Avatar with premium styled gradient rings */}
            <div className="hidden md:flex items-center gap-2.5">
              <div className="text-right">
                <p className={`text-xs font-bold leading-none ${themeMode === "light" ? "text-neutral-950" : "text-white"}`}>{userProfile.name}</p>
                <div className="flex items-center gap-1.5 justify-end mt-1">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest">{t.pro_member}</span>
                  <span className="text-neutral-700 text-[8px]">•</span>
                  <button 
                    onClick={() => setIsLoggedIn(false)}
                    className="text-[9px] text-[#5B7FFF] hover:text-pink-400 font-bold uppercase cursor-pointer transition-colors bg-transparent border-0 p-0"
                  >
                    {lang === "ko" ? "로그아웃" : "Logout"}
                  </button>
                </div>
              </div>
              <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-[#5B7FFF] to-purple-500 p-[1px] shrink-0">
                <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center text-[10px] font-bold text-white">
                  {userProfile.name.slice(0, 2).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Theme Toggle pill */}
            <button
              id="theme-toggler"
              onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer bg-neutral-900"
              aria-label="Toggle theme mode"
            >
              {themeMode === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-accent-blue" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-accent-blue" />
              )}
            </button>

            {/* Mobile Nav Menu Toggler */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-white/5 text-gray-400 hover:text-white transition-all bg-neutral-900"
              aria-label="Toggle dynamic menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 2. MOBILE NAVIGATION DRAWERS OVERLAY */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-[#0d0d0f] border-b border-white/5"
            >
              <div className="px-4 py-4 space-y-1.5">
                {navTabs.map((tab) => {
                  const IconComp = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full px-4 py-3 rounded-xl text-left text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-3 border ${
                        isSelected
                          ? "bg-white text-black border-white"
                          : "bg-transparent border-transparent text-gray-400 hover:text-white"
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}

                {/* Mobile logout action */}
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 rounded-xl text-left text-[11px] uppercase tracking-wider font-bold transition-all flex items-center gap-3 border border-red-500/20 text-red-400 hover:bg-red-500/5 bg-red-500/[0.02]"
                >
                  <X className="w-3.5 h-3.5 text-red-400" />
                  {lang === "ko" ? "로그아웃" : "Logout"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 3. HERO CONTENT VIEWPORT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Editorial Sub banner showing active metrics */}
        {activeTab !== "diagnosis" && styleDna && (
          <div className="flex md:justify-end mt-[-1.5rem] mb-6 relative z-10">
            <div className="glass-panel px-4 py-2 rounded-full border border-white/5 flex items-center gap-2.5 font-mono text-[10px]">
              <span className="text-gray-500 font-bold uppercase">{t.active_mode}:</span>
              <span className="text-white font-bold">{styleDna.profileName}</span>
              <span className="text-accent-blue blink font-bold">• {t.active_status}</span>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            {activeTab === "diagnosis" && (
              <AIStyleDiagnosis
                lang={lang}
                onDiagnosisComplete={handleDiagnosisComplete}
                styleDna={styleDna}
                defaultHeight={userProfile.height}
                defaultWeight={userProfile.weight}
                defaultName={userProfile.name}
              />
            )}

            {activeTab === "dna" && (
              styleDna ? (
                <StyleDNAViewer lang={lang} dna={styleDna} />
              ) : (
                <div id="no-dna-dashboard" className="text-center py-20 bg-neutral-900 border border-white/5 rounded-3xl">
                  <span className="text-gray-500 italic block">{t.dna_no_diag}</span>
                </div>
              )
            )}

            {activeTab === "outfit" && (
              <OutfitGenerator
                lang={lang}
                dna={styleDna}
                onSaveOutfit={handleSaveOutfit}
                savedOutfitIds={savedOutfitIds}
              />
            )}

            {activeTab === "fitting" && (
              <VirtualFittingStudio
                lang={lang}
                dna={styleDna}
                userProfile={userProfile}
              />
            )}

            {activeTab === "coach" && (
              <AICoach lang={lang} dna={styleDna} />
            )}

            {activeTab === "community" && (
              <Community
                lang={lang}
                posts={posts}
                challenges={challenges}
                onUpdatePosts={setPosts}
                onUpdateChallenges={setChallenges}
              />
            )}

            {activeTab === "shopping" && (
              <Shopping
                lang={lang}
                products={MOCK_PRODUCTS}
                dna={styleDna}
              />
            )}

            {activeTab === "mypage" && (
              <MyPage
                lang={lang}
                dna={styleDna}
                savedOutfits={savedOutfits}
                onRemoveOutfit={handleRemoveOutfit}
                joinedChallengeTitles={joinedChallengeTitles}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. FOOTER CREDITS */}
      <footer className="w-full bg-transparent border-t border-white/5 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2.5 font-mono text-[9px] text-gray-500 font-semibold tracking-widest uppercase">
          <div>© {new Date().getFullYear()} {t.footer_rights}</div>
          <div className="text-accent-blue">{t.footer_engine}</div>
        </div>
      </footer>

    </div>
  );
}
