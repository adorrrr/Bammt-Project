import React, { useState, useEffect } from 'react';
import {
  Anchor,
  Search,
  MapPin,
  Phone,
  Plus,
  ArrowUpRight,
  Filter,
  ShieldCheck,
  Package,
  Award
} from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { SellerLot } from '../../../types/admin';

interface SupplierProfile {
  id: string;
  farmerName: string;
  type: 'জেলে সমবায়' | 'ঘের মালিক' | 'ট্রলার কনসোর্টিয়াম' | 'স্বতন্ত্র মাছ চাষী';
  phone: string;
  district: string;
  location: string;
  verificationBadge: 'verified' | 'provisional' | 'new';
  totalLotsCount: number;
  totalVolumeKg: number;
  qualityRating: number;
  primarySpecies: string[];
  joinedDate: string;
}

export const AdminSellersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [selectedSupplierLots, setSelectedSupplierLots] = useState<{
    supplier: SupplierProfile;
    lots: SellerLot[];
  } | null>(null);

  // Add supplier modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSupplierForm, setNewSupplierForm] = useState({
    farmerName: '',
    type: 'জেলে সমবায়' as SupplierProfile['type'],
    phone: '',
    district: 'চাঁদপুর',
    location: 'বড়স্টেশন মোহনা ঘাট',
    verificationBadge: 'verified' as SupplierProfile['verificationBadge'],
    primarySpecies: 'পদ্মার রূপালী ইলিশ, মেঘনার পাঙ্গাশ'
  });

  const loadData = () => {
    const lots = adminService.getSellerLots();

    const baseSuppliers: SupplierProfile[] = [
      {
        id: 'SUP-001',
        farmerName: 'মো: মোশাররফ হোসেন (জেলে সমবায়)',
        type: 'জেলে সমবায়',
        phone: '01715-998877',
        district: 'চাঁদপুর',
        location: 'বড়স্টেশন মোহনা ঘাট',
        verificationBadge: 'verified',
        totalLotsCount: 14,
        totalVolumeKg: 8500,
        qualityRating: 4.9,
        primarySpecies: ['পদ্মার রূপালী ইলিশ', 'মেঘনার পাঙ্গাশ', 'তপসে'],
        joinedDate: '2025-11-10'
      },
      {
        id: 'SUP-002',
        farmerName: 'হাজী সামসুল হক (ট্রলার মালিক)',
        type: 'ট্রলার কনসোর্টিয়াম',
        phone: '01814-332211',
        district: 'কক্সবাজার',
        location: 'ফিশারি ঘাট টার্মিনাল',
        verificationBadge: 'verified',
        totalLotsCount: 9,
        totalVolumeKg: 12400,
        qualityRating: 4.8,
        primarySpecies: ['রূপচাঁদা', 'লবস্টার', 'কোরাল মাছ', 'টুনা'],
        joinedDate: '2025-12-05'
      },
      {
        id: 'SUP-003',
        farmerName: 'নুরুল ইসলাম (ন্যাচারাল ঘের প্রজেক্ট)',
        type: 'ঘের মালিক',
        phone: '01918-445566',
        district: 'সাতক্ষীরা',
        location: 'শ্যামনগর সুন্দরবন বেল্ট',
        verificationBadge: 'verified',
        totalLotsCount: 11,
        totalVolumeKg: 6200,
        qualityRating: 4.9,
        primarySpecies: ['এক্সপোর্ট বাগদা চিংড়ি', 'হরিণা চিংড়ি'],
        joinedDate: '2026-01-15'
      },
      {
        id: 'SUP-004',
        farmerName: 'অসিত কুমার দাস (বিল মৎস্যজীবী)',
        type: 'স্বতন্ত্র মাছ চাষী',
        phone: '01723-889900',
        district: 'নাটোর',
        location: 'সিংড়া চলনবিল ঘাট',
        verificationBadge: 'verified',
        totalLotsCount: 7,
        totalVolumeKg: 3800,
        qualityRating: 4.7,
        primarySpecies: ['চলনবিলের পাবদা', 'শিং-মাগুর', 'দেশি ট্যাংরা'],
        joinedDate: '2026-02-20'
      },
      {
        id: 'SUP-005',
        farmerName: 'কাদের মিয়া (মেঘনা মৎস্য সমবায়)',
        type: 'জেলে সমবায়',
        phone: '01812-776655',
        district: 'ভৈরব',
        location: 'ভৈরব মেঘনা নদী ঘাট',
        verificationBadge: 'provisional',
        totalLotsCount: 3,
        totalVolumeKg: 1950,
        qualityRating: 4.5,
        primarySpecies: ['নদীর বোয়াল', 'আইড় মাছ', 'চিতল'],
        joinedDate: '2026-06-12'
      }
    ];

    // Merge any live submissions from /sell
    lots.forEach((lot) => {
      if (!baseSuppliers.some((s) => s.farmerName.toLowerCase() === lot.farmerName.toLowerCase())) {
        baseSuppliers.push({
          id: `SUP-${Date.now().toString().slice(-4)}`,
          farmerName: lot.farmerName,
          type: 'স্বতন্ত্র মাছ চাষী',
          phone: lot.phone,
          district: lot.district,
          location: lot.location,
          verificationBadge: lot.verificationStatus === 'verified' ? 'verified' : 'new',
          totalLotsCount: 1,
          totalVolumeKg: lot.quantity || 0,
          qualityRating: 4.6,
          primarySpecies: [lot.productName],
          joinedDate: lot.createdAt ? lot.createdAt.split('T')[0] : '2026-09-15'
        });
      }
    });

    setSuppliers(baseSuppliers);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalSuppliersCount = suppliers.length;
  const verifiedCount = suppliers.filter((s) => s.verificationBadge === 'verified').length;
  const totalSupplyVolume = suppliers.reduce((acc, s) => acc + s.totalVolumeKg, 0);

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm);
    const matchesDistrict = districtFilter === 'all' || s.district === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  const handleOpenLots = (supplier: SupplierProfile) => {
    const allLots = adminService.getSellerLots();
    const related = allLots.filter(
      (l) => l.farmerName.toLowerCase().trim() === supplier.farmerName.toLowerCase().trim()
    );
    setSelectedSupplierLots({ supplier, lots: related });
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplierForm.farmerName) return;

    const newProfile: SupplierProfile = {
      id: `SUP-${Date.now().toString().slice(-4)}`,
      farmerName: newSupplierForm.farmerName,
      type: newSupplierForm.type,
      phone: newSupplierForm.phone,
      district: newSupplierForm.district,
      location: newSupplierForm.location,
      verificationBadge: newSupplierForm.verificationBadge,
      totalLotsCount: 0,
      totalVolumeKg: 0,
      qualityRating: 5.0,
      primarySpecies: newSupplierForm.primarySpecies.split(',').map((s) => s.trim()),
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setSuppliers([newProfile, ...suppliers]);
    setIsAddModalOpen(false);
    adminService.logAction('নতুন ঘাট সরবরাহকারী যুক্ত', 'seller_lot', newSupplierForm.farmerName);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serifBangla flex items-center gap-2.5">
            <Anchor className="w-7 h-7 text-blue-600" />
            জেলে ও ঘাট সরবরাহকারী নেটওয়ার্ক
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            নিবন্ধিত জেলে সমবায়, ট্রলার মালিক ও মাছ খামারিদের তথ্যভাণ্ডার
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          নতুন সরবরাহকারী যুক্ত করুন
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">নিবন্ধিত সরবরাহকারী</span>
            <Anchor className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1 font-bangla">{totalSuppliersCount} জন/সমবায়</p>
          <span className="text-[11px] text-slate-400">৭টি প্রধান মাছ আহরণ অঞ্চল</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">ফিল্ড ভেরিফাইড</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-emerald-700 mt-1 font-bangla">{verifiedCount} জন</p>
          <span className="text-[11px] text-slate-400">মাঠ পর্যায়ে যাচাইকৃত</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">মোট আহরণ ভলিউম</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1 font-bangla">{(totalSupplyVolume / 1000).toFixed(1)} টন</p>
          <span className="text-[11px] text-slate-400">{totalSupplyVolume.toLocaleString('bn-BD')} কেজি সরবরাহ</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">গড় কোয়ালিটি স্কোর</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold text-amber-600 mt-1 font-bangla">৪.৮ / ৫.০</p>
          <span className="text-[11px] text-slate-400">তাজাত্ব ও কোল্ড চেইন মান</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="জেলে সমবায়, ঘাট বা মোবাইল নম্বর দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
          >
            <option value="all">সকল জেলা ও উপকূল</option>
            <option value="চাঁদপুর">চাঁদপুর (পদ্মা-মেঘনা)</option>
            <option value="কক্সবাজার">কক্সবাজার (গভীর সমুদ্র)</option>
            <option value="সাতক্ষীরা">সাতক্ষীরা (সুন্দরবন চিংড়ি)</option>
            <option value="নাটোর">নাটোর (চলনবিল)</option>
            <option value="ভৈরব">ভৈরব (মেঘনা নদী)</option>
            <option value="খুলনা">খুলনা (রূপসা ঘাট)</option>
          </select>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-mono text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-4 font-semibold">সরবরাহকারী / জেলেরা</th>
                <th className="py-3.5 px-4 font-semibold">আহরণ ঘাট ও জেলা</th>
                <th className="py-3.5 px-4 font-semibold">ভেরিফিকেশন মান</th>
                <th className="py-3.5 px-4 font-semibold">মোট লট ও ওজন</th>
                <th className="py-3.5 px-4 font-semibold">গুণগত রেটিং</th>
                <th className="py-3.5 px-4 font-semibold">প্রধান মাছের প্রজাতি</th>
                <th className="py-3.5 px-4 font-semibold text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSuppliers.map((sup) => (
                <tr key={sup.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Name & Type */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors flex items-center gap-2">
                      <Anchor className="w-4 h-4 text-blue-600 shrink-0" />
                      {sup.farmerName}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{sup.type}</div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <a href={`tel:${sup.phone}`} className="hover:text-blue-600">
                        {sup.phone}
                      </a>
                    </div>
                  </td>

                  {/* Ghat & Location */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      {sup.location}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 ml-4.5">
                      জেলা: <span className="text-slate-800 font-medium">{sup.district}</span>
                    </div>
                  </td>

                  {/* Verification Badge */}
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 w-fit ${
                        sup.verificationBadge === 'verified'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : sup.verificationBadge === 'provisional'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3" />
                      {sup.verificationBadge === 'verified' ? 'যাচাইকৃত পার্টনার' : 'প্রভিশনাল'}
                    </span>
                  </td>

                  {/* Lots & Volume */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">
                      {sup.totalLotsCount} টি লট
                    </div>
                    <div className="text-slate-500 text-[11px] font-medium mt-0.5">
                      মোট {sup.totalVolumeKg.toLocaleString('bn-BD')} কেজি
                    </div>
                  </td>

                  {/* Quality Rating */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 font-bold text-amber-600">
                      <Award className="w-3.5 h-3.5" />
                      {sup.qualityRating} / ৫.০
                    </div>
                  </td>

                  {/* Primary Species */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {sup.primarySpecies.map((species, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] text-slate-700 font-medium"
                        >
                          {species}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`https://wa.me/88${sup.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-medium transition-colors"
                      >
                        WhatsApp
                      </a>
                      <button
                        onClick={() => handleOpenLots(sup)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        লট হিস্ট্রি
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSuppliers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    কোনো সরবরাহকারীর তথ্য পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supplier Lots Modal */}
      {selectedSupplierLots && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-serifBangla flex items-center gap-2">
                  <Anchor className="w-5 h-5 text-blue-600" />
                  {selectedSupplierLots.supplier.farmerName}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  ঘাট: {selectedSupplierLots.supplier.location}, {selectedSupplierLots.supplier.district} ({selectedSupplierLots.supplier.phone})
                </p>
              </div>
              <button
                onClick={() => setSelectedSupplierLots(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="pt-4 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                সরবরাহকৃত মাছের লট তালিকা ({selectedSupplierLots.lots.length})
              </h3>

              {selectedSupplierLots.lots.length > 0 ? (
                <div className="space-y-3">
                  {selectedSupplierLots.lots.map((lot) => (
                    <div
                      key={lot.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-[11px] text-blue-600 font-semibold">{lot.id}</span>
                          <h4 className="font-bold text-slate-900 text-sm mt-0.5">{lot.productName}</h4>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-slate-200 shadow-xs">
                          {lot.verificationStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500 pt-1">
                        <div>
                          পরিমাণ: <span className="text-slate-900 font-semibold">{lot.quantity} {lot.unit}</span>
                        </div>
                        <div>
                          প্রত্যাশিত দর: <span className="text-slate-900 font-semibold">৳{lot.expectedPrice || 'আলোচনা সাপেক্ষে'}/কেজি</span>
                        </div>
                        <div>
                          তারিখ: <span className="text-slate-700 font-semibold">{lot.availabilityDate || 'তাত্ক্ষণিক'}</span>
                        </div>
                      </div>

                      {lot.inspectionNotes && (
                        <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                          ইন্সপেকশন নোট: {lot.inspectionNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 rounded-xl bg-slate-50 border border-slate-200">
                  বর্তমানে এই সরবরাহকারীর কোনো সক্রিয় লট সাবমিশন রেকর্ড করা নেই।
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-slate-200">
                <button
                  onClick={() => setSelectedSupplierLots(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Supplier */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 font-serifBangla flex items-center gap-2">
                <Anchor className="w-5 h-5 text-blue-600" />
                নতুন জেলে / সরবরাহকারী নিবন্ধন
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-3 pt-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">সরবরাহকারীর নাম / সমবায় *</label>
                <input
                  type="text"
                  required
                  value={newSupplierForm.farmerName}
                  onChange={(e) => setNewSupplierForm({ ...newSupplierForm, farmerName: e.target.value })}
                  placeholder="যেমন: মো: রফিকুল ইসলাম (ইলিশ সমবায়)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">সরবরাহকারী ধরন</label>
                  <select
                    value={newSupplierForm.type}
                    onChange={(e) => setNewSupplierForm({ ...newSupplierForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
                  >
                    <option value="জেলে সমবায়">জেলে সমবায়</option>
                    <option value="ঘের মালিক">ঘের মালিক</option>
                    <option value="ট্রলার কনসোর্টিয়াম">ট্রলার কনসোর্টিয়াম</option>
                    <option value="স্বতন্ত্র মাছ চাষী">স্বতন্ত্র মাছ চাষী</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">ভেরিফিকেশন স্ট্যাটাস</label>
                  <select
                    value={newSupplierForm.verificationBadge}
                    onChange={(e) => setNewSupplierForm({ ...newSupplierForm, verificationBadge: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
                  >
                    <option value="verified">যাচাইকৃত পার্টনার (Verified)</option>
                    <option value="provisional">প্রভিশনাল (Provisional)</option>
                    <option value="new">নতুন আবেদন (New)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={newSupplierForm.phone}
                    onChange={(e) => setNewSupplierForm({ ...newSupplierForm, phone: e.target.value })}
                    placeholder="017xxxxxxxx"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">আহরণ জেলা *</label>
                  <select
                    value={newSupplierForm.district}
                    onChange={(e) => setNewSupplierForm({ ...newSupplierForm, district: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
                  >
                    <option value="চাঁদপুর">চাঁদপুর</option>
                    <option value="কক্সবাজার">কক্সবাজার</option>
                    <option value="সাতক্ষীরা">সাতক্ষীরা</option>
                    <option value="খুলনা">খুলনা</option>
                    <option value="নাটোর">নাটোর</option>
                    <option value="ভৈরব">ভৈরব</option>
                    <option value="বরিশাল">বরিশাল</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">ঘাট বা হাবের নির্দিষ্ট অবস্থান *</label>
                <input
                  type="text"
                  required
                  value={newSupplierForm.location}
                  onChange={(e) => setNewSupplierForm({ ...newSupplierForm, location: e.target.value })}
                  placeholder="যেমন: বড়স্টেশন মোহনা ঘাট, চাঁদপুর"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">প্রধান আহরণযোগ্য মাছের প্রজাতি</label>
                <input
                  type="text"
                  value={newSupplierForm.primarySpecies}
                  onChange={(e) => setNewSupplierForm({ ...newSupplierForm, primarySpecies: e.target.value })}
                  placeholder="যেমন: পদ্মার রূপালী ইলিশ, পাঙ্গাশ"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs cursor-pointer transition-colors"
                >
                  সরবরাহকারী সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
