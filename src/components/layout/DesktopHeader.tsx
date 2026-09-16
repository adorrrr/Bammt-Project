import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ChevronDown, Check, Globe } from 'lucide-react';

export const DesktopHeader: React.FC = () => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) => `
    relative text-sm font-medium transition-all py-1.5 px-1
    ${isActive
      ? 'text-blue-600 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-sky-400 after:rounded-full shadow-2xs'
      : 'text-slate-700/90 hover:text-blue-600'
    }
  `;

  return (
    <header className="relative z-40 hidden md:block bg-white/80 backdrop-blur-xl border-b border-white/70 shadow-[0_4px_24px_rgba(11,25,44,0.05)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <img
            src="/gangchill-logo-navbar.png"
            alt="Gangchill"
            className="h-9 lg:h-11 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-5 lg:gap-8">
          <NavLink to="/" end className={navLinkClass}>
            হোম
          </NavLink>
          <NavLink to="/buy" className={navLinkClass}>
            কিনুন
          </NavLink>
          <NavLink to="/sell" className={navLinkClass}>
            বিক্রি করুন
          </NavLink>
          <NavLink to="/invest" className={navLinkClass}>
            বিনিয়োগ করুন
          </NavLink>          <NavLink to="/blog" className={navLinkClass}>
            ব্লগ
          </NavLink>          <NavLink to="/contact" className={navLinkClass}>
            যোগাযোগ
          </NavLink>
        </nav>

        {/* Right Element: Language Dropdown Pill */}
        <div className="relative flex items-center gap-3" ref={langMenuRef}>
          <button
            type="button"
            onClick={() => setIsLangOpen(!isLangOpen)}
            aria-haspopup="true"
            aria-expanded={isLangOpen}
            aria-label="ভাষা পরিবর্তন করুন (Language Selector)"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/70 backdrop-blur-md border border-white/90 text-slate-700 hover:text-blue-600 hover:border-sky-400/40 hover:bg-white/90 shadow-[0_2px_8px_rgba(11,25,44,0.04)] active:scale-95 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>BN</span>
            <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Interactive Language Dropdown */}
          {isLangOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_12px_36px_rgba(11,25,44,0.12)] p-1.5 z-50 animate-fade-in text-xs">
              <button
                type="button"
                onClick={() => setIsLangOpen(false)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50/80 text-blue-700 font-bold text-left"
              >
                <span>বাংলা (বাংলা)</span>
                <Check className="w-3.5 h-3.5 text-blue-600" />
              </button>
              <div
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 text-left cursor-not-allowed select-none"
                title="English version coming soon"
              >
                <span>English (EN)</span>
                <span className="text-[10px] text-sky-600 font-mono">শীঘ্রই আসছে</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
