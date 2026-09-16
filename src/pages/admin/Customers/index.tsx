import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Building2,
  Phone,
  MapPin,
  Plus,
  ArrowUpRight,
  Filter,
  Sparkles,
  DollarSign,
  Package
} from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { BuyerOrder } from '../../../types/admin';

interface CustomerProfile {
  id: string;
  companyName: string;
  businessType: string;
  contactPerson: string;
  phone: string;
  email: string;
  deliveryLocation: string;
  tier: 'VIP' | 'Regular' | 'New';
  totalOrdersCount: number;
  totalVolumeKg: number;
  totalOrderValue: number;
  lastOrderDate: string;
  preferredFish: string[];
}

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCustomerOrders, setSelectedCustomerOrders] = useState<{
    customer: CustomerProfile;
    orders: BuyerOrder[];
  } | null>(null);

  // New customer modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    companyName: '',
    businessType: 'সুপারশপ চেইন',
    contactPerson: '',
    phone: '',
    email: '',
    deliveryLocation: '',
    tier: 'Regular' as 'VIP' | 'Regular' | 'New',
    preferredFish: 'ইলিশ, বাগদা চিংড়ি'
  });

  const loadData = () => {
    const orders = adminService.getBuyerOrders();

    // Group orders by companyName
    const companyMap = new Map<string, BuyerOrder[]>();
    orders.forEach((o) => {
      const name = o.companyName.trim();
      const existing = companyMap.get(name) || [];
      existing.push(o);
      companyMap.set(name, existing);
    });

    // Default corporate client profiles
    const baseProfiles: CustomerProfile[] = [
      {
        id: 'CUST-001',
        companyName: 'ইউনিমার্ট সুপারশপ (গুলশান ২ ব্রাঞ্চ)',
        businessType: 'সুপারশপ চেইন',
        contactPerson: 'তানভীর আহমেদ',
        phone: '01711-223344',
        email: 'procurement@unimart.com.bd',
        deliveryLocation: 'গুলশান ২, ঢাকা',
        tier: 'VIP',
        totalOrdersCount: 8,
        totalVolumeKg: 2850,
        totalOrderValue: 4617000,
        lastOrderDate: '2026-09-14',
        preferredFish: ['পদ্মার রূপালী ইলিশ', 'চলনবিলের পাবদা', 'গলদা চিংড়ি']
      },
      {
        id: 'CUST-002',
        companyName: 'রেডিসন ব্লু ঢাকা ওয়াটার গার্ডেন',
        businessType: '৫-স্টার হোটেল ও হসপিটালিটি',
        contactPerson: 'শেফ মাহবুবুল আলম',
        phone: '01819-887766',
        email: 'executive.chef@radissondhaka.com',
        deliveryLocation: 'বিমানবন্দর রোড, ঢাকা',
        tier: 'VIP',
        totalOrdersCount: 6,
        totalVolumeKg: 1200,
        totalOrderValue: 1850000,
        lastOrderDate: '2026-09-13',
        preferredFish: ['বাগদা চিংড়ি (16/20)', 'কোরাল মাছ', 'কক্সবাজার লবস্টার']
      },
      {
        id: 'CUST-003',
        companyName: 'স্বপ্ন সুপারশপ (বনানী আউটলেট)',
        businessType: 'সুপারশপ চেইন',
        contactPerson: 'ফারহান চৌধুরী',
        phone: '01912-334455',
        email: 'farhan@shwapno.net',
        deliveryLocation: 'তেজগাঁও সেন্ট্রাল ডিসি, ঢাকা',
        tier: 'Regular',
        totalOrdersCount: 4,
        totalVolumeKg: 1600,
        totalOrderValue: 1280000,
        lastOrderDate: '2026-09-15',
        preferredFish: ['চলনবিলের পাবদা', 'রুই মাছ', 'কাতলা']
      },
      {
        id: 'CUST-004',
        companyName: 'অ্যাগ্রো সি-ফুডস এক্সপোর্ট লিমিটেড',
        businessType: 'সি-ফুড এক্সপোর্টার',
        contactPerson: 'ইমতিয়াজ মোর্শেদ',
        phone: '01715-445566',
        email: 'imthiaz@agroseafoods.com',
        deliveryLocation: 'পতেঙ্গা ইপিজেড, চট্টগ্রাম',
        tier: 'VIP',
        totalOrdersCount: 3,
        totalVolumeKg: 6500,
        totalOrderValue: 6370000,
        lastOrderDate: '2026-09-10',
        preferredFish: ['কক্সবাজার রূপচাঁদা', 'ব্ল্যাক টাইগার চিংড়ি']
      }
    ];

    // Merge any dynamically created orders from unknown companies
    companyMap.forEach((compOrders, compName) => {
      if (!baseProfiles.some((p) => p.companyName.toLowerCase() === compName.toLowerCase())) {
        const latest = compOrders[0];
        const totalKg = compOrders.reduce((sum, o) => sum + (o.quantity || 0), 0);
        const totalVal = compOrders.reduce((sum, o) => sum + (o.totalEstimatedValue || 0), 0);
        baseProfiles.push({
          id: `CUST-${Date.now().toString().slice(-4)}`,
          companyName: compName,
          businessType: 'ইনস্টিটিউশনাল বায়ার',
          contactPerson: latest.contactPerson,
          phone: latest.phone,
          email: latest.email || 'procurement@client.com',
          deliveryLocation: latest.deliveryLocation,
          tier: 'New',
          totalOrdersCount: compOrders.length,
          totalVolumeKg: totalKg,
          totalOrderValue: totalVal,
          lastOrderDate: latest.createdAt ? latest.createdAt.split('T')[0] : '2026-09-15',
          preferredFish: [latest.productName]
        });
      }
    });

    setCustomers(baseProfiles);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalBuyers = customers.length;
  const vipBuyers = customers.filter((c) => c.tier === 'VIP').length;
  const totalVolumeSupplied = customers.reduce((acc, c) => acc + c.totalVolumeKg, 0);
  const totalCorporateValue = customers.reduce((acc, c) => acc + c.totalOrderValue, 0);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.deliveryLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || c.businessType.includes(typeFilter);
    return matchesSearch && matchesType;
  });

  const handleOpenCustomerOrders = (customer: CustomerProfile) => {
    const allOrders = adminService.getBuyerOrders();
    const related = allOrders.filter(
      (o) => o.companyName.toLowerCase().trim() === customer.companyName.toLowerCase().trim()
    );
    setSelectedCustomerOrders({ customer, orders: related });
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.companyName) return;

    const newProfile: CustomerProfile = {
      id: `CUST-${Date.now().toString().slice(-4)}`,
      companyName: newCustomerForm.companyName,
      businessType: newCustomerForm.businessType,
      contactPerson: newCustomerForm.contactPerson,
      phone: newCustomerForm.phone,
      email: newCustomerForm.email,
      deliveryLocation: newCustomerForm.deliveryLocation,
      tier: newCustomerForm.tier,
      totalOrdersCount: 0,
      totalVolumeKg: 0,
      totalOrderValue: 0,
      lastOrderDate: new Date().toISOString().split('T')[0],
      preferredFish: newCustomerForm.preferredFish.split(',').map((s) => s.trim())
    };

    setCustomers([newProfile, ...customers]);
    setIsAddModalOpen(false);
    adminService.logAction('নতুন করপোরেট বায়ার প্রোফাইল তৈরি', 'order', newCustomerForm.companyName);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Buyer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serifBangla flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-blue-600" />
            করপোরেট বায়ার ডিরেক্টরি
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            ক্লায়েন্ট প্রোফাইল, ব্যবসায়িক হিসাব ও ক্রয়াদেশের ইতিহাস
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          নতুন বায়ার যুক্ত করুন
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">মোট করপোরেট ক্লায়েন্ট</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1 font-bangla">{totalBuyers} টি প্রতিষ্ঠান</p>
          <span className="text-[11px] text-slate-400">সক্রিয় অংশীদার প্রতিষ্ঠান</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">ভিআইপি বায়ার</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold text-amber-600 mt-1 font-bangla">{vipBuyers} টি একাউন্ট</p>
          <span className="text-[11px] text-slate-400">মাসিক বাল্ক চুক্তিভুক্ত</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">মোট সরবরাহকৃত মাছ</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-emerald-700 mt-1 font-bangla">{(totalVolumeSupplied / 1000).toFixed(1)} টন</p>
          <span className="text-[11px] text-slate-400">{totalVolumeSupplied.toLocaleString('bn-BD')} কেজি ফ্রেশ মাছ</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">মোট লেনদেন মূল্য</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-blue-600 mt-1 font-bangla">৳{(totalCorporateValue / 100000).toFixed(1)} লাখ</p>
          <span className="text-[11px] text-slate-400">মোট ইনভয়েস মূল্য</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="কোম্পানি, প্রতিনিধি, ফোন বা লোকেশন দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
          >
            <option value="all">সব ধরনের প্রতিষ্ঠান</option>
            <option value="সুপারশপ">সুপারশপ চেইন</option>
            <option value="হোটেল">হোটেল ও হসপিটালিটি</option>
            <option value="এক্সপোর্টার">সি-ফুড এক্সপোর্টার</option>
            <option value="ইনস্টিটিউশনাল">ইনস্টিটিউশনাল বায়ার</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-mono text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-4 font-semibold">প্রতিষ্ঠানের নাম ও ধরন</th>
                <th className="py-3.5 px-4 font-semibold">যোগাযোগকারী ও ডেলিভারি</th>
                <th className="py-3.5 px-4 font-semibold">টায়ার (Tier)</th>
                <th className="py-3.5 px-4 font-semibold">মোট অর্ডার ও ভলিউম</th>
                <th className="py-3.5 px-4 font-semibold">মোট মূল্য (৳)</th>
                <th className="py-3.5 px-4 font-semibold">পছন্দের মাছ</th>
                <th className="py-3.5 px-4 font-semibold text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Company & Type */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                      {cust.companyName}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{cust.businessType}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">ID: {cust.id}</div>
                  </td>

                  {/* Contact & Location */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-800">{cust.contactPerson}</div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <a href={`tel:${cust.phone}`} className="hover:text-blue-600">
                        {cust.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {cust.deliveryLocation}
                    </div>
                  </td>

                  {/* Tier */}
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        cust.tier === 'VIP'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : cust.tier === 'Regular'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {cust.tier === 'VIP' ? '★ VIP ক্লায়েন্ট' : cust.tier === 'Regular' ? 'রেগুলার' : 'নতুন লিড'}
                    </span>
                  </td>

                  {/* Order count & volume */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">
                      {cust.totalOrdersCount} টি অর্ডার
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      মোট {cust.totalVolumeKg.toLocaleString('bn-BD')} কেজি
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      সর্বশেষ: {cust.lastOrderDate}
                    </div>
                  </td>

                  {/* Order Value */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900 text-sm font-bangla">
                      ৳{cust.totalOrderValue.toLocaleString('bn-BD')}
                    </div>
                  </td>

                  {/* Preferred fish tags */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {cust.preferredFish.map((fish, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] text-slate-700 font-medium"
                        >
                          {fish}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenCustomerOrders(cust)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        অর্ডার হিস্ট্রি
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    কোনো বায়ারের তথ্য খুঁজে পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Orders History Modal / Drawer */}
      {selectedCustomerOrders && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-serifBangla flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  {selectedCustomerOrders.customer.companyName}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  প্রতিনিধি: {selectedCustomerOrders.customer.contactPerson} ({selectedCustomerOrders.customer.phone})
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomerOrders(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="pt-4 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                পূর্ববর্তী চাহিদাপত্র ও ক্রয়াদেশের তালিকা ({selectedCustomerOrders.orders.length})
              </h3>

              {selectedCustomerOrders.orders.length > 0 ? (
                <div className="space-y-3">
                  {selectedCustomerOrders.orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-[11px] text-blue-600 font-semibold">{ord.id}</span>
                          <h4 className="font-bold text-slate-900 text-sm mt-0.5">{ord.productName}</h4>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-slate-200 shadow-xs">
                          {ord.orderStatus || 'pending'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500 pt-1">
                        <div>
                          পরিমাণ: <span className="text-slate-900 font-semibold">{ord.quantity} {ord.unit}</span>
                        </div>
                        <div>
                          কোটেশন: <span className="text-slate-900 font-semibold">৳{ord.quotedPricePerUnit || 'অনির্ধারিত'}/কেজি</span>
                        </div>
                        <div>
                          মোট মূল্য: <span className="text-blue-600 font-bold">৳{ord.totalEstimatedValue?.toLocaleString('bn-BD') || '—'}</span>
                        </div>
                      </div>

                      {ord.specification && (
                        <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                          স্পেসিফিকেশন: {ord.specification}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 rounded-xl bg-slate-50 border border-slate-200">
                  বর্তমানে এই বায়ারের কোনো অ্যাক্টিভ ওয়েব রিকোয়ারমেন্ট রেকর্ড করা নেই।
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-slate-200">
                <button
                  onClick={() => setSelectedCustomerOrders(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Buyer */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 font-serifBangla flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                নতুন করপোরেট বায়ার প্রোফাইল তৈরি
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3 pt-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">কোম্পানির নাম *</label>
                <input
                  type="text"
                  required
                  value={newCustomerForm.companyName}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, companyName: e.target.value })}
                  placeholder="যেমন: বেঙ্গল মিট ও সি-ফুড লিমিটেড"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">ব্যবসার ধরন</label>
                  <select
                    value={newCustomerForm.businessType}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, businessType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
                  >
                    <option value="সুপারশপ চেইন">সুপারশপ চেইন</option>
                    <option value="৫-স্টার হোটেল ও হসপিটালিটি">হোটেল ও হসপিটালিটি</option>
                    <option value="সি-ফুড এক্সপোর্টার">সি-ফুড এক্সপোর্টার</option>
                    <option value="ক্যাটারিং ও ফুড সার্ভিস">ক্যাটারিং ও ফুড সার্ভিস</option>
                    <option value="ইনস্টিটিউশনাল বায়ার">ইনস্টিটিউশনাল বায়ার</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">ক্লায়েন্ট টায়ার</label>
                  <select
                    value={newCustomerForm.tier}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, tier: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
                  >
                    <option value="VIP">VIP বায়ার</option>
                    <option value="Regular">রেগুলার ক্লায়েন্ট</option>
                    <option value="New">নতুন লিড / প্রোস্পেক্ট</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">যোগাযোগকারী প্রতিনিধি *</label>
                  <input
                    type="text"
                    required
                    value={newCustomerForm.contactPerson}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, contactPerson: e.target.value })}
                    placeholder="নাম ও পদবি"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={newCustomerForm.phone}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                    placeholder="017xxxxxxxx"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">ইমেইল এড্রেস</label>
                <input
                  type="email"
                  value={newCustomerForm.email}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                  placeholder="procurement@company.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">ডেলিভারি গন্তব্য / ওয়্যারহাউজ *</label>
                <input
                  type="text"
                  required
                  value={newCustomerForm.deliveryLocation}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, deliveryLocation: e.target.value })}
                  placeholder="যেমন: তেজগাঁও সেন্ট্রাল ওয়্যারহাউজ, ঢাকা"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">পছন্দের মাছের তালিকা (কমা দিয়ে লিখুন)</label>
                <input
                  type="text"
                  value={newCustomerForm.preferredFish}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, preferredFish: e.target.value })}
                  placeholder="যেমন: ইলিশ, পাবদা, বাগদা চিংড়ি"
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
                  বায়ার সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
