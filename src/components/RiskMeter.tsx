import React from 'react';
import { ShieldCheck, AlertTriangle, HelpCircle } from 'lucide-react';
import { AssessmentStatus, ConfidenceLevel, SuspiciousPattern } from '../types';

interface RiskMeterProps {
  score: number; // 0 - 100
  status: AssessmentStatus;
  confidence: ConfidenceLevel;
  evidenceCount: number;
  suspiciousPatterns: SuspiciousPattern[];
}

export const RiskMeter: React.FC<RiskMeterProps> = ({
  score,
  status,
  confidence,
  evidenceCount,
  suspiciousPatterns,
}) => {
  // Determine color palette based on status and score
  const getStatusConfig = () => {
    switch (status) {
      case 'LIKELY_GENUINE':
        return {
          label: 'Likely Genuine',
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-800',
          borderColor: 'border-emerald-200',
          progressColor: 'bg-emerald-500',
          icon: ShieldCheck,
          subtext: 'The advertised discount aligns with historical market pricing.',
        };
      case 'POTENTIALLY_MISLEADING':
        return {
          label: 'Potentially Misleading',
          bgColor: score >= 65 ? 'bg-rose-50' : 'bg-amber-50',
          textColor: score >= 65 ? 'text-rose-800' : 'text-amber-800',
          borderColor: score >= 65 ? 'border-rose-200' : 'border-amber-200',
          progressColor: score >= 65 ? 'bg-rose-600' : 'bg-amber-500',
          icon: AlertTriangle,
          subtext: 'Significant discrepancies or artificial markup patterns detected.',
        };
      case 'INSUFFICIENT_EVIDENCE':
      default:
        return {
          label: 'Insufficient Evidence',
          bgColor: 'bg-slate-100',
          textColor: 'text-slate-800',
          borderColor: 'border-slate-200',
          progressColor: 'bg-slate-500',
          icon: HelpCircle,
          subtext: 'Not enough historical data points to reach a definitive conclusion.',
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className={`p-5 rounded-xl border ${config.borderColor} ${config.bgColor} space-y-4`}>
      {/* Status banner */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg bg-white border ${config.borderColor} shadow-xs`}>
            <IconComponent className={`w-5 h-5 ${config.textColor}`} />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-500">
              Authenticity Assessment
            </div>
            <div className={`text-lg font-bold font-display ${config.textColor}`}>
              {config.label}
            </div>
          </div>
        </div>

        {/* Confidence & Coverage */}
        <div className="text-right text-xs space-y-0.5">
          <div className="text-slate-500">Confidence Level</div>
          <div className="font-semibold text-slate-800 flex items-center justify-end gap-1">
            <span>{confidence}</span>
            <span className="text-slate-400 font-normal">({evidenceCount} obs)</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-700 leading-relaxed">
        {config.subtext}
      </p>

      {/* Numerical Risk Gauge */}
      <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-700">Deceptive Discount Risk Index</span>
          <span className="font-mono font-bold text-slate-900 text-sm">
            {score} <span className="text-slate-400 font-normal text-xs">/ 100</span>
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${config.progressColor} transition-all duration-500 rounded-full`}
            style={{ width: `${Math.max(4, score)}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-0.5">
          <span>0 (Low Risk / Genuine)</span>
          <span>50 (Moderate Concern)</span>
          <span>100 (Critical Discrepancy)</span>
        </div>
      </div>

      {/* Identified suspicious indicators breakdown */}
      {suspiciousPatterns.length > 0 && (
        <div className="pt-3 border-t border-slate-200/60 space-y-2">
          <div className="text-xs font-semibold text-slate-800">
            Detected Caution Factors ({suspiciousPatterns.length})
          </div>
          <div className="space-y-1.5">
            {suspiciousPatterns.map((pattern) => (
              <div
                key={pattern.id}
                className="bg-white/80 border border-slate-200 rounded-lg p-2.5 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-medium text-slate-800">
                  <span>{pattern.name}</span>
                  <span className="font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[11px]">
                    +{pattern.scoreContribution} pts
                  </span>
                </div>
                <div className="text-slate-600 text-[11px] leading-relaxed">
                  {pattern.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
