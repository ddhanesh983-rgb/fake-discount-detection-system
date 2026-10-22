/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavView } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './views/LandingPage';
import { AnalyzerPage } from './views/AnalyzerPage';
import { DashboardPage } from './views/DashboardPage';
import { ComparisonPage } from './views/ComparisonPage';
import { HowItWorksPage } from './views/HowItWorksPage';
import { AboutPage } from './views/AboutPage';
import { AnalysisResult } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<NavView>('landing');
  const [activePreset, setActivePreset] = useState<string | undefined>(undefined);
  const [preselectedCompareProduct, setPreselectedCompareProduct] = useState<AnalysisResult | null>(null);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigate = (view: NavView) => {
    setCurrentView(view);
  };

  const handleAnalyzeSample = (presetKey: string) => {
    setActivePreset(presetKey);
    setCurrentView('analyzer');
  };

  const handleNavigateToCompare = (product: AnalysisResult) => {
    setPreselectedCompareProduct(product);
    setCurrentView('compare');
  };

  const handleNavigateToDashboard = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Bar following strict 3-zone contract */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onAnalyzeSample={handleAnalyzeSample}
          />
        )}

        {currentView === 'analyzer' && (
          <AnalyzerPage
            initialPreset={activePreset}
            onNavigateToCompare={handleNavigateToCompare}
            onNavigateToDashboard={handleNavigateToDashboard}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardPage
            onNavigate={handleNavigate}
            onCompareProducts={(products) => {
              if (products.length > 0) {
                setPreselectedCompareProduct(products[0]);
              }
              setCurrentView('compare');
            }}
          />
        )}

        {currentView === 'compare' && (
          <ComparisonPage
            onNavigate={handleNavigate}
            preselectedProduct={preselectedCompareProduct}
          />
        )}

        {currentView === 'how-it-works' && (
          <HowItWorksPage onNavigate={handleNavigate} />
        )}

        {currentView === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
