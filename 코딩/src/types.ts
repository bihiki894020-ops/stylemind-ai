/**
 * StyleMind AI Types Definition
 */

export interface StyleScore {
  versatility: number;   // 0-100
  uniqueness: number;    // 0-100
  cohesiveness: number;  // 0-100
  trendFactor: number;   // 0-100
}

export interface ColorPalette {
  name: string;
  hex: string;
  percentage: number;
}

export interface StyleDNA {
  profileName: string;
  vibe: string; // e.g. "Sophisticated Minimalist with Streetwear accents"
  score: StyleScore;
  overallScore: number;
  colors: ColorPalette[];
  preferredFit: string[];
  preferredCategories: string[];
  styleCoachTip: string;
}

export interface ChoiceOption {
  id: string;
  label: string;
  image?: string;
  labelKo?: string;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  questionKo?: string;
  options: ChoiceOption[];
}

export interface OutfitRecommendation {
  id: string;
  title: string;
  description: string;
  situation: string;
  weather: string;
  matchScore: number;
  items: {
    name: string;
    category: string;
    color: string;
    brand: string;
    price: number;
    image: string;
    matchPercentage: number;
  }[];
  styleTip: string;
}

export interface Product {
  id: string;
  name: string;
  koName?: string;
  brand: string;
  price: number;
  category: string;
  koCategory?: string;
  image: string;
  matchPercentage: number;
  tags: string[];
  koTags?: string[];
  rating: number;
  sizes: string[];
  partnerMall?: string;
  koPartnerMall?: string;

  clothingPng?: string;
  clothingMask?: string;
  shoulderWidth?: number;
  chestWidth?: number;
  waistWidth?: number;
  garmentType?: string;
}

export interface CommunityPost {
  id: string;
  image: string;
  authorName: string;
  authorAvatar: string;
  likes: number;
  commentsCount: number;
  saves: number;
  tags: string[];
  description: string;
  hasLiked?: boolean;
  hasSaved?: boolean;
  comments?: {
    id: string;
    author: string;
    avatar: string;
    text: string;
    time: string;
  }[];
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  daysRemaining: number;
  rewardPoints: number;
  joined: boolean;
  submissions: string[]; // images of styles submitted
}

export interface CoachMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
