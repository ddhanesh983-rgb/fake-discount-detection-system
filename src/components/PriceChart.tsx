import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { PricePoint, HistoricalStats } from '../types';
import { formatPrice } from '../services/analyzer';

interface PriceChartProps {
  historicalPrices: PricePoint[];
  currentPrice: number;
  originalPrice: number;
  currency: string;
  historicalStats?: HistoricalStats;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  historicalPrices,
  currentPrice,
  originalPrice,
  currency,
  historicalStats,
}) => {
  if (!historicalPrices || historicalPrices.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm p-4 text-center">
        <p className="font-medium text-slate-700 mb-1">No Historical Price Log Available</p>
        <p className="text-xs text-slate-500 max-w-sm">
          Enter prior price observations or upload a historical price CSV to visualize price trends and detect pre-sale inflation.
        </p>
      </div>
    );
  }

  // Format chart data
  const chartData = historicalPrices.map((p) => ({
    date: p.date,
    displayDate: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: p.price,
    source: p.source,
    notes: p.notes,
  }));

  // Min and max bounds with padding
  const allValues = [...chartData.map((d) => d.price), currentPrice, originalPrice];
  const minVal = Math.floor(Math.min(...allValues) * 0.95);
  const maxVal = Math.ceil(Math.max(...allValues) * 1.05);

  return (
    <div className="space-y-3">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="displayDate"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              domain={[minVal, maxVal]}
              tickFormatter={(v) => formatPrice(v, currency)}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-lg space-y-1">
                      <div className="font-semibold text-slate-200">{data.date}</div>
                      <div className="text-blue-400 font-mono text-sm font-bold">
                        {formatPrice(data.price, currency)}
                      </div>
                      {data.notes && <div className="text-slate-300 italic">{data.notes}</div>}
                      <div className="text-slate-400 text-[10px] uppercase">
                        Source: {data.source.replace('_', ' ')}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Historical Average reference line */}
            {historicalStats && (
              <ReferenceLine
                y={historicalStats.average}
                stroke="#64748b"
                strokeDasharray="4 4"
                label={{
                  value: `Avg: ${formatPrice(historicalStats.average, currency)}`,
                  position: 'insideBottomRight',
                  fill: '#64748b',
                  fontSize: 10,
                }}
              />
            )}

            {/* Current Promotion Price reference line */}
            <ReferenceLine
              y={currentPrice}
              stroke="#2563eb"
              strokeWidth={1.5}
              label={{
                value: `Current: ${formatPrice(currentPrice, currency)}`,
                position: 'insideTopLeft',
                fill: '#2563eb',
                fontSize: 10,
                fontWeight: 600,
              }}
            />

            <Line
              type="monotone"
              dataKey="price"
              stroke="#0f172a"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#0f172a', strokeWidth: 1, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#2563eb' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart legend / metadata bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-900 inline-block"></span>
            <span>Historical Price Trail</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-600 inline-block"></span>
            <span>Current Offer Price</span>
          </div>
          {historicalStats && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-dashed border-slate-400 inline-block"></span>
              <span>Historical Mean</span>
            </div>
          )}
        </div>
        {historicalStats && (
          <div className="font-mono text-slate-600">
            {historicalStats.dataPoints} observations across {historicalStats.windowDays} days
          </div>
        )}
      </div>
    </div>
  );
};
