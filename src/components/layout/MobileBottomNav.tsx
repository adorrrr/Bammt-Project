import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, PlusCircle, TrendingUp, BookOpen, PhoneCall } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'হোম', icon: Home, end: true },
  { to: '/buy', label: 'কিনুন', icon: ShoppingBag },
  { to: '/sell', label: 'বিক্রি', icon: PlusCircle },
  { to: '/invest', label: 'বিনিয়োগ', icon: TrendingUp },  { to: '/blog', label: 'ব্লগ', icon: BookOpen },  { to: '/contact', label: 'যোগাযোগ', icon: PhoneCall },
];

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden pointer-events-auto">
      {/* Liquid Frosted Glass Floating Dock */}
      <nav
        aria-label="মোবাইল দ্রুত নেভিগেশন"
        className="mx-3 mb-2.5 rounded-2xl bg-white/85 backdrop-blur-2xl border border-white/80 shadow-[0_12px_36px_rgba(11,25,44,0.14)] px-2 py-1.5 flex items-center justify-around"
        style={{ paddingBottom: 'calc(0.375rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => {
          const isActive = end
            ? location.pathname === to
            : location.pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 active:scale-90 select-none ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              {/* Active glow pill */}
              {isActive && (
                <span className="absolute -top-1 w-6 h-1 rounded-full bg-gradient-to-r from-blue-600 to-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.6)] animate-fade-in" />
              )}

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? 'bg-blue-50/90 text-blue-600 shadow-2xs' : 'text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span className="text-[10px] font-serifBangla mt-0.5 leading-none tracking-tight">
                {label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
