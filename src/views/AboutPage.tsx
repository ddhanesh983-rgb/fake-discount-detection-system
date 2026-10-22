import React from 'react';
import {
  ShieldAlert,
  Code2,
  FileSpreadsheet,
  Cpu,
  BookOpen,
  Scale,
  Sparkles,
} from 'lucide-react';
import { NavView } from '../components/Navbar';

interface AboutPageProps {
  onNavigate: (view: NavView) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="space-y-3 pb-6 border-b border-slate-200">
        <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Transparency & Documentation
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">
          About Fake Discount Detection System
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          An open decision-support initiative engineered to bring mathematical clarity, empirical price tracking,
          and fraud-resistant transparency to digital commerce.
        </p>
      </div>

      {/* Purpose & Core Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Project Mission
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In modern e-commerce, the presence of a discount percentage has become the single most powerful psychological lever to induce checkout urgency. Unfortunately, dynamic pricing algorithms and deceptive anchor practices frequently mean advertised discounts bear little relationship to real financial savings.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The Fake Discount Detection System bridges the information asymmetry between commercial platforms and individual consumers by turning raw historical pricing records into plain-language, explainable evaluations.
          </p>
        </div>

        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider">
            Core Project Objectives
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">&bull;</span>
              <span><strong>Help consumers recognize misleading claims:</strong> Detect deceptive badges before committing payment.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">&bull;</span>
              <span><strong>Improve market transparency:</strong> Disclose whether listed MSRPs reflect real historical transactions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">&bull;</span>
              <span><strong>Replace black-box claims with auditable math:</strong> Show exact formulas rather than arbitrary AI verdicts.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">&bull;</span>
              <span><strong>Demonstrate data-driven consumer advocacy:</strong> Illustrate how empirical time-series analysis protects buyers.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Mathematical Formulas Documentation */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Mathematical Formulas & Scoring Logic
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            All assessments are calculated deterministically using the formulas documented below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="text-xs font-bold text-slate-700">1. Mathematical Discount</div>
            <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs text-blue-800">
              discount_calc = ((P_listed - P_current) / P_listed) &times; 100
            </div>
            <p className="text-[11px] text-slate-500">
              Calculates genuine percentage drop relative to the listed reference price.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="text-xs font-bold text-slate-700">2. Discrepancy Margin</div>
            <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs text-blue-800">
              discrepancy = claimed_discount - discount_calc
            </div>
            <p className="text-[11px] text-slate-500">
              Discrepancies &gt; 5% trigger arithmetic warnings; &gt; 15% add up to 35 risk score points.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="text-xs font-bold text-slate-700">3. Strikethrough Inflation Ratio</div>
            <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs text-blue-800">
              inflation = ((P_listed - Mean_historical) / Mean_historical) &times; 100
            </div>
            <p className="text-[11px] text-slate-500">
              Measures how much the merchant's anchor price exceeds typical 60-day trading levels.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="text-xs font-bold text-slate-700">4. Pre-Promotion Spike Ratio</div>
            <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs text-blue-800">
              spike = ((P_listed - P_prepromo) / P_prepromo) &times; 100
            </div>
            <p className="text-[11px] text-slate-500">
              Detects artificial price hikes in the 14-day window preceding a sale event.
            </p>
          </div>
        </div>

        {/* Risk Score Weights Table */}
        <div className="pt-2">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Risk Score Weights Allocation (Max 100 Points)
          </div>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Indicator</th>
                  <th className="px-4 py-2.5">Maximum Points</th>
                  <th className="px-4 py-2.5">Trigger Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-2 font-medium text-slate-800">Advertised vs Calculated Discrepancy</td>
                  <td className="px-4 py-2 font-mono text-slate-700">35 pts</td>
                  <td className="px-4 py-2 text-slate-600">Discrepancy &gt; 5%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-slate-800">Strikethrough Anchor Inflation</td>
                  <td className="px-4 py-2 font-mono text-slate-700">30 pts</td>
                  <td className="px-4 py-2 text-slate-600">Listed price &gt; 15% above 60-day historical average</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-slate-800">Pre-Promotion Price Spike</td>
                  <td className="px-4 py-2 font-mono text-slate-700">25 pts</td>
                  <td className="px-4 py-2 text-slate-600">Price jumped &gt; 12% within 14 days before promo</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-slate-800">Illusory Savings (Current &ge; Typical)</td>
                  <td className="px-4 py-2 font-mono text-slate-700">15 pts</td>
                  <td className="px-4 py-2 text-slate-600">Current sale price within 2% or higher than historical mean</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Limitations, Ethics & Legal Disclaimer */}
      <div className="p-6 bg-slate-100 border border-slate-300 rounded-2xl space-y-3 text-slate-700">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <Scale className="w-4 h-4 text-slate-700" />
          <span>System Scope, Ethics & Decision-Support Notice</span>
        </div>
        <p className="text-xs leading-relaxed">
          <strong>Decision-Support Notice:</strong> The Fake Discount Detection System is strictly an informational and educational decision-support tool. An assessment of <em>Potentially Misleading</em> reflects algorithmic indicators of price variance and historical divergence; it does NOT constitute a legal finding, regulatory adjudication, or definitive accusation of statutory fraud.
        </p>
        <p className="text-xs leading-relaxed">
          Pricing dynamics in real markets can be legitimately affected by supplier wholesale fluctuations, inventory clearance imperatives, seasonal phaseouts, localized taxation, bundle inclusions, and dynamic shipping surcharges.
        </p>
      </div>

      {/* CSV & API Integration Specifications */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 font-display">
          Data Integration Specifications
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The system accepts RFC 4180 compliant CSV files for batch historical price imports and exports.
        </p>

        <div className="p-4 bg-slate-900 text-slate-300 rounded-xl font-mono text-xs space-y-2">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider">Historical Price CSV Format:</div>
          <pre className="text-emerald-400 overflow-x-auto">
date,price,source,notes
2026-08-15,32000,historical_tracker,Mid-summer baseline
2026-09-01,32500,historical_tracker,Regular retail price
2026-10-12,45000,user_observation,Pre-sale price hike
2026-10-16,33990,marketplace_feed,Advertised 40% festival discount
          </pre>
        </div>
      </div>
    </div>
  );
};
