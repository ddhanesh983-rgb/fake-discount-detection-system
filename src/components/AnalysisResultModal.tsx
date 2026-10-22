import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  TrendingDown,
  TrendingUp,
  Percent,
  Calendar,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { formatPrice } from '../services/analyzer';
import { PriceChart } from './PriceChart';
import { RiskMeter } from './RiskMeter';

interface AnalysisResultModalProps {
  result: AnalysisResult;
  onClose: () => void;
  onCompareWithOthers?: (result: AnalysisResult) => void;
}

export const AnalysisResultModal: React.FC<AnalysisResultModalProps> = ({
  result,
  onClose,
  onCompareWithOthers,
}) => {
  const [copied, setCopied] = useState(false);

  const copySummaryToClipboard = () => {
    const text = `VeriPrice Analysis: ${result.productName}
Platform: ${result.platform}
Listed Price: ${formatPrice(result.originalPrice, result.currency)}
Current Price: ${formatPrice(result.currentPrice, result.currency)}
Claimed Discount: ${result.claimedDiscount !== null ? result.claimedDiscount + '%' : 'None stated'}
Calculated Discount: ${result.calculatedDiscount}%
Assessment: ${result.status.replace('_', ' ')} (Risk: ${result.riskScore}/100)
Summary: ${result.explanation}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Analysis Report</span>
              <span>&middot;</span>
              <span>{new Date(result.timestamp).toLocaleDateString()}</span>
              {result.isSampleData && (
                <>
                  <span>&middot;</span>
                  <span className="text-amber-400 font-mono text-[11px]">(Demo Benchmark)</span>
                </>
              )}
            </div>
            <h2 className="text-lg font-bold truncate text-white mt-0.5">
              {result.productName}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={copySummaryToClipboard}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Copy analysis summary"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Top metadata pill replacement - clean unboxed typography */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pb-2 border-b border-slate-100">
            <span>Category: <strong className="text-slate-700">{result.category}</strong></span>
            <span aria-hidden="true">&middot;</span>
            <span>Platform: <strong className="text-slate-700">{result.platform}</strong></span>
            {result.productUrl && (
              <>
                <span aria-hidden="true">&middot;</span>
                <a
                  href={result.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>Product Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </>
            )}
          </div>

          {/* Pricing & Discount Comparison Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Original Listed Price</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                {formatPrice(result.originalPrice, result.currency)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Strikethrough / Stated MSRP</div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="text-xs text-blue-700 font-medium">Current Selling Price</div>
              <div className="text-xl font-bold font-mono text-blue-900 mt-1">
                {formatPrice(result.currentPrice, result.currency)}
              </div>
              <div className="text-[11px] text-blue-600 mt-1">
                Net savings: {formatPrice(result.priceDifference, result.currency)}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
                <span>Claimed Discount</span>
                <Percent className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                {result.claimedDiscount !== null ? `${result.claimedDiscount}%` : 'Not Stated'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Advertised by merchant</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
                <span>Calculated Discount</span>
                <TrendingDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                {result.calculatedDiscount}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {result.discrepancyPercentage !== 0 && result.claimedDiscount !== null ? (
                  <span className={result.discrepancyPercentage > 0 ? 'text-amber-600 font-medium' : 'text-slate-500'}>
                    {result.discrepancyPercentage > 0 ? `-${result.discrepancyPercentage}% discrepancy` : 'Matches claim'}
                  </span>
                ) : (
                  'True mathematical saving'
                )}
              </div>
            </div>
          </div>

          {/* Advertised vs Calculated Callout if discrepancy exists */}
          {result.claimedDiscount !== null && result.discrepancyPercentage > 3 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed space-y-1">
                <div className="font-semibold text-amber-900">
                  Advertised discount differs from mathematical discount
                </div>
                <p>
                  The seller claims a <strong>{result.claimedDiscount}% discount</strong>, but calculating
                  against the stated listed price of {formatPrice(result.originalPrice, result.currency)} yields
                  only <strong>{result.calculatedDiscount}%</strong> (a {result.discrepancyPercentage}% gap).
                  Furthermore, a listed price alone does not prove the discount is genuine without verifying
                  historical transaction prices.
                </p>
              </div>
            </div>
          )}

          {/* Two-column layout: Risk Assessment & Historical Price Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Risk Meter */}
            <div className="lg:col-span-5">
              <RiskMeter
                score={result.riskScore}
                status={result.status}
                confidence={result.confidence}
                evidenceCount={result.evidenceCount}
                suspiciousPatterns={result.suspiciousPatterns}
              />
            </div>

            {/* Right: Historical Price Chart & Stats */}
            <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    Historical Price Baseline
                  </h3>
                  <p className="text-xs text-slate-500">
                    Observation history and pre-promotion trajectory
                  </p>
                </div>
                {result.historicalStats && (
                  <div className="text-right text-xs">
                    <span className="text-slate-500">Window: </span>
                    <strong className="text-slate-800">{result.historicalStats.windowDays} Days</strong>
                  </div>
                )}
              </div>

              {/* Price trend line chart */}
              <PriceChart
                historicalPrices={result.historicalPrices}
                currentPrice={result.currentPrice}
                originalPrice={result.originalPrice}
                currency={result.currency}
                historicalStats={result.historicalStats}
              />

              {/* Historical Quick Stats Grid */}
              {result.historicalStats && (
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="text-[10px] text-slate-400 uppercase">Historical Low</div>
                    <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                      {formatPrice(result.historicalStats.min, result.currency)}
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="text-[10px] text-slate-400 uppercase">Historical Average</div>
                    <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                      {formatPrice(result.historicalStats.average, result.currency)}
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="text-[10px] text-slate-400 uppercase">Historical High</div>
                    <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                      {formatPrice(result.historicalStats.max, result.currency)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Explanation & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs uppercase font-bold text-slate-600 tracking-wider">
                System Assessment Explanation
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {result.explanation}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs uppercase font-bold text-slate-600 tracking-wider">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Recommendations for Shoppers</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold shrink-0">&bull;</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal footer controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Analysis Reference: <span className="font-mono text-slate-700">{result.id}</span>
          </div>
          <div className="flex items-center gap-3">
            {onCompareWithOthers && (
              <button
                onClick={() => onCompareWithOthers(result)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Compare With Other Products
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Close Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
