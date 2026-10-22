export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export type AssessmentStatus = 'LIKELY_GENUINE' | 'POTENTIALLY_MISLEADING' | 'INSUFFICIENT_EVIDENCE';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface PricePoint {
  id: string;
  date: string; // YYYY-MM-DD
  price: number;
  source: 'user_observation' | 'historical_tracker' | 'invoice' | 'marketplace_feed' | 'sample_data';
  notes?: string;
}

export interface SuspiciousPattern {
  id: string;
  name: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  description: string;
  evidence: string;
  scoreContribution: number;
}

export interface HistoricalStats {
  average: number;
  min: number;
  max: number;
  prePromoPrice: number | null; // price observed before promotion window
  priceJumpBeforePromoPercent: number | null;
  currentVsAveragePercent: number;
  dataPoints: number;
  windowDays: number;
  earliestDate: string | null;
  latestDate: string | null;
}

export interface ProductAnalysisRequest {
  productName: string;
  category: string;
  platform: string;
  currency: CurrencyCode;
  originalPrice: number; // Listed / Strikethrough / Claimed MSRP
  currentPrice: number;  // Offered sale price
  claimedDiscount?: number; // e.g. 50 (%)
  referencePrice?: number; // Historical or normal reference price if user knows
  referenceSource?: string;
  productUrl?: string;
  historicalPrices?: PricePoint[];
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  productName: string;
  category: string;
  platform: string;
  currency: CurrencyCode;
  originalPrice: number;
  currentPrice: number;
  claimedDiscount: number | null;
  calculatedDiscount: number; // against original/listed price
  referenceDiscount: number | null; // against reference price if provided
  discrepancyPercentage: number; // claimedDiscount - calculatedDiscount
  priceDifference: number; // originalPrice - currentPrice
  status: AssessmentStatus;
  riskScore: number; // 0 to 100
  confidence: ConfidenceLevel;
  evidenceCount: number;
  observationDays: number;
  historicalStats?: HistoricalStats;
  suspiciousPatterns: SuspiciousPattern[];
  explanation: string;
  recommendations: string[];
  productUrl?: string;
  historicalPrices: PricePoint[];
  isSampleData?: boolean;
}

export interface DashboardStats {
  totalAnalyses: number;
  genuineCount: number;
  misleadingCount: number;
  insufficientCount: number;
  averageClaimedDiscount: number;
  averageCalculatedDiscount: number;
  averageRiskScore: number;
  categoryBreakdown: {
    category: string;
    count: number;
    avgRisk: number;
  }[];
  verdictBreakdown: {
    name: string;
    count: number;
    color: string;
  }[];
  recentAnalyses: AnalysisResult[];
}
