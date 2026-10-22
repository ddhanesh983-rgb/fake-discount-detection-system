import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  Upload,
  Search,
  Filter,
  Trash2,
  Eye,
  RotateCcw,
  Plus,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  FileSpreadsheet,
  ArrowUpDown,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { AnalysisResult, DashboardStats, AssessmentStatus } from '../types';
import { apiService } from '../services/api';
import { formatPrice } from '../services/analyzer';
import { AnalysisResultModal } from '../components/AnalysisResultModal';
import { NavView } from '../components/Navbar';

interface DashboardPageProps {
  onNavigate: (view: NavView) => void;
  onCompareProducts?: (results: AnalysisResult[]) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onCompareProducts,
}) => {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'latest' | 'risk_desc' | 'price_asc' | 'price_desc'>('latest');

  // Selected item for detail inspection modal
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);

  // Load data
  const loadData = async () => {
    setLoading(true);
    const list = await apiService.getAnalyses();
    const dashboardStats = await apiService.getDashboardStats();
    setAnalyses(list);
    setStats(dashboardStats);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered and sorted analyses
  const filteredAnalyses = useMemo(() => {
    let result = [...analyses];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.productName.toLowerCase().includes(q) ||
          item.platform.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter((item) => item.status === statusFilter);
    }

    if (categoryFilter !== 'ALL') {
      result = result.filter((item) => item.category === categoryFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'risk_desc') {
        return b.riskScore - a.riskScore;
      } else if (sortBy === 'price_asc') {
        return a.currentPrice - b.currentPrice;
      } else if (sortBy === 'price_desc') {
        return b.currentPrice - a.currentPrice;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return result;
  }, [analyses, searchQuery, statusFilter, categoryFilter, sortBy]);

  // Handle Export CSV
  const handleExportCsv = () => {
    const csvContent = apiService.exportToCsv(filteredAnalyses);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `veri_price_analysis_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Delete Record
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this analysis record from your local history?')) {
      await apiService.deleteAnalysis(id);
      loadData();
    }
  };

  // Handle Reset to Benchmark Demo Data
  const handleResetData = async () => {
    if (confirm('Reset analysis history to initial benchmark illustrative demo dataset?')) {
      await apiService.resetToDemoData();
      loadData();
    }
  };

  // Chart data: Claimed vs Calculated discount spread
  const discountComparisonChartData = useMemo(() => {
    return analyses.slice(0, 8).map((item) => ({
      name: item.productName.length > 18 ? item.productName.substring(0, 18) + '...' : item.productName,
      claimed: item.claimedDiscount ?? item.calculatedDiscount,
      calculated: item.calculatedDiscount,
      discrepancy: item.discrepancyPercentage,
    }));
  }, [analyses]);

  // Categories list for filter dropdown
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    analyses.forEach((a) => set.add(a.category));
    return Array.from(set);
  }, [analyses]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header and Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Discount Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Historical analysis records, statistical discount discrepancies, and risk score distributions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => onNavigate('analyzer')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
            <div className="text-xs text-slate-500 font-medium">Total Products Analyzed</div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              {stats.totalAnalyses}
            </div>
            <div className="text-[11px] text-slate-400">
              Avg Risk: <strong className="text-slate-700">{stats.averageRiskScore}/100</strong>
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
            <div className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Likely Genuine</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-700">
              {stats.genuineCount}
            </div>
            <div className="text-[11px] text-slate-400">
              {stats.totalAnalyses > 0
                ? `${Math.round((stats.genuineCount / stats.totalAnalyses) * 100)}% of evaluations`
                : '0%'}
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
            <div className="text-xs text-amber-700 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Potentially Misleading</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-600">
              {stats.misleadingCount}
            </div>
            <div className="text-[11px] text-slate-400">
              {stats.totalAnalyses > 0
                ? `${Math.round((stats.misleadingCount / stats.totalAnalyses) * 100)}% caution rate`
                : '0%'}
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
            <div className="text-xs text-slate-600 font-medium flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Insufficient Evidence</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-600">
              {stats.insufficientCount}
            </div>
            <div className="text-[11px] text-slate-400">
              Needs more historical logs
            </div>
          </div>
        </div>
      )}

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Claimed vs Calculated Comparison Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-display">
                Claimed Discount vs Mathematical Discount (%)
              </h2>
              <p className="text-xs text-slate-500">
                Visualizing discrepancies across recent evaluated products
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Top 8 Evaluated Items</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={discountComparisonChartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  angle={-15}
                  textAnchor="end"
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  unit="%"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val}%`, name === 'claimed' ? 'Claimed' : 'Calculated']}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
                <Bar dataKey="claimed" name="Seller Claimed %" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="calculated" name="True Calculated %" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Verdict Status Distribution */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 font-display">
              Authenticity Verdict Split
            </h2>
            <p className="text-xs text-slate-500">
              Overall assessment distribution across all logs
            </p>
          </div>

          {stats && stats.totalAnalyses > 0 ? (
            <div className="h-64 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="75%">
                <PieChart>
                  <Pie
                    data={stats.verdictBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {stats.verdictBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any, name: any) => [`${value} items`, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 text-[11px] text-slate-600 pt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                  Genuine
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600 inline-block"></span>
                  Misleading
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block"></span>
                  Insufficient
                </span>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400">
              No analysis records available.
            </div>
          )}
        </div>
      </div>

      {/* Interactive Table with Filters & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        {/* Filter Controls Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by product name, platform, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  statusFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Statuses
              </button>
              <button
                onClick={() => setStatusFilter('LIKELY_GENUINE')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  statusFilter === 'LIKELY_GENUINE'
                    ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Genuine
              </button>
              <button
                onClick={() => setStatusFilter('POTENTIALLY_MISLEADING')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  statusFilter === 'POTENTIALLY_MISLEADING'
                    ? 'bg-white text-amber-800 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Misleading
              </button>
              <button
                onClick={() => setStatusFilter('INSUFFICIENT_EVIDENCE')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  statusFilter === 'INSUFFICIENT_EVIDENCE'
                    ? 'bg-white text-slate-800 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Insufficient
              </button>
            </div>

            {/* Category Dropdown */}
            {categoriesList.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="ALL">All Categories</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="latest">Sort: Latest Analyzed</option>
              <option value="risk_desc">Sort: Highest Risk Score</option>
              <option value="price_asc">Sort: Price Low to High</option>
              <option value="price_desc">Sort: Price High to Low</option>
            </select>
          </div>
        </div>

        {/* High-density Data Table with tabular figures */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-3 py-3">Platform</th>
                <th className="px-3 py-3 text-right">Listed Price</th>
                <th className="px-3 py-3 text-right">Selling Price</th>
                <th className="px-3 py-3 text-right">Claimed %</th>
                <th className="px-3 py-3 text-right">Calculated %</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-3 py-3 text-right">Risk Score</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAnalyses.length > 0 ? (
                filteredAnalyses.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedAnalysis(item)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate">
                      <div className="truncate font-semibold">{item.productName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{item.category}</span>
                        <span>&middot;</span>
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                        {item.isSampleData && (
                          <>
                            <span>&middot;</span>
                            <span className="text-amber-600 font-mono text-[10px]">Demo</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="px-3 py-3 text-slate-600 whitespace-nowrap">
                      {item.platform}
                    </td>

                    <td className="px-3 py-3 text-right font-mono text-slate-500 whitespace-nowrap tabular-nums">
                      {formatPrice(item.originalPrice, item.currency)}
                    </td>

                    <td className="px-3 py-3 text-right font-mono font-semibold text-slate-900 whitespace-nowrap tabular-nums">
                      {formatPrice(item.currentPrice, item.currency)}
                    </td>

                    <td className="px-3 py-3 text-right font-mono text-slate-600 whitespace-nowrap tabular-nums">
                      {item.claimedDiscount !== null ? `${item.claimedDiscount}%` : '-'}
                    </td>

                    <td className="px-3 py-3 text-right font-mono font-bold text-blue-700 whitespace-nowrap tabular-nums">
                      {item.calculatedDiscount}%
                    </td>

                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                          item.status === 'LIKELY_GENUINE'
                            ? 'text-emerald-800 bg-emerald-50'
                            : item.status === 'POTENTIALLY_MISLEADING'
                            ? 'text-amber-800 bg-amber-50'
                            : 'text-slate-700 bg-slate-100'
                        }`}
                      >
                        {item.status === 'LIKELY_GENUINE'
                          ? 'Likely Genuine'
                          : item.status === 'POTENTIALLY_MISLEADING'
                          ? 'Misleading'
                          : 'Insufficient'}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-right font-mono font-bold whitespace-nowrap tabular-nums">
                      <span
                        className={
                          item.riskScore >= 60
                            ? 'text-rose-600'
                            : item.riskScore >= 30
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }
                      >
                        {item.riskScore}
                      </span>
                      <span className="text-slate-400 font-normal text-[10px]">/100</span>
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedAnalysis(item)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                          title="View detailed assessment"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    No matching analysis records found. Try modifying your filter or search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{filteredAnalyses.length}</strong> of{' '}
            <strong className="text-slate-800">{analyses.length}</strong> records
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
              title="Reset data back to verified benchmark set"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Demo Benchmark Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Detail Inspection Modal */}
      {selectedAnalysis && (
        <AnalysisResultModal
          result={selectedAnalysis}
          onClose={() => setSelectedAnalysis(null)}
          onCompareWithOthers={() => {
            const item = selectedAnalysis;
            setSelectedAnalysis(null);
            if (onCompareProducts) {
              onCompareProducts([item]);
            }
          }}
        />
      )}
    </div>
  );
};
