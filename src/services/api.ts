import {
  AnalysisResult,
  DashboardStats,
  PricePoint,
  ProductAnalysisRequest,
} from '../types';
import { analyzeDiscount } from './analyzer';

const STORAGE_KEY = 'veri_price_discount_analyses_v1';

/**
 * Pre-seeded realistic demo products, clearly marked as benchmark illustrative data
 * Demonstrates: Pre-promotion price hike, Inflated strikethrough anchor, Genuine clearance,
 * Arithmetic discrepancy, and Insufficient historical evidence.
 */
export const INITIAL_BENCHMARK_ANALYSES: AnalysisResult[] = [
  analyzeDiscount({
    productName: 'Samsung 55" Crystal 4K UHD Smart TV (Pre-Promotion Spike Demo)',
    category: 'Electronics',
    platform: 'Amazon',
    currency: 'INR',
    originalPrice: 45000,
    currentPrice: 33990,
    claimedDiscount: 40,
    referencePrice: 32000,
    referenceSource: '30-Day Historical Tracker Log',
    productUrl: 'https://example.com/samsung-55-crystal-uhd',
    historicalPrices: [
      { id: 'p1', date: '2026-08-15', price: 32000, source: 'historical_tracker', notes: 'Typical mid-summer price' },
      { id: 'p2', date: '2026-09-01', price: 32500, source: 'historical_tracker' },
      { id: 'p3', date: '2026-09-18', price: 31999, source: 'historical_tracker' },
      { id: 'p4', date: '2026-10-02', price: 32200, source: 'historical_tracker', notes: 'Pre-sale stable price' },
      { id: 'p5', date: '2026-10-12', price: 45000, source: 'user_observation', notes: 'Sudden price hike 4 days before sale!' },
      { id: 'p6', date: '2026-10-16', price: 33990, source: 'marketplace_feed', notes: 'Advertised 40% festival discount' },
    ],
  }),
  analyzeDiscount({
    productName: 'Ergonomic High-Back Mesh Chair (Inflated Anchor Strikethrough)',
    category: 'Home & Kitchen',
    platform: 'Flipkart',
    currency: 'INR',
    originalPrice: 14999,
    currentPrice: 5999,
    claimedDiscount: 60,
    referencePrice: 6200,
    referenceSource: 'Independent Marketplace Price Log',
    historicalPrices: [
      { id: 'p11', date: '2026-07-20', price: 6499, source: 'historical_tracker' },
      { id: 'p12', date: '2026-08-10', price: 6199, source: 'historical_tracker' },
      { id: 'p13', date: '2026-09-05', price: 5999, source: 'historical_tracker' },
      { id: 'p14', date: '2026-09-25', price: 6299, source: 'historical_tracker' },
      { id: 'p15', date: '2026-10-14', price: 6199, source: 'historical_tracker', notes: 'Never sold at ₹14,999 in past 90 days' },
    ],
  }),
  analyzeDiscount({
    productName: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
    category: 'Electronics',
    platform: 'Best Buy',
    currency: 'USD',
    originalPrice: 399.99,
    currentPrice: 278.00,
    claimedDiscount: 30,
    referencePrice: 389.00,
    referenceSource: 'Official MSRP & Retail Baseline',
    productUrl: 'https://example.com/sony-wh1000xm5',
    historicalPrices: [
      { id: 'p21', date: '2026-07-15', price: 398.00, source: 'historical_tracker' },
      { id: 'p22', date: '2026-08-01', price: 389.99, source: 'historical_tracker' },
      { id: 'p23', date: '2026-08-25', price: 379.99, source: 'historical_tracker' },
      { id: 'p24', date: '2026-09-15', price: 399.99, source: 'historical_tracker' },
      { id: 'p25', date: '2026-10-01', price: 389.00, source: 'historical_tracker' },
      { id: 'p26', date: '2026-10-18', price: 389.00, source: 'historical_tracker' },
    ],
  }),
  analyzeDiscount({
    productName: 'Italian Merino Wool Tailored Overcoat (Math Discrepancy Demo)',
    category: 'Fashion & Apparel',
    platform: 'FashionOutlet UK',
    currency: 'GBP',
    originalPrice: 250.00,
    currentPrice: 190.00,
    claimedDiscount: 50,
    referencePrice: 220.00,
    historicalPrices: [
      { id: 'p31', date: '2026-08-10', price: 230.00, source: 'historical_tracker' },
      { id: 'p32', date: '2026-09-01', price: 220.00, source: 'historical_tracker' },
      { id: 'p33', date: '2026-09-20', price: 240.00, source: 'historical_tracker' },
      { id: 'p34', date: '2026-10-10', price: 250.00, source: 'user_observation' },
    ],
  }),
  analyzeDiscount({
    productName: 'AeroFold Carbon Fiber Drone - 2026 Model (New Release)',
    category: 'Computing & Tech',
    platform: 'Official Store',
    currency: 'USD',
    originalPrice: 799.00,
    currentPrice: 599.00,
    claimedDiscount: 25,
    historicalPrices: [
      { id: 'p41', date: '2026-10-19', price: 799.00, source: 'user_observation', notes: 'Launch date listing' },
    ],
  }),
  analyzeDiscount({
    productName: 'Instant Pot Duo Plus 9-in-1 Electric Pressure Cooker',
    category: 'Home & Kitchen',
    platform: 'Target',
    currency: 'USD',
    originalPrice: 129.95,
    currentPrice: 89.95,
    claimedDiscount: 30,
    historicalPrices: [
      { id: 'p51', date: '2026-08-01', price: 129.95, source: 'historical_tracker' },
      { id: 'p52', date: '2026-08-20', price: 119.95, source: 'historical_tracker' },
      { id: 'p53', date: '2026-09-10', price: 129.95, source: 'historical_tracker' },
      { id: 'p54', date: '2026-09-30', price: 124.95, source: 'historical_tracker' },
      { id: 'p55', date: '2026-10-15', price: 129.95, source: 'historical_tracker' },
    ],
  }),
];

