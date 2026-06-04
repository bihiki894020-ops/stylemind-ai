import { SurveyQuestion, Product, CommunityPost, CommunityChallenge, StyleDNA } from "../types";

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: "style_vibe",
    question: "Select your desired styling silhouette preference",
    questionKo: "원하시는 피팅 실루엣 선호도를 선택해주세요",
    options: [
      { id: "oversized", label: "Oversized & Fluid Drape (Gen Z casual, modular layers)", labelKo: "오버사이즈 & 편안한 드레이핑 (젠지 캐주얼, 레이어드 스타일)" },
      { id: "tailored", label: "Structured & Sharp Tailoring (Formal shoulders, clean cuts)", labelKo: "구조적이고 선명한 클래식 테일러링 (포멀 숄더, 깔끔한 재단)" },
      { id: "boxy", label: "Classic Boxy Athletic (Heavyweight fabrics, sporty street)", labelKo: "클래식 박시 애슬레틱 (헤비웨이트 탄탄한 원단, 스포티 스트릿)" },
      { id: "fitted", label: "Sleek Slim-Cut (Nipped waist, retro tight-fits)", labelKo: "슬릭 슬림 무드 (슬림 웨이스트 라인, 올드스쿨 피트)" }
    ]
  },
  {
    id: "mood_board",
    question: "Which visual mood board speaks to you the most?",
    questionKo: "당신이 추구하는 고유한 무드를 가장 잘 설명하는 단어는 무엇인가요?",
    options: [
      { id: "minimalist", label: "Quiet Luxury Minimalist (Pure neutrals, solid colors, zero logos)", labelKo: "조용한 럭셔리 미니멀리스트 (뉴트럴 모노톤, 솔리드 단색, 브랜드 명배제)" },
      { id: "streetwear", label: "Brutalist Streetwear (Heavy graphics, metal details, cargo shells)", labelKo: "브루탈리스트 실용주의 스트리트웨어 (헤비 그래픽 프린팅, 금속 디테일, 카고)" },
      { id: "editorial", label: "Editorial Avant-Garde (Asymmetrical cuts, raw canvas, unique drapes)", labelKo: "에디토리얼 아방가르드 (비대칭적 해체주의 레이아웃, 독특한 셔링 주름)" },
      { id: "vintage", label: "Sartorial Retro Grunge (Faded washes, vintage leathers, archives)", labelKo: "사토리아 아날로그 그런지 (빈티지 바랜 가죽, 아카이브 데님, 레트로 필터)" }
    ]
  },
  {
    id: "lifestyle",
    question: "What is your primary daily setting?",
    questionKo: "당신이 일과 중 가장 오랜 시간을 보내는 장소는 어디인가요?",
    options: [
      { id: "creative", label: "Creative Studio or Art Gallery (Self-expressive, relaxed custom shapes)", labelKo: "크리에이티브 크래프트 스튜디오 & 아트 갤러리 (자유로운 자기표현, 뉴 셰이프)" },
      { id: "corporate", label: "Corporate Tech / Office (Sleek professional, polished neutral knitwear)", labelKo: "테크 기업 & 스마트 오피스 (단정하면서 세련된 세미 포멀, 정갈한 하이엔드 니트)" },
      { id: "outdoors", label: "Active Urban & Outdoors (Functional shells, ripstops, sneakers)", labelKo: "액티브 도심 활동 & 아웃도어 트레킹 (기능성 고어텍스 방수 자켓, 립스톱, 슈즈)" },
      { id: "nightlife", label: "Music Venues & Subterranean Clubbing (High-contrast, bold accents)", labelKo: "지하 라이브 하우스 & 미드나잇 클러빙 (대비가 강한 블랙톤 어두운 밤, 포인트)" }
    ]
  },
  {
    id: "body_shape",
    question: "How would you describe your current body frame preference?",
    questionKo: "스스로 생각하는 체형의 비율이나 상체 실루엣은 어떠한가요?",
    options: [
      { id: "trapezoid", label: "Balanced Trapezoid (Broad chest, slightly tapered waist)", labelKo: "균형 잡힌 트래퍼조이드 형태 (안정적인 가슴 둘레비, 자연스러운 웨이스트)" },
      { id: "rectangular", label: "Rectangular / Straight (Symmetric chest, waist, and hips line)", labelKo: "직사각형 슬레이트형 (어깨너비부터 허리, 골반까지 곧게 뻗은 슬림 뼈대)" },
      { id: "triangle", label: "Inverted energetic triangle (Highly pronounced athletic shoulders)", labelKo: "상체 강조 역삼각형 구조 (체격에 비해 넓게 다듬어진 스포티 숄더 프레임)" },
      { id: "oval", label: "Oval / Soft outline (Comfortable rounder contours, seeking drape guidance)", labelKo: "원형 소프트 궤적 (전체적으로 둥글며 부드러운 유선형 라인, 드레이핑으로 커버)" }
    ]
  }
];

