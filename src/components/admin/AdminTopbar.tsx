import React from 'react';
import { Menu, Plus, Bell, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

interface AdminTopbarProps {
  onToggleMobileSidebar: () => void;
  pendingCount?: number;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  onToggleMobileSidebar,
  pendingCount = 0
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  // Determine Title & Breadcrumb based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return { title: 'ড্যাশবোর্ড ওভারভিউ', breadcrumb: 'অ্যাডমিন / ড্যাশবোর্ড' };
    if (path.startsWith('/admin/stocks/new')) return { title: 'নতুন স্টক পোস্ট তৈরি', breadcrumb: 'অ্যাডমিন / স্টক / নতুন পোস্ট' };
    if (path.includes('/edit') && path.includes('/stocks')) return { title: 'স্টক সম্পাদনা', breadcrumb: 'অ্যাডমিন / স্টক / এডিট' };
    if (path.startsWith('/admin/stocks')) return { title: 'মাছের স্টক ইনভেন্টরি', breadcrumb: 'অ্যাডমিন / স্টক পরিচালনা' };
    if (path.startsWith('/admin/orders')) return { title: 'পাইকারি চাহিদা ও ক্রয়াদেশ', breadcrumb: 'অ্যাডমিন / বায়ার চাহিদা' };
    if (path.startsWith('/admin/submissions')) return { title: 'ঘাট ও ঘের সরবরাহ লট', breadcrumb: 'অ্যাডমিন / সরবরাহ প্রস্তাব' };
    if (path.startsWith('/admin/investments')) return { title: 'মৎস্য তহবিল ও বিনিয়োগ', breadcrumb: 'অ্যাডমিন / প্রকিউরমেন্ট ফান্ড' };
    if (path.startsWith('/admin/customers')) return { title: 'করপোরেট বায়ার ডিরেক্টরি', breadcrumb: 'অ্যাডমিন / ক্রেতাবৃন্দ' };
    if (path.startsWith('/admin/sellers')) return { title: 'জেলে ও খামারি ডিরেক্টরি', breadcrumb: 'অ্যাডমিন / সরবরাহকারী' };
    if (path.startsWith('/admin/blog/new')) return { title: 'নতুন ব্লগ আর্টিকেল রচনা', breadcrumb: 'অ্যাডমিন / ব্লগ / নতুন' };
    if (path.startsWith('/admin/blog')) return { title: 'ব্লগ ও কনটেন্ট ম্যানেজমেন্ট', breadcrumb: 'অ্যাডমিন / ব্লগ CMS' };
    if (path.startsWith('/admin/reports')) return { title: 'রিপোর্ট ও পরিসংখ্যান', breadcrumb: 'অ্যাডমিন / অ্যানালিটিক্স' };
    if (path.startsWith('/admin/settings')) return { title: 'প্ল্যাটফর্ম কনফিগারেশন', breadcrumb: 'অ্যাডমিন / সেটিংস' };
    return { title: 'অ্যাডমিন প্যানেল', breadcrumb: 'অ্যাডমিন' };
  };

  const { title, breadcrumb } = getPageTitle();

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-18 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Toggle & Page Info */}
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
            {breadcrumb}
          </div>
          <h1 className="text-base sm:text-lg font-bold font-serifBangla text-slate-800 leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Actions & User area */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Quick action button */}
        <Link
          to="/admin/stocks/new"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>নতুন স্টক যুক্ত করুন</span>
        </Link>

        {/* Notifications Icon with pending count */}
        <Link
          to="/admin/orders"
          className="relative w-9 h-9 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
          title="নতুন অপেক্ষমাণ চাহিদা"
        >
          <Bell className="w-4 h-4" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-mono font-bold flex items-center justify-center animate-pulse">
              {pendingCount}
            </span>
          )}
        </Link>

        {/* User Mini Dropdown / Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {currentUser?.name?.slice(0, 1) || 'A'}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-800 leading-tight">
              {currentUser?.name?.split(' ')[0] || 'Admin'}
            </div>
            <div className="text-[10px] text-emerald-600 font-mono font-medium">
              অনলাইন
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="লগআউট"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
