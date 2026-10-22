import React from 'react';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import { NavView } from './Navbar';

interface FooterProps {
  onNavigate: (view: NavView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-display font-bold text-lg">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>VeriPrice</span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Fake Discount Detection System dedicated to marketplace price transparency.
              Verifying advertised promotions against historical price baselines and exposing
              pre-sale markups to protect consumer decision-making.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
              Notice: This is a decision-support and educational system. Price analyses are generated
              from user-provided records and verified historical observations. It does not constitute a
              legal determination of seller fraud.
            </p>
          </div>

          <div>
            <div className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">System Modules</div>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('analyzer')}
                  className="hover:text-white transition-colors text-left"
                >
                  Discount Analyzer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-white transition-colors text-left"
                >
                  Analytics Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('compare')}
                  className="hover:text-white transition-colors text-left"
                >
                  Product Comparison Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-white transition-colors text-left"
                >
                  Detection Methodology
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">Resources & Rules</div>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors text-left"
                >
                  About & Scoring Formulas
                </button>
              </li>
              <li>
                <a
                  href="#privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('about');
                  }}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Data Integrity & Terms</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="text-xs text-slate-400">
                  Historical tracking supports 30, 60, and 90-day baseline comparisons.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            &copy; 2026 VeriPrice &middot; Fake Discount Detection System. Open analytical standards.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Zero Commercial Bias</span>
            <span aria-hidden="true">&middot;</span>
            <span className="text-slate-400">RFC 4180 CSV Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
