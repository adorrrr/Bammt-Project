import React, { useState, useEffect } from 'react';
import {
  Search,
  Phone,
  MapPin,
  CheckCircle2,
  Fish
} from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { SellerLot } from '../../../types/admin';
import { AdminStatusBadge } from '../../../components/admin/AdminStatusBadge';
import { ConfirmModal } from '../../../components/admin/ConfirmModal';
import { toBanglaDigits } from '../../../utils/formatters';

export const AdminSubmissionsPage: React.FC = () => {
  const [lots, setLots] = useState<SellerLot[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [convertTarget, setConvertTarget] = useState<SellerLot | null>(null);

  const loadLots = () => {
    setLots(adminService.getSellerLots());
  };

  useEffect(() => {
    loadLots();
  }, []);

  const handleUpdateStatus = (lotId: string, status: 'pending' | 'verified' | 'approved' | 'rejected') => {
    adminService.updateSellerLotStatus(lotId, status);
    loadLots();
  };

  const handleConvertConfirm = () => {
    if (!convertTarget) return;
    adminService.convertLotToStock(convertTarget.id);
    setConvertTarget(null);
    loadLots();
  };

  const filteredLots = lots.filter((lot) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      lot.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.phone.includes(searchQuery);

    const matchesStatus =
      selectedStatus === 'all' || lot.verificationStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <h2 className="text-2xl font-bold font-serifBangla text-slate-900 tracking-tight">
          ঘাট ও ঘের সরবরাহ লট পরিচালনা
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">
          ঘাট সরবরাহ প্রস্তাব যাচাই, পরিদর্শন ও লাইভ স্টকে রূপান্তর
        </p>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="জেলে/চাষির নাম, ফোন নম্বর, মাছের প্রজাতি বা ঘাট দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500/20 transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide pt-1 border-t border-slate-100">
          {[
            { label: 'সকল প্রস্তাব', value: 'all' },
            { label: 'অপেক্ষমাণ', value: 'pending' },
            { label: 'যাচাইকৃত', value: 'verified' },
            { label: 'অনুমোদিত', value: 'approved' },
            { label: 'প্রত্যাখ্যাত', value: 'rejected' }
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer border ${
                selectedStatus === tab.value
                  ? 'bg-blue-600 text-white font-semibold border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Supplier Lots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredLots.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200/80">
            কোনো ঘাট সরবরাহ লট পাওয়া যায়নি।
          </div>
        ) : (
          filteredLots.map((lot) => (
            <div
              key={lot.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-slate-400">{lot.id}</span>
                      <AdminStatusBadge status={lot.verificationStatus} />
                    </div>
                    <h3 className="font-bold font-serifBangla text-lg text-slate-900 mt-1">
                      {lot.productName}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {lot.stockType === 'current' ? 'বর্তমান প্রস্তুত' : 'আসন্ন আহরণ'}
                  </span>
                </div>

                {/* Farmer Info */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">সরবরাহকারী:</span>
                    <strong className="text-slate-800 font-semibold">{lot.farmerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">মোবাইল:</span>
                    <a href={`tel:${lot.phone}`} className="text-blue-600 hover:text-blue-700 hover:underline font-mono font-semibold flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{lot.phone}</span>
                    </a>
                  </div>
                  <div className="col-span-2 flex items-center gap-1 text-slate-600 pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{lot.location} ({lot.district})</span>
                  </div>
                </div>

                {/* Lot Stats */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px] block">পরিমাণ:</span>
                    <strong className="text-sm font-serifBangla text-slate-900 font-bold">
                      {toBanglaDigits(lot.quantity)} {lot.unit}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">আশানুরূপ দাম:</span>
                    <strong className="text-sm font-serifBangla text-blue-700 font-bold">
                      {lot.expectedPrice ? `৳${lot.expectedPrice} /কেজি` : 'আলোচনা সাপেক্ষে'}
                    </strong>
                  </div>
                </div>

                {lot.description && (
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    "{lot.description}"
                  </p>
                )}

                {/* Photos */}
                {lot.images && lot.images.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-600">ঘাট থেকে পাঠানো ছবি:</span>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {lot.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Fish lot"
                          className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {lot.verificationStatus !== 'verified' && lot.verificationStatus !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(lot.id, 'verified')}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-medium transition-colors cursor-pointer"
                    >
                      মাঠ যাচাই সম্পন্ন
                    </button>
                  )}

                  {lot.verificationStatus !== 'rejected' && lot.verificationStatus !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(lot.id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-medium transition-colors cursor-pointer"
                    >
                      প্রত্যাখ্যান
                    </button>
                  )}
                </div>

                {lot.verificationStatus !== 'approved' ? (
                  <button
                    type="button"
                    onClick={() => setConvertTarget(lot)}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Fish className="w-3.5 h-3.5" />
                    <span>স্টকে রূপান্তর করুন →</span>
                  </button>
                ) : (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>লাইভ স্টকে যুক্ত হয়েছে</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal to Convert Lot into Live Stock */}
      <ConfirmModal
        isOpen={Boolean(convertTarget)}
        title="সরবরাহ লটকে ইনভেন্টরি স্টকে রূপান্তর"
        message={`আপনি কি "${convertTarget?.farmerName}"-এর "${convertTarget?.productName}" (${convertTarget?.quantity} ${convertTarget?.unit}) লটটি অনুমোদন করে ওয়েবসাইটে সরাসরি লাইভ স্টক পোস্টে প্রকাশ করতে চান?`}
        confirmLabel="হ্যাঁ, স্টকে রূপান্তর করুন"
        variant="success"
        onConfirm={handleConvertConfirm}
        onClose={() => setConvertTarget(null)}
      />
    </div>
  );
};

export default AdminSubmissionsPage;
