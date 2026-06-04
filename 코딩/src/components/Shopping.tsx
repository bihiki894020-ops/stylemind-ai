import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Product, StyleDNA } from "../types";
import { TRANSLATIONS, Language } from "../lib/translations";
import { Tag, Sparkles, ChevronDown, Check, ShoppingCart, ShoppingBag, Star, HelpCircle, Store } from "lucide-react";

interface ShoppingProps {
  lang: Language;
  products: Product[];
  dna: StyleDNA | null;
}

export default function Shopping({ lang, products, dna }: ShoppingProps) {
  const t = TRANSLATIONS[lang];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("match"); // "match" | "price_asc" | "price_desc" | "rating"
  const [cartCount, setCartCount] = useState(0);
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  // Dynamic products calculator based on active DNA
  const processedProducts = products.map((prod) => {
    let matchRate = prod.matchPercentage;
    if (dna) {
      // If product category matches the user's preferred categories, boost match rate!
      const isPreferredCategory = dna.preferredCategories.some(
        (cat) => prod.category.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(prod.category.toLowerCase())
      );
      
      if (isPreferredCategory) {
        matchRate = Math.min(99, matchRate + 8);
      }

      // If product tag matches user vibe, boost!
      const userVibeWord = dna.vibe.toLowerCase();
      const tagMatch = prod.tags.some(t => userVibeWord.includes(t.toLowerCase()));
      if (tagMatch) {
         matchRate = Math.min(99, matchRate + 4);
      }
    }
    return { ...prod, calculatedMatch: matchRate };
  });

  // Extract unique categories for filter row
  const rawCategories = Array.from(new Set(products.map((p) => p.category)));
  const categories = ["All", ...rawCategories];

  // Filtering
  const filteredProducts = processedProducts.filter((prod) => {
    if (selectedCategory === "All") return true;
    return prod.category === selectedCategory;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "match") return b.calculatedMatch - a.calculatedMatch;
    if (sortOption === "price_asc") return a.price - b.price;
    if (sortOption === "price_desc") return b.price - a.price;
    if (sortOption === "rating") return b.rating - a.rating;
    return 0;
  });

  const handleAddToCart = (name: string) => {
    setCartCount(prev => prev + 1);
    setAddedItemName(name);
    setTimeout(() => {
      setAddedItemName(null);
    }, 2000);
  };

  const getLocalizedCategoryName = (cat: string) => {
    if (cat === "All") return t.shop_filter_all;
    if (lang === "ko") {
      if (cat.includes("Knitwear")) return "프리미엄 니트웨어";
      if (cat.includes("Trousers")) return "핀턱 트라우저 팬츠";
      if (cat.includes("Outerwear")) return "테크니컬 아우터";
      if (cat.includes("Denim")) return "아카이브 데님";
      if (cat.includes("Blazers")) return "첼시 슈즈 & 더비";
    }
    return cat;
  };

  return (
    <div id="shopping-feed-view" className="space-y-8">
      
      {/* Editorial Store Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/5">
        <div>
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#5B7FFF] font-bold uppercase bg-[#5B7FFF]/10 px-3.5 py-1.5 rounded-full border border-[#5B7FFF]/10">
            {t.shop_partner}
          </span>
          <h1 className="text-3.5xl md:text-4xl font-display font-medium text-white tracking-tight mt-3">{t.shop_title}</h1>
          <p className="text-xs text-gray-500 mt-1">{t.shop_desc}</p>
        </div>

        {/* Shopping basket badge */}
        <div className="glass-panel px-5 py-3 rounded-full flex items-center gap-3 border border-white/10 shrink-0 bg-white/[0.01]">
          <ShoppingCart className="w-4.5 h-4.5 text-[#5B7FFF]" />
          <span className="font-mono text-xs font-bold text-white">{t.shop_cart.replace("{count}", String(cartCount))}</span>
        </div>
      </div>

      {/* Control row (Filters + Sorter) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Chips row */}
        <div className="flex flex-wrap gap-2">
          {categories.slice(0, 7).map((cat) => (
            <button
               key={cat}
               onClick={() => setSelectedCategory(cat)}
               className={`px-4.5 py-2.5 rounded-2xl text-[11px] font-semibold cursor-pointer transition-all duration-250 border ${
                 selectedCategory === cat
                   ? "bg-[#5B7FFF] text-white border-transparent shadow-lg shadow-[#5B7FFF]/15"
                   : "bg-white/[0.01] hover:bg-white/[0.03] border-white/5 text-gray-300"
               }`}
            >
              {getLocalizedCategoryName(cat)}
            </button>
          ))}
        </div>

        {/* Sorters Selection drop list */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-[9px] text-[#5B7FFF] uppercase tracking-widest font-bold">{t.shop_sort_by}</span>
          <div className="relative">
            <select
              id="shopping-sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-neutral-900 text-[11px] text-white px-4.5 py-3 pr-9 rounded-2xl border border-white/5 focus:outline-none appearance-none cursor-pointer font-bold"
            >
              <option value="match">{t.shop_sort_match}</option>
              <option value="price_asc">{t.shop_sort_price_asc}</option>
              <option value="price_desc">{t.shop_sort_price_desc}</option>
              <option value="rating">{t.shop_sort_rating}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5B7FFF] absolute right-3 top-3.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Items Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {sortedProducts.map((prod) => {
          const itemTitle = lang === "ko" ? prod.koName || prod.name : prod.name;
          const partnerLabel = lang === "ko" ? prod.koPartnerMall || prod.partnerMall : prod.partnerMall;

          return (
            <div key={prod.id} className="glass-panel rounded-3.5xl overflow-hidden border border-white/5 group flex flex-col justify-between hover:border-white/10 transition-all duration-300 bg-white/[0.01]">
              
              {/* Image stack */}
              <div className="relative h-72 bg-neutral-900 overflow-hidden">
                <img
                  src={prod.image}
                  alt={itemTitle}
                  className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Match overlay counter */}
                <div className="absolute top-4 right-4 bg-neutral-950/85 backdrop-blur-md px-3 py-2 rounded-2xl border border-[#5B7FFF]/15 flex items-center gap-1.5 font-mono text-[10px] font-bold text-white shadow-lg shadow-[#5B7FFF]/5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5B7FFF] animate-pulse" />
                  <span>{prod.calculatedMatch}% Match</span>
                </div>

                {/* Affiliate Partner Label */}
                {partnerLabel && (
                  <div className="absolute bottom-4 left-4 bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-1.5 text-[9px] font-mono font-bold text-gray-400">
                    <Store className="w-3.5 h-3.5 text-[#5B7FFF]" />
                    <span>{partnerLabel}</span>
                  </div>
                )}
              </div>

              {/* Info pane */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-5">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                    <span className="text-gray-500 uppercase tracking-wider">{prod.brand}</span>
                    <span className="text-gray-400 bg-white/[0.02] border border-white/5 px-2.5 py-0.5 rounded-md font-sans">
                      {getLocalizedCategoryName(prod.category)}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-white text-xs leading-snug tracking-tight group-hover:text-[#5B7FFF] transition-colors line-clamp-2 min-h-[36px]">
                    {itemTitle}
                  </h3>

                  {/* Rating row */}
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider pt-1">
                    <Star className="w-3.5 h-3.5 fill-[#5B7FFF] stroke-[#5B7FFF]" />
                    <span className="text-white">{prod.rating}</span>
                    <span>•</span>
                    <span>{prod.sizes.join(", ")} Size Available</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="font-mono text-base font-extrabold text-white">${prod.price}</span>
                  <button
                    id={`add-to-cart-${prod.id}`}
                    onClick={() => handleAddToCart(itemTitle)}
                    className="bg-white hover:bg-neutral-200 text-black font-display text-[10px] uppercase font-bold tracking-wider px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {t.shop_request_btn.split(" ")[0]}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating purchase confirmation alert widget */}
      <AnimatePresence>
        {addedItemName && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-950 border border-green-500/25 px-5 py-3.5 rounded-2xl flex items-center gap-3.5 shadow-2x z-50 text-xs font-semibold text-white"
          >
            <div className="p-1.5 bg-green-500/10 rounded-full">
              <Check className="w-4 h-4 text-green-400" />
            </div>
            <span>{t.shop_add_queue.replace("{name}", addedItemName)}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
