import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  DollarSign,
  Anchor,
  Building2,
  Fish,
  ShoppingBag,
  Coins
} from 'lucide-react';
import { adminService } from '../../../services/adminService';

export const AdminReportsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('month');

  const stocks = adminService.getStocks();
  const orders = adminService.getBuyerOrders();
  const lots = adminService.getSellerLots();
  const investments = adminService.getInvestments();
  const interests = adminService.getInvestorInterests();

  // Metrics computation
  const totalStockKg = stocks.reduce((sum, s) => sum + (s.quantity || 0), 0);
  const totalStockValue = stocks.reduce((sum, s) => sum + (s.quantity * (s.price || 0)), 0);

  const completedOrders = orders.filter((o) => o.orderStatus === 'completed');
  const activeOrders = orders.filter((o) => o.orderStatus === 'confirmed' || o.orderStatus === 'processing' || o.orderStatus === 'dispatched');
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'under_review' || o.orderStatus === 'quoted');

  const totalRevenueRealized = completedOrders.reduce((sum, o) => sum + (o.totalEstimatedValue || 0), 0);
  const totalPipelineValue = orders.reduce((sum, o) => sum + (o.totalEstimatedValue || 0), 0);

  const verifiedLots = lots.filter((l) => l.verificationStatus === 'approved' || l.verificationStatus === 'verified');
  const totalSourcedKg = lots.reduce((sum, l) => sum + (l.quantity || 0), 0);

  const totalFundRaised = investments.reduce((sum, i) => sum + i.raisedCapital, 0);
  const totalFundTarget = investments.reduce((sum, i) => sum + i.requiredCapital, 0);

  // Hub distribution breakdown
  const hubMap = new Map<string, { count: number; kg: number }>();
  lots.forEach((l) => {
    const district = l.district || 'অন্যান্য';
    const cur = hubMap.get(district) || { count: 0, kg: 0 };
    cur.count += 1;
    cur.kg += l.quantity || 0;
    hubMap.set(district, cur);
  });

  // Export to CSV
  const handleExportCSV = () => {
    const csvRows = [
      ['গ্যাংচিল প্ল্যাটফর্ম - এক্সিকিউটিভ রিপোর্ট'],
      ['রিপোর্ট তৈরির তারিখ', new Date().toLocaleString('bn-BD')],
      ['টাইম রেঞ্জ', timeRange],
      [''],
      ['বিষয়', 'পরিমাণ / মান', 'মন্তব্য'],
      ['মোট ফিজিক্যাল স্টক ওজন', `${totalStockKg} কেজি`, 'লাইভ ও আপকামিং মিলিয়ে'],
      ['মোট স্টক ভ্যালুয়েশন', `৳ ${totalStockValue}`, 'বর্তমান হোল্ডিং ইনভেন্টরি'],
      ['মোট পাইকারি অর্ডার সংখ্যা', `${orders.length} টি`, 'বি২বি চাহিদাপত্র'],
      ['সম্পূর্ণ হওয়া অর্ডারের রাজস্ব', `৳ ${totalRevenueRealized}`, 'ক্যাশবুক রিলাইজড'],
      ['পাইপলাইন রাজস্ব মান', `৳ ${totalPipelineValue}`, 'চলতি ও প্রক্রিয়াধীন ক্রয়াদেশ'],
      ['ঘাট সরবরাহকৃত লট', `${lots.length} টি`, 'জেলে ও ট্রলার থেকে আহরণ'],
      ['মোট আহরিত মাছের ওজন', `${totalSourcedKg} কেজি`, 'উপকূল ও বিলের সংগ্রহ'],
      ['মৎস্য তহবিল সংগ্রহ', `৳ ${totalFundRaised}`, `টার্গেট ৳ ${totalFundTarget}`],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gangchill_report_${timeRange}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 print:p-0 print:m-0">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serifBangla flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            প্ল্যাটফর্ম অ্যানালিটিক্স ও রিপোর্ট
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            ইনভেন্টরি, রাজস্ব পাইপলাইন ও আহরণ কার্যক্রমের সমন্বিত প্রতিবেদন
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Time Filter */}
          <div className="flex items-center p-1 bg-white rounded-xl border border-slate-200 text-xs shadow-xs">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                timeRange === 'today' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              আজ
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                timeRange === 'week' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সপ্তাহ
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                timeRange === 'month' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              চলতি মাস
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                timeRange === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সর্বমোট
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            CSV এক্সপোর্ট
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            প্রিন্ট সামারি
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>ইনভেন্টরি ভ্যালু (বর্তমান স্টক)</span>
            <Fish className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-bangla">৳{(totalStockValue / 100000).toFixed(1)} লাখ</p>
          <span className="text-[11px] text-slate-400">{(totalStockKg / 1000).toFixed(1)} টন সক্রিয় কোল্ড চেইনে</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>পাইপলাইন ও কনফার্মড বিক্রয়</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-1 font-bangla">৳{(totalPipelineValue / 100000).toFixed(1)} লাখ</p>
          <span className="text-[11px] text-slate-400">{orders.length} টি করপোরেট চাহিদাপত্র</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>উপকূলীয় আহরণ ভলিউম</span>
            <Anchor className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-bangla">{(totalSourcedKg / 1000).toFixed(1)} টন</p>
          <span className="text-[11px] text-slate-400">{verifiedLots.length} টি যাচাইকৃত সরবরাহ লট</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>বিনিয়োগ ও তহবিল সংগ্রহ</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-1 font-bangla">৳{(totalFundRaised / 100000).toFixed(1)} লাখ</p>
          <span className="text-[11px] text-slate-400">{interests.length} টি বিনিয়োগ আবেদন জমা</span>
        </div>
      </div>

      {/* Grid 2 Columns: Order Lifecycle & Hub Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Lifecycle Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-serifBangla flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            পাইকারি ক্রয়াদেশের রূপান্তর পাইপলাইন (Order Lifecycle)
          </h2>

          <div className="space-y-3 pt-2 text-xs">
            {/* Stage 1 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold font-mono">
                  {pendingOrders.length}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">পেন্ডিং ও কোটেশন পর্যায়</h4>
                  <p className="text-slate-500 text-[11px]">চাহিদা গ্রহণ, রেট যাচাই ও কোটেশন পাঠানো</p>
                </div>
              </div>
              <span className="text-amber-700 font-bold font-bangla">
                ৳{(pendingOrders.reduce((acc, o) => acc + (o.totalEstimatedValue || 0), 0) / 100000).toFixed(1)} লাখ
              </span>
            </div>

            {/* Stage 2 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold font-mono">
                  {activeOrders.length}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">কনফার্মড ও ডেলিভারি চলমান</h4>
                  <p className="text-slate-500 text-[11px]">লট বরাদ্দ, বরফ প্যাকিং ও রেফার ভ্যানে পরিবহন</p>
                </div>
              </div>
              <span className="text-blue-700 font-bold font-bangla">
                ৳{(activeOrders.reduce((acc, o) => acc + (o.totalEstimatedValue || 0), 0) / 100000).toFixed(1)} লাখ
              </span>
            </div>

            {/* Stage 3 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold font-mono">
                  {completedOrders.length}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">সম্পন্ন ও বিল পরিশোধিত</h4>
                  <p className="text-slate-500 text-[11px]">সফল ডেলিভারি ও ক্রেতা কর্তৃক প্রাপ্তি স্বীকার</p>
                </div>
              </div>
              <span className="text-emerald-700 font-bold font-bangla">
                ৳{(totalRevenueRealized / 100000).toFixed(1)} লাখ
              </span>
            </div>
          </div>
        </div>

        {/* Hub Sourcing Distribution */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-serifBangla flex items-center gap-2">
            <Anchor className="w-5 h-5 text-blue-600" />
            উপকূল ও হাবভিত্তিক মাছ আহরণ রিপোর্ট (Sourcing Hubs)
          </h2>

          <div className="space-y-3 pt-2 text-xs">
            {Array.from(hubMap.entries()).map(([hubName, data]) => {
              const share = totalSourcedKg > 0 ? Math.round((data.kg / totalSourcedKg) * 100) : 0;
              return (
                <div key={hubName} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      {hubName} হাব ({data.count} টি লট)
                    </span>
                    <span className="text-slate-600 font-mono font-medium">
                      {data.kg.toLocaleString('bn-BD')} কেজি ({share}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${share}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Corporate Buyers Activity Summary Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 font-serifBangla flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            শীর্ষ করপোরেট বায়ারদের ক্রয়ের সারাংশ
          </h2>
          <span className="text-xs text-slate-500">মোট {orders.length} টি অর্ডারের ডাটাবেজ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-mono text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4 font-semibold">অর্ডার নং</th>
                <th className="py-3 px-4 font-semibold">কোম্পানির নাম</th>
                <th className="py-3 px-4 font-semibold">মাছের নাম</th>
                <th className="py-3 px-4 font-semibold">পরিমাণ</th>
                <th className="py-3 px-4 font-semibold">কোটেশন রেট</th>
                <th className="py-3 px-4 font-semibold">মোট মূল্য</th>
                <th className="py-3 px-4 font-semibold">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-blue-600 font-medium">{ord.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{ord.companyName}</td>
                  <td className="py-3 px-4 text-slate-700">{ord.productName}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{ord.quantity} {ord.unit}</td>
                  <td className="py-3 px-4 text-slate-900 font-semibold font-bangla">
                    {ord.quotedPricePerUnit ? `৳${ord.quotedPricePerUnit}` : 'অনির্ধারিত'}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 font-bangla">
                    {ord.totalEstimatedValue ? `৳${ord.totalEstimatedValue.toLocaleString('bn-BD')}` : '—'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 border border-slate-200 text-slate-700">
                      {ord.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
