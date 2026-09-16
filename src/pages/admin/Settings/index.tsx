import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Building2,
  Phone,
  Mail,
  MapPin,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { PlatformSettings } from '../../../types/admin';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSettings>({
    platformName: 'গাংচিল — পাইকারি মাছের বাণিজ্যিক প্ল্যাটফর্ম',
    supportPhone: '+880 1711-234567',
    supportEmail: 'support@gangchill.com',
    headOfficeAddress: 'হাউস ১২, রোড ৯, ব্লক সি, গুলশান ১, ঢাকা-১২১২',
    hubLocations: 'চাঁদপুর বড়স্টেশন, কক্সবাজার ফিশারি ঘাট, খুলনা রূপসা, নাটোর চলনবিল, ভৈরব মেঘনা ঘাট',
    defaultMoqKg: 50,
    coldChainEnabled: true,
    allowPublicSellerSubmissions: true,
    allowPublicInvestorInterest: true,
    maintenanceMode: false
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const loaded = adminService.getSettings();
    if (loaded) {
      setSettings(loaded);
    }
  }, []);

  const handleChange = (field: keyof PlatformSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    adminService.saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serifBangla flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-blue-600" />
            প্ল্যাটফর্ম সেটিংস ও কনফিগারেশন
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            কোম্পানির প্রাতিষ্ঠানিক তথ্য, ঘাট হাব ও সাপ্লাই চেইন কনফিগারেশন
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <Save className="w-4 h-4" />
          পরিবর্তন সংরক্ষণ করুন
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>প্ল্যাটফর্ম সেটিংস সফলভাবে আপডেট ও সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. General Info */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            ১. প্রাতিষ্ঠানিক পরিচিতি ও যোগাযোগ
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">প্ল্যাটফর্মের অফিশিয়াল নাম</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => handleChange('platformName', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-medium mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  কাস্টমার সাপোর্ট ও হেল্পলাইন
                </label>
                <input
                  type="text"
                  value={settings.supportPhone}
                  onChange={(e) => handleChange('supportPhone', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  অফিশিয়াল সাপোর্ট ইমেইল
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                প্রধান কার্যালয়ের ঠিকানা
              </label>
              <input
                type="text"
                value={settings.headOfficeAddress}
                onChange={(e) => handleChange('headOfficeAddress', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">সক্রিয় হাব ও ঘাটের অবস্থান (কমা দিয়ে লিখুন)</label>
              <input
                type="text"
                value={settings.hubLocations}
                onChange={(e) => handleChange('hubLocations', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 2. Supply Chain & Operational Business Rules */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            ২. সাপ্লাই চেইন ও বিজনেস পলিসি
          </h2>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  ডিফল্ট ন্যূনতম ক্রয়াদেশ (MOQ - কেজি)
                </label>
                <input
                  type="number"
                  min={1}
                  value={settings.defaultMoqKg}
                  onChange={(e) => handleChange('defaultMoqKg', Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  নতুন মাছের স্টক তৈরি করার সময় এই ভ্যালুটি স্বয়ংক্রিয়ভাবে ডিফল্ট হবে
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">কোল্ড চেইন তাপমাত্রা ট্র্যাকিং</h4>
                  <p className="text-[11px] text-slate-500">রেফার ভ্যানের সেন্সর ডাটা ইনভেন্টরিতে সক্রিয় রাখা</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.coldChainEnabled}
                  onChange={(e) => handleChange('coldChainEnabled', e.target.checked)}
                  className="w-5 h-5 rounded-sm bg-white border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">ঘাট প্ল্যাটফর্ম সাবমিশন (/sell)</h4>
                  <p className="text-[11px] text-slate-500">ওয়েবসাইট থেকে জেলে ও খামারিদের সরাসরি লট জমা রাখা</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowPublicSellerSubmissions}
                  onChange={(e) => handleChange('allowPublicSellerSubmissions', e.target.checked)}
                  className="w-5 h-5 rounded-sm bg-white border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">বিনিয়োগ আবেদন মডিউল (/invest)</h4>
                  <p className="text-[11px] text-slate-500">মৎস্য তহবিল প্রকল্পে পাবলিক আবেদন গ্রহণ সক্রিয় রাখা</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowPublicInvestorInterest}
                  onChange={(e) => handleChange('allowPublicInvestorInterest', e.target.checked)}
                  className="w-5 h-5 rounded-sm bg-white border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Maintenance Mode Warning */}
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  মেইনটেন্যান্স মোড (Maintenance Mode)
                </h4>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  সক্রিয় করলে সাধারণ ভিজিটরদের কাছে সাময়িক রক্ষণাবেক্ষণের বার্তা প্রদর্শিত হবে
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                className="w-5 h-5 rounded-sm bg-white border-rose-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3. Single System Administrator Profile */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              ৩. সিস্টেম অ্যাডমিন প্রোফাইল
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              একক অ্যাডমিন
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                কাহ
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">মোঃ কামরুল হাসান</h4>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
                    প্রধান অ্যাডমিনিস্ট্রেটর
                  </span>
                </div>
                <p className="text-slate-600 text-xs">admin@gangchill.com • ০১৭১২-৩৪৫৬৭৮</p>
                <p className="text-[11px] text-slate-400">গাংচিল প্ল্যাটফর্মের একমাত্র অনুমোদিত প্রশাসনিক নিয়ন্ত্রক অ্যাকাউন্ট</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                সক্রিয় সেশন
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Save className="w-4 h-4" />
            সেটিংস পরিবর্তন নিশ্চিত করুন
          </button>
        </div>
      </form>
    </div>
  );
};
