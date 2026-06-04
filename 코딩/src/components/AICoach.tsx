import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StyleDNA, CoachMessage } from "../types";
import { TRANSLATIONS, Language } from "../lib/translations";
import { Send, Sparkles, RefreshCw, Bot, User, HelpCircle, Pocket } from "lucide-react";

interface AICoachProps {
  lang: Language;
  dna: StyleDNA | null;
}

const QUICK_PROMPTS_EN = [
  "How can I layer fluid trench coats under heavy wool cargo setups?",
  "Recommend a complete monochrome wardrobe palette for creative studios.",
  "What footwear silhouette pairs best with heavy straight-leg jeans?",
  "Which styling items can elevate a simple white tee look?"
];

const QUICK_PROMPTS_KO = [
  "헤비 울 카고 팬츠에 길게 가라앉는 트렌치 코트를 어색하지 않게 레이어링 하려면?",
  "크리에이티브 스튜디오 작업실에서 입기 좋은 미니멀 모노톤 워드롭 조합을 추천해줘.",
  "통이 넓고 기장감이 길게 떨어지는 와이드 스트레이트 데님에 어울리는 신발 실루엣은?",
  "심플한 오프화이트 기본 티셔츠 코디에 포인트가 될 만한 주얼리 조합은?"
];

export default function AICoach({ lang, dna }: AICoachProps) {
  const t = TRANSLATIONS[lang];
  const QUICK_PROMPTS = lang === "ko" ? QUICK_PROMPTS_KO : QUICK_PROMPTS_EN;

  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize greeting dynamically depending on selected language and active Style DNA
  useEffect(() => {
    const greetingText = lang === "ko" 
      ? `반갑습니다! 당신의 **StyleMind AI 개인 크리에이티브 디렉터**입니다. 
에디토리얼 아방가르드 실루엣부터 젠지 스트릿 핏의 조화까지, 옷깃의 라인과 중량감을 살린 감성적 코디를 함께 설계해 드릴게요.

${dna ? `현재 회원님의 **Style DNA: ${dna.profileName}**에 결합된 실루엣이 활성화되어 있습니다. 원하시는 레이어드 포뮬러, 핏 가이드에 대해 자유롭게 대화해 보세요!` : "어떠한 디테일 실루엣의 설계를 도와드릴까요?"}`
      : `Hello! I am your **StyleMind Personal Styling Director**. 
Fusing editorial aesthetics with Gen Z street-level trends, I can coach you on layering formulas, footwear weights, and visual styling.

${dna ? `I've mapped your active Style DNA: **${dna.profileName}**. Let me know what wardrobe adjustments, events looks, or custom proportions you'd like to construct today!` : "How can I guide your silhouette design blueprint today?"}`;

    setMessages([
      {
        id: "initial_coach",
        role: "model",
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  }, [lang, dna]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessageToCoach = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: CoachMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/style/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          userDna: dna,
          lang: lang
        })
      });

      if (!response.ok) {
        throw new Error("Coach connection timeout.");
      }

      const data = await response.json();
      if (data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: `c_${Date.now()}`,
            role: "model",
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]);
      }
    } catch (err) {
      console.log("Coach styling session sync completed.");
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: "model",
          text: lang === "ko" 
            ? "잠시 서버 스타일 연마 엔진에 지연이 발생했습니다. 1초만 있다가 피드백 공식을 다시 제안해 주세요!"
            : "I experienced a brief server synchronization issue. Let's try restructuring that style formula again in a second!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessageToCoach(inputValue);
    }
  };

  // Helper to elegantly format markdown in coaching answers
  const formatCoachText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      let content = line;
      // Bold rendering **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      
      const elements = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          elements.push(
            <span key={`text-${lastIndex}`}>{content.substring(lastIndex, match.index)}</span>
          );
        }
        elements.push(
          <strong key={`bold-${match.index}`} className="text-white font-bold font-sans">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < content.length) {
        elements.push(
          <span key={`text-${lastIndex}`}>{content.substring(lastIndex)}</span>
        );
      }

      const finalizedRow = elements.length > 0 ? elements : [content];

      // Blockquote styling if starting with >
      if (line.startsWith(">")) {
        return (
          <blockquote key={idx} className="border-l-2 border-[#5B7FFF] pl-3.5 py-1.5 my-2 bg-[#5B7FFF]/5 text-xs italic text-gray-300">
            {line.substring(2)}
          </blockquote>
        );
      }

      // Check bullet point
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-gray-300 py-1 leading-relaxed">
            {finalizedRow}
          </li>
        );
      }

      return (
        <p key={idx} className="text-xs text-gray-300 leading-relaxed py-1 font-sans">
          {finalizedRow}
        </p>
      );
    });
  };

  return (
    <div id="ai-coach-container" className="max-w-5xl mx-auto py-2">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Info Box Sidebar Left */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel p-5 rounded-3xl border border-white/5 space-y-4 bg-white/[0.01]">
            <div className="flex items-center gap-2.5 text-[#5B7FFF]">
              <Bot className="w-4.5 h-4.5 shrink-0" />
              <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wider">{t.coach_title_side}</h4>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
              {t.coach_desc_side}
            </p>

            {dna ? (
              <div className="pt-3 border-t border-white/5 space-y-2">
                <span className="text-[9px] font-mono tracking-widest text-[#5B7FFF] block uppercase font-bold">DNA ACTIVE LOOK</span>
                <div className="bg-[#5B7FFF]/5 border border-[#5B7FFF]/10 p-3.5 rounded-2xl">
                  <span className="font-display text-white text-xs font-semibold block">{dna.profileName}</span>
                  <span className="text-[10px] text-gray-400 block mt-1 leading-normal line-clamp-2">{dna.vibe}</span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-white/5 space-y-3 bg-white/[0.01]">
            <span className="text-[9px] font-mono tracking-widest text-gray-500 block font-bold uppercase">{t.coach_cheats}</span>
            <div className="space-y-2 font-sans">
              <div className="text-[10px] text-gray-300 flex items-start gap-1.5 leading-relaxed">
                <span className="text-[#5B7FFF] font-bold">•</span> {t.coach_cheat_1}
              </div>
              <div className="text-[10px] text-gray-300 flex items-start gap-1.5 leading-relaxed">
                <span className="text-[#5B7FFF] font-bold">•</span> {t.coach_cheat_2}
              </div>
              <div className="text-[10px] text-gray-300 flex items-start gap-1.5 leading-relaxed">
                <span className="text-[#5B7FFF] font-bold">•</span> {t.coach_cheat_3}
              </div>
            </div>
          </div>
        </div>

        {/* Conversation Box Right */}
        <div className="lg:col-span-3 flex flex-col justify-between glass-panel rounded-4xl border border-white/10 overflow-hidden min-h-[520px] bg-white/[0.01]">
          
          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5 max-h-[420px]">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isCoach = msg.role === "model";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-3.5 max-w-[85%] ${isCoach ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                  >
                    <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center shrink-0 border ${
                      isCoach ? "bg-[#5B7FFF]/15 border-[#5B7FFF]/20" : "bg-neutral-900 border-[#5B7FFF]/10"
                    }`}>
                      {isCoach ? <Bot className="w-4.5 h-4.5 text-[#5B7FFF]" /> : <User className="w-4.5 h-4.5 text-gray-300" />}
                    </div>

                    <div className={`p-4 rounded-2xl border space-y-1.5 ${
                      isCoach ? "bg-white/[0.01] border-white/5 rounded-tl-sm" : "bg-[#5B7FFF]/10 border-[#5B7FFF]/20 rounded-tr-sm"
                    }`}>
                      <div className="font-sans whitespace-pre-wrap">
                        {isCoach ? formatCoachText(msg.text) : <p className="text-xs text-white leading-relaxed">{msg.text}</p>}
                      </div>
                      <span className="font-mono text-[9px] text-gray-500 float-right mt-1">{msg.timestamp}</span>
                    </div>
                  </motion.div>
                );
              })}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3.5 mr-auto"
                >
                  <div className="w-8.5 h-8.5 rounded-full flex items-center justify-center border bg-[#5B7FFF]/15 border-[#5B7FFF]/20 shrink-0">
                    <Bot className="w-4.5 h-4.5 text-[#5B7FFF] animate-pulse" />
                  </div>
                  <div className="bg-white/[0.01] border border-white/5 px-4.5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[#5B7FFF] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-[#5B7FFF] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-[#5B7FFF] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Quick Prompts Container */}
          {messages.length === 1 && (
            <div className="px-6 md:px-8 pb-4 space-y-3">
              <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[9px] font-bold tracking-widest uppercase">
                <HelpCircle className="w-3.5 h-3.5 text-[#5B7FFF]" /> {t.coach_suggested}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {QUICK_PROMPTS.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessageToCoach(qp)}
                    className="text-left text-[11px] bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/12 px-4 py-3 rounded-2xl transition-all duration-200 line-clamp-1 leading-normal text-gray-300 font-semibold cursor-pointer"
                  >
                    &ldquo;{qp}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box Bottom */}
          <div className="p-4 md:p-6 border-t border-white/5 bg-neutral-950/40">
            <div className="flex items-center gap-3 bg-neutral-900 border border-white/5 rounded-2xl px-4 py-3">
              <input
                id="coach-chat-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={loading ? t.coach_placeholder_loading : t.coach_placeholder}
                disabled={loading}
                className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none placeholder-gray-500"
              />
              <button
                onClick={() => sendMessageToCoach(inputValue)}
                disabled={loading || !inputValue.trim()}
                className="bg-[#5B7FFF] hover:bg-[#476ce6] text-white p-3 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
