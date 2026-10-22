import React, { useState, useEffect, useMemo } from 'react';
import {
  Scale,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowUpDown,
  TrendingDown,
  Info,
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { apiService } from '../services/api';
import { formatPrice } from '../services/analyzer';
import { NavView } from '../components/Navbar';

interface ComparisonPageProps {
  onNavigate: (view: NavView) => void;
  preselectedProduct?: AnalysisResult | null;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({
  onNavigate,
  preselectedProduct,
}) => {
  const [allAnalyses, setAllAnalyses] = useState<AnalysisResult[]>([]);
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    async function load() {
      const items = await apiService.getAnalyses();
      setAllAnalyses(items);

      if (preselectedProduct) {
        setComparedIds((prev) =>
          prev.includes(preselectedProduct.id) ? prev : [preselectedProduct.id, ...prev.slice(0, 3)]
        );
      } else if (items.length >= 2) {
        // default select first 3
        setComparedIds(items.slice(0, 3).map((i) => i.id));
      }
    }
    load();
  }, [preselectedProduct]);

  // Selected products to compare
  const comparedProducts = useMemo(() => {
    return comparedIds
      .map((id) => allAnalyses.find((a) => a.id === id))
      .filter((a): a is AnalysisResult => !!a);
  }, [comparedIds, allAnalyses]);

  // Find lowest price among compared products (normalized if currencies match)
  const lowestPriceItem = useMemo(() => {
    if (comparedProducts.length === 0) return null;
    return [...comparedProducts].sort((a, b) => a.currentPrice - b.currentPrice)[0];
  }, [comparedProducts]);

  const toggleProductComparison = (id: string) => {
    if (comparedIds.includes(id)) {
      setComparedIds(comparedIds.filter((item) => item !== id));
    } else {
      if (comparedIds.length >= 5) {
        alert('You can compare up to 5 products at once.');
        return;
      }
      setComparedIds([...comparedIds, id]);
    }
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    allAnalyses.forEach((a) => set.add(a.category));
    return Array.from(set);
  }, [allAnalyses]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Multi-Product Price & Discount Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Compare advertised discounts, true calculated savings, and historical lowest prices across competing products.
          </p>
        </div>

        <button
          onClick={() => onNavigate('analyzer')}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-3 text-xs text-blue-900 leading-relaxed">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block mb-0.5">Consumer Advisory:</span>
          The product highlighted with the lowest verified available price represents the minimal absolute monetary cost. However, <em>the lowest price does not necessarily mean the best product quality, superior seller reliability, or the most genuine discount.</em>
        </div>
      </div>

      {/* Product Selection Drawer / Chips */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Select Products to Compare ({comparedProducts.length}/5 Selected)
          </div>
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Available Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {allAnalyses
            .filter((item) => categoryFilter === 'ALL' || item.category === categoryFilter)
            .map((item) => {
              const isSelected = comparedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleProductComparison(item.id)}
                  className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors text-left flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate max-w-[200px]">{item.productName}</span>
                  <span className="font-mono opacity-80">
                    {formatPrice(item.currentPrice, item.currency)}
                  </span>
                  {isSelected && <span className="font-bold">&times;</span>}
                </button>
              );
            })}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      {comparedProducts.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-4 font-bold text-slate-500 uppercase tracking-wider w-48">
                    Product & Platform
                  </th>
                  {comparedProducts.map((p) => {
                    const isLowest = lowestPriceItem?.id === p.id;
                    return (
                      <th
                        key={p.id}
                        className={`px-5 py-4 min-w-[220px] max-w-[280px] align-top ${
                          isLowest ? 'bg-blue-50/50 border-l border-r border-blue-200' : ''
                        }`}
                      >
                        <div className="space-y-1">
                          {isLowest && (
                            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded mb-1">
                              Lowest Verified Price
                            </span>
                          )}
                          <div className="font-bold text-slate-900 text-sm font-display line-clamp-2">
                            {p.productName}
                          </div>
                          <div className="text-slate-500 font-mono text-[11px]">
                            {p.platform} &middot; {p.category}
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Current Selling Price Row */}
                <tr>
                  <td className="px-5 py-3 font-semibold text-slate-700 bg-slate-50/50">
                    Current Selling Price
                  </td>
                  {comparedProducts.map((p) => (
                    <td
                      key={p.id}
                      className={`px-5 py-3 font-mono font-bold text-sm text-slate-900 tabular-nums ${
                        lowestPriceItem?.id === p.id ? 'bg-blue-50/30 font-bold text-blue-700' : ''
                      }`}
                    >
                      {formatPrice(p.currentPrice, p.currency)}
                    </td>
                  ))}
                </tr>

                {/* Original Listed Price Row */}
                <tr>
                  <td className="px-5 py-3 font-semibold text-slate-700 bg-slate-50/50">
                    Original / Listed Price
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="px-5 py-3 font-mono text-slate-500 line-through tabular-nums">
                      {formatPrice(p.originalPrice, p.currency)}
                    </td>
                  ))}
                </tr>

                {/* Claimed vs Calculated Discount Row */}
                <tr>
                  <td className="px-5 py-3 font-semibold text-slate-700 bg-slate-50/50">
                    Claimed vs Calculated
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="px-5 py-3 font-mono tabular-nums">
                      <div className="space-y-0.5">
                        <div className="text-slate-500">
                          Claimed: <strong className="text-slate-800">{p.claimedDiscount !== null ? `${p.claimedDiscount}%` : 'N/A'}</strong>
                        </div>
                        <div className="text-blue-700 font-bold">
                          Calculated: {p.calculatedDiscount}%
                        </div>
                        {p.claimedDiscount !== null && p.discrepancyPercentage > 3 && (
                          <div className="text-amber-600 text-[10px]">
                            Gap: {p.discrepancyPercentage}%
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Net Dollar/Rupee Savings */}
                <tr>
                  <td className="px-5 py-3 font-semibold text-slate-700 bg-slate-50/50">
                    Absolute Savings
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="px-5 py-3 font-mono font-semibold text-emerald-700 tabular-nums">
                      {formatPrice(p.priceDifference, p.currency)}
                    </td>
                  ))}
                </tr>

                {/* Historical Low Price Row */}
                <tr>
                  <td className="px-5 py-3 font-semibold text-slate-700 bg-slate-50/50">
                    Historical Low (Observed)
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="px-5 py-3 font-mono text-slate-700 tabular-nums">
                      {p.historicalStats ? (
                        formatPrice(p.historicalStats.min, p.currency)
                      ) : (
                        <span className="text-slate-400 italic">No log</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Historical Average Price Row */}
                <tr>
                  <td className="px-5 py-3 font-semibold text-slate-700 bg-slate-50/50">
                    Historical Mean Price
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="px-5 py-3 font-mono text-slate-700 tabular-nums">
                      {p.historicalStats ? (
                        formatPrice(p.historicalStats.average, p.currency)
                      ) : (
                        <span className="text-slate-400 italic">No log</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Authenticity Assessment Row */}
                <tr>
                  <td className="px-5 py-3 font-semibold text-slate-700 bg-slate-50/50">
                    Assessment Status
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="px-5 py-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-[11px] font-semibold ${
                          p.status === 'LIKELY_GENUINE'
                            ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                            : p.status === 'POTENTIALLY_MISLEADING'
                            ? 'text-amber-800 bg-amber-50 border border-amber-200'
                            : 'text-slate-700 bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {p.status === 'LIKELY_GENUINE'
                          ? 'Likely Genuine'
                          : p.status === 'POTENTIALLY_MISLEADING'
                          ? 'Potentially Misleading'
                          : 'Insufficient Evidence'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Risk Score Row */}
                <tr>
                  <td className="px-5 py-3 font-semibold text-slate-700 bg-slate-50/50">
                    Deceptive Risk Score
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="px-5 py-3 font-mono font-bold tabular-nums">
                      <span
                        className={
                          p.riskScore >= 60
                            ? 'text-rose-600'
                            : p.riskScore >= 30
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }
                      >
                        {p.riskScore}
                      </span>
                      <span className="text-slate-400 font-normal text-[11px]">/100</span>
                    </td>
                  ))}
                </tr>

                {/* Evidence & Confidence Row */}
                <tr>
                  <td className="px-5 py-3 font-semibold text-slate-700 bg-slate-50/50">
                    Evidence Reliability
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="px-5 py-3 text-slate-600">
                      <div>Confidence: <strong>{p.confidence}</strong></div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {p.evidenceCount} observation{p.evidenceCount === 1 ? '' : 's'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Actions Row */}
                <tr>
                  <td className="px-5 py-3 font-semibold text-slate-700 bg-slate-50/50">
                    Actions
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="px-5 py-3">
                      <button
                        onClick={() => toggleProductComparison(p.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove from Compare</span>
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 p-12 text-center rounded-2xl border border-dashed border-slate-300 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 font-display">
            No Products Selected for Comparison
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click on products in the selection bar above or run an analysis to compare items side-by-side.
          </p>
        </div>
      )}
    </div>
  );
};
