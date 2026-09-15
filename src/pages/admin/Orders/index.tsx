import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Calendar,
  MessageSquare,
  Send,
  X,
  DollarSign
} from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { BuyerOrder, OrderStatus } from '../../../types/admin';
import { AdminStatusBadge } from '../../../components/admin/AdminStatusBadge';
import { formatTaka, toBanglaDigits, formatBanglaDate } from '../../../utils/formatters';

const STATUS_TABS: { label: string; value: 'all' | OrderStatus }[] = [
  { label: 'সকল চাহিদা', value: 'all' },
  { label: 'অপেক্ষমাণ (Pending)', value: 'pending' },
  { label: 'দরপত্র প্রেরিত (Quoted)', value: 'quoted' },
  { label: 'কনফার্মড (Confirmed)', value: 'confirmed' },
  { label: 'পরিবহনরত (Dispatched)', value: 'dispatched' },
  { label: 'সম্পন্ন (Completed)', value: 'completed' },
  { label: 'বাতিল (Cancelled)', value: 'cancelled' }
];

export const AdminOrdersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<BuyerOrder | null>(null);

  // Quote & Note inputs in drawer
  const [quoteInput, setQuoteInput] = useState<string>('');
  const [newNoteText, setNewNoteText] = useState('');

  const loadOrders = () => {
    const list = adminService.getBuyerOrders();
    setOrders(list);

    // Auto open drawer if query param has ?id=xxx
    const orderIdParam = searchParams.get('id');
    if (orderIdParam) {
      const match = list.find((o) => o.id === orderIdParam);
      if (match) {
        setSelectedOrder(match);
        setQuoteInput(match.quotedPricePerUnit ? match.quotedPricePerUnit.toString() : '');
      }
    }
  };

  useEffect(() => {
    loadOrders();
  }, [searchParams]);

  const openOrderDrawer = (order: BuyerOrder) => {
    setSelectedOrder(order);
    setQuoteInput(order.quotedPricePerUnit ? order.quotedPricePerUnit.toString() : '');
    setNewNoteText('');
  };

  const closeDrawer = () => {
    setSelectedOrder(null);
    if (searchParams.get('id')) {
      searchParams.delete('id');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    const updated = adminService.updateOrderStatus(selectedOrder.id, newStatus);
    if (updated) {
      setSelectedOrder(updated);
      loadOrders();
    }
  };

  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !quoteInput) return;
    const price = Number(quoteInput);
    if (isNaN(price) || price <= 0) return;

    const updated = adminService.updateOrderQuote(selectedOrder.id, price);
    if (updated) {
      setSelectedOrder(updated);
      loadOrders();
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !newNoteText.trim()) return;

    const updated = adminService.addOrderInternalNote(selectedOrder.id, newNoteText.trim());
    if (updated) {
      setSelectedOrder(updated);
      setNewNoteText('');
      loadOrders();
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      order.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' || order.orderStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-bold font-serifBangla text-slate-900 tracking-tight">
          পাইকারি চাহিদা ও ক্রয়াদেশ পরিচালনা
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          করপোরেট চাহিদাপত্র, কোটেশন ও সরবরাহ ট্র্যাকিং
        </p>
      </div>

      {/* 2. Compact Search & Status Tabs */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3.5 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="কোম্পানির নাম, প্রতিনিধি, ফোন বা মাছের নাম দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500/20 transition-colors"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide pt-1 border-t border-slate-100">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedStatus === tab.value
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Clean Orders Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-mono text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-4 font-semibold">অর্ডার ID ও তারিখ</th>
                <th className="py-3.5 px-4 font-semibold">বায়ার প্রতিষ্ঠান</th>
                <th className="py-3.5 px-4 font-semibold">চাহিদা মাছ ও পরিমাণ</th>
                <th className="py-3.5 px-4 font-semibold">কোটেশন ও মোট মূল্য</th>
                <th className="py-3.5 px-4 font-semibold">ডেলিভারি স্থান</th>
                <th className="py-3.5 px-4 font-semibold">বর্তমান স্ট্যাটাস</th>
                <th className="py-3.5 px-4 font-semibold text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    কোনো অর্ডার বা চাহিদাপত্র পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-blue-600 font-semibold block">{order.id}</span>
                      <span className="text-[10px] text-slate-400 block">
                        {order.createdAt ? formatBanglaDate(order.createdAt.split('T')[0]) : 'সম্প্রতি'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <h3 className="font-bold text-slate-900 text-sm truncate max-w-[180px]">
                        {order.companyName}
                      </h3>
                      <span className="text-[11px] text-slate-500 block truncate">
                        {order.contactPerson} ({order.phone})
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 font-bold block text-sm font-serifBangla">
                        {order.productName}
                      </strong>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {toBanglaDigits(order.quantity)} {order.unit}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {order.quotedPricePerUnit ? (
                        <div>
                          <strong className="text-blue-600 font-bold text-sm font-mono block">
                            {formatTaka(order.quotedPricePerUnit * order.quantity)}
                          </strong>
                          <span className="text-[10px] text-slate-400 font-mono">
                            (৳{toBanglaDigits(order.quotedPricePerUnit)}/{order.unit})
                          </span>
                        </div>
                      ) : (
                        <span className="text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded text-[10px] border border-amber-200">
                          কোটেশন প্রয়োজন
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1 font-medium text-slate-700">
                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{order.requiredDate || 'জরুরি'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[140px]">{order.deliveryLocation}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <AdminStatusBadge status={order.orderStatus} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openOrderDrawer(order)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/60 transition-colors cursor-pointer"
                      >
                        বিবরণ ও কোটেশন →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Slide-in Order Details & Quotation Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-xl bg-white border-l border-slate-200 text-slate-700 shadow-2xl flex flex-col h-full z-10 animate-fade-in overflow-hidden">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
              <div>
                <span className="text-[11px] font-mono text-blue-600 font-bold block">
                  {selectedOrder.id}
                </span>
                <h2 className="text-base font-bold font-serifBangla text-slate-900 truncate max-w-sm mt-0.5">
                  {selectedOrder.companyName}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeDrawer}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              {/* Order Status & Primary Progression */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">বর্তমান অবস্থা:</span>
                  <AdminStatusBadge status={selectedOrder.orderStatus} />
                </div>

                {/* Progression action buttons */}
                <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('confirmed')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-medium border border-emerald-200 transition-colors cursor-pointer"
                  >
                    ✓ নিশ্চিত করুন (Confirm)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('dispatched')}
                    className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white font-medium border border-sky-200 transition-colors cursor-pointer"
                  >
                    🚚 পরিবহনরত (Dispatch)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('completed')}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white font-medium border border-teal-200 transition-colors cursor-pointer"
                  >
                    ★ সম্পন্ন (Complete)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('cancelled')}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-medium border border-rose-200 transition-colors ml-auto cursor-pointer"
                  >
                    ✕ বাতিল (Cancel)
                  </button>
                </div>
              </div>

              {/* Requirement Details */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono border-b border-slate-200 pb-2">
                  চাহিদা ও স্পেসিফিকেশন
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">মাছের নাম</span>
                    <strong className="text-slate-900 text-sm font-serifBangla">{selectedOrder.productName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">পরিমাণ</span>
                    <strong className="text-slate-900 font-mono">{toBanglaDigits(selectedOrder.quantity)} {selectedOrder.unit}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">প্রয়োজনীয় তারিখ</span>
                    <strong className="text-slate-700">{selectedOrder.requiredDate || 'তাৎক্ষণিক'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">ডেলিভারি ঠিকানা</span>
                    <strong className="text-slate-700">{selectedOrder.deliveryLocation}</strong>
                  </div>
                </div>

                {selectedOrder.specification && (
                  <div className="pt-2 border-t border-slate-200 text-[11px]">
                    <span className="text-slate-500 block">স্পেসিফিকেশন:</span>
                    <p className="text-slate-700 mt-0.5 bg-white p-2.5 rounded-lg border border-slate-200">
                      {selectedOrder.specification}
                    </p>
                  </div>
                )}
              </div>

              {/* Quotation Pricing Tool */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono border-b border-slate-200 pb-2 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                  পাইকারি কোটেশন রেট নির্ধারণ
                </h3>

                <form onSubmit={handleSaveQuote} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                      <input
                        type="number"
                        placeholder="প্রতি কেজি দর লিখুন"
                        value={quoteInput}
                        onChange={(e) => setQuoteInput(e.target.value)}
                        className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shrink-0 shadow-xs cursor-pointer"
                    >
                      কোটেশন সংরক্ষণ
                    </button>
                  </div>

                  {quoteInput && !isNaN(Number(quoteInput)) && Number(quoteInput) > 0 && (
                    <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-between font-mono">
                      <span>মোট আনুমানিক মূল্য:</span>
                      <span className="text-sm font-bold">
                        {formatTaka(Number(quoteInput) * selectedOrder.quantity)}
                      </span>
                    </div>
                  )}
                </form>
              </div>

              {/* Internal Notes Thread */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono border-b border-slate-200 pb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  অ্যাডমিন ও টিম নোট
                </h3>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedOrder.internalNotesList && selectedOrder.internalNotesList.length > 0 ? (
                    selectedOrder.internalNotesList.map((note) => (
                      <div key={note.id} className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-800">{note.author}</span>
                          <span className="font-mono">{new Date(note.createdAt).toLocaleTimeString('bn-BD')}</span>
                        </div>
                        <p className="text-slate-600 text-xs">{note.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic text-[11px]">এখনো কোনো ইন্টারনাল নোট যোগ করা হয়নি</p>
                  )}
                </div>

                <form onSubmit={handleAddNote} className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="নতুন টিম নোট লিখুন..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors shrink-0 cursor-pointer"
                    title="নোট পাঠান"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
