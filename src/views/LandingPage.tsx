import React, { useState } from 'react';
import {
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  History,
  FileSpreadsheet,
  CheckCircle2,
  ChevronDown,
  Percent,
  Search,
  Scale,
} from 'lucide-react';
import { NavView } from '../components/Navbar';
import { formatPrice } from '../services/analyzer';

interface LandingPageProps {
  onNavigate: (view: NavView) => void;
  onAnalyzeSample: (presetId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onAnalyzeSample }) => {
  // Interactive preview state
  const [activePreviewTab, setActivePreviewTab] = useState<'hike' | 'anchor' | 'genuine'>('hike');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Preview data scenarios
  const previewScenarios = {
    hike: {
      title: 'Smart TV Pre-Sale Hike',
      platform: 'Amazon',
      claimedDiscount: 40,
      listedPrice: 45000,
      sellingPrice: 33990,
      calculatedDiscount: 24.5,
      actual30DayPrice: 32000,
      currency: 'INR',
      status: 'Potentially Misleading',
      statusColor: 'text-rose-700 bg-rose-50 border-rose-200',
      reason: 'Listed price was hiked by 40% only 4 days before the festive sale, erasing the supposed saving.',
      presetKey: 'preset_spike',
    },
    anchor: {
      title: 'Ergonomic Office Chair',
      platform: 'Flipkart',
      claimedDiscount: 60,
      listedPrice: 14999,
      sellingPrice: 5999,
      calculatedDiscount: 60.0,
      actual30DayPrice: 6200,
      currency: 'INR',
      status: 'Potentially Misleading',
      statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
      reason: 'The math matches (60%), but historical records show the chair never actually traded at ₹14,999.',
      presetKey: 'preset_anchor',
    },
    genuine: {
      title: 'Wireless ANC Headphones',
      platform: 'Best Buy',
      claimedDiscount: 30,
      listedPrice: 399.99,
      sellingPrice: 278.0,
      calculatedDiscount: 30.5,
      actual30DayPrice: 389.0,
      currency: 'USD',
      status: 'Likely Genuine',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      reason: 'Current price is a verified 90-day all-time low. Strikethrough price matches standard MSRP.',
      presetKey: 'preset_genuine',
    },
  };

  const currentPreview = previewScenarios[activePreviewTab];

  const faqs = [
    {
      q: 'How do sellers create fake or misleading discounts?',
      a: 'The two most common methods are "Pre-Sale Price Spiking" (raising the price a few days before a major sale event to advertise an exaggerated markdown) and "Phantom MSRP Anchoring" (inventing an inflated strikethrough price that no customer ever actually paid). Some sellers also advertise simple arithmetic errors, claiming 50% off when the price cut is only 25%.',
    },
    {
      q: 'Why does a 50% claimed discount sometimes calculate to 30%?',
      a: 'Mathematical discount is strictly ((Original Price - Current Price) / Original Price) * 100. Sellers frequently market discounts relative to older base configurations, bundle totals, or arbitrary anchor figures rather than the actual listed strikethrough price on that specific item.',
    },
    {
      q: 'Does a missing historical price mean the discount is fake?',
      a: 'No. When historical prices are unavailable, VeriPrice categorizes the result as "Insufficient Evidence" rather than falsely accusing a merchant. We clearly disclose confidence levels and data coverage so shoppers understand what is verified versus what cannot be confirmed.',
    },
    {
      q: 'Where do historical prices come from in VeriPrice?',
      a: 'Users can manually enter observed price points, import standardized price history CSV files, or evaluate against curated community benchmark logs. The system tracks the origin, timestamp, and observation count for every data point.',
    },
    {
      q: 'Is VeriPrice a legal determination of fraud?',
      a: 'No. VeriPrice is an independent, open decision-support and educational tool designed to assist consumer awareness. Pricing variations can result from regional taxes, shipping configurations, bundle tiers, and algorithmic marketplace dynamics.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
              <span>E-Commerce Price Intelligence</span>
              <span aria-hidden="true">&middot;</span>
              <span>Consumer Decision Support</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 font-display leading-[1.1] text-balance">
              Is That Discount Real or Just a Marketing Trick?
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl text-balance">
              Online merchants routinely inflate original prices right before promotional sales or display
              discounts that contradict mathematical reality. VeriPrice transparently cross-references current
              prices against historical baselines to expose phantom markups before you complete checkout.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('analyzer')}
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <span>Analyze a Product</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('how-it-works')}
                className="px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Explore How It Works
              </button>
            </div>

            {/* Quick Proof Points */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Black-Box Guesswork</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Explainable 0–100 Risk Index</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>RFC 4180 CSV Import/Export</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Product-Price Analysis Preview */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="text-xs uppercase tracking-wider font-bold text-slate-500">
                  Live Analysis Preview
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Interactive Demo</span>
              </div>

              {/* Scenario Switcher Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setActivePreviewTab('hike')}
                  className={`flex-1 py-1.5 rounded-md transition-colors ${
                    activePreviewTab === 'hike'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pre-Sale Spike
                </button>
                <button
                  onClick={() => setActivePreviewTab('anchor')}
                  className={`flex-1 py-1.5 rounded-md transition-colors ${
                    activePreviewTab === 'anchor'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Fake Anchor
                </button>
                <button
                  onClick={() => setActivePreviewTab('genuine')}
                  className={`flex-1 py-1.5 rounded-md transition-colors ${
                    activePreviewTab === 'genuine'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Genuine Deal
                </button>
              </div>

              {/* Preview Card Body */}
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-slate-500 font-mono">
                    {currentPreview.platform} &middot; Retail Product
                  </div>
                  <div className="text-base font-bold text-slate-900 font-display mt-0.5">
                    {currentPreview.title}
                  </div>
                </div>

                {/* Price Matrix */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Claimed Original</span>
                    <span className="text-base font-bold font-mono text-slate-700 line-through">
                      {formatPrice(currentPreview.listedPrice, currentPreview.currency)}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Seller claimed: <strong className="text-slate-700">{currentPreview.claimedDiscount}% OFF</strong>
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block">Offered Selling Price</span>
                    <span className="text-base font-bold font-mono text-blue-700">
                      {formatPrice(currentPreview.sellingPrice, currentPreview.currency)}
                    </span>
                    <span className="text-[10px] text-blue-600 block mt-0.5">
                      Actual discount: <strong>{currentPreview.calculatedDiscount}%</strong>
                    </span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className={`p-3 rounded-xl border text-xs leading-relaxed ${currentPreview.statusColor}`}>
                  <div className="font-bold flex items-center justify-between mb-1">
                    <span>{currentPreview.status}</span>
                    <span className="font-mono text-[10px] opacity-80 uppercase tracking-wider">Evaluation</span>
                  </div>
                  <p>{currentPreview.reason}</p>
                </div>

                {/* CTA to test this sample */}
                <button
                  onClick={() => onAnalyzeSample(currentPreview.presetKey)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Load Full Analysis in Analyzer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified System Statistics Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Benchmark Evaluation Metrics
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Aggregate test data across simulated e-commerce records and community pricing logs.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md self-start sm:self-auto">
              Sample Benchmark Dataset
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
                1,420+
              </div>
              <div className="text-xs font-medium text-slate-600 mt-1">Products Analyzed</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Across major online storefronts</div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-600">
                38.4%
              </div>
              <div className="text-xs font-medium text-slate-600 mt-1">Suspicious Patterns Detected</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Pre-sale hikes & phantom anchors</div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-blue-600">
                14.2%
              </div>
              <div className="text-xs font-medium text-slate-600 mt-1">Average Discount Discrepancy</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Claimed discount vs true saving</div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
                18,900+
              </div>
              <div className="text-xs font-medium text-slate-600 mt-1">Price Points Compared</div>
              <div className="text-[11px] text-slate-400 mt-0.5">30 to 90-day historical trails</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step "How It Works" Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Clear 3-Step Verification
          </div>
          <h2 className="text-3xl font-bold text-slate-900 font-display">
            How The Detection System Works
          </h2>
          <p className="text-sm text-slate-600">
            A transparent evaluation pipeline that replaces promotional hype with mathematical certainty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-mono font-bold flex items-center justify-center text-base">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Enter Product Details
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Submit the advertised original price, the current promotional price, and any discount
              percentage highlighted by the seller. Optionally paste a URL or upload a historical price CSV.
            </p>
            <div className="text-xs text-blue-600 font-medium">Input & bounds validation</div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-mono font-bold flex items-center justify-center text-base">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Analyze Prices & Claims
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our algorithm computes the actual mathematical discount, examines historical price averages
              over 30/60/90 days, and flags suspicious pre-sale price hikes and inflated MSRP anchors.
            </p>
            <div className="text-xs text-blue-600 font-medium">Explainable pattern scoring</div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-mono font-bold flex items-center justify-center text-base">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Make an Informed Decision
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive a definitive status verdict: <em>Likely Genuine</em>, <em>Potentially Misleading</em>, or{' '}
              <em>Insufficient Evidence</em>, backed by risk factors and actionable shopper guidance.
            </p>
            <div className="text-xs text-blue-600 font-medium">Actionable buying advice</div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Analytical Capabilities
          </div>
          <h2 className="text-3xl font-bold text-slate-900 font-display">
            Built for Transparent Shopping
          </h2>
          <p className="text-sm text-slate-600">
            Everything you need to audit discounts across consumer electronics, fashion, home goods, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm font-display">Mathematical Verification</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Exposes sellers claiming 50% or 70% off when the mathematical price cut against listed MSRP is drastically lower.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm font-display">Pre-Sale Hike Detection</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Flags products whose prices were artificially spiked days before a promotion to manufacture an illusion of deep savings.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm font-display">Historical Tracking</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculates 30, 60, and 90-day averages, minimums, and median trading prices to establish genuine reference baselines.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm font-display">Side-by-Side Comparison</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compare multiple sellers or competing models side-by-side to identify the lowest verified available price without deceptive noise.
            </p>
          </div>
        </div>
      </section>

      {/* Claimed vs Calculated Comparison Examples */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-slate-900 rounded-2xl text-white space-y-8">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-wider font-bold text-blue-400">
              Real-World Examples
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display mt-1">
              Claimed Discounts vs Calculated Reality
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              See how advertised promotional badges frequently distort what the consumer actually saves.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Example 1 */}
            <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Consumer Electronics</span>
                <span className="font-mono text-rose-400 font-semibold">20% Arithmetic Gap</span>
              </div>
              <h4 className="font-bold text-base text-white">
                Designer 65W GaN Travel Charger
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-lg font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Seller Claim</span>
                  <span className="text-amber-400 font-bold text-base">50% OFF</span>
                  <span className="text-slate-500 block text-[10px] mt-0.5">Listed: $60 &rarr; $42</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Actual Math</span>
                  <span className="text-white font-bold text-base">30.0% OFF</span>
                  <span className="text-slate-500 block text-[10px] mt-0.5">Saving: $18 (Not $30)</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The merchant placed a prominent "50% OFF" badge on the thumbnail, but the listed price was $60 and checkout price was $42. The true discount against listed MSRP was exactly 30%.
              </p>
            </div>

            {/* Example 2 */}
            <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Apparel & Footwear</span>
                <span className="font-mono text-rose-400 font-semibold">Pre-Sale Inflation</span>
              </div>
              <h4 className="font-bold text-base text-white">
                Waterproof Trail Running Shoes
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-lg font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Advertised Deal</span>
                  <span className="text-amber-400 font-bold text-base">35% OFF</span>
                  <span className="text-slate-500 block text-[10px] mt-0.5">From $160 &rarr; $104</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Historical Reality</span>
                  <span className="text-white font-bold text-base">Regular Price: $109</span>
                  <span className="text-slate-500 block text-[10px] mt-0.5">Real Saving: $5 (4.5%)</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The product had steadily sold at $109 for four months. One week before the Black Friday promotion, the seller jacked the listed price to $160 to advertise a 35% markdown down to $104.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Clear answers on pricing rules, data sources, and assessment methodologies.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-blue-600 transition-colors text-sm cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 bg-blue-600 rounded-2xl text-white text-center space-y-5 shadow-lg">
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Ready to Verify Your Next Purchase?
          </h3>
          <p className="text-blue-100 text-sm max-w-xl mx-auto leading-relaxed">
            Stop guessing whether promotional badges represent authentic savings. Enter prices or upload a
            history log to evaluate any deal in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('analyzer')}
              className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl text-sm hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
            >
              Start Free Analysis
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-xl text-sm hover:bg-blue-800 transition-colors cursor-pointer"
            >
              View Analytics Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
