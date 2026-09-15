import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { adminService } from '../../services/adminService';

export const AdminLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [pendingReqCount, setPendingReqCount] = useState(0);
  const [pendingLotsCount, setPendingLotsCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Refresh counts on route changes
    const metrics = adminService.getDashboardMetrics();
    setPendingReqCount(metrics.pendingRequirementsCount);
    setPendingLotsCount(metrics.pendingSellerLotsCount);
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex antialiased selection:bg-blue-600 selection:text-white">
      {/* Responsive Left Sidebar */}
      <AdminSidebar
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        pendingRequirementsCount={pendingReqCount}
        pendingSellerLotsCount={pendingLotsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-300">
        {/* Sticky Topbar */}
        <AdminTopbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          pendingCount={pendingReqCount + pendingLotsCount}
        />

        {/* Page Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
