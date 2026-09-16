import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/Home';
import { BuyPage } from './pages/Buy';
import { StockDetailPage } from './pages/StockDetail';
import { SellPage } from './pages/Sell';
import { InvestPage } from './pages/Invest';
import { InvestmentDetailPage } from './pages/InvestmentDetail';
import { ContactPage } from './pages/Contact';
import { BlogPage } from './pages/Blog';
import { BlogArticlePage } from './pages/BlogArticle';
import { NotFoundPage } from './pages/NotFound';

// Admin Suite imports
import { AdminRouteGuard } from './components/admin/AdminRouteGuard';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/Login';
import { AdminDashboardPage } from './pages/admin/Dashboard';
import { AdminStocksPage } from './pages/admin/Stocks';
import { AdminStockEditPage } from './pages/admin/StockEdit';
import { AdminOrdersPage } from './pages/admin/Orders';
import { AdminSubmissionsPage } from './pages/admin/Submissions';
import { AdminInvestmentsPage } from './pages/admin/Investments';
import { AdminCustomersPage } from './pages/admin/Customers';
import { AdminSellersPage } from './pages/admin/Sellers';
import { AdminBlogPage } from './pages/admin/Blog';
import { AdminBlogEditPage } from './pages/admin/BlogEdit';
import { AdminReportsPage } from './pages/admin/Reports';
import { AdminSettingsPage } from './pages/admin/Settings';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Login (Standalone Clean View without navbar/footer) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Suite Routes */}
        <Route
          path="/admin"
          element={
            <AdminRouteGuard>
              <AdminLayout />
            </AdminRouteGuard>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="stocks" element={<AdminStocksPage />} />
          <Route path="stocks/new" element={<AdminStockEditPage />} />
          <Route path="stocks/:id/edit" element={<AdminStockEditPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="submissions" element={<AdminSubmissionsPage />} />
          <Route path="investments" element={<AdminInvestmentsPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="sellers" element={<AdminSellersPage />} />
          <Route path="blog" element={<AdminBlogPage />} />
          <Route path="blog/new" element={<AdminBlogEditPage />} />
          <Route path="blog/:slug/edit" element={<AdminBlogEditPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Public Website Routes (Wrapped with MainLayout & Water Atmosphere) */}
        <Route
          element={
            <MainLayout>
              <Outlet />
            </MainLayout>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/buy" element={<BuyPage />} />
          <Route path="/stock/:slug" element={<StockDetailPage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogArticlePage />} />
          <Route path="/invest" element={<InvestPage />} />
          <Route path="/invest/:slug" element={<InvestmentDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
