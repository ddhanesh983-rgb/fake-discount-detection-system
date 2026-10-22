import React from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export type NavView = 'landing' | 'analyzer' | 'dashboard' | 'compare' | 'how-it-works' | 'about';

interface NavbarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, single line wordmark */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-left text-slate-900 hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 font-display">
            VeriPrice
          </span>
        </button>

        {/* Zone 2: 4-5 concise nav links, 1-2 word labels, single line */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('landing')}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors ${
              currentView === 'landing' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('analyzer')}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors ${
              currentView === 'analyzer' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Analyze Discount
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors ${
              currentView === 'dashboard' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('compare')}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors ${
              currentView === 'compare' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Compare Products
          </button>
          <button
            onClick={() => onNavigate('how-it-works')}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors ${
              currentView === 'how-it-works' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors ${
              currentView === 'about' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            About
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('analyzer')}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <span>Analyze a Product</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
