import React, { useState, useEffect } from 'react';
import {
  Search,
  Upload,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ExternalLink,
  RotateCcw,
  BarChart3,
  Scale,
} from 'lucide-react';
import {
  CurrencyCode,
  PricePoint,
  ProductAnalysisRequest,
  AnalysisResult,
} from '../types';
import { apiService, INITIAL_BENCHMARK_ANALYSES } from '../services/api';
import { formatPrice } from '../services/analyzer';
import { PriceChart } from '../components/PriceChart';
import { RiskMeter } from '../components/RiskMeter';

interface AnalyzerPageProps {
  initialPreset?: string;
  onNavigateToCompare?: (result: AnalysisResult) => void;
  onNavigateToDashboard?: () => void;
}

export const AnalyzerPage: React.FC<AnalyzerPageProps> = ({
  initialPreset,
  onNavigateToCompare,
  onNavigateToDashboard,
}) => {
  // Form fields
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [platform, setPlatform] = useState('Amazon');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [claimedDiscount, setClaimedDiscount] = useState<string>('');
  const [referencePrice, setReferencePrice] = useState<string>('');
  const [referenceSource, setReferenceSource] = useState('User Observation');
  const [productUrl, setProductUrl] = useState('');

  // Historical price observations
  const [historicalPoints, setHistoricalPoints] = useState<PricePoint[]>([]);

  // CSV Import state
  const [showCsvHelp, setShowCsvHelp] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Analysis execution state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Available Presets
  const applyPreset = (key: string) => {
    switch (key) {
      case 'preset_spike':
      case 'spike':
        setProductName('Samsung 55" Crystal 4K UHD Smart TV');
        setCategory('Electronics');
        setPlatform('Amazon');
        setCurrency('INR');
        setOriginalPrice('45000');
        setCurrentPrice('33990');
        setClaimedDiscount('40');
        setReferencePrice('32000');
        setReferenceSource('30-Day Tracker Baseline');
        setProductUrl('https://example.com/samsung-55-crystal-uhd');
        setHistoricalPoints([
          { id: '1', date: '2026-08-15', price: 32000, source: 'historical_tracker', notes: 'Stable summer price' },
          { id: '2', date: '2026-09-01', price: 32500, source: 'historical_tracker' },
          { id: '3', date: '2026-09-18', price: 31999, source: 'historical_tracker' },
          { id: '4', date: '2026-10-02', price: 32200, source: 'historical_tracker' },
          { id: '5', date: '2026-10-12', price: 45000, source: 'user_observation', notes: 'Pre-sale hike 4 days prior' },
        ]);
        break;

      case 'preset_anchor':
      case 'anchor':
        setProductName('Ergonomic High-Back Mesh Chair');
        setCategory('Home & Kitchen');
        setPlatform('Flipkart');
        setCurrency('INR');
        setOriginalPrice('14999');
        setCurrentPrice('5999');
        setClaimedDiscount('60');
        setReferencePrice('6200');
        setReferenceSource('Marketplace Baseline Log');
        setProductUrl('');
        setHistoricalPoints([
          { id: '11', date: '2026-07-20', price: 6499, source: 'historical_tracker' },
          { id: '12', date: '2026-08-10', price: 6199, source: 'historical_tracker' },
          { id: '13', date: '2026-09-05', price: 5999, source: 'historical_tracker' },
          { id: '14', date: '2026-09-25', price: 6299, source: 'historical_tracker' },
          { id: '15', date: '2026-10-14', price: 6199, source: 'historical_tracker', notes: 'Never sold at ₹14,999' },
        ]);
        break;

      case 'preset_genuine':
      case 'genuine':
        setProductName('Sony WH-1000XM5 Wireless Headphones');
        setCategory('Electronics');
        setPlatform('Best Buy');
        setCurrency('USD');
        setOriginalPrice('399.99');
        setCurrentPrice('278.00');
        setClaimedDiscount('30');
        setReferencePrice('389.00');
        setReferenceSource('Manufacturer Strikethrough');
        setProductUrl('https://example.com/sony-wh1000xm5');
        setHistoricalPoints([
          { id: '21', date: '2026-07-15', price: 398.00, source: 'historical_tracker' },
          { id: '22', date: '2026-08-01', price: 389.99, source: 'historical_tracker' },
          { id: '23', date: '2026-08-25', price: 379.99, source: 'historical_tracker' },
          { id: '24', date: '2026-09-15', price: 399.99, source: 'historical_tracker' },
          { id: '25', date: '2026-10-01', price: 389.00, source: 'historical_tracker' },
        ]);
        break;

      case 'preset_insufficient':
      case 'insufficient':
        setProductName('AeroFold Carbon Fiber Drone - 2026 Model');
        setCategory('Computing & Tech');
        setPlatform('Brand Webstore');
        setCurrency('USD');
        setOriginalPrice('799.00');
        setCurrentPrice('599.00');
        setClaimedDiscount('25');
        setReferencePrice('');
        setReferenceSource('');
        setProductUrl('');
        setHistoricalPoints([
          { id: '31', date: '2026-10-20', price: 799.0, source: 'user_observation', notes: 'Launch observation' },
        ]);
        break;

      default:
        break;
    }
    setResult(null);
    setErrors({});
  };

  useEffect(() => {
    if (initialPreset) {
      applyPreset(initialPreset);
    }
  }, [initialPreset]);

  // Handle adding manual historical observation
  const addHistoricalRow = () => {
    const today = new Date().toISOString().split('T')[0];
    const newPoint: PricePoint = {
      id: `pt_${Date.now()}`,
      date: today,
      price: currentPrice ? parseFloat(currentPrice) : 0,
      source: 'user_observation',
      notes: '',
    };
    setHistoricalPoints([...historicalPoints, newPoint]);
  };

  const removeHistoricalRow = (id: string) => {
    setHistoricalPoints(historicalPoints.filter((p) => p.id !== id));
  };

  const updateHistoricalRow = (id: string, field: keyof PricePoint, value: any) => {
    setHistoricalPoints(
      historicalPoints.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // CSV Import Handler
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = apiService.parsePriceHistoryCsv(text);
        if (parsed.length > 0) {
          setHistoricalPoints(parsed);
          setErrors((prev) => ({ ...prev, csv: '' }));
        } else {
          setErrors((prev) => ({
            ...prev,
            csv: 'Invalid CSV format. Please ensure columns include date and price (e.g. 2026-09-01,299.99)',
          }));
        }
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  // Validate form inputs
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!productName.trim()) {
      newErrors.productName = 'Product name is required';
    }

    const origNum = parseFloat(originalPrice);
    if (isNaN(origNum) || origNum <= 0) {
      newErrors.originalPrice = 'Please enter a valid listed price greater than 0';
    }

    const currNum = parseFloat(currentPrice);
    if (isNaN(currNum) || currNum <= 0) {
      newErrors.currentPrice = 'Please enter a valid selling price greater than 0';
    }

    if (!isNaN(origNum) && !isNaN(currNum) && currNum > origNum) {
      newErrors.currentPrice = 'Current selling price cannot exceed the original listed price';
    }

    if (claimedDiscount) {
      const claimedNum = parseFloat(claimedDiscount);
      if (isNaN(claimedNum) || claimedNum < 0 || claimedNum > 100) {
        newErrors.claimedDiscount = 'Claimed discount must be a valid percentage between 0 and 100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission with Step-by-Step Simulated Loading
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsAnalyzing(true);
    setAnalysisStep(1);

    const req: ProductAnalysisRequest = {
      productName,
      category,
      platform,
      currency,
      originalPrice: parseFloat(originalPrice),
      currentPrice: parseFloat(currentPrice),
      claimedDiscount: claimedDiscount ? parseFloat(claimedDiscount) : undefined,
      referencePrice: referencePrice ? parseFloat(referencePrice) : undefined,
      referenceSource: referenceSource || undefined,
      productUrl: productUrl.trim() || undefined,
      historicalPrices: historicalPoints.filter((p) => p.price > 0),
    };

    // Step 2: Historical window check
    setTimeout(() => {
      setAnalysisStep(2);
    }, 300);

    // Step 3: Pattern & scoring computation
    setTimeout(() => {
      setAnalysisStep(3);
    }, 600);

    // Step 4: Finalize
    setTimeout(async () => {
      const analyzed = await apiService.analyzeAndSave(req);
      setResult(analyzed);
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }, 900);
  };

  const handleReset = () => {
    setProductName('');
    setOriginalPrice('');
    setCurrentPrice('');
    setClaimedDiscount('');
    setReferencePrice('');
    setProductUrl('');
    setHistoricalPoints([]);
    setResult(null);
    setErrors({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Title & Preset Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Discount Authenticity Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Validate seller discount badges against true mathematical savings and historical price baselines.
          </p>
        </div>

        {/* Quick Test Presets */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <span className="text-[11px] text-slate-500 px-2 font-mono">Load Sample:</span>
          <button
            type="button"
            onClick={() => applyPreset('spike')}
            className="px-2.5 py-1.5 bg-white text-slate-800 rounded-md shadow-xs hover:text-blue-600 transition-colors"
          >
            Pre-Sale Spike
          </button>
          <button
            type="button"
            onClick={() => applyPreset('anchor')}
            className="px-2.5 py-1.5 bg-white text-slate-800 rounded-md shadow-xs hover:text-blue-600 transition-colors"
          >
            Fake Anchor
          </button>
          <button
            type="button"
            onClick={() => applyPreset('genuine')}
            className="px-2.5 py-1.5 bg-white text-slate-800 rounded-md shadow-xs hover:text-blue-600 transition-colors"
          >
            Genuine 30%
          </button>
          <button
            type="button"
            onClick={() => applyPreset('insufficient')}
            className="px-2.5 py-1.5 bg-white text-slate-800 rounded-md shadow-xs hover:text-blue-600 transition-colors"
          >
            No History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleAnalyze} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 font-display">
                Product & Pricing Details
              </h2>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Form</span>
              </button>
            </div>

            {/* Row 1: Product Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                  className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    errors.productName ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                  }`}
                />
                {errors.productName && (
                  <p className="text-xs text-rose-600">{errors.productName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Fashion & Apparel">Fashion & Apparel</option>
                  <option value="Computing & Tech">Computing & Tech</option>
                  <option value="Health & Personal Care">Health & Care</option>
                  <option value="Books & Media">Books & Media</option>
                  <option value="General">Other / General</option>
                </select>
              </div>
            </div>

            {/* Row 2: Platform & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Platform or Seller Name
                </label>
                <input
                  type="text"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="e.g. Amazon, Flipkart, Best Buy"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Currency
                </label>
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium text-center">
                  {(['USD', 'INR', 'EUR', 'GBP'] as CurrencyCode[]).map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`py-1.5 rounded-md transition-colors ${
                        currency === c
                          ? 'bg-white text-slate-900 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Listed Price, Current Price & Claimed Discount */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Original / Listed Price <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">
                    {currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'}
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="e.g. 399.99"
                    className={`w-full pl-7 pr-3 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono ${
                      errors.originalPrice ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.originalPrice && (
                  <p className="text-[11px] text-rose-600">{errors.originalPrice}</p>
                )}
                <span className="text-[10px] text-slate-400 block">Strikethrough / MSRP</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Current Selling Price <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">
                    {currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'}
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    placeholder="e.g. 278.00"
                    className={`w-full pl-7 pr-3 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono ${
                      errors.currentPrice ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.currentPrice && (
                  <p className="text-[11px] text-rose-600">{errors.currentPrice}</p>
                )}
                <span className="text-[10px] text-slate-400 block">Offered checkout price</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Claimed Discount %
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={claimedDiscount}
                    onChange={(e) => setClaimedDiscount(e.target.value)}
                    placeholder="e.g. 40"
                    className="w-full pr-7 pl-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">%</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Seller advertised badge</span>
              </div>
            </div>

            {/* Optional Reference Price & Product URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Historical Reference Price (Optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">
                    {currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'}
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={referencePrice}
                    onChange={(e) => setReferencePrice(e.target.value)}
                    placeholder="Prior normal trading price"
                    className="w-full pl-7 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Known normal non-sale price
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Product URL (Optional)
                </label>
                <input
                  type="url"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <span className="text-[10px] text-slate-400 block">Link for record tracking</span>
              </div>
            </div>

            {/* Historical Price Observations Section */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    Historical Price Records ({historicalPoints.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add prior prices to unlock pre-sale inflation tracing and baseline averages.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Import CSV</span>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleCsvFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={addHistoricalRow}
                    className="px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Date</span>
                  </button>
                </div>
              </div>

              {errors.csv && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                  {errors.csv}
                </p>
              )}

              {/* Historical records table */}
              {historicalPoints.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="px-3 py-2">Date (YYYY-MM-DD)</th>
                        <th className="px-3 py-2">Observed Price</th>
                        <th className="px-3 py-2">Notes / Context</th>
                        <th className="px-2 py-2 text-right">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {historicalPoints.map((point) => (
                        <tr key={point.id} className="hover:bg-slate-50/50">
                          <td className="px-3 py-1.5">
                            <input
                              type="date"
                              value={point.date}
                              onChange={(e) => updateHistoricalRow(point.id, 'date', e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-mono text-[11px]"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="number"
                              step="any"
                              value={point.price}
                              onChange={(e) =>
                                updateHistoricalRow(point.id, 'price', parseFloat(e.target.value) || 0)
                              }
                              className="w-24 px-2 py-1 bg-white border border-slate-200 rounded font-mono text-[11px]"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={point.notes || ''}
                              placeholder="e.g. 2 weeks before sale"
                              onChange={(e) => updateHistoricalRow(point.id, 'notes', e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-[11px]"
                            />
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => removeHistoricalRow(point.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center space-y-1">
                  <p className="text-xs text-slate-600">
                    No historical price observations added yet.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    The system will compute arithmetic discounts, but will report "Insufficient Evidence"
                    regarding pre-sale price hikes unless prior price points are supplied.
                  </p>
                </div>
              )}
            </div>

            {/* Submission CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>
                      {analysisStep === 1
                        ? 'Validating price math...'
                        : analysisStep === 2
                        ? 'Comparing historical baselines...'
                        : 'Synthesizing evidence score...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Discount Authenticity</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Analysis Result Card */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6">
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
                <div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Evaluation Result &middot; {result.platform}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-display mt-0.5">
                    {result.productName}
                  </h3>
                </div>
                {result.productUrl && (
                  <a
                    href={result.productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Discount Comparison Pill Grid */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Claimed Discount</span>
                  <span className="text-base font-bold font-mono text-slate-800">
                    {result.claimedDiscount !== null ? `${result.claimedDiscount}%` : 'Not advertised'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Seller promotional tag</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Calculated Discount</span>
                  <span className="text-base font-bold font-mono text-blue-700">
                    {result.calculatedDiscount}%
                  </span>
                  <span className="text-[10px] text-blue-600 block mt-0.5">
                    Save {formatPrice(result.priceDifference, result.currency)}
                  </span>
                </div>
              </div>

              {/* Advertised vs Calculated Warning if discrepancy > 3% */}
              {result.claimedDiscount !== null && result.discrepancyPercentage > 3 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                  <strong>Notice:</strong> Advertised discount differs by{' '}
                  <span className="font-mono font-bold">{result.discrepancyPercentage}%</span> from the
                  mathematical reduction against the listed price.
                </div>
              )}

              {/* Risk Meter Component */}
              <RiskMeter
                score={result.riskScore}
                status={result.status}
                confidence={result.confidence}
                evidenceCount={result.evidenceCount}
                suspiciousPatterns={result.suspiciousPatterns}
              />

              {/* Price Chart Preview */}
              {result.historicalPrices.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="text-xs font-bold text-slate-800">Historical Price Chart</div>
                  <PriceChart
                    historicalPrices={result.historicalPrices}
                    currentPrice={result.currentPrice}
                    originalPrice={result.originalPrice}
                    currency={result.currency}
                    historicalStats={result.historicalStats}
                  />
                </div>
              )}

              {/* Explanation & Recommendations */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-800">Summary Verdict</div>
                <p className="text-slate-600 leading-relaxed">{result.explanation}</p>
                {result.recommendations.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <span className="font-semibold text-slate-700">Guidance for Shopper:</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {result.recommendations.slice(0, 2).map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                {onNavigateToCompare && (
                  <button
                    onClick={() => onNavigateToCompare(result)}
                    className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Compare Product</span>
                  </button>
                )}
                {onNavigateToDashboard && (
                  <button
                    onClick={onNavigateToDashboard}
                    className="flex-1 py-2.5 px-3 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>View in Dashboard</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800 font-display">
                  No Analysis Generated Yet
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Fill in the product pricing form on the left or select a sample preset above to see a
                  full evaluation of discount authenticity.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 text-left text-xs space-y-2 text-slate-600">
                <span className="font-semibold text-slate-800 block text-[11px] uppercase tracking-wider">
                  What our algorithm checks:
                </span>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Mathematical validity: Does advertised discount match listed MSRP difference?</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Artificial pre-sale inflation: Was listed price hiked shortly before promotion?</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Anchor legitimacy: Did the product ever legitimately sell at the strikethrough price?</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
