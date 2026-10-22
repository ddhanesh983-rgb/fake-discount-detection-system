import {
  AnalysisResult,
  AssessmentStatus,
  ConfidenceLevel,
  HistoricalStats,
  PricePoint,
  ProductAnalysisRequest,
  SuspiciousPattern,
} from '../types';

/**
 * Currency symbol helper
 */
export function getCurrencySymbol(currency: string): string {
  switch (currency) {
    case 'INR':
      return '₹';
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    default:
      return '$';
  }
}

/**
 * Formats a price with its currency symbol and clean decimals
 */
export function formatPrice(amount: number, currency: string = 'USD'): string {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Core discount analysis engine implementing transparent, explainable detection logic.
 */
export function analyzeDiscount(request: ProductAnalysisRequest): AnalysisResult {
  const {
    productName,
    category,
    platform,
    currency,
    originalPrice,
    currentPrice,
    claimedDiscount: rawClaimedDiscount,
    referencePrice,
    productUrl,
  } = request;

  // 1. Sanitize and validate inputs
  const validOriginal = Math.max(0, Number(originalPrice) || 0);
  const validCurrent = Math.max(0, Number(currentPrice) || 0);
  const validReference = referencePrice ? Math.max(0, Number(referencePrice)) : undefined;

  // Calculate mathematical discount against listed original price
  const calculatedDiscount = validOriginal > 0 && validOriginal >= validCurrent
    ? Number((((validOriginal - validCurrent) / validOriginal) * 100).toFixed(1))
    : 0;

  // Calculate mathematical discount against user-supplied historical reference price (if provided)
  const referenceDiscount = validReference && validReference > 0 && validReference >= validCurrent
    ? Number((((validReference - validCurrent) / validReference) * 100).toFixed(1))
    : null;

  // Advertised/claimed discount
  const claimedDiscount = rawClaimedDiscount !== undefined && rawClaimedDiscount !== null
    ? Math.max(0, Math.min(100, Number(rawClaimedDiscount)))
    : null;

  // Discrepancy between advertised claimed discount and calculated discount
  const discrepancyPercentage = claimedDiscount !== null
    ? Number((claimedDiscount - calculatedDiscount).toFixed(1))
    : 0;

  const priceDifference = Math.max(0, validOriginal - validCurrent);

  // 2. Process historical price points
  const rawPoints = request.historicalPrices || [];
  const sortedPoints = [...rawPoints]
    .filter((p) => p.price > 0 && !isNaN(new Date(p.date).getTime()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let historicalStats: HistoricalStats | undefined = undefined;
  const suspiciousPatterns: SuspiciousPattern[] = [];
  let riskScore = 0;

  if (sortedPoints.length > 0) {
    const prices = sortedPoints.map((p) => p.price);
    const sum = prices.reduce((acc, val) => acc + val, 0);
    const average = Number((sum / prices.length).toFixed(2));
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    const earliestDate = sortedPoints[0].date;
    const latestDate = sortedPoints[sortedPoints.length - 1].date;
    const windowDays = Math.max(
      1,
      Math.round(
        (new Date(latestDate).getTime() - new Date(earliestDate).getTime()) / (1000 * 3600 * 24)
      )
    );

    // Identify pre-promotion price (observations between 7 and 21 days before latest, or the previous entry)
    let prePromoPrice: number | null = null;
    let priceJumpBeforePromoPercent: number | null = null;

    if (sortedPoints.length >= 2) {
      // Look for the price immediately preceding any recent hike or right before the promotion
      const previousPoint = sortedPoints[sortedPoints.length - 2];
      prePromoPrice = previousPoint.price;

      if (prePromoPrice > 0 && validOriginal > prePromoPrice) {
        priceJumpBeforePromoPercent = Number(
          (((validOriginal - prePromoPrice) / prePromoPrice) * 100).toFixed(1)
        );
      }
    }

    const currentVsAveragePercent = average > 0
      ? Number((((validCurrent - average) / average) * 100).toFixed(1))
      : 0;

    historicalStats = {
      average,
      min,
      max,
      prePromoPrice,
      priceJumpBeforePromoPercent,
      currentVsAveragePercent,
      dataPoints: sortedPoints.length,
      windowDays,
      earliestDate,
      latestDate,
    };
  }

  // 3. Rule Evaluation & Suspicious Pattern Detection

  // Rule A: Advertised vs Calculated Discount Discrepancy
  if (claimedDiscount !== null && discrepancyPercentage > 5) {
    const severity = discrepancyPercentage > 15 ? 'high' : 'medium';
    const scoreAdd = Math.min(35, Math.round(discrepancyPercentage * 1.5));
    riskScore += scoreAdd;

    suspiciousPatterns.push({
      id: 'DISCREPANCY_ADVERTISED_VS_ACTUAL',
      name: 'Advertised vs Calculated Discrepancy',
      severity,
      description: `The seller advertises ${claimedDiscount}% off, but the actual difference between listed (${formatPrice(validOriginal, currency)}) and selling price (${formatPrice(validCurrent, currency)}) is only ${calculatedDiscount}%.`,
      evidence: `Discrepancy of ${discrepancyPercentage}% exceeds standard margin of error (5%).`,
      scoreContribution: scoreAdd,
    });
  }

  // Rule B: Strikethrough / Original Price Inflation above Historical Baseline
  if (historicalStats && historicalStats.dataPoints >= 2) {
    const inflationRatio = ((validOriginal - historicalStats.average) / historicalStats.average) * 100;

    if (inflationRatio > 15) {
      const severity = inflationRatio > 30 ? 'high' : 'medium';
      const scoreAdd = Math.min(30, Math.round(inflationRatio * 0.7));
      riskScore += scoreAdd;

      suspiciousPatterns.push({
        id: 'INFLATED_REFERENCE_PRICE',
        name: 'Inflated Strikethrough Anchor Price',
        severity,
        description: `The claimed original price (${formatPrice(validOriginal, currency)}) is ${inflationRatio.toFixed(1)}% higher than the historical average price (${formatPrice(historicalStats.average, currency)}).`,
        evidence: `Product historical average is ${formatPrice(historicalStats.average, currency)}, but seller used ${formatPrice(validOriginal, currency)} as the discount anchor.`,
        scoreContribution: scoreAdd,
      });
    }

    // Rule C: Pre-Promotion Price Hike
    if (
      historicalStats.priceJumpBeforePromoPercent !== null &&
      historicalStats.priceJumpBeforePromoPercent > 12
    ) {
      const scoreAdd = Math.min(25, Math.round(historicalStats.priceJumpBeforePromoPercent * 0.8));
      riskScore += scoreAdd;

      suspiciousPatterns.push({
        id: 'PRE_PROMO_SPIKE',
        name: 'Pre-Promotion Price Spike Detected',
        severity: 'high',
        description: `The listed price was increased by ${historicalStats.priceJumpBeforePromoPercent}% shortly before this promotion began.`,
        evidence: `Price was ${formatPrice(historicalStats.prePromoPrice!, currency)} prior to recent markup to ${formatPrice(validOriginal, currency)}.`,
        scoreContribution: scoreAdd,
      });
    }

    // Rule D: Current "Sale" Price Not Meaningfully Lower Than Historical Typical Price
    if (historicalStats.currentVsAveragePercent >= -2) {
      const scoreAdd = 15;
      riskScore += scoreAdd;

      suspiciousPatterns.push({
        id: 'NO_ACTUAL_SAVINGS',
        name: 'Marginal or Illusory Savings',
        severity: 'medium',
        description: `The current promotional price (${formatPrice(validCurrent, currency)}) is virtually identical to or higher than the typical historical price (${formatPrice(historicalStats.average, currency)}).`,
        evidence: `Current price is ${historicalStats.currentVsAveragePercent > 0 ? '+' : ''}${historicalStats.currentVsAveragePercent}% relative to historical average.`,
        scoreContribution: scoreAdd,
      });
    }
  }

  // Determine Confidence and Evidence Coverage
  let confidence: ConfidenceLevel = 'Low';
  const observationCount = sortedPoints.length;
  const observationDays = historicalStats ? historicalStats.windowDays : 0;

  if (observationCount >= 6 && observationDays >= 30) {
    confidence = 'High';
  } else if (observationCount >= 2 || (observationCount === 0 && claimedDiscount !== null && discrepancyPercentage > 15)) {
    confidence = 'Medium';
  } else {
    confidence = 'Low';
  }

  // 4. Final Assessment Status Determination
  let status: AssessmentStatus = 'LIKELY_GENUINE';

  if (observationCount < 2 && Math.abs(discrepancyPercentage) <= 5) {
    // When there is no historical baseline and arithmetic is straightforward,
    // do not guess or declare fraud; state Insufficient Evidence.
    status = 'INSUFFICIENT_EVIDENCE';
    riskScore = Math.min(25, riskScore);
  } else if (riskScore >= 35 || discrepancyPercentage > 15 || (historicalStats?.priceJumpBeforePromoPercent || 0) > 20) {
    status = 'POTENTIALLY_MISLEADING';
  } else if (riskScore < 30) {
    status = 'LIKELY_GENUINE';
  } else {
    status = 'POTENTIALLY_MISLEADING';
  }

  // Clamp risk score to [0, 100]
  riskScore = Math.max(0, Math.min(100, riskScore));

  // 5. Generate Clear Explanation & Actionable Shopper Recommendations
  let explanation = '';
  const recommendations: string[] = [];

  if (status === 'INSUFFICIENT_EVIDENCE') {
    explanation = `The system calculated a ${calculatedDiscount}% discount based on the listed price of ${formatPrice(validOriginal, currency)} and current price of ${formatPrice(validCurrent, currency)}. However, there is insufficient recorded price history (${observationCount} observation${observationCount === 1 ? '' : 's'}) to confirm whether the listed price reflects authentic pre-sale trading or an artificially elevated anchor.`;
    recommendations.push(
      'Verify the standard retail price across independent merchants or browser price history tools before purchasing.',
      'Check if this product recently had manufacturer price drops or updated revisions.',
      'Input at least 2 prior price observations or upload historical price data to unlock confident verification.'
    );
  } else if (status === 'POTENTIALLY_MISLEADING') {
    const mainReason = suspiciousPatterns.length > 0
      ? suspiciousPatterns[0].description
      : 'Pricing history demonstrates inconsistencies with advertised promotion terms.';
    explanation = `This promotional offer raises caution flags. ${mainReason} While the seller displays a ${claimedDiscount !== null ? claimedDiscount + '%' : calculatedDiscount + '%'} discount, historical records reveal that the actual benefit is significantly lower than advertised.`;

    if (discrepancyPercentage > 5) {
      recommendations.push(
        `Do not rely on the advertised "${claimedDiscount}% OFF" badge; the true price reduction against listed MSRP is only ${calculatedDiscount}%.`
      );
    }
    if (historicalStats && historicalStats.currentVsAveragePercent >= 0) {
      recommendations.push(
        `The current price (${formatPrice(validCurrent, currency)}) is near the historical typical level (${formatPrice(historicalStats.average, currency)}). Consider delaying until a genuine markdown occurs.`
      );
    } else {
      recommendations.push('Compare pricing on other verified marketplaces before completing checkout.');
    }
    recommendations.push('Inspect seller ratings and return policy for third-party marketplace listings.');
  } else {
    // LIKELY_GENUINE
    const savingsAmount = formatPrice(priceDifference, currency);
    explanation = `The promotional pricing appears genuine. The calculated discount of ${calculatedDiscount}% (${savingsAmount} savings) aligns with historical market trends. ${historicalStats ? `The current price (${formatPrice(validCurrent, currency)}) is below the historical average (${formatPrice(historicalStats.average, currency)}).` : ''}`;
    recommendations.push(
      `This appears to be a legitimate discount. You save approximately ${savingsAmount} compared to regular retail levels.`,
      'Confirm warranty eligibility and seller authenticity on the platform prior to payment.',
      'Check if coupon codes or platform bank discounts can be stacked for additional savings.'
    );
  }

  return {
    id: `eval_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    productName: productName.trim() || 'Untitled Product',
    category: category || 'General',
    platform: platform || 'Unknown Platform',
    currency,
    originalPrice: validOriginal,
    currentPrice: validCurrent,
    claimedDiscount,
    calculatedDiscount,
    referenceDiscount,
    discrepancyPercentage,
    priceDifference,
    status,
    riskScore,
    confidence,
    evidenceCount: observationCount,
    observationDays,
    historicalStats,
    suspiciousPatterns,
    explanation,
    recommendations,
    productUrl: productUrl?.trim() || undefined,
    historicalPrices: sortedPoints,
  };
}
