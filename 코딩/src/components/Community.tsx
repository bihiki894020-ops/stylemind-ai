import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CommunityPost, CommunityChallenge } from "../types";
import { TRANSLATIONS, Language } from "../lib/translations";
import { Heart, Bookmark, MessageSquare, Send, Trophy, Users, ArrowRight, X, Calendar } from "lucide-react";

interface CommunityProps {
  lang: Language;
  posts: CommunityPost[];
  challenges: CommunityChallenge[];
  onUpdatePosts: (posts: CommunityPost[]) => void;
  onUpdateChallenges: (challenges: CommunityChallenge[]) => void;
}

export default function Community({ lang, posts, challenges, onUpdatePosts, onUpdateChallenges }: CommunityProps) {
  const t = TRANSLATIONS[lang];
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [newCommentText, setNewCommentText] = useState("");

  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = posts.map((post) => {
      if (post.id === postId) {
        const hasLiked = !post.hasLiked;
        return {
          ...post,
          hasLiked,
          likes: hasLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    });
    onUpdatePosts(updated);
  };

  const handleSavePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = posts.map((post) => {
      if (post.id === postId) {
        const hasSaved = !post.hasSaved;
        return {
          ...post,
          hasSaved,
          saves: hasSaved ? post.saves + 1 : post.saves - 1
        };
      }
      return post;
    });
    onUpdatePosts(updated);
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedPost) return;

    const newComment = {
      id: `comm_${Date.now()}`,
      author: "you_tastemaker",
      avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=you",
      text: newCommentText,
      time: "Just now"
    };

    const updatedPosts = posts.map((p) => {
      if (p.id === selectedPost.id) {
        const comments = p.comments || [];
        return {
          ...p,
          comments: [newComment, ...comments],
          commentsCount: p.commentsCount + 1
        };
      }
      return p;
    });

    onUpdatePosts(updatedPosts);
    
    // Find the updated post to re-focus details drawer
    const nextPost = updatedPosts.find((p) => p.id === selectedPost.id);
    if (nextPost) setSelectedPost(nextPost);
    
    setNewCommentText("");
  };

  const handleJoinChallenge = (challengeId: string) => {
    const updated = challenges.map((ch) => {
      if (ch.id === challengeId) {
        const nextJoined = !ch.joined;
        return {
          ...ch,
          joined: nextJoined,
          participants: nextJoined ? ch.participants + 1 : ch.participants - 1
        };
      }
      return ch;
    });
    onUpdateChallenges(updated);
  };

  const handleSubmitToChallenge = (challengeId: string) => {
    const sampleVisuals = [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&auto=format&fit=crop&q=80"
    ];
    const pickedSub = sampleVisuals[Math.floor(Math.random() * sampleVisuals.length)];

    const updated = challenges.map((ch) => {
      if (ch.id === challengeId) {
        return {
          ...ch,
          submissions: [pickedSub, ...ch.submissions],
          participants: ch.participants + 1
        };
      }
      return ch;
    });
    onUpdateChallenges(updated);
  };

  const getLocalizedChallengeTitle = (title: string) => {
    if (lang === "ko") {
      if (title.includes("Brutalist")) return "브루탈리스트 단선 모노크롬 챌린지";
      if (title.includes("Oversized Contrast")) return "오버사이즈 오버코트 극비율 대비 배색";
      if (title.includes("Urban Utility")) return "도심 속기능 유틸리티 스포티 하이브리드";
    }
    return title;
  };

  const getLocalizedChallengeDesc = (desc: string) => {
    if (lang === "ko") {
      if (desc.includes("exclusively a single")) return "오직 하나의 톤다운된 단색 계열을 사용하여 디테일 중심의 레이어드 포뮬러를 완벽히 소화하는 도전입니다.";
      if (desc.includes("bagginess by styling")) return "박시한 오프 하이 숄더 실루엣에 상반되는 타이트한 이너 라인을 믹스 매치하여 세련미를 뽐내는 핏 조정 도전입니다.";
      if (desc.includes("Combine highly active")) return "뛰어난 기능성 아웃도어 하드쉘 파카에 정장 느낌의 정갈한 트라우저와 밀리터리 청키 슈즈를 결합해 보세요.";
    }
    return desc;
  };

  return (
    <div id="community-view-container" className="space-y-12">
      
      {/* 1. STYLING CHALLENGES BLOCK */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 pb-3 border-b border-white/5">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#5B7FFF] font-bold uppercase">{t.community_contest_tag}</span>
            <h2 className="text-2.5xl md:text-3xl font-display font-medium text-white tracking-tight mt-1.5">{t.community_challenge_title}</h2>
          </div>
          <p className="text-xs text-gray-500 max-w-sm md:text-right">
            {t.community_challenge_desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.map((ch) => (
            <div key={ch.id} className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between relative overflow-hidden bg-white/[0.01]">
              {ch.joined && (
                <div className="absolute top-0 right-0 bg-[#5B7FFF] text-[9px] font-mono text-white tracking-widest px-3.5 py-1.5 rounded-bl-xl uppercase font-semibold">
                  {t.community_status_joined}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <span className="font-mono text-[9px] text-[#5B7FFF] font-bold uppercase tracking-wider block">CHALLENGE TASK</span>
                  <h3 className="font-display font-semibold text-white text-xs mt-1.5 line-clamp-1">{getLocalizedChallengeTitle(ch.title)}</h3>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed font-sans line-clamp-3 min-h-[48px]">
                  {getLocalizedChallengeDesc(ch.description)}
                </p>

                <div className="flex items-center gap-4 text-gray-500 font-mono text-[9px]">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-gray-500" />
                    <span>{ch.participants} {t.community_chall_participants}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    <span>{ch.daysRemaining}{t.community_chall_days}</span>
                  </div>
                </div>

                {/* Submissions strip */}
                {ch.submissions && ch.submissions.length > 0 ? (
                  <div className="space-y-2 pt-2">
                    <span className="font-mono text-[9px] text-gray-500 tracking-wider block uppercase font-bold">{t.community_chall_submissions}</span>
                    <div className="flex gap-2">
                      {ch.submissions.map((sub, sIdx) => (
                        <div key={sIdx} className="w-8 h-8 rounded-lg overflow-hidden border border-white/5 shrink-0">
                          <img src={sub} alt="Sub" className="w-full h-full object-cover grayscale" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex gap-2.5 pt-6 mt-6 border-t border-white/5">
                <button
                  id={`join-challenge-${ch.id}`}
                  onClick={() => handleJoinChallenge(ch.id)}
                  className={`flex-1 font-display text-[10px] uppercase font-bold tracking-wider py-3.5 rounded-xl transition-all duration-300 cursor-pointer text-center border ${
                    ch.joined
                      ? "bg-transparent border-white/10 text-gray-400 hover:border-white/20"
                      : "bg-white text-black hover:bg-neutral-200 border-transparent"
                  }`}
                >
                  {ch.joined ? t.community_btn_exit : t.community_btn_join}
                </button>
                {ch.joined && (
                  <button
                    onClick={() => handleSubmitToChallenge(ch.id)}
                    className="flex-1 bg-[#5B7FFF] hover:bg-[#476ce6] text-white font-display text-[10px] uppercase font-bold tracking-wider py-3.5 rounded-xl cursor-pointer"
                  >
                    {t.community_btn_submit}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. PINTEREST COLLAGE CORNER */}
      <section className="space-y-6">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#5B7FFF] font-bold uppercase">{t.community_feed_tag}</span>
          <h2 className="text-2.5xl md:text-3xl font-display font-medium text-white tracking-tight mt-1.5">{t.community_feed_title}</h2>
        </div>

        {/* Masonry-like structural container */}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {posts.map((post) => {
            const hasDescKo = lang === "ko";
            const localizedDesc = hasDescKo && post.description.includes("Autumn layers") 
              ? "가을 레이어드룩 완성! 해체주의 오버사이즈 울 블레이저와 가볍게 내려앉는 차콜 모 린넨 트라우저의 완벽한 앙상블 조합." 
              : hasDescKo && post.description.includes("Fully rigged in active")
              ? "방수 우천 보텍스 자켓 장비 완료! 기능성에 충실한 유틸리티 하네스 고프코어 스타일."
              : hasDescKo && post.description.includes("High drama in")
              ? "심플함 속에서 피어오르는 전위적 패션. 베이지 로브 코트에 청키한 블랙 로퍼로 균형 잡기."
              : hasDescKo && post.description.includes("Relaxed sand cardigans")
              ? "크리에이티브 스튜디오 작업날, 샌드 가디건과 정교한 기하학 선글라스 조합."
              : hasDescKo && post.description.includes("Dug up this vintage")
              ? "가죽 마니아의 성지 동묘에서 건져 올린 크랙 아비에이터 레더 봄버에 셀비지 매치."
              : hasDescKo && post.description.includes("Pitch black silhouettes")
              ? "노출 콘크리트 배경에 어우러지는 피치 블랙 실루엣. 핏과 셔링만으로 예술성 표현."
              : post.description;

            return (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="break-inside-avoid glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between group cursor-pointer mb-6 bg-white/[0.01]"
              >
                {/* Picture area */}
                <div className="relative overflow-hidden bg-neutral-900 rounded-t-3xl">
                  <img
                    src={post.image}
                    alt="Post Styling"
                    className="w-full h-auto object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.02]"
                    referrerPolicy="no-referrer"
                  />

                  {/* Profile float badge */}
                  <div className="absolute bottom-3 left-3 bg-neutral-950/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-2">
                    <img src={post.authorAvatar} alt={post.authorName} className="w-5 h-5 rounded-full border border-white/10" />
                    <span className="font-mono text-[9px] text-white font-semibold">@{post.authorName}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">
                  <p className="text-xs text-gray-300 leading-relaxed font-sans line-clamp-2">
                    {localizedDesc}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="font-mono text-[9px] text-[#5B7FFF]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3.5 border-t border-white/5">
                    {/* Action values */}
                    <div className="flex items-center gap-3.5 font-mono text-[10px] text-gray-400">
                      <button
                        onClick={(e) => handleLike(post.id, e)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          post.hasLiked ? "text-red-400" : "hover:text-white"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${post.hasLiked ? "fill-red-400 stroke-red-400" : ""}`} />
                        <span>{post.likes}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{post.commentsCount}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleSavePost(post.id, e)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        post.hasSaved ? "text-[#5B7FFF] bg-[#5B7FFF]/10" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${post.hasSaved ? "fill-[#5B7FFF]" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. POST EXPANSION SLIDE-OUT DRAWER */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            key="comment-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPost(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-end"
          >
            <motion.div
              key="comment-drawer-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg h-full bg-neutral-950 border-l border-white/10 flex flex-col justify-between"
            >
              <div className="flex flex-col h-full overflow-hidden">
                {/* Header card details */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-neutral-900/40">
                  <div className="flex items-center gap-3">
                    <img src={selectedPost.authorAvatar} alt="Avatar" className="w-8 h-8 rounded-full border border-white/10" />
                    <div>
                      <span className="font-display text-xs text-white font-semibold block">@{selectedPost.authorName}</span>
                      <span className="text-[9px] text-gray-500 font-mono">Tastemaker Curator</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-2 bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Scrollable details */}
                <div className="flex-1 overflow-y-auto split-panels p-6 space-y-6">
                  {/* Photo cover */}
                  <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900">
                    <img src={selectedPost.image} alt="Look" className="w-full h-auto object-cover" />
                  </div>

                  {/* Vibe lines */}
                  <div className="space-y-3">
                    <p className="text-xs font-sans text-gray-200 leading-relaxed font-semibold">
                      {lang === "ko" && selectedPost.description.includes("Autumn layers") 
                        ? "가을 레이어드룩 완성! 해체주의 오버사이즈 울 블레이저와 가볍게 내려앉는 차콜 모 린넨 트라우저의 완벽한 앙상블 조합." 
                        : lang === "ko" && selectedPost.description.includes("Fully rigged in active")
                        ? "방수 우천 보텍스 자켓 장비 완료! 기능성에 충실한 유틸리티 하네스 고프코어 스타일."
                        : lang === "ko" && selectedPost.description.includes("High drama in")
                        ? "심플함 속에서 피어오르는 전위적 패션. 베이지 로브 코트에 청키한 블랙 로퍼로 균형 잡기."
                        : lang === "ko" && selectedPost.description.includes("Relaxed sand cardigans")
                        ? "크리에이티브 스튜디오 작업날, 샌드 가디건과 정교한 기하학 선글라스 조합."
                        : lang === "ko" && selectedPost.description.includes("Dug up this vintage")
                        ? "가죽 마니아의 성지 동묘에서 건져 올린 크랙 아비에이터 레더 봄버에 셀비지 매치."
                        : lang === "ko" && selectedPost.description.includes("Pitch black silhouettes")
                        ? "노출 콘크리트 배경에 어우러지는 피치 블랙 실루엣. 핏과 셔링만으로 예술성 표현."
                        : selectedPost.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPost.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="font-mono text-[10px] text-[#5B7FFF] font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions counter row */}
                  <div className="flex items-center gap-6 py-4.5 border-y border-white/5 font-mono text-[10px] text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                      <span>{selectedPost.likes} Loves</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bookmark className="w-4 h-4 text-[#5B7FFF] fill-[#5B7FFF]" />
                      <span>{selectedPost.saves} Saves</span>
                    </div>
                  </div>

                  {/* Dynamic Comments List */}
                  <div className="space-y-4">
                    <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
                      {t.community_dialogue_title} ({selectedPost.commentsCount})
                    </h4>

                    <div className="space-y-4">
                       {selectedPost.comments && selectedPost.comments.length > 0 ? (
                        selectedPost.comments.map((comm) => (
                          <div key={comm.id} className="flex gap-3 items-start bg-white/[0.01] border border-white/5 p-3.5 rounded-2xl">
                            <img src={comm.avatar} alt="Commenter" className="w-7 h-7 rounded-full border border-white/5" />
                            <div className="flex-1 space-y-1">
                              <div className="flex justify-between items-baseline">
                                <span className="font-mono text-[10px] text-white font-bold">@{comm.author}</span>
                                <span className="font-mono text-[9px] text-gray-500">{comm.time}</span>
                              </div>
                              <p className="text-[11px] text-gray-300 leading-relaxed">{comm.text}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-[11px] text-gray-500 italic block">{t.community_dialogue_empty}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment submission footer */}
              <div className="p-4 border-t border-white/5 bg-neutral-950">
                <form onSubmit={submitComment} className="flex gap-2.5 bg-neutral-900 border border-white/5 p-2 rounded-xl">
                  <input
                    id="community-comment-input"
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder={t.community_comment_box_placeholder}
                    className="flex-1 bg-transparent border-none text-[11px] text-white focus:outline-none placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    disabled={!newCommentText.trim()}
                    className="bg-[#5B7FFF] hover:bg-[#476ce6] text-white px-3 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
