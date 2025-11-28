import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FiHome, FiAward } from 'react-icons/fi';

// Context Providers
import { LanguageProvider, useLang } from './context/LanguageContext';
import { UIProvider } from './context/UIContext';

// Layout Components
import Header from './components/layout/Header';
import SidebarMenu from './components/layout/SidebarMenu';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Quiz from './pages/Quiz';
import ClaimProfile from './pages/ClaimProfile';
import Winners from './pages/Winners';
import Prizes from './pages/Prizes';
import Terms from './pages/Terms';
import Help from './pages/Help';

// --- Internal Footer Component ---
// We define it here to access the Language Context easily
const Footer = () => {
  const { t } = useLang();
  const location = useLocation();

  // Helper to highlight active link
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="pb-safe fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-brand-purple">
      <div className="flex items-center justify-around p-2">
        {/* Home Link */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center w-full py-2 transition-colors duration-200 ${isActive('/') ? 'text-brand-orange' : 'text-white/60 hover:text-white'}`}
        >
          <FiHome size={22} className="mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wide">{t.home}</span>
        </Link>

        {/* Claim/Prize Link */}
        <Link
          to="/claim"
          className={`flex flex-col items-center justify-center w-full py-2 transition-colors duration-200 ${isActive('/claim') ? 'text-brand-orange' : 'text-white/60 hover:text-white'}`}
        >
          <FiAward size={22} className="mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wide">{t.claim}</span>
        </Link>
      </div>
    </nav>
  );
};

// --- Main App Component ---
function App() {
  return (
    // 1. Wrap with Language Provider (for Translation & RTL)
    <LanguageProvider>
      {/* 2. Wrap with UI Provider (for Menu Toggling) */}
      <UIProvider>
        {/* 3. Browser Router for Navigation */}
        <BrowserRouter>
          <div className="flex min-h-screen flex-col overflow-x-hidden bg-brand-dark font-sans text-white">

            {/* Top Navigation */}
            <Header />

            {/* Slide-out Menu */}
            <SidebarMenu />

            {/* Main Content Area */}
            <main className="flex-grow">
              <Routes>
                {/* Core Flow */}
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/claim" element={<ClaimProfile />} />

                {/* Menu Placeholders (To be implemented later) */}
                <Route path="/winners" element={<Winners />} />
                <Route path="/prizes" element={<Prizes />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/help" element={<Help />} />

                {/* 404 Fallback */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>

            {/* Bottom Navigation */}
            <Footer />

          </div>
        </BrowserRouter>
      </UIProvider>
    </LanguageProvider>
  );
}

// Simple Placeholder Component for empty pages
const PlaceholderPage = ({ title }) => (
  <div className="min-h-screen px-6 pt-24 text-center">
    <h2 className="mb-4 text-2xl font-bold text-brand-orange">{title}</h2>
    <p className="text-brand-gray-text">This page is under construction.</p>
    <Link to="/" className="mt-8 inline-block rounded-lg border border-white/20 px-4 py-2 text-white hover:bg-white/10">
      Go Home
    </Link>
  </div>
);

export default App;