// Mark initial items as illustrative demo data
INITIAL_BENCHMARK_ANALYSES.forEach((item) => {
  item.isSampleData = true;
});

class PriceAnalysisService {
  private cache: AnalysisResult[] | null = null;

  private loadFromStorage(): AnalysisResult[] {
    if (this.cache) return this.cache;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.cache = parsed;
          return this.cache;
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using initial sample data', e);
    }

    this.cache = [...INITIAL_BENCHMARK_ANALYSES];
    this.saveToStorage(this.cache);
    return this.cache;
  }

  private saveToStorage(items: AnalysisResult[]): void {
    this.cache = items;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not persist to localStorage', e);
    }
  }

  /**
   * Returns all analyses sorted by timestamp descending
   */
  async getAnalyses(): Promise<AnalysisResult[]> {
    const list = this.loadFromStorage();
    return [...list].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Retrieves single analysis by ID
   */
  async getAnalysisById(id: string): Promise<AnalysisResult | null> {
    const list = this.loadFromStorage();
    return list.find((item) => item.id === id) || null;
  }

  /**
   * Analyzes a product submission and saves to persistence
   */
  async analyzeAndSave(request: ProductAnalysisRequest): Promise<AnalysisResult> {
    const result = analyzeDiscount(request);
    result.isSampleData = false;
    const list = this.loadFromStorage();
    const updated = [result, ...list];
    this.saveToStorage(updated);
    return result;
  }

  /**
   * Deletes an analysis record
   */
  async deleteAnalysis(id: string): Promise<boolean> {
    const list = this.loadFromStorage();
    const filtered = list.filter((item) => item.id !== id);
    this.saveToStorage(filtered);
    return true;
  }

  /**
   * Resets data back to the clean benchmark dataset
   */
  async resetToDemoData(): Promise<AnalysisResult[]> {
    this.cache = [...INITIAL_BENCHMARK_ANALYSES];
    this.saveToStorage(this.cache);
    return this.cache;
  }

  /**
   * Computes aggregated dashboard metrics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const analyses = await this.getAnalyses();

    const totalAnalyses = analyses.length;
    let genuineCount = 0;
    let misleadingCount = 0;
    let insufficientCount = 0;
    let totalClaimed = 0;
    let totalCalculated = 0;
    let totalRisk = 0;

    const categoryMap = new Map<string, { count: number; totalRisk: number }>();

    for (const item of analyses) {
      if (item.status === 'LIKELY_GENUINE') genuineCount++;
      else if (item.status === 'POTENTIALLY_MISLEADING') misleadingCount++;
      else insufficientCount++;

      totalClaimed += item.claimedDiscount ?? item.calculatedDiscount;
      totalCalculated += item.calculatedDiscount;
      totalRisk += item.riskScore;

      const cat = item.category || 'General';
      const existing = categoryMap.get(cat) || { count: 0, totalRisk: 0 };
      categoryMap.set(cat, {
        count: existing.count + 1,
        totalRisk: existing.totalRisk + item.riskScore,
      });
    }

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, val]) => ({
      category,
      count: val.count,
      avgRisk: Math.round(val.totalRisk / val.count),
    }));

    const verdictBreakdown = [
      { name: 'Likely Genuine', count: genuineCount, color: '#16a34a' },
      { name: 'Potentially Misleading', count: misleadingCount, color: '#ea580c' },
      { name: 'Insufficient Evidence', count: insufficientCount, color: '#64748b' },
    ];

    return {
      totalAnalyses,
      genuineCount,
      misleadingCount,
      insufficientCount,
      averageClaimedDiscount: totalAnalyses > 0 ? Number((totalClaimed / totalAnalyses).toFixed(1)) : 0,
      averageCalculatedDiscount: totalAnalyses > 0 ? Number((totalCalculated / totalAnalyses).toFixed(1)) : 0,
      averageRiskScore: totalAnalyses > 0 ? Math.round(totalRisk / totalAnalyses) : 0,
      categoryBreakdown,
      verdictBreakdown,
      recentAnalyses: analyses.slice(0, 10),
    };
  }

  /**
   * Exports analysis history to RFC-compliant CSV string
   */
  exportToCsv(items: AnalysisResult[]): string {
    const headers = [
      'ID',
      'Date',
      'Product Name',
      'Category',
      'Platform',
      'Currency',
      'Original Price',
      'Current Price',
      'Claimed Discount %',
      'Calculated Discount %',
      'Discrepancy %',
      'Assessment Status',
      'Risk Score (0-100)',
      'Confidence',
      'Historical Observations',
      'Is Demo Data',
    ];

    const rows = items.map((i) => [
      `"${i.id}"`,
      `"${new Date(i.timestamp).toLocaleDateString()}"`,
      `"${i.productName.replace(/"/g, '""')}"`,
      `"${i.category}"`,
      `"${i.platform}"`,
      `"${i.currency}"`,
      i.originalPrice,
      i.currentPrice,
      i.claimedDiscount ?? 'N/A',
      i.calculatedDiscount,
      i.discrepancyPercentage,
      `"${i.status}"`,
      i.riskScore,
      `"${i.confidence}"`,
      i.evidenceCount,
      i.isSampleData ? 'Yes (Demo)' : 'No (Live)',
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Parses CSV string into structured price history observations
   */
  parsePriceHistoryCsv(csvText: string): PricePoint[] {
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];

    const result: PricePoint[] = [];

    // Header inspection (allow date,price,source,notes)
    const startIndex = lines[0].toLowerCase().includes('date') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 2) {
        const dateStr = parts[0];
        const priceNum = parseFloat(parts[1]);

        if (!isNaN(priceNum) && priceNum > 0 && !isNaN(new Date(dateStr).getTime())) {
          result.push({
            id: `pt_${Date.now()}_${i}`,
            date: dateStr,
            price: priceNum,
            source: 'historical_tracker',
            notes: parts[3] || parts[2] || undefined,
          });
        }
      }
    }

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}

export const apiService = new PriceAnalysisService();
