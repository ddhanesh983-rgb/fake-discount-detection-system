import React from 'react';
import {
  Database,
  Calculator,
  History,
  ShieldAlert,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Percent,
  CheckCircle2,
} from 'lucide-react';
import { NavView } from '../components/Navbar';

interface HowItWorksPageProps {
  onNavigate: (view: NavView) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          System Architecture & Analytical Logic
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">
          How VeriPrice Audits E-Commerce Discounts
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Behind every marketing badge is an objective price calculation. Here is how our automated pipeline
          evaluates claims, detects artificial price spikes, and computes transparent risk indicators.
        </p>
      </div>

      {/* Visual Flowchart Diagram */}
      <div className="p-8 bg-slate-900 text-white rounded-3xl shadow-xl space-y-8">
        <div className="text-center space-y-1">
          <div className="text-xs uppercase tracking-wider font-mono text-blue-400">
            Pipeline Architecture
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            The 6-Phase Discount Verification Pipeline
          </h2>
        </div>

        {/* Flowchart Node Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Phase 1 */}
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2 relative">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
              01
            </div>
            <div className="font-bold text-xs text-white">Data Ingestion</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Capture listed original price, current offer price, seller discount badge, and historical price trail.
            </p>
          </div>

          {/* Phase 2 */}
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2 relative">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
              02
            </div>
            <div className="font-bold text-xs text-white">Bounds Validation</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Verify non-negative prices, confirm current price &le; listed price, and sanitize percentage bounds.
            </p>
          </div>

          {/* Phase 3 */}
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2 relative">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
              03
            </div>
            <div className="font-bold text-xs text-white">Mathematical Audit</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Compute true mathematical discount: <span className="font-mono text-blue-300">((P_orig - P_curr)/P_orig)&times;100</span>.
            </p>
          </div>

          {/* Phase 4 */}
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2 relative">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
              04
            </div>
            <div className="font-bold text-xs text-white">Historical Profiling</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Synthesize 30/60/90-day time-series: calculate min, max, average, and pre-promo window baseline.
            </p>
          </div>

          {/* Phase 5 */}
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2 relative">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
              05
            </div>
            <div className="font-bold text-xs text-white">Pattern Recognition</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Flag pre-sale markup spikes, phantom strikethrough anchors, and arithmetic claim exaggerations.
            </p>
          </div>

          {/* Phase 6 */}
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2 relative">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
              06
            </div>
            <div className="font-bold text-xs text-white">Verdict & Guidance</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Assign 0-100 explainable risk score, categorize as Genuine/Misleading/Insufficient, and output advice.
            </p>
          </div>
        </div>
      </div>

      {/* Anatomy of 3 Major Misleading Discount Tactics */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            The Three Most Common Deceptive Tactics
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            How sellers manipulate price perceptions without technically violating basic price tags.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pattern 1 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 font-display">
              1. The Pre-Sale Price Hike
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The merchant raises the price from $100 to $150 two to ten days before a promotional event (like Prime Day, Black Friday, or Diwali). During the sale, they reduce the price back down to $105 and advertise "30% OFF!".
            </p>
            <div className="p-3 bg-rose-50/60 border border-rose-100 rounded-lg text-xs text-rose-900 font-mono">
              Detection: Identifies if price jumped &gt;12% within 14 days prior to sale date.
            </div>
          </div>

          {/* Pattern 2 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 font-display">
              2. The Phantom Anchor MSRP
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The seller invents a fictitious strikethrough price (e.g. ₹9,999) that the product has never traded at in the past 90 days. They sell it for ₹3,999 and claim "60% OFF", while the historical median price has always been ₹4,100.
            </p>
            <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-lg text-xs text-amber-900 font-mono">
              Detection: Compares listed anchor against the 60-day historical trading mean.
            </div>
          </div>

          {/* Pattern 3 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 font-display">
              3. The Arithmetic Exaggeration
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The platform highlights a bright sticker claiming "50% OFF", but when you divide the price reduction by the listed price, the actual discount is only 22%. The merchant relies on customer cognitive bias to skip doing the math.
            </p>
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-xs text-blue-900 font-mono">
              Detection: Directly compares advertised percentage with mathematical fraction.
            </div>
          </div>
        </div>
      </div>

      {/* Shopper Protection Checklist */}
      <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl space-y-6">
        <h3 className="text-lg font-bold text-slate-900 font-display">
          Consumer Defense Checklist for Online Shoppers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Always check historical price trends</strong>: A 50% discount on an item marked up 50% yields zero actual savings.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Verify seller identity on marketplace platforms</strong>: Authorized retailers are less prone to arbitrary strikethrough inflation.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Inspect return policies and restock fees</strong>: Highly inflated "sale" items often have strict non-returnable clauses.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Don't rush on countdown timers</strong>: Artificially induced urgency ("Sale ends in 12 minutes!") is a standard psychological conversion tactic.
            </span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => onNavigate('analyzer')}
            className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-xs hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Audit a Discount Now
          </button>
        </div>
      </div>
    </div>
  );
};
