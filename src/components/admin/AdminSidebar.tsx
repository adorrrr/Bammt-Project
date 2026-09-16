import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Fish,
  ShoppingBag,
  Sprout,
  Coins,
  Users,
  Anchor,
  BookOpen,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
  X
} from 'lucide-react';
import { authService } from '../../services/authService';

interface AdminSidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
  pendingRequirementsCount?: number;
  pendingSellerLotsCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen,
  onCloseMobile,
  pendingRequirementsCount = 0,
  pendingSellerLotsCount = 0
}) => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) => `
    flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 group
    ${isActive
      ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-68 bg-white text-slate-700 border-r border-slate-200/80
          flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-200/80 flex items-center justify-between shrink-0 bg-white">
          <Link to="/admin" className="flex items-center gap-2.5">
            <img
              src="/gangchill-logo-navbar.png"
              alt="Gangchill"
              className="h-7 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono tracking-wider uppercase text-blue-600 font-bold">
                ADMIN SUITE
              </span>
              <span className="text-xs font-serifBangla text-slate-800 font-semibold">
                অ্যাডমিন ড্যাশবোর্ড
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-hide text-xs">
          {/* Group 1: Overview */}
          <div className="space-y-1">
            <NavLink to="/admin" end className={navItemClass} onClick={onCloseMobile}>
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>ড্যাশবোর্ড</span>
              </div>
            </NavLink>
          </div>

          {/* Group 2: Inventory & Products */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 pb-1 font-semibold">
              ইনভেন্টরি ও পণ্য
            </div>

            <NavLink to="/admin/stocks" className={navItemClass} onClick={onCloseMobile}>
              <div className="flex items-center gap-2.5">
                <Fish className="w-4 h-4 shrink-0" />
                <span>মাছের স্টক</span>
              </div>
            </NavLink>
          </div>

          {/* Group 3: Orders & Sourcing */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 pb-1 font-semibold">
              ক্রয়াদেশ ও সোর্সিং
            </div>

            <NavLink to="/admin/orders" className={navItemClass} onClick={onCloseMobile}>
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>পাইকারি ক্রয়াদেশ</span>
              </div>
              {pendingRequirementsCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                  {pendingRequirementsCount}
                </span>
              )}
            </NavLink>

            <NavLink to="/admin/submissions" className={navItemClass} onClick={onCloseMobile}>
              <div className="flex items-center gap-2.5">
                <Sprout className="w-4 h-4 shrink-0" />
                <span>ঘাট সরবরাহ লট</span>
              </div>
              {pendingSellerLotsCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                  {pendingSellerLotsCount}
                </span>
              )}
            </NavLink>
          </div>

          {/* Group 4: Network & Directory */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 pb-1 font-semibold">
              ব্যবসায়িক নেটওয়ার্ক
            </div>

            <NavLink to="/admin/customers" className={navItemClass} onClick={onCloseMobile}>
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 shrink-0" />
                <span>করপোরেট বায়ার</span>
              </div>
            </NavLink>

            <NavLink to="/admin/sellers" className={navItemClass} onClick={onCloseMobile}>
              <div className="flex items-center gap-2.5">
                <Anchor className="w-4 h-4 shrink-0" />
                <span>ঘাট ও সরবরাহকারী</span>
              </div>
            </NavLink>
          </div>

          {/* Group 5: Capital & Content */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 pb-1 font-semibold">
              তহবিল ও কনটেন্ট
            </div>

            <NavLink to="/admin/investments" className={navItemClass} onClick={onCloseMobile}>
              <div className="flex items-center gap-2.5">
                <Coins className="w-4 h-4 shrink-0" />
                <span>মৎস্য তহবিল</span>
              </div>
            </NavLink>

            <NavLink to="/admin/blog" className={navItemClass} onClick={onCloseMobile}>
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>ব্লগ ও আর্টিকেল</span>
              </div>
            </NavLink>
          </div>

          {/* Group 6: Analytics & Settings */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 pb-1 font-semibold">
              সিস্টেম ও অ্যানালিটিক্স
            </div>

            <NavLink to="/admin/reports" className={navItemClass} onClick={onCloseMobile}>
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 shrink-0" />
                <span>রিপোর্ট ও পরিসংখ্যান</span>
              </div>
            </NavLink>

            <NavLink to="/admin/settings" className={navItemClass} onClick={onCloseMobile}>
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 shrink-0" />
                <span>প্ল্যাটফর্ম সেটিংস</span>
              </div>
            </NavLink>
          </div>
        </nav>

        {/* Footer: Public Site Link & User Mini Card */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/60 space-y-2 shrink-0">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-blue-700 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>মূল ওয়েবসাইট</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">Live ↗</span>
          </Link>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser?.name?.slice(0, 1) || 'A'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-slate-800 truncate leading-tight">
                  {currentUser?.name || 'Admin'}
                </div>
                <div className="text-[10px] text-blue-600 font-medium truncate">
                  অ্যাডমিনিস্ট্রেটর
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="লগআউট করুন"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
