import React from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { COMPANY_CONTACT } from '../../config/constants';

export const MobileHeader: React.FC = () => {
  return (
    <header className="relative z-50 md:hidden bg-white/80 backdrop-blur-xl border-b border-white/70 shadow-[0_4px_20px_rgba(11,25,44,0.05)] transition-all duration-300">
      <div className="px-4 h-14 flex items-center justify-between">
        {/* Brand: Logo */}
        <Link to="/" className="flex items-center gap-2 active:scale-95 transition-transform">
          <img
            src="/gangchill-logo-navbar.png"
            alt="Gangchill"
            className="h-6 w-auto object-contain"
          />
        </Link>

        {/* Right Side: Quick Hotline Phone Link */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${COMPANY_CONTACT.mobileHotlineTel}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-serifBangla bg-blue-50/90 text-blue-700 border border-blue-200/80 shadow-xs active:scale-95 transition-all"
            aria-label={`হটলাইনে কল করুন (${COMPANY_CONTACT.mobileHotlineDisplay})`}
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>হটলাইন</span>
          </a>
        </div>
      </div>
    </header>
  );
};