export const INITIAL_STYLE_DNA: StyleDNA = {
  profileName: "Neoclassical Minimalist",
  vibe: "Quiet luxury refined with monochromatic fluidity and premium fabrics.",
  score: { versatility: 92, uniqueness: 75, cohesiveness: 94, trendFactor: 80 },
  overallScore: 85,
  colors: [
    { name: "Warm Off-White", hex: "#FAF9F6", percentage: 55 },
    { name: "Ink Black", hex: "#111111", percentage: 35 },
    { name: "Accent Indigo", hex: "#5B7FFF", percentage: 10 }
  ],
  preferredFit: ["Fluid Relaxed", "Structured Boxy", "Clean Straight-Leg"],
  preferredCategories: ["Premium Knitwear", "Tailored Pleated Trousers", "Minimalist Blazers"],
  styleCoachTip: "Sophistication lives in high-density cotton and cashmere textures. Focus on clean shoulder shapes and matching drape lines instead of logos. Accent with minimalist silver metal jewelry to stand out cleanly."
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Double-Breasted Raw Wool Oversized Blazer",
    koName: "더블브레스트 퓨어 울 오버사이즈 테일러드 블레이저",
    brand: "STUDIO_MIND",
    price: 195,
    category: "Premium Knitwear",
    koCategory: "프리미엄 니트웨어 & 아우터",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80",
    matchPercentage: 97,
    tags: ["Minimalist", "Oversized", "Layering"],
    koTags: ["미니멀리스트", "오버사이즈", "레이어드핏"],
    rating: 4.8,
    sizes: ["S", "M", "L"],
    partnerMall: "Musinsa Premium Luxury",
    koPartnerMall: "무신사 럭셔리 셀렉트",
    shoulderWidth: 48,
    chestWidth: 112,
    waistWidth: 96,
    garmentType: "blazer"
  },
  {
    id: "p2",
    name: "Wide-Drape Double Pleated S-Carve Trousers",
    koName: "와이드 드레이핑 더블 핀턱 S-카브 입체 트라우저",
    brand: "OVAL_LABS",
    price: 120,
    category: "Tailored Pleated Trousers",
    koCategory: "테일러드 트라우저 & 팬츠",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80",
    matchPercentage: 94,
    tags: ["Fluid", "Quiet Luxury", "Pleated"],
    koTags: ["플루이드", "조용한럭셔리", "주름바지"],
    rating: 4.6,
    sizes: ["28", "30", "32", "34"],
    partnerMall: "W Concept Exclusive Atelier",
    koPartnerMall: "W컨셉 익스클루시브 단독입점",
    shoulderWidth: 0,
    chestWidth: 84,
    waistWidth: 78,
    garmentType: "trousers"
  },
  {
    id: "p3",
    name: "Heavy Merino Wool Knit Mock Collar Base",
    koName: "헤비 메리노 울 시그니처 목칼라 슬릿 니트웨어",
    brand: "AESTHETIC_LAB",
    price: 89,
    category: "Premium Knitwear",
    koCategory: "프리미엄 니트웨어 & 아우터",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80",
    matchPercentage: 91,
    tags: ["Warm", "Soft", "Korean Aesthetic"],
    koTags: ["벌키텍스처", "부드러움", "미니멀코디"],
    rating: 4.9,
    sizes: ["M", "L", "XL"],
    partnerMall: "ssf_shop Atelier",
    koPartnerMall: "SSF 프리미엄 기획관",
    shoulderWidth: 46,
    chestWidth: 104,
    waistWidth: 88,
    garmentType: "knitwear"
  },
  {
    id: "p4",
    name: "Technical Ripstop Hard-Shell Parka Layer",
    koName: "테크니컬 3레이어 립스톱 방한용 아웃도어 하드쉘 파카",
    brand: "MIND_TECH",
    price: 245,
    category: "Outerwear & Shells",
    koCategory: "고기능 기능성 쉘 아우터",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&auto=format&fit=crop&q=80",
    matchPercentage: 88,
    tags: ["Waterproof", "Gorpcore", "Utility"],
    koTags: ["완전방수", "고프코어", "유틸리티하네스"],
    rating: 4.7,
    sizes: ["S", "M", "L"],
    partnerMall: "Empty Premium Select",
    koPartnerMall: "엠프티 테크니컬 셀렉트숍",
    shoulderWidth: 50,
    chestWidth: 118,
    waistWidth: 102,
    garmentType: "parka"
  },
  {
    id: "p5",
    name: "Raw Selvedge Indaco Wide-Leg Cargo Denim",
    koName: "생지 셀비지 인디코 와이드 레그 더블카고 아카이브 진",
    brand: "ARCHIVE_K",
    price: 135,
    category: "Japanese Denim",
    koCategory: "아카이브 셀비지 데님",
    image: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=600&auto=format&fit=crop&q=80",
    matchPercentage: 86,
    tags: ["Vintage", "Durable", "Dark-wash"],
    koTags: ["아카이브빈티지", "내구성최고", "생지다크워시"],
    rating: 4.5,
    sizes: ["30", "32", "34"],
    partnerMall: "Musinsa Premium Luxury",
    koPartnerMall: "무신사 럭셔리 셀렉트"
  },
  {
    id: "p6",
    name: "Brutalist Chunky Platform Leather Derby Shoes",
    koName: "브루탈리스트 청키 플랫홈 밀리터리 레더 더비 슈즈",
    brand: "DER_SOL",
    price: 220,
    category: "Premium Footwear",
    koCategory: "수제 레더 슈즈 & 부츠",
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80",
    matchPercentage: 82,
    tags: ["Chunky", "Italian Leather", "Brutalist"],
    koTags: ["소발청키", "이태리카프스킨", "볼드슈즈선형"],
    rating: 4.8,
    sizes: ["250", "260", "270", "280"],
    partnerMall: "29CM Luxury Exclusive",
    koPartnerMall: "29CM 프리미엄 전용쇼룸"
  },
  {
    id: "p7",
    name: "Deconstructed Hybrid Trench Technical Windbreaker",
    koName: "디컨스트럭티드 하이브리드 벨팅 크로스 쉘 테크 트렌치",
    brand: "MIND_TECH",
    price: 295,
    category: "Outerwear & Shells",
    koCategory: "고기능 기능성 쉘 아우터",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
    matchPercentage: 95,
    tags: ["Utility", "Avant-Garde", "Asymmetrical"],
    koTags: ["유틸리티", "해체주의", "슬림바이어스트릭"],
    rating: 4.9,
    sizes: ["M", "L"],
    partnerMall: "W Concept Exclusive Atelier",
    koPartnerMall: "W컨셉 익스클루시브 단독입점"
  },
  {
    id: "p8",
    name: "Asymmetrical Knot Fine Cotton Wrap Dress",
    koName: "에디토리얼 비대칭 드레이핑 파인 코튼 랩 원피스",
    brand: "OVAL_LABS",
    price: 180,
    category: "Tailored Pleated Trousers",
    koCategory: "원피스 & 스커트 라인",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
    matchPercentage: 92,
    tags: ["Editorial", "Sensual", "Linen"],
    koTags: ["아방가르드", "내추럴랩형태", "갤러리웨어"],
    rating: 4.7,
    sizes: ["S", "M"],
    partnerMall: "ssf_shop Atelier",
    koPartnerMall: "SSF 프리미엄 기획관"
  },
  {
    id: "p9",
    name: "Curved Double-Pocket Utility Parachute Pants",
    koName: "커브드 3D 투사이드 파라슈트 아스팔트 카고 팬츠",
    brand: "MIND_TECH",
    price: 145,
    category: "Tailored Pleated Trousers",
    koCategory: "테일러드 트라우저 & 팬츠",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80",
    matchPercentage: 90,
    tags: ["Streetwear", "Parachute", "Comfort"],
    koTags: ["벌키스트릿", "파라슈트핏", "무릎굴곡다트"],
    rating: 4.6,
    sizes: ["S", "M", "L"],
    partnerMall: "Empty Premium Select",
    koPartnerMall: "엠프티 테크니컬 셀렉트숍"
  },
  {
    id: "p10",
    name: "Distressed Open-Hole Fine Mohair Knitwear",
    koName: "디스트레스드 오픈홀 크랙 에어 모헤어 크루넥 니트",
    brand: "ARCHIVE_K",
    price: 165,
    category: "Premium Knitwear",
    koCategory: "프리미엄 니트웨어 & 아우터",
    image: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=600&auto=format&fit=crop&q=80",
    matchPercentage: 91,
    tags: ["Grunge", "Mohair", "Acid-wash"],
    koTags: ["그런지락스타", "천연모헤어", "크랙빈티지핏"],
    rating: 4.8,
    sizes: ["M", "L", "XL"],
    partnerMall: "Musinsa Premium Luxury",
    koPartnerMall: "무신사 럭셔리 셀렉트"
  },
  /* NEW HIGH-VALUED PARTNERSHIP DEALS ADDED BELOW */
  {
    id: "p11_partner",
    name: "Limited Edition Aged Washed Lambskin Bomber",
    koName: "[LIMITD] 빈티지 에이징 워시드 크랙 램스킨 레더 봄버",
    brand: "KREAM_ARCHIVE",
    price: 495,
    category: "Premium Knitwear",
    koCategory: "럭셔리 아카이브 한정판 레더",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
    matchPercentage: 98,
    tags: ["Aged Leather", "Retro", "Limitd"],
    koTags: ["워시드램스킨", "레트로봄버", "KREAM단독입찰"],
    rating: 4.9,
    sizes: ["M", "L"],
    partnerMall: "KREAM Exclusive Rare Drops",
    koPartnerMall: "크림 유니크 리미티드 옥션"
  },
  {
    id: "p12_partner",
    name: "Subtile Angora Blend Scarf Collar Heavy Overcoat",
    koName: "[ATELIER] 앙고라 블렌딩 소프트 머플러 하이엔드 코트",
    brand: "29CM_PREMIUM",
    price: 360,
    category: "Premium Knitwear",
    koCategory: "프리미엄 니트웨어 & 아우터",
    image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600&auto=format&fit=crop&q=80",
    matchPercentage: 96,
    tags: ["Angora", "Scarf Coat", "High-Fashion"],
    koTags: ["스카프일체형", "캐시미어앙고라", "29CM단독릴리즈"],
    rating: 4.8,
    sizes: ["S", "M", "L"],
    partnerMall: "29CM Luxury Exclusive",
    koPartnerMall: "29CM 프리미엄 전용쇼룸"
  },
  {
    id: "p13_partner",
    name: "Premium Ribbed Tailored Knit Cardigan",
    koName: "[SSF] 럭스 울 리브드 카라 슬릿 타이트 가디건",
    brand: "SSF_EXCLUSIVE",
    price: 185,
    category: "Premium Knitwear",
    koCategory: "프리미엄 니트웨어 & 아우터",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80",
    matchPercentage: 95,
    tags: ["Slim Fit", "Minimalist", "SSF Only"],
    koTags: ["골지슬림핏", "세련된리브드", "삼성물산단독"],
    rating: 4.7,
    sizes: ["XS", "S", "M"],
    partnerMall: "ssf_shop Atelier",
    koPartnerMall: "SSF 프리미엄 기획관"
  },
  {
    id: "p14_partner",
    name: "Raw Selvedge Rigid High-Waisted Wide Denim",
    koName: "[W컨셉] 셀비지 리지드 헤비온즈 하이웨이스트 진",
    brand: "OVAL_LABS",
    price: 140,
    category: "Japanese Denim",
    koCategory: "아카이브 셀비지 데님",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop&q=80",
    matchPercentage: 94,
    tags: ["High-Waisted", "Rigid Denim", "Indigo"],
    koTags: ["탄탄한리지드", "하이웨이스트라인", "디자이너단독선발"],
    rating: 4.8,
    sizes: ["26", "28", "30", "32"],
    partnerMall: "W Concept Exclusive Atelier",
    koPartnerMall: "W컨셉 익스클루시브 단독입점"
  },
  {
    id: "p15_partner",
    name: "Industrial Chrome Carabiner Choker Ring",
    koName: "[EMPTY] 실버 머큐리 카라비너 하이브리드 체인 쵸커",
    brand: "PRISM_HAUS",
    price: 95,
    category: "Premium Accessories",
    koCategory: "액세서리 & 주얼리 아트",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    matchPercentage: 97,
    tags: ["Silver 925", "Cyberpunk", "Carabiner"],
    koTags: ["볼드메탈925", "스트릿액센트", "성수엠프티셀렉트"],
    rating: 4.9,
    sizes: ["One Size"],
    partnerMall: "Empty Premium Select",
    koPartnerMall: "엠프티 테크니컬 셀렉트숍"
  }
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "post1",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    authorName: "jiwon_aesthetic",
    authorAvatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=jiwon",
    likes: 342,
    commentsCount: 18,
    saves: 95,
    tags: ["#minimalist", "#seoulFashion", "#blazerDrape"],
    description: "Autumn layers are locked in today. Featuring this deconstructed oversized wool blazer paired with charcoal linen trousers. Clean lines always speak loudest.",
    comments: [
      { id: "c1", author: "hayun_style", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=hayun", text: "Love the shoulder line! Which brand is that?", time: "30m ago" },
      { id: "c2", author: "tastemaker_k", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=tastemaker", text: "The tone transition is beautiful. Perfect drape.", time: "1h ago" }
    ]
  },
  {
    id: "post2",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80",
    authorName: "min_cybercore",
    authorAvatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=min",
    likes: 512,
    commentsCount: 24,
    saves: 182,
    tags: ["#gorpcore", "#streetwear", "#techWear"],
    description: "Fully rigged in active modular ripstops for the rain. Water-proofing meets custom utility buckles.",
    comments: [
      { id: "c3", author: "arc_scout", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=scout", text: "Pants are insane. Is that waterproof nylon?", time: "2h ago" }
    ]
  },
  {
    id: "post3",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
    authorName: "seo_yeon",
    authorAvatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=seoyeon",
    likes: 423,
    commentsCount: 11,
    saves: 144,
    tags: ["#avantgarde", "#parisLook", "#streetchic"],
    description: "High drama in simple structures. Added high-contrast chunky black loafers to balance the fluid beige maxi lines.",
    comments: []
  },
  {
    id: "post4",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
    authorName: "jun_aesthetic",
    authorAvatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=jun",
    likes: 289,
    commentsCount: 9,
    saves: 72,
    tags: ["#casualStyle", "#cleanFit", "#earthtones"],
    description: "Relaxed sand cardigans and structured shades. An architectural morning look that fits the creative studio easily.",
    comments: []
  },
  {
    id: "post5",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=80",
    authorName: "yuna_archive",
    authorAvatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=yuna",
    likes: 678,
    commentsCount: 42,
    saves: 304,
    tags: ["#vintagearchive", "#grunge", "#y2k"],
    description: "Dug up this vintage distressed leather aviator bomber from Seoul flea markets. Stacked with bleached wide-leg denim.",
    comments: [
      { id: "c4", author: "curator_park", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=curator", text: "Finding that fit is like winning the lottery!", time: "4h ago" }
    ]
  },
  {
    id: "post6",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
    authorName: "renegade_couture",
    authorAvatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=renegade",
    likes: 311,
    commentsCount: 14,
    saves: 88,
    tags: ["#brutalist", "#cyberpunk", "#allblack"],
    description: "Pitch black silhouettes against the raw concrete. Keeping standard shapes, but amplifying textile weights and folds.",
    comments: []
  }
];

export const MOCK_CHALLENGES: CommunityChallenge[] = [
  {
    id: "ch1",
    title: "Brutalist Monochrome Style Challenge",
    description: "Style a complete outfit using exclusively a single color gradient (e.g. all obsidian, all cream sail, all slate) utilizing architectural layers rather than graphic items.",
    participants: 1240,
    daysRemaining: 4,
    rewardPoints: 500,
    joined: false,
    submissions: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "ch2",
    title: "The Oversized Contrast Proportions",
    description: "Contrast your bagginess by styling an extra-baggy outershell or trousers paired strictly with a body-hugging minimalist anchor piece.",
    participants: 890,
    daysRemaining: 7,
    rewardPoints: 350,
    joined: true,
    submissions: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=150&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "ch3",
    title: "Urban Utility & Gorpcore Fusion",
    description: "Combine highly active technical wind-resistant shells with sophisticated office trousers or classic platform leather boots.",
    participants: 1620,
    daysRemaining: 12,
    rewardPoints: 400,
    joined: false,
    submissions: []
  }
];